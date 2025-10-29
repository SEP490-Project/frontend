import api from "@/libs/api";

export const manageFile = {
  uploadFiles: (data: FormData, onProgress?: (percent: number) => void) =>
    api.post("/files/upload", data, {
      onUploadProgress: (event) => {
        if (onProgress) {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          onProgress(percent);
        }
      },
    }),
};
