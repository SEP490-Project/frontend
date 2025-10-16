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
    console.log("Using mock data for content detail, ID:", id);
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

  approveContent: (id: string) => {
    // Mock implementation for development - approve by updating status to 'posted'
    console.log("Mock approve content:", id);
    return Promise.resolve({ data: { success: true, message: "Content approved successfully" } });
    // Uncomment below for real API call
    // return api.patch(`/contents/${id}/approve`);
  },

  rejectContent: (id: string) => {
    // Mock implementation for development - reject by updating status to 'draft'
    console.log("Mock reject content:", id);
    return Promise.resolve({ data: { success: true, message: "Content rejected successfully" } });
    // Uncomment below for real API call
    // return api.patch(`/contents/${id}/reject`);
  },
};
