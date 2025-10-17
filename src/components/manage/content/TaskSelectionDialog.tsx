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
import { Calendar, User, Eye, FileText, Video } from "lucide-react";
import React from "react";

// Import the task data structure from the existing tasks
import tasksData from "@/pages/manager/content/mock-data/tasks-data.json";

interface ContentTask {
  id: number;
  title: string;
  type: "Blog" | "Video";
  campaign: string;
  status: "to-do" | "in-progress" | "completed";
  details: {
    description: string;
    assignee: string;
    dueTime: string;
    priority: "High" | "Medium" | "Low";
  };
  color: string;
}

interface TaskSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "blog" | "video";
  onTaskSelect: (task: ContentTask) => void;
}

interface TaskDetailViewProps {
  task: ContentTask;
  onBack: () => void;
  onSelectForContent: () => void;
}

const TaskSelectionDialog: React.FC<TaskSelectionDialogProps> = ({
  isOpen,
  onClose,
  contentType,
  onTaskSelect,
}) => {
  const [selectedTask, setSelectedTask] = React.useState<ContentTask | null>(null);
  const [viewingTask, setViewingTask] = React.useState<ContentTask | null>(null);

  // Transform and filter tasks based on content type
  const availableTasks: ContentTask[] = React.useMemo(() => {
    const allTasks: ContentTask[] = [];

    tasksData.beautyTasks.forEach((taskGroup) => {
      taskGroup.items.forEach((item) => {
        allTasks.push({
          id: item.id,
          title: item.title,
          type: item.type as "Blog" | "Video",
          campaign: item.campaign,
          status: item.status as "to-do" | "in-progress" | "completed",
          details: {
            ...item.details,
            priority: item.details.priority as "High" | "Medium" | "Low",
          },
          color: item.color,
        });
      });
    });

    // Filter tasks by content type and status
    return allTasks.filter(
      (task) =>
        task.type.toLowerCase() === contentType &&
        // You can add more filters here, like status filtering
        true,
    );
  }, [contentType]);

  const handleTaskSelect = (task: ContentTask) => {
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

  const handleViewTaskDetail = (task: ContentTask) => {
    setViewingTask(task);
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
              {availableTasks.length === 0 ? (
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
  task: ContentTask;
  onSelect: (task: ContentTask) => void;
  selectedTask: ContentTask | null;
  onViewDetail: (task: ContentTask) => void;
}> = ({ task, onSelect, selectedTask, onViewDetail }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-amber-600";
      case "Low":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

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
            style={{ backgroundColor: task.color }}
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div className="space-y-1">
            <CardTitle
              className={`text-base ${selectedTask?.id === task.id ? "text-[#FF9DB0]" : ""}`}
            >
              {task.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {task.details.assignee}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {task.details.dueTime}
              </span>
              <span className={`font-medium ${getPriorityColor(task.details.priority)}`}>
                {task.details.priority} Priority
              </span>
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2">
          {task.type === "Video" ? (
            <Video className="h-4 w-4 text-purple-500" />
          ) : (
            <FileText className="h-4 w-4 text-blue-500" />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(task);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Task Details</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{task.details.description}</p>
      </CardContent>
    </Card>
  );
};

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onBack, onSelectForContent }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
            style={{ backgroundColor: task.color }}
          >
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              {task.type === "Video" ? (
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
            <p className="font-medium text-gray-900">{task.details.assignee}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="h-4 w-4" />
              Due Date
            </div>
            <p className="font-medium text-gray-900">{task.details.dueTime}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">Priority Level</div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.details.priority)}`}
            >
              {task.details.priority} Priority
            </span>
          </div>
        </div>

        {/* Task Description */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 leading-relaxed">{task.details.description}</p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
        <Button className="bg-[#FF9DB0] hover:bg-pink-600 text-white" onClick={onSelectForContent}>
          Create Content for This Task
        </Button>
      </DialogFooter>
    </>
  );
};

export default TaskSelectionDialog;
