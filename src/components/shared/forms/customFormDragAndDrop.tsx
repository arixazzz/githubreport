"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Upload, File as FileIcon, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext, FieldValues, Path, PathValue } from "react-hook-form";
import Image from "next/image";
import { myAlert } from "@/lib/myAlert";
import ImageCropModal from "@/components/shared/imageCropModal";

type FileAcceptType =
  | "image/*"
  | "image/png"
  | "image/jpeg"
  | "image/jpg"
  | "image/gif"
  | "image/webp"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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

interface CustomFormDragAndDropProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  maxSize?: number;
  maxFiles?: number;
  acceptedFileTypes?: FileAcceptType[];
  className?: string;
  required?: boolean;
  handleDeleteFile?: (val: string) => void;
  previewType?: "card" | "thumbnail";
}

export function CustomFormDragAndDrop<T extends FieldValues = FieldValues>({
  name,
  label,
  description,
  maxSize = 5,
  maxFiles = 1,
  acceptedFileTypes = ["image/jpeg", "image/png"],
  className,
  required = false,
  handleDeleteFile,
  previewType = "card",
}: CustomFormDragAndDropProps<T>) {
  const { control, watch, setValue } = useFormContext<T>();
  const fieldValue = watch(name) as PathValue<T, Path<T>> | string | undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="capitalize">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <FileUploadControl
              value={field.value as unknown as File[]}
              onChange={(files) =>
                setValue(
                  field.name,
                  files as unknown as PathValue<T, Path<T>>,
                  { shouldValidate: true }
                )
              }
              maxSize={maxSize}
              maxFiles={maxFiles}
              acceptedFileTypes={acceptedFileTypes}
              fieldValue={
                typeof fieldValue === "string"
                  ? [fieldValue]
                  : Array.isArray(fieldValue)
                    ? fieldValue.filter((f: any) => typeof f === "string")
                    : undefined
              }
              handleDeleteFile={handleDeleteFile}
              previewType={previewType}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FileUploadControlProps {
  value?: File[];
  onChange: (files: File[]) => void;
  maxSize?: number;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  fieldValue?: string[];
  handleDeleteFile?: (url: string) => void;
  previewType?: "card" | "thumbnail";
}

const FileUploadControl: React.FC<FileUploadControlProps> = ({
  value = [],
  onChange,
  maxSize = 100,
  maxFiles = 1,
  acceptedFileTypes = ["image/jpeg", "image/png"],
  fieldValue,
  handleDeleteFile,
  previewType = "card",
}) => {
  const [files, setFiles] = useState<File[]>(value);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ====== state crop ======
  const [cropQueue, setCropQueue] = useState<File[]>([]);
  const [currentImageToCrop, setCurrentImageToCrop] = useState<string | null>(
    null
  );
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);

  const acceptedFileTypesString = acceptedFileTypes.join(",");

  // ====== Crop Logic ======
  const startCroppingQueue = (images: File[]) => {
    if (images.length === 0) return;
    setCropQueue(images);
    setCurrentCropIndex(0);
    loadImageForCrop(images[0]);
  };

  const loadImageForCrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImageToCrop(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile: File) => {
    const newFiles = [...files, croppedFile];
    setFiles(newFiles);
    onChange(newFiles as never);

    // lanjut ke image berikutnya
    const nextIndex = currentCropIndex + 1;
    if (nextIndex < cropQueue.length) {
      setCurrentCropIndex(nextIndex);
      loadImageForCrop(cropQueue[nextIndex]);
    } else {
      // selesai semua
      setCropModalOpen(false);
      setCurrentImageToCrop(null);
      setCropQueue([]);
      setCurrentCropIndex(0);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCurrentImageToCrop(null);
    setCropQueue([]);
    setCurrentCropIndex(0);
  };

  // ====== Preview fieldValue (server files) ======
  const renderFieldValue = () => {
    if (!fieldValue || fieldValue.length === 0) return null;

    if (previewType === "thumbnail") {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {fieldValue.map((url, index) => (
            <div key={index} className="relative">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 rounded-md object-cover"
                  width={96}
                  height={96}
                />
              </a>
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                onClick={() => handleDeleteFile?.(url)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-2">
        {fieldValue.map((url, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <p className="font-medium truncate max-w-xs">{url}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => window.open(url, "_blank")}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => handleDeleteFile?.(url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ====== Preview local files ======
  const renderLocalFiles = () => {
    if (files.length === 0) return null;

    if (previewType === "thumbnail") {
      return (
        <div className="flex flex-wrap gap-3 mt-4">
          {files.map((file, index) => {
            const fileUrl = URL.createObjectURL(file);
            return (
              <div key={`${file.name}-${index}`} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fileUrl}
                  alt={file.name}
                  className="w-24 h-24 rounded-md object-cover"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-2">
        {files.map((file, index) => {
          const fileUrl = URL.createObjectURL(file);
          return (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex items-center gap-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <p className="font-medium truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => window.open(fileUrl, "_blank")}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveFile(index)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ====== File Handling ======
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      const isValidType = acceptedFileTypes.includes(file.type);
      const isValidSize = file.size <= maxSize * 1024 * 1024;

      if (!isValidType) {
        myAlert.error("Invalid file type", file.name);
        continue;
      }
      if (!isValidSize) {
        myAlert.error("File too large", file.name);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      myAlert.error("Too many files");
      return;
    }

    const imageFiles = validFiles.filter(
      (file) =>
        file.type.startsWith("image/") &&
        !file.type.startsWith("image/gif") &&
        !file.type.startsWith("image/webp") &&
        acceptedFileTypes.includes(file.type)
    );

    if (imageFiles.length > 0) {
      startCroppingQueue(imageFiles);
    } else {
      const newFiles = [...files, ...validFiles];
      setFiles(newFiles);
      onChange(newFiles as never);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // ====== UI ======
  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypesString}
        onChange={handleFileChange}
        multiple={maxFiles > 1}
      />

      <div
        onClick={triggerFileInput}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
          }
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-all text-center cursor-pointer bg-card",
          "flex flex-col items-center justify-center gap-3",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <div className="bg-muted/50 p-3 rounded-full">
          <Upload />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-medium">Choose a file or drag & drop it here.</p>
          <p className="text-sm text-muted-foreground">
            {acceptedFileTypes.join(", ")} (Max {maxSize} MB)
          </p>
        </div>
      </div>

      {renderFieldValue()}
      {files.length > 0 && (
        <>
          {isUploading && (
            <Progress value={uploadProgress} className="h-2 w-full" />
          )}
          {renderLocalFiles()}
        </>
      )}

      <FormMessage />

      {currentImageToCrop && (
        <ImageCropModal
          open={cropModalOpen}
          imageUrl={currentImageToCrop}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
          currentIndex={currentCropIndex + 1}
          totalImages={cropQueue.length}
        />
      )}
    </div>
  );
};
