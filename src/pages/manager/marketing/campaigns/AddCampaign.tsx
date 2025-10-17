import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreateCampaign, CreateTask, Review } from "./component";
import { parse } from "date-fns";
import type { CampaignRequest } from "@/libs/types/campaign";
import { useAppDispatch } from "@/libs/stores";
import { createCampaign } from "@/libs/stores/campaignManager/thunk";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
    type: "",
    description: "",
    start_date: "",
    end_date: "",
    contract_id: "",
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isCampaignValid = useMemo(() => {
    return (
      !!campaignData.name &&
      !!campaignData.contract_id &&
      !!campaignData.start_date &&
      !!campaignData.end_date
    );
  }, [campaignData]);

  const toPayload = (): CampaignRequest => ({
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
          material_url: Array.isArray(t.description?.material_url)
            ? t.description.material_url
            : typeof t.description?.material_url === "string" && t.description.material_url
              ? [t.description.material_url]
              : [],
        },
      })),
    })),
  });

  const handleSubmit = async () => {
    if (!isCampaignValid) {
      toast.error("Please fill in all required campaign details!");
      return;
    }
    const payload = toPayload();

    try {
      const resultAction = await dispatch(createCampaign(payload));

      if (createCampaign.fulfilled.match(resultAction)) {
        toast.success("✅ Campaign created successfully!");
        navigate("/manage/marketing/campaigns");
      } else {
        toast.error("❌ Failed to create campaign: " + (resultAction.payload || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Something went wrong while creating campaign.");
    }
  };

  const handleReset = () => {
    setCampaignData({
      name: "",
      type: "",
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
          {/* Heading */}
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
                    <Review
                      campaignData={campaignData}
                      milestones={milestones}
                      selectedContract={selectedContract}
                      toPayload={toPayload}
                      onBack={() => setActiveTab("milestone")}
                      onSubmit={handleSubmit}
                    />
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
