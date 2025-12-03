import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FaImage,
  FaFile,
  FaTrash,
  FaEye,
  FaCloudArrowUp,
  FaVideo,
  FaXmark as FaTimes,
} from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import PWACamera from "./PWACamera";

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string;
}

interface MobileFileUploaderProps {
  userId: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onUploadComplete?: (urls: string[]) => void;
  className?: string;
  disabled?: boolean;
  allowedTypes?: string[];
  title?: string;
  showCamera?: boolean;
}

const MobileFileUploader: React.FC<MobileFileUploaderProps> = ({
  userId,
  accept = "image/*,video/*",
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  onFilesChange,
  onUploadComplete,
  className = "",
  disabled = false,
  allowedTypes = [],
  title = "Upload Files",
  showCamera = true,
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

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
    if (["mp4", "webm", "mov", "avi"].includes(ext)) {
      return <FaVideo className="w-4 h-4 text-red-500" />;
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
          progress: 0,
          status: "uploading",
          preview,
        });
      }

      if (validFiles.length === 0) return;

      setError("");
      setFiles((prev) => [...prev, ...validFiles]);
      onFilesChange?.([...files.map((f) => f.file), ...validFiles.map((f) => f.file)]);

      // Start upload
      uploadFiles(validFiles);
    },
    [files, maxFiles, validateFile, onFilesChange],
  );

  const uploadFiles = async (filesToUpload: FileItem[]) => {
    if (filesToUpload.length === 0) return;

    setUploading(true);

    try {
      const allFiles = filesToUpload.map((f) => f.file);
      const result = await dispatch(uploadFilesThunk({ userId, files: allFiles })).unwrap();

      // Extract URLs
      const urls: string[] = [];
      if (Array.isArray(result)) {
        result.forEach((r) => {
          if (typeof r === "string") urls.push(r);
          else if (r?.url) urls.push(r.url);
        });
      } else if (result && typeof result === "object") {
        Object.values(result).forEach((urlArray) => {
          if (Array.isArray(urlArray)) {
            urls.push(...urlArray.filter((url) => typeof url === "string"));
          }
        });
      }

      // Update file status
      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((ft) => ft.id === f.id)
            ? { ...f, status: "completed" as const, progress: 100 }
            : f,
        ),
      );

      onUploadComplete?.(urls);
    } catch (error: any) {
      console.error("Upload error:", error);
      setError("Upload failed. Please try again.");

      // Mark files as error
      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((ft) => ft.id === f.id) ? { ...f, status: "error" as const } : f,
        ),
      );
    } finally {
      setUploading(false);
    }
  };

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
    event.target.value = ""; // Reset input
  };

  const handleCameraCapture = (capturedFiles: File[]) => {
    processFiles(capturedFiles);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Controls */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-4 text-center space-y-4">
          <div className="space-y-2">
            <FaCloudArrowUp className="w-8 h-8 mx-auto text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700">{title}</h4>
            <p className="text-xs text-gray-500">
              Max {maxFiles} files, up to {maxSize}MB each
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Gallery Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
            >
              <FaImage className="w-4 h-4 mr-2" />
              Gallery
            </Button>

            {/* Camera Button */}
            {showCamera && (
              <PWACamera
                userId={userId}
                onFilesCapture={handleCameraCapture}
                onUploadComplete={onUploadComplete}
                maxFiles={maxFiles - files.length}
                className="w-full"
                disabled={disabled || files.length >= maxFiles}
              />
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 flex items-center gap-2 text-sm text-red-600">
            <FaTimes className="w-4 h-4" />
            {error}
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file) => (
              <Card key={file.id} className="border">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                          {getFileIcon(file.name)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <Badge
                          variant={
                            file.status === "completed"
                              ? "default"
                              : file.status === "error"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {file.status === "completed"
                            ? "Done"
                            : file.status === "error"
                              ? "Error"
                              : "Uploading"}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>

                      {/* Progress Bar */}
                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="h-1 mt-2" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {file.status === "completed" && file.preview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => {
                            // Open preview in new tab
                            window.open(file.preview, "_blank");
                          }}
                        >
                          <FaEye className="w-3 h-3" />
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFile(file.id)}
                      >
                        <FaTrash className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3 flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Uploading files...
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileFileUploader;
