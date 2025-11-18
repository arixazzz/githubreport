/* eslint-disable @next/next/no-img-element */
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatFileName } from "@/lib/utils";
import { Eye, File } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import ImageCropModal from "../imageCropModal";
import { toast } from "@/lib/myToast";

type FileAcceptType =
  | "image/*"
  | "image/png"
  | "image/jpeg"
  | "image/jpg"
  | "image/gif"
  | "application/pdf"
  | "application/msword" // .doc
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
  | "application/vnd.ms-excel" // .xls
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
  | "text/plain"
  | ".csv"
  | ".zip"
  | ".rar"
  | ".txt"
  | ".json"
  | ".xml"
  | ".mp4"
  | ".mp3"
  | ".wav";

type CustomFormFileFotoProfileProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: Array<FileAcceptType>;
  maxSize?: number; // in bytes
  allowedExtensions?: string[];
  pickerType?: "google";
  enableCrop?: boolean; // New prop to enable cropping
  cropAspectRatio?: number | null; // Aspect ratio for crop (default: 1 for square, null for free)
};

export function CustomFormFileFotoProfile<T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "Pilih File",
  description,
  className,
  required = false,
  disabled = false,
  accept,
  maxSize = 20 * 1024 * 1024,
  allowedExtensions,
  pickerType,
  enableCrop = false,
  cropAspectRatio = 1,
}: CustomFormFileFotoProfileProps<T>) {
  const { control, setValue, watch } = useFormContext<T>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fieldValue = watch(name);

  // Crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<string | null>(
    null
  );
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingOnChange, setPendingOnChange] = useState<
    ((value: any) => void) | null
  >(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const validateFile = (file: File): string => {
    if (file.size > maxSize) {
      return `Ukuran file maksimal ${formatFileSize(maxSize)}`;
    }

    if (allowedExtensions) {
      const extension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        return `Format tidak didukung. Hanya ${allowedExtensions.join(", ")}`;
      }
    }

    return "";
  };

  const isImageFile = (file: File): boolean => {
    return (
      file.type.startsWith("image/") &&
      [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ].includes(file.type)
    );
  };

  const shouldCropFile = (file: File): boolean => {
    return enableCrop && isImageFile(file);
  };

  const startCropProcess = (file: File, onChange: (value: any) => void) => {
    setPendingFile(file);
    setPendingOnChange(() => onChange);
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImageToCrop(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile: File) => {
    if (pendingOnChange) {
      pendingOnChange(croppedFile);
    }
    setCropModalOpen(false);
    setCurrentImageToCrop(null);
    setPendingFile(null);
    setPendingOnChange(null);
  };

  const handleCropCancel = () => {
    // For default crop behavior, still save the original file
    if (pendingFile && pendingOnChange) {
      pendingOnChange(pendingFile);
    }

    setCropModalOpen(false);
    setCurrentImageToCrop(null);
    setPendingFile(null);
    setPendingOnChange(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    // Check if we should crop this file
    if (shouldCropFile(file)) {
      startCropProcess(file, onChange);
    } else {
      onChange(file);
    }
  };

  const handleRemoveFile = (onChange: (value: any) => void) => {
    setValue(name, null as any);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropExistingFile = (
    currentFile: File,
    onChange: (value: any) => void
  ) => {
    if (currentFile && isImageFile(currentFile)) {
      startCropProcess(currentFile, onChange);
    }
  };

  const handleGoogleDriveFile = (
    files: File[],
    onChange: (value: any) => void
  ) => {
    const file = files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    // Check if we should crop this file
    if (shouldCropFile(file)) {
      startCropProcess(file, onChange);
    } else {
      onChange(file);
    }
  };

  const renderFilePreview = () => {
    if (typeof fieldValue === "string" && fieldValue) {
      // URL string - existing file
      return (
        <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded-md">
          <File className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate flex-1">
            {formatFileName(fieldValue)}
          </span>
          <Link
            href={fieldValue}
            target="_blank"
            className="p-1 hover:bg-gray-100 rounded-sm"
          >
            <Eye className="text-muted-foreground h-4 w-4" />
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="flex flex-col  items-start">
              <div className="flex justify-center flex-col gap-2">
                <div className="w-36 h-40 flex flex-col items-center justify-center border rounded-xl bg-gray-100 overflow-hidden">
                  {field.value ? (
                    // Jika sudah ada file → tampilkan preview
                    <img
                      src={
                        typeof field.value === "string"
                          ? field.value // kalau dari URL (misalnya edit form)
                          : URL.createObjectURL(field.value) // kalau dari File upload
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Jika belum ada file → tampilkan avatar default
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                  )}

                  {/* Hidden input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept?.join(",")}
                    disabled={disabled}
                    onChange={(e) => handleFileChange(e, field.onChange)}
                    className="hidden"
                  />
                </div>
                {/* Tombol Pilih Gambar */}
                <button
                  type="button"
                  onClick={() => !disabled && fileInputRef.current?.click()}
                  className=" text-primary text-sm font-medium hover:underline mt-[] px-2 py-0.5 rounded"
                  disabled={disabled}
                >
                  Pilih Gambar
                </button>
                {/* Box Upload */}
              </div>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />

          {/* Crop Modal */}
          {currentImageToCrop && (
            <ImageCropModal
              open={cropModalOpen}
              imageUrl={currentImageToCrop}
              onClose={handleCropCancel}
              onCropComplete={handleCropComplete}
              aspectRatio={cropAspectRatio}
            />
          )}
        </FormItem>
      )}
    />
  );
}

// Updated ImageCropModal interface to support aspectRatio
interface ImageCropModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (file: File) => void;
  aspectRatio?: number | null;
}

// Export the component with crop support
export default CustomFormFileFotoProfile;
