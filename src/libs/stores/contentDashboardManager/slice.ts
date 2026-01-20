import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchContentDashboard,
  fetchAlertStats,
  fetchUnacknowledgedCount,
  fetchChannelDetails,
  batchScheduleContent,
} from "./thunk";

// Types matching backend DTOs

// Period info
export interface PeriodInfo {
  preset_label: string;
  compare_label: string;
  current_start: string;
  current_end: string;
  previous_start: string;
  previous_end: string;
}

// Quick stat item with growth tracking
export interface QuickStatItem {
  value: number;
  previous_value: number;
  growth: number;
  growth_status: "up" | "down" | "stable";
  compare_label: string;
}

// Posting frequency stat
export interface PostingFrequency {
  actual: number;
  expected: number;
  ratio: number;
  status: string;
  source: string; // "schedule", "tasks", "average"
}

// Quick stats container
export interface QuickStats {
  posts_this_week: QuickStatItem;
  total_views: QuickStatItem;
  total_engagement: QuickStatItem;
  average_ctr: QuickStatItem;
  pending_content: number;
  posting_frequency: PostingFrequency;
}

// Top post within a channel
export interface ChannelTopPost {
  content_id: string;
  title: string;
  views: number;
  likes: number;
}

// Channel metrics
export interface ChannelMetrics {
  channel_id: string;
  channel_name: string;
  channel_code: string;
  post_count: number;
  total_reach: number;
  total_engagement: number;
  ctr: number;
  followers_count: number;
  followers_trend?: TrendIndicator;
  fetched_metrics: Record<string, unknown> | null;
  mapped_metrics: Record<string, unknown>;
  top_post: ChannelTopPost | null;
  reach_growth: number;
  engagement_growth: number;
}

// Chart: Reach by channel
export interface ReachByChannel {
  label: string;
  reach: number;
  engagement: number;
}

// Chart: Trend data point
export interface TrendDataPoint {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagements: number;
}

// Chart: Content type distribution
export interface ContentTypeDistribution {
  label: string;
  value: number;
  ratio: number;
}

// Chart: Channel distribution (posts per channel)
export interface ChannelDistribution {
  label: string;
  value: number;
  ratio: number;
}

// Charts container
export interface Charts {
  reach_by_channel: ReachByChannel[];
  trend_data: TrendDataPoint[];
  content_type_distribution: ContentTypeDistribution[];
  channel_distribution: ChannelDistribution[];
}

// Top/Bottom content item
export interface TopContentItem {
  content_id: string;
  title: string;
  type: string;
  channel_name: string;
  views: number;
  engagement: number;
  ctr: number;
  performance_score: number;
  published_at: string;
  thumbnail?: string;
  rank: number;
}

// Upcoming schedule item
export interface UpcomingScheduleItem {
  schedule_id: string;
  content_id: string;
  content_title: string;
  channel_id: string;
  channel_name: string;
  channel_code: string;
  scheduled_at: string;
  status: string;
}

// Alert item
export interface AlertItem {
  id: string;
  type: string; // "WARNING", "ERROR", "INFO"
  category: string; // "LOW_CTR", "CONTENT_REJECTED", "SCHEDULE_FAILED", "MILESTONE_DEADLINE"
  severity: string; // "LOW", "MEDIUM", "HIGH", "CRITICAL"
  title: string;
  description?: string;
  reference_type?: string; // "CONTENT", "CAMPAIGN", "MILESTONE", etc.
  reference_id?: string;
  action_url?: string;
  created_at: string;
  is_read?: boolean;
}

// Main dashboard response
export interface ContentDashboardResponse {
  period: PeriodInfo;
  quick_stats: QuickStats;
  channel_metrics: ChannelMetrics[];
  charts: Charts;
  top_content: TopContentItem[];
  bottom_content: TopContentItem[];
  upcoming_schedule: UpcomingScheduleItem[];
  alerts: AlertItem[];
}

