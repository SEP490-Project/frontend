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
      return rejectWithValue(err.response?.data?.message || "Thất bại");
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
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const marketingDashboard = createAsyncThunk("/dashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await manageMarketingAnalytic.getMarketingDashboard();
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const marketingDraftCampaign = createAsyncThunk(
  "/draft-campaigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageMarketingAnalytic.getMarketingDraftCampaign();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
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
      return rejectWithValue(err.response?.data?.message || "Thất bại");
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
      return rejectWithValue(err.response?.data?.message || "Thất bại");
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
      return rejectWithValue(err.response?.data?.message || "Thất bại");
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
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
