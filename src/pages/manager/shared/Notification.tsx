import React, { useEffect, useState } from "react";
import {
  FaRegBell,
  FaEnvelope,
  FaMobile,
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
  FaArrowsRotate,
} from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import { useNotification } from "@/libs/hooks/useNotification";
import { notifications as getNotifications } from "@/libs/stores/notificationManager/thunk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PaginationTable from "@/components/global/PaginationTable";
import { getItem } from "@/libs/local-storage";

const PAGE_SIZE = 10;

const NotificationPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const dispatch = useAppDispatch();
  const { notifications, loading, pagination } = useNotification();
  const user = getItem<{
    id: string;
  }>("user");

  useEffect(() => {
    const params: Record<string, any> = {
      page,
      limit: PAGE_SIZE,
      user_id: user?.id,
      ...(typeFilter !== "ALL" && { type: typeFilter }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    };

    dispatch(getNotifications(params as any));
  }, [dispatch, page, typeFilter, statusFilter, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, statusFilter, startDate, endDate]);

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.total_pages) {
      setPage(newPage);
    }
  };

  const handleResetFilters = () => {
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setStartDate("");
    setEndDate("");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "SENT":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      case "RETRYING":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "SENT":
        return <FaCircleCheck className="h-4 w-4" />;
      case "PENDING":
        return <FaClock className="h-4 w-4" />;
      case "FAILED":
        return <FaCircleXmark className="h-4 w-4" />;
      case "RETRYING":
        return <FaArrowsRotate className="h-4 w-4" />;
      default:
        return <FaClock className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "EMAIL":
        return <FaEnvelope className="h-5 w-5" />;
      case "PUSH":
        return <FaMobile className="h-5 w-5" />;
      default:
        return <FaRegBell className="h-5 w-5" />;
    }
  };

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

      {/* Filters */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2">
            <motion.div className="sm:w-40" variants={itemVariants}>
              <label className="text-sm text-gray-600 mb-1 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="PUSH">Push</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div className="sm:w-40" variants={itemVariants}>
              <label className="text-sm text-gray-600 mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="RETRYING">Retrying</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div className="sm:w-24" variants={itemVariants}>
              <Button
                variant="secondary"
                className="border-gray-300 w-full h-10 mt-6"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <motion.div className="flex-1" variants={itemVariants}>
              <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </motion.div>

            <motion.div className="flex-1" variants={itemVariants}>
              <label className="text-sm text-gray-600 mb-1 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </motion.div>
          </div>
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
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border-l-4 border-primary"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {notification.content_data.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(notification.status)}
                          <Badge
                            variant={getStatusBadgeVariant(notification.status)}
                            className="whitespace-nowrap"
                          >
                            {notification.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {notification.content_data.body}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(notification.type)}
                          <span className="font-medium">{notification.type}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FaClock className="h-3 w-3" />
                          <span>{new Date(notification.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

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
                  {typeFilter !== "ALL" || statusFilter !== "ALL" || startDate || endDate
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
