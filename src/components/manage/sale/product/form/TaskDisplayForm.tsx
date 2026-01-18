import { Badge } from "@/components/ui/badge";
import type { SingleTaskResponse } from "@/libs/types/task";
import { Calendar, FileText } from "lucide-react";
import {
  FaBox,
  FaBullseye,
  FaCalendarDays,
  FaFileLines,
  FaHashtag,
  FaLocationDot,
  FaUpRightFromSquare,
} from "react-icons/fa6";

const TaskDisplayForm = ({
  taskDetailById,
  detailLoading,
}: {
  taskDetailById: SingleTaskResponse | null;
  detailLoading: boolean;
}) => {
  const task = taskDetailById?.data;

  if (detailLoading) {
    return (
      <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-600">Loading task details...</span>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>No task details available</p>
        </div>
      </div>
    );
  }

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
      <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Materials ({materials.length})
        </h4>
        <div className="space-y-2">
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
                      #{tag}
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
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FaBox className="h-4 w-4" />
              Product Details
            </h3>
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
                      #{tag}
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

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md mb-12">
      <h2 className="text-lg font-semibold mb-4">Task Information</h2>

      {renderTaskDetails(task.description)}

      {renderMaterials(task.description)}

      {/* Content & Product IDs */}
      {((task.content_ids && task.content_ids.length > 0) ||
        (task.product_ids && task.product_ids.length > 0)) && (
        <>
          <div className="col-span-4 mt-8 mb-4">
            <h3 className="text-base font-semibold text-gray-900 border-b pb-2">Related Items</h3>
          </div>

          {task.content_ids && task.content_ids.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
              <label className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end pt-2">
                Content Items ({task.content_ids.length})
              </label>
              <div className="col-span-3">
                <div className="bg-gray-50 px-3 py-3 rounded-md border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {task.content_ids.map((contentId, index) => (
                      <div
                        key={contentId}
                        className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-xs"
                      >
                        <span className="text-gray-600">#{index + 1}:</span>{" "}
                        <span className="text-gray-900">{contentId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskDisplayForm;
