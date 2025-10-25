import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageContent } from "@/libs/services/manageContent";
import type {
  ContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
  PublishContentParams,
  RejectContentParams,
} from "@/libs/types/content";

export const contents = createAsyncThunk(
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

export const createContent = createAsyncThunk(
  "/contents/create",
  async (req: CreateContentRequest, { rejectWithValue }) => {
    try {
      const response = await manageContent.createContent(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create content");
    }
  },
);

export const contentDetail = createAsyncThunk(
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

export const updateContent = createAsyncThunk(
  "/contents/update",
  async (req: UpdateContentRequest, { rejectWithValue }) => {
    try {
      const response = await manageContent.updateContent(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update content");
    }
  },
);

export const deleteContent = createAsyncThunk(
  "/contents/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageContent.deleteContent(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to delete content");
    }
  },
);

export const publishContent = createAsyncThunk(
  "/contents/publish",
  async (params: PublishContentParams, { rejectWithValue }) => {
    try {
      const response = await manageContent.publishContent(params.id, params.publishDate);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to publish content");
    }
  },
);

// export const unpublishContent = createAsyncThunk(
//   "/contents/unpublish",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await manageContent.unpublishContent(id);
//       return response.data;
//     } catch (error: unknown) {
//       const err = error as AxiosError<{ message: string }>;
//       return rejectWithValue(err.response?.data?.message || "Failed to unpublish content");
//     }
//   },
// );

export const submitContent = createAsyncThunk(
  "/contents/submit",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageContent.submitContent(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to submit content for review");
    }
  },
);

export const approveContent = createAsyncThunk(
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

export const rejectContent = createAsyncThunk(
  "/contents/reject",
  async (params: RejectContentParams, { rejectWithValue }) => {
    try {
      const response = await manageContent.rejectContent(params.id, params.reason);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to reject content");
    }
  },
);
