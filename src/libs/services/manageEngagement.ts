import api from "@/libs/api";
import type {
  ContentEngagementRequest,
  ContentEngagementResponse,
  UserEngagementStatus,
  WebsiteEngagementSummary,
} from "@/libs/types/engagement";

export const manageEngagement = {
  recordEngagement: async (
    contentId: string,
    data: ContentEngagementRequest,
  ): Promise<ContentEngagementResponse> => {
    const response = await api.post<any>(`contents/${contentId}/engagement`, data);
    return response.data.data;
  },

  getEngagementSummary: async (contentId: string): Promise<WebsiteEngagementSummary> => {
    const response = await api.get<any>(`contents/${contentId}/engagement`);
    return response.data.data;
  },

  getUserEngagementStatus: async (contentId: string): Promise<UserEngagementStatus> => {
    const response = await api.get<any>(`contents/${contentId}/engagement/status`);
    return response.data.data;
  },
};
