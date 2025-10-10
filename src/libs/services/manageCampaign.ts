import api from "@/libs/api";

export const manageCampaign = {
  campaign: (params: {
    page: number;
    limit: number;
    keywords?: string;
    status?: string;
    type?: string;
  }) => api.get("/campaigns", { params }),
};
