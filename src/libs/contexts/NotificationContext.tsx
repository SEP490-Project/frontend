import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { subscribeToNotifications } from "@/libs/utils/sseService.ts";
import api from "../api";
import { useAppDispatch } from "@/libs/stores";
import { manageNotificationActions } from "@/libs/stores/notificationManager/slice";
import type {
  NotificationItem,
  Notifications,
  NotificationSeverity,
  NotificationType,
} from "@/libs/types/notification";
import { toast } from "sonner";
import { NotificationToast, type NotificationPayload } from "@/components/global";

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

const noopLog = (name: string, args?: any) => () =>
  console.warn(`[NotificationContext] ${name} called before provider ready`, args);

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  notifications: [],
  sseConnected: false,
  sseUrl: null,
  reconnectSse: noopLog("reconnectSse"),
  fetchInitialUnreadCount: async () => {
    noopLog("fetchInitialUnreadCount")();
  },
  markAsRead: (id: string) => noopLog("markAsRead", id)(),
  clearNotifications: () => noopLog("clearNotifications")(),
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
  ssePath?: string;
  isAuthenticated?: boolean;
}> = ({ children, ssePath, isAuthenticated = false }) => {
  const dispatch = useAppDispatch();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [sseConnected, setSseConnected] = useState(false);
  const [sseUrl, setSseUrl] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const backoffRef = useRef<number>(1000);
  const lastLocalIncrementRef = useRef<number | null>(null);
  const unreadRef = useRef<number>(0);
  const watchdogTimerRef = useRef<number | null>(null);

  const isAuthenticatedRef = useRef<boolean>(isAuthenticated);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    unreadRef.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    try {
      setSseUrl(ssePath ?? "/notifications/sse");
    } catch (err) {
      console.warn("[NotificationContext] build sseUrl failed", err);
      setSseUrl(ssePath ?? null);
    }
  }, [ssePath]);

  const pushNotification = useCallback((n: NotificationItem) => {
    setNotifications((prev) => [n, ...prev].slice(0, 200));
  }, []);

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, is_read: true } : x)));

      setUnreadCount((u) => {
        const next = Math.max(0, u - 1);
        unreadRef.current = next;
        return next;
      });

      dispatch(manageNotificationActions.markAsReadLocally(id));

      api.put(`/notifications/${id}/read`).catch((err) => {
        console.warn("[NotificationContext] markAsRead API failed", err);
      });
    },
    [dispatch],
  );

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

  const disconnectSse = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    try {
      controllerRef.current?.abort();
    } catch (err) {
      console.warn("[NotificationContext] abort controller failed on disconnect", err);
    }
    controllerRef.current = null;
    setSseConnected(false);
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (!isAuthenticatedRef.current) return;
    if (reconnectTimerRef.current != null) return;

    const delay = Math.min(backoffRef.current, 30000);
    reconnectTimerRef.current = globalThis.setTimeout(() => {
      reconnectTimerRef.current = null;
      backoffRef.current = Math.min(backoffRef.current * 1.8, 30000);
      if (isAuthenticatedRef.current) {
        connectSse();
      }
    }, delay) as unknown as number;
  }, []);

  const resetWatchdog = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
    }

    // Set timeout for 60 seconds
    // If no ping is received within this time, we reconnect.
    watchdogTimerRef.current = globalThis.setTimeout(() => {
      console.warn("[NotificationContext] No heartbeat received. Connection dead. Reconnecting...");
      disconnectSse();
      scheduleReconnect();
    }, 60000) as unknown as number;
  }, [disconnectSse, scheduleReconnect]);

  const connectSse = useCallback(async () => {
    if (!sseUrl || !isAuthenticatedRef.current) return;

    // Clean up existing controller
    if (controllerRef.current) {
      try {
        controllerRef.current.abort();
      } catch (abortErr) {
        console.warn("[NotificationContext] abort previous controller failed", abortErr);
      }
      controllerRef.current = null;
    }

    try {
      setSseConnected(true); // Optimistic connected state

      // 3. Use the Service
      const controller = await subscribeToNotifications(sseUrl, {
        onMessage: (payload) => {
          if (!isAuthenticatedRef.current) return;
          resetWatchdog();
          console.log("[NotificationContext][SSE] message received", payload);

          // Handle pure number (unread count update)
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

          // Handle Object payload
          // Backend keys: { title, message (or body), type, data, created_at, id }
          const title = payload.title || payload.data?.title || payload.msg || "New Notification";
          const body = payload.body || payload.message || payload.data?.body || payload.msg;
          const data = payload.data || payload.payload || {};
          const isNotif = Boolean(title || body || (data && Object.keys(data).length > 0));

          if (isNotif) {
            backoffRef.current = 1000; // Reset backoff on success

            const id =
              payload.id ??
              payload.message_id ??
              `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

            const now = new Date().toISOString();

            // 4. Trigger Toast
            const toastPayload: NotificationPayload = {
              id,
              title,
              body,
              type: payload.severity || "INFO",
              created_at: now,
              data: data,
            };
            toast.custom(
              (t) => (
                <NotificationToast
                  t={t}
                  payload={toastPayload}
                  onNavigate={(notifId) => {
                    console.log("Navigating to", notifId);
                    window.location.href = "/manage/notification";
                  }}
                />
              ),
              {
                duration: 5000,
                unstyled: true,
                classNames: {
                  toast: "!bg-transparent !p-0 !border-0 !shadow-none",
                },
              },
            );

            // 1. Context Item
            const n: NotificationItem = {
              id,
              user_id: payload.user_id,
              title,
              type: payload.type || "IN_APP",
              severity: payload.severity || "INFO",
              body,
              data,
              created_at: now,
              is_read: false,
            };
            pushNotification(n);

            // 2. Redux Item
            const reduxItem: Notifications = {
              id,
              user_id: payload.user_id || "",
              type: (payload.type || "IN_APP") as NotificationType,
              severity: payload.severity as NotificationSeverity,
              status: "SENT",
              is_read: false,
              content_data: {
                title: title,
                body: body,
              },
              created_at: now,
              updated_at: now,
            };

            dispatch(manageNotificationActions.addNotificationFromSSE(reduxItem));
          }
        },
        onClose: () => {
          console.info("[NotificationContext][SSE] closed by server");
          setSseConnected(false);
          if (controller.signal.aborted) return;
          scheduleReconnect();
        },
        onComplete: () => {
          console.log("[NotificationContext][SSE] connection closed");
          setSseConnected(false);
          scheduleReconnect();
        },
        onError: (err) => {
          console.error("[NotificationContext][SSE] onerror", err);
          setSseConnected(false);
          if (controller.signal.aborted) return;
          scheduleReconnect();
        },
        onHeartbeat: () => {
          setSseConnected(true);
          resetWatchdog();
        },
      });

      controllerRef.current = controller;

      // Fetch initial count shortly after connection
      setTimeout(() => {
        fetchInitialUnreadCount().catch((err) =>
          console.warn("[NotificationContext] fetchInitialUnreadCount after open failed", err),
        );
      }, 600);
    } catch (err) {
      console.warn("[NotificationContext] connectSse failed", err);
      setSseConnected(false);
      scheduleReconnect();
    }
  }, [
    sseUrl,
    fetchInitialUnreadCount,
    pushNotification,
    scheduleReconnect,
    dispatch,
    resetWatchdog,
  ]);

  useEffect(() => {
    if (!sseUrl || !isAuthenticated) {
      disconnectSse();
      return;
    }
    connectSse();
    return () => {
      disconnectSse();
    };
  }, [sseUrl, isAuthenticated, connectSse, disconnectSse]);

  const reconnectSse = useCallback(() => {
    if (!isAuthenticatedRef.current) return;
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
