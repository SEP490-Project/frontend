"use client";

import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskDetail } from "./TaskDetail";

export const beautyTasks = [
  {
    date: new Date(2025, 9, 29),
    items: [
      {
        id: 1,
        type: "Blog",
        color: "#f7c06d",
        title: "Fall Skincare Transition Guide",
        campaign: "Autumn Glow Campaign",
        status: "completed" as const,
        details: {
          description: "Comprehensive guide on transitioning skincare routine from summer to fall",
          assignee: "Sarah Chen",
          dueTime: "All day",
          priority: "High",
        },
      },
    ],
  },
  {
    date: new Date(2025, 7, 30), // August 30, 2025
    items: [
      {
        id: 2,
        type: "Video",
        color: "#ff88fa",
        title: "Pumpkin Spice Makeup Look",
        campaign: "Autumn Glow Campaign",
        status: "in-progress" as const,
        details: {
          description: "Create warm autumn-inspired makeup tutorial using our new fall palette",
          assignee: "Emma Rodriguez",
          dueTime: "2:00 PM",
          priority: "Medium",
        },
      },
    ],
  },
  {
    date: new Date(2025, 8, 1), // September 1, 2025
    items: [],
  },
  {
    date: new Date(2025, 8, 2), // September 2, 2025
    items: [],
  },
  {
    date: new Date(2025, 8, 3), // September 3, 2025
    items: [
      {
        id: 3,
        type: "Post",
        color: "#9976ff",
        title: "Halloween Prep Skincare",
        campaign: "Spooky Beauty Series",
        status: "to-do" as const,
        details: {
          description: "Instagram post about prepping skin for heavy Halloween makeup",
          assignee: "Michael Park",
          dueTime: "10:00 AM",
          priority: "High",
        },
      },
    ],
  },
  {
    date: new Date(2025, 8, 4), // September 4, 2025
    items: [],
  },
  {
    date: new Date(2025, 8, 5), // September 5, 2025
    items: [
      {
        id: 4,
        type: "Video",
        color: "#ff88fa",
        title: "Vampire Makeup Tutorial",
        campaign: "Spooky Beauty Series",
        status: "to-do" as const,
        details: {
          description: "Step-by-step vampire makeup look for Halloween using dramatic colors",
          assignee: "Jessica Liu",
          dueTime: "3:30 PM",
          priority: "Medium",
        },
      },
      {
        id: 5,
        type: "Blog",
        color: "#f7c06d",
        title: "Best Makeup Removers Review",
        campaign: "Product Review Series",
        status: "in-progress" as const,
        details: {
          description: "Comprehensive review of top 10 makeup removers for sensitive skin",
          assignee: "Alex Thompson",
          dueTime: "All day",
          priority: "Low",
        },
      },
    ],
  },
  {
    date: new Date(2025, 8, 6), // September 6, 2025
    items: [],
  },
  {
    date: new Date(2025, 8, 7), // September 7, 2025
    items: [],
  },
  {
    date: new Date(2025, 8, 8), // September 8, 2025
    items: [
      {
        id: 6,
        type: "Post",
        color: "#9976ff",
        title: "Glowing Skin Tips",
        campaign: "Healthy Skin Initiative",
        status: "completed" as const,
        details: {
          description: "Social media post featuring 5 tips for achieving naturally glowing skin",
          assignee: "Sarah Chen",
          dueTime: "9:00 AM",
          priority: "Medium",
        },
      },
    ],
  },
  {
    date: new Date(2025, 8, 10), // September 10, 2025
    items: [
      {
        id: 7,
        type: "Video",
        color: "#ff88fa",
        title: "Morning Skincare Routine",
        campaign: "Daily Beauty Essentials",
        status: "to-do" as const,
        details: {
          description: "Step-by-step morning skincare routine for glowing skin",
          assignee: "Emma Rodriguez",
          dueTime: "11:00 AM",
          priority: "High",
        },
      },
    ],
  },
  {
    date: new Date(2025, 8, 12), // September 12, 2025
    items: [
      {
        id: 8,
        type: "Blog",
        color: "#f7c06d",
        title: "Winter Lip Care Guide",
        campaign: "Seasonal Beauty Tips",
        status: "in-progress" as const,
        details: {
          description: "Complete guide to keeping lips healthy and moisturized during winter",
          assignee: "Michael Park",
          dueTime: "All day",
          priority: "Medium",
        },
      },
    ],
  },
  {
    date: new Date(2025, 8, 15), // September 15, 2025
    items: [
      {
        id: 9,
        type: "Post",
        color: "#9976ff",
        title: "Eye Makeup Trends 2025",
        campaign: "Trend Alert Series",
        status: "to-do" as const,
        details: {
          description: "Social media post showcasing the hottest eye makeup trends for 2025",
          assignee: "Jessica Liu",
          dueTime: "3:00 PM",
          priority: "High",
        },
      },
    ],
  },
];

type TaskStatus = "to-do" | "in-progress" | "completed";

