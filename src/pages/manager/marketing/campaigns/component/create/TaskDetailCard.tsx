import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FaFileLines,
  FaUpRightFromSquare,
  FaCalendarDays,
  FaLocationDot,
  FaBox,
  FaBullseye,
  FaHashtag,
  FaClock,
} from "react-icons/fa6";

interface TaskDescription {
  description: string;
  material_url?: string;
  description_json?: any;
}

interface Task {
  id: string;
  name: string;
  type: string;
  description: TaskDescription;
  deadline: string;
  materialFiles?: File[];
  material_urls?: string[];
}

interface TaskDetailCardProps {
  task: Task;
  onViewDetails?: (task: Task) => void;
}

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

export const getTaskTypeColor = (type: string) => {
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

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const renderTaskDetails = (description: any) => {
  if (!description || typeof description !== "object") return null;

  // Handle different task types based on the JSON structure
  if (description.advertised_item_id || description.product_name || description.platform) {
    // Advertising/Affiliate Content Task
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FaFileLines className="h-4 w-4" />
          Content Details
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
          {description.product_name && (
            <div className="flex items-start gap-2">
              <span className="font-medium text-sm text-gray-700">Product:</span>
              <span className="text-sm text-gray-600">{description.product_name}</span>
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

  return null;
};

const renderMaterials = (description: any, materialFiles?: File[], materialUrls?: string[]) => {
  const materialsSet = new Set<string>();

  // Check for material_urls from task (highest priority)
  if (materialUrls && materialUrls.length > 0) {
    materialUrls.forEach((url) => materialsSet.add(url));
  }

  // Check for material_url array in description_json
  if (
    description?.material_urls &&
    Array.isArray(description.material_urls) &&
    description.material_urls.length > 0
  ) {
    description.material_urls.forEach((url: string) => materialsSet.add(url));
  }

  // Check for materials array in structured data (CO_PRODUCING)
  if (
    description?.materials &&
    Array.isArray(description.materials) &&
    description.materials.length > 0
  ) {
    description.materials.forEach((url: string) => materialsSet.add(url));
  }

  // Convert Set back to array for rendering
  const materials = Array.from(materialsSet);

  if (materials.length === 0 && (!materialFiles || materialFiles.length === 0)) return null;

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
        {materialFiles &&
          materialFiles.map((file, index) => (
            <div
              key={`file-${index}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              <FaFileLines className="h-3 w-3" />
              {file.name}
            </div>
          ))}
      </div>
    </div>
  );
};

// Task Card Component for list view
export const TaskDetailCard: React.FC<TaskDetailCardProps> = ({ task, onViewDetails }) => {
  return (
    <div
      className="bg-gray-50 rounded-md p-3 border hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={() => onViewDetails?.(task)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{task.name || "Untitled task"}</span>
            <Badge
              className="text-xs text-white border-none"
              style={{ backgroundColor: getTaskTypeColor(task.type) }}
            >
              {task.type || "—"}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {task.description?.description || "No description"}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <FaClock className="w-3 h-3" />
          <span>Due: {formatDate(task.deadline)}</span>
        </div>
        {((task.materialFiles && task.materialFiles.length > 0) ||
          (task.material_urls && task.material_urls.length > 0)) && (
          <div className="flex items-center gap-1">
            <FaFileLines className="w-3 h-3" />
            <span>
              {(task.materialFiles?.length || 0) + (task.material_urls?.length || 0)} files
            </span>
          </div>
        )}
      </div>

      <div className="mt-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-6"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(task);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

// Modal Component for detailed view
export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, open, onClose }) => {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm"
              style={{ backgroundColor: getTaskTypeColor(task.type) }}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            {task.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Overview */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaFileLines className="h-4 w-4 text-indigo-600" />
                Task Overview
              </h3>

              {/* Basic Description */}
              {task.description?.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description:</h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border">
                    {task.description.description}
                  </p>
                </div>
              )}

              {/* Structured Task Details */}
              {task.description?.description_json &&
                renderTaskDetails(task.description.description_json)}

              {/* KPI Goals */}
              {task.description?.description_json?.kpi_goals &&
                task.description.description_json.kpi_goals.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                      <FaBullseye className="h-4 w-4 text-green-600" />
                      KPI Goals
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {task.description.description_json.kpi_goals.map((kpi: any, idx: number) => (
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

              {/* Task Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FaClock className="w-4 h-4" />
                    Due Date
                  </div>
                  <p className="font-semibold text-gray-900">{formatDate(task.deadline)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FaFileLines className="w-4 h-4" />
                    Type
                  </div>
                  <Badge
                    className="text-xs text-white border-none"
                    style={{ backgroundColor: getTaskTypeColor(task.type) }}
                  >
                    {task.type}
                  </Badge>
                </div>
              </div>

              {/* Materials */}
              {renderMaterials(
                task.description?.description_json,
                task.materialFiles,
                task.material_urls,
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailCard;
