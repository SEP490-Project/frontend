import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContract } from "@/libs/services/manageContract";

export const contract = createAsyncThunk(
  "/contracts",
  async (
    req: {
      brand_id?: string;
      type?: string;
      status?: string;
      keyword?: string;
      start_date?: string;
      end_date?: string;
      page: number;
      limit: number;
      sort_by: string;
      order: "asc" | "desc";
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageContract.brand(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
