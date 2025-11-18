import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaUser,
  FaClock,
  FaFileLines,
  FaUpRightFromSquare,
  FaCalendarDays,
  FaDiagramProject,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TaskListMarketingDetail } from "@/libs/types/task";
import { formatDate } from "@/libs/helper/helper";
import { useNavigate } from "react-router-dom";

interface TaskDetailSliderProps {
  task: TaskListMarketingDetail | null;
  onBack: () => void;
  isVisible: boolean;
  loading?: boolean;
}

function TaskDetailSlider({ task, onBack, isVisible, loading }: TaskDetailSliderProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleGoToCampaign = () => {
    if (task?.campaign_id) {
      navigate(`/manage/marketing/campaigns/${task.campaign_id}`);
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">{task?.name || "Loading..."}</h1>
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </div>
            <p className="text-sm text-gray-500">{task?.campaign_details?.name || ""}</p>
          </div>
        </div>

        {/* Campaign button - moved outside flex-1 container */}
        <div className="flex items-center gap-2">
          {task?.campaign_id && (
            <Button
              onClick={handleGoToCampaign}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 whitespace-nowrap"
            >
              <FaUpRightFromSquare className="h-3 w-3" />
              Go to Campaign
            </Button>
          )}
        </div>
      </div>

      {/* 🔹 Nội dung có overlay riêng */}
      <div className="flex-1 relative overflow-hidden">
        {/* ✅ Nội dung luôn render, không reset khi loading đổi */}
        <div className="h-full overflow-y-auto p-6 space-y-6">
          {task ? (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loading ? 0.6 : 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
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
                  <InfoCard label="Role" icon={<FaUser />} value={task.assigned_to_role} />
                  <InfoCard label="Due Date" icon={<FaClock />} value={formatDate(task.deadline)} />
                  <InfoCard
                    label="Created Date"
                    icon={<FaCalendarDays />}
                    value={formatDate(task.created_at)}
                  />
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

                {/* Material URLs */}
                {task.description?.material_url && task.description.material_url.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Task Materials:</h3>
                    <div className="flex flex-wrap gap-2">
                      {task.description.material_url.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                        >
                          <FaUpRightFromSquare className="h-3 w-3" />
                          Material {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Campaign Information */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaDiagramProject className="h-4 w-4 text-blue-600" />
                  Campaign & Project Info
                </h2>
                {task.campaign_details?.description && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Campaign Description:
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg border">
                      {task.campaign_details.description}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Campaign" value={task.campaign_details?.name} />
                  <InfoCard
                    label="Campaign Type"
                    value={task.campaign_details?.type?.replace("_", " ")}
                  />
                  <InfoCard
                    label="Campaign Status"
                    value={
                      <Badge
                        variant={
                          task.campaign_details?.status === "ACTIVE" ? "default" : "secondary"
                        }
                        className="text-xs px-2 py-1 h-auto"
                      >
                        {task.campaign_details?.status}
                      </Badge>
                    }
                  />
                  <InfoCard
                    label="Campaign Period"
                    value={
                      task.campaign_details?.start_date && task.campaign_details?.end_date
                        ? `${formatDate(task.campaign_details.start_date)} - ${formatDate(task.campaign_details.end_date)}`
                        : "Not specified"
                    }
                  />
                  <InfoCard label="Milestone" value={task.milestone_details?.description} />
                  <InfoCard
                    label="Milestone Due"
                    value={formatDate(task.milestone_details?.due_date)}
                  />
                </div>
              </div>

              {/* Milestone Progress */}
              {task.milestone_details && (
                <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Milestone Progress</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard
                      label="Progress"
                      value={`${task.milestone_details.completion_percentage || 0}%`}
                    />
                    <InfoCard
                      label="Milestone Status"
                      value={
                        <Badge
                          variant={
                            task.milestone_details.status === "COMPLETED" ? "default" : "secondary"
                          }
                          className="text-xs px-2 py-1 h-auto"
                        >
                          {task.milestone_details.status}
                        </Badge>
                      }
                    />
                    {task.milestone_details.completed_at && (
                      <InfoCard
                        label="Completed At"
                        value={formatDate(task.milestone_details.completed_at)}
                      />
                    )}
                    <InfoCard
                      label="Schedule Status"
                      value={
                        <Badge
                          variant={
                            task.milestone_details.behind_schedule ? "destructive" : "default"
                          }
                          className="text-xs px-2 py-1 h-auto"
                        >
                          {task.milestone_details.behind_schedule ? "Behind Schedule" : "On Track"}
                        </Badge>
                      }
                    />
                  </div>
                </div>
              )}

              {/* Team Information */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {task.created_by_name && (
                    <InfoCard label="Created By" value={task.created_by_name} />
                  )}
                  {task.updated_by_name && (
                    <InfoCard label="Last Updated By" value={task.updated_by_name} />
                  )}
                  <InfoCard label="Last Updated" value={formatDate(task.updated_at)} />
                </div>
              </div>
            </motion.div>
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-muted-foreground">Loading task details...</p>
              </div>
            </div>
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
