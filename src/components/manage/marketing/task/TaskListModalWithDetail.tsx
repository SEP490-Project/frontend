import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBox, FaFileLines, FaCalendarDays, FaGlobe, FaUser, FaClock } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskDetailSlider from "./TaskDetailSlider";
import type { TaskListMarketing, TaskListMarketingDetail } from "@/libs/types/task";
import { formatDate } from "@/libs/helper/helper";

interface TaskListModalWithDetailProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  tasks: TaskListMarketing[];
  taskDetail: TaskListMarketingDetail | null;
  detailLoading: boolean;
  onTaskClick: (taskId: string) => void;
  onClearTaskDetail: () => void;
}

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

function TaskListModalWithDetail({
  isOpen,
  onClose,
  selectedDate,
  tasks,
  taskDetail,
  detailLoading,
  onTaskClick,
  onClearTaskDetail,
}: TaskListModalWithDetailProps) {
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const handleTaskClick = (taskId: string) => {
    // Nếu đã có task detail và đang loading, không cho phép click task khác
    if (detailLoading && taskDetail) return;

    setShowTaskDetail(true);
    onTaskClick(taskId);
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    onClearTaskDetail(); // Clear task detail when going back
  };

  const handleModalClose = () => {
    setShowTaskDetail(false);
    onClearTaskDetail(); // Clear task detail when closing modal
    onClose();
  };

  const formatDateTitle = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <div className="relative h-full overflow-hidden flex flex-col">
          {/* Task List Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/20">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Tasks for {formatDateTitle(selectedDate)}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {tasks.length} {tasks.length === 1 ? "task" : "tasks"} scheduled
                </p>
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-6">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <FaCalendarDays className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No tasks scheduled</p>
                  <p className="text-sm">for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Card
                          className={`group cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 overflow-hidden ${
                            detailLoading && taskDetail?.id === task.id ? "opacity-60" : ""
                          }`}
                          style={{ borderLeftColor: getTaskColor(task.type) }}
                          onClick={() => handleTaskClick(task.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                                style={{ backgroundColor: getTaskColor(task.type) }}
                              >
                                {getTaskIcon(task.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
                                  {task.name}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {task.campaign_name}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <FaUser className="h-3 w-3" />
                                    <span>{task.assigned_to_name}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FaClock className="h-3 w-3" />
                                    <span>{formatDate(task.deadline)}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      className="text-xs px-2 py-1 h-auto"
                                      style={{
                                        backgroundColor: getTaskColor(task.type),
                                        color: "white",
                                      }}
                                    >
                                      {task.type}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs px-2 py-1 h-auto">
                                      {task.status.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs px-3 py-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTaskClick(task.id);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Task Detail Slider (slides in from right) */}
          <AnimatePresence>
            {showTaskDetail && (
              <TaskDetailSlider
                task={taskDetail}
                onBack={handleCloseTaskDetail}
                isVisible={showTaskDetail}
                loading={detailLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TaskListModalWithDetail;
