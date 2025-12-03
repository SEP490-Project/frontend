import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaEye,
  FaClock,
  FaTriangleExclamation,
  FaInfo,
  FaCircleCheck,
} from "react-icons/fa6";
import PWANavigation from "@/components/pwa/PWANavigation";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const SalesNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "New Order Received",
      message: "Order #12345678 has been placed and requires approval.",
      timestamp: "2025-12-03T10:30:00Z",
      read: false,
      action: {
        label: "View Order",
        onClick: () => toast.info("Navigate to order details"),
      },
    },
    {
      id: "2",
      type: "warning",
      title: "Pre-Order Pending",
      message: "Pre-order #87654321 has been waiting for approval for 2 hours.",
      timestamp: "2025-12-03T09:15:00Z",
      read: false,
      action: {
        label: "Review",
        onClick: () => toast.info("Navigate to pre-order"),
      },
    },
    {
      id: "3",
      type: "success",
      title: "Order Delivered",
      message: "Order #11111111 has been successfully delivered to customer.",
      timestamp: "2025-12-03T08:45:00Z",
      read: true,
    },
    {
      id: "4",
      type: "error",
      title: "Delivery Failed",
      message: "Order #22222222 delivery failed. Customer was not available.",
      timestamp: "2025-12-02T16:20:00Z",
      read: true,
      action: {
        label: "Reschedule",
        onClick: () => toast.info("Reschedule delivery"),
      },
    },
  ]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <FaInfo className="w-4 h-4 text-blue-500" />;
      case "warning":
        return <FaTriangleExclamation className="w-4 h-4 text-amber-500" />;
      case "success":
        return <FaCircleCheck className="w-4 h-4 text-green-500" />;
      case "error":
        return <FaTriangleExclamation className="w-4 h-4 text-red-500" />;
      default:
        return <FaBell className="w-4 h-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
    toast.success("Notification marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast.success("Notification deleted");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 hover:bg-red-500">{unreadCount}</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <FaCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <FaBell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-2">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border transition-shadow ${
                !notification.read
                  ? "border-blue-200 bg-blue-50/30 hover:shadow-md"
                  : "hover:shadow-md"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`text-sm font-medium ${
                          !notification.read ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaClock className="w-3 h-3" />
                        <span>{formatTime(notification.timestamp)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {notification.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={notification.action.onClick}
                          >
                            {notification.action.label}
                          </Button>
                        )}

                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <FaEye className="w-3 h-3" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <FaTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* PWA Navigation */}
      <PWANavigation className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default SalesNotifications;
