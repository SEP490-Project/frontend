import { Target, Calendar, Clock, CheckCircle } from "lucide-react";
import type { CampaignData } from "@/libs/types/campaign";

interface CampaignDetailProps {
  campaign: CampaignData | null;
  loading?: boolean;
}

export default function CampaignDetail({ campaign, loading }: CampaignDetailProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "RUNNING":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "PAUSED":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ON_GOING":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-500">Loading campaign details...</span>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500">No campaign details available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Campaign Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Campaign Name</label>
            <p className="text-sm text-gray-900 mt-1">{campaign.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Campaign Type</label>
            <p className="text-sm text-gray-900 mt-1">{campaign.type}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-sm text-gray-900 mt-1">
              {campaign.description || "No description provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="mt-1">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(campaign.status)}`}
              >
                {campaign.status}
              </span>
            </div>
          </div>
          {campaign.number_of_tasks && (
            <div>
              <label className="text-sm font-medium text-gray-500">Total Tasks</label>
              <p className="text-sm text-gray-900 mt-1">{campaign.number_of_tasks} tasks</p>
            </div>
          )}
          {campaign.percentage_completed !== undefined && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Overall Progress</label>
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${campaign.percentage_completed}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {campaign.percentage_completed}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contract Information */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">Contract Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Contract Title</label>
            <p className="text-sm text-gray-900 mt-1">{campaign.contract_title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Contract Number</label>
            <p className="text-sm text-gray-900 mt-1">{campaign.contract_number}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Start Date</label>
            <p className="text-sm text-gray-900 mt-1">{formatDate(campaign.start_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">End Date</label>
            <p className="text-sm text-gray-900 mt-1">{formatDate(campaign.end_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Duration</label>
            <p className="text-sm text-gray-900 mt-1">
              {calculateDuration(campaign.start_date, campaign.end_date)} days
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Created</label>
            <p className="text-sm text-gray-900 mt-1">{formatDate(campaign.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Last Updated</label>
            <p className="text-sm text-gray-900 mt-1">{formatDate(campaign.updated_at)}</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      {campaign.milestones && campaign.milestones.length > 0 && (
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
            <span className="text-sm text-gray-500">({campaign.milestones.length} milestones)</span>
          </div>

          <div className="space-y-4">
            {campaign.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="bg-white rounded-lg border border-purple-100 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900">Milestone {index + 1}</h4>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMilestoneStatusStyles(milestone.status)}`}
                      >
                        {milestone.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 break-words">{milestone.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due Date
                    </label>
                    <p className="text-sm text-gray-900 mt-1">{formatDate(milestone.due_date)}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">Tasks</label>
                    <p className="text-sm text-gray-900 mt-1">{milestone.number_of_tasks} tasks</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500">Progress</label>
                    <div className="mt-1">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 mr-2">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${milestone.completion_percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-900">
                          {milestone.completion_percentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {milestone.status === "COMPLETED" && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {milestone.completed_at ? formatDate(milestone.completed_at) : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
