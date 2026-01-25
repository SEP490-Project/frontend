import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaUser,
  FaClock,
  FaFileLines,
  FaUpRightFromSquare,
  FaCalendarDays,
  FaDiagramProject,
  FaHashtag,
  FaLocationDot,
  FaBox,
  FaBullseye,
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

const renderTaskDetails = (description: any) => {
  if (!description || typeof description !== "object") return null;

  // Handle different task types based on the JSON structure
  if (description.advertised_item_id || description.name) {
    // Advertising/Affiliate Content Task
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaFileLines className="h-4 w-4" />
          Advertised Item Details
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
          {description.name && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Product:</span>
              <span className="text-sm text-gray-600">{description.name}</span>
            </div>
          )}
          {description.platform && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Platform:</span>
              <span className="text-sm text-gray-600">{description.platform}</span>
            </div>
          )}
          {description.tagline && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Tagline:</span>
              <span className="text-sm text-gray-600">{description.tagline}</span>
            </div>
          )}
          {description.creative_notes && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Creative Notes:</span>
              <span className="text-sm text-gray-600">{description.creative_notes}</span>
            </div>
          )}
          {description.hashtags && description.hashtags.length > 0 && (
            <div className="flex items-start gap-2">
              <FaHashtag className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {description.hashtags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {description.tracking_link && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Tracking Link:</span>
              <a
                href={description.tracking_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                {description.tracking_link}
                <FaUpRightFromSquare className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (description.event_id || description.event_name) {
    // Brand Ambassador Event Task
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaCalendarDays className="h-4 w-4" />
          Event Details
        </h3>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
          {description.event_name && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Event:</span>
              <span className="text-sm text-gray-600">{description.event_name}</span>
            </div>
          )}
          {description.event_date && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Date:</span>
              <span className="text-sm text-gray-600">{description.event_date}</span>
            </div>
          )}
          {description.event_duration && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Duration:</span>
              <span className="text-sm text-gray-600">{description.event_duration}</span>
            </div>
          )}
          {description.location && (
            <div className="flex items-start gap-2">
              <FaLocationDot className="h-4 w-4 text-red-600 mt-0.5" />
              <span className="text-sm text-gray-600">{description.location}</span>
            </div>
          )}
          {description.activities && description.activities.length > 0 && (
            <div>
              <span className="font-medium text-sm text-gray-700 block mb-2">Activities:</span>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {description.activities.map((activity: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600">
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {description.representation_rules && description.representation_rules.length > 0 && (
            <div>
              <span className="font-medium text-sm text-gray-700 block mb-2">
                Representation Rules:
              </span>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {description.representation_rules.map((rule: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (
    description.is_product_creation_task === true ||
    description.product_id ||
    description.product_name
  ) {
    // Co-Producing Product Task
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaBox className="h-4 w-4" />
          Product Details
        </h3>
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 space-y-3">
          {description.product_name && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Product:</span>
              <span className="text-sm text-gray-600">{description.product_name}</span>
            </div>
          )}
          {description.product_description && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Description:</span>
              <span className="text-sm text-gray-600">{description.product_description}</span>
            </div>
          )}
          {description.subtasks && description.subtasks.length > 0 && (
            <div>
              <span className="font-medium text-sm text-gray-700 block mb-2">Subtasks:</span>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {description.subtasks.map((subtask: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600">
                    {subtask}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (
    description.is_product_creation_task === false ||
    description.concept_id ||
    description.concept_name
  ) {
    // Co-Producing Concept Task
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaBullseye className="h-4 w-4" />
          Concept Details
        </h3>
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 space-y-3">
          {description.concept_name && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Concept:</span>
              <span className="text-sm text-gray-600">{description.concept_name}</span>
            </div>
          )}
          {description.concept_description && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Description:</span>
              <span className="text-sm text-gray-600">{description.concept_description}</span>
            </div>
          )}
          {description.related_product_name && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Related Product:</span>
              <span className="text-sm text-gray-600">{description.related_product_name}</span>
            </div>
          )}
          {description.platform && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Platform:</span>
              <span className="text-sm text-gray-600">{description.platform}</span>
            </div>
          )}
          {description.hashtags && description.hashtags.length > 0 && (
            <div className="flex items-start gap-2">
              <FaHashtag className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {description.hashtags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Display KPI Goals if available (common across all types)
  if (description.kpi_goals && description.kpi_goals.length > 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaBullseye className="h-4 w-4" />
          KPI Goals
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          {description.kpi_goals.map((kpi: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 bg-white rounded border"
            >
              <span className="text-sm font-medium text-gray-700">
                {kpi.metric?.replace(/_/g, " ")}
              </span>
              <span className="text-sm text-gray-600">{kpi.target}</span>
              {kpi.description && (
                <span className="text-xs text-gray-500">({kpi.description})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const renderMaterials = (description: any) => {
  const materials = [];

  // Check for material_url array
  if (
    description?.material_url &&
    Array.isArray(description.material_url) &&
    description.material_url.length > 0
  ) {
    materials.push(...description.material_url);
  }

  // Check for materials array in structured data
  if (
    description?.materials &&
    Array.isArray(description.materials) &&
    description.materials.length > 0
  ) {
    materials.push(...description.materials);
  }

  // Check for material_urls in structured data
  if (
    description?.material_urls &&
    Array.isArray(description.material_urls) &&
    description.material_urls.length > 0
  ) {
    materials.push(...description.material_urls);
  }

  if (materials.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Task Materials:</h3>
      <div className="flex flex-wrap gap-2">
        {materials.map((material, index) => (
          <a
            key={index}
            href={material}
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
  );
};

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

                {/* Basic Description */}
                {task.description?.description && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {task.description.description}
                  </p>
                )}

                {/* Structured Task Details based on type */}
                {task.description && renderTaskDetails(task.description)}

                {/* KPI Goals Section */}
                {task.description?.kpi_goals && task.description.kpi_goals.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                      <FaBullseye className="h-4 w-4 text-green-600" />
                      KPI Goals
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {task.description.kpi_goals.map((kpi: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-700">
                              {kpi.metric?.replace(/_/g, " ") || "Unknown Metric"}
                            </span>
                            {kpi.description && (
                              <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {kpi.target}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

                {/* Materials */}
                {renderMaterials(task.description)}
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
