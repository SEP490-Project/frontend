import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/libs/utils";
import {
  FaCloudArrowUp,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaTrash,
  FaDownload,
  FaEye,
  FaCheck,
  FaXmark,
  FaChartColumn,
} from "react-icons/fa6";

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string;
}

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  allowedTypes?: string[];
  title?: string;
  showSummary?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept = "*/*",
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  onFilesChange,
  onUpload,
  className,
  disabled = false,
  showPreview = true,
  allowedTypes = [],
  title,
  showSummary = true,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return <FaFilePdf className="h-8 w-8 text-red-500" />;
      case "doc":
      case "docx":
        return <FaFileWord className="h-8 w-8 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="h-8 w-8 text-green-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FaFileImage className="h-8 w-8 text-purple-500" />;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <FaFileVideo className="h-8 w-8 text-orange-500" />;
      case "mp3":
      case "wav":
      case "flac":
        return <FaFileAudio className="h-8 w-8 text-pink-500" />;
      default:
        return <FaFile className="h-8 w-8 text-slate-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalSize = () => {
    return files.reduce((acc, fileItem) => acc + fileItem.file.size, 0);
  };

  const validateFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    if (allowedTypes.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension || "")) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`;
      }
    }

    return null;
  };

  const processFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: FileItem[] = [];
      let errorMessage = "";

      // Check max files limit
      if (files.length + fileList.length > maxFiles) {
        errorMessage = `Maximum ${maxFiles} files allowed`;
        setError(errorMessage);
        return;
      }

      Array.from(fileList).forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          errorMessage = validationError;
          return;
        }

        const fileItem: FileItem = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: "uploading",
        };

        // Create preview for images
        if (file.type.startsWith("image/") && showPreview) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileItem.preview = e.target?.result as string;
            setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? fileItem : f)));
          };
          reader.readAsDataURL(file);
        }

        newFiles.push(fileItem);
      });

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      setError("");
      setFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach((fileItem) => {
        simulateUploadProgress(fileItem.id);
      });

      // Call onFilesChange callback
      const allFiles = [...files.map((f) => f.file), ...newFiles.map((f) => f.file)];
      onFilesChange?.(allFiles);
    },
    [files, maxFiles, maxSize, allowedTypes, onFilesChange, showPreview],
  );

  const simulateUploadProgress = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: 100, status: "completed" } : f)),
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress: Math.round(progress) } : f)),
        );
      }
    }, 200);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const { files: droppedFiles } = e.dataTransfer;
    if (droppedFiles) {
      processFiles(droppedFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    const remainingFiles = files.filter((f) => f.id !== fileId).map((f) => f.file);
    onFilesChange?.(remainingFiles);
  };

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (onUpload) {
      const filesToUpload = files.map((f) => f.file);
      try {
        await onUpload(filesToUpload);
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Upload failed. Please try again.");
      }
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-slate-300 hover:border-slate-400",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <CardContent
          className="p-6 text-center"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-3">
            <div
              className={cn(
                "p-3 rounded-full transition-colors",
                isDragActive ? "bg-blue-100" : "bg-slate-100",
              )}
            >
              <FaCloudArrowUp
                className={cn(
                  "h-8 w-8 transition-colors",
                  isDragActive ? "text-blue-600" : "text-slate-500",
                )}
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-700">
                {isDragActive ? "Drop files here" : "Upload Files"}
              </h4>
              <p className="text-xs text-slate-500">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-slate-400">
                Max {maxFiles} files, up to {maxSize}MB each
                {allowedTypes.length > 0 && (
                  <span className="block mt-1">Allowed: {allowedTypes.join(", ")}</span>
                )}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2">
            <FaXmark className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">
              {title ? `${title} (${files.length})` : `Uploaded Files (${files.length})`}
            </h4>
            {onUpload && (
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={files.some((f) => f.status === "uploading")}
              >
                Upload All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((fileItem) => (
              <Card key={fileItem.id} className="p-3">
                <div className="flex items-center gap-3">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {fileItem.preview ? (
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className="h-10 w-10 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="scale-75">{getFileIcon(fileItem.file.name)}</div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {fileItem.file.name}
                      </p>
                      <Badge
                        variant={
                          fileItem.status === "completed"
                            ? "default"
                            : fileItem.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {fileItem.status === "completed" && <FaCheck className="h-3 w-3 mr-1" />}
                        {fileItem.status === "error" && <FaXmark className="h-3 w-3 mr-1" />}
                        {fileItem.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 mb-1">
                      {formatFileSize(fileItem.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {fileItem.status === "uploading" && (
                      <Progress value={fileItem.progress} className="h-1.5" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {fileItem.status === "completed" && (
                      <>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <FaEye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <FaDownload className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFile(fileItem.id)}
                    >
                      <FaTrash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* File Summary */}
          {showSummary && files.length > 0 && (
            <>
              <Separator />
              <Card className="bg-slate-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaChartColumn className="h-4 w-4 text-slate-600" />
                    <h5 className="text-sm font-semibold text-slate-700">Summary</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Total Files</p>
                      <p className="font-medium text-slate-900">{files.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Total Size</p>
                      <p className="font-medium text-slate-900">{formatFileSize(getTotalSize())}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Completed</p>
                      <p className="font-medium text-green-600">
                        {files.filter((f) => f.status === "completed").length}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Uploading</p>
                      <p className="font-medium text-blue-600">
                        {files.filter((f) => f.status === "uploading").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default FileUploader;
