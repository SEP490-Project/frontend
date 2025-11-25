import { createSlice } from "@reduxjs/toolkit";
import { notifications, notificationDetail } from "./thunk";
import type { Notifications } from "@/libs/types/notification";

interface stateType {
  loading: boolean;
  notifications: Notifications[];
  notification: Notifications | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
}

const initialState: stateType = {
  loading: false,
  notifications: [],
  notification: null,
  pagination: null,
};

export const manageNotificationSlice = createSlice({
  name: "manageNotification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(notifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(notifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(notifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(notificationDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(notificationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action.payload.data;
      })
      .addCase(notificationDetail.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { reducer: manageNotificationReducer, actions: manageNotificationActions } =
  manageNotificationSlice;
