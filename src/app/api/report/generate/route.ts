import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { reports } = await req.json();

    const prompt = `
      Buatkan laporan project berdasarkan data commit berikut:

      ${JSON.stringify(reports, null, 2)}

      Format laporan:
      - Ringkasan umum
      - Aktivitas utama
      - Perubahan kode penting
      - Developer yang dominan
      - Kesimpulan teknis

      Gunakan bahasa Indonesia profesional.
    `;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const result = completion.choices[0].message?.content ?? "";

    return NextResponse.json({ report: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
