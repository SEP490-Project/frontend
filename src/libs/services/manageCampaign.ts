import api from "@/libs/api";
import type { CampaignParams, CampaignRequest } from "@/libs/types/campaign";

export const manageCampaign = {
  getCampaignsByBrand: (params: CampaignParams) => api.get("/campaigns/brand/profile", { params }),

  getCampaignById: (campaignId: string) => api.get(`/campaigns/id/${campaignId}/details`),

  campaign: (params: {
    page: number;
    limit: number;
    keywords?: string;
    status?: string;
    type?: string;
  }) => api.get("/campaigns", { params }),

  CreateCampaign: (request: CampaignRequest) => api.post("/campaigns", request),
};
