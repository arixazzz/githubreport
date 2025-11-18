"use client";

import NextImage, { ImageProps } from "next/image";
import { PhotoView } from "react-photo-view";

type ZoomableImageProps = ImageProps & {
  // Tambahan props opsional kalau perlu
  className?: string;
};

export function Image({ src, alt, className, ...rest }: ZoomableImageProps) {
  return (
    <PhotoView src={typeof src === "string" ? src : (src as any).src}>
      <NextImage
        src={src}
        alt={alt}
        className={`cursor-pointer ${className ?? ""}`}
        {...rest}
      />
    </PhotoView>
  );
}
