import { getRaw } from "../local-storage";

export interface SSEStreamCallbacks<T = any> {
  onMessage: (data: T) => void;
  onComplete: (accumulated?: string) => void;
  onError: (error: Error) => void;
  onHeartbeat?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Shared logic to parse a line.
 * Returns { type: 'heartbeat' } OR the parsed JSON object OR { content: string }
 */
const parseSSEData = (dataLine: string): any => {
  try {
    if (dataLine === "ping") return { type: "heartbeat" };
    return JSON.parse(dataLine);
  } catch {
    return { content: dataLine };
  }
};

/**
 * CORE FUNCTION: Handles the fetch, auth, and stream reading
 */
async function coreStreamConnection(
  url: string,
  options: {
    method: "GET" | "POST";
    body?: any;
    onData: (parsed: any) => void; // Callback for every valid JSON chunk
    onComplete: () => void;
    onError: (err: Error) => void;
    onHeartbeat?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
  },
): Promise<AbortController> {
  const abortController = new AbortController();
  const baseUrl = import.meta.env.VITE_API_URL;
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedUrl = url.startsWith("/") ? url.slice(1) : url;
  const fullUrl = `${normalizedBaseUrl}${normalizedUrl}`;

  // Get auth token
  const token = getRaw("access_token");

  try {
    const response = await fetch(fullUrl, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: abortController.signal,
    });

    if (!response.ok) {
      // If 401, you might want to trigger a global logout here
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body reader available");

    const decoder = new TextDecoder();
    let buffer = "";

    // Non-blocking loop
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            options.onComplete();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const messages = buffer.split("\n\n");
          buffer = messages.pop() || "";

          for (const message of messages) {
            if (!message.trim()) continue;

            const lines = message.split("\n");
            let eventType = "message";
            let dataContent = "";

            for (const line of lines) {
              if (line.startsWith("event:")) eventType = line.slice(6).trim();
              else if (line.startsWith("data:")) dataContent = line.slice(5).trim();
            }

            if (eventType === "heartbeat" || dataContent === "ping") {
              options.onHeartbeat?.();
              continue;
            }

            if (eventType === "connected") {
              options.onOpen?.();
              continue;
            }

            if (dataContent) {
              const parsed = parseSSEData(dataContent);
              options.onData(parsed);
            }
          }
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          options.onError(error as Error);
        }
      }
    })();
  } catch (error) {
    options.onError(error as Error);
  }

  return abortController;
}

export const createAIStreamingConnection = async (
  url: string,
  body: Record<string, any>,
  callbacks: SSEStreamCallbacks<string>, // Expects string updates
): Promise<AbortController> => {
  let accumulatedContent = "";

  return coreStreamConnection(url, {
    method: "POST",
    body,
    onHeartbeat: callbacks.onHeartbeat,
    onError: callbacks.onError,
    onComplete: () => callbacks.onComplete(accumulatedContent),
    onData: (parsed) => {
      // AI Logic: Extract 'content' field and usage
      if (parsed.content) {
        accumulatedContent += parsed.content;
        // callbacks.onMessage(parsed.content); // Pass string chunks
      }
      callbacks.onMessage(parsed); // Pass string chunks
    },
    onOpen: callbacks.onOpen,
    onClose: callbacks.onClose,
  });
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
  return createAIStreamingConnection(
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
  return createAIStreamingConnection(
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

export const subscribeToNotifications = async (
  url: string,
  callbacks: SSEStreamCallbacks<any>,
): Promise<AbortController> => {
  return coreStreamConnection(url, {
    method: "GET",
    onHeartbeat: callbacks.onHeartbeat,
    onError: callbacks.onError,
    onComplete: () => callbacks.onComplete(),
    onData: (parsed) => callbacks.onMessage(parsed),
    onOpen: callbacks.onOpen,
    onClose: callbacks.onClose,
  });
};
