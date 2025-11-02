import api from "@/libs/api";
import type {
  ContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
} from "@/libs/types/content";

export const manageContent = {
  contents: (params: ContentListParams) => {
    return api.get("/contents", { params });
  },

  createContent: (data: CreateContentRequest) => api.post("/contents", data),

  contentDetail: (id: string) => {
    return api.get(`/contents/${id}`);
  },

  updateContent: (data: UpdateContentRequest) => api.put(`/contents/${data.id}`, data),

  deleteContent: (id: string) => {
    return api.delete(`/contents/${id}`);
  },

  publishContent: (id: string, publishDate?: string) => {
    const body = publishDate ? { publish_date: publishDate } : {};
    return api.patch(`/contents/${id}/publish`, body);
  },

  // unpublishContent: (id: string) => {
  //   // Mock implementation for development
  //   return Promise.resolve({ data: { success: true } });
  //   // Uncomment below for real API call
  //   // return api.patch(`/contents/${id}/unpublish`);
  // },

  approveContent: (id: string) => {
    return api.patch(`/contents/${id}/approve`);
  },

  rejectContent: (id: string, feedback: string) => {
    return api.patch(`/contents/${id}/reject`, { feedback });
  },

  submitContent: (id: string) => {
    return api.patch(`/contents/${id}/submit`);
  },
};
