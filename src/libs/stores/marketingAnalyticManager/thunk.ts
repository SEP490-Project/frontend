import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageMarketingAnalytic } from "@/libs/services/manageAnalytic";
import { AxiosError } from "axios";

export const marketingActiveBrand = createAsyncThunk(
  "/active-brands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingActiveBrand();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const marketingActiveCampaign = createAsyncThunk(
  "/active-campaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingActiveCampaign();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const marketingDashboard = createAsyncThunk(
  "/dashboard",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingDashboard(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const marketingDraftCampaign = createAsyncThunk(
  "/draft-campaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingDraftCampaign();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const marketingMonthlyRevenue = createAsyncThunk(
  "/monthly-revenue",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingMonthlyRevenue(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const marketingRevenueType = createAsyncThunk(
  "/revenue-by-type",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingRevenueByType(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const marketingTopBrand = createAsyncThunk(
  "/top-brands",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingTopBrand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const marketingUpcomingDeadline = createAsyncThunk(
  "/upcoming-deadlines",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingUpcomingDeadline(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

// New dashboard refactor thunks
export const marketingContractStatusDistribution = createAsyncThunk(
  "marketing/contract-status-distribution",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getContractStatusDistribution(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to get contract status distribution",
      );
    }
  },
);

export const marketingTaskStatusDistribution = createAsyncThunk(
  "marketing/task-status-distribution",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getTaskStatusDistribution(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to get task status distribution",
      );
    }
  },
);

export const marketingRevenueOverTime = createAsyncThunk(
  "marketing/revenue-over-time",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getRevenueOverTime(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get revenue over time");
    }
  },
);

export const marketingRefundViolationStats = createAsyncThunk(
  "marketing/refund-violation-stats",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getRefundViolationStats(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get refund violation stats");
    }
  },
);

// Gross/Net Revenue thunks (replacing monthly revenue)
export const marketingGrossRevenue = createAsyncThunk(
  "marketing/gross-revenue",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getGrossContractRevenue(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get gross revenue");
    }
  },
);

export const marketingNetRevenue = createAsyncThunk(
  "marketing/net-revenue",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getNetContractRevenue(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get net revenue");
    }
  },
);

// Contract Revenue Breakdown for ComposedChart
export const marketingContractRevenueBreakdown = createAsyncThunk(
  "marketing/contract-revenue-breakdown",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getContractRevenueBreakdown(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to get contract revenue breakdown",
      );
    }
  },
);
