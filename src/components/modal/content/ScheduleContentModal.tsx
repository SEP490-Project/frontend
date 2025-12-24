import React, { useState, useMemo } from "react";
import { Calendar, Clock, Loader2, Check } from "lucide-react";
import { useSelector } from "react-redux";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/date-time-picker";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { batchScheduleContent } from "@/libs/stores/scheduleManager";
import type { BatchScheduleItem } from "@/libs/types/schedule";

interface ContentChannel {
  id: string;
  channel_id: string;
  channel_name: string;
  auto_post_status?: string;
}

interface ScheduleContentModalProps {
  contentId: string;
  contentTitle: string;
  contentChannels: ContentChannel[];
  onSuccess?: () => void;
}

export const ScheduleContentModal: React.FC<ScheduleContentModalProps> = ({
  contentId,
  contentTitle,
  contentChannels,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { scheduleLoading } = useSelector((state: RootState) => state.manageSchedule);

  // State for same time mode
  const [useSameTime, setUseSameTime] = useState(true);
  const [sameTimeValue, setSameTimeValue] = useState<string>("");
  const [autoPost, setAutoPost] = useState(true);

  // State for individual channel scheduling
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(
    new Set(contentChannels.map((ch) => ch.channel_id)),
  );
  const [channelSchedules, setChannelSchedules] = useState<Record<string, string>>({});

  // Get minimum date (now + 5 minutes)
  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16).replace("T", " ");
  }, []);

  // Toggle channel selection
  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) => {
      const next = new Set(prev);
      if (next.has(channelId)) {
        next.delete(channelId);
      } else {
        next.add(channelId);
      }
      return next;
    });
  };

  // Toggle all channels
  const toggleAllChannels = () => {
    if (selectedChannels.size === contentChannels.length) {
      setSelectedChannels(new Set());
    } else {
      setSelectedChannels(new Set(contentChannels.map((ch) => ch.channel_id)));
    }
  };

  // Update individual channel schedule time
  const updateChannelTime = (channelId: string, time: string) => {
    setChannelSchedules((prev) => ({
      ...prev,
      [channelId]: time,
    }));
  };

  // Validate form
  const isValid = useMemo(() => {
    if (selectedChannels.size === 0) return false;

    if (useSameTime) {
      return !!sameTimeValue;
    } else {
      // Check all selected channels have a scheduled time
      return Array.from(selectedChannels).every((channelId) => !!channelSchedules[channelId]);
    }
  }, [selectedChannels, useSameTime, sameTimeValue, channelSchedules]);

  // Handle submit
  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      const schedules: BatchScheduleItem[] = Array.from(selectedChannels).map((channelId) => ({
        channel_id: channelId,
        scheduled_at: useSameTime ? sameTimeValue : channelSchedules[channelId],
        auto_post: autoPost,
      }));
      await dispatch(batchScheduleContent({ content_id: contentId, schedules })).unwrap();
      onSuccess?.();
    } catch {
      // Error handled in thunk
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Schedule Content
        </DialogTitle>
        <DialogDescription>
          Schedule <span className="font-medium">"{contentTitle}"</span> for publishing
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Same time toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="same-time-toggle" className="cursor-pointer">
              Use same time for all channels
            </Label>
          </div>
          <Switch id="same-time-toggle" checked={useSameTime} onCheckedChange={setUseSameTime} />
        </div>

        {/* Same time picker */}
        {useSameTime && (
          <div className="space-y-2">
            <Label>Scheduled Date & Time</Label>
            <DateTimePicker
              value={sameTimeValue}
              onChange={setSameTimeValue}
              placeholder="Select date and time"
              minDate={minDateTime.split(" ")[0]}
              required
            />
          </div>
        )}

        {/* Channel selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Select Channels</Label>
            <Button variant="ghost" size="sm" onClick={toggleAllChannels} className="text-xs h-7">
              {selectedChannels.size === contentChannels.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
            {contentChannels.map((channel) => (
              <div key={channel.channel_id} className="p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`channel-${channel.channel_id}`}
                    checked={selectedChannels.has(channel.channel_id)}
                    onCheckedChange={() => toggleChannel(channel.channel_id)}
                  />
                  <label
                    htmlFor={`channel-${channel.channel_id}`}
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {channel.channel_name}
                  </label>
                  {channel.auto_post_status && (
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                      {channel.auto_post_status}
                    </span>
                  )}
                </div>

                {/* Individual time picker when not using same time */}
                {!useSameTime && selectedChannels.has(channel.channel_id) && (
                  <div className="mt-2 pl-7">
                    <DateTimePicker
                      value={channelSchedules[channel.channel_id] || ""}
                      onChange={(time) => updateChannelTime(channel.channel_id, time)}
                      placeholder="Select time for this channel"
                      minDate={minDateTime.split(" ")[0]}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Auto-post toggle */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <Label htmlFor="auto-post-toggle" className="cursor-pointer font-medium">
              Auto-post to platforms
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically publish to connected social media platforms
            </p>
          </div>
          <Switch id="auto-post-toggle" checked={autoPost} onCheckedChange={setAutoPost} />
        </div>
      </div>

      <DialogFooter className="gap-2">
        <DialogClose asChild>
          <Button variant="outline" disabled={scheduleLoading}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleSubmit} disabled={!isValid || scheduleLoading}>
          {scheduleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Scheduling...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Schedule ({selectedChannels.size} channel{selectedChannels.size !== 1 ? "s" : ""})
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
