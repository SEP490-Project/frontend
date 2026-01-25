import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageNotification } from "@/libs/services/manageNotification";

export const notifications = createAsyncThunk(
  "/notifications",
  async (
    req: {
      page: number;
      limit: number;
      user_id?: string;
      type?: string;
      status?: string;
      is_read?: boolean;
      start_date?: string;
      end_date?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageNotification.notifications(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

export const notificationDetail = createAsyncThunk(
  "/notifications/detail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageNotification.notificationDetail(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);
