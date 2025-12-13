import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageConfig } from "@/libs/services/manageConfig";

export const getAllConfigs = createAsyncThunk("configs/get-all", async (_, { rejectWithValue }) => {
  try {
    const response = await manageConfig.getAllConfigs();
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const getRepresentativeConfig = createAsyncThunk(
  "/configs/representative",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageConfig.getRepresentativeConfig();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const getTermsOfService = createAsyncThunk(
  "configs/terms-of-service",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageConfig.getTermsOfService();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const getPrivacyPolicy = createAsyncThunk(
  "configs/privacy-policy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await manageConfig.getPrivacyPolicy();
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const updateConfig = createAsyncThunk(
  "configs/update",
  async ({ key, value }: { key: string; value: string }, { rejectWithValue }) => {
    try {
      const response = await manageConfig.updateConfig(key, value);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const bulkUpdateConfigs = createAsyncThunk(
  "configs/bulk-update",
  async (configs: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await manageConfig.bulkUpdateConfigs(configs);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
