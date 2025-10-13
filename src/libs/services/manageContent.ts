import api from "@/libs/api";
import type {
  ContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
} from "@/libs/types/content";
import mockData from "@/pages/manager/content/mock-data/content-mock.json";

export const manageContent = {
  contents: (params: ContentListParams) => {
    // Mock implementation for development
    console.log("Using mock data, ignoring params:", params);
    return Promise.resolve({
      data: mockData,
    });
    // Uncomment below for real API call
    // return api.get("/contents", { params });
  },

  createContent: (data: CreateContentRequest) => api.post("/contents", data),

  contentDetail: (id: string) => api.get(`/contents/${id}`),

  updateContent: (data: UpdateContentRequest) => api.put(`/contents/${data.id}`, data),

  deleteContent: (id: string) => {
    // Mock implementation for development
    console.log("Mock delete content:", id);
    return Promise.resolve({ data: { success: true } });
    // Uncomment below for real API call
    // return api.delete(`/contents/${id}`);
  },

  publishContent: (id: string) => {
    // Mock implementation for development
    console.log("Mock publish content:", id);
    return Promise.resolve({ data: { success: true } });
    // Uncomment below for real API call
    // return api.patch(`/contents/${id}/publish`);
  },

  unpublishContent: (id: string) => {
    // Mock implementation for development
    console.log("Mock unpublish content:", id);
    return Promise.resolve({ data: { success: true } });
    // Uncomment below for real API call
    // return api.patch(`/contents/${id}/unpublish`);
  },
};
