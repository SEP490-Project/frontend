import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageSchedule } from "@/libs/services/manageSchedule";
import type {
  ScheduleFilterParams,
  ScheduleContentRequest,
  BatchScheduleRequest,
} from "@/libs/types/schedule";

export const fetchSchedules = createAsyncThunk(
  "schedules/fetchSchedules",
  async (params: ScheduleFilterParams, { rejectWithValue }) => {
    try {
      const response = await manageSchedule.listSchedules(params);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch schedules");
    }
  },
);

export const fetchScheduleDetail = createAsyncThunk(
  "schedules/fetchScheduleDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageSchedule.getSchedule(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch schedule detail");
    }
  },
);

export const cancelSchedule = createAsyncThunk(
  "schedules/cancelSchedule",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageSchedule.cancelSchedule(id);
      return { id, data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to cancel schedule");
    }
  },
);

export const scheduleContent = createAsyncThunk(
  "schedules/scheduleContent",
  async (data: ScheduleContentRequest, { rejectWithValue }) => {
    try {
      const response = await manageSchedule.scheduleContent(data);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to schedule content");
    }
  },
);

export const batchScheduleContent = createAsyncThunk(
  "schedules/batchScheduleContent",
  async (data: BatchScheduleRequest, { rejectWithValue }) => {
    try {
      const response = await manageSchedule.batchScheduleContent(data);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to schedule content");
    }
  },
);
