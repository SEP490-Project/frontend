import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContractBase } from "@/libs/types/contract";

interface Assignee {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  type: string;
  description: string;
  deadline: string;
  assigned_to: string;
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

interface ReviewProps {
  campaignData: CampaignData;
  milestones: Milestone[];
  selectedContract: ContractBase | null; // Changed from mockContracts
  mockAssignees: Assignee[];
  toPayload: () => any;
  onBack: () => void;
  onSubmit: () => void;
}

const Review: React.FC<ReviewProps> = ({
  campaignData,
  milestones,
  selectedContract,
  mockAssignees,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="pt-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between border-b py-2">
              <span className="text-sm text-gray-600">Name</span>
              <span className="font-medium">{campaignData.name || "—"}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-sm text-gray-600">Type</span>
              <span className="font-medium">{campaignData.type || "—"}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-sm text-gray-600">Contract</span>
              <span className="font-medium">{selectedContract?.title || "—"}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="text-sm text-gray-600">Start → End</span>
              <span className="font-medium">
                {campaignData.start_date ? campaignData.start_date : "—"} →{" "}
                {campaignData.end_date ? campaignData.end_date : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Milestones Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              Total milestones: <span className="font-medium">{milestones.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              Total tasks:{" "}
              <span className="font-medium">
                {milestones.reduce((acc, m) => acc + m.tasks.length, 0)}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {milestones.map((m, i) => (
                <div key={m.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="text-sm font-semibold">Milestone {i + 1}</div>
                      <div className="text-xs text-gray-500">
                        {m.description || "No description"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Due: {m.due_date || "—"}</div>
                    </div>
                    <Badge variant="secondary">{m.tasks.length} tasks</Badge>
                  </div>

                  <div className="mt-3 space-y-2">
                    {m.tasks.map((t) => (
                      <div key={t.id} className="p-2 bg-gray-50 rounded-md border">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{t.name || "Untitled task"}</div>
                          <div className="text-xs text-gray-500">{t.type || "—"}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {t.description || "No description"}
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                          <div>Deadline: {t.deadline || "—"}</div>
                          <div>
                            Assigned:{" "}
                            {mockAssignees.find((a) => a.id === t.assigned_to)?.name || "—"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="flex gap-3">
          <Button onClick={onSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Review;
