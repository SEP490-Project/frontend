import { Eye, FileText, Video, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { motion } from "framer-motion";

import { useTaskManager } from "@/libs/hooks/useTask";
import { groupTasksByDate, type LegacyTasksByDate } from "@/libs/utils/taskConverter";

interface TaskListProps {
  currentDate: Date;
  onViewTask?: (taskId: string) => void;
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

export function TaskList({ currentDate, onViewTask }: TaskListProps) {
  const { tasks } = useTaskManager();

  // Convert API tasks to legacy format grouped by date
  const tasksByDate: LegacyTasksByDate[] = React.useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);

  const handleViewTaskDetail = (taskId: string) => {
    onViewTask?.(taskId);
  };

  // Get the week days
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const dayTasks = tasksByDate.find((taskGroup) => {
      const taskDate = new Date(taskGroup.date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === targetDate.getTime();
    });

    return dayTasks?.items || [];
  };

  const weekDays = getWeekDays();
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="h-full">
      {/* Calendar Grid */}
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-border/20 p-4 space-y-4 overflow-y-auto">
        {weekDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isToday = new Date().toDateString() === day.toDateString();

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex flex-row min-h-[120px] ${
                index < 6 ? "border-b border-border/30 pb-4" : ""
              }`}
            >
              {/* Day Header */}
              <div className="flex flex-col items-center justify-center w-24 flex-shrink-0 mr-4">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  {dayNames[index]}
                </div>
                <div
                  className={`text-2xl font-semibold ${
                    isToday
                      ? "text-primary bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center"
                      : "text-foreground"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>

              {/* Tasks for this day */}
              <div className="flex-1 flex gap-3 overflow-x-auto">
                {dayTasks.length === 0 ? (
                  <div className="flex items-center justify-center w-full min-w-[200px]">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-dashed border-muted-foreground/50 rounded mx-auto mb-2"></div>
                      <p className="text-xs text-muted-foreground/80 font-medium">No tasks</p>
                    </div>
                  </div>
                ) : (
                  dayTasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: taskIndex * 0.05 }}
                      className="flex-shrink-0"
                    >
                      <Card
                        className="group cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 overflow-hidden w-64"
                        style={{ borderLeftColor: task.color }}
                        onClick={() => handleViewTaskDetail(task.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div
                              className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0 shadow-sm"
                              style={{ backgroundColor: task.color }}
                            >
                              {getTaskIcon(task.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                                {task.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {task.campaign}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs px-2 py-0.5 h-auto">
                                  {task.type}
                                </Badge>
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
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
