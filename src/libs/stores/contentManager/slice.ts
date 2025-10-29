import { createSlice } from "@reduxjs/toolkit";
import {
  contents,
  createContent,
  contentDetail,
  updateContent,
  deleteContent,
  publishContent,
  // unpublishContent,
  submitContent,
  approveContent,
  rejectContent,
} from "./thunk";
import type { ContentResponse } from "@/libs/types/content";
import {
  convertApiContentArrayToLegacy,
  convertApiContentToLegacy,
  type LegacyContent,
} from "@/libs/utils/contentConverter";
import { toast } from "sonner";

interface stateType {
  loading: boolean;
  contents: LegacyContent[]; // Use legacy format for backward compatibility
  content: LegacyContent | null;
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
        // Convert new API format to legacy format for backward compatibility
        const apiResponse = action.payload as ContentResponse;
        state.contents = convertApiContentArrayToLegacy(apiResponse.data);
        state.pagination = apiResponse.pagination;
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
        const legacyContent = convertApiContentToLegacy(action.payload.data);
        state.contents.unshift(legacyContent);
        toast.success("Content created successfully!", {
          description: "Your content has been saved and is ready for review.",
          duration: 4000,
        });
      })
      .addCase(createContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to create content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Content detail
      .addCase(contentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(contentDetail.fulfilled, (state, action) => {
        state.loading = false;
        // Content detail API returns an array with single item, extract the first one
        const apiResponse = action.payload as ContentResponse;
        const contentItem = apiResponse.data[0];
        if (contentItem) {
          state.content = convertApiContentToLegacy(contentItem);
        }
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
        const legacyContent = convertApiContentToLegacy(action.payload.data);
        const index = state.contents.findIndex((c) => c.id === legacyContent.id);
        if (index !== -1) {
          state.contents[index] = legacyContent;
        }
        if (state.content && state.content.id === legacyContent.id) {
          state.content = legacyContent;
        }
        toast.success("Content updated successfully!", {
          description: "Your content has been updated and is ready for review.",
          duration: 4000,
        });
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to update content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Delete content
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.loading = false;
        const deletedContent = state.contents.find((c) => c.id === action.meta.arg);
        state.contents = state.contents.filter((c) => c.id !== action.meta.arg);
        toast.success("Content deleted successfully!", {
          description: deletedContent
            ? `"${deletedContent.title}" has been removed.`
            : "Content has been removed.",
          duration: 4000,
        });
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to delete content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Publish content
      .addCase(publishContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishContent.fulfilled, (state, action) => {
        state.loading = false;
        const contentId =
          typeof action.meta.arg === "string" ? action.meta.arg : action.meta.arg.id;
        const index = state.contents.findIndex((c) => c.id === contentId);
        if (index !== -1) {
          state.contents[index].status = "posted";
        }
        toast.success("Content published successfully!", {
          description: "Your content is now live and visible to your audience.",
          duration: 4000,
        });
      })
      .addCase(publishContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to publish content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Unpublish content
      // .addCase(unpublishContent.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(unpublishContent.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const index = state.contents.findIndex((c) => c.id === action.meta.arg);
      //   if (index !== -1) {
      //     state.contents[index].status = "draft";
      //   }
      // })
      // .addCase(unpublishContent.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // Submit content for approval
      .addCase(submitContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contents.findIndex((c) => c.id === action.meta.arg);
        if (index !== -1) {
          state.contents[index].status = "pending";
        }
        toast.success("Content submitted for review!", {
          description: "Your content has been submitted and is awaiting approval.",
          duration: 4000,
        });
      })
      .addCase(submitContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to submit content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Approve content
      .addCase(approveContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contents.findIndex((c) => c.id === action.meta.arg);
        if (index !== -1) {
          state.contents[index].status = "posted";
        }
        toast.success("Content approved successfully!", {
          description: "The content has been approved and is now live.",
          duration: 4000,
        });
      })
      .addCase(approveContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to approve content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Reject content
      .addCase(rejectContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectContent.fulfilled, (state, action) => {
        state.loading = false;
        const contentId = action.meta.arg.id;
        const index = state.contents.findIndex((c) => c.id === contentId);
        if (index !== -1) {
          state.contents[index].status = "draft";
        }
        toast.success("Content rejected successfully!", {
          description: "The content has been rejected and sent back to draft status.",
          duration: 4000,
        });
      })
      .addCase(rejectContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to reject content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      });
  },
});

export const { clearError, clearContent } = manageContentSlice.actions;
export const { reducer: manageContentReducer, actions: manageContentActions } = manageContentSlice;
