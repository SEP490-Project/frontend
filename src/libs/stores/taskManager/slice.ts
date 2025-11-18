import { createSlice } from "@reduxjs/toolkit";
import {
  getTaskList,
  getTaskDetail,
  assignTask,
  getTaskDetailById,
  updateTaskState,
} from "./thunk";
import type {
  SingleTaskResponse,
  TaskListMarketing,
  TaskListMarketingDetail,
} from "@/libs/types/task";

interface stateType {
  loading: boolean;
  taskListMarketing: TaskListMarketing[];
  taskDetail: TaskListMarketingDetail | null;
  taskDetailById: SingleTaskResponse | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  actionLoading: boolean;
  detailLoading: boolean;
}

const initialState: stateType = {
  loading: false,
  taskListMarketing: [],
  taskDetail: null,
  taskDetailById: null,
  pagination: null,
  actionLoading: false,
  detailLoading: false,
};

export const manageTaskSlice = createSlice({
  name: "manageTask",
  initialState,
  reducers: {
    taskDetailById: (state, action) => {
      state.taskDetailById = action.payload;
    },
    clearTaskDetailById: (state) => {
      state.taskDetailById = null;
    },
    clearTaskDetail: (state) => {
      state.taskDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTaskList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.taskListMarketing = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(getTaskList.rejected, (state) => {
        state.loading = false;
      })

      .addCase(getTaskDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTaskDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetail = action.payload.data || null;
      })
      .addCase(getTaskDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignTask.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getTaskDetailById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(getTaskDetailById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.taskDetailById = action.payload || null;
      })
      .addCase(getTaskDetailById.rejected, (state) => {
        state.detailLoading = false;
      })
      .addCase(updateTaskState.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateTaskState.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update the task in the list if it exists
        const taskIndex = state.taskListMarketing.findIndex(
          (task) => task.id === action.payload.taskId,
        );
        if (taskIndex !== -1) {
          state.taskListMarketing[taskIndex].status = action.payload.state;
        }
        // Update task detail if it matches
        if (state.taskDetail && state.taskDetail.id === action.payload.taskId) {
          state.taskDetail.status = action.payload.state;
        }
        // Update task detail by ID if it matches
        if (state.taskDetailById?.data && state.taskDetailById.data.id === action.payload.taskId) {
          state.taskDetailById.data.status = action.payload.state;
        }
      })
      .addCase(updateTaskState.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export const { clearTaskDetail } = manageTaskSlice.actions;
export const { reducer: manageTaskReducer, actions: manageTaskActions } = manageTaskSlice;
