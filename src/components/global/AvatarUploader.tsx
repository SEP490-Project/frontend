import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/libs/utils";
import { FaCamera, FaUser, FaTrash, FaCheck, FaXmark } from "react-icons/fa6";

interface AvatarUploaderProps {
  initialImage?: string;
  onImageChange?: (file: File | null) => void;
  onUpload?: (file: File) => Promise<void>;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  initialImage,
  onImageChange,
  onUpload,
  size = "md",
  className,
  disabled = false,
}) => {
  const [avatar, setAvatar] = useState<{
    file: File | null;
    preview: string | null;
    status: "idle" | "uploading" | "completed" | "error";
    progress: number;
  }>({
    file: null,
    preview: initialImage || null,
    status: "idle",
    progress: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  // Update preview if initialImage changes
  useEffect(() => {
    if (initialImage && !avatar.file) {
      setAvatar((prev) => ({ ...prev, preview: initialImage }));
    }
  }, [initialImage]);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28",
    lg: "w-36 h-36",
    xl: "w-48 h-48",
  };

  const validateFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return "File size exceeds 5MB limit";
    if (!file.type.startsWith("image/")) return "Only image files are allowed";
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setError(error);
      return;
    }

    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setAvatar({
        file,
        preview,
        status: "uploading",
        progress: 0,
      });
      simulateUploadProgress();
      onImageChange?.(file);
    };
    reader.readAsDataURL(file);
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      setAvatar((prev) => ({
        ...prev,
        progress: progress >= 100 ? 100 : Math.round(progress),
        status: progress >= 100 ? "completed" : "uploading",
      }));

      if (progress >= 100) {
        clearInterval(interval);
        if (onUpload && avatar.file) {
          onUpload(avatar.file).catch(() => {
            setAvatar((prev) => ({ ...prev, status: "error" }));
            setError("Upload failed. Please try again.");
          });
        }
      }
    }, 200);
  };

  const removeAvatar = () => {
    setAvatar({
      file: null,
      preview: null,
      status: "idle",
      progress: 0,
    });
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            "rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border-2",
            sizeClasses[size],
            avatar.preview ? "border-transparent" : "border-dashed border-slate-300",
          )}
        >
          {avatar.preview ? (
            <img src={avatar.preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-slate-400 w-1/2 h-1/2" />
          )}
        </div>

        {/* Upload/Change Button */}
        <Button
          type="button"
          size="sm"
          className="absolute bottom-0 right-0 rounded-full shadow-md"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || avatar.status === "uploading"}
        >
          <FaCamera className="h-4 w-4" />
        </Button>
      </div>

      {/* Status and Controls */}
      {avatar.file && (
        <div className="w-full max-w-[200px] space-y-2">
          {/* File Name */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-medium">
              <span className="truncate max-w-[150px]">{avatar.file.name}</span>
              {avatar.status === "completed" && <FaCheck className="text-green-500 h-3 w-3" />}
              {avatar.status === "error" && <FaXmark className="text-red-500 h-3 w-3" />}
            </div>
          </div>

          {/* Progress Bar */}
          {avatar.status === "uploading" && <Progress value={avatar.progress} className="h-1.5" />}

          {/* Remove Button */}
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={removeAvatar}
              disabled={disabled || avatar.status === "uploading"}
            >
              <FaTrash className="h-3 w-3 mr-1" /> Remove
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md w-full max-w-[200px]">
          <p className="text-xs text-red-700 text-center">{error}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default AvatarUploader;
