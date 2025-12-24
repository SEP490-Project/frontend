import { motion } from "framer-motion";
import { X, Clock, AlertTriangle, FileText, Briefcase, Check, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTask } from "@/libs/hooks/useTask";
import { useAppDispatch } from "@/libs/stores";
import {
  updateTaskState,
  getTaskDetailById,
  getTasksByProfile,
} from "@/libs/stores/taskManager/thunk";
import { useEffect } from "react";
import { toast } from "sonner";

interface TaskDetailProps {
  taskId: string | null;
  onClose: () => void;
  isVisible: boolean;
}

export function TaskDetail({ taskId, onClose, isVisible }: TaskDetailProps) {
  const { taskDetailById, detailLoading: loading } = useTask();
  const dispatch = useAppDispatch();
  const selectedTask = taskDetailById?.data || null;

  useEffect(() => {
    if (taskId && isVisible) {
      dispatch(getTaskDetailById(taskId));
    }
  }, [taskId, isVisible, dispatch]);

  const handleStartTask = async () => {
    if (!selectedTask?.id) return;

    // Check if task is overdue and prevent starting
    if (!canStartTask()) {
      toast.error("Cannot start this task because it is overdue. Please contact your manager.");
      return;
    }

    try {
      await dispatch(
        updateTaskState({
          taskId: selectedTask.id,
          state: "IN_PROGRESS",
        }),
      ).unwrap();

      toast.success("Task started successfully!");

      // Refresh the task list to show updated status
      await dispatch(getTasksByProfile(undefined));

      onClose(); // Navigate back to task list
    } catch (error) {
      toast.error((error as string) || "Failed to start task.");
    }
  };

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
  const isTaskOverdue = (): boolean => {
    if (!selectedTask?.deadline) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDeadline = new Date(selectedTask.deadline);
    taskDeadline.setHours(0, 0, 0, 0);

    return taskDeadline.getTime() < today.getTime();
  };

  const canStartTask = (): boolean => {
    // Staff can't start tasks that are overdue and not yet started
    if (isTaskOverdue() && selectedTask?.status === "TODO") {
      return false;
    }
    return true;
  };

  const getTaskColor = (type: string): string => {
    switch (type) {
      case "CONTENT":
        return "#f7c06d";
      default:
        return "#9976ff";
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "No date available";
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
    if (!status) return "Unknown";
    return status.replace("_", " ");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "DONE":
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

    // Handle nested description object structure
    if (typeof selectedTask.description === "object" && selectedTask.description !== null) {
      const desc = selectedTask.description as any;
      if (desc.description && typeof desc.description === "string") {
        return desc.description;
      }
      // Fallback to JSON representation if structure is different
      try {
        return JSON.stringify(selectedTask.description, null, 2);
      } catch {
        return "No description available";
      }
    }

    if (typeof selectedTask.description === "string") {
      return selectedTask.description;
    }

    return "No description available";
  };

  const getMaterialUrls = (): string[] => {
    if (!selectedTask.description || typeof selectedTask.description !== "object") {
      return [];
    }

    const desc = selectedTask.description as any;
    if (desc.material_url && Array.isArray(desc.material_url)) {
      return desc.material_url;
    }

    return [];
  };

  const getCampaignInfo = () => {
    const campaign = (selectedTask as any).campaign_details;
    if (campaign && typeof campaign === "object") {
      return {
        name: campaign.name || "Unknown Campaign",
        description: campaign.description || campaign?.description?.details || "No description",
        type: campaign.type || "Unknown",
        status: campaign.status || "Unknown",
        startDate: campaign.start_date || "",
        endDate: campaign.end_date || "",
      };
    }
    return null;
  };

  const getMilestoneInfo = () => {
    const milestone = (selectedTask as any).milestone_details;
    if (milestone && typeof milestone === "object") {
      return {
        description: milestone.description || "No description",
        dueDate: milestone.due_date || "",
        status: milestone.status || "Unknown",
        completionPercentage: milestone.completion_percentage || 0,
        behindSchedule: milestone.behind_schedule || false,
      };
    }
    return null;
  };

  const getBrandInfo = () => {
    const brand = (selectedTask as any).brand_info;
    if (brand && typeof brand === "object") {
      return {
        name: brand.name || "Unknown Brand",
        logoUrl: brand.logo_url || "",
        status: brand.status || "Unknown",
      };
    }
    return null;
  };

  const materialUrls = getMaterialUrls();
  const campaignInfo = getCampaignInfo();
  const milestoneInfo = getMilestoneInfo();
  const brandInfo = getBrandInfo();

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
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedTask.status === "TODO" && (
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={handleStartTask}
                disabled={loading || !canStartTask()}
                className={`flex items-center gap-2 ${
                  !canStartTask()
                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#FF9DB0] hover:bg-pink-600 text-white"
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {loading ? "Starting..." : "Start this task"}
              </Button>
              {!canStartTask() && isTaskOverdue() && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Task is overdue
                </p>
              )}
            </div>
          )}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 rounded-full p-2"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
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

            {/* Material URLs */}
            {materialUrls.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Materials ({materialUrls.length})
                </h4>
                <div className="space-y-2">
                  {materialUrls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      Material {index + 1}: {url.split("/").pop() || url}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                className={`bg-white p-4 rounded-lg border ${
                  isTaskOverdue() ? "border-red-200 bg-red-50" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className={`h-4 w-4 ${isTaskOverdue() ? "text-red-500" : ""}`} />
                  Due Time
                  {isTaskOverdue() && <AlertTriangle className="h-3 w-3 text-red-500" />}
                </div>
                <p
                  className={`font-semibold ${isTaskOverdue() ? "text-red-700" : "text-gray-900"}`}
                >
                  {formatDate(selectedTask.deadline)}
                </p>
                {isTaskOverdue() && (
                  <p className="text-xs text-red-600 font-medium mt-1">This task is overdue</p>
                )}
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

        {/* Campaign Information */}
        {campaignInfo && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Campaign Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Campaign Name</p>
                <p className="font-semibold text-gray-900">{campaignInfo.name}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Campaign Type</p>
                <p className="font-semibold text-gray-900">{campaignInfo.type}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p className="font-semibold text-gray-900">{formatDate(campaignInfo.startDate)}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <p className="font-semibold text-gray-900">{formatDate(campaignInfo.endDate)}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 lg:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Campaign Description</p>
                <p className="font-semibold text-gray-900">{campaignInfo.description}</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Brand Information */}
        {brandInfo && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              Brand Information
            </h2>
            <div className="flex items-center gap-4">
              {brandInfo.logoUrl && (
                <img
                  src={brandInfo.logoUrl}
                  alt={brandInfo.name}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-xl">{brandInfo.name}</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    brandInfo.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {brandInfo.status}
                </span>
              </div>
            </div>
          </motion.section>
        )}

        {/* Milestone Information */}
        {milestoneInfo && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-green-600" />
              Milestone Information
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Milestone Description</p>
                <p className="font-semibold text-gray-900">{milestoneInfo.description}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Due Date</p>
                <p className="font-semibold text-gray-900">{formatDate(milestoneInfo.dueDate)}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Completion</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${milestoneInfo.completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {milestoneInfo.completionPercentage}%
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(milestoneInfo.status)}`}
                  >
                    {getStatusDisplay(milestoneInfo.status)}
                  </span>
                  {milestoneInfo.behindSchedule && (
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Behind Schedule
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
