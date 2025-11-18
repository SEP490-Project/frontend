import manageState from "@/libs/services/manageState";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

const updateTaskStateThunk = createAsyncThunk(
  "tasks/updateTaskState",
  async (
    {
      taskId,
      newState,
    }: { taskId: string; newState: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED" | "RECAP" },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageState.updateTaskState(taskId, newState);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || "Failed to update task state");
    }
  },
);

const updateProductStateThunk = createAsyncThunk(
  "products/updateProductState",
  async (
    {
      productId,
      newState,
    }: {
      productId: string;
      newState: "DRAFT" | "SUBMITTED" | "REVISION" | "APPROVED" | "ACTIVED" | "INACTIVED";
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageState.updateProductState(productId, newState);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || "Failed to update product state");
    }
  },
);

const updatePreOrderStateThunk = createAsyncThunk(
  "preorders/updatePreOrderState",
  async (
    {
      id,
      files,
    }: {
      id: string;
      files: FormData;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageState.updatePreOrderState(id, files);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data.message || "Failed to update pre-order state");
    }
  },
);

export { updateTaskStateThunk, updateProductStateThunk, updatePreOrderStateThunk };
