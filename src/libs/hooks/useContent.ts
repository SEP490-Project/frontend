import { useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/libs/stores";
import type { RootState } from "@/libs/stores";
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
} from "@/libs/stores/contentManager/thunk";
import {
  clearError,
  clearContent,
  clearTikTokCreatorInfo,
  clearGeneratedContent,
  clearStructuredContent,
  clearAIModels,
  startStreaming,
  appendStreamingContent,
  completeStreaming,
  streamingError,
  clearStreaming,
} from "@/libs/stores/contentManager/slice";
import { streamAIContent, streamStructuredContent } from "@/libs/utils/sseService";
import type {
  ContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
  AIGenerateRequest,
  AIStructuredContentRequest,
} from "@/libs/types/content";
import { toast } from "sonner";

export const useContentManager = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    contents: contentList,
    content,
    tikTokCreatorInfo,
    aiModels,
    generatedContent,
    structuredContent,
    isStreaming,
    streamingContent,
    streamingTipTapContent,
    tokensUsed,
    pagination,
    error,
  } = useSelector((state: RootState) => state.manageContent);

  // Store abort controller for streaming
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchContents = useCallback(
    (params: ContentListParams) => {
      return dispatch(contents(params));
    },
    [dispatch],
  );

  const createNewContent = useCallback(
    (data: CreateContentRequest) => {
      return dispatch(createContent(data));
    },
    [dispatch],
  );

  const fetchContentDetail = useCallback(
    (id: string) => {
      return dispatch(contentDetail(id));
    },
    [dispatch],
  );

  const updateExistingContent = useCallback(
    (data: UpdateContentRequest) => {
      return dispatch(updateContent(data));
    },
    [dispatch],
  );

  const removeContent = useCallback(
    (id: string) => {
      return dispatch(deleteContent(id));
    },
    [dispatch],
  );

  const publishExistingContent = useCallback(
    (id: string, publishDate?: string) => {
      return dispatch(publishContent({ id, publishDate }));
    },
    [dispatch],
  );

  // const unpublishExistingContent = useCallback(
  //   (id: string) => {
  //     return dispatch(unpublishContent(id));
  //   },
  //   [dispatch],
  // );

  const submitExistingContent = useCallback(
    (id: string) => {
      return dispatch(submitContent(id));
    },
    [dispatch],
  );

  const approveExistingContent = useCallback(
    (id: string) => {
      return dispatch(approveContent(id));
    },
    [dispatch],
  );

  const rejectExistingContent = useCallback(
    (id: string, feedback: string) => {
      return dispatch(rejectContent({ id, feedback }));
    },
    [dispatch],
  );

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrentContent = useCallback(() => {
    dispatch(clearContent());
  }, [dispatch]);

  const fetchTikTokCreatorInfo = useCallback(() => {
    return dispatch(getTikTokCreatorInfo());
  }, [dispatch]);

  const clearTikTokCreator = useCallback(() => {
    dispatch(clearTikTokCreatorInfo());
  }, [dispatch]);

  // AI Content Generation Functions
  const generateAIContentHook = useCallback(
    (data: AIGenerateRequest) => {
      return dispatch(generateAIContent(data));
    },
    [dispatch],
  );

  const generateStructuredContentHook = useCallback(
    (data: AIStructuredContentRequest) => {
      return dispatch(generateStructuredContent(data));
    },
    [dispatch],
  );

  const fetchSupportedAIModels = useCallback(() => {
    return dispatch(getSupportedAIModels());
  }, [dispatch]);

  const clearAIGeneratedContent = useCallback(() => {
    dispatch(clearGeneratedContent());
  }, [dispatch]);

  const clearAIStructuredContent = useCallback(() => {
    dispatch(clearStructuredContent());
  }, [dispatch]);

  const clearAIModelsList = useCallback(() => {
    dispatch(clearAIModels());
  }, [dispatch]);

  // Streaming AI Content Generation Functions
  const streamAIContentHook = useCallback(
    async (data: Omit<AIGenerateRequest, "stream">) => {
      // Cancel any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      dispatch(startStreaming());

      try {
        abortControllerRef.current = await streamAIContent(
          data.prompt,
          data.model,
          data.json_mode,
          {
            onMessage: (content, usage) => {
              dispatch(appendStreamingContent({ content, usage }));
            },
            onComplete: (fullContent) => {
              dispatch(completeStreaming({ content: fullContent, isStructured: false }));
              toast.success("AI content generated!", {
                description: "Your content has been successfully generated.",
                duration: 4000,
              });
            },
            onError: (error) => {
              dispatch(streamingError(error.message));
              toast.error("Failed to generate AI content", {
                description: error.message,
                duration: 4000,
              });
            },
            onHeartbeat: () => {
              // Heartbeat received - connection is alive
            },
          },
        );
      } catch (error) {
        dispatch(streamingError((error as Error).message));
        toast.error("Failed to start AI content stream", {
          description: (error as Error).message,
          duration: 4000,
        });
      }
    },
    [dispatch],
  );

  const streamStructuredContentHook = useCallback(
    async (data: Omit<AIStructuredContentRequest, "stream">) => {
      // Cancel any existing stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      dispatch(startStreaming());

      try {
        abortControllerRef.current = await streamStructuredContent(
          data.context,
          data.model,
          data.platform,
          data.tone,
          {
            onMessage: (content, usage) => {
              dispatch(appendStreamingContent({ content, usage }));
            },
            onComplete: (fullContent) => {
              dispatch(completeStreaming({ content: fullContent, isStructured: true }));
              toast.success("Structured content generated!", {
                description: "Your structured content has been successfully generated.",
                duration: 4000,
              });
            },
            onError: (error) => {
              dispatch(streamingError(error.message));
              toast.error("Failed to generate structured content", {
                description: error.message,
                duration: 4000,
              });
            },
            onHeartbeat: () => {
              // Heartbeat received - connection is alive
            },
          },
        );
      } catch (error) {
        dispatch(streamingError((error as Error).message));
        toast.error("Failed to start structured content stream", {
          description: (error as Error).message,
          duration: 4000,
        });
      }
    },
    [dispatch],
  );

  const cancelStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    dispatch(clearStreaming());
  }, [dispatch]);

  const clearStreamingContent = useCallback(() => {
    dispatch(clearStreaming());
  }, [dispatch]);

  return {
    // State
    loading,
    contentList,
    content,
    tikTokCreatorInfo,
    aiModels,
    generatedContent,
    structuredContent,
    isStreaming,
    streamingContent,
    streamingTipTapContent,
    tokensUsed,
    pagination,
    error,

    // Actions
    fetchContents,
    createNewContent,
    fetchContentDetail,
    updateExistingContent,
    removeContent,
    publishExistingContent,
    // unpublishExistingContent,
    submitExistingContent,
    approveExistingContent,
    rejectExistingContent,
    fetchTikTokCreatorInfo,
    clearErrors,
    clearCurrentContent,
    clearTikTokCreator,

    // AI Functions (non-streaming)
    generateAIContentHook,
    generateStructuredContentHook,
    fetchSupportedAIModels,
    clearAIGeneratedContent,
    clearAIStructuredContent,
    clearAIModelsList,

    // AI Streaming Functions
    streamAIContentHook,
    streamStructuredContentHook,
    cancelStreaming,
    clearStreamingContent,
  };
};
