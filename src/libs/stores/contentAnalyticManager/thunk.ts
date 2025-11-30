import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageContentAnalytic } from "@/libs/services/manageAnalytic";
import { AxiosError } from "axios";

export const contentCampaign = createAsyncThunk(
  "/campaigns",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageContentAnalytic.getContentCampaign(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const contentChannel = createAsyncThunk(
  "/channels",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageContentAnalytic.getContentChannel(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const contentPlatform = createAsyncThunk(
  "/platform",
  async (req: any, { rejectWithValue }) => {
    try {
      const response = await manageContentAnalytic.getContentPlatform(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const contentStatus = createAsyncThunk("/status", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageContentAnalytic.getContentStatus(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const contentTop = createAsyncThunk("/top", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageContentAnalytic.getContentTop(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});

export const contentTrend = createAsyncThunk("/trend", async (req: any, { rejectWithValue }) => {
  try {
    const response = await manageContentAnalytic.getContentTrend(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});
