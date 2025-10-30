import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageTag } from "@/libs/services/manageTag";
import type { TagListParams, CreateTagRequest, UpdateTagRequest } from "@/libs/types/tag";

export const tags = createAsyncThunk("/tags", async (req: TagListParams, { rejectWithValue }) => {
  try {
    const response = await manageTag.tags(req);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Failed to fetch tags");
  }
});

export const createTag = createAsyncThunk(
  "/tags/create",
  async (req: CreateTagRequest, { rejectWithValue }) => {
    try {
      const response = await manageTag.createTag(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to create tag");
    }
  },
);

export const tagDetail = createAsyncThunk(
  "/tags/detail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageTag.tagDetail(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tag detail");
    }
  },
);

export const updateTag = createAsyncThunk(
  "/tags/update",
  async (req: { id: string; data: UpdateTagRequest }, { rejectWithValue }) => {
    try {
      const response = await manageTag.updateTag(req.id, req.data);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to update tag");
    }
  },
);

export const deleteTag = createAsyncThunk(
  "/tags/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await manageTag.deleteTag(id);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to delete tag");
    }
  },
);
