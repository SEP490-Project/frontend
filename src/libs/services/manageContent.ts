import api from "@/libs/api";
import type {
  ContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
} from "@/libs/types/content";

export const manageContent = {
  contents: (params: ContentListParams) => api.get("/contents", { params }),

  createContent: (data: CreateContentRequest) => api.post("/contents", data),

  contentDetail: (id: string) => api.get(`/contents/${id}`),

  updateContent: (data: UpdateContentRequest) => api.put(`/contents/${data.id}`, data),

  deleteContent: (id: string) => api.delete(`/contents/${id}`),

  publishContent: (id: string) => api.patch(`/contents/${id}/publish`),

  unpublishContent: (id: string) => api.patch(`/contents/${id}/unpublish`),
};
