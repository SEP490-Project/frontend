import api from "@/libs/api";

export const manageChannel = {
  channelList: () => api.get("/channels"),
  connectFacebook: (queryParams: {
    redirect_url: string;
    cancel_url: string;
    is_internal?: boolean;
  }) => api.get("/auth/facebook/login", { params: queryParams }),
  connectTikTok: (queryParams: {
    redirect_url: string;
    cancel_url: string;
    is_internal?: boolean;
  }) => api.get("/auth/tiktok/login", { params: queryParams }),
};
