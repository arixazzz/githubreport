"use client";

import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { Button } from "../ui/button";
import { Delete, Undo } from "lucide-react";
import { Image } from "./image";

type Stroke = ReturnType<SignaturePad["toData"]>[number];

export type SignatureBoxProps = {
  onSaved?: (payload: {
    imageUrl: string;
    strokes: Stroke[];
    blob: File;
  }) => void;
  lineWidth?: number;
  valueString?: string;
};

export default function SignatureBox({
  onSaved,
  lineWidth = 2.0,
  valueString,
}: SignatureBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const emittingRef = useRef(false);
  const onSavedRef = useRef<typeof onSaved>();

  // keep latest callback tanpa memicu re-init
  useEffect(() => {
    onSavedRef.current = onSaved;
  }, [onSaved]);

  // helper: setup ukuran + restore strokes aman
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const parent = containerRef.current;
    const pad = padRef.current;
    if (!canvas || !parent || !pad) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const width = parent.clientWidth;
    const height = Math.max(180, Math.round(width * 0.35));

    // backup strokes SEBELUM resize
    const backup = pad.toData();

    // set ukuran (ini akan clear konten)
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // reset transform lalu set DPR
    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // reset brush width
    pad.minWidth = Math.max(0.6, lineWidth * 0.6);
    pad.maxWidth = Math.max(2.4, lineWidth * 1.2);

    // restore strokes (jika ada)
    if (backup.length > 0) {
      pad.fromData(backup);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const pad = new SignaturePad(canvasRef.current, {
      minWidth: Math.max(0.6, lineWidth * 0.6),
      maxWidth: Math.max(2.4, lineWidth * 1.2),
      throttle: 16,
      backgroundColor: "rgba(0,0,0,0)",
      penColor: "#111",
    });

    const handleEnd = () => {
      if (pad.isEmpty()) return;
      if (emittingRef.current) return;
      emittingRef.current = true;

      const imageUrl = pad.toDataURL("image/webp", 0.92);
      const strokes = pad.toData();

      // konversi blob ke File dengan nama dan ekstensi
      canvasRef.current?.toBlob(
        (blob) => {
          if (blob && onSavedRef.current) {
            const file = new File([blob], `signature-${Date.now()}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            onSavedRef.current({
              imageUrl,
              strokes,
              blob: file, // kirim file yang punya ekstensi .webp
            });
          }

          requestAnimationFrame(() => {
            emittingRef.current = false;
          });
        },
        "image/webp",
        0.92
      );
    };

    pad.addEventListener("endStroke", handleEnd);
    padRef.current = pad;

    // inisiasi ukuran awal
    resizeCanvas();

    // resize listener (debounce ringan via rAF)
    let resizeId = 0 as unknown as number;
    const onResize = () => {
      cancelAnimationFrame(resizeId);
      resizeId = requestAnimationFrame(resizeCanvas);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      pad.removeEventListener("endStroke", handleEnd);
      padRef.current = null;
    };
    // ⚠️ penting: efek ini TIDAK bergantung pada onSaved
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineWidth]); // hanya re-init kalau lineWidth berubah

  const handleClear = () => padRef.current?.clear();

  const handleUndo = () => {
    const pad = padRef.current;
    if (!pad) return;
    const data = pad.toData();
    if (data.length === 0) return;
    data.pop();
    pad.fromData(data);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 w-full relative">
        <div
          ref={containerRef}
          className="w-full border rounded-lg overflow-hidden"
        >
          <canvas ref={canvasRef} className="touch-manipulation block" />
        </div>

        <div className="flex gap-2 absolute bottom-3 right-3">
          <Button
            onClick={handleClear}
            size="icon"
            type="button"
            className="rounded-full bg-red-500 hover:bg-red-600"
          >
            <Delete />
          </Button>
          <Button
            onClick={handleUndo}
            size="icon"
            type="button"
            className="rounded-full bg-gray-500 hover:bg-gray-600"
          >
            <Undo />
          </Button>
        </div>
      </div>
      {valueString && (
        <div className=" w-full object-cover mt-5 p-4 border">
          <Image
            src={
              typeof valueString != "string"
                ? URL.createObjectURL(valueString)
                : valueString
            }
            width={300}
            height={300}
            alt="tanda tangan"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
