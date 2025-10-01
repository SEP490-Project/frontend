export const dashboardConfig = {
  admin: [
    { type: "KPI", title: "Total Users", key: "totalUsers" },
    { type: "KPI", title: "Total Revenue", key: "totalRevenue" },
    { type: "LineChart", title: "Monthly Revenue", key: "monthlyRevenue" },
    { type: "Table", title: "Top Channels", key: "topChannels" },
  ],
  marketing: [
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
  content: [
    { type: "KPI", title: "Total Posts", key: "totalPosts" },
    { type: "KPI", title: "Total Views", key: "totalViews" },
    { type: "KPI", title: "Total Engagement", key: "totalEngagement" },
    { type: "KPI", title: "Average CTR", key: "avgCTR" },
    { type: "BarChart", title: "Channel Performance", key: "channelPerformance" },
  ],
  sales: [
    { type: "KPI", title: "Total Orders", key: "totalOrders" },
    { type: "KPI", title: "Today Revenue", key: "todayRevenue" },
    { type: "KPI", title: "Best Seller", key: "bestSeller" },
    { type: "LineChart", title: "Monthly Sales", key: "monthlySales" },
  ],
  brand: [
    { type: "KPI", title: "Number of Campaigns", key: "campaigns" },
    { type: "KPI", title: "Pending Payments", key: "pendingPayments" },
    { type: "KPI", title: "Last Invoice", key: "lastInvoice" },
    { type: "Table", title: "KPIs", key: "kpis" },
  ],
};
