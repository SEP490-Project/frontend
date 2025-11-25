import api from "../api";

export const manageMarketingAnalytic = {
  getMarketingDashboard: (params: any) => api.get("/analytics/marketing/dashboard", { params }),
  getMarketingActiveBrand: (params: any) =>
    api.get("/analytics/marketing/active-brands", { params }),
  getMarketingActiveCampaign: (params: any) =>
    api.get("/analytics/marketing/active-campaigns", { params }),
  getMarketingDraftCampaign: (params: any) =>
    api.get("/analytics/marketing/draft-campaigns", { params }),
  getMarketingMonthlyRevenue: (params: any) =>
    api.get("/analytics/marketing/monthly-revenue", { params }),
  getMarketingRevenueByType: (params: any) =>
    api.get("/analytics/marketing/revenue-by-type", { params }),
  getMarketingTopBrand: (params: any) => api.get("/analytics/marketing/top-brands", { params }),
  getMarketingUpcomingDeadline: (params: any) =>
    api.get("/analytics/marketing/upcoming-deadlines", { params }),
};