interface TaskListProps {
  currentDate: Date;
}

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
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so 6 days back to Monday
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Get the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Add 6 days to get to Sunday
    endOfWeek.setHours(23, 59, 59, 999);

    console.log("[v0] Current date:", currentDate);
    console.log("[v0] Week start (Monday):", startOfWeek);
    console.log("[v0] Week end (Sunday):", endOfWeek);

    const filtered = beautyTasks
      .filter((task) => {
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    console.log(
      "[v0] Filtered weekly tasks:",
      filtered.map((t) => ({ date: t.date, itemCount: t.items.length })),
    );
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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "to-do":
        return "#8c96ab";
      case "in-progress":
        return "#6366f1";
      case "completed":
        return "#55d041";
    }
  };

  const filteredTasks = getTasksForDateRange();

  // If showing task detail, render the TaskDetail component instead of the task list
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
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center py-12"
          >
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <span className="text-gray-500 font-semibold text-lg">No tasks available</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {filteredTasks.map((task, index) => (
              <motion.div
                key={`${task.date.getTime()}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-4"
              >
                {/* Date Column */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                  className="w-16 flex-shrink-0"
                >
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[#1c1b1f]">
                      {task.date.getDate()}
                    </div>
                    <div className="text-xs text-[#515663] font-medium">
                      {task.date
                        .toLocaleDateString("en-US", { month: "short", weekday: "short" })
                        .toUpperCase()}
                    </div>
                  </div>
                </motion.div>

                {/* Tasks Column */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="flex-1 space-y-2"
                >
                  {task.items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="rounded-xl p-6 border border-gray-200 bg-gradient-to-br from-gray-50 to-white text-center shadow-sm"
                    >
                      <span className="text-gray-500 font-medium text-base">
                        No tasks available
                      </span>
                    </motion.div>
                  ) : (
                    task.items.map((item, itemIndex) => {
                      const isExpanded = expandedTasks.has(item.id);
                      const currentStatus = getAutoProgressStatus(task.date, item.status);

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: itemIndex * 0.05,
                            ease: [0.4, 0.0, 0.2, 1],
                          }}
                          className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ease-out hover:border-gray-300"
                          whileHover={{
                            y: -2,
                            transition: { duration: 0.3, ease: "easeOut" },
                          }}
                        >
                          <motion.div
                            className="p-5 cursor-pointer"
                            whileHover={{
                              backgroundColor: "rgba(248, 250, 252, 0.8)",
                              transition: { duration: 0.3 },
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <motion.div
                                  whileHover={{
                                    scale: 1.15,
                                    rotate: 5,
                                    transition: { duration: 0.2 },
                                  }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                                  style={{ backgroundColor: item.color }}
                                >
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                </motion.div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <motion.span
                                      className="text-sm font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-md"
                                      whileHover={{
                                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                                        color: "rgba(99, 102, 241, 1)",
                                        transition: { duration: 0.2 },
                                      }}
                                    >
                                      {item.type}
                                    </motion.span>
                                    <motion.span
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.1 }}
                                      className="font-semibold text-gray-900 text-base group-hover:text-gray-700 transition-colors duration-300"
                                    >
                                      {item.title}
                                    </motion.span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: 0.3 }}
                                  whileHover={{ scale: 1.05 }}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg border-0 cursor-default transition-all duration-300"
                                  style={{
                                    backgroundColor: getStatusColor(currentStatus),
                                    color: "white",
                                    boxShadow: `0 2px 8px ${getStatusColor(currentStatus)}40`,
                                  }}
                                >
                                  {currentStatus === "to-do"
                                    ? "To Do"
                                    : currentStatus === "in-progress"
                                      ? "In Progress"
                                      : "Completed"}
                                </motion.div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleTaskExpansion(item.id)}
                                  className="hover:bg-gray-100 hover:scale-105 transition-all duration-300 rounded-lg p-2"
                                >
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                  </motion.div>
                                </Button>
                              </div>
                            </div>
                          </motion.div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.5,
                                  ease: [0.4, 0.0, 0.2, 1],
                                  opacity: { duration: 0.3 },
                                }}
                                className="px-5 pb-5 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden"
                              >
                                <motion.div
                                  initial={{ y: -10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: -10, opacity: 0 }}
                                  transition={{
                                    duration: 0.4,
                                    delay: 0.1,
                                    ease: "easeOut",
                                  }}
                                  className="pt-4 space-y-4"
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.15 }}
                                    className="space-y-2"
                                  >
                                    <span className="text-sm font-semibold text-gray-700">
                                      Description
                                    </span>
                                    <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                                      {item.details.description}
                                    </p>
                                  </motion.div>

                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.25 }}
                                    className="grid grid-cols-2 gap-4"
                                  >
                                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                                      <span className="text-sm font-semibold text-gray-700 block mb-1">
                                        Assignee
                                      </span>
                                      <p className="text-sm text-gray-600 font-medium">
                                        {item.details.assignee}
                                      </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                                      <span className="text-sm font-semibold text-gray-700 block mb-1">
                                        Due Time
                                      </span>
                                      <p className="text-sm text-gray-600 font-medium">
                                        {item.details.dueTime}
                                      </p>
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.35 }}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold text-gray-700">
                                        Priority:
                                      </span>
                                      <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                          item.details.priority === "High"
                                            ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                                            : item.details.priority === "Medium"
                                              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                                              : "bg-gray-500 text-white shadow-lg shadow-gray-500/25"
                                        }`}
                                      >
                                        {item.details.priority}
                                      </motion.span>
                                    </div>

                                    <motion.button
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{ duration: 0.3, delay: 0.45 }}
                                      onClick={() => handleViewTaskDetail(item.id)}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View Task Detail
                                    </motion.button>
                                  </motion.div>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
