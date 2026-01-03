import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";
import { Calendar, FileText, Package, TriangleAlert } from "lucide-react";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getTaskDetailById } from "@/libs/stores/taskManager/thunk";
import { useSelector } from "react-redux";
import {
  FaFileLines,
  FaHashtag,
  FaUpRightFromSquare,
  FaCalendarDays,
  FaLocationDot,
  FaBox,
  FaBullseye,
} from "react-icons/fa6";

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

export const TaskDetailDisplay = ({
  taskId,
  onOpen,
  setOnOpen,
}: {
  taskId: string | undefined;
  onOpen: boolean;
  setOnOpen: (open: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const { taskDetailById, detailLoading } = useSelector((state: RootState) => state.manageTask);

  useEffect(() => {
    if (!taskId) return;
    dispatch(getTaskDetailById(taskId)).unwrap();
  }, [dispatch, taskId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      todo: "bg-gray-100 text-gray-800 border border-gray-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      in_progress: "bg-blue-100 text-blue-800 border border-blue-200",
      completed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      overdue: "bg-orange-100 text-orange-800 border border-orange-200",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const task = taskDetailById?.data;

  const isOverdue = task?.deadline
    ? new Date(task.deadline) < new Date() && task?.status?.toLowerCase() !== "completed"
    : false;

  return (
    <Dialog open={onOpen} onOpenChange={setOnOpen}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Task Details</DialogTitle>
        </DialogHeader>

        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading task details...</span>
          </div>
        ) : task ? (
          <div className="space-y-6 py-4">
            {/* Task Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusBadgeClass(task.status)}>
                      {task.status.toUpperCase()}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                      {task.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* {task.description && ( */}
              {/*   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200"> */}
              {/*     <div className="text-xs font-semibold text-gray-700 uppercase mb-2"> */}
              {/*       Description */}
              {/*     </div> */}
              {/*     <p className="text-sm text-gray-700 leading-relaxed"> */}
              {/*       {task.description.details} */}
              {/*     </p> */}
              {/*   </div> */}
              {/* )} */}
            </div>

            <Separator />

            {/* Task Detailed Overview */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaFileLines className="h-4 w-4 text-indigo-600" />
                Task Overview
              </h3>

              {task.description?.description && (
                <p className="text-gray-700 leading-relaxed mb-4">{task.description.description}</p>
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

              {renderMaterials(task.description)}
            </div>

            <Separator />

            {/* Task Information Grid */}
            <div>
              {/* Timeline Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </h4>
                <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-gray-600">Deadline:</span>
                    <span
                      className={`text-sm font-semibold ${isOverdue ? "text-red-600" : "text-green-600"}`}
                    >
                      {isOverdue && <TriangleAlert className="inline h-4 w-4 mr-1" />}
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">{formatDate(task.created_at)}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-gray-600">Updated:</span>
                    <span className="text-sm text-gray-900">{formatDate(task.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Details */}
            {task.campaign_details && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Campaign Information
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-600">Campaign Name:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {task.campaign_details.name}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
                        {task.campaign_details.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={getStatusBadgeClass(task.campaign_details.status)}>
                        {task.campaign_details.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-start justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">Period:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(task.campaign_details.start_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(task.campaign_details.end_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {task.campaign_details.description && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-gray-600 block mb-1">Description:</span>
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {task.campaign_details.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Milestone Details */}
            {task.milestone_details && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Milestone Information
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={getStatusBadgeClass(task.milestone_details.status)}>
                        {task.milestone_details.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-600">Completion:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${task.milestone_details.completion_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {task.milestone_details.completion_percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">Due Date:</span>
                      <div className="text-right">
                        <span
                          className={`text-sm font-semibold ${
                            task.milestone_details.behind_schedule
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {task.milestone_details.behind_schedule && (
                            <TriangleAlert className="inline h-4 w-4 mr-1" />
                          )}
                          {formatDate(task.milestone_details.due_date)}
                        </span>
                        {task.milestone_details.behind_schedule && (
                          <span className="block text-xs text-red-600 mt-1">Behind Schedule</span>
                        )}
                      </div>
                    </div>
                    {task.milestone_details.completed_at && (
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-gray-600">Completed At:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(task.milestone_details.completed_at)}
                        </span>
                      </div>
                    )}
                    {task.milestone_details.description && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-gray-600 block mb-1">Description:</span>
                        <p className="text-sm text-gray-900 leading-relaxed">
                          {task.milestone_details.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Content & Product IDs */}
            {((task.content_ids && task.content_ids.length > 0) ||
              (task.product_ids && task.product_ids.length > 0)) && (
              <>
                <Separator />
                <Accordion type="single" collapsible className="w-full">
                  {task.content_ids && task.content_ids.length > 0 && (
                    <AccordionItem
                      value="content"
                      className="border border-gray-200 rounded-lg mb-2"
                    >
                      <AccordionTrigger className="px-4 hover:bg-gray-50 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="font-semibold">
                            Content Items ({task.content_ids.length})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {task.content_ids.map((contentId, index) => (
                            <div
                              key={contentId}
                              className="bg-gray-50 border border-gray-200 rounded px-3 py-2 font-mono text-xs"
                            >
                              <span className="text-gray-600">#{index + 1}:</span>{" "}
                              <span className="text-gray-900">{contentId}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No task details available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
