import { ChevronDown, Eye, User, Clock, AlertTriangle, FileText, Video, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskDetail } from "./TaskDetail";
import tasksData from "@/pages/manager/content/mock-data/tasks-data.json";

// Transform JSON data to match the expected format
export const beautyTasks = tasksData.beautyTasks.map((task) => ({
  ...task,
  date: new Date(task.date),
  items: task.items.map((item) => ({
    ...item,
    status: item.status as "to-do" | "in-progress" | "completed",
  })),
}));

type TaskStatus = "to-do" | "in-progress" | "completed";

interface TaskListProps {
  currentDate: Date;
}

// Utility functions
const getTaskIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Video className="h-4 w-4 text-white" />;
    case "Blog":
      return <FileText className="h-4 w-4 text-white" />;
    case "Post":
      return <Image className="h-4 w-4 text-white" />;
    default:
      return <div className="w-2 h-2 bg-white rounded-full" />;
  }
};

const getStatusVariant = (
  status: TaskStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "completed":
      return "default";
    case "in-progress":
      return "secondary";
    case "to-do":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case "to-do":
      return "To Do";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

export function TaskList({ currentDate }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  // Auto-progress tasks based on current date
  const getAutoProgressStatus = (dueDate: Date, originalStatus: TaskStatus): TaskStatus => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    if (originalStatus === "completed") return "completed";

    if (taskDate < today) {
      return "completed";
    } else if (taskDate.getTime() === today.getTime()) {
      return "in-progress";
    } else {
      return "to-do";
    }
  };

  const getTasksForDateRange = () => {
    // Get the start of the week (Monday)
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Get the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const filtered = beautyTasks
      .filter((task) => {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return filtered;
  };

  const toggleTaskExpansion = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleViewTaskDetail = (taskId: number) => {
    setSelectedTaskId(taskId);
    setShowTaskDetail(true);
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTaskId(null);
  };

  const filteredTasks = getTasksForDateRange();

  // If showing task detail, render the TaskDetail component
  if (showTaskDetail && selectedTaskId) {
    return (
      <TaskDetail
        taskId={selectedTaskId}
        onClose={handleCloseTaskDetail}
        isVisible={showTaskDetail}
      />
    );
  }

  return (
    <div className="space-y-6">
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Card className="mx-auto max-w-md">
            <CardContent className="p-8">
              <div className="text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No tasks available</p>
                <p className="text-sm mt-1">There are no tasks scheduled for this week.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={`${task.date.getTime()}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex gap-6"
            >
              {/* Date Column */}
              <div className="w-20 flex-shrink-0">
                <div className="text-center sticky top-6">
                  <div className="text-2xl font-bold text-foreground">{task.date.getDate()}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {task.date
                      .toLocaleDateString("en-US", { month: "short", weekday: "short" })
                      .toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Tasks Column */}
              <div className="flex-1 space-y-3">
                {task.items.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground text-sm">No tasks scheduled</p>
                    </CardContent>
                  </Card>
                ) : (
                  task.items.map((item) => {
                    const isExpanded = expandedTasks.has(item.id);
                    const currentStatus = getAutoProgressStatus(task.date, item.status);

                    return (
                      <Card
                        key={item.id}
                        className="group overflow-hidden border-border/40 bg-card hover:shadow-md transition-all duration-10 ease-out hover:border-border"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-105"
                                style={{ backgroundColor: item.color }}
                              >
                                {getTaskIcon(item.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <Badge variant="secondary" className="text-xs font-medium">
                                    {item.type}
                                  </Badge>
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                                    {item.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.campaign}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Badge
                                variant={getStatusVariant(currentStatus)}
                                className="font-medium"
                              >
                                {getStatusLabel(currentStatus)}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTaskExpansion(item.id)}
                                className="h-8 w-8 p-0 hover:bg-accent transition-colors duration-200"
                              >
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </motion.div>
                              </Button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.1,
                                  ease: [0, 0, 0, 0],
                                  opacity: { duration: 0.1 },
                                }}
                                className="mt-4 pt-4 border-t space-y-4 overflow-hidden"
                              >
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <h4 className="text-sm font-semibold text-foreground mb-2">
                                    Description
                                  </h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.details.description}
                                  </p>
                                </motion.div>

                                <motion.div
                                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Assignee
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                      {item.details.assignee}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Due Time
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground">
                                      {item.details.dueTime}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Priority
                                      </span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {item.details.priority}
                                    </Badge>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex justify-end pt-2"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                  <Button
                                    onClick={() => handleViewTaskDetail(item.id)}
                                    className="gap-2"
                                    size="sm"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View Details
                                  </Button>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
