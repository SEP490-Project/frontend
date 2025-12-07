import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Campaign, Task, Review } from "./component/create";
import { parse, format, parseISO } from "date-fns";
import type { CampaignRequest } from "@/libs/types/campaign";
import { useAppDispatch } from "@/libs/stores";
import { createCampaign, createInternalCampaign } from "@/libs/stores/campaignManager/thunk";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaCalendarDays, FaFileLines, FaListCheck, FaArrowLeft } from "react-icons/fa6";

const campaignTypes = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "AFFILIATE", label: "Affiliate" },
  { value: "AMBASSADOR", label: "Ambassador" },
  { value: "COPRODUCE", label: "Co-Produce" },
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

function formatDateForInput(dateString?: string | null) {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "yyyy-MM-dd");
  } catch {
    return "";
  }
}

interface TaskDescriptionJson {
  kpi_goals?: { metric: string; target: string }[] | null;
  material_urls?: string[];
  advertised_item_id?: number;
  product_name?: string;
  platform?: string;
  tagline?: string;
  creative_notes?: string;
  hashtags?: string[];
  is_affiliate_content?: boolean;
  tracking_link?: string;

  is_product_creation_task?: boolean;
  product_id?: number;
  product_description?: string;
  subtasks?: string[];
  materials?: any;

  event_id?: number;
  event_name?: string;
  event_date?: string;
  event_duration?: string;
  location?: string;
  activities?: string[];
  representation_rules?: string[];
}

interface TaskDescription {
  description: string;
  material_url?: string;
  description_json?: TaskDescriptionJson;
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
  const [campaignMode, setCampaignMode] = useState<"contract" | "internal">("contract");
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

  // Reset milestones when campaign mode changes
  useEffect(() => {
    setMilestones([]);
    setSelectedContract(null);
  }, [campaignMode]);

  // Handle suggestion data from Campaign component
  const handleSuggestedDataReceived = (suggestionData: any) => {
    if (suggestionData?.suggested_campaign) {
      const suggested = suggestionData.suggested_campaign;

      // Update campaign data
      setCampaignData((prev) => ({
        ...prev,
        name: suggested.name || prev.name,
        description: suggested.description || prev.description,
        start_date: suggested.start_date
          ? formatDateForInput(suggested.start_date)
          : prev.start_date,
        end_date: suggested.end_date ? formatDateForInput(suggested.end_date) : prev.end_date,
        type: suggested.type || prev.type,
      }));

      // Update milestones with tasks
      if (suggested.milestones) {
        const newMilestones = suggested.milestones.map((milestone: any) => ({
          id: crypto.randomUUID(),
          description: milestone.description,
          due_date: formatDateForInput(milestone.due_date),
          tasks: milestone.tasks.map((task: any) => {
            const descriptionJson = task.description_json || {};
            const materialUrls = descriptionJson.materials || descriptionJson.material_urls || [];

            return {
              id: crypto.randomUUID(),
              name: task.name,
              type: task.type,
              deadline: formatDateForInput(task.deadline),
              description: {
                description:
                  descriptionJson.product_description ||
                  descriptionJson.creative_notes ||
                  descriptionJson.concept_description ||
                  descriptionJson.event_name ||
                  "",
                material_url: materialUrls[0] || "",
                description_json: descriptionJson,
              },
              materialFiles: [],
            };
          }),
        }));
        setMilestones(newMilestones);
      }
    }
  };

  const isCampaignValid = useMemo(() => {
    const baseValid = !!campaignData.name && !!campaignData.start_date && !!campaignData.end_date;

    if (campaignMode === "contract") {
      return baseValid && !!campaignData.contract_id;
    } else {
      return baseValid && !!campaignData.type;
    }
  }, [campaignData, campaignMode]);

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
        description_json: t.description?.description_json || {},
      })),
    })),
  });

  const handleSubmit = async () => {
    if (!isCampaignValid) {
      return;
    }
    const payload = toPayload();

    try {
      let result;
      if (campaignMode === "contract") {
        result = await dispatch(createCampaign(payload));
      } else {
        result = await dispatch(createInternalCampaign(payload));
      }

      // Check if the action was fulfilled (not rejected)
      if (
        createCampaign.fulfilled.match(result) ||
        createInternalCampaign.fulfilled.match(result)
      ) {
        // Only navigate on success
        setTimeout(() => {
          navigate("/manage/marketing/campaigns");
        }, 1000);
      } else {
        // Handle rejected case - stay on page
        console.error("Campaign creation was rejected:", result.payload);
      }
    } catch (error: any) {
      // This catch should not be reached with proper Redux Toolkit setup
      console.error("Unexpected error:", error);
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
    setCampaignMode("contract");
    setActiveTab("campaign");
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="min-h-fit p-4 sm:p-6 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/manage/marketing/campaigns")}
              className="flex items-center"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Return
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Create New Campaign
              </h1>
              <p className="text-gray-600">
                Plan and organize your marketing campaigns efficiently
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <div className="h-5 w-5 text-blue-600 flex items-center justify-center font-semibold text-sm">
                    {activeTab === "campaign" ? "1" : activeTab === "milestone" ? "2" : "3"}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {campaignMode === "contract" ? "Contract Campaign" : "Internal Campaign"}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {activeTab === "campaign"
                      ? "Campaign Details"
                      : activeTab === "milestone"
                        ? "Milestones & Tasks"
                        : "Review & Submit"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaFileLines className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Campaign Name</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {campaignData.name || "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaListCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Campaign Type</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {campaignData.type
                      ? campaignTypes.find((t) => t.value === campaignData.type)?.label ||
                        campaignData.type
                      : "Not selected"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FaCalendarDays className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Milestones</p>
                  <p className="text-sm font-semibold text-gray-900">{milestones.length} created</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "campaign" | "milestone" | "review")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm mb-6">
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

                <TabsContent value="campaign">
                  <Campaign
                    campaignData={campaignData}
                    setCampaignData={setCampaignData}
                    campaignTypes={campaignTypes}
                    campaignMode={campaignMode}
                    setCampaignMode={setCampaignMode}
                    isCampaignValid={isCampaignValid}
                    onNext={() => setActiveTab("milestone")}
                    onReset={handleReset}
                    onContractSelect={setSelectedContract}
                    onSuggestedDataReceived={handleSuggestedDataReceived}
                    selectedContract={selectedContract}
                  />
                </TabsContent>

                <TabsContent value="milestone">
                  <Task
                    milestones={milestones}
                    setMilestones={setMilestones}
                    selectedContract={selectedContract}
                    campaignType={campaignData.type}
                    campaignMode={campaignMode}
                    campaignData={campaignData}
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
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddCampaignPage;
