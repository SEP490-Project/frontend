import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  User,
  Briefcase,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Channel } from "@/libs/types/channel";

interface TaskInfo {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  status?: string;
  deadline?: string;
  due_date?: string;
  campaign_name?: string;
  brand_name?: string;
  assignee?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface TaskInfoSidebarProps {
  task?: TaskInfo | null;
  channels: Channel[];
  selectedChannels: string[];
  onChannelToggle: (channelId: string) => void;
  isLoadingChannels?: boolean;
  allowedChannelTypes?: string[]; // e.g., ["website", "facebook"] for blog, ["tiktok", "facebook"] for video
  contentType?: "blog" | "video";
}

const getStatusColor = (status?: string): string => {
  switch (status?.toUpperCase()) {
    case "TODO":
    case "TO_DO":
      return "bg-gray-100 text-gray-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "DONE":
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
    case "CANCELED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not set";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  try {
    const deadline = new Date(dateString);
    return deadline < new Date();
  } catch {
    return false;
  }
};

const TaskInfoSidebar: React.FC<TaskInfoSidebarProps> = ({
  task,
  channels,
  selectedChannels,
  onChannelToggle,
  isLoadingChannels = false,
  allowedChannelTypes = [],
  contentType = "blog",
}) => {
  // Filter channels based on allowed types
  const filteredChannels = React.useMemo(() => {
    if (allowedChannelTypes.length === 0) return channels;
    return channels.filter((channel) =>
      allowedChannelTypes.some((type) => channel.name.toLowerCase().includes(type.toLowerCase())),
    );
  }, [channels, allowedChannelTypes]);

  const taskTitle = task?.name || task?.title;
  const taskDeadline = task?.deadline || task?.due_date;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Task Information Card */}
      {task && (
        <Card className="flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#FF9DB0]" />
              Task Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task Title */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {taskTitle || "Untitled Task"}
              </p>
            </div>

            {/* Status Badge */}
            {task.status && (
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(task.status)} border-0`}>
                  {task.status.replace(/_/g, " ")}
                </Badge>
              </div>
            )}

            <Separator />

            {/* Task Details */}
            <div className="space-y-3">
              {/* Campaign */}
              {task.campaign_name && (
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Campaign</p>
                    <p className="text-sm font-medium">{task.campaign_name}</p>
                  </div>
                </div>
              )}

              {/* Brand */}
              {task.brand_name && (
                <div className="flex items-start gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Brand</p>
                    <p className="text-sm font-medium">{task.brand_name}</p>
                  </div>
                </div>
              )}

              {/* Assignee */}
              {task.assignee && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Assignee</p>
                    <p className="text-sm font-medium">
                      {task.assignee.full_name || task.assignee.username || "Unassigned"}
                    </p>
                  </div>
                </div>
              )}

              {/* Deadline */}
              {taskDeadline && (
                <div className="flex items-start gap-2">
                  {isOverdue(taskDeadline) ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  ) : (
                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p
                      className={`text-sm font-medium ${isOverdue(taskDeadline) ? "text-red-600" : ""}`}
                    >
                      {formatDate(taskDeadline)}
                      {isOverdue(taskDeadline) && " (Overdue)"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Task Description */}
            {task.description && (
              <>
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{task.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Channel Selection Card */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FF9DB0]" />
              Publish Channels
            </span>
            {selectedChannels.length > 0 && (
              <Badge variant="secondary" className="bg-[#FF9DB0]/10 text-[#FF9DB0]">
                {selectedChannels.length} selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          {isLoadingChannels ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF9DB0]" />
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No channels available for {contentType} content
            </div>
          ) : (
            <ScrollArea className="h-full max-h-[300px]">
              <div className="space-y-2">
                {filteredChannels.map((channel) => {
                  const isSelected = selectedChannels.includes(channel.id);
                  return (
                    <label
                      key={channel.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#FF9DB0] bg-[#FF9DB0]/5"
                          : "border-gray-200 hover:border-[#FF9DB0]/50"
                      }`}
                    >
                      <Checkbox
                        id={`channel-${channel.id}`}
                        checked={isSelected}
                        onCheckedChange={() => onChannelToggle(channel.id)}
                        className="data-[state=checked]:bg-[#FF9DB0] data-[state=checked]:border-[#FF9DB0]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{channel.name}</p>
                        {channel.code && (
                          <p className="text-xs text-gray-500 truncate">{channel.code}</p>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-[#FF9DB0] flex-shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Help Text */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500">
              {contentType === "blog"
                ? "Select channels where your blog post will be published. Different affiliate links will be generated for each channel."
                : "Select channels where your video will be published. Videos can be posted to multiple platforms simultaneously."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskInfoSidebar;
