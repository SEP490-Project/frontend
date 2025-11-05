import React from "react";
import { FaBoxOpen, FaBox, FaFileLines, FaCalendarDays, FaGlobe, FaEye } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskListMarketing } from "@/libs/types/task";
import { groupTasksByDate, type LegacyTasksByDate } from "@/libs/utils/taskConverter";

interface TaskListProps {
  currentDate: Date;
  onViewTask?: (taskId: string) => void;
  tasks: TaskListMarketing[];
  loading?: boolean;
}

// === Helper Functions ===
const getTaskIcon = (type: string) => {
  switch (type) {
    case "PRODUCT":
      return <FaBox className="h-4 w-4 text-white" />;
    case "CONTENT":
      return <FaFileLines className="h-4 w-4 text-white" />;
    case "EVENT":
      return <FaCalendarDays className="h-4 w-4 text-white" />;
    case "OTHER":
      return <FaGlobe className="h-4 w-4 text-white" />;
    default:
      return <div className="w-2 h-2 bg-white rounded-full" />;
  }
};

const getTaskColor = (type: string) => {
  switch (type) {
    case "PRODUCT":
      return "#f7c06d";
    case "CONTENT":
      return "#ff88fa";
    case "EVENT":
      return "#6ad1ff";
    case "OTHER":
      return "#9976ff";
    default:
      return "#e5e7eb";
  }
};

function TaskList({ currentDate, onViewTask, tasks, loading }: TaskListProps) {
  const tasksByDate: LegacyTasksByDate[] = React.useMemo(() => groupTasksByDate(tasks), [tasks]);

  const handleViewTaskDetail = (taskId: string) => onViewTask?.(taskId);

  // Lấy toàn bộ ngày trong tuần (Thứ 2 - Chủ nhật)
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const getTasksForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const dayTasks = tasksByDate.find((g) => {
      const d = new Date(g.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === targetDate.getTime();
    });
    return dayTasks?.items || [];
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // === Gom nhóm ngày có / không có task ===
  const groupedDays: { type: "tasks" | "empty"; days: Date[] }[] = [];
  let temp: Date[] = [];
  let current: "tasks" | "empty" | null = null;

  weekDays.forEach((d) => {
    const hasTasks = getTasksForDate(d).length > 0;
    const t = hasTasks ? "tasks" : "empty";
    if (t !== current) {
      if (temp.length > 0) groupedDays.push({ type: current!, days: temp });
      temp = [d];
      current = t;
    } else temp.push(d);
  });
  if (temp.length && current) groupedDays.push({ type: current, days: temp });

  // === Render ===
  return (
    <div className="h-full">
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-border/20 p-4 space-y-4 overflow-y-auto">
        {groupedDays.map((group, groupIndex) => {
          // ===== 🟣 CASE 1: EMPTY DAYS =====
          if (group.type === "empty") {
            const start = group.days[0];
            const end = group.days[group.days.length - 1];
            const isSingle = group.days.length === 1;

            return (
              <motion.div
                key={`empty-${groupIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-row items-stretch mb-4"
              >
                {/* 🗓 Cột ngày bên trái */}
                <div className="w-24 flex-shrink-0 flex flex-col items-center justify-start gap-y-6 py-4">
                  {group.days.map((day) => {
                    const isToday = new Date().toDateString() === day.toDateString();
                    const dayName = dayNames[day.getDay() === 0 ? 6 : day.getDay() - 1];
                    return (
                      <div key={day.toISOString()} className="flex flex-col items-center">
                        <div className="text-xs font-medium uppercase tracking-wide mb-1 text-muted-foreground">
                          {dayName}
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
                    );
                  })}
                </div>

                {/* 📦 Cột nội dung “No tasks” */}
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/80 py-6">
                  <FaBoxOpen className="h-8 w-8 mb-2 opacity-70" />
                  <p className="text-sm font-medium text-center">
                    {isSingle
                      ? `No tasks on ${dayNames[start.getDay() === 0 ? 6 : start.getDay() - 1]} ${start.getDate()}`
                      : `No tasks from ${dayNames[start.getDay() === 0 ? 6 : start.getDay() - 1]} ${start.getDate()} to ${dayNames[end.getDay() === 0 ? 6 : end.getDay() - 1]} ${end.getDate()}`}
                  </p>
                </div>
              </motion.div>
            );
          }

          // ===== 🟢 CASE 2: DAYS WITH TASKS =====
          return group.days.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isToday = new Date().toDateString() === day.toDateString();
            const dayIndex = weekDays.findIndex((d) => d.toDateString() === day.toDateString());

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex flex-row border-b border-border/30 pb-4"
              >
                {/* Cột ngày bên trái */}
                <div className="flex flex-col items-center justify-center w-24 flex-shrink-0 mr-4">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {dayNames[dayIndex]}
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

                {/* Danh sách task */}
                <div className="flex-1 flex gap-3 overflow-x-auto">
                  {dayTasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: taskIndex * 0.05 }}
                      className="flex-shrink-0"
                    >
                      <Card
                        className="group cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 overflow-hidden w-64"
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
                                {task.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {task.campaign_name}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge
                                  className="text-xs px-2 py-0.5 h-auto"
                                  style={{
                                    backgroundColor: getTaskColor(task.type),
                                  }}
                                >
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
                                  <FaEye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          });
        })}
      </div>
    </div>
  );
}

export default TaskList;
