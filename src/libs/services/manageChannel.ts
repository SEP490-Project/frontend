import api from "@/libs/api";

export const manageChannel = {
  channelList: () => api.get("/channels"),
  connectFacebook: (queryParams: {
    redirectUrl: string;
    cancelUrl: string;
    is_internal?: boolean;
  }) => api.get("/auth/facebook/login", { params: queryParams }),
  connectTikTok: (queryParams: { redirectUrl: string; cancelUrl: string; is_internal?: boolean }) =>
    api.get("/auth/tiktok/login", { params: queryParams }),
};
