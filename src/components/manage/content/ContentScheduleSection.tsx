import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  Sparkles,
  Facebook,
  Globe,
  Info,
  Trash2,
} from "lucide-react";
import { format, setHours, setMinutes, isBefore, startOfDay, addDays } from "date-fns";
import type { Channel } from "@/libs/types/channel";

// Schedule item for a single channel
export interface ScheduleItem {
  channel_id: string;
  scheduled_at: string; // ISO datetime
  auto_post: boolean; // Whether to auto-publish (FB/TikTok only)
}

// Existing schedule from backend
export interface ExistingSchedule {
  id: string;
  content_channel_id: string;
  scheduled_at: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  error_message?: string;
  published_at?: string;
}

interface ContentScheduleSectionProps {
  channels: Channel[];
  selectedChannelIds: string[];
  existingSchedules?: ExistingSchedule[];
  schedules: ScheduleItem[];
  onScheduleChange: (schedules: ScheduleItem[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Helper to get channel icon
const getChannelIcon = (channelName: string) => {
  const name = channelName.toLowerCase();
  if (name.includes("facebook")) return <Facebook className="h-4 w-4 text-blue-600" />;
  if (name.includes("tiktok")) return <Sparkles className="h-4 w-4 text-pink-600" />;
  if (name.includes("website")) return <Globe className="h-4 w-4 text-green-600" />;
  return <Globe className="h-4 w-4 text-gray-600" />;
};

// Status badge component
const StatusBadge = ({ status }: { status: ExistingSchedule["status"] }) => {
  const variants: Record<ExistingSchedule["status"], { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    PROCESSING: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-300" },
    COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800 border-green-300" },
    FAILED: { label: "Failed", className: "bg-red-100 text-red-800 border-red-300" },
    CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-800 border-gray-300" },
  };

  const { label, className } = variants[status];
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

// Generate time options (every 30 minutes)
const generateTimeOptions = () => {
  const options: { value: string; label: string }[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourStr = hour.toString().padStart(2, "0");
      const minuteStr = minute.toString().padStart(2, "0");
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      options.push({
        value: `${hourStr}:${minuteStr}`,
        label: `${hour12}:${minuteStr} ${period}`,
      });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

// Channel schedule card component
interface ChannelScheduleCardProps {
  channel: Channel;
  schedule: ScheduleItem | undefined;
  existingSchedule: ExistingSchedule | undefined;
  onScheduleUpdate: (schedule: ScheduleItem | null) => void;
  disabled?: boolean;
}

const ChannelScheduleCard: React.FC<ChannelScheduleCardProps> = ({
  channel,
  schedule,
  existingSchedule,
  onScheduleUpdate,
  disabled,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Check if auto-post is supported (FB/TikTok)
  const supportsAutoPost = useMemo(() => {
    const name = channel.name.toLowerCase();
    return name.includes("facebook") || name.includes("tiktok");
  }, [channel.name]);

  // Get selected date and time from schedule
  const selectedDate = useMemo(() => {
    return schedule?.scheduled_at ? new Date(schedule.scheduled_at) : null;
  }, [schedule?.scheduled_at]);
  const selectedTime = selectedDate
    ? `${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`
    : "09:00";

  // Handle date selection
  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onScheduleUpdate(null);
        setDatePickerOpen(false);
        return;
      }

      // Preserve existing time or use default
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const newDate = setMinutes(setHours(date, hours), minutes);

      onScheduleUpdate({
        channel_id: channel.id,
        scheduled_at: newDate.toISOString(),
        auto_post: schedule?.auto_post ?? supportsAutoPost,
      });
      setDatePickerOpen(false);
    },
    [channel.id, selectedTime, schedule?.auto_post, supportsAutoPost, onScheduleUpdate],
  );

  // Handle time selection
  const handleTimeSelect = useCallback(
    (time: string) => {
      if (!selectedDate) {
        // If no date selected, default to tomorrow
        const tomorrow = addDays(startOfDay(new Date()), 1);
        const [hours, minutes] = time.split(":").map(Number);
        const newDate = setMinutes(setHours(tomorrow, hours), minutes);

        onScheduleUpdate({
          channel_id: channel.id,
          scheduled_at: newDate.toISOString(),
          auto_post: schedule?.auto_post ?? supportsAutoPost,
        });
      } else {
        const [hours, minutes] = time.split(":").map(Number);
        const newDate = setMinutes(setHours(selectedDate, hours), minutes);

        onScheduleUpdate({
          channel_id: channel.id,
          scheduled_at: newDate.toISOString(),
          auto_post: schedule?.auto_post ?? supportsAutoPost,
        });
      }
    },
    [channel.id, selectedDate, schedule?.auto_post, supportsAutoPost, onScheduleUpdate],
  );

  // Handle auto-post toggle
  const handleAutoPostToggle = useCallback(
    (checked: boolean) => {
      if (!schedule) return;
      onScheduleUpdate({
        ...schedule,
        auto_post: checked,
      });
    },
    [schedule, onScheduleUpdate],
  );

  // Handle clear schedule
  const handleClearSchedule = useCallback(() => {
    onScheduleUpdate(null);
  }, [onScheduleUpdate]);

  // Validate if scheduled time is in the past
  const isScheduledInPast = selectedDate && isBefore(selectedDate, new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
    >
      {/* Header with channel info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getChannelIcon(channel.name)}
          <span className="font-medium">{channel.name}</span>
          {existingSchedule && <StatusBadge status={existingSchedule.status} />}
        </div>
        {schedule && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSchedule}
            disabled={disabled}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Existing schedule info */}
      {existingSchedule &&
        existingSchedule.status === "FAILED" &&
        existingSchedule.error_message && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-700">{existingSchedule.error_message}</span>
          </div>
        )}

      {/* Schedule controls */}
      <div className="space-y-3">
        {/* Date picker */}
        <div className="flex items-center gap-2">
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !selectedDate ? "text-muted-foreground" : ""
                } ${isScheduledInPast ? "border-red-300 text-red-600" : ""}`}
                disabled={disabled}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select date..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={handleDateSelect}
                disabled={(date) => isBefore(date, startOfDay(new Date()))}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Time picker */}
          <Select value={selectedTime} onValueChange={handleTimeSelect} disabled={disabled}>
            <SelectTrigger className="w-[130px]">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Validation warning */}
        {isScheduledInPast && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Selected time is in the past</span>
          </div>
        )}

        {/* Auto-post toggle (for supported channels) */}
        {supportsAutoPost && schedule && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <Label
                htmlFor={`auto-post-${channel.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                Auto-publish to {channel.name}
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>
                      When enabled, content will be automatically published to {channel.name} at the
                      scheduled time.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Switch
              id={`auto-post-${channel.id}`}
              checked={schedule.auto_post}
              onCheckedChange={handleAutoPostToggle}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Main component
const ContentScheduleSection: React.FC<ContentScheduleSectionProps> = ({
  channels,
  selectedChannelIds,
  existingSchedules = [],
  schedules,
  onScheduleChange,
  isLoading,
  disabled,
}) => {
  // Filter channels to only show selected ones
  const selectedChannels = useMemo(() => {
    return channels.filter((c) => selectedChannelIds.includes(c.id));
  }, [channels, selectedChannelIds]);

  // Get schedule for a specific channel
  const getScheduleForChannel = useCallback(
    (channelId: string) => schedules.find((s) => s.channel_id === channelId),
    [schedules],
  );

  // Get existing schedule for a channel (by content_channel_id mapping)
  const getExistingScheduleForChannel = useCallback(
    (channelId: string) => {
      // This would need mapping from channel_id to content_channel_id
      // For now, we'll use channel_id directly
      return existingSchedules.find((s) => s.content_channel_id === channelId);
    },
    [existingSchedules],
  );

  // Handle schedule update for a channel
  const handleScheduleUpdate = useCallback(
    (channelId: string, schedule: ScheduleItem | null) => {
      if (schedule) {
        // Update or add schedule
        const existingIndex = schedules.findIndex((s) => s.channel_id === channelId);
        if (existingIndex >= 0) {
          const updated = [...schedules];
          updated[existingIndex] = schedule;
          onScheduleChange(updated);
        } else {
          onScheduleChange([...schedules, schedule]);
        }
      } else {
        // Remove schedule
        onScheduleChange(schedules.filter((s) => s.channel_id !== channelId));
      }
    },
    [schedules, onScheduleChange],
  );

  // Count schedules
  const scheduledCount = schedules.length;
  const totalChannels = selectedChannels.length;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5" />
            Schedule Publishing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (selectedChannels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5" />
            Schedule Publishing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CalendarClock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select channels above to schedule publishing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5" />
            Schedule Publishing
          </CardTitle>
          {scheduledCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {scheduledCount} of {totalChannels} scheduled
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Set when to publish content to each channel. Leave empty to save as draft.
        </p>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {selectedChannels.map((channel) => (
              <ChannelScheduleCard
                key={channel.id}
                channel={channel}
                schedule={getScheduleForChannel(channel.id)}
                existingSchedule={getExistingScheduleForChannel(channel.id)}
                onScheduleUpdate={(schedule) => handleScheduleUpdate(channel.id, schedule)}
                disabled={disabled}
              />
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ContentScheduleSection;
