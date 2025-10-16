import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { ReactElement } from "react";
import { useAppDispatch } from "@/libs/stores";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  FaFileZipper,
} from "react-icons/fa6";

// File type icons
const FILE_ICONS: Record<string, ReactElement> = {
  pdf: <FaFilePdf className="h-8 w-8 text-red-500" />,
  doc: <FaFileWord className="h-8 w-8 text-blue-500" />,
  docx: <FaFileWord className="h-8 w-8 text-blue-500" />,
  xls: <FaFileExcel className="h-8 w-8 text-green-500" />,
  xlsx: <FaFileExcel className="h-8 w-8 text-green-500" />,
  jpg: <FaFileImage className="h-8 w-8 text-purple-500" />,
  jpeg: <FaFileImage className="h-8 w-8 text-purple-500" />,
  png: <FaFileImage className="h-8 w-8 text-purple-500" />,
  gif: <FaFileImage className="h-8 w-8 text-purple-500" />,
  webp: <FaFileImage className="h-8 w-8 text-purple-500" />,
  mp4: <FaFileVideo className="h-8 w-8 text-orange-500" />,
  avi: <FaFileVideo className="h-8 w-8 text-orange-500" />,
  mov: <FaFileVideo className="h-8 w-8 text-orange-500" />,
  wmv: <FaFileVideo className="h-8 w-8 text-orange-500" />,
  mp3: <FaFileAudio className="h-8 w-8 text-pink-500" />,
  wav: <FaFileAudio className="h-8 w-8 text-pink-500" />,
  flac: <FaFileAudio className="h-8 w-8 text-pink-500" />,
  zip: <FaFileZipper className="h-8 w-8 text-yellow-600" />,
  rar: <FaFileZipper className="h-8 w-8 text-yellow-600" />,
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || <FaFile className="h-8 w-8 text-slate-500" />;
};

const formatFileSize = (bytes: number) =>
  bytes === 0
    ? "0 Bytes"
    : `${(bytes / 1024 ** Math.floor(Math.log(bytes) / Math.log(1024))).toFixed(
        2,
      )} ${["Bytes", "KB", "MB", "GB"][Math.floor(Math.log(bytes) / Math.log(1024))]}`;

// Types
interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string;
}

interface FileUploaderProps {
  userId: string; // cần để gửi lên API
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  allowedTypes?: string[];
  title?: string;
  showSummary?: boolean;
  initialFiles?: File[];
  onUploadComplete?: (urls: string[], fileItemId?: string) => void; // <--- added
  onFilesRemove?: (removedUrls: string[]) => void; // <-- Thêm này
}

