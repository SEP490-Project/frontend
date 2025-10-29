import api from "../api";

const manageFile = {
  uploadChunkedFile: async (file: FormData) =>
    api.post("/files/videos/upload-chunk", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
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

export default manageFile;
