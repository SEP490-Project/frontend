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

  // Additional safety check
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

  // Utility functions
  const getTaskColor = (type: string): string => {
    switch (type) {
      case "CONTENT":
        return "#f7c06d";
      default:
        return "#9976ff";
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusDisplay = (status: string): string => {
    return status.replace("_", " ");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "TODO":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDescription = (): string => {
    if (!selectedTask.description) return "No description available";
    if (typeof selectedTask.description === "string") return selectedTask.description;
    if (typeof selectedTask.description === "object") {
      try {
        return JSON.stringify(selectedTask.description);
      } catch {
        return "No description available";
      }
    }
    return "No description available";
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
            style={{ backgroundColor: getTaskColor(selectedTask.type) }}
          >
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedTask.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {selectedTask.type} Content
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
            <p className="text-gray-700 leading-relaxed">{getDescription()}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <User className="h-4 w-4" />
                  Assignee
                </div>
                <p className="font-semibold text-gray-900">{selectedTask.assigned_to_name}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  Due Time
                </div>
                <p className="font-semibold text-gray-900">{formatDate(selectedTask.deadline)}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Status
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedTask.status)}`}
                >
                  {getStatusDisplay(selectedTask.status)}
                </span>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FileText className="h-4 w-4" />
                  Type
                </div>
                <p className="font-semibold text-gray-900">{selectedTask.type}</p>
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
              <p className="font-semibold text-gray-900">{selectedTask.id}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Campaign ID</p>
              <p className="font-semibold text-gray-900">{selectedTask.campaign_id}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Contract ID</p>
              <p className="font-semibold text-gray-900">{selectedTask.contract_id}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Created Date</p>
              <p className="font-semibold text-gray-900">{formatDate(selectedTask.created_at)}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-semibold text-gray-900">{selectedTask.assigned_to_role}</p>
            </div>

            {selectedTask.created_by_name && (
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Created By</p>
                <p className="font-semibold text-gray-900">{selectedTask.created_by_name}</p>
              </div>
            )}

            {selectedTask.milestone_id && (
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Milestone ID</p>
                <p className="font-semibold text-gray-900">{selectedTask.milestone_id}</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