// Component
const FileUploader: React.FC<FileUploaderProps> = ({
  userId,
  accept = "*/*",
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  onFilesChange,
  className,
  disabled = false,
  // showPreview = true,
  allowedTypes = [],
  title,
  showSummary = true,
  initialFiles = [],
  onUploadComplete,
  onFilesRemove, // <-- Thêm này
}) => {
  const dispatch = useAppDispatch();

  const [files, setFiles] = useState<FileItem[]>(() =>
    initialFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 100,
      status: "completed",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    })),
  );

  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowed = useMemo(
    () =>
      allowedTypes.length > 0
        ? allowedTypes
        : [
            "pdf",
            "doc",
            "docx",
            "xls",
            "xlsx",
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "mp4",
            "avi",
            "mov",
            "wmv",
            "mp3",
            "wav",
            "flac",
            "zip",
            "rar",
          ],
    [allowedTypes],
  );

  const validateFile = useCallback(
    (file: File) => {
      if (file.size > maxSize * 1024 * 1024) return `File size exceeds ${maxSize}MB limit`;
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (allowed.length && !allowed.includes(ext))
        return `File type not allowed. Allowed: ${allowed.join(", ")}`;
      return null;
    },
    [maxSize, allowed],
  );

  // Store uploaded URLs to track removals
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});

  const handleUpload = useCallback(
    async (filesToUpload: FileItem[]) => {
      try {
        // Gom tất cả files lại gửi 1 lần
        const allFiles = filesToUpload.map((f) => f.file);
        const result = await dispatch(uploadFilesThunk({ userId, files: allFiles })).unwrap();

        const extractUrls = (res: any): string[] => {
          if (!res) return [];
          if (Array.isArray(res)) return res.map((r) => r?.url || r);
          if (typeof res === "object") return [res.url || JSON.stringify(res)];
          if (typeof res === "string") return [res];
          return [];
        };

        const urls = extractUrls(result);

        // Store mapping of file ID to URL
        const urlMapping: Record<string, string> = {};
        filesToUpload.forEach((file, index) => {
          if (urls[index]) {
            urlMapping[file.id] = urls[index];
          }
        });
        setUploadedUrls((prev) => ({ ...prev, ...urlMapping }));

        onUploadComplete?.(urls);

        // Cập nhật trạng thái tất cả thành completed
        setFiles((prev) =>
          prev.map((fileItem) =>
            filesToUpload.some((f) => f.id === fileItem.id)
              ? { ...fileItem, progress: 100, status: "completed" }
              : fileItem,
          ),
        );
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Upload failed. Please try again.");
        setFiles((prev) =>
          prev.map((fileItem) =>
            filesToUpload.some((f) => f.id === fileItem.id)
              ? { ...fileItem, status: "error" }
              : fileItem,
          ),
        );
      }
    },
    [dispatch, userId, onUploadComplete],
  );

  const processFiles = useCallback(
    (fileList: FileList) => {
      if (files.length + fileList.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const newFiles: FileItem[] = [];
      for (const file of Array.from(fileList)) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }
        const id = Math.random().toString(36).substr(2, 9);
        newFiles.push({
          id,
          file,
          progress: 0,
          status: "uploading",
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        });
      }

      setError("");
      setFiles((prev) => [...prev, ...newFiles]);
      onFilesChange?.([...files.map((f) => f.file), ...newFiles.map((f) => f.file)]);
      if (newFiles.length && userId) handleUpload(newFiles);
    },
    [files, maxFiles, onFilesChange, userId, validateFile, handleUpload],
  );

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview && fileToRemove.preview.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      // Get the URL for this file and notify parent
      const removedUrl = uploadedUrls[fileId];
      if (removedUrl && onFilesRemove) {
        onFilesRemove([removedUrl]);
      }

      // Remove from uploadedUrls tracking
      setUploadedUrls((prev) => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });

      const newFiles = prev.filter((f) => f.id !== fileId);
      onFilesChange?.(newFiles.map((f) => f.file));
      return newFiles;
    });
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview && file.preview.startsWith("blob:")) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Card Upload */}
      <Card
        className={[
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-slate-300 hover:border-slate-400",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <CardContent
          className="p-6 text-center"
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragActive(false);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragActive(false);
            if (!disabled && e.dataTransfer.files) processFiles(e.dataTransfer.files);
          }}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-3">
            <div
              className={[
                "p-3 rounded-full transition-colors",
                isDragActive ? "bg-blue-100" : "bg-slate-100",
              ].join(" ")}
            >
              <FaCloudArrowUp
                className={[
                  "h-8 w-8 transition-colors",
                  isDragActive ? "text-blue-600" : "text-slate-500",
                ].join(" ")}
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-700">
                {isDragActive ? "Drop files here" : "Upload Files"}
              </h4>
              <p className="text-xs text-slate-500">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-slate-400">
                Max {maxFiles} files, up to {maxSize}MB each
                <span className="block mt-1">Allowed: {allowed.join(", ")}</span>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <FaXmark className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">
              {title ? `${title} (${files.length})` : `Uploaded Files (${files.length})`}
            </h4>
          </div>

          <div className="space-y-2">
            {files.map((fileItem) => (
              <Card key={fileItem.id} className="p-3">
                <div className="flex items-center gap-3">
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
                    {fileItem.status === "uploading" && (
                      <Progress value={fileItem.progress} className="h-1.5" />
                    )}
                  </div>
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

          {/* Summary */}
          {showSummary && (
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
                      <p className="font-medium text-slate-900">
                        {formatFileSize(files.reduce((acc, f) => acc + f.file.size, 0))}
                      </p>
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

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && processFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default FileUploader;
