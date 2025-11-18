import React, { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import getCroppedImg from "@/lib/cropImageUtil";

interface ImageCropModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (file: File) => void;
  aspectRatio?: number | null; // default selection from parent (optional)
  currentIndex?: number;
  totalImages?: number;
}

type AspectMode = "preset" | "custom" | "free";

const PRESETS = [
  { label: "Square (1:1)", value: 1 },
  { label: "Portrait (3:4)", value: 3 / 4 },
  { label: "Landscape (4:3)", value: 4 / 3 },
  { label: "Widescreen (16:9)", value: 16 / 9 },
] as const;

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  imageUrl,
  onClose,
  onCropComplete,
  aspectRatio = 1, // default awal
  currentIndex = 1,
  totalImages = 1,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // mode & nilai rasio
  const initialMode: AspectMode = aspectRatio === null ? "free" : "preset";
  const [aspectMode, setAspectMode] = useState<AspectMode>(initialMode);

  // nilai preset yang dipilih
  const [presetAspect, setPresetAspect] = useState<number | null>(
    typeof aspectRatio === "number" ? aspectRatio : 1
  );
  // nilai custom via slider (0.5 s/d 3.0). Default ke 1
  const [customAspect, setCustomAspect] = useState<number>(1);

  const [addWhiteBackground, setAddWhiteBackground] = useState(false);

  const effectiveAspect: number | undefined = useMemo(() => {
    if (aspectMode === "free") return undefined; // free crop: jangan kirim aspect
    if (aspectMode === "custom") return customAspect;
    return presetAspect ?? 1;
  }, [aspectMode, customAspect, presetAspect]);

  const onCropDone = useCallback((_: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        addWhiteBackground
      );

      const timestamp = Date.now();
      const file = new File([croppedBlob], `cropped-image-${timestamp}.jpg`, {
        type: "image/jpeg",
        lastModified: timestamp,
      });

      // reset state ringan untuk next image
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);

      onCropComplete(file);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsProcessing(false);
    setAddWhiteBackground(false);

    // reset mode & rasio ke default awal dari props
    setAspectMode(initialMode);
    setPresetAspect(typeof aspectRatio === "number" ? aspectRatio : 1);
    setCustomAspect(1);

    onClose();
  };

  // select handler: "preset:<value>", "custom", "free"
  const handleAspectSelect = (val: string) => {
    if (val === "free") {
      setAspectMode("free");
    } else if (val === "custom") {
      setAspectMode("custom");
    } else if (val.startsWith("preset:")) {
      const num = parseFloat(val.replace("preset:", ""));
      setPresetAspect(Number.isFinite(num) ? num : 1);
      setAspectMode("preset");
    }
    // reset posisi saat ganti rasio
    setCrop({ x: 0, y: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Crop Gambar{" "}
            {totalImages > 1 && `(${currentIndex} dari ${totalImages})`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Aspect controls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Aspect Mode:</span>
              <Select
                value={
                  aspectMode === "free"
                    ? "free"
                    : aspectMode === "custom"
                      ? "custom"
                      : `preset:${presetAspect}`
                }
                onValueChange={handleAspectSelect}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Pilih aspect" />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p.label} value={`preset:${p.value}`}>
                      {p.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom (slider)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {aspectMode === "custom" && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-28">
                  Custom Ratio
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.01}
                  value={customAspect}
                  onChange={(e) => setCustomAspect(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <div className="w-24 text-sm tabular-nums text-right">
                  {customAspect.toFixed(2)} : 1
                </div>
              </div>
            )}
          </div>

          {/* White Background Option */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Background:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addWhiteBackground}
                onChange={(e) => setAddWhiteBackground(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Tambah background putih</span>
            </label>
          </div>

          {/* Cropper */}
          <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              // kirim aspect hanya jika bukan free
              {...(typeof effectiveAspect === "number"
                ? { aspect: effectiveAspect }
                : {})}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropDone}
              showGrid={true}
              restrictPosition={false}
            />
          </div>

          {/* Zoom control */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Zoom:</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground">
              {zoom.toFixed(1)}x
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            {totalImages > 1 && `${currentIndex} dari ${totalImages} gambar`}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isProcessing}
              type="button"
            >
              Batal
            </Button>
            <Button
              onClick={handleCrop}
              disabled={!croppedAreaPixels || isProcessing}
              type="button"
            >
              {isProcessing
                ? "Memproses..."
                : totalImages > 1 && currentIndex < totalImages
                  ? "Selanjutnya"
                  : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropModal;
