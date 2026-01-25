export type NotificationSeverity = "INFO" | "WARN" | "ERROR" | "SUCCESS";
export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "RETRYING";
export type NotificationType = "EMAIL" | "PUSH" | "IN_APP" | "ALL";

export interface Notifications {
  id: string;
  user_id: string;
  type: NotificationType;
  severity?: NotificationSeverity;
  status: NotificationStatus;
  is_read: boolean;
  delivery_attempts?: NotificationDeliveryAttempt[] | null;
  recipient_info?: {
    email: string;
    tokens: string[];
  } | null;
  content_data: {
    body: string;
    title: string;
  };
  platform_config?: {
    ios_config?: {
      badge: number;
      sound: string;
    } | null;
    android_config?: {
      color: string;
      priority: string;
    } | null;
  } | null;
  error_details?: {
    error_message: string;
    error_code: string;
    last_attempt_at: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationDeliveryAttempt {
  timestamp: string;
  status: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title?: string;
  body?: string;
  type?: NotificationType;
  severity?: NotificationSeverity;
  data?: Record<string, any>;
  created_at?: string;
  is_read?: boolean;
}
