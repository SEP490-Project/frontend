import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarClock, Check, X, Loader2, Clock, AlertTriangle } from "lucide-react";
import { format, formatDistanceToNow, isPast, isFuture } from "date-fns";

export type ScheduleStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface ScheduleStatusData {
  id: string;
  scheduled_at: string;
  status: ScheduleStatus;
  channel_name?: string;
  error_message?: string;
  published_at?: string;
}

interface ContentScheduleStatusProps {
  schedules: ScheduleStatusData[];
  compact?: boolean;
  showChannelName?: boolean;
}

// Status configuration
const statusConfig: Record<
  ScheduleStatus,
  {
    label: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: <Clock className="h-3 w-3" />,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
  },
  PROCESSING: {
    label: "Processing",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  COMPLETED: {
    label: "Published",
    icon: <Check className="h-3 w-3" />,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
  FAILED: {
    label: "Failed",
    icon: <X className="h-3 w-3" />,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <X className="h-3 w-3" />,
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
  },
};

// Single schedule badge
const ScheduleBadge: React.FC<{
  schedule: ScheduleStatusData;
  showChannelName?: boolean;
}> = ({ schedule, showChannelName }) => {
  const config = statusConfig[schedule.status];
  const scheduledDate = new Date(schedule.scheduled_at);
  const isOverdue = schedule.status === "PENDING" && isPast(scheduledDate);

  // Tooltip content
  const tooltipContent = (
    <div className="space-y-1 text-xs">
      {showChannelName && schedule.channel_name && (
        <p className="font-medium">{schedule.channel_name}</p>
      )}
      <p>
        <span className="text-muted-foreground">Scheduled for: </span>
        {format(scheduledDate, "PPp")}
      </p>
      {schedule.status === "PENDING" && (
        <p>
          <span className="text-muted-foreground">
            {isFuture(scheduledDate) ? "In: " : "Overdue by: "}
          </span>
          {formatDistanceToNow(scheduledDate)}
        </p>
      )}
      {schedule.published_at && (
        <p>
          <span className="text-muted-foreground">Published: </span>
          {format(new Date(schedule.published_at), "PPp")}
        </p>
      )}
      {schedule.error_message && <p className="text-red-600 max-w-xs">{schedule.error_message}</p>}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`gap-1 ${config.bgColor} ${config.textColor} ${config.borderColor} ${
              isOverdue ? "!bg-red-50 !text-red-700 !border-red-200" : ""
            }`}
          >
            {isOverdue ? <AlertTriangle className="h-3 w-3" /> : config.icon}
            {showChannelName && schedule.channel_name ? (
              <span>{schedule.channel_name}</span>
            ) : (
              <span>{isOverdue ? "Overdue" : config.label}</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Compact multi-schedule summary
const CompactScheduleSummary: React.FC<{
  schedules: ScheduleStatusData[];
}> = ({ schedules }) => {
  if (schedules.length === 0) return null;

  // Count by status
  const statusCounts = schedules.reduce(
    (acc, schedule) => {
      acc[schedule.status] = (acc[schedule.status] || 0) + 1;
      return acc;
    },
    {} as Record<ScheduleStatus, number>,
  );

  // Get next pending schedule
  const nextPending = schedules
    .filter((s) => s.status === "PENDING")
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

  // Check if any are overdue
  const hasOverdue = schedules.some(
    (s) => s.status === "PENDING" && isPast(new Date(s.scheduled_at)),
  );

  // Tooltip content
  const tooltipContent = (
    <div className="space-y-2 text-xs">
      <p className="font-medium">{schedules.length} scheduled posts</p>
      {Object.entries(statusCounts).map(([status, count]) => {
        const config = statusConfig[status as ScheduleStatus];
        return (
          <div key={status} className="flex items-center gap-2">
            {config.icon}
            <span>
              {config.label}: {count}
            </span>
          </div>
        );
      })}
      {nextPending && (
        <div className="pt-1 border-t">
          <p className="text-muted-foreground">
            Next: {format(new Date(nextPending.scheduled_at), "PPp")}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`gap-1.5 ${
              hasOverdue
                ? "bg-red-50 text-red-700 border-red-200"
                : statusCounts.COMPLETED
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            <CalendarClock className="h-3 w-3" />
            <span>
              {hasOverdue && "Overdue"}
              {!hasOverdue && statusCounts.COMPLETED && `${statusCounts.COMPLETED} published`}
              {!hasOverdue && !statusCounts.COMPLETED && `${statusCounts.PENDING || 0} scheduled`}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Main component
const ContentScheduleStatus: React.FC<ContentScheduleStatusProps> = ({
  schedules,
  compact = false,
  showChannelName = true,
}) => {
  if (schedules.length === 0) {
    return null;
  }

  if (compact || schedules.length > 2) {
    return <CompactScheduleSummary schedules={schedules} />;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {schedules.map((schedule) => (
        <ScheduleBadge key={schedule.id} schedule={schedule} showChannelName={showChannelName} />
      ))}
    </div>
  );
};

export default ContentScheduleStatus;
