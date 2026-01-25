import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContent } from "@/libs/services/manageContent";
import type { ContentListParams } from "@/libs/types/content";

export const postedContents = createAsyncThunk(
  "/contents/posted",
  async (req: ContentListParams, { rejectWithValue }) => {
    try {
      const response = await manageContent.postedContents(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch posted contents");
    }
  },
);

export const postedContentDetail = createAsyncThunk(
  "/contents/posted/detail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageContent.contentPostedDetail(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch posted content detail",
      );
    }
  },
);
