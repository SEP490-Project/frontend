import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContent } from "@/libs/services/manageContent";
import type { ContentListParams, RejectContentParams } from "@/libs/types/content";

export const marketingContents = createAsyncThunk(
  "/contents",
  async (req: ContentListParams, { rejectWithValue }) => {
    try {
      const response = await manageContent.contents(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch contents");
    }
  },
);

export const marketingContentDetail = createAsyncThunk(
  "/contents/detail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageContent.contentDetail(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch content detail");
    }
  },
);

export const marketingApproveContent = createAsyncThunk(
  "/contents/approve",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageContent.approveContent(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to approve content");
    }
  },
);

export const marketingRejectContent = createAsyncThunk(
  "/contents/reject",
  async (params: RejectContentParams, { rejectWithValue }) => {
    try {
      const response = await manageContent.rejectContent(params.id, params.feedback);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to reject content");
    }
  },
);
