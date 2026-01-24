import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageBrandAnalytic } from "@/libs/services/manageAnalytic";
import { AxiosError } from "axios";

export const brandAffiliates = createAsyncThunk(
  "/affiliates",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getBrandAffiliate(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const brandCampaigns = createAsyncThunk(
  "/campaigns",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getBrandCampaign(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const brandContent = createAsyncThunk("/content", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageBrandAnalytic.getBrandContent(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const brandContracts = createAsyncThunk(
  "/contracts",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getBrandContract(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const brandRevenueTrend = createAsyncThunk(
  "/revenue-trend",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getBrandRevenueTrend(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const brandTopProduct = createAsyncThunk(
  "/top-products",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getBrandTopProduct(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const brandTopRatingProducts = createAsyncThunk(
  "brand/top-rating-products",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getBrandTopRatingProducts(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get top rating products");
    }
  },
);

export const brandDashboard = createAsyncThunk(
  "/dashboard",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getBrandDashboard(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

// New dashboard refactor thunks
export const brandContractStatusDistribution = createAsyncThunk(
  "brand/contract-status-distribution",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getContractStatusDistribution(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to get contract status distribution",
      );
    }
  },
);

export const brandTaskStatusDistribution = createAsyncThunk(
  "brand/task-status-distribution",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getTaskStatusDistribution(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to get task status distribution",
      );
    }
  },
);

export const brandRevenueOverTime = createAsyncThunk(
  "brand/revenue-over-time",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getRevenueOverTime(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get revenue over time");
    }
  },
);

export const brandRefundViolationStats = createAsyncThunk(
  "brand/refund-violation-stats",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getRefundViolationStats(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get refund violation stats");
    }
  },
);

export const brandGrossIncome = createAsyncThunk(
  "brand/gross-income",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getGrossIncome(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get gross income");
    }
  },
);

export const brandNetIncome = createAsyncThunk(
  "brand/net-income",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageBrandAnalytic.getNetIncome(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to get net income");
    }
  },
);
