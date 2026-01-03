import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
  reducers: {
    // Action to prepend real-time notifications to the list
    addNotificationFromSSE: (state, action: PayloadAction<Notifications>) => {
      // Only modify if we have a list and are on the first page
      if (state.notifications) {
        // Prevent duplicates
        if (state.notifications.some((n) => n.id === action.payload.id)) return;

        // Prepend new notification
        state.notifications = [action.payload, ...state.notifications];

        // Update pagination count if it exists
        if (state.pagination) {
          state.pagination.total += 1;
        }
      }
    },
    // Action to optimistically mark as read
    markAsReadLocally: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.notifications.findIndex((n) => n.id === id);
      if (index !== -1) {
        state.notifications[index].is_read = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(notifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(notifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data.notifications;
        state.pagination = action.payload.data.pagination;
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
