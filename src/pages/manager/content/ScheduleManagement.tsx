import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { Calendar, Clock, Filter, RefreshCw, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/date-picker";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { fetchSchedules } from "@/libs/stores/scheduleManager";
import type { ScheduleStatus } from "@/libs/types/schedule";

const STATUS_OPTIONS: { value: ScheduleStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const getStatusColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "FAILED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ITEMS_PER_PAGE = 20;

export const ScheduleManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useSelector((state: RootState) => state.manageSchedule);

  // Filter state (frontend only)
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all schedules on mount only
  useEffect(() => {
    dispatch(fetchSchedules({ limit: 1000 })); // Fetch all for frontend filtering
  }, [dispatch]);

  // Filter schedules on frontend
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      // Status filter
      if (statusFilter !== "ALL" && schedule.status !== statusFilter) {
        return false;
      }

      // Date filters
      const scheduleDate = parseISO(schedule.scheduled_at);

      if (fromDate) {
        const fromDateStart = startOfDay(parseISO(fromDate));
        if (isBefore(scheduleDate, fromDateStart)) {
          return false;
        }
      }

      if (toDate) {
        const toDateEnd = endOfDay(parseISO(toDate));
        if (isAfter(scheduleDate, toDateEnd)) {
          return false;
        }
      }

      return true;
    });
  }, [schedules, statusFilter, fromDate, toDate]);

  // Paginate filtered results
  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSchedules.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSchedules, currentPage]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const total = filteredSchedules.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      total,
      total_pages: totalPages,
      has_next: currentPage < totalPages,
      has_prev: currentPage > 1,
    };
  }, [filteredSchedules.length, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, fromDate, toDate]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setStatusFilter("ALL");
    setFromDate(undefined);
    setToDate(undefined);
    setCurrentPage(1);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    dispatch(fetchSchedules({ limit: 1000 }));
  }, [dispatch]);

  const hasActiveFilters = statusFilter !== "ALL" || fromDate || toDate;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule Management</h1>
          <p className="text-muted-foreground">View and manage scheduled content publishing</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            {/* Status Filter */}
            <div className="w-48">
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ScheduleStatus | "ALL")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div className="w-48">
              <label className="text-sm font-medium mb-1.5 block">From Date</label>
              <DatePicker
                value={fromDate}
                onChange={(date) => setFromDate(date)}
                placeholder="Start date"
              />
            </div>

            {/* To Date */}
            <div className="w-48">
              <label className="text-sm font-medium mb-1.5 block">To Date</label>
              <DatePicker
                value={toDate}
                onChange={(date) => setToDate(date)}
                placeholder="End date"
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Scheduled At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedSchedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No schedules found</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSchedules.map((schedule) => (
                  <TableRow key={schedule.schedule_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium truncate max-w-xs">
                          {schedule.content_details?.content_title || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.content_details?.content_type || "—"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {schedule.content_details?.channel_name || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(new Date(schedule.scheduled_at), "MMM d, yyyy HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}
                      >
                        {schedule.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {schedule.created_by_name || schedule.created_by}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {paginationInfo.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(paginationInfo.page - 1) * paginationInfo.limit + 1} to{" "}
            {Math.min(paginationInfo.page * paginationInfo.limit, paginationInfo.total)} of{" "}
            {paginationInfo.total} schedules
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={!paginationInfo.has_prev}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {paginationInfo.page} of {paginationInfo.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!paginationInfo.has_next}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
