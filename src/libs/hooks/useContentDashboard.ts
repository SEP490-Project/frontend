import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContentDashboard = () => {
  const {
    dashboard,
    loadingDashboard,
    dashboardError,
    channelDetails,
    loadingChannelDetails,
    channelDetailsError,
    selectedChannelId,
    batchScheduleResult,
    loadingBatchSchedule,
    batchScheduleError,
    alertStats,
    loadingAlertStats,
    alertStatsError,
    unacknowledgedCount,
    loadingUnacknowledgedCount,
    selectedPeriod,
    customStartDate,
    customEndDate,
    selectedCampaignId,
    selectedBrandId,
  } = useSelector((state: RootState) => state.contentDashboard);

  return {
    // Dashboard data
    dashboard,
    loadingDashboard,
    dashboardError,

    // Channel details
    channelDetails,
    loadingChannelDetails,
    channelDetailsError,
    selectedChannelId,

    // Batch scheduling
    batchScheduleResult,
    loadingBatchSchedule,
    batchScheduleError,

    // Alert stats
    alertStats,
    loadingAlertStats,
    alertStatsError,

    // Unacknowledged count
    unacknowledgedCount,
    loadingUnacknowledgedCount,

    // Filters
    selectedPeriod,
    customStartDate,
    customEndDate,
    selectedCampaignId,
    selectedBrandId,

    // Computed values from new API structure
    period: dashboard?.period,
    quickStats: dashboard?.quick_stats,
    channelMetrics: dashboard?.channel_metrics || [],
    charts: dashboard?.charts,
    reachByChannel: dashboard?.charts?.reach_by_channel || [],
    trendData: dashboard?.charts?.trend_data || [],
    contentTypeDistribution: dashboard?.charts?.content_type_distribution || [],
    channelDistribution: dashboard?.charts?.channel_distribution || [],
    topContent: dashboard?.top_content || [],
    bottomContent: dashboard?.bottom_content || [],
    upcomingSchedule: dashboard?.upcoming_schedule || [],
    alerts: dashboard?.alerts || [],
  };
};
