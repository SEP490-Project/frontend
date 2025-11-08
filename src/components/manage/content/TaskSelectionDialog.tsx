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
import { Calendar, User, Eye, FileText, Video, Loader2 } from "lucide-react";
import React from "react";
import { useTaskManager } from "@/libs/hooks/useTask";
import { manageTask } from "@/libs/services/manageTask";
import { toast } from "sonner";
import type { Task } from "@/libs/types/task";

interface TaskSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "blog" | "video";
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
  contentType,
  onTaskSelect,
}) => {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [viewingTask, setViewingTask] = React.useState<Task | null>(null);
  const [loadingTaskDetail, setLoadingTaskDetail] = React.useState(false);

  const { loading, tasks, error, fetchTasksByProfile } = useTaskManager();

  // Utility functions
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

  const getDescription = (task: Task): string => {
    if (!task.description) return "No description available";
    if (typeof task.description === "string") return task.description;
    if (typeof task.description === "object") {
      try {
        return JSON.stringify(task.description);
      } catch {
        return "No description available";
      }
    }
    return "No description available";
  };

  const availableTasks: Task[] = React.useMemo(() => {
    return tasks.filter((task) => {
      // Filter by content type - adjust these type mappings as needed
      const isMatchingType =
        (contentType === "blog" && task.type === "CONTENT") ||
        (contentType === "video" && (task.type === "MARKETING" || task.type === "PRODUCT"));

      return isMatchingType;
    });
  }, [tasks, contentType]);

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
      <DialogContent className="max-w-2xl">
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
                Select Task for {contentType === "blog" ? "Blog" : "Video"} Content
              </DialogTitle>
              <DialogDescription>
                Choose a task from the list below to create {contentType} content for
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
                  <Button variant="outline" onClick={() => fetchTasksByProfile()} className="mt-2">
                    Retry
                  </Button>
                </div>
              ) : availableTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No {contentType} tasks available
                </div>
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
                    getDescription={getDescription}
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
  getDescription: (task: Task) => string;
}> = ({
  task,
  onSelect,
  selectedTask,
  onViewDetail,
  isLoadingDetail = false,
  getTaskColor,
  formatDate,
  getDescription,
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
              <span className="font-medium text-amber-600">Medium Priority</span>
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
        <p className="text-sm text-muted-foreground">{getDescription(task)}</p>
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

  const getDescription = (task: Task): string => {
    if (!task.description) return "No description available";
    if (typeof task.description === "string") return task.description;
    if (typeof task.description === "object") {
      try {
        return JSON.stringify(task.description);
      } catch {
        return "No description available";
      }
    }
    return "No description available";
  };

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

      <div className="max-h-[60vh] overflow-y-auto mt-4 space-y-6">
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
            <div className="flex items-center gap-2 mb-3">
              {task.type === "MARKETING" || task.type === "PRODUCT" ? (
                <Video className="h-4 w-4 text-purple-500" />
              ) : (
                <FileText className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm text-gray-600">{task.type} Content</span>
            </div>
          </div>
        </div>

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

          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">Status</div>
            <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium border bg-amber-100 text-amber-800 border-amber-200">
              {task.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Task Description */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{getDescription(task)}</p>
        </div>
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
