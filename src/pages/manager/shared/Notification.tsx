import React, { useEffect, useState } from "react";
import { FaRegBell, FaClock, FaCircleCheck, FaCircleXmark, FaCircleInfo } from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import { useNotificationStore } from "@/libs/hooks/useNotification";
import { useNotificationContext } from "@/libs/contexts/NotificationContext";
import { notifications as getNotifications } from "@/libs/stores/notificationManager/thunk";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PaginationTable from "@/components/global/PaginationTable";
import { getItem } from "@/libs/local-storage";
import { cn } from "@/libs/utils";

const PAGE_SIZE = 10;

const getSeverityConfig = (severity?: string) => {
  switch (severity?.toUpperCase()) {
    case "SUCCESS":
      return {
        icon: <FaCircleCheck className="h-5 w-5" />,
        borderColor: "border-l-emerald-500",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      };
    case "ERROR":
      return {
        icon: <FaCircleXmark className="h-5 w-5" />,
        borderColor: "border-l-red-500",
        iconBg: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
      };
    case "WARN":
      return {
        icon: <FaCircleInfo className="h-5 w-5" />,
        borderColor: "border-l-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
      };
    default: // "INFO" or undefined
      return {
        icon: <FaRegBell className="h-5 w-5" />,
        borderColor: "border-l-primary",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
      };
  }
};

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const filterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const NotificationPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [hasReadFilter, setHasReadFilter] = useState<string>("NONE");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const dispatch = useAppDispatch();
  const { notifications, loading, pagination } = useNotificationStore();
  const { markAsRead } = useNotificationContext();
  const user = getItem<{ id: string }>("user");

  useEffect(() => {
    const params: Record<string, any> = {
      page,
      limit: PAGE_SIZE,
      user_id: user?.id,
      type: "IN_APP", // Luôn filter IN_APP
      ...(hasReadFilter !== "NONE" && { is_read: hasReadFilter }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    };

    dispatch(getNotifications(params as any));
  }, [dispatch, page, hasReadFilter, startDate, endDate, user?.id]);

  useEffect(() => {
    setPage(1);
  }, [hasReadFilter, startDate, endDate]);
  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.total_pages) {
      setPage(newPage);
    }
  };

  const handleResetFilters = () => {
    setHasReadFilter("NONE");
    setStartDate("");
    setEndDate("");
  };

  const handleNotificationClick = (id: string, is_read: boolean) => {
    if (!is_read) {
      markAsRead(id);
    }
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.h1 className="text-xl sm:text-2xl font-semibold" variants={itemVariants}>
            Notifications
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Manage all your notifications and alerts
          </motion.p>
        </div>
      </motion.div>

      {/* Filters (không cho chọn Type nữa, chỉ còn các filter khác) */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          {/* Has Read */}
          <motion.div variants={itemVariants}>
            <label className="text-sm text-gray-600 mb-1 block">Has Read</label>
            <Select value={hasReadFilter} onValueChange={setHasReadFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Has Read" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">-- None --</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Start Date */}
          <motion.div variants={itemVariants}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              className="w-full"
              dateFormat="yyyy-MM-dd"
            />
          </motion.div>

          {/* End Date */}
          <motion.div variants={itemVariants}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              className="w-full"
              dateFormat="yyyy-MM-dd"
              minDate={startDate || undefined}
            />
          </motion.div>

          {/* Reset */}
          <motion.div variants={itemVariants}>
            <Button
              variant="secondary"
              className="border-gray-300 w-full h-10"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Notification Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-16 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <span className="text-gray-600">Loading notifications...</span>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.08 },
                  },
                }}
                className="space-y-3"
              >
                {notifications.map((notification) => {
                  const styleConfig = getSeverityConfig(notification.severity);
                  const isRead = notification.is_read;

                  return (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleNotificationClick(notification.id, notification.is_read)}
                      className={cn(
                        "bg-white rounded-lg shadow hover:shadow-md transition-all p-4 border-l-4 cursor-pointer",
                        "group relative",
                        isRead ? "border-l-gray-300 bg-gray-50/50" : styleConfig.borderColor,
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon Section (Matches Toast) */}
                        <div className="shrink-0 mt-1">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105",
                              isRead
                                ? "bg-gray-100 text-gray-400"
                                : cn(styleConfig.iconBg, styleConfig.iconColor),
                            )}
                          >
                            {styleConfig.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Title & Status Header */}
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3
                              className={cn(
                                "font-semibold text-base leading-tight",
                                isRead ? "text-gray-500" : "text-gray-900",
                              )}
                            >
                              {notification.content_data.title}
                            </h3>
                          </div>

                          {/* Body */}
                          <p
                            className={cn(
                              "text-sm mb-3 line-clamp-2",
                              isRead ? "text-gray-400" : "text-gray-600",
                            )}
                          >
                            {notification.content_data.body}
                          </p>

                          {/* Metadata Footer */}
                          <div
                            className={cn(
                              "flex flex-wrap items-center gap-3 text-xs",
                              isRead ? "text-gray-400" : "text-gray-500",
                            )}
                          >
                            {/* Timestamp */}
                            <div className="flex items-center gap-1.5">
                              <FaClock className="h-3 w-3" />
                              <span>{new Date(notification.created_at).toLocaleString()}</span>
                            </div>

                            {/* Unread Indicator Dot */}
                            {!isRead && (
                              <span className="ml-auto flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* No results */}
            {notifications.length === 0 && (
              <motion.div
                className="bg-white rounded-lg shadow p-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaRegBell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-500 mb-4">
                  {startDate || endDate
                    ? "No notifications match your current filters."
                    : "You don't have any notifications yet."}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: notifications.length * 0.08 + 0.2 }}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <PaginationTable
                  page={pagination.page}
                  totalItems={pagination.total}
                  pageSize={PAGE_SIZE}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
