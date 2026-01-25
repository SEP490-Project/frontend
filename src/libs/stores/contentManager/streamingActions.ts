import { toast } from "sonner";
import {
  startStreaming,
  appendStreamingContent,
  completeStreaming,
  streamingError,
  clearStreaming,
} from "./slice";
import { streamAIContent, streamStructuredContent } from "@/libs/utils/sseService";
import type { AppDispatch } from "@/libs/stores";

// Store abort controller for streaming - module level singleton
let abortControllerRef: AbortController | null = null;

/**
 * Stream AI content generation with dispatch
 */
export const streamAIContentAction =
  (data: { prompt: string; model: string; json_mode: boolean }) =>
  async (dispatch: AppDispatch) => {
    // Cancel any existing stream
    if (abortControllerRef) {
      abortControllerRef.abort();
    }

    dispatch(startStreaming());

    try {
      abortControllerRef = await streamAIContent(data.prompt, data.model, data.json_mode, {
        onMessage: (data: any) => {
          const content = data.content || "";
          const usage = data.usage;
          dispatch(appendStreamingContent({ content, usage }));
        },
        onComplete: (fullContent) => {
          if (fullContent == undefined) {
            toast.warning("No content was generated.", {
              description: "No content was generated.",
              duration: 4000,
            });
            return;
          }
          dispatch(completeStreaming({ content: fullContent || "", isStructured: false }));
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
      });
    } catch (error) {
      dispatch(streamingError((error as Error).message));
      toast.error("Failed to start AI content stream", {
        description: (error as Error).message,
        duration: 4000,
      });
    }
  };

/**
 * Stream structured AI content generation with dispatch
 */
export const streamStructuredContentAction =
  (data: { context: string; model: string; platform: string; tone: string }) =>
  async (dispatch: AppDispatch) => {
    // Cancel any existing stream
    if (abortControllerRef) {
      abortControllerRef.abort();
    }

    dispatch(startStreaming());

    try {
      abortControllerRef = await streamStructuredContent(
        data.context,
        data.model,
        data.platform,
        data.tone,
        {
          onMessage: (data: any) => {
            const content = data.content || "";
            const usage = data.usage;
            dispatch(appendStreamingContent({ content, usage }));
          },
          onComplete: (fullContent) => {
            dispatch(completeStreaming({ content: fullContent || "", isStructured: true }));
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
  };

/**
 * Cancel active streaming
 */
export const cancelStreamingAction = () => (dispatch: AppDispatch) => {
  if (abortControllerRef) {
    abortControllerRef.abort();
    abortControllerRef = null;
  }
  dispatch(clearStreaming());
};
