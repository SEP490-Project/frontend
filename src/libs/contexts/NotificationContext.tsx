import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import api from "../api";
import { getRaw } from "../local-storage";

interface NotificationItem {
  id: string;
  title?: string;
  body?: string;
  data?: Record<string, any>;
  created_at?: string;
  read?: boolean;
}

interface NotificationContextValue {
  unreadCount: number;
  notifications: NotificationItem[];
  sseConnected: boolean;
  sseUrl: string | null;
  reconnectSse: () => void;
  fetchInitialUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const noopLog = (name: string) => () =>
  console.warn(`[NotificationContext] ${name} called before provider ready`);

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  notifications: [],
  sseConnected: false,
  sseUrl: null,
  reconnectSse: noopLog("reconnectSse"),
  fetchInitialUnreadCount: async () => {
    console.warn("[NotificationContext] fetchInitialUnreadCount called before provider ready");
  },
  markAsRead: (id: string) =>
    console.warn("[NotificationContext] markAsRead called before provider ready", id),
  clearNotifications: () =>
    console.warn("[NotificationContext] clearNotifications called before provider ready"),
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
  ssePath?: string;
}> = ({ children, ssePath }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [sseConnected, setSseConnected] = useState(false);
  const [sseUrl, setSseUrl] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const backoffRef = useRef<number>(1000);
  const lastLocalIncrementRef = useRef<number | null>(null);
  const unreadRef = useRef<number>(0);

  useEffect(() => {
    unreadRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    try {
      const base = (api?.defaults?.baseURL ?? "").replace(/\/+$/, "");
      const path = ssePath ?? "/notifications/sse";
      const final = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
      setSseUrl(final);
    } catch (err) {
      console.warn("[NotificationContext] build sseUrl failed", err);
      setSseUrl(ssePath ?? null);
    }
  }, [ssePath]);

  const pushNotification = useCallback((n: NotificationItem) => {
    setNotifications((prev) => [n, ...prev].slice(0, 200));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, read: true } : x)));
    setUnreadCount((u) => {
      const next = Math.max(0, u - 1);
      unreadRef.current = next;
      return next;
    });
    api
      .put(`/notifications/${id}/read`)
      .then(() => {
        // noop
      })
      .catch((err) => {
        console.warn("[NotificationContext] markAsRead API failed", err);
      });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    unreadRef.current = 0;
    lastLocalIncrementRef.current = null;
  }, []);

  const fetchInitialUnreadCount = useCallback(async () => {
    if (!api) return;
    try {
      const res = await api.get("/notifications/unread-count");
      const cnt = res?.data?.data?.unread_count ?? res?.data?.unread_count;
      if (typeof cnt === "number") {
        const local = unreadRef.current ?? 0;
        const lastInc = lastLocalIncrementRef.current ?? 0;
        const justInc = Date.now() - lastInc < 3000;
        const final = justInc && local > cnt ? local : cnt;
        setUnreadCount(final);
        unreadRef.current = final;
      } else {
        console.log("[NotificationContext] unread-count returned unexpected shape", res?.data);
      }
    } catch (err) {
      console.warn("[NotificationContext] fetchInitialUnreadCount failed", err);
    }
  }, []);

  const prepareAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    try {
      const defaults: any = api?.defaults?.headers ?? {};
      const cand =
        (defaults?.common && (defaults.common.Authorization || defaults.common.authorization)) ||
        defaults.Authorization ||
        defaults.authorization;
      if (cand) return { Authorization: String(cand) };
      const token = await getRaw("access_token");
      if (!token) return {};
      const val =
        typeof token === "string" && token.toLowerCase().startsWith("bearer ")
          ? token
          : `Bearer ${token}`;
      return { Authorization: val };
    } catch (err) {
      console.warn("[NotificationContext] prepareAuthHeaders failed", err);
      return {};
    }
  }, []);

  const connectSse = useCallback(async () => {
    if (!sseUrl) {
      console.info("[NotificationContext] connectSse skipped: no sseUrl");
      return;
    }

    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (abortErr) {
        console.warn("[NotificationContext] abort previous controller failed", abortErr);
      }
      controllerRef.current = null;
    }

    try {
      const headers = await prepareAuthHeaders();
      const controller = new AbortController();
      controllerRef.current = controller;
      setSseConnected(false);

      backoffRef.current = 1000;

      console.info(
        "[NotificationContext] connectSse ->",
        sseUrl,
        "auth present:",
        !!headers.Authorization,
      );

      await fetchEventSource(sseUrl, {
        signal: controller.signal,
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          ...headers,
        },
        async onopen(res) {
          console.info("[NotificationContext][SSE] onopen", res.status);
          setSseConnected(true);
          setTimeout(() => {
            fetchInitialUnreadCount().catch((err) =>
              console.warn("[NotificationContext] fetchInitialUnreadCount after open failed", err),
            );
          }, 600);
        },
        onmessage(msg) {
          try {
            const raw = (msg && (msg.data ?? "")) || "";
            let payload: any;
            try {
              payload = raw ? JSON.parse(raw) : {};
            } catch {
              payload = raw;
            }

            if (
              typeof payload === "number" ||
              (typeof payload === "string" && !isNaN(Number(payload)))
            ) {
              const cnt = Number(payload);
              const local = unreadRef.current ?? 0;
              const lastInc = lastLocalIncrementRef.current ?? 0;
              const justInc = Date.now() - lastInc < 3000;
              const final = justInc && local > cnt ? local : cnt;
              setUnreadCount(final);
              unreadRef.current = final;
              return;
            }

            const title = payload.title ?? payload.data?.title ?? payload.msg ?? payload.message;
            const body = payload.body ?? payload.data?.body ?? payload.message ?? payload.msg;
            const data = payload.data ?? payload.payload ?? {};
            const isNotif = Boolean(title || body || (data && Object.keys(data).length > 0));

            if (isNotif) {
              const id =
                payload.id ??
                payload.message_id ??
                `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
              const n: NotificationItem = {
                id,
                title,
                body,
                data,
                created_at: new Date().toISOString(),
                read: false,
              };
              pushNotification(n);
              if (typeof payload.unread_count !== "number") {
                setUnreadCount((u) => {
                  const next = u + 1;
                  unreadRef.current = next;
                  lastLocalIncrementRef.current = Date.now();
                  return next;
                });
              }
            }
          } catch (err) {
            console.warn("[NotificationContext][SSE] onmessage parse error", err);
          }
        },
        onclose() {
          console.info("[NotificationContext][SSE] closed by server");
          setSseConnected(false);
          if (reconnectTimerRef.current == null) {
            const delay = Math.min(backoffRef.current, 30000);
            reconnectTimerRef.current = globalThis.setTimeout(() => {
              reconnectTimerRef.current = null;
              backoffRef.current = Math.min(backoffRef.current * 1.8, 30000);
              connectSse();
            }, delay) as unknown as number;
          }
        },
        onerror(err) {
          console.warn("[NotificationContext][SSE] error", err);
          setSseConnected(false);
          if (controller.signal.aborted) return;
          if (reconnectTimerRef.current == null) {
            const delay = Math.min(backoffRef.current, 30000);
            reconnectTimerRef.current = globalThis.setTimeout(() => {
              reconnectTimerRef.current = null;
              backoffRef.current = Math.min(backoffRef.current * 1.8, 30000);
              connectSse();
            }, delay) as unknown as number;
          }
        },
      });
    } catch (err) {
      console.warn("[NotificationContext] connectSse failed", err);
      setSseConnected(false);
      if (reconnectTimerRef.current == null) {
        const delay = Math.min(backoffRef.current, 30000);
        reconnectTimerRef.current = globalThis.setTimeout(() => {
          reconnectTimerRef.current = null;
          backoffRef.current = Math.min(backoffRef.current * 1.8, 30000);
          connectSse();
        }, delay) as unknown as number;
      }
    }
  }, [sseUrl, prepareAuthHeaders, fetchInitialUnreadCount, pushNotification]);

  const disconnectSse = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    try {
      controllerRef.current?.abort();
    } catch (err) {
      console.warn("[NotificationContext] abort controller failed on disconnect", err);
    }
    controllerRef.current = null;
    setSseConnected(false);
  }, []);

  useEffect(() => {
    if (!sseUrl) return;
    connectSse();
    return () => {
      disconnectSse();
    };
  }, [sseUrl, connectSse, disconnectSse]);

  const reconnectSse = useCallback(() => {
    disconnectSse();
    backoffRef.current = 1000;
    setTimeout(() => connectSse(), 300);
  }, [connectSse, disconnectSse]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        sseConnected,
        sseUrl,
        reconnectSse,
        fetchInitialUnreadCount,
        markAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
