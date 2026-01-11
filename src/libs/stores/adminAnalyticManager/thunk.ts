import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageAdminAnalytic } from "@/libs/services/manageAnalytic";
import { AxiosError } from "axios";

export const adminCampaigns = createAsyncThunk("/campaigns", async (_, { rejectWithValue }) => {
  try {
    const response = await manageAdminAnalytic.getAdminCampaignsSummary();
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const adminContracts = createAsyncThunk("/contracts", async (_, { rejectWithValue }) => {
  try {
    const response = await manageAdminAnalytic.getAdminContractsSummary();
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const adminHealth = createAsyncThunk("/health", async (_, { rejectWithValue }) => {
  try {
    const response = await manageAdminAnalytic.getAdminHealth();
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const adminRevenue = createAsyncThunk("/revenue", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageAdminAnalytic.getAdminRevenue(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const adminUserGrowth = createAsyncThunk(
  "/user-growth",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageAdminAnalytic.getAdminUserGrowth(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const adminUserOverview = createAsyncThunk(
  "/user",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageAdminAnalytic.getAdminUsersOverview(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const adminSystemOverview = createAsyncThunk(
  "/system-overview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageAdminAnalytic.getAdminSystemOverview();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);
