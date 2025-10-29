import api from "../api";

const manageFile = {
  uploadChunkedFile: async (file: FormData) =>
    api.post("/files/videos/upload-chunk", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  uploadFile: async (file: File) => api.post("/files/upload", file),
};

export default manageFile;
