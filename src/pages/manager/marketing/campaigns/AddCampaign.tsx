import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreateCampaign, CreateTask } from "./component";
import { parse } from "date-fns";

// CampaignRequest interface
export interface CampaignRequest {
  contract_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  type: string;
  milestones: {
    description: string;
    due_date: string;
    tasks: {
      deadline: string;
      name: string;
      type: string;
      description: {
        description: string;
        material_url: string[];
      };
    }[];
  }[];
}

const campaignTypes = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "MARKETING", label: "Marketing" },
  { value: "PROMOTION", label: "Promotion" },
  { value: "OTHER", label: "Other" },
];

function formatToISO(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
    return parsed.toISOString();
  } catch {
    return "";
  }
}

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

const AddCampaignPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"campaign" | "milestone" | "review">("campaign");
  const [selectedContract, setSelectedContract] = useState<ContractBase | null>(null);

  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    type: "ADVERTISING",
    description: "",
    start_date: "",
    end_date: "",
    contract_id: "",
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const isCampaignValid = useMemo(() => {
    return (
      !!campaignData.name &&
      !!campaignData.contract_id &&
      !!campaignData.start_date &&
      !!campaignData.end_date
    );
  }, [campaignData]);

  const toPayload = (): CampaignRequest => {
    const payload: CampaignRequest = {
      contract_id: campaignData.contract_id,
      name: campaignData.name,
      description: campaignData.description,
      start_date: formatToISO(campaignData.start_date),
      end_date: formatToISO(campaignData.end_date),
      type: campaignData.type,
      milestones: milestones.map((m) => ({
        description: m.description,
        due_date: formatToISO(m.due_date),
        tasks: m.tasks.map((t) => ({
          name: t.name,
          type: t.type,
          deadline: formatToISO(t.deadline),
          description: {
            description: t.description?.description || "",
            material_url: t.description?.material_url ? [t.description.material_url] : [],
          },
        })),
      })),
    };
    console.log("CampaignRequest Payload:", JSON.stringify(payload, null, 2));
    return payload;
  };

  const handleSubmit = () => {
    toPayload();
    alert("✅ Campaign created! Check console for payload.");
  };

  const handleReset = () => {
    setCampaignData({
      name: "",
      type: "ADVERTISING",
      description: "",
      start_date: "",
      end_date: "",
      contract_id: "",
    });
    setMilestones([]);
    setSelectedContract(null);
    setActiveTab("campaign");
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Campaign</h1>
            <p className="text-gray-600 mt-2 text-base sm:text-lg">
              Plan and organize your marketing campaigns efficiently. Add milestones, tasks, and
              review before submission.
            </p>
          </div>
          <div className="relative">
            <Card className="p-6 mb-6">
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "campaign" | "milestone" | "review")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
                  <TabsTrigger value="campaign" className="text-sm">
                    Campaign Details
                  </TabsTrigger>
                  <TabsTrigger value="milestone" className="text-sm" disabled={!isCampaignValid}>
                    Milestones & Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="review"
                    className="text-sm"
                    disabled={!isCampaignValid || milestones.length === 0}
                  >
                    Review & Submit
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="campaign">
                    <CreateCampaign
                      campaignData={campaignData}
                      setCampaignData={setCampaignData}
                      campaignTypes={campaignTypes}
                      isCampaignValid={isCampaignValid}
                      onNext={() => setActiveTab("milestone")}
                      onReset={handleReset}
                      onContractSelect={setSelectedContract}
                    />
                  </TabsContent>

                  <TabsContent value="milestone">
                    <CreateTask
                      milestones={milestones}
                      setMilestones={setMilestones}
                      selectedContract={selectedContract}
                      onBack={() => setActiveTab("campaign")}
                      onNext={() => setActiveTab("review")}
                    />
                  </TabsContent>

                  <TabsContent value="review">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Review Campaign</CardTitle>
                        <p className="text-sm text-gray-600">
                          Review your campaign details before creating
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-3">Campaign Details</h3>
                          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                            <p>
                              <strong>Name:</strong> {campaignData.name}
                            </p>
                            <p>
                              <strong>Type:</strong> {campaignData.type}
                            </p>
                            <p>
                              <strong>Description:</strong> {campaignData.description}
                            </p>
                            <p>
                              <strong>Duration:</strong> {campaignData.start_date} to{" "}
                              {campaignData.end_date}
                            </p>
                            {selectedContract && (
                              <p>
                                <strong>Contract:</strong> {selectedContract.title}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">
                            Milestones & Tasks ({milestones.length})
                          </h3>
                          <div className="space-y-3">
                            {milestones.map((m, mi) => (
                              <div key={m.id} className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium">
                                  Milestone {mi + 1}: {m.description}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">Due: {m.due_date}</p>
                                <div className="pl-4 space-y-1">
                                  {m.tasks.map((t, ti) => (
                                    <div key={t.id} className="text-sm">
                                      <p>
                                        <strong>Task {ti + 1}:</strong> {t.name} ({t.type})
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Deadline: {t.deadline}
                                      </p>
                                      {t.description?.description && (
                                        <p className="text-xs text-gray-600">
                                          Description: {t.description.description}
                                        </p>
                                      )}
                                      {t.description?.material_url &&
                                        t.description.material_url.length > 0 && (
                                          <p className="text-xs text-blue-600">
                                            Material:{" "}
                                            <a
                                              href={t.description.material_url[0]}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              View File
                                            </a>
                                          </p>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setActiveTab("milestone")}>
                            Back to Edit
                          </Button>
                          <div className="flex gap-3">
                            <Button variant="outline" onClick={handleReset}>
                              Reset All
                            </Button>
                            <Button onClick={handleSubmit}>Create Campaign</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCampaignPage;
