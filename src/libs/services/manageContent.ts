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

  contentDetail: (id: string) => {
    // Mock implementation for development
    const content = mockData.data.find((item) => item.id === id);
    if (content) {
      // Ensure proper typing for Content interface
      const typedContent = {
        ...content,
        status: content.status as "posted" | "draft" | "pending",
        content_type: content.content_type as "blog" | "video",
      };
      return Promise.resolve({
        data: {
          data: typedContent,
        },
      });
    } else {
      return Promise.reject(new Error("Content not found"));
    }
    // Uncomment below for real API call
    // return api.get(`/contents/${id}`);
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

  rejectContent: (id: string, reason: string) => {
    return api.patch(`/contents/${id}/reject`, { reason });
  },

  submitContent: (id: string) => {
    return api.patch(`/contents/${id}/submit`);
  },
};
