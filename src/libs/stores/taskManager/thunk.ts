import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { manageTask } from "@/libs/services/manageTask";
import type { SingleTaskResponse } from "@/libs/task";

export const getTaskList = createAsyncThunk(
  "/tasks",
  async (
    req: {
      page: number;
      limit: number;
      created_by_id?: string;
      assigned_to_id?: string;
      milestone_id?: string;
      campaign_id?: string;
      contract_id?: string;
      deadline_from_date?: string;
      deadline_to_date?: string;
      updated_from_date?: string;
      updated_to_date?: string;
      status?: string;
      type?: string;
      sort_by?: string;
      sort_order?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await manageTask.getTaskListMarketing(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const getTaskDetail = createAsyncThunk(
  "/tasks/id",
  async (req: string, { rejectWithValue }) => {
    try {
      const response = await manageTask.getTaskDetailMarketing(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const assignTask = createAsyncThunk(
  "/tasks/assign",
  async (req: { task_id: string; user_id: string }, { rejectWithValue }) => {
    try {
      const response = await manageTask.assignTask(req);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const getTaskDetailById = createAsyncThunk(
  "/tasks/get-by-id",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await manageTask.getTaskById(taskId);
      return response.data as SingleTaskResponse;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);

export const updateTaskState = createAsyncThunk(
  "/tasks/update-state",
  async (req: { taskId: string; state: string }, { rejectWithValue }) => {
    try {
      const response = await manageTask.updateTaskState(req.taskId, req.state);
      return { taskId: req.taskId, state: req.state, response: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Thất bại");
    }
  },
);
