import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FaCamera, FaUser, FaTrash, FaCheck, FaXmark } from "react-icons/fa6";
import type { AppDispatch } from "@/libs/stores";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";

interface AvatarUploaderProps {
  userId: string;
  initialImage?: string;
  onImageUpload?: (uploadedUrl: string) => void; // Chỉ cần callback khi có URL
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  userId,
  initialImage,
  onImageUpload,
  size = "md",
  className,
  disabled = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState<{
    preview: string | null;
    status: "idle" | "uploading" | "completed" | "error";
    progress: number;
    uploadedUrl?: string;
    fileName?: string;
  }>({
    preview: initialImage || null,
    status: "idle",
    progress: 0,
    uploadedUrl: initialImage,
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialImage) {
      setAvatar((prev) => ({
        ...prev,
        preview: initialImage,
        uploadedUrl: initialImage,
        status: "completed",
      }));
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }

    setError("");
    const preview = URL.createObjectURL(file);

    setAvatar((prev) => ({
      ...prev,
      preview,
      status: "uploading",
      progress: 0,
      fileName: file.name,
      uploadedUrl: undefined,
    }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setAvatar((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 30, 90),
        }));
      }, 200);

      // Upload file
      const result = await dispatch(
        uploadFilesThunk({
          userId: userId,
          files: [file],
        }),
      ).unwrap();

      clearInterval(progressInterval);

      // Extract URL from result
      let uploadedUrl: string;

      if (result.urls?.length) {
        uploadedUrl = result.urls[0]; // lấy URL server đầu tiên
      } else if (result.files?.length) {
        const firstFile = result.files[0];
        uploadedUrl =
          typeof firstFile === "string"
            ? firstFile
            : firstFile && typeof firstFile === "object" && "url" in firstFile
              ? (firstFile as { url: string }).url
              : "";
      } else {
        uploadedUrl = ""; // hoặc throw lỗi
      }

      if (!uploadedUrl) throw new Error("Upload failed: no URL returned from server");

      setAvatar((prev) => ({
        ...prev,
        status: "completed",
        progress: 100,
        uploadedUrl,
        preview: uploadedUrl, // dùng URL server cho preview
      }));

      onImageUpload?.(uploadedUrl);

      // Cleanup blob URL since we have the uploaded URL
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
        setAvatar((prev) => ({
          ...prev,
          preview: uploadedUrl,
        }));
      }

      // Notify parent with the uploaded URL
      onImageUpload?.(uploadedUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setAvatar((prev) => ({
        ...prev,
        status: "error",
        progress: 0,
      }));
      setError("Upload failed. Please try again.");
    }
  };

  const removeAvatar = () => {
    // Cleanup blob URL
    if (avatar.preview && avatar.preview.startsWith("blob:")) {
      URL.revokeObjectURL(avatar.preview);
    }

    setAvatar({
      preview: null,
      status: "idle",
      progress: 0,
      uploadedUrl: undefined,
      fileName: undefined,
    });

    // Notify parent that image was removed
    onImageUpload?.("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={`rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border-2 ${sizeClasses[size]} ${
            avatar.preview ? "border-transparent" : "border-dashed border-slate-300"
          }`}
        >
          {avatar.preview ? (
            <img src={avatar.preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-slate-400 w-1/2 h-1/2" />
          )}
        </div>

        {/* Upload Button */}
        <Button
          type="button"
          size="sm"
          className="absolute bottom-0 right-0 rounded-full shadow-md"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || avatar.status === "uploading"}
        >
          <FaCamera className="h-4 w-4" />
        </Button>

        {/* Loading overlay */}
        {avatar.status === "uploading" && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="text-white text-xs font-medium">{Math.round(avatar.progress)}%</div>
          </div>
        )}
      </div>

      {/* Status & Controls */}
      {(avatar.fileName || avatar.status !== "idle") && (
        <div className="w-full max-w-[200px] space-y-2">
          {avatar.fileName && (
            <div className="text-center flex items-center justify-center gap-2 text-xs font-medium">
              <span className="truncate max-w-[120px]" title={avatar.fileName}>
                {avatar.fileName}
              </span>
              {avatar.status === "completed" && (
                <FaCheck className="text-green-500 h-3 w-3" title="Upload successful" />
              )}
              {avatar.status === "error" && (
                <FaXmark className="text-red-500 h-3 w-3" title="Upload failed" />
              )}
            </div>
          )}

          {/* Progress bar */}
          {avatar.status === "uploading" && <Progress value={avatar.progress} className="h-1.5" />}

          {/* Status message */}
          <div className="text-center text-xs text-slate-500">
            {avatar.status === "uploading" && "Uploading..."}
            {avatar.status === "completed" && (
              <span className="text-green-600">✓ Upload successful</span>
            )}
            {avatar.status === "error" && <span className="text-red-600">✗ Upload failed</span>}
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-2">
            {avatar.preview && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={removeAvatar}
                disabled={disabled || avatar.status === "uploading"}
              >
                <FaTrash className="h-3 w-3 mr-1" /> Remove
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md w-full max-w-[200px]">
          <p className="text-xs text-red-700 text-center">{error}</p>
        </div>
      )}

      {/* Hidden file input */}
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
