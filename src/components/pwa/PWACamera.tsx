import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FaCamera,
  FaImage,
  FaVideo,
  FaStop,
  FaCheck,
  FaRotateRight,
  FaXmark as FaTimes,
} from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import { uploadFilesThunk } from "@/libs/stores/fileManager/thunk";

interface CapturedFile {
  id: string;
  type: "photo" | "video";
  file: File;
  preview: string;
  timestamp: Date;
}

interface PWACameraProps {
  userId: string;
  onFilesCapture?: (files: File[]) => void;
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

const PWACamera: React.FC<PWACameraProps> = ({
  userId,
  onFilesCapture,
  onUploadComplete,
  maxFiles = 5,
  className = "",
  disabled = false,
}) => {
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<"photo" | "video">("photo");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [capturedFiles, setCapturedFiles] = useState<CapturedFile[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: cameraMode === "video",
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setError("Cannot access camera. Please check permissions.");
    }
  }, [facingMode, cameraMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Switch camera (front/back)
  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    if (isStreaming) {
      stopCamera();
      setTimeout(startCamera, 100);
    }
  }, [isStreaming, stopCamera, startCamera]);

  // Take photo
  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
        const preview = URL.createObjectURL(blob);

        const capturedFile: CapturedFile = {
          id: Math.random().toString(36).substr(2, 9),
          type: "photo",
          file,
          preview,
          timestamp: new Date(),
        };

        setCapturedFiles((prev) => [...prev, capturedFile]);
      },
      "image/jpeg",
      0.9,
    );
  }, []);

  // Start video recording
  const startRecording = useCallback(async () => {
    if (!streamRef.current) return;

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const file = new File([blob], `video_${Date.now()}.webm`, { type: "video/webm" });
        const preview = URL.createObjectURL(blob);

        const capturedFile: CapturedFile = {
          id: Math.random().toString(36).substr(2, 9),
          type: "video",
          file,
          preview,
          timestamp: new Date(),
        };

        setCapturedFiles((prev) => [...prev, capturedFile]);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error("Recording error:", err);
      setError("Cannot start recording");
    }
  }, []);

  // Stop video recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [isRecording]);

  // Remove captured file
  const removeCapturedFile = useCallback((id: string) => {
    setCapturedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // Handle file input (gallery)
  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        if (capturedFiles.length >= maxFiles) {
          setError(`Maximum ${maxFiles} files allowed`);
          return;
        }

        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (!isVideo && !isImage) {
          setError("Only image and video files are allowed");
          return;
        }

        const preview = URL.createObjectURL(file);
        const capturedFile: CapturedFile = {
          id: Math.random().toString(36).substr(2, 9),
          type: isVideo ? "video" : "photo",
          file,
          preview,
          timestamp: new Date(),
        };

        setCapturedFiles((prev) => [...prev, capturedFile]);
      });

      // Reset input
      event.target.value = "";
    },
    [capturedFiles.length, maxFiles],
  );

  // Upload captured files
  const uploadFiles = useCallback(async () => {
    if (capturedFiles.length === 0) return;

    setUploading(true);
    try {
      const files = capturedFiles.map((cf) => cf.file);
      const result = await dispatch(uploadFilesThunk({ userId, files })).unwrap();

      // Extract URLs from result
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

      onFilesCapture?.(files);
      onUploadComplete?.(urls);

      // Clean up
      capturedFiles.forEach((cf) => {
        if (cf.preview) URL.revokeObjectURL(cf.preview);
      });
      setCapturedFiles([]);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [capturedFiles, userId, dispatch, onFilesCapture, onUploadComplete]);

  // Open camera dialog
  const openCamera = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setCapturedFiles([]);
    setError("");
    setTimeout(startCamera, 300);
  }, [disabled, startCamera]);

  // Close camera dialog
  const closeCamera = useCallback(() => {
    stopCamera();
    stopRecording();
    setIsOpen(false);

    // Clean up previews
    capturedFiles.forEach((cf) => {
      if (cf.preview) URL.revokeObjectURL(cf.preview);
    });
    setCapturedFiles([]);
  }, [stopCamera, stopRecording, capturedFiles]);

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        className={`flex items-center gap-2 ${className}`}
        onClick={openCamera}
        disabled={disabled}
      >
        <FaCamera className="w-4 h-4" />
        Camera
      </Button>

      {/* Camera Dialog */}
      <Dialog open={isOpen} onOpenChange={closeCamera}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span>Camera</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCameraMode(cameraMode === "photo" ? "video" : "photo")}
                  className="text-xs"
                >
                  {cameraMode === "photo" ? (
                    <FaVideo className="w-3 h-3" />
                  ) : (
                    <FaCamera className="w-3 h-3" />
                  )}
                  {cameraMode === "photo" ? "Video" : "Photo"}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-4 pt-0">
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-3 text-sm text-red-600">{error}</CardContent>
              </Card>
            )}

            {/* Camera View */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-mono">{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Camera controls overlay */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
                {/* Gallery button */}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    <FaImage className="w-5 h-5 text-white" />
                  </div>
                </label>

                {/* Capture button */}
                <Button
                  type="button"
                  size="lg"
                  className={`w-16 h-16 rounded-full ${
                    isRecording ? "bg-red-600 hover:bg-red-700" : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={
                    cameraMode === "photo"
                      ? takePhoto
                      : isRecording
                        ? stopRecording
                        : startRecording
                  }
                  disabled={!isStreaming}
                >
                  {cameraMode === "photo" ? (
                    <FaCamera className={`w-6 h-6 ${isRecording ? "text-white" : "text-black"}`} />
                  ) : isRecording ? (
                    <FaStop className="w-6 h-6 text-white" />
                  ) : (
                    <FaVideo className="w-6 h-6 text-black" />
                  )}
                </Button>

                {/* Switch camera button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30"
                  onClick={switchCamera}
                  disabled={!isStreaming}
                >
                  <FaRotateRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Captured Files */}
            {capturedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Captured Files ({capturedFiles.length})</h4>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {capturedFiles.map((file) => (
                    <div key={file.id} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                        {file.type === "photo" ? (
                          <img
                            src={file.preview}
                            alt="Captured"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video src={file.preview} className="w-full h-full object-cover" muted />
                        )}
                      </div>
                      <Badge
                        className="absolute top-1 left-1 text-xs"
                        variant={file.type === "photo" ? "default" : "secondary"}
                      >
                        {file.type}
                      </Badge>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeCapturedFile(file.id)}
                      >
                        <FaTimes className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={closeCamera}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={uploadFiles}
                disabled={capturedFiles.length === 0 || uploading}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaCheck className="w-4 h-4 mr-2" />
                    Use Files ({capturedFiles.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWACamera;
