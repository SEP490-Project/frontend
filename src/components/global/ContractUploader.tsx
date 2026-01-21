import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useAppDispatch } from "@/libs/stores";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";
import { Button } from "@/components/ui/button";
import { FaCloudArrowUp, FaXmark } from "react-icons/fa6";
import FileList from "./FileList";

const GLOBAL_FILE_PREVIEWS: Record<string, string | undefined> =
  (globalThis as any).__FILE_UPLOADER_PREVIEWS__ ||
  ((globalThis as any).__FILE_UPLOADER_PREVIEWS__ = {});

interface FileItem {
  id: string;
  file?: File;
  name: string;
  size?: number;
  progress: number;
  status: "uploading" | "completed" | "error";
  preview?: string;
  url?: string;
}

interface FileUploaderProps {
  userId: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  allowedTypes?: string[];
  title?: string;
  initialFiles?: File[];
  initialUrls?: string[];
  onUploadComplete?: (urls: string[], fileItemIds?: string[]) => void;
  onFilesRemove?: (removedUrls: string[]) => void;
  context?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  userId,
  accept = "*/*",
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  onFilesChange,
  className,
  disabled = false,
  allowedTypes = [],
  title = "Upload Creative Asset",
  initialFiles = [],
  initialUrls = [],
  onUploadComplete,
  onFilesRemove,
  context = "general",
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileItem[]>(() => {
    const initial: FileItem[] = [];

    initialFiles.forEach((f) => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
      if (preview) GLOBAL_FILE_PREVIEWS[`${context}:${id}`] = preview;
      initial.push({
        id,
        file: f,
        name: f.name,
        size: f.size,
        progress: 100,
        status: "completed",
        preview,
      });
    });

    initialUrls.forEach((url) => {
      const id = Math.random().toString(36).substr(2, 9);
      const name = url.split("/").pop() || "file";
      const preview = url;
      if (preview) GLOBAL_FILE_PREVIEWS[`${context}:${id}`] = preview;
      initial.push({
        id,
        name,
        progress: 100,
        status: "completed",
        preview,
        url,
      });
    });

    return initial;
  });

  const [error, setError] = useState("");

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
            "mp3",
            "zip",
            "rar",
          ],
    [allowedTypes],
  );

  const validateFile = useCallback(
    (file: File) => {
      if (file.size > maxSize * 1024 * 1024) return `File exceeds ${maxSize}MB`;
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (allowed.length && !allowed.includes(ext)) return "Type not allowed";
      return null;
    },
    [maxSize, allowed],
  );

  const handleUpload = useCallback(
    async (filesToUpload: FileItem[]) => {
      try {
        const allFiles = filesToUpload.map((f) => f.file!).filter(Boolean);
        const result = await dispatch(uploadFilesThunk({ userId, files: allFiles })).unwrap();

        const urls = Array.isArray(result)
          ? result.map((r) => r?.url || r)
          : typeof result === "object" && result.url
            ? [result.url]
            : [String(result)];

        const urlMapping: Record<string, string> = {};
        filesToUpload.forEach((file, i) => {
          if (urls[i]) urlMapping[file.id] = urls[i];
        });

        setFiles((prev) =>
          prev.map((item) =>
            filesToUpload.some((f) => f.id === item.id)
              ? {
                  ...item,
                  progress: 100,
                  status: "completed",
                  url: urlMapping[item.id] || item.url,
                }
              : item,
          ),
        );

        onUploadComplete?.(
          urls,
          filesToUpload.map((f) => f.id),
        );
      } catch {
        setError("Upload failed");
        setFiles((prev) =>
          prev.map((item) =>
            filesToUpload.some((f) => f.id === item.id) ? { ...item, status: "error" } : item,
          ),
        );
      }
    },
    [dispatch, userId, onUploadComplete],
  );

  const processFiles = useCallback(
    (fileList: FileList) => {
      if (files.length + fileList.length > maxFiles) {
        setError(`Max ${maxFiles} files`);
        return;
      }

      const newFiles: FileItem[] = [];
      for (const file of Array.from(fileList)) {
        const err = validateFile(file);
        if (err) {
          setError(err);
          continue;
        }
        const id = Math.random().toString(36).substr(2, 9);
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
        if (preview) GLOBAL_FILE_PREVIEWS[`${context}:${id}`] = preview;

        newFiles.push({
          id,
          file,
          name: file.name,
          size: file.size,
          progress: 0,
          status: "uploading",
          preview,
        });
      }

      if (!newFiles.length) return;

      setError("");
      setFiles((prev) => {
        const merged = [...prev, ...newFiles];
        onFilesChange?.(merged.filter((m) => m.file).map((m) => m.file!));
        return merged;
      });

      if (userId) handleUpload(newFiles);
    },
    [files.length, maxFiles, validateFile, onFilesChange, userId, handleUpload, context],
  );

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview?.startsWith("blob:")) URL.revokeObjectURL(file.preview);
      delete GLOBAL_FILE_PREVIEWS[`${context}:${id}`];

      if (file?.url && onFilesRemove) onFilesRemove([file.url]);

      const updated = prev.filter((f) => f.id !== id);
      onFilesChange?.(updated.filter((m) => m.file).map((m) => m.file!));
      return updated;
    });
  };

  const handleDownload = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file.file) {
      const url = URL.createObjectURL(file.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        preview: f.preview || GLOBAL_FILE_PREVIEWS[`${context}:${f.id}`],
      })),
    );
  }, [context]);

  return (
    <div className={`space-y-3 ${className || ""}`}>
      <div className="flex items-center space-x-4">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || files.length >= maxFiles}
          onClick={() => fileInputRef.current?.click()}
          className="text-xs h-8"
        >
          <FaCloudArrowUp className="h-3 w-3 mr-1" />
          Browse
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
          <FaXmark className="h-3 w-3" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <FileList
          files={files}
          onRemove={removeFile}
          onDownload={handleDownload}
          className="mt-4"
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) {
            processFiles(e.target.files);
            e.target.value = "";
          }
        }}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default FileUploader;
