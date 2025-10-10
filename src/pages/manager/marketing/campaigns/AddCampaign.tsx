import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Review, CreateTask, CreateCampaign } from "@/components/manage/marketing/workflow";

interface Assignee {
  id: string;
  name: string;
}

const mockAssignees: Assignee[] = [
  { id: "a1e8400-e29b-41d4-a716-446655440010", name: "Alice Nguyen" },
  { id: "b2e8400-e29b-41d4-a716-446655440011", name: "Bob Tran" },
  { id: "c3e8400-e29b-41d4-a716-446655440012", name: "Charlie Le" },
];

const campaignTypes = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "MARKETING", label: "Marketing" },
  { value: "PROMOTION", label: "Promotion" },
  { value: "OTHER", label: "Other" },
];

function formatToISO(dateStr?: string | null) {
  if (!dateStr) return null;
  const iso = new Date(dateStr + "T00:00:00Z").toISOString();
  return iso;
}

const AddCampaignPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("campaign");
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // Campaign-level state (matches schema)
  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "ADVERTISING",
    description: "",
    start_date: "", // YYYY-MM-DD
    end_date: "",
    contract_id: "",
    budget_projected: "" as string | number,
  });

  // Milestones array
  const [milestones, setMilestones] = useState<
    {
      id: string;
      description: string;
      due_date: string; // YYYY-MM-DD
      tasks: {
        id: string;
        name: string;
        type: string;
        description: string;
        deadline: string; // YYYY-MM-DD
        assigned_to: string;
      }[];
    }[]
  >([]);

  const isCampaignValid = useMemo(() => {
    return (
      !!campaignData.name &&
      !!campaignData.contract_id &&
      !!campaignData.start_date &&
      !!campaignData.end_date
    );
  }, [campaignData]);

  const toPayload = () => {
    // Build payload matching user's schema example
    const payload: any = {
      name: campaignData.name,
      type: campaignData.type,
      description: campaignData.description,
      start_date: formatToISO(campaignData.start_date) || null,
      end_date: formatToISO(campaignData.end_date) || null,
      contract_id: campaignData.contract_id || null,
      budget_projected:
        campaignData.budget_projected === "" ? null : Number(campaignData.budget_projected),
      milestones: milestones.map((m) => ({
        description: m.description,
        due_date: formatToISO(m.due_date) || null,
        tasks: m.tasks.map((t) => ({
          assigned_to: t.assigned_to || null,
          deadline: formatToISO(t.deadline) || null,
          description: t.description,
          name: t.name,
          type: t.type || null,
        })),
      })),
    };
    return payload;
  };

  const handleSubmit = () => {
    const payload = toPayload();
    console.log("Create Campaign Payload:", payload);
    alert("✅ Payload logged to console (mock submit).");
  };

  const handleReset = () => {
    setCampaignData({
      name: "",
      type: "",
      description: "",
      start_date: "",
      end_date: "",
      contract_id: "",
      budget_projected: "",
    });
    setMilestones([]);
    setSelectedContract(null);
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Create Campaign</h1>
        </div>

        <Card className="p-6 mb-6">
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="campaign">Campaign</TabsTrigger>
                <TabsTrigger value="milestone">Milestone</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>

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
                  mockAssignees={mockAssignees}
                  onBack={() => setActiveTab("campaign")}
                  onNext={() => setActiveTab("review")}
                />
              </TabsContent>

              <TabsContent value="review">
                <Review
                  campaignData={campaignData}
                  milestones={milestones}
                  selectedContract={selectedContract}
                  mockAssignees={mockAssignees}
                  toPayload={toPayload}
                  onBack={() => setActiveTab("milestone")}
                  onSubmit={handleSubmit}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCampaignPage;
