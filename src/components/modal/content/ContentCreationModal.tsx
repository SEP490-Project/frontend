import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Video,
  Calendar,
  User,
  Building2,
  Briefcase,
  SkipForward,
  ArrowRight,
  Check,
} from "lucide-react";
import { manageTask } from "@/libs/services/manageTask";
import { useAuth } from "@/libs/hooks/useAuth";
import { cn } from "@/libs/utils";
import type { Task } from "@/libs/types/task";

export type ContentType = "blog" | "video";

interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contentType: ContentType, task?: Task) => void;
}

export const ContentCreationModal: React.FC<ContentCreationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [activeTab, setActiveTab] = useState<"type" | "task">("type");
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Fetch tasks when opening task tab
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

  // Fetch tasks when switching to task tab
  useEffect(() => {
    if (activeTab === "task" && isOpen) {
      fetchAvailableTasks();
    }
  }, [activeTab, isOpen, fetchAvailableTasks]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("type");
      setSelectedContentType(null);
      setSelectedTask(null);
    }
  }, [isOpen]);

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedContentType(type);
  };

  const handleContinue = () => {
    if (selectedContentType) {
      setActiveTab("task");
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleConfirmWithTask = () => {
    if (selectedContentType && selectedTask) {
      onConfirm(selectedContentType, selectedTask);
      onClose();
    }
  };

  const handleSkipTask = () => {
    if (selectedContentType) {
      onConfirm(selectedContentType, undefined);
      onClose();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">Create New Content</DialogTitle>
          {/* Skip button - only visible on task tab with animation */}
          {activeTab === "task" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipTask}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 animate-in fade-in-0 slide-in-from-right-2"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Skip task selection
            </Button>
          )}
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "type" | "task")}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="type"
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Content Type
              {selectedContentType && (
                <Check className="w-3 h-3 text-green-600 animate-in zoom-in-50 duration-200" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="task"
              disabled={!selectedContentType}
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:shadow-sm"
            >
              <Briefcase className="w-4 h-4" />
              Select Task
            </TabsTrigger>
          </TabsList>

          {/* Content Type Tab */}
          <TabsContent
            value="type"
            className="flex-1 mt-4 animate-in fade-in-0 slide-in-from-left-4 duration-300"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose the type of content you want to create
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Blog Card */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-300 ease-out",
                    "hover:border-primary hover:shadow-lg hover:-translate-y-1",
                    "transform-gpu",
                    selectedContentType === "blog"
                      ? "border-primary ring-2 ring-primary/20 shadow-md bg-blue-50/30"
                      : "hover:bg-blue-50/20",
                  )}
                  onClick={() => handleContentTypeSelect("blog")}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-all duration-300",
                          selectedContentType === "blog" ? "bg-blue-500 scale-110" : "bg-blue-100",
                        )}
                      >
                        <FileText
                          className={cn(
                            "w-6 h-6 transition-colors duration-300",
                            selectedContentType === "blog" ? "text-white" : "text-blue-600",
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Blog Post</CardTitle>
                        {selectedContentType === "blog" && (
                          <Check className="w-5 h-5 text-primary animate-in zoom-in-50 duration-200" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Create rich text articles with images, formatting, and SEO optimization
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Video Card */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-300 ease-out",
                    "hover:border-primary hover:shadow-lg hover:-translate-y-1",
                    "transform-gpu",
                    selectedContentType === "video"
                      ? "border-primary ring-2 ring-primary/20 shadow-md bg-purple-50/30"
                      : "hover:bg-purple-50/20",
                  )}
                  onClick={() => handleContentTypeSelect("video")}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-all duration-300",
                          selectedContentType === "video"
                            ? "bg-purple-500 scale-110"
                            : "bg-purple-100",
                        )}
                      >
                        <Video
                          className={cn(
                            "w-6 h-6 transition-colors duration-300",
                            selectedContentType === "video" ? "text-white" : "text-purple-600",
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">Video Content</CardTitle>
                        {selectedContentType === "video" && (
                          <Check className="w-5 h-5 text-primary animate-in zoom-in-50 duration-200" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Upload and configure video content for social media platforms
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleContinue}
                  disabled={!selectedContentType}
                  className="transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Task Selection Tab */}
          <TabsContent
            value="task"
            className="flex-1 mt-4 overflow-hidden flex flex-col animate-in fade-in-0 slide-in-from-right-4 duration-300"
          >
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <p className="text-sm text-muted-foreground">
                Select a task to associate with your content (optional)
              </p>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                {loading ? (
                  // Loading skeleton with staggered animation
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Card
                        key={i}
                        className="p-4 animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  // Error state
                  <div className="text-center py-8 text-muted-foreground animate-in fade-in-50 duration-300">
                    <p>{error}</p>
                    <Button
                      variant="outline"
                      className="mt-2 transition-all hover:shadow-sm active:scale-95"
                      onClick={fetchAvailableTasks}
                    >
                      Retry
                    </Button>
                  </div>
                ) : tasks.length === 0 ? (
                  // Empty state
                  <div className="text-center py-8 text-muted-foreground animate-in fade-in-50 duration-300">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No available tasks found</p>
                    <p className="text-sm">You can still create content without a task</p>
                  </div>
                ) : (
                  // Task list with staggered animation
                  tasks.map((task, index) => (
                    <Card
                      key={task.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 ease-out",
                        "hover:border-primary hover:shadow-md hover:-translate-y-0.5",
                        "transform-gpu animate-in fade-in-0 slide-in-from-bottom-2",
                        selectedTask?.id === task.id
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                          : "",
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleTaskSelect(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200",
                              selectedTask?.id === task.id && "scale-110",
                            )}
                            style={{
                              backgroundColor:
                                selectedTask?.id === task.id ? "#f7c06d40" : "#f7c06d20",
                            }}
                          >
                            <Briefcase className="w-5 h-5" style={{ color: "#f7c06d" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium truncate">{task.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {task.type}
                              </Badge>
                              {selectedTask?.id === task.id && (
                                <Check className="w-4 h-4 text-primary animate-in zoom-in-50 duration-200" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(task.deadline)}
                              </span>
                              {task.brand_info?.name && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {task.brand_info.name}
                                </span>
                              )}
                              {task.assigned_to_name && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {task.assigned_to_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("type")}
                  className="transition-all duration-200 hover:shadow-sm active:scale-95"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmWithTask}
                  disabled={!selectedTask}
                  className="transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  Create with Task
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContentCreationModal;
