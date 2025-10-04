export type WidgetType = "KPI" | "LineChart" | "Table" | "BarChart" | "PieChart";

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  key: string;
}

export type RoleKey =
  | "ADMIN"
  | "MARKETING_STAFF"
  | "CONTENT_STAFF"
  | "SALES_STAFF"
  | "BRAND_PARTNER";

export const dashboardConfig: Record<RoleKey, WidgetConfig[]> = {
  ADMIN: [
    { type: "KPI", title: "Total Users", key: "totalUsers" },
    { type: "KPI", title: "Total Revenue", key: "totalRevenue" },
    { type: "LineChart", title: "Monthly Revenue", key: "monthlyRevenue" },
    { type: "Table", title: "Top Channels", key: "topChannels" },
  ],
  MARKETING_STAFF: [
    { type: "KPI", title: "Active Brands", key: "activeBrands" },
    { type: "KPI", title: "Active Campaigns", key: "activeCampaigns" },
    { type: "KPI", title: "Finished Campaigns", key: "finishedCampaigns" },
    { type: "KPI", title: "Monthly Revenue", key: "monthlyRevenue" },
    { type: "BarChart", title: "Brand Revenue", key: "brandRevenue" },
    { type: "LineChart", title: "Monthly Reach & Engagement", key: "monthlyReach" },
    { type: "PieChart", title: "Collaborative Revenue Share", key: "collabRevenueShare" },
    { type: "Table", title: "Campaign Timeline", key: "campaignTimeline" },
    { type: "Table", title: "Alerts", key: "alerts" },
  ],
  CONTENT_STAFF: [
    { type: "KPI", title: "Total Posts", key: "totalPosts" },
    { type: "KPI", title: "Total Views", key: "totalViews" },
    { type: "KPI", title: "Total Engagement", key: "totalEngagement" },
    { type: "KPI", title: "Average CTR", key: "avgCTR" },
    { type: "BarChart", title: "Channel Performance", key: "channelPerformance" },
  ],
  SALES_STAFF: [
    { type: "KPI", title: "Total Orders", key: "totalOrders" },
    { type: "KPI", title: "Today Revenue", key: "todayRevenue" },
    { type: "KPI", title: "Best Seller", key: "bestSeller" },
    { type: "LineChart", title: "Monthly Sales", key: "monthlySales" },
  ],
  BRAND_PARTNER: [
    { type: "KPI", title: "Number of Campaigns", key: "campaigns" },
    { type: "KPI", title: "Pending Payments", key: "pendingPayments" },
    { type: "KPI", title: "Last Invoice", key: "lastInvoice" },
    { type: "Table", title: "KPIs", key: "kpis" },
  ],
};
