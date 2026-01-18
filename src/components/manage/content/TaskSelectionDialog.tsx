import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  Eye,
  FileText,
  Video,
  Loader2,
  Briefcase,
  AlertTriangle,
  Building2,
  Hash,
  Target,
  Link2,
  Palette,
  Package,
  Globe,
  ExternalLink,
  Tag,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { manageTask } from "@/libs/services/manageTask";
import { toast } from "sonner";
import type { Task } from "@/libs/types/task";
import { useAuth } from "@/libs/hooks/useAuth";

// Shared utility functions
const getTaskColor = (type: string): string => {
  switch (type) {
    case "CONTENT":
      return "#f7c06d";
    case "MARKETING":
      return "#ff88fa";
    case "PRODUCT":
      return "#9976ff";
    default:
      return "#9976ff";
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "No date available";
  try {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Invalid date";
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "IN_PROGRESS":
    case "ON_GOING":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatFieldName = (key: string): string => {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
};

// Interfaces
interface TaskSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskSelect: (task: Task) => void;
}

interface TaskDetailViewProps {
  task: Task;
  onBack: () => void;
  onSelectForContent: () => void;
}

// Main Dialog Component
const TaskSelectionDialog: React.FC<TaskSelectionDialogProps> = ({
  isOpen,
  onClose,
  onTaskSelect,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [loadingTaskDetail, setLoadingTaskDetail] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchAvailableTasks = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await manageTask.getTaskListMarketing({
        page: 1,
        limit: 50,
        has_content: false,
        assigned_to_id: user.id,
        type: "CONTENT",
        status: "IN_PROGRESS",
      });

      if (response.data.success) {
        setTasks(response.data.data || []);
      } else {
        setError("Failed to load tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTasks();
    }
  }, [isOpen, fetchAvailableTasks]);

  const handleClose = () => {
    setSelectedTask(null);
    setViewingTask(null);
    onClose();
  };

  const handleViewTaskDetail = async (task: Task) => {
    try {
      setLoadingTaskDetail(true);
      const response = await manageTask.getTaskById(task.id);
      if (response.data.success) {
        setViewingTask(response.data.data);
      } else {
        toast.error("Failed to load task details");
      }
    } catch (err) {
      console.error("Error fetching task detail:", err);
      toast.error("Failed to load task details");
    } finally {
      setLoadingTaskDetail(false);
    }
  };

  const handleSelectTaskForContent = () => {
    if (viewingTask) {
      onTaskSelect(viewingTask);
      setSelectedTask(null);
      setViewingTask(null);
      onClose();
    }
  };

  const handleNext = () => {
    if (selectedTask) {
      onTaskSelect(selectedTask);
      setSelectedTask(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        {viewingTask ? (
          <TaskDetailView
            task={viewingTask}
            onBack={() => setViewingTask(null)}
            onSelectForContent={handleSelectTaskForContent}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                Select Task for Content
              </DialogTitle>
              <DialogDescription>
                Choose a task from the list below to create content
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto mt-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading tasks...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error loading tasks: {error}</p>
                  <Button variant="outline" onClick={fetchAvailableTasks} className="mt-2">
                    Retry
                  </Button>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No tasks available</div>
              ) : (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTask?.id === task.id}
                    onSelect={() => setSelectedTask(task)}
                    onViewDetail={() => handleViewTaskDetail(task)}
                    isLoadingDetail={loadingTaskDetail}
                  />
                ))
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                className="bg-[#FF9DB0] hover:bg-pink-600 text-white"
                disabled={!selectedTask}
                onClick={handleNext}
              >
                Create Content
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Task Card Component
const TaskCard: React.FC<{
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetail: () => void;
  isLoadingDetail: boolean;
}> = ({ task, isSelected, onSelect, onViewDetail, isLoadingDetail }) => {
  return (
    <Card
      onClick={onSelect}
      className={`mb-4 cursor-pointer hover:shadow-lg transition-shadow ${
        isSelected ? "bg-neutral-50 border-[#FF9DB0]" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: getTaskColor(task.type) }}
          >
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div className="space-y-1">
            <CardTitle className={`text-base ${isSelected ? "text-[#FF9DB0]" : ""}`}>
              {task.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {task.assigned_to_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(task.deadline)}
              </span>
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          {task.type === "MARKETING" || task.type === "PRODUCT" ? (
            <Video className="h-8 w-8 text-purple-500" />
          ) : (
            <FileText className="h-8 w-8 text-blue-500" />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={isLoadingDetail}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail();
                }}
              >
                {isLoadingDetail ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Task Details</TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </CardContent>
    </Card>
  );
};

// Known description fields for custom UI
const KNOWN_DESCRIPTION_FIELDS = [
  "description",
  "product_name",
  "platform",
  "creative_notes",
  "tagline",
  "hashtags",
  "kpi_goals",
  "material_urls",
  "material_url",
  "tracking_link",
  "is_affiliate_content",
  "advertised_item_id",
];

// Task Detail View Component
const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onBack, onSelectForContent }) => {
  const taskData = task as Task & {
    campaign_details?: {
      name: string;
      description: string;
      type: string;
      status: string;
      start_date: string;
      end_date: string;
    };
    milestone_details?: {
      description: string;
      due_date: string;
      status: string;
      completion_percentage: number;
      behind_schedule: boolean;
    };
    brand_info?: { name: string; logo_url: string; status: string };
  };

  // Parse description
  const descObj =
    typeof task.description === "object" && task.description
      ? (task.description as Record<string, unknown>)
      : null;

  const contentDetails = descObj
    ? {
        productName: descObj.product_name as string | null,
        platform: descObj.platform as string | null,
        creativeNotes: descObj.creative_notes as string | null,
        tagline: descObj.tagline as string | null,
        hashtags: (Array.isArray(descObj.hashtags) ? descObj.hashtags : []) as string[],
        kpiGoals: (Array.isArray(descObj.kpi_goals) ? descObj.kpi_goals : []) as Array<{
          metric: string;
          target: string;
          description?: string;
        }>,
        materialUrls: (Array.isArray(descObj.material_urls)
          ? descObj.material_urls
          : Array.isArray(descObj.material_url)
            ? descObj.material_url
            : []) as string[],
        trackingLink: descObj.tracking_link as string | null,
        isAffiliateContent: Boolean(descObj.is_affiliate_content),
      }
    : null;

  const simpleDescription =
    typeof task.description === "string"
      ? task.description
      : descObj?.description && typeof descObj.description === "string"
        ? descObj.description
        : null;

  const showRichContent =
    contentDetails &&
    (contentDetails.productName ||
      contentDetails.platform ||
      contentDetails.creativeNotes ||
      contentDetails.tagline ||
      contentDetails.hashtags.length > 0 ||
      contentDetails.kpiGoals.length > 0 ||
      contentDetails.materialUrls.length > 0 ||
      contentDetails.trackingLink ||
      contentDetails.isAffiliateContent);

  const unknownFields = descObj
    ? Object.fromEntries(
        Object.entries(descObj).filter(([key]) => !KNOWN_DESCRIPTION_FIELDS.includes(key)),
      )
    : null;
  const hasUnknownFields = unknownFields && Object.keys(unknownFields).length > 0;

  const { campaign_details: campaign, milestone_details: milestone, brand_info: brand } = taskData;

  const getFileName = (url: string): string => {
    try {
      const decoded = decodeURIComponent(url.split("/").pop() || url);
      const clean = decoded.replace(/^\d{8}_\d{6}_/, "");
      return clean.length > 50 ? clean.substring(0, 47) + "..." : clean;
    } catch {
      return url.length > 50 ? url.substring(0, 47) + "..." : url;
    }
  };

  const renderValue = (value: unknown, depth = 0): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">N/A</span>;
    }
    if (typeof value === "boolean") {
      return (
        <Badge
          variant="secondary"
          className={value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {value ? "Yes" : "No"}
        </Badge>
      );
    }
    if (typeof value === "number") {
      return <span className="font-medium text-gray-900">{value.toLocaleString()}</span>;
    }
    if (typeof value === "string") {
      if (value.startsWith("http://") || value.startsWith("https://")) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-1 break-all"
          >
            {value.length > 60 ? value.substring(0, 57) + "..." : value}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        );
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return <span className="font-medium text-gray-900">{formatDate(value)}</span>;
        }
      }
      return <span className="font-medium text-gray-900">{value}</span>;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400 italic">Empty list</span>;
      if (value.every((item) => typeof item === "string" || typeof item === "number")) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, i) => (
              <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-800">
                {String(item)}
              </Badge>
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-2 mt-1">
          {value.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded p-2 border border-gray-100">
              {typeof item === "object" && item !== null ? (
                <div className="space-y-1">
                  {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="flex items-start gap-2">
                      <span className="text-xs text-gray-500 min-w-20">{formatFieldName(k)}:</span>
                      <div className="flex-1 text-sm">{renderValue(v, depth + 1)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-sm">{renderValue(item, depth + 1)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === "object") {
      return (
        <div className={`space-y-2 ${depth > 0 ? "mt-1 pl-2 border-l-2 border-gray-200" : ""}`}>
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded p-2 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{formatFieldName(k)}</p>
              <div className="text-sm">{renderValue(v, depth + 1)}</div>
            </div>
          ))}
        </div>
      );
    }
    return <span className="font-medium text-gray-900">{String(value)}</span>;
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(90vh-2rem)]">
      <DialogHeader className="shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back
          </Button>
          <div>
            <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
              Task Details
            </DialogTitle>
            <DialogDescription>Review task information before creating content</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto mt-4 space-y-6 min-h-0">
        {/* Task Header */}
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: getTaskColor(task.type) }}
          >
            <div className="w-5 h-5 bg-white rounded-full" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{task.name}</h3>
        </div>

        {/* Simple Description */}
        {simpleDescription && (
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 leading-relaxed">{simpleDescription}</p>
          </div>
        )}

        {/* Rich Content Details */}
        {showRichContent && contentDetails && (
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Content Details
              {contentDetails.isAffiliateContent && (
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                  Affiliate Content
                </Badge>
              )}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contentDetails.productName && (
                <div className="bg-white p-3 rounded border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Product Name
                  </p>
                  <p className="font-medium text-gray-900 text-sm">{contentDetails.productName}</p>
                </div>
              )}
              {contentDetails.platform && (
                <div className="bg-white p-3 rounded border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Platform
                  </p>
                  <Badge variant="outline" className="font-medium">
                    {contentDetails.platform}
                  </Badge>
                </div>
              )}
              {contentDetails.tagline && (
                <div className="bg-white p-3 rounded border border-gray-100 md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Tagline
                  </p>
                  <p className="font-medium text-gray-900 text-sm italic">
                    "{contentDetails.tagline}"
                  </p>
                </div>
              )}
              {contentDetails.creativeNotes && (
                <div className="bg-white p-3 rounded border border-gray-100 md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    Creative Notes
                  </p>
                  <p className="font-medium text-gray-900 text-sm">
                    {contentDetails.creativeNotes}
                  </p>
                </div>
              )}
              {contentDetails.hashtags.length > 0 && (
                <div className="bg-white p-3 rounded border border-gray-100 md:col-span-2">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    Hashtags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {contentDetails.hashtags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {contentDetails.trackingLink && (
                <div className="bg-white p-3 rounded border border-gray-100 md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Link2 className="h-3 w-3" />
                    Tracking Link
                  </p>
                  <a
                    href={contentDetails.trackingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {contentDetails.trackingLink}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {contentDetails.kpiGoals.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  KPI Goals
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {contentDetails.kpiGoals.map((kpi, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded border border-gray-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {formatFieldName(kpi.metric)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {kpi.target}
                        </Badge>
                      </div>
                      {kpi.description && (
                        <p className="text-xs text-gray-500">{kpi.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contentDetails.materialUrls.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Materials ({contentDetails.materialUrls.length})
                </p>
                <div className="space-y-2">
                  {contentDetails.materialUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
                    >
                      <FileText className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                      <span className="text-sm text-gray-700 group-hover:text-blue-700 flex-1 truncate">
                        {getFileName(url)}
                      </span>
                      <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Unknown Fields */}
        {hasUnknownFields && (
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              Additional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(unknownFields!).map(([key, value]) => (
                <div
                  key={key}
                  className={`bg-white p-3 rounded border border-gray-100 ${
                    typeof value === "object" && value !== null ? "md:col-span-2" : ""
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">{formatFieldName(key)}</p>
                  <div className="text-sm">{renderValue(value)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <User className="h-4 w-4" />
              Assignee
            </div>
            <p className="font-medium text-gray-900">{task.assigned_to_name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="h-4 w-4" />
              Due Date
            </div>
            <p className="font-medium text-gray-900">{formatDate(task.deadline)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <FileText className="h-4 w-4" />
              Type
            </div>
            <p className="font-medium text-gray-900">{task.type}</p>
          </div>
        </div>

        {/* Campaign Information */}
        {campaign && (
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-600" />
              Campaign Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Campaign Name</p>
                <p className="font-medium text-gray-900 text-sm">{campaign.name || "Unknown"}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="font-medium text-gray-900 text-sm">{campaign.type || "Unknown"}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="font-medium text-gray-900 text-sm">
                  {formatDate(campaign.start_date)}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="font-medium text-gray-900 text-sm">{formatDate(campaign.end_date)}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-medium text-gray-900 text-sm">
                  {campaign.description || "No description"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Brand Information */}
        {brand && (
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              Brand Information
            </h4>
            <div className="flex items-center gap-4">
              {brand.logo_url && (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-lg">{brand.name || "Unknown"}</p>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    brand.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {brand.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Information */}
        {milestone && (
          <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-green-600" />
              Milestone Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-medium text-gray-900 text-sm">
                  {milestone.description || "No description"}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Due Date</p>
                <p className="font-medium text-gray-900 text-sm">
                  {formatDate(milestone.due_date)}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Completion</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestone.completion_percentage || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {milestone.completion_percentage || 0}%
                  </span>
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}
                  >
                    {milestone.status?.replace("_", " ") || "Unknown"}
                  </span>
                  {milestone.behind_schedule && (
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Behind Schedule
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="shrink-0 mt-4 pt-4 border-t">
        <Button className="bg-[#FF9DB0] hover:bg-pink-600 text-white" onClick={onSelectForContent}>
          Create Content for This Task
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TaskSelectionDialog;