export interface AlertStats {
  total_alerts: number;
  active_alerts: number;
  acknowledged_alerts: number;
  resolved_alerts: number;
  by_severity: Record<string, number>;
  by_category: Record<string, number>;
}

// Channel Details types
export interface ChannelInfo {
  id: string;
  name: string;
  code: string;
  description?: string;
  home_page_url?: string;
  is_active: boolean;
  token_info?: TokenInfo;
}

export interface TokenInfo {
  account_name?: string;
  external_id?: string;
  access_token_expires_at?: string;
  last_synced_at?: string;
}

export interface TrendIndicator {
  value: number;
  percentage: number;
  direction: "up" | "down" | "stable";
}

export interface ContentTrendPoint {
  date: string;
  posts: number;
}

export interface ChannelRecentContentItem {
  content_id: string;
  title: string;
  type: string;
  status: string;
  views: number;
  engagement: number;
  published_at?: string;
}

export interface AffiliateStats {
  total_links: number;
  total_clicks: number;
  unique_users: number;
  ctr: number | string;
  has_links: boolean;
}

export interface ChannelDetailsResponse {
  last_synced_at: string;
  channel: ChannelInfo;
  period: PeriodInfo;
  mapped_metrics: Record<string, number>;
  fetched_metrics?: Record<string, unknown>;
  followers_count: number;
  followers_trend?: TrendIndicator;
  content_trend: ContentTrendPoint[];
  engagement_trend: TrendDataPoint[];
  top_content: TopContentItem[];
  recent_content: ChannelRecentContentItem[];
  affiliate_stats?: AffiliateStats;
}

// Batch scheduling types
export interface BatchScheduleResultItem {
  schedule_id: string;
  channel_id: string;
  channel_name: string;
  channel_code: string;
  scheduled_at: string;
  auto_post: boolean;
}

export interface BatchScheduleFailureItem {
  channel_id: string;
  channel_name: string;
  error: string;
}

export interface BatchScheduleResponse {
  content_id: string;
  total_scheduled: number;
  total_failed: number;
  scheduled_channels: BatchScheduleResultItem[];
  failed_channels: BatchScheduleFailureItem[];
}

interface ContentDashboardState {
  // Dashboard data
  dashboard: ContentDashboardResponse | null;
  loadingDashboard: boolean;
  dashboardError: string | null;

  // Channel details
  channelDetails: ChannelDetailsResponse | null;
  loadingChannelDetails: boolean;
  channelDetailsError: string | null;
  selectedChannelId: string | null;

  // Batch scheduling
  batchScheduleResult: BatchScheduleResponse | null;
  loadingBatchSchedule: boolean;
  batchScheduleError: string | null;

  // Alert stats
  alertStats: AlertStats | null;
  loadingAlertStats: boolean;
  alertStatsError: string | null;

  // Unacknowledged count
  unacknowledgedCount: number;
  loadingUnacknowledgedCount: boolean;

  // Selected period filter
  selectedPeriod: string;
  customStartDate: string | null;
  customEndDate: string | null;

  // Filters
  selectedCampaignId: string | null;
  selectedBrandId: string | null;
}

const initialState: ContentDashboardState = {
  dashboard: null,
  loadingDashboard: false,
  dashboardError: null,
  channelDetails: null,
  loadingChannelDetails: false,
  channelDetailsError: null,
  selectedChannelId: null,
  batchScheduleResult: null,
  loadingBatchSchedule: false,
  batchScheduleError: null,
  alertStats: null,
  loadingAlertStats: false,
  alertStatsError: null,
  unacknowledgedCount: 0,
  loadingUnacknowledgedCount: false,
  selectedPeriod: "LAST_30_DAYS",
  customStartDate: null,
  customEndDate: null,
  selectedCampaignId: null,
  selectedBrandId: null,
};

