export interface UploadChunkRequest {
  userId: string;
  chunk: File;
  fileName: string;
  isLastChunk: boolean;
}

export interface UploadFileRequest {
  files: File;
  userId: string;
}

export interface UploadChunkResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: {
    HostURL: string;
    TempURL: string;
  };
}
