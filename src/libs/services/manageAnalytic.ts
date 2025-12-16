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
  getAdminContractsSummary: () => api.get("/analytics/admin/contracts"),
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
  getBrandDashboard: (params: any) => api.get("/analytics/brand-partner/dashboard", { params }),
};

export const manageSalesAnalytic = {
  getSalesFinancialOverview: (params: any) =>
    api.get("/analytics/sales/financials/dashboard", { params }),
  getSalesRevenueGrowth: (params: any) => api.get("/analytics/sales/financials/growth", { params }),
  getSalesRevenueTrend: (params: any) => api.get("/analytics/sales/financials/trend", { params }),
  getSalesOrderOverview: (params: any) => api.get("/analytics/sales/orders/dashboard", { params }),
  getSaleOrderTrend: (params: any) => api.get("/analytics/sales/orders/trend", { params }),
};

export const manageContentAnalytic = {
  getContentCampaign: (params: any) => api.get("/analytics/content/campaigns", { params }),
  getContentChannel: (params: any) => api.get("/analytics/content/channels", { params }),
  getContentPlatform: (params: any) => api.get("/analytics/content/platforms", { params }),
  getContentStatus: (params: any) => api.get("/analytics/content/status", { params }),
  getContentTop: (params: any) => api.get("/analytics/content/top", { params }),
  getContentTrend: (params: any) => api.get("/analytics/content/trend", { params }),
};

// New Content Dashboard API (fresh implementation)
export const manageContentDashboard = {
  getDashboard: (params: {
    period?: string;
    start_date?: string;
    end_date?: string;
    campaign_id?: string;
    brand_id?: string;
  }) => api.get("/analytics/contents/dashboard", { params }),

  // Get detailed metrics for a specific channel
  getChannelDetails: (
    channelId: string,
    params: {
      period?: string;
      start_date?: string;
      end_date?: string;
    },
  ) => api.get(`/analytics/contents/channels/${channelId}`, { params }),
};

// Content Scheduling API
export const manageContentSchedule = {
  getSchedules: (params: {
    page?: number;
    page_size?: number;
    status?: string;
    content_id?: string;
    channel_id?: string;
  }) => api.get("/content-schedules", { params }),
  getScheduleById: (id: string) => api.get(`/content-schedules/${id}`),
  createSchedule: (data: { content_id: string; channel_id: string; scheduled_at: string }) =>
    api.post("/content-schedules", data),
  updateSchedule: (id: string, data: { scheduled_at: string }) =>
    api.put(`/content-schedules/${id}`, data),
  deleteSchedule: (id: string) => api.delete(`/content-schedules/${id}`),

  // Batch schedule content to multiple channels
  batchScheduleContent: (
    contentId: string,
    data: {
      channels: Array<{
        channel_id: string;
        scheduled_at: string;
        auto_post?: boolean;
      }>;
    },
  ) => api.post(`/contents/${contentId}/schedules/batch`, data),
};

// Alerts API
export const manageAlerts = {
  getAlerts: (params: {
    page?: number;
    page_size?: number;
    severity?: string;
    category?: string;
    status?: string;
  }) => api.get("/alerts", { params }),
  getAlertById: (id: string) => api.get(`/alerts/${id}`),
  getAlertStats: () => api.get("/alerts/stats"),
  getUnacknowledgedCount: () => api.get("/alerts/unacknowledged/count"),
  acknowledgeAlert: (id: string, data: { notes?: string }) =>
    api.post(`/alerts/${id}/acknowledge`, data),
  resolveAlert: (id: string, data: { resolution?: string }) =>
    api.post(`/alerts/${id}/resolve`, data),
};

// Social Media Sync API - Triggers cron job for fetching metrics from Facebook and TikTok
export const manageSocialMediaSync = {
  // Trigger content metrics poller job (syncs Facebook and TikTok metrics)
  triggerContentMetricsPoller: (async_mode: boolean = false) =>
    api.post(`/jobs/content-metrics-poller?async=${async_mode}`),
  // Legacy endpoint (deprecated)
  triggerSync: () => api.post("/jobs/content-metrics-poller?async=false"),
  getSyncStatus: () => api.get("/jobs/content-metrics-poller/status"),
};
