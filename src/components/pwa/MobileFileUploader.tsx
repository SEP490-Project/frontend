import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaImage, FaFile, FaEye, FaXmark as FaTimes } from "react-icons/fa6";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "selected" | "error";
  preview?: string;
}

interface MobileFileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  allowedTypes?: string[];
  title?: string;
}

const MobileFileUploader: React.FC<MobileFileUploaderProps> = ({
  accept = "image/*",
  multiple = true,
  maxSize = 5,
  maxFiles = 3,
  onFilesChange,
  className = "",
  disabled = false,
  allowedTypes = [],
  title = "Select Images",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string>("");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return <FaImage className="w-4 h-4 text-blue-500" />;
    }
    return <FaFile className="w-4 h-4 text-gray-500" />;
  };

  const validateFile = useCallback(
    (file: File) => {
      if (file.size > maxSize * 1024 * 1024) {
        return `File size exceeds ${maxSize}MB limit`;
      }

      if (allowedTypes.length > 0) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        if (!allowedTypes.includes(ext)) {
          return `File type not allowed. Allowed: ${allowedTypes.join(", ")}`;
        }
      }

      return null;
    },
    [maxSize, allowedTypes],
  );

  const processFiles = useCallback(
    (newFiles: File[]) => {
      if (files.length + newFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validFiles: FileItem[] = [];

      for (const file of newFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        const id = Math.random().toString(36).substr(2, 9);
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;

        validFiles.push({
          id,
          file,
          name: file.name,
          size: file.size,
          status: "selected",
          preview,
        });
      }

      if (validFiles.length === 0) return;

      setError("");
      setFiles((prev) => [...prev, ...validFiles]);
      onFilesChange?.([...files.map((f) => f.file), ...validFiles.map((f) => f.file)]);
    },
    [files, maxFiles, validateFile, onFilesChange],
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === id);
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        const newFiles = prev.filter((f) => f.id !== id);
        onFilesChange?.(newFiles.map((f) => f.file));
        return newFiles;
      });
    },
    [onFilesChange],
  );

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(Array.from(selectedFiles));
    }
    event.target.value = "";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <span className="text-xs text-gray-500">
            {files.length}/{maxFiles}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full h-10"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || files.length >= maxFiles}
        >
          <FaImage className="w-4 h-4 mr-2" />
          {files.length === 0 ? "Choose Images" : "Add More"}
          <span className="ml-auto text-xs text-gray-500">Max {maxSize}MB</span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2 text-xs text-red-600">
          <FaTimes className="w-3 h-3 flex-shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {files.map((file) => (
              <div key={file.id} className="relative flex-shrink-0 group">
                {file.preview ? (
                  <div className="relative">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <FaTimes className="w-2 h-2" />
                    </Button>

                    <div
                      className="absolute inset-0 bg-transparent active:bg-black/10 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                      onClick={() => window.open(file.preview, "_blank")}
                    >
                      <div className="opacity-0 active:opacity-100 transition-opacity">
                        <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                          <FaEye className="w-3 h-3 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center relative">
                    {getFileIcon(file.name)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                      onClick={() => removeFile(file.id)}
                    >
                      <FaTimes className="w-2 h-2" />
                    </Button>
                  </div>
                )}

                <div className="absolute -bottom-6 left-0 right-0 bg-black/75 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity truncate">
                  {formatFileSize(file.size)}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-xs text-gray-600 space-y-1">
              {files.map((file, index) => (
                <div key={file.id} className="flex items-center justify-between">
                  <span className="truncate flex-1 mr-2">
                    {index + 1}. {file.name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={file.status === "error" ? "destructive" : "secondary"}
                      className="text-xs px-1 py-0"
                    >
                      {formatFileSize(file.size)}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-4 h-4 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeFile(file.id)}
                    >
                      <FaTimes className="w-2 h-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFileUploader;
