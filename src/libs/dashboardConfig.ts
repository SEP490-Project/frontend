export const dashboardConfig = {
  admin: [
    { type: "KPI", title: "Tổng số User", key: "totalUsers" },
    { type: "KPI", title: "Tổng doanh thu", key: "totalRevenue" },
    { type: "LineChart", title: "Doanh thu theo tháng", key: "monthlyRevenue" },
    { type: "Table", title: "Top kênh hiệu quả", key: "topChannels" },
  ],
  marketing: [
    { type: "KPI", title: "Số brand hợp tác", key: "activeBrands" },
    { type: "KPI", title: "Campaign đang chạy", key: "activeCampaigns" },
    { type: "KPI", title: "Campaign đã hoàn thành", key: "finishedCampaigns" },
    { type: "KPI", title: "Doanh thu tháng này", key: "monthlyRevenue" },
    { type: "BarChart", title: "Doanh thu theo brand", key: "brandRevenue" },
    { type: "LineChart", title: "Reach & Engagement theo tháng", key: "monthlyReach" },
    { type: "PieChart", title: "Phân bổ doanh thu hợp tác", key: "collabRevenueShare" },
    { type: "Table", title: "Tiến độ campaign", key: "campaignTimeline" },
    { type: "Table", title: "Cảnh báo", key: "alerts" },
  ],
  content: [
    { type: "KPI", title: "Tổng số bài đăng", key: "totalPosts" },
    { type: "KPI", title: "Tổng lượt xem", key: "totalViews" },
    { type: "KPI", title: "Tổng engagement", key: "totalEngagement" },
    { type: "KPI", title: "CTR trung bình", key: "avgCTR" },
    { type: "BarChart", title: "Hiệu suất theo kênh", key: "channelPerformance" },
  ],
  sales: [
    { type: "KPI", title: "Tổng đơn hàng", key: "totalOrders" },
    { type: "KPI", title: "Doanh thu hôm nay", key: "todayRevenue" },
    { type: "KPI", title: "Sản phẩm bán chạy", key: "bestSeller" },
    { type: "LineChart", title: "Doanh thu theo tháng", key: "monthlySales" },
  ],
  brand: [
    { type: "KPI", title: "Số campaign", key: "campaigns" },
    { type: "KPI", title: "Thanh toán chờ", key: "pendingPayments" },
    { type: "KPI", title: "Hóa đơn gần nhất", key: "lastInvoice" },
    { type: "Table", title: "KPIs", key: "kpis" },
  ],
};
