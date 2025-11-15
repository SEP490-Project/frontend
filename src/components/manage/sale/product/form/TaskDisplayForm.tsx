import type { RootState } from "@/libs/stores";
import { useSelector } from "react-redux";

const TaskDisplayForm = () => {
  const taskDetailById = useSelector((state: RootState) => state.manageTask.taskDetailById);

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Task Information</h2>

      {taskDetailById && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Task Name
            </label>
            <div className="col-span-3">
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                {taskDetailById.data?.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Description
            </label>
            <div className="col-span-3">
              <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 min-h-[40px]">
                {typeof taskDetailById.data?.description === "string"
                  ? taskDetailById.data.description
                  : taskDetailById.data?.description?.details || "No description provided"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
            <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
              Status
            </label>
            <div className="col-span-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  taskDetailById.data?.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : taskDetailById.data?.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : taskDetailById.data?.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {taskDetailById.data?.status || "N/A"}
              </span>
            </div>
          </div>

          {taskDetailById.data?.deadline && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
              <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                Deadline
              </label>
              <div className="col-span-3">
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                  {new Date(taskDetailById.data.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Campaign Details Section
          {taskDetailById.data?.campaign_details && (
            <>
              <div className="col-span-4 mt-6 mb-2">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
                  Campaign Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                  Campaign Name
                </label>
                <div className="col-span-3">
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    {taskDetailById.data.campaign_details.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                  Campaign Type
                </label>
                <div className="col-span-3">
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    {taskDetailById.data.campaign_details.type.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                  Campaign Status
                </label>
                <div className="col-span-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      taskDetailById.data.campaign_details.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : taskDetailById.data.campaign_details.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {taskDetailById.data.campaign_details.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                  Campaign Period
                </label>
                <div className="col-span-3">
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    {new Date(taskDetailById.data.campaign_details.start_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}{" "}
                    -{" "}
                    {new Date(taskDetailById.data.campaign_details.end_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {taskDetailById.data.campaign_details.description && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                  <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                    Campaign Description
                  </label>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 min-h-[40px]">
                      {taskDetailById.data.campaign_details.description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )} */}

          {/* Milestone Details Section
          {taskDetailById.data?.milestone_details && (
            <>
              <div className="col-span-4 mt-6 mb-2">
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2">
                  Milestone Information
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                  Milestone Status
                </label>
                <div className="col-span-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      taskDetailById.data.milestone_details.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : taskDetailById.data.milestone_details.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {taskDetailById.data.milestone_details.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
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
                            width: `${taskDetailById.data.milestone_details.completion_percentage}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {taskDetailById.data.milestone_details.completion_percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                  Due Date
                </label>
                <div className="col-span-3">
                  <p
                    className={`text-sm px-3 py-2 rounded-md border ${
                      taskDetailById.data.milestone_details.behind_schedule
                        ? "bg-red-50 text-red-900 border-red-200"
                        : "bg-gray-50 text-gray-900 border-gray-200"
                    }`}
                  >
                    {new Date(taskDetailById.data.milestone_details.due_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                    {taskDetailById.data.milestone_details.behind_schedule && (
                      <span className="ml-2 text-xs font-medium">(Behind Schedule)</span>
                    )}
                  </p>
                </div>
              </div>

              {taskDetailById.data.milestone_details.completed_at && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                  <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                    Completed At
                  </label>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                      {new Date(
                        taskDetailById.data.milestone_details.completed_at,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {taskDetailById.data.milestone_details.description && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-4">
                  <label className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end">
                    Milestone Description
                  </label>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 min-h-[40px]">
                      {taskDetailById.data.milestone_details.description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )} */}
        </>
      )}
    </div>
  );
};

export default TaskDisplayForm;
