import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageMarketingAnalytic } from "@/libs/services/manageMarketingAnalytic";
import { AxiosError } from "axios";

export const dashboard = createAsyncThunk("/dashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await manageMarketingAnalytic.getMarketingDashboard({});
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Thất bại");
  }
});
