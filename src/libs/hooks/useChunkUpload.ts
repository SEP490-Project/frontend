import { useState } from "react";
import { useAuth } from "./useAuth";
import manageFile from "../services/manageFile";
import type { UploadChunkResponse } from "../types/file";

export function useChunkUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const CHUNK_SIZE = 5 * 1024 * 1024;

  const uploadFileInChunks = async (file: File): Promise<UploadChunkResponse | null> => {
    setProgress(0);
    setError(null);
    setIsUploading(true);

    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let lastResponse: UploadChunkResponse | null = null;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const isLastChunk = chunkIndex === totalChunks - 1;

        const formData = new FormData();
        formData.append("userId", user?.id || "");
        formData.append("fileName", file.name);
        formData.append("chunk", chunk);
        formData.append("isLastChunk", JSON.stringify(isLastChunk));

        const res = await manageFile.uploadChunkedFile(formData);

        const percentage = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        setProgress(percentage);

        if (isLastChunk) {
          lastResponse = res.data as UploadChunkResponse;
        }
      }

      return lastResponse;
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFileInChunks, progress, isUploading, error };
}