const contentDashboardSlice = createSlice({
  name: "contentDashboard",
  initialState,
  reducers: {
    setPeriod: (state, action: PayloadAction<string>) => {
      state.selectedPeriod = action.payload;
    },
    setCustomDateRange: (
      state,
      action: PayloadAction<{ startDate: string | null; endDate: string | null }>,
    ) => {
      state.customStartDate = action.payload.startDate;
      state.customEndDate = action.payload.endDate;
    },
    setCampaignFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedCampaignId = action.payload;
    },
    setBrandFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedBrandId = action.payload;
    },
    clearFilters: (state) => {
      state.selectedPeriod = "LAST_30_DAYS";
      state.customStartDate = null;
      state.customEndDate = null;
      state.selectedCampaignId = null;
      state.selectedBrandId = null;
    },
    clearDashboardError: (state) => {
      state.dashboardError = null;
    },
    setSelectedChannelId: (state, action: PayloadAction<string | null>) => {
      state.selectedChannelId = action.payload;
      if (action.payload === null) {
        state.channelDetails = null;
        state.channelDetailsError = null;
      }
    },
    clearChannelDetails: (state) => {
      state.channelDetails = null;
      state.channelDetailsError = null;
      state.selectedChannelId = null;
    },
    clearBatchScheduleResult: (state) => {
      state.batchScheduleResult = null;
      state.batchScheduleError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard
    builder
      .addCase(fetchContentDashboard.pending, (state) => {
        state.loadingDashboard = true;
        state.dashboardError = null;
      })
      .addCase(fetchContentDashboard.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchContentDashboard.rejected, (state, action) => {
        state.loadingDashboard = false;
        state.dashboardError = action.payload as string;
      });

    // Fetch channel details
    builder
      .addCase(fetchChannelDetails.pending, (state) => {
        state.loadingChannelDetails = true;
        state.channelDetailsError = null;
      })
      .addCase(fetchChannelDetails.fulfilled, (state, action) => {
        state.loadingChannelDetails = false;
        state.channelDetails = action.payload.data;
      })
      .addCase(fetchChannelDetails.rejected, (state, action) => {
        state.loadingChannelDetails = false;
        state.channelDetailsError = action.payload as string;
      });

    // Batch schedule content
    builder
      .addCase(batchScheduleContent.pending, (state) => {
        state.loadingBatchSchedule = true;
        state.batchScheduleError = null;
      })
      .addCase(batchScheduleContent.fulfilled, (state, action) => {
        state.loadingBatchSchedule = false;
        state.batchScheduleResult = action.payload.data;
      })
      .addCase(batchScheduleContent.rejected, (state, action) => {
        state.loadingBatchSchedule = false;
        state.batchScheduleError = action.payload as string;
      });

    // Fetch alert stats
    builder
      .addCase(fetchAlertStats.pending, (state) => {
        state.loadingAlertStats = true;
        state.alertStatsError = null;
      })
      .addCase(fetchAlertStats.fulfilled, (state, action) => {
        state.loadingAlertStats = false;
        state.alertStats = action.payload.data;
      })
      .addCase(fetchAlertStats.rejected, (state, action) => {
        state.loadingAlertStats = false;
        state.alertStatsError = action.payload as string;
      });

    // Fetch unacknowledged count
    builder
      .addCase(fetchUnacknowledgedCount.pending, (state) => {
        state.loadingUnacknowledgedCount = true;
      })
      .addCase(fetchUnacknowledgedCount.fulfilled, (state, action) => {
        state.loadingUnacknowledgedCount = false;
        state.unacknowledgedCount = action.payload.data?.count || 0;
      })
      .addCase(fetchUnacknowledgedCount.rejected, (state) => {
        state.loadingUnacknowledgedCount = false;
      });
  },
});

export const {
  setPeriod,
  setCustomDateRange,
  setCampaignFilter,
  setBrandFilter,
  clearFilters,
  clearDashboardError,
  setSelectedChannelId,
  clearChannelDetails,
  clearBatchScheduleResult,
} = contentDashboardSlice.actions;

export default contentDashboardSlice.reducer;
