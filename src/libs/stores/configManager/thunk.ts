import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageConfig } from "@/libs/services/manageConfig";

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
