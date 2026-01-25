import api from "@/libs/api";
import type { TagListParams, CreateTagRequest, UpdateTagRequest } from "@/libs/types/tag";

export const manageTag = {
  tags: (params: TagListParams) => {
    return api.get("/tags", { params });
  },

  createTag: (data: CreateTagRequest) => api.post("/tags", data),

  tagDetail: (id: string) => {
    return api.get(`/tags/${id}`);
  },

  updateTag: (id: string, data: UpdateTagRequest) => {
    return api.put(`/tags/${id}`, data);
  },

  deleteTag: (id: string) => {
    return api.delete(`/tags/${id}`);
  },
};
