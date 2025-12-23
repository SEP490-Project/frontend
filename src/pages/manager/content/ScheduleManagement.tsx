import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
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
import { WarningDialog } from "@/components/global";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { fetchSchedules, cancelSchedule } from "@/libs/stores/scheduleManager";
import type { ScheduleFilterParams, ScheduleStatus, ScheduleItem } from "@/libs/types/schedule";

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

export const ScheduleManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schedules, pagination, loading, cancelLoading } = useSelector(
    (state: RootState) => state.manageSchedule,
  );

  // Filter state
  const [filters, setFilters] = useState<ScheduleFilterParams>({
    page: 1,
    limit: 20,
    status: undefined,
    from_date: undefined,
    to_date: undefined,
  });

  // Cancel dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [scheduleToCancel, setScheduleToCancel] = useState<ScheduleItem | null>(null);

  // Fetch schedules on mount and when filters change
  useEffect(() => {
    dispatch(fetchSchedules(filters));
  }, [dispatch, filters]);

  // Handle filter changes
  const updateFilter = (key: keyof ScheduleFilterParams, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: key === "page" ? (value as number) : 1, // Reset page when other filters change
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      status: undefined,
      from_date: undefined,
      to_date: undefined,
    });
  };

  // Handle cancel click
  const handleCancelClick = (schedule: ScheduleItem) => {
    setScheduleToCancel(schedule);
    setShowCancelDialog(true);
  };

  // Handle cancel confirm
  const handleCancelConfirm = async () => {
    if (scheduleToCancel) {
      await dispatch(cancelSchedule(scheduleToCancel.schedule_id));
      setShowCancelDialog(false);
      setScheduleToCancel(null);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchSchedules(filters));
  };

  const hasActiveFilters = filters.status || filters.from_date || filters.to_date;

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
                value={filters.status || "ALL"}
                onValueChange={(value) => {
                  if (value === "ALL") updateFilter("status", undefined);
                  else updateFilter("status", value as ScheduleStatus);
                }}
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
                value={filters.from_date}
                onChange={(date) => updateFilter("from_date", date)}
                placeholder="Start date"
              />
            </div>

            {/* To Date */}
            <div className="w-48">
              <label className="text-sm font-medium mb-1.5 block">To Date</label>
              <DatePicker
                value={filters.to_date}
                onChange={(date) => updateFilter("to_date", date)}
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
                <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell>
                      <Skeleton className="h-8 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No schedules found</p>
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => (
                  <TableRow key={schedule.schedule_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium truncate max-w-xs">{schedule.content_title}</p>
                        <p className="text-xs text-muted-foreground">{schedule.content_type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{schedule.channel_name}</Badge>
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
                      <span className="text-sm text-muted-foreground">{schedule.created_by}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {schedule.status === "PENDING" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleCancelClick(schedule)}
                          disabled={cancelLoading}
                        >
                          {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
                        </Button>
                      )}
                      {schedule.status === "FAILED" && schedule.last_error && (
                        <span className="text-xs text-red-600" title={schedule.last_error}>
                          Error
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{" "}
            schedules
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter("page", pagination.page - 1)}
              disabled={!pagination.has_prev}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter("page", pagination.page + 1)}
              disabled={!pagination.has_next}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <WarningDialog
        isOpen={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Schedule"
        description={`Are you sure you want to cancel the scheduled publish for "${scheduleToCancel?.content_title}"?`}
        warningMessage="This action cannot be undone."
        onConfirm={handleCancelConfirm}
        onCancel={() => {
          setShowCancelDialog(false);
          setScheduleToCancel(null);
        }}
        confirmText="Cancel Schedule"
        cancelText="Keep Schedule"
        confirmButtonVariant="destructive"
      />
    </div>
  );
};

export default ScheduleManagement;
