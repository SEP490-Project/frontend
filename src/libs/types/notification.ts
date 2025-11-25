export interface Notifications {
  id: string;
  user_id: string;
  type: string;
  status: string;
  delivery_attempts: [
    {
      timestamp: string;
      status: string;
    },
  ];
  recipient_info: object;
  content_data: {
    body: string;
    title: string;
  };
  platform_config: {
    ios_config: {
      badge: number;
      sound: string;
    };
    android_config: {
      color: string;
      priority: string;
    };
  };
  error_details: object;
  created_at: string;
  updated_at: string;
}
