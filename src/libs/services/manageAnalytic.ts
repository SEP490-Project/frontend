import api from "../api";

export const manageMarketingAnalytic = {
  getMarketingActiveBrand: () => api.get("/analytics/marketing/active-brands"),
  getMarketingActiveCampaign: () => api.get("/analytics/marketing/active-campaigns"),
  getMarketingDashboard: () => api.get("/analytics/marketing/dashboard"),
  getMarketingDraftCampaign: () => api.get("/analytics/marketing/draft-campaigns"),
  getMarketingMonthlyRevenue: (params: any) =>
    api.get("/analytics/marketing/monthly-revenue", { params }),
  getMarketingRevenueByType: (params: any) =>
    api.get("/analytics/marketing/revenue-by-type", { params }),
  getMarketingTopBrand: (params: any) => api.get("/analytics/marketing/top-brands", { params }),
  getMarketingUpcomingDeadline: (params: any) =>
    api.get("/analytics/marketing/upcoming-deadlines", { params }),
};

export const manageAdminAnalytic = {
  getAdminCampaignsSummary: () => api.get("/analytics/admin/campaigns"),
  getAdminContractsSummary: () => api.get("/analytics/admin/contracts-summary"),
  getAdminHealth: () => api.get("/analytics/admin/health"),
  getAdminRevenue: (params: any) => api.get("/analytics/admin/revenue", { params }),
  getAdminUserGrowth: (params: any) => api.get("/analytics/admin/user-growth", { params }),
  getAdminUsersOverview: (params: any) => api.get("/analytics/admin/users", { params }),
};

export const manageBrandAnalytic = {
  getBrandAffiliate: (params: any) => api.get("/analytics/brand-partner/affiliates", { params }),
  getBrandCampaign: (params: any) => api.get("/analytics/brand-partner/campaigns", { params }),
  getBrandContent: (params: any) => api.get("/analytics/brand-partner/content", { params }),
  getBrandContract: (params: any) => api.get("/analytics/brand-partner/contracts", { params }),
  getBrandRevenueTrend: (params: any) =>
    api.get("/analytics/brand-partner/revenue-trend", { params }),
  getBrandTopProduct: (params: any) => api.get("/analytics/brand-partner/top-products", { params }),
};

export const manageSalesAnalytic = {
  getSalesBrands: (params: any) => api.get("/analytics/sales/brands", { params }),
  getSalesOrders: (params: any) => api.get("/analytics/sales/orders", { params }),
  getSalesPayment: (params: any) => api.get("/analytics/sales/payments", { params }),
  getSalesPreOrder: (params: any) => api.get("/analytics/sales/pre-orders", { params }),
  getSalesProducts: (params: any) => api.get("/analytics/sales/products", { params }),
  getSalesRevenue: (params: any) => api.get("/analytics/sales/revenue", { params }),
  getSalesTrends: (params: any) => api.get("/analytics/sales/trend", { params }),
};

export const manageContentAnalytic = {
  getContentCampaign: (params: any) => api.get("/analytics/content/campaigns", { params }),
  getContentChannel: (params: any) => api.get("/analytics/content/channels", { params }),
  getContentPlatform: (params: any) => api.get("/analytics/content/platforms", { params }),
  getContentStatus: (params: any) => api.get("/analytics/content/status", { params }),
  getContentTop: (params: any) => api.get("/analytics/content/top", { params }),
  getContentTrend: (params: any) => api.get("/analytics/content/trend", { params }),
};
