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
} from "lucide-react";
import React, { useEffect } from "react";
import { manageTask } from "@/libs/services/manageTask";
import { toast } from "sonner";
import type { Task } from "@/libs/types/task";
import { useAuth } from "@/libs/hooks/useAuth";

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

const TaskSelectionDialog: React.FC<TaskSelectionDialogProps> = ({
  isOpen,
  onClose,
  onTaskSelect,
}) => {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [viewingTask, setViewingTask] = React.useState<Task | null>(null);
  const [loadingTaskDetail, setLoadingTaskDetail] = React.useState(false);

  // Local state for tasks fetched from marketing API
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { user } = useAuth();

  // Fetch tasks without content assigned to current user
  const fetchAvailableTasks = React.useCallback(async () => {
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

  // Utility functions
  const getTaskColor = (type: string): string => {
    switch (type) {
      case "CONTENT":
        return "#f7c06d";
      default:
        return "#9976ff";
    }
  };

  const formatDate = (dateString: string): string => {
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
      return "No deadline";
    }
  };

  // Tasks are already filtered by the API (has_content: false, type: CONTENT, status: IN_PROGRESS)
  const availableTasks = tasks;

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleNext = () => {
    if (selectedTask) {
      onTaskSelect(selectedTask);
      setSelectedTask(null);
      onClose();
    }
  };

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
    } catch (error) {
      console.error("Error fetching task detail:", error);
      toast.error("Failed to load task details");
    } finally {
      setLoadingTaskDetail(false);
    }
  };

  const handleBackToTaskList = () => {
    setViewingTask(null);
  };

  const handleSelectTaskForContent = () => {
    if (viewingTask) {
      onTaskSelect(viewingTask);
      setSelectedTask(null);
      setViewingTask(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        {viewingTask ? (
          <TaskDetailView
            task={viewingTask}
            onBack={handleBackToTaskList}
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
              ) : availableTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No tasks available</div>
              ) : (
                availableTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    selectedTask={selectedTask}
                    onSelect={handleTaskSelect}
                    onViewDetail={handleViewTaskDetail}
                    isLoadingDetail={loadingTaskDetail}
                    getTaskColor={getTaskColor}
                    formatDate={formatDate}
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

const TaskCard: React.FC<{
  task: Task;
  onSelect: (task: Task) => void;
  selectedTask: Task | null;
  onViewDetail: (task: Task) => void;
  isLoadingDetail?: boolean;
  getTaskColor: (type: string) => string;
  formatDate: (dateString: string) => string;
}> = ({
  task,
  onSelect,
  selectedTask,
  onViewDetail,
  isLoadingDetail = false,
  getTaskColor,
  formatDate,
}) => {
  return (
    <Card
      onClick={() => onSelect(task)}
      className={`mb-4 cursor-pointer hover:shadow-lg transition-shadow ${
        selectedTask?.id === task.id ? "bg-neutral-50 border-[#FF9DB0]" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getTaskColor(task.type) }}
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="space-y-1">
            <CardTitle
              className={`text-base ${selectedTask?.id === task.id ? "text-[#FF9DB0]" : ""}`}
            >
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
                  onViewDetail(task);
                }}
              >
                {isLoadingDetail ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Task Details</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              task.status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : task.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onBack, onSelectForContent }) => {
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

  const getStatusDisplay = (status: string): string => {
    if (!status) return "Unknown";
    return status.replace("_", " ");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "TODO":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDescription = (): string => {
    if (!task.description) return "No description available";

    // Handle nested description object structure
    if (typeof task.description === "object" && task.description !== null) {
      const desc = task.description as any;
      if (desc.description && typeof desc.description === "string") {
        return desc.description;
      }
      // Fallback to JSON representation if structure is different
      try {
        return JSON.stringify(task.description, null, 2);
      } catch {
        return "No description available";
      }
    }

    if (typeof task.description === "string") {
      return task.description;
    }

    return "No description available";
  };

  const getMaterialUrls = (): string[] => {
    if (!task.description || typeof task.description !== "object") {
      return [];
    }

    const desc = task.description as any;
    if (desc.material_url && Array.isArray(desc.material_url)) {
      return desc.material_url;
    }

    return [];
  };

  const getCampaignInfo = () => {
    const campaign = (task as any).campaign_details;
    if (campaign && typeof campaign === "object") {
      return {
        name: campaign.name || "Unknown Campaign",
        description: campaign.description || "No description",
        type: campaign.type || "Unknown",
        status: campaign.status || "Unknown",
        startDate: campaign.start_date || "",
        endDate: campaign.end_date || "",
      };
    }
    return null;
  };

  const getMilestoneInfo = () => {
    const milestone = (task as any).milestone_details;
    if (milestone && typeof milestone === "object") {
      return {
        description: milestone.description || "No description",
        dueDate: milestone.due_date || "",
        status: milestone.status || "Unknown",
        completionPercentage: milestone.completion_percentage || 0,
        behindSchedule: milestone.behind_schedule || false,
      };
    }
    return null;
  };

  const getBrandInfo = () => {
    const brand = (task as any).brand_info;
    if (brand && typeof brand === "object") {
      return {
        name: brand.name || "Unknown Brand",
        logoUrl: brand.logo_url || "",
        status: brand.status || "Unknown",
      };
    }
    return null;
  };

  const materialUrls = getMaterialUrls();
  const campaignInfo = getCampaignInfo();
  const milestoneInfo = getMilestoneInfo();
  const brandInfo = getBrandInfo();

  return (
    <>
      <DialogHeader>
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

      <div className="max-h-[70vh] overflow-y-auto mt-4 space-y-6">
        {/* Task Header */}
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getTaskColor(task.type) }}
          >
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.name}</h3>
          </div>
        </div>

        {/* Task Description */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{getDescription()}</p>
        </div>

        {/* Material URLs */}
        {materialUrls.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Materials ({materialUrls.length})
            </h4>
            <div className="space-y-2">
              {materialUrls.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 underline text-sm break-all"
                >
                  Material {index + 1}: {url.split("/").pop() || url}
                </a>
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
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">Status</div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
            >
              {getStatusDisplay(task.status)}
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
        {campaignInfo && (
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-purple-600" />
              Campaign Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Campaign Name</p>
                <p className="font-medium text-gray-900 text-sm">{campaignInfo.name}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="font-medium text-gray-900 text-sm">{campaignInfo.type}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="font-medium text-gray-900 text-sm">
                  {formatDate(campaignInfo.startDate)}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="font-medium text-gray-900 text-sm">
                  {formatDate(campaignInfo.endDate)}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100 md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-medium text-gray-900 text-sm">{campaignInfo.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Brand Information */}
        {brandInfo && (
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              Brand Information
            </h4>
            <div className="flex items-center gap-4">
              {brandInfo.logoUrl && (
                <img
                  src={brandInfo.logoUrl}
                  alt={brandInfo.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-lg">{brandInfo.name}</p>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    brandInfo.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {brandInfo.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Information */}
        {milestoneInfo && (
          <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-green-600" />
              Milestone Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-medium text-gray-900 text-sm">{milestoneInfo.description}</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Due Date</p>
                <p className="font-medium text-gray-900 text-sm">
                  {formatDate(milestoneInfo.dueDate)}
                </p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Completion</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestoneInfo.completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-900">
                    {milestoneInfo.completionPercentage}%
                  </span>
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestoneInfo.status)}`}
                  >
                    {getStatusDisplay(milestoneInfo.status)}
                  </span>
                  {milestoneInfo.behindSchedule && (
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

      <DialogFooter>
        <Button className="bg-[#FF9DB0] hover:bg-pink-600 text-white" onClick={onSelectForContent}>
          Create Content for This Task
        </Button>
      </DialogFooter>
    </>
  );
};

export default TaskSelectionDialog;
