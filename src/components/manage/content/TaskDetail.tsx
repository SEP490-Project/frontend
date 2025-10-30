import { motion } from "framer-motion";
import { X, User, Clock, AlertTriangle, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskManager } from "@/libs/hooks/useTask";
import { useEffect } from "react";

interface TaskDetailProps {
  taskId: string | null;
  onClose: () => void;
  isVisible: boolean;
}

export function TaskDetail({ taskId, onClose, isVisible }: TaskDetailProps) {
  const { selectedTask, fetchTaskById, loading } = useTaskManager();

  useEffect(() => {
    if (taskId && isVisible) {
      fetchTaskById(taskId);
    }
  }, [taskId, isVisible, fetchTaskById]);

  // Safety wrapper to catch any object rendering errors
  try {
    if (!taskId || !isVisible) return null;

    // Show loading state while fetching task
    if (loading || !selectedTask) {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white overflow-y-auto flex items-center justify-center h-full"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading task details...</p>
          </div>
        </motion.div>
      );
    }

    // Additional safety check - if selectedTask is somehow still undefined
    if (!selectedTask || !selectedTask.id) {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white overflow-y-auto flex items-center justify-center h-full"
        >
          <div className="text-center">
            <p className="text-muted-foreground">Task not found or failed to load.</p>
            <Button onClick={onClose} variant="outline" className="mt-4">
              Go Back
            </Button>
          </div>
        </motion.div>
      );
    }

    // Debug: Log the selectedTask structure to understand what's causing the error

    // Convert to legacy format for backward compatibility with existing UI
    const legacyTask = {
      id: selectedTask.id || "",
      title: selectedTask.name || "Untitled Task",
      type: selectedTask.type || "Unknown", // Keep original API type
      campaign: `Campaign ${selectedTask.campaign_id?.slice(-6) || "Unknown"}`,
      status:
        selectedTask.status === "TODO"
          ? "to-do"
          : selectedTask.status === "IN_PROGRESS"
            ? "in-progress"
            : "completed",
      details: {
        description: (() => {
          // Safely handle description field that might be an object or string
          if (!selectedTask.description) return "No description available";
          if (typeof selectedTask.description === "string") return selectedTask.description;
          if (typeof selectedTask.description === "object") {
            // If it's an object, try to extract meaningful content
            const desc = selectedTask.description as any;
            if (desc.details && typeof desc.details === "string") return desc.details;
            if (desc.description && typeof desc.description === "string") return desc.description;
            // Fallback to JSON string representation
            return JSON.stringify(desc);
          }
          return "No description available";
        })(),
        assignee: selectedTask.assigned_to_name || "Unassigned",
        dueTime: selectedTask.deadline
          ? new Date(selectedTask.deadline).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "No deadline",
        priority: "Medium" as const,
      },
      color:
        selectedTask.type === "CONTENT"
          ? "#f7c06d"
          : selectedTask.type === "MARKETING"
            ? "#ff88fa"
            : "#9976ff",
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "High":
          return "bg-red-500 text-white shadow-red-500/25";
        case "Medium":
          return "bg-amber-500 text-white shadow-amber-500/25";
        case "Low":
          return "bg-gray-500 text-white shadow-gray-500/25";
        default:
          return "bg-gray-500 text-white shadow-gray-500/25";
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="w-full bg-white h-full flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between shadow-sm flex-shrink-0"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: legacyTask.color }}
            >
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{legacyTask.title}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {legacyTask.type} Content
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 rounded-full p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6 space-y-6 lg:space-y-8">
          {/* Task Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Task Overview
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{legacyTask.details.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <User className="h-4 w-4" />
                    Assignee
                  </div>
                  <p className="font-semibold text-gray-900">{legacyTask.details.assignee}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    Due Time
                  </div>
                  <p className="font-semibold text-gray-900">{legacyTask.details.dueTime}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    Priority
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-lg text-sm font-semibold ${getPriorityColor(legacyTask.details.priority)}`}
                  >
                    {legacyTask.details.priority}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FileText className="h-4 w-4" />
                    Type
                  </div>
                  <p className="font-semibold text-gray-900">{legacyTask.type}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Additional Task Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Task Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Task ID</p>
                <p className="font-semibold text-gray-900">{String(selectedTask.id || "")}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Campaign ID</p>
                <p className="font-semibold text-gray-900">
                  {String(selectedTask.campaign_id || "")}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Contract ID</p>
                <p className="font-semibold text-gray-900">
                  {String(selectedTask.contract_id || "")}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Created Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedTask.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedTask.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : selectedTask.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {String(selectedTask.status || "").replace("_", " ")}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-semibold text-gray-900">
                  {String(selectedTask.assigned_to_role || "")}
                </p>
              </div>

              {selectedTask.created_by_name && (
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Created By</p>
                  <p className="font-semibold text-gray-900">
                    {String(selectedTask.created_by_name)}
                  </p>
                </div>
              )}

              {selectedTask.milestone_id && (
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Milestone ID</p>
                  <p className="font-semibold text-gray-900">{String(selectedTask.milestone_id)}</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </motion.div>
    );
  } catch (error) {
    console.error("TaskDetail rendering error:", error);
    return (
      <div className="w-full bg-white h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading task details</p>
          <Button onClick={onClose} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
}
