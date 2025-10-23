import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Target, CheckCircle } from "lucide-react";
import { useCampaign } from "@/libs/hooks/useCampaign";

interface TaskDescription {
  description: string;
  material_url?: string;
}

interface Task {
  id: string;
  name: string;
  type: string;
  description: TaskDescription;
  deadline: string;
  materialFiles?: File[];
}

interface Milestone {
  id: string;
  description: string;
  due_date: string;
  tasks: Task[];
}

interface CampaignData {
  name: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  contract_id: string;
}

interface ContractBase {
  id: string;
  title: string;
  type: string;
  start_date: string;
  end_date: string;
}

interface ReviewProps {
  campaignData: CampaignData;
  milestones: Milestone[];
  selectedContract: ContractBase | null;
  toPayload: () => any;
  onBack: () => void;
  onSubmit: () => void;
}

const Review: React.FC<ReviewProps> = ({
  campaignData,
  milestones,
  selectedContract,
  onBack,
  onSubmit,
}) => {
  const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const { loading } = useCampaign();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case "ADVERTISING":
        return "bg-blue-100 text-blue-800";
      case "MARKETING":
        return "bg-green-100 text-green-800";
      case "PROMOTION":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "design":
        return "bg-pink-100 text-pink-800";
      case "content":
        return "bg-yellow-100 text-yellow-800";
      case "development":
        return "bg-indigo-100 text-indigo-800";
      case "analysis":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review Campaign</h2>
          <p className="text-gray-600">Please review all details before creating the campaign</p>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaign Details */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Campaign Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Campaign Name</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {campaignData.name || "—"}
                  </span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Type</span>
                  <Badge className={`w-fit ${getCampaignTypeColor(campaignData.type)}`}>
                    {campaignData.type || "—"}
                  </Badge>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Contract</span>
                  <span className="text-base font-medium text-gray-900">
                    {selectedContract?.title || "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Duration
                  </span>
                  <div className="text-base text-gray-900">
                    <div>{formatDate(campaignData.start_date)}</div>
                    <div className="text-xs text-gray-500">to</div>
                    <div>{formatDate(campaignData.end_date)}</div>
                  </div>
                </div>
              </div>
            </div>

            {campaignData.description && (
              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1 mb-2">
                  <FileText className="w-4 h-4" />
                  Description
                </span>
                <p className="text-gray-700 bg-white p-3 rounded-md border">
                  {campaignData.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Campaign Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-blue-600">{milestones.length}</div>
              <div className="text-sm text-gray-500">Milestones</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-green-600">{totalTasks}</div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones & Tasks */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Milestones & Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Timeline line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 z-0"></div>
                )}

                <div className="flex gap-4">
                  {/* Milestone indicator */}
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center z-10 relative">
                    <span className="text-indigo-600 font-semibold">{index + 1}</span>
                  </div>

                  {/* Milestone content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Milestone {index + 1}</h4>
                          <p className="text-gray-600 text-sm mt-1">
                            {milestone.description || "No description"}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {milestone.tasks.length} tasks
                          </Badge>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(milestone.due_date)}
                          </div>
                        </div>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-2">
                        {milestone.tasks.map((task) => (
                          <div key={task.id} className="bg-gray-50 rounded-md p-3 border">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">
                                    {task.name || "Untitled task"}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${getTaskTypeColor(task.type)}`}
                                  >
                                    {task.type || "—"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {task.description?.description || "No description"}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Due: {formatDate(task.deadline)}</span>
                              </div>
                              {task.materialFiles && task.materialFiles.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  <span>{task.materialFiles.length} files</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          ← Back to Edit
        </Button>
        <div className="flex gap-3">
          <Button
            onClick={onSubmit}
            className="bg-gradient-to-r from-primary/70 to-primary/80 hover:from-primary/70 hover:to-primary/50 text-white px-8"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Review;
