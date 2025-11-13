import { motion } from "framer-motion";
import { FaArrowLeft, FaUser, FaClock, FaFileLines } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TaskListMarketingDetail } from "@/libs/types/task";
import { formatDate } from "@/libs/helper/helper";

interface TaskDetailSliderProps {
  task: TaskListMarketingDetail | null;
  onBack: () => void;
  isVisible: boolean;
  loading?: boolean;
}

function TaskDetailSlider({ task, onBack, isVisible, loading }: TaskDetailSliderProps) {
  if (!isVisible) return null;

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

  return (
    <motion.div
      key="task-detail-slider"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-white z-50 flex flex-col overflow-hidden"
    >
      {/* 🔹 Header cố định */}
      <div className="flex items-center gap-4 p-6 border-b border-border/20 bg-white relative z-10">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100 rounded-full p-2 h-8 w-8"
        >
          <FaArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: getTaskColor(task?.type || "") }}
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{task?.name || "Loading..."}</h1>
            <p className="text-sm text-gray-500">{task?.campaign_details?.name || ""}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Nội dung có overlay riêng */}
      <div className="flex-1 relative">
        {/* ✅ Overlay loading không làm remount content */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-muted-foreground">Loading task details...</p>
            </div>
          </motion.div>
        )}

        {/* ✅ Nội dung luôn render, không reset khi loading đổi */}
        <div className="h-full overflow-y-auto p-6 space-y-6 transition-opacity duration-200">
          {task ? (
            <>
              {/* Task Overview */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFileLines className="h-4 w-4 text-indigo-600" />
                  Task Overview
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {task.description?.description || "No description provided."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Assignee" icon={<FaUser />} value={task.assigned_to_name} />
                  <InfoCard label="Due Date" icon={<FaClock />} value={formatDate(task.deadline)} />
                  <InfoCard
                    label="Type"
                    icon={<FaFileLines />}
                    value={
                      <Badge
                        className="text-xs px-2 py-1 h-auto"
                        style={{
                          backgroundColor: getTaskColor(task.type),
                          color: "white",
                        }}
                      >
                        {task.type}
                      </Badge>
                    }
                  />
                  <InfoCard
                    label="Status"
                    value={
                      <Badge
                        variant={task.status === "COMPLETED" ? "default" : "secondary"}
                        className="text-xs px-2 py-1 h-auto"
                      >
                        {String(task.status || "").replace("_", " ")}
                      </Badge>
                    }
                  />
                </div>
              </div>

              {/* Additional info */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Campaign" value={task.campaign_details?.name} />
                  <InfoCard label="Contract ID" value={task.contract_id} />
                  <InfoCard label="Created Date" value={formatDate(task.created_at)} />
                  <InfoCard label="Role" value={task.assigned_to_role} />
                  {task.created_by_name && (
                    <InfoCard label="Created By" value={task.created_by_name} />
                  )}
                  <InfoCard label="Milestone" value={task.milestone_details?.description} />
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 mt-10">No task selected.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const InfoCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100">
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
      {icon}
      {label}
    </div>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default TaskDetailSlider;
