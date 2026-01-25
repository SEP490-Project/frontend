import { createSlice } from "@reduxjs/toolkit";
import { tags, createTag, tagDetail, updateTag, deleteTag } from "./thunk";
import type { TagResponse, Tag } from "@/libs/types/tag";
import { toast } from "sonner";

interface stateType {
  loading: boolean;
  tags: Tag[];
  tag: Tag | null;
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
  tags: [],
  tag: null,
  pagination: null,
  error: null,
};

export const manageTagSlice = createSlice({
  name: "manageTag",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTag: (state) => {
      state.tag = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tags
      .addCase(tags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tags.fulfilled, (state, action) => {
        state.loading = false;
        const apiResponse = action.payload as TagResponse;
        state.tags = apiResponse.data;
        state.pagination = apiResponse.pagination;
      })
      .addCase(tags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to fetch tags", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Create tag
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        const newTag = action.payload.data as Tag;
        state.tags.unshift(newTag);
        toast.success("Tag created successfully!", {
          description: `"${newTag.name}" has been created.`,
          duration: 4000,
        });
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to create tag", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Tag detail
      .addCase(tagDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(tagDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.tag = action.payload.data as Tag;
      })
      .addCase(tagDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to fetch tag detail", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Update tag
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTag = action.payload.data as Tag;
        const index = state.tags.findIndex((t) => t.id === updatedTag.id);
        if (index !== -1) {
          state.tags[index] = updatedTag;
        }
        if (state.tag && state.tag.id === updatedTag.id) {
          state.tag = updatedTag;
        }
        toast.success("Tag updated successfully!", {
          description: `"${updatedTag.name}" has been updated.`,
          duration: 4000,
        });
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update tag", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Delete tag
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTag = state.tags.find((t) => t.id === action.meta.arg);
        state.tags = state.tags.filter((t) => t.id !== action.meta.arg);
        toast.success("Tag deleted successfully!", {
          description: deletedTag
            ? `"${deletedTag.name}" has been removed.`
            : "Tag has been removed.",
          duration: 4000,
        });
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to delete tag", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      });
  },
});

export const { clearError, clearTag } = manageTagSlice.actions;
export const { reducer: manageTagReducer, actions: manageTagActions } = manageTagSlice;
