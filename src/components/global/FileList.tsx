import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaTrash,
  FaDownload,
  FaCheck,
  FaXmark,
  FaFileZipper,
} from "react-icons/fa6";

const FILE_ICONS: Record<string, ReactElement> = {
  pdf: <FaFilePdf className="h-4 w-4 text-red-500" />,
  doc: <FaFileWord className="h-4 w-4 text-blue-500" />,
  docx: <FaFileWord className="h-4 w-4 text-blue-500" />,
  xls: <FaFileExcel className="h-4 w-4 text-green-500" />,
  xlsx: <FaFileExcel className="h-4 w-4 text-green-500" />,
  jpg: <FaFileImage className="h-4 w-4 text-purple-500" />,
  jpeg: <FaFileImage className="h-4 w-4 text-purple-500" />,
  png: <FaFileImage className="h-4 w-4 text-purple-500" />,
  gif: <FaFileImage className="h-4 w-4 text-purple-500" />,
  webp: <FaFileImage className="h-4 w-4 text-purple-500" />,
  mp4: <FaFileVideo className="h-4 w-4 text-orange-500" />,
  avi: <FaFileVideo className="h-4 w-4 text-orange-500" />,
  mov: <FaFileVideo className="h-4 w-4 text-orange-500" />,
  wmv: <FaFileVideo className="h-4 w-4 text-orange-500" />,
  mp3: <FaFileAudio className="h-4 w-4 text-pink-500" />,
  wav: <FaFileAudio className="h-4 w-4 text-pink-500" />,
  flac: <FaFileAudio className="h-4 w-4 text-pink-500" />,
  zip: <FaFileZipper className="h-4 w-4 text-yellow-600" />,
  rar: <FaFileZipper className="h-4 w-4 text-yellow-600" />,
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || <FaFile className="h-4 w-4 text-slate-500" />;
};

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

interface FileListProps {
  files: FileItem[];
  onRemove?: (id: string) => void;
  onDownload?: (file: FileItem) => void;
  className?: string;
  showStatus?: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  onRemove,
  onDownload,
  className = "",
  showStatus = true,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">{getFileIcon(file.name)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                {showStatus && (
                  <Badge
                    variant={
                      file.status === "completed"
                        ? "default"
                        : file.status === "error"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-xs h-5 px-2 flex-shrink-0"
                  >
                    {file.status === "completed" && <FaCheck className="h-2 w-2 mr-1" />}
                    {file.status === "error" && <FaXmark className="h-2 w-2 mr-1" />}
                    {file.status}
                  </Badge>
                )}
              </div>

              {file.status === "uploading" && (
                <div className="mt-2">
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            {file.status === "completed" && onDownload && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                onClick={() => onDownload(file)}
                title="Download"
              >
                <FaDownload className="h-3 w-3" />
              </Button>
            )}

            {onRemove && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onRemove(file.id)}
                title="Remove"
              >
                <FaTrash className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
