"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const beautyTasks = [
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
  const [taskStatuses, setTaskStatuses] = useState<Record<number, TaskStatus>>(() => {
    const initial: Record<number, TaskStatus> = {};
    beautyTasks.forEach((task) => {
      task.items.forEach((item) => {
        initial[item.id] = item.status;
      });
    });
    return initial;
  });

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

  const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [taskId]: newStatus,
    }));
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

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            <span className="text-[#8c96ab] font-medium">No tasks available</span>
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
                      transition={{ duration: 0.3 }}
                      className="rounded-lg p-4 border border-[#dadada] bg-[#f8f9fa] text-center"
                    >
                      <span className="text-[#8c96ab] font-medium">No tasks available</span>
                    </motion.div>
                  ) : (
                    task.items.map((item, itemIndex) => {
                      const isExpanded = expandedTasks.has(item.id);
                      const currentStatus = taskStatuses[item.id];

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                          className="rounded-lg border border-[#dadada] bg-[#ffffff] overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                          <motion.div
                            className="p-4"
                            whileHover={{ backgroundColor: "#fafafa" }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: item.color }}
                                >
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                </motion.div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#515663]">{item.type}</span>
                                    <motion.span
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.3, delay: 0.1 }}
                                      className="font-medium text-[#1c1b1f]"
                                    >
                                      {item.title}
                                    </motion.span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <motion.div
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                  className="text-right"
                                >
                                  <div className="text-sm font-medium text-[#1c1b1f]">
                                    {item.campaign}
                                  </div>
                                </motion.div>
                                <motion.select
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: 0.3 }}
                                  whileHover={{ scale: 1.05 }}
                                  value={currentStatus}
                                  onChange={(e) =>
                                    updateTaskStatus(item.id, e.target.value as TaskStatus)
                                  }
                                  className="px-3 py-1 text-xs font-medium rounded-full border-0 cursor-pointer transition-all duration-200"
                                  style={{
                                    backgroundColor: getStatusColor(currentStatus),
                                    color: "white",
                                  }}
                                >
                                  <option value="to-do">To Do</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                </motion.select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleTaskExpansion(item.id)}
                                  className="hover:scale-110 transition-transform duration-200"
                                >
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
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
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="px-4 pb-4 border-t border-[#f0f0f0] bg-[#fafafa] overflow-hidden"
                              >
                                <motion.div
                                  initial={{ y: -10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: -10, opacity: 0 }}
                                  transition={{ duration: 0.2, delay: 0.1 }}
                                  className="pt-3 space-y-2"
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                  >
                                    <span className="text-xs font-medium text-[#515663]">
                                      Description:
                                    </span>
                                    <p className="text-sm text-[#1c1b1f] mt-1">
                                      {item.details.description}
                                    </p>
                                  </motion.div>
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="grid grid-cols-2 gap-4"
                                  >
                                    <div>
                                      <span className="text-xs font-medium text-[#515663]">
                                        Assignee:
                                      </span>
                                      <p className="text-sm text-[#1c1b1f]">
                                        {item.details.assignee}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-xs font-medium text-[#515663]">
                                        Due Time:
                                      </span>
                                      <p className="text-sm text-[#1c1b1f]">
                                        {item.details.dueTime}
                                      </p>
                                    </div>
                                  </motion.div>
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                  >
                                    <span className="text-xs font-medium text-[#515663]">
                                      Priority:
                                    </span>
                                    <motion.span
                                      initial={{ scale: 0.8, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ duration: 0.2, delay: 0.4 }}
                                      className={`ml-2 px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
                                        item.details.priority === "High"
                                          ? "bg-[#ff6260] text-white"
                                          : item.details.priority === "Medium"
                                            ? "bg-[#f7c06d] text-white"
                                            : "bg-[#8c96ab] text-white"
                                      }`}
                                    >
                                      {item.details.priority}
                                    </motion.span>
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
