import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSchedules,
  fetchScheduleDetail,
  cancelSchedule,
  scheduleContent,
  batchScheduleContent,
} from "./thunk";
import type { ScheduleItem, Schedule } from "@/libs/types/schedule";
import { toast } from "sonner";

interface ScheduleState {
  loading: boolean;
  cancelLoading: boolean;
  scheduleLoading: boolean;
  schedules: ScheduleItem[];
  schedule: Schedule | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  error: string | null;
}

const initialState: ScheduleState = {
  loading: false,
  cancelLoading: false,
  scheduleLoading: false,
  schedules: [],
  schedule: null,
  pagination: null,
  error: null,
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSchedule: (state) => {
      state.schedule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;

        const apiResponse = action.payload as any;
        state.schedules = apiResponse.data || [];
        state.pagination = apiResponse.pagination || null;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to fetch schedules", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Fetch schedule detail
      .addCase(fetchScheduleDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduleDetail.fulfilled, (state, action) => {
        state.loading = false;

        state.schedule = (action.payload as any).data as Schedule;
      })
      .addCase(fetchScheduleDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to fetch schedule detail", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Cancel schedule
      .addCase(cancelSchedule.pending, (state) => {
        state.cancelLoading = true;
        state.error = null;
      })
      .addCase(cancelSchedule.fulfilled, (state, action) => {
        state.cancelLoading = false;
        // Update schedule status in list
        const { id } = action.payload;
        const index = state.schedules.findIndex((s) => s.schedule_id === id);
        if (index !== -1) {
          state.schedules[index] = { ...state.schedules[index], status: "CANCELLED" };
        }
        toast.success("Schedule cancelled successfully");
      })
      .addCase(cancelSchedule.rejected, (state, action) => {
        state.cancelLoading = false;
        state.error = action.payload as string;
        toast.error("Failed to cancel schedule", {
          description: action.payload as string,
          duration: 4000,
        });
      })

      // Schedule content
      .addCase(scheduleContent.pending, (state) => {
        state.scheduleLoading = true;
        state.error = null;
      })
      .addCase(scheduleContent.fulfilled, (state) => {
        state.scheduleLoading = false;
        toast.success("Content scheduled successfully");
      })
      .addCase(scheduleContent.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.error = action.payload as string;
        toast.error("Failed to schedule content", {
          description: action.payload as string,
          duration: 4000,
        });
      })

      // Batch schedule content
      .addCase(batchScheduleContent.pending, (state) => {
        state.scheduleLoading = true;
        state.error = null;
      })
      .addCase(batchScheduleContent.fulfilled, (state) => {
        state.scheduleLoading = false;
        toast.success("Content scheduled successfully");
      })
      .addCase(batchScheduleContent.rejected, (state, action) => {
        state.scheduleLoading = false;
        state.error = action.payload as string;
        toast.error("Failed to schedule content", {
          description: action.payload as string,
          duration: 4000,
        });
      });
  },
});

export const { clearError, clearSchedule } = scheduleSlice.actions;
export const scheduleReducer = scheduleSlice.reducer;
export const scheduleActions = scheduleSlice.actions;
