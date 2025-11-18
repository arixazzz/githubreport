// lib/cropImageUtil.ts
import { Area } from "react-easy-crop";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // untuk CORS
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  addWhiteBackground: boolean = false
): Promise<Blob> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Context canvas tidak ditemukan");
    }

    // Set canvas size to crop area
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Add white background if requested
    if (addWhiteBackground) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        "image/jpeg",
        0.9 // Quality setting (0.9 = 90% quality)
      );
    });
  } catch (error) {
    console.error("Error in getCroppedImg:", error);
    throw error;
  }
}
