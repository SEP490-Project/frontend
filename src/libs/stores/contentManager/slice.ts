import { createSlice } from "@reduxjs/toolkit";
import {
  contents,
  createContent,
  contentDetail,
  updateContent,
  deleteContent,
  publishContent,
  unpublishContent,
} from "./thunk";
import type { Content } from "@/libs/types/content";

interface stateType {
  loading: boolean;
  contents: Content[];
  content: Content | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  error: string | null;
}

const initialState: stateType = {
  loading: false,
  contents: [],
  content: null,
  pagination: null,
  error: null,
};

export const manageContentSlice = createSlice({
  name: "manageContent",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearContent: (state) => {
      state.content = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch contents
      .addCase(contents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(contents.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(contents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create content
      .addCase(createContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.loading = false;
        state.contents.unshift(action.payload.data);
      })
      .addCase(createContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Content detail
      .addCase(contentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(contentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload.data;
      })
      .addCase(contentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update content
      .addCase(updateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contents.findIndex((c) => c.id === action.payload.data.id);
        if (index !== -1) {
          state.contents[index] = action.payload.data;
        }
        if (state.content && state.content.id === action.payload.data.id) {
          state.content = action.payload.data;
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete content
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = state.contents.filter((c) => c.id !== action.meta.arg);
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Publish content
      .addCase(publishContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contents.findIndex((c) => c.id === action.meta.arg);
        if (index !== -1) {
          state.contents[index].status = "posted";
        }
      })
      .addCase(publishContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Unpublish content
      .addCase(unpublishContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unpublishContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contents.findIndex((c) => c.id === action.meta.arg);
        if (index !== -1) {
          state.contents[index].status = "draft";
        }
      })
      .addCase(unpublishContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearContent } = manageContentSlice.actions;
export const { reducer: manageContentReducer, actions: manageContentActions } = manageContentSlice;
