import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface JudgeRequestBody {
  /** Raw code diffs / commit messages combined */
  codeContext: string;
  summary: string;
  projectTitle?: string;
}

interface AspectScore {
  score: number;
  reason: string;
}

interface JudgeResult {
  relevance: AspectScore;
  accuracy: AspectScore;
  completeness: AspectScore;
  overall: number;
  feedback: string;
}

const JUDGE_MODEL = "openai/gpt-oss-120b";

const JUDGE_SYSTEM_PROMPT = `Anda adalah evaluator AI yang sangat ahli dalam code review dan menilai kualitas ringkasan (summary) aktivitas developer berdasarkan perubahan kode (code diff) nyata dari commit GitHub.

Anda akan diberikan:
1. Perubahan kode aktual (git diff / patch) dari satu atau beberapa commit
2. Ringkasan yang dihasilkan model AI untuk menjelaskan perubahan tersebut

Evaluasi summary berdasarkan 3 aspek berikut dengan mempertimbangkan isi KODE yang berubah, bukan hanya pesan commitnya:

1. **Relevansi (Relevance)** — Apakah summary membahas perubahan yang benar-benar terjadi di kode? Apakah tidak ada hal yang disebutkan tapi tidak ada di diff?
2. **Kebenaran (Accuracy)** — Apakah penjelasan teknis dalam summary sesuai dengan apa yang sebenarnya diubah di kode? Apakah tidak ada informasi yang keliru atau menyesatkan?
3. **Kelengkapan (Completeness)** — Apakah summary mencakup semua perubahan signifikan yang ada di diff? Apakah ada perubahan penting yang terlewat?

Berikan skor 1-10 untuk setiap aspek (1 = sangat buruk, 10 = sempurna) beserta alasan singkat dan spesifik dalam Bahasa Indonesia.

Jawab HANYA dalam format JSON berikut, tanpa teks tambahan apapun:
{
  "relevance": { "score": <number 1-10>, "reason": "<alasan singkat dan spesifik>" },
  "accuracy": { "score": <number 1-10>, "reason": "<alasan singkat dan spesifik>" },
  "completeness": { "score": <number 1-10>, "reason": "<alasan singkat dan spesifik>" },
  "overall": <rata-rata 1 desimal>,
  "feedback": "<satu paragraf feedback keseluruhan berdasarkan analisis kode>"
}`;

export async function POST(req: NextRequest) {
  try {
    const body: JudgeRequestBody = await req.json();

    const { codeContext, summary, projectTitle } = body;

    if (
      !codeContext ||
      typeof codeContext !== "string" ||
      codeContext.trim() === ""
    ) {
      return NextResponse.json(
        { error: "codeContext (perubahan kode) tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (!summary || typeof summary !== "string" || summary.trim() === "") {
      return NextResponse.json(
        { error: "summary tidak boleh kosong" },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Server configuration error: AI Key missing" },
        { status: 500 }
      );
    }

    const userContent = `${projectTitle ? `Proyek: ${projectTitle}\n\n` : ""}Perubahan Kode (Code Diff):\n\`\`\`\n${codeContext.trim()}\n\`\`\`\n\n---\n\nRingkasan (Summary) yang akan dievaluasi:\n${summary.trim()}`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: JUDGE_MODEL,
          messages: [
            { role: "system", content: JUDGE_SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
          temperature: 0.2,
          max_tokens: 1024,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!groqRes.ok) {
      const errorData = await groqRes.json().catch(() => ({}));
      console.error("[model-test/judge] Groq API Error:", errorData);
      return NextResponse.json(
        {
          error: `Judge API Error: ${errorData?.error?.message || "Failed to call judge model"}`,
        },
        { status: groqRes.status }
      );
    }

    const groqJson = await groqRes.json();
    const rawContent = groqJson.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "Judge model did not return a response" },
        { status: 500 }
      );
    }

    let result: JudgeResult;
    try {
      result = JSON.parse(rawContent);
    } catch {
      console.error(
        "[model-test/judge] Failed to parse JSON from judge:",
        rawContent
      );
      return NextResponse.json(
        { error: "Judge model returned an invalid response format" },
        { status: 500 }
      );
    }

    // Validate expected fields
    if (
      !result.relevance?.score ||
      !result.accuracy?.score ||
      !result.completeness?.score
    ) {
      return NextResponse.json(
        { error: "Judge model response is incomplete" },
        { status: 500 }
      );
    }

    // Recalculate overall to ensure consistency
    const overall =
      Math.round(
        ((result.relevance.score +
          result.accuracy.score +
          result.completeness.score) /
          3) *
          10
      ) / 10;

    return NextResponse.json(
      {
        model: JUDGE_MODEL,
        relevance: result.relevance,
        accuracy: result.accuracy,
        completeness: result.completeness,
        overall,
        feedback: result.feedback,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[model-test/judge] Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
