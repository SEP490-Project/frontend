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
