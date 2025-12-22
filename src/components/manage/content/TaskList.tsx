import { useRef, useEffect } from "react";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTask } from "@/libs/hooks/useTask";
import type { Task } from "@/libs/types/task";

interface TaskListProps {
  currentDate: Date;
  onViewTask?: (taskId: string) => void;
  statusFilter?: string;
}

export function TaskList({ currentDate, onViewTask, statusFilter = "ALL" }: TaskListProps) {
  const { profileTasks: tasks } = useTask();

  // Filter tasks by status
  const filteredTasks =
    statusFilter === "ALL" ? tasks : tasks.filter((task) => task.status === statusFilter);

  // Utility functions
  const getTaskIcon = (type: string) => {
    switch (type) {
      case "CONTENT":
        return <FileText className="h-4 w-4 text-white" />;
      default:
        return <div className="w-2 h-2 bg-white rounded-full" />;
    }
  };

  const getTaskColor = (type: string): string => {
    switch (type) {
      case "CONTENT":
        return "#f7c06d";
      default:
        return "#9976ff";
    }
  };

  const handleViewTaskDetail = (taskId: string) => {
    onViewTask?.(taskId);
  };

  // Get the week days (starting from Sunday to match Calendar)
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay(); // Sunday = 0
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Get tasks for a specific date (by created_at)
  const getTasksForDate = (date: Date): Task[] => {
    // Format target date to YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const targetDateStr = `${year}-${month}-${day}`;

    return filteredTasks.filter((task) => {
      if (!task.created_at) return false;

      // Convert API date string to YYYY-MM-DD
      // We handle potential "space vs T" issues for Firefox/Zen
      const isoString = task.created_at.replace(" ", "T");
      const d = new Date(isoString);

      // If the date is invalid, don't crash
      if (isNaN(d.getTime())) return false;

      const tYear = d.getFullYear();
      const tMonth = String(d.getMonth() + 1).padStart(2, "0");
      const tDay = String(d.getDate()).padStart(2, "0");
      const taskDateStr = `${tYear}-${tMonth}-${tDay}`;

      return taskDateStr === targetDateStr;
    });
  };

  const weekDays = getWeekDays();
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to selected day when currentDate changes
  useEffect(() => {
    const selectedIndex = weekDays.findIndex(
      (day) => day.toDateString() === currentDate.toDateString(),
    );
    if (selectedIndex !== -1 && dayRefs.current[selectedIndex]) {
      dayRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentDate, weekDays]);

  return (
    <div className="h-[80vh]">
      {/* Calendar Grid */}
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-border/20 p-4 space-y-4 overflow-y-auto">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isToday = new Date().toDateString() === day.toDateString();
          const isSelected = currentDate.toDateString() === day.toDateString();

          return (
            <motion.div
              key={day.toISOString()}
              ref={(el) => {
                dayRefs.current[index] = el;
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex flex-row ${index < 6 ? "border-b border-border/30 pb-4 mb-4" : ""}`}
            >
              {/* Day Header */}
              <div className="flex flex-col items-center justify-center w-24 flex-shrink-0 mr-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {dayNames[index]}
                </div>
                <div
                  className={`text-2xl font-semibold flex items-center justify-center w-10 h-10 rounded-full ${
                    isSelected
                      ? "text-primary-foreground bg-primary"
                      : isToday
                        ? "text-primary bg-primary/10"
                        : "text-foreground"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>

              {/* Tasks for this day */}
              <div className="flex-1">
                {dayTasks.length === 0 ? (
                  <div className="flex items-center justify-center w-full min-h-[120px]">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-dashed border-muted-foreground/50 rounded mx-auto mb-2"></div>
                      <p className="text-xs text-muted-foreground/80 font-medium">No tasks</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 auto-rows-min">
                    {dayTasks.map((task: Task, taskIndex: number) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: taskIndex * 0.05 }}
                        className="w-full"
                      >
                        <Card
                          className="group cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 overflow-hidden w-full h-full"
                          style={{ borderLeftColor: getTaskColor(task.type) }}
                          onClick={() => handleViewTaskDetail(task.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-2">
                              <div
                                className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 shadow-sm"
                                style={{ backgroundColor: getTaskColor(task.type) }}
                              >
                                {getTaskIcon(task.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                                  {task.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {`Campaign ${task.campaign_id.slice(-6)}`}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-2 py-0.5 h-auto"
                                    >
                                      {task.type}
                                    </Badge>
                                    <Badge
                                      variant={
                                        task.status === "DONE"
                                          ? "default"
                                          : task.status === "IN_PROGRESS"
                                            ? "outline"
                                            : "secondary"
                                      }
                                      className={`text-xs px-2 py-0.5 h-auto ${
                                        task.status === "DONE"
                                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                                          : task.status === "IN_PROGRESS"
                                            ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                      }`}
                                    >
                                      {task.status.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewTaskDetail(task.id);
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
