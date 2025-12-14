import type { SingleTaskResponse } from "@/libs/types/task";
import { Calendar, TriangleAlert } from "lucide-react";

const TaskDisplayForm = ({
  taskDetailById,
  detailLoading,
}: {
  taskDetailById: SingleTaskResponse | null;
  detailLoading: boolean;
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const task = taskDetailById?.data;
  const isOverdue = task?.deadline
    ? new Date(task.deadline) < new Date() && task?.status?.toLowerCase() !== "completed"
    : false;

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

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md mb-12">
      <h2 className="text-lg font-semibold mb-4">Task Information</h2>

      {/* Task Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
          Task Name
        </label>
        <div className="col-span-3">
          <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
            {task.name || "N/A"}
          </p>
        </div>
      </div>

      {/* Task Type */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
          Task Type
        </label>
        <div className="col-span-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {task.type?.toUpperCase() || "N/A"}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
          Status
        </label>
        <div className="col-span-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              task.status === "COMPLETED"
                ? "bg-green-100 text-green-800 border border-green-200"
                : task.status === "IN_PROGRESS"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : task.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            {task.status?.toUpperCase() || "N/A"}
          </span>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end pt-2">
            Description
          </label>
          <div className="col-span-3">
            <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 min-h-[40px] whitespace-pre-wrap">
              {typeof task.description === "string"
                ? task.description
                : task.description?.details || "No description provided"}
            </p>
          </div>
        </div>
      )}

      {/* Deadline */}
      {task.deadline && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
            Deadline
          </label>
          <div className="col-span-3">
            <p
              className={`text-sm px-3 py-2 rounded-md border ${
                isOverdue
                  ? "bg-red-50 text-red-900 border-red-200 font-medium"
                  : "bg-gray-50 text-gray-900 border-gray-200"
              }`}
            >
              {isOverdue && <TriangleAlert className="inline h-4 w-4 mr-1" />}
              {formatDate(task.deadline)}
              {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}
            </p>
          </div>
        </div>
      )}

      {/* Assigned To */}
      {task.assigned_to_name && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
            Assigned To
          </label>
          <div className="col-span-3">
            <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
              <p className="text-sm text-gray-900 font-medium">{task.assigned_to_name}</p>
              {task.assigned_to_role && (
                <p className="text-xs text-gray-600 mt-1">
                  Role: {task.assigned_to_role.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Created Information */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
          Created
        </label>
        <div className="col-span-3">
          <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
            <p className="text-sm text-gray-900">{formatDateTime(task.created_at)}</p>
            {task.created_by_name && (
              <p className="text-xs text-gray-600 mt-1">By: {task.created_by_name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Updated Information */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
          Last Updated
        </label>
        <div className="col-span-3">
          <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
            <p className="text-sm text-gray-900">{formatDateTime(task.updated_at)}</p>
            {task.updated_by_name && (
              <p className="text-xs text-gray-600 mt-1">By: {task.updated_by_name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Details Section */}
      {task.campaign_details && (
        <>
          <div className="col-span-4 mt-8 mb-4">
            <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
              Campaign Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Campaign Name
            </label>
            <div className="col-span-3">
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                {task.campaign_details.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Campaign Type
            </label>
            <div className="col-span-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                {task.campaign_details.type?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Campaign Status
            </label>
            <div className="col-span-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  task.campaign_details.status === "ACTIVE"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : task.campaign_details.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {task.campaign_details.status?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Campaign Period
            </label>
            <div className="col-span-3">
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
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
              </p>
            </div>
          </div>

          {task.campaign_details.description && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
              <label className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end pt-2">
                Campaign Description
              </label>
              <div className="col-span-3">
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 min-h-[40px] whitespace-pre-wrap">
                  {task.campaign_details.description}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Brand Information */}
      {task.brand_info && (
        <>
          <div className="col-span-4 mt-8 mb-4">
            <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
              Brand Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Brand Name
            </label>
            <div className="col-span-3">
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                {task.brand_info.logo_url && (
                  <img
                    src={task.brand_info.logo_url}
                    alt={task.brand_info.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">{task.brand_info.name}</p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                      task.brand_info.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.brand_info.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Milestone Details Section */}
      {task.milestone_details && (
        <>
          <div className="col-span-4 mt-8 mb-4">
            <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
              Milestone Information
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Milestone Status
            </label>
            <div className="col-span-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  task.milestone_details.status === "COMPLETED"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : task.milestone_details.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
              >
                {task.milestone_details.status?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Completion Progress
            </label>
            <div className="col-span-3">
              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${task.milestone_details.completion_percentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {task.milestone_details.completion_percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Due Date
            </label>
            <div className="col-span-3">
              <p
                className={`text-sm px-3 py-2 rounded-md border ${
                  task.milestone_details.behind_schedule
                    ? "bg-red-50 text-red-900 border-red-200 font-medium"
                    : "bg-gray-50 text-gray-900 border-gray-200"
                }`}
              >
                {task.milestone_details.behind_schedule && (
                  <TriangleAlert className="inline h-4 w-4 mr-1" />
                )}
                {formatDate(task.milestone_details.due_date)}
                {task.milestone_details.behind_schedule && (
                  <span className="ml-2 text-xs">(Behind Schedule)</span>
                )}
              </p>
            </div>
          </div>

          {task.milestone_details.completed_at && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
              <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                Completed At
              </label>
              <div className="col-span-3">
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                  {formatDateTime(task.milestone_details.completed_at)}
                </p>
              </div>
            </div>
          )}

          {task.milestone_details.description && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
              <label className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end pt-2">
                Milestone Description
              </label>
              <div className="col-span-3">
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 min-h-[40px] whitespace-pre-wrap">
                  {task.milestone_details.description}
                </p>
              </div>
            </div>
          )}
        </>
      )}

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

          {task.product_ids && task.product_ids.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
              <label className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end pt-2">
                Product Items ({task.product_ids.length})
              </label>
              <div className="col-span-3">
                <div className="bg-gray-50 px-3 py-3 rounded-md border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {task.product_ids.map((productId, index) => (
                      <div
                        key={productId}
                        className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-xs"
                      >
                        <span className="text-gray-600">#{index + 1}:</span>{" "}
                        <span className="text-gray-900">{productId}</span>
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
