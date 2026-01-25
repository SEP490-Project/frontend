import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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
  getTikTokCreatorInfo,
  generateAIContent,
  generateStructuredContent,
  getSupportedAIModels,
} from "./thunk";
import type {
  ContentResponse,
  Content,
  TikTokCreatorInfo,
  AIModel,
  TipTapDocument,
} from "@/libs/types/content";
import { toast } from "sonner";

interface stateType {
  loading: boolean;
  contents: Content[];
  content: Content | null;
  tikTokCreatorInfo: TikTokCreatorInfo | null;
  aiModels: AIModel[];
  generatedContent: string | null;
  structuredContent: {
    title: string;
    content: string | TipTapDocument;
    description?: string;
    tags?: string[];
    excerpt?: string;
  } | null;
  // Streaming state
  isStreaming: boolean;
  streamingContent: string;
  streamingTipTapContent: TipTapDocument | null;
  tokensUsed: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;
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
  tikTokCreatorInfo: null,
  aiModels: [],
  generatedContent: null,
  structuredContent: null,
  // Streaming initial state
  isStreaming: false,
  streamingContent: "",
  streamingTipTapContent: null,
  tokensUsed: null,
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
    clearTikTokCreatorInfo: (state) => {
      state.tikTokCreatorInfo = null;
    },
    clearGeneratedContent: (state) => {
      state.generatedContent = null;
    },
    clearStructuredContent: (state) => {
      state.structuredContent = null;
    },
    clearAIModels: (state) => {
      state.aiModels = [];
    },
    // Streaming reducers
    startStreaming: (state) => {
      state.isStreaming = true;
      state.streamingContent = "";
      state.streamingTipTapContent = null;
      state.tokensUsed = null;
      state.error = null;
    },
    appendStreamingContent: (
      state,
      action: PayloadAction<{
        content: string;
        usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
      }>,
    ) => {
      state.streamingContent += action.payload.content;
      if (action.payload.usage) {
        state.tokensUsed = action.payload.usage;
      }
    },
    completeStreaming: (
      state,
      action: PayloadAction<{ content: string; isStructured?: boolean; title?: string }>,
    ) => {
      state.isStreaming = false;

      // Try to parse as TipTap JSON
      try {
        const parsed = JSON.parse(action.payload.content);
        if (parsed.type === "doc" && Array.isArray(parsed.content)) {
          state.streamingTipTapContent = parsed;
          if (action.payload.isStructured) {
            state.structuredContent = {
              title: action.payload.title || "",
              content: parsed,
            };
          }
        } else {
          // Not a TipTap document, store as string
          if (action.payload.isStructured) {
            state.structuredContent = {
              title: action.payload.title || "",
              content: action.payload.content,
            };
          } else {
            state.generatedContent = action.payload.content;
          }
        }
      } catch {
        // Not JSON, store as string
        if (action.payload.isStructured) {
          state.structuredContent = {
            title: action.payload.title || "",
            content: action.payload.content,
          };
        } else {
          state.generatedContent = action.payload.content;
        }
      }
    },
    streamingError: (state, action: PayloadAction<string>) => {
      state.isStreaming = false;
      state.error = action.payload;
    },
    clearStreaming: (state) => {
      state.isStreaming = false;
      state.streamingContent = "";
      state.streamingTipTapContent = null;
      state.tokensUsed = null;
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
        // Use API response directly
        const apiResponse = action.payload as ContentResponse;
        state.contents = apiResponse.data;
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
        state.contents.unshift(action.payload.data);
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
        // Content detail API returns data object directly
        const apiResponse = action.payload;
        // Handle both array format (data[0]) and object format (data)
        const contentItem = Array.isArray(apiResponse.data)
          ? apiResponse.data[0]
          : apiResponse.data;
        if (contentItem) {
          state.content = contentItem;
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
        const updatedContent = action.payload.data;
        const index = state.contents.findIndex((c) => c.id === updatedContent.id);
        if (index !== -1) {
          state.contents[index] = updatedContent;
        }
        if (state.content && state.content.id === updatedContent.id) {
          state.content = updatedContent;
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
      })

      // Get TikTok Creator Info
      .addCase(getTikTokCreatorInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTikTokCreatorInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.tikTokCreatorInfo = action.payload.data.data;
        toast.success("TikTok creator information loaded!", {
          description: "Successfully retrieved creator profile data.",
          duration: 4000,
        });
      })
      .addCase(getTikTokCreatorInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to load TikTok creator information", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Generate AI Content
      .addCase(generateAIContent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.generatedContent = null;
      })
      .addCase(generateAIContent.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedContent = action.payload.data.content;
        toast.success("AI content generated!", {
          description: "Your content has been successfully generated.",
          duration: 4000,
        });
      })
      .addCase(generateAIContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to generate AI content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Generate Structured Content
      .addCase(generateStructuredContent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.structuredContent = null;
      })
      .addCase(generateStructuredContent.fulfilled, (state, action) => {
        state.loading = false;
        state.structuredContent = action.payload.data;
        toast.success("Structured content generated!", {
          description: "Your structured content has been successfully generated.",
          duration: 4000,
        });
      })
      .addCase(generateStructuredContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Failed to generate structured content", {
          description: "Please check your connection and try again.",
          duration: 4000,
        });
      })

      // Get Supported AI Models
      .addCase(getSupportedAIModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupportedAIModels.fulfilled, (state, action) => {
        state.loading = false;
        state.aiModels = action.payload.data;
        // toast.success("AI models loaded!", {
        //   description: "Available AI models have been loaded.",
        //   duration: 4000,
        // });
      })
      .addCase(getSupportedAIModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // toast.error("Failed to load AI models", {
        //   description: "Please check your connection and try again.",
        //   duration: 4000,
        // });
      });
  },
});

export const {
  clearError,
  clearContent,
  clearTikTokCreatorInfo,
  clearGeneratedContent,
  clearStructuredContent,
  clearAIModels,
  // Streaming actions
  startStreaming,
  appendStreamingContent,
  completeStreaming,
  streamingError,
  clearStreaming,
} = manageContentSlice.actions;
export const { reducer: manageContentReducer, actions: manageContentActions } = manageContentSlice;
