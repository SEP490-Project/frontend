import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  manageContentDashboard,
  manageAlerts,
  manageSocialMediaSync,
  manageContentSchedule,
} from "@/libs/services/manageAnalytic";
import { AxiosError } from "axios";

interface DashboardParams {
  period?: string;
  start_date?: string;
  end_date?: string;
  campaign_id?: string;
  brand_id?: string;
}

interface ChannelDetailsParams {
  channelId: string;
  period?: string;
  start_date?: string;
  end_date?: string;
}

interface BatchScheduleParams {
  contentId: string;
  channels: Array<{
    channel_id: string;
    scheduled_at: string;
    auto_post?: boolean;
  }>;
}

export const fetchContentDashboard = createAsyncThunk(
  "contentDashboard/fetchDashboard",
  async (params: DashboardParams, { rejectWithValue }) => {
    try {
      const response = await manageContentDashboard.getDashboard(params);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to load dashboard");
    }
  },
);

export const fetchChannelDetails = createAsyncThunk(
  "contentDashboard/fetchChannelDetails",
  async ({ channelId, ...params }: ChannelDetailsParams, { rejectWithValue }) => {
    try {
      const response = await manageContentDashboard.getChannelDetails(channelId, params);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to load channel details");
    }
  },
);

export const batchScheduleContent = createAsyncThunk(
  "contentDashboard/batchScheduleContent",
  async ({ contentId, channels }: BatchScheduleParams, { rejectWithValue }) => {
    try {
      const response = await manageContentSchedule.batchScheduleContent(contentId, { channels });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to schedule content");
    }
  },
);

export const fetchAlertStats = createAsyncThunk(
  "contentDashboard/fetchAlertStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageAlerts.getAlertStats();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to load alert stats");
    }
  },
);

export const fetchUnacknowledgedCount = createAsyncThunk(
  "contentDashboard/fetchUnacknowledgedCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageAlerts.getUnacknowledgedCount();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to load unacknowledged count");
    }
  },
);

export const acknowledgeAlert = createAsyncThunk(
  "contentDashboard/acknowledgeAlert",
  async ({ id, notes }: { id: string; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await manageAlerts.acknowledgeAlert(id, { notes });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to acknowledge alert");
    }
  },
);

export const resolveAlert = createAsyncThunk(
  "contentDashboard/resolveAlert",
  async ({ id, resolution }: { id: string; resolution?: string }, { rejectWithValue }) => {
    try {
      const response = await manageAlerts.resolveAlert(id, { resolution });
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to resolve alert");
    }
  },
);

// Sync social media metrics (triggers cron job for Facebook & TikTok)
export const syncSocialMediaMetrics = createAsyncThunk(
  "contentDashboard/syncSocialMedia",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageSocialMediaSync.triggerSync();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to sync social media data");
    }
  },
);
