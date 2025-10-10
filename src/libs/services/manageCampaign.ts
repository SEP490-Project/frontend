import api from "@/libs/api";
import type { CampaignParams } from "@/libs/types/campaign";

export const manageCampaign = {
  getCampaignsByBrand: (params: CampaignParams) =>
    api.get("/campaigns/brand/profile", {
      params: {
        page: params.page,
        limit: params.limit,
        status: params.status,
        type: params.type,
      },
    }),

  getCampaignById: (campaignId: string) => api.get(`/campaigns/${campaignId}`),
};
