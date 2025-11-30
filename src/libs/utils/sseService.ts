import { getRaw } from "../local-storage";

export interface SSEMessage {
  event: string;
  data: any;
}

export interface SSEStreamCallbacks {
  onMessage: (
    content: string,
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number },
  ) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
  onHeartbeat?: () => void;
}

/**
 * Parse SSE data line - handles JSON parsing of the data field
 */
const parseSSEData = (dataLine: string): any => {
  try {
    // Check for ping/heartbeat
    if (dataLine === "ping") {
      return { type: "heartbeat" };
    }
    return JSON.parse(dataLine);
  } catch {
    return { content: dataLine };
  }
};

/**
 * Create and manage an SSE connection for AI content streaming
 */
export const createSSEConnection = async (
  url: string,
  body: Record<string, any>,
  callbacks: SSEStreamCallbacks,
): Promise<AbortController> => {
  const abortController = new AbortController();
  const baseUrl = import.meta.env.VITE_API_URL;
  const fullUrl = `${baseUrl}${url}`;

  // Get auth token
  const token = getRaw("access_token");

  let accumulatedContent = "";

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Stream complete
            callbacks.onComplete(accumulatedContent);
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages (separated by double newlines)
          const messages = buffer.split("\n\n");
          buffer = messages.pop() || ""; // Keep incomplete message in buffer

          for (const message of messages) {
            if (!message.trim()) continue;

            const lines = message.split("\n");
            let eventType = "message";
            let dataContent = "";

            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventType = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                dataContent = line.slice(5).trim();
              }
            }

            if (eventType === "heartbeat" || dataContent === "ping") {
              callbacks.onHeartbeat?.();
              continue;
            }

            if (eventType === "message" && dataContent) {
              const parsed = parseSSEData(dataContent);

              if (parsed.content) {
                accumulatedContent += parsed.content;
                callbacks.onMessage(parsed.content, parsed.usage);
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          // Stream was intentionally aborted
          callbacks.onComplete(accumulatedContent);
        } else {
          callbacks.onError(error as Error);
        }
      }
    };

    // Start processing the stream
    processStream();
  } catch (error) {
    callbacks.onError(error as Error);
  }

  return abortController;
};

/**
 * Stream AI content generation
 */
export const streamAIContent = (
  prompt: string,
  model: string,
  jsonMode: boolean,
  callbacks: SSEStreamCallbacks,
): Promise<AbortController> => {
  return createSSEConnection(
    "/ai/generate",
    {
      prompt,
      model,
      json_mode: jsonMode,
      stream: true,
    },
    callbacks,
  );
};

/**
 * Stream structured AI content generation
 */
export const streamStructuredContent = (
  context: string,
  model: string,
  platform: string,
  tone: string,
  callbacks: SSEStreamCallbacks,
): Promise<AbortController> => {
  return createSSEConnection(
    "/ai/generate-content",
    {
      context,
      model,
      platform,
      tone,
      stream: true,
    },
    callbacks,
  );
};
