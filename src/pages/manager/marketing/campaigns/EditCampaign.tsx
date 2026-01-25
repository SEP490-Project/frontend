import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppDispatch } from "@/libs/stores";
import { getCampaignById, updateCampaign } from "@/libs/stores/campaignManager/thunk";
import { getTaskList, getTaskDetail } from "@/libs/stores/taskManager/thunk";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FaArrowLeft, FaCalendarDays, FaFileLines, FaListCheck } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useCampaign } from "@/libs/hooks/useCampaign";
import { format, parse, parseISO } from "date-fns";
import { Task, Review } from "./component/create";
import type { CampaignRequest } from "@/libs/types/campaign";

const campaignTypes = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "AFFILIATE", label: "Affiliate" },
  { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
  { value: "CO_PRODUCING", label: "Co-Producing" },
];

// Helper functions from CreateCampaign
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
    // Handle different date formats from API
    let date: Date;

    if (dateString.includes(" +0000 UTC")) {
      // Handle "2026-02-18 00:00:00 +0000 UTC" format
      date = new Date(dateString);
    } else if (dateString.includes("T")) {
      // Handle ISO format "2026-01-18T00:00:00.000Z"
      date = parseISO(dateString);
    } else {
      // Handle simple date format "2026-01-18"
      date = parseISO(dateString);
    }

    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.warn("Failed to format date:", dateString, error);
    return "";
  }
}

// Use types from CreateCampaign components to avoid duplication
// All interfaces are imported from './component/create'

const EditCampaignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"campaign" | "milestone" | "review">("campaign");

  // Milestones and tasks state
  const [milestones, setMilestones] = useState<any[]>([]);
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Editable campaign fields
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { campaignDetail, detailLoading } = useCampaign();

  // State for detailed tasks from API
  const [tasksDetail, setTasksDetail] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Fetch detailed tasks from API
  const fetchTasksDetail = async (campaignId: string) => {
    setIsLoadingTasks(true);
    try {
      const params = {
        campaign_id: campaignId,
        page: 1,
        limit: 100, // Get all tasks
      };
      const response = await dispatch(getTaskList(params)).unwrap();

      const basicTasks = response.data || [];

      if (basicTasks.length === 0) {
        setTasksDetail([]);
        return;
      }

      // Start with basic tasks immediately so UI can render
      setTasksDetail(basicTasks);

      // Try to enhance with detailed info (optional, non-blocking)
      try {
        const detailedTasks = [];

        for (let i = 0; i < Math.min(basicTasks.length, 5); i++) {
          // Limit to first 5 tasks to avoid overload
          const task = basicTasks[i];
          try {
            const detailResponse = await dispatch(getTaskDetail(task.id)).unwrap();

            // Extract data from API response structure
            if (detailResponse.data) {
              detailedTasks.push(detailResponse.data);
            } else {
              // Fallback if no data wrapper
              detailedTasks.push(detailResponse);
            }
          } catch (error) {
            console.warn(`Failed to fetch detail for task ${task.id}, using basic data:`, error);
            detailedTasks.push(task);
          }
        }

        // Add remaining basic tasks if any
        if (basicTasks.length > 5) {
          detailedTasks.push(...basicTasks.slice(5));
        }

        setTasksDetail(detailedTasks);
      } catch (detailError) {
        console.warn("Failed to fetch detailed task info, using basic tasks:", detailError);
        // Keep using basic tasks
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasksDetail([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Load campaign data and tasks together
  useEffect(() => {
    if (id) {
      dispatch(getCampaignById(id));
      fetchTasksDetail(id);
    }
  }, [dispatch, id]);

  // Populate form when both campaign data and tasks are loaded
  useEffect(() => {
    if (!campaignDetail || detailLoading || isLoadingTasks) {
      return;
    }

    if (campaignDetail && !detailLoading && !isLoadingTasks) {
      // Initialize editable fields if not already set
      if (!campaignName && campaignDetail.name) {
        setCampaignName(campaignDetail.name);
      }
      if (!campaignDescription && campaignDetail.description) {
        setCampaignDescription(campaignDetail.description);
      }

      // Set contract info if available
      if (campaignDetail.contract_id) {
        setContractInfo({
          id: campaignDetail.contract_id,
          title: campaignDetail.contract_title || "N/A",
          type: campaignDetail.type || "",
        });
      }

      // Convert milestones to the expected format with enhanced task data
      if (
        campaignDetail.milestones &&
        Array.isArray(campaignDetail.milestones) &&
        campaignDetail.milestones.length > 0
      ) {
        const formattedMilestones = campaignDetail.milestones.map((milestone: any) => {
          const milestoneTasks = tasksDetail.filter((t) => {
            const taskMilestoneId = t.milestone_id || (t.data && t.data.milestone_id);
            return taskMilestoneId === milestone.id;
          });

          // Also include tasks that were originally in the milestone structure (from campaign data)
          const originalMilestoneTasks = milestone.tasks || [];

          // Merge both sources of tasks, prioritizing API data
          const allTasksForMilestone = [...milestoneTasks];

          // Add original milestone tasks that might not be in the API response
          originalMilestoneTasks.forEach((originalTask: any) => {
            const existsInApi = milestoneTasks.find((apiTask) => apiTask.id === originalTask.id);
            if (!existsInApi) {
              allTasksForMilestone.push(originalTask);
            }
          });

          const formattedTasks = allTasksForMilestone.map((task: any) => {
            // Handle the actual API structure where description IS the description_json
            let descriptionText = "";
            let descriptionJson = {};
            let materialUrls: string[] = [];

            try {
              // From getTaskDetail API, description is the actual data object
              if (task.description && typeof task.description === "object") {
                descriptionJson = task.description;
                const desc = task.description as any;

                // Extract text description from various fields
                if (desc.creative_notes) {
                  descriptionText = desc.creative_notes;
                } else if (desc.product_description) {
                  descriptionText = desc.product_description;
                } else if (desc.concept_description) {
                  descriptionText = desc.concept_description;
                } else if (desc.event_name) {
                  descriptionText = desc.event_name;
                } else {
                  descriptionText = task.name || "";
                }

                // Get material URLs from description object
                materialUrls = desc.material_urls || [];
              } else if (typeof task.description === "string") {
                // Handle string description (for basic tasks)
                if (task.description.startsWith("{")) {
                  try {
                    descriptionJson = JSON.parse(task.description);
                    const desc = descriptionJson as any;
                    descriptionText =
                      desc.creative_notes || desc.product_description || task.name || "";
                    materialUrls = desc.material_urls || [];
                  } catch {
                    descriptionText = task.description;
                  }
                } else {
                  descriptionText = task.description;
                }
              } else {
                // Fallback to task name
                descriptionText = task.name || "";
              }

              // Additional material URLs from task level
              if (task.material_urls && Array.isArray(task.material_urls)) {
                materialUrls = [...materialUrls, ...task.material_urls];
              }
            } catch (error) {
              console.warn("Error processing task description:", error);
              descriptionText = task.name || "";
              descriptionJson = {};
            }

            const formattedTask = {
              id: task.id || crypto.randomUUID(),
              name: task.name || "",
              type: task.type || "",
              deadline: task.deadline ? formatDateForInput(task.deadline) : "",
              description: {
                description: descriptionText,
                material_url: materialUrls[0] || "",
                description_json: descriptionJson,
              },
              materialFiles: [],
              material_urls: materialUrls,
              status: task.status || "",
              milestone_id: task.milestone_id || milestone.id,
              // Keep original task for debugging
              _originalTask: task,
            };
            return formattedTask;
          });

          return {
            id: milestone.id || crypto.randomUUID(),
            description: milestone.description || "",
            due_date: milestone.due_date
              ? formatDateForInput(milestone.due_date)
              : // Try to extract date from description if due_date is empty
                (() => {
                  try {
                    const match = milestone.description?.match(/Due:\s*(\d{4}-\d{2}-\d{2})/);
                    if (match) {
                      return formatDateForInput(match[1]);
                    }
                    return "";
                  } catch {
                    return "";
                  }
                })(),
            tasks: formattedTasks,
          };
        });

        setMilestones(formattedMilestones);
      } else {
        // If no milestones in campaign but we have tasksDetail, create milestones based on milestone_id
        if (tasksDetail && tasksDetail.length > 0) {
          // Group tasks by milestone_id
          const tasksByMilestone = tasksDetail.reduce((acc: any, task: any) => {
            const milestoneId = task.milestone_id || "default";
            if (!acc[milestoneId]) {
              acc[milestoneId] = [];
            }
            acc[milestoneId].push(task);
            return acc;
          }, {});

          const createdMilestones = Object.entries(tasksByMilestone).map(
            ([milestoneId, tasks]: [string, any]) => {
              const milestone = {
                id: milestoneId === "default" ? crypto.randomUUID() : milestoneId,
                description:
                  milestoneId === "default" ? "Default Milestone" : `Milestone ${milestoneId}`,
                due_date: campaignDetail?.end_date
                  ? formatDateForInput(campaignDetail.end_date)
                  : "",
                tasks: tasks.map((apiTask: any) => {
                  // Handle the actual API structure
                  let finalDescriptionJson = {};
                  let descriptionText = "";
                  let materialUrls: string[] = [];

                  try {
                    if (apiTask.description && typeof apiTask.description === "object") {
                      // This is the detailed task structure from getTaskDetail
                      finalDescriptionJson = apiTask.description;
                      const desc = apiTask.description as any;

                      // Extract description text
                      if (desc.creative_notes) {
                        descriptionText = desc.creative_notes;
                      } else if (desc.product_description) {
                        descriptionText = desc.product_description;
                      } else if (desc.concept_description) {
                        descriptionText = desc.concept_description;
                      } else if (desc.event_name) {
                        descriptionText = desc.event_name;
                      } else {
                        descriptionText = apiTask.name || "";
                      }

                      materialUrls = desc.material_urls || [];
                    } else if (apiTask.description_json) {
                      finalDescriptionJson = apiTask.description_json;
                      const desc = apiTask.description_json as any;
                      descriptionText =
                        desc.creative_notes || desc.product_description || apiTask.name || "";
                      materialUrls = desc.material_urls || [];
                    } else if (typeof apiTask.description === "string") {
                      if (apiTask.description.startsWith("{")) {
                        try {
                          finalDescriptionJson = JSON.parse(apiTask.description);
                          const desc = finalDescriptionJson as any;
                          descriptionText =
                            desc.creative_notes || desc.product_description || apiTask.name || "";
                          materialUrls = desc.material_urls || [];
                        } catch {
                          descriptionText = apiTask.description;
                        }
                      } else {
                        descriptionText = apiTask.description;
                      }
                    } else {
                      descriptionText = apiTask.name || "";
                    }

                    // Add task-level material URLs
                    if (apiTask.material_urls && Array.isArray(apiTask.material_urls)) {
                      materialUrls = [...materialUrls, ...apiTask.material_urls];
                    }
                  } catch {
                    finalDescriptionJson = {};
                    descriptionText = apiTask.name || "";
                    materialUrls = [];
                  }

                  return {
                    id: apiTask.id || crypto.randomUUID(),
                    name: apiTask.name || "",
                    type: apiTask.type || "",
                    deadline: apiTask.deadline ? formatDateForInput(apiTask.deadline) : "",
                    description: {
                      description: descriptionText,
                      material_url: materialUrls[0] || "",
                      description_json: finalDescriptionJson,
                    },
                    materialFiles: [],
                    material_urls: materialUrls,
                    status: apiTask.status || "",
                    milestone_id: apiTask.milestone_id,
                    _originalTask: apiTask,
                  };
                }),
              };
              return milestone;
            },
          );

          setMilestones(createdMilestones);
        } else {
          setMilestones([]);
        }
      }

      setIsLoading(false);
    }
  }, [campaignDetail, detailLoading, tasksDetail, isLoadingTasks]);

  // Validation logic
  const isCampaignValid = useMemo(() => {
    return (
      !!campaignName &&
      !!campaignDetail?.start_date &&
      !!campaignDetail?.end_date &&
      !!campaignDetail?.type
    );
  }, [campaignName, campaignDetail]);

  const areMilestonesValid = useMemo(() => {
    return milestones.length > 0;
  }, [milestones]);

  const toPayload = (): CampaignRequest => ({
    contract_id: campaignDetail?.contract_id || "",
    name: campaignName || "",
    description: campaignDescription || "",
    start_date: campaignDetail?.start_date
      ? formatToISO(formatDateForInput(campaignDetail.start_date))
      : "",
    end_date: campaignDetail?.end_date
      ? formatToISO(formatDateForInput(campaignDetail.end_date))
      : "",
    type: campaignDetail?.type || "",
    milestones: milestones.map((m) => ({
      description: m.description,
      due_date: formatToISO(m.due_date),
      tasks: m.tasks.map((t: any) => ({
        name: t.name,
        type: t.type,
        deadline: formatToISO(t.deadline),
        description: t.description?.description_json || {},
      })),
    })),
  });

  const handleSubmit = async () => {
    if (!isCampaignValid || !id) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = toPayload();
      // Call update campaign API
      await dispatch(updateCampaign({ campaignId: id, request: payload })).unwrap();

      // Navigate back to detail page on success
      navigate(`/manage/marketing/campaigns/${id}`);
    } catch (error) {
      console.error("Failed to update campaign:", error);
      // You can add toast notification here if available
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/manage/marketing/campaigns/${id}`);
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

  if (isLoading || detailLoading || isLoadingTasks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading campaign and tasks details...</p>
          <p className="text-xs text-gray-500">
            Campaign: {detailLoading ? "loading..." : "loaded"} | Tasks:{" "}
            {isLoadingTasks ? "loading..." : "loaded"} | Processing: {isLoading ? "yes" : "no"}
          </p>
        </div>
      </div>
    );
  }

  if (!campaignDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign not found</h2>
          <p className="text-gray-600 mb-4">The campaign you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate("/manage/marketing/campaigns")}>Go to Campaigns</Button>
        </div>
      </div>
    );
  }

  const isValid = isCampaignValid;

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
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Return
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Edit Campaign
              </h1>
              <p className="text-gray-600">Update your campaign details</p>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>

        {/* Progress Overview Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
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
                  <p className="text-sm font-medium text-gray-600">Edit Campaign</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {activeTab === "campaign"
                      ? "Campaign Details"
                      : activeTab === "milestone"
                        ? "Tasks & Milestones"
                        : "Review & Save"}
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
                  <p className="text-sm font-semibold text-gray-900">{campaignName || "Not set"}</p>
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
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge
                    className={`border text-xs font-medium px-2 py-1 ${
                      campaignDetail?.status === "RUNNING"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : campaignDetail?.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : campaignDetail?.status === "DRAFT"
                            ? "bg-gray-100 text-gray-800 border-gray-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                  >
                    {campaignDetail?.status || "N/A"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FaListCheck className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Campaign Type</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {campaignDetail?.type
                      ? campaignTypes.find((t) => t.value === campaignDetail.type)?.label ||
                        campaignDetail.type
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
                  <p className="text-sm font-medium text-gray-600">Campaign Timeline</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {campaignDetail?.start_date && campaignDetail?.end_date
                      ? `${format(new Date(campaignDetail.start_date), "MMM dd")} - ${format(new Date(campaignDetail.end_date), "MMM dd, yyyy")}`
                      : "Not set"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {milestones.reduce((total, milestone) => total + milestone.tasks.length, 0)}{" "}
                    tasks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Main Content with Tabs */}
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
                    Tasks & Milestones
                  </TabsTrigger>
                  <TabsTrigger
                    value="review"
                    className="text-sm"
                    disabled={!isCampaignValid || !areMilestonesValid}
                  >
                    Review & Save
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="campaign">
                  {/* Campaign Details Form */}
                  <div className="space-y-6">
                    {/* Contract Information (Read-only) */}
                    {contractInfo && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">
                            Contract Information
                          </CardTitle>
                          <CardDescription>
                            This campaign is linked to a contract (read-only)
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">
                                Contract Title
                              </Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                                <p className="text-sm font-medium">{contractInfo.title}</p>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-600">
                                Contract Number
                              </Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                                <p className="text-sm font-medium font-mono">
                                  {campaignDetail?.contract_number || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Contract Type
                            </Label>
                            <div className="mt-1">
                              <Badge variant="secondary" className="capitalize">
                                {contractInfo.type.replace(/_/g, " ").toLowerCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Note:</strong> Contract information cannot be changed.
                              Campaign type is automatically set based on the contract.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Campaign Status Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Campaign Status</CardTitle>
                        <CardDescription>
                          Current campaign status and creation details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Status</Label>
                            <div className="mt-1">
                              <Badge
                                className={`border text-xs font-medium px-2 py-1 ${
                                  campaignDetail?.status === "RUNNING"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : campaignDetail?.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : campaignDetail?.status === "DRAFT"
                                        ? "bg-gray-100 text-gray-800 border-gray-200"
                                        : "bg-blue-100 text-blue-800 border-blue-200"
                                }`}
                              >
                                {campaignDetail?.status || "N/A"}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Created Date
                            </Label>
                            <p className="text-sm text-gray-900 mt-1">
                              {campaignDetail?.created_at
                                ? format(new Date(campaignDetail.created_at), "MMM dd, yyyy")
                                : "N/A"}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-600">Campaign ID</Label>
                            <p className="text-sm text-gray-900 mt-1 font-mono">
                              {campaignDetail?.id || "N/A"}
                            </p>
                          </div>
                        </div>

                        {campaignDetail?.percentage_completed !== undefined && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">
                              Overall Progress
                            </Label>
                            <div className="mt-2 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Completion</span>
                                <span className="font-medium">
                                  {campaignDetail.percentage_completed}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${campaignDetail.percentage_completed}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Campaign Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Campaign Details</CardTitle>
                        <CardDescription>Update your campaign basic information</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div>
                          <Label className="text-sm font-medium">Campaign Name *</Label>
                          <Input
                            placeholder="e.g. Summer Sale Campaign"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            className="h-11 mt-1"
                          />
                        </div>

                        {!contractInfo && (
                          <div>
                            <Label className="text-sm font-medium">Campaign Type *</Label>
                            <Input
                              value={
                                campaignDetail?.type
                                  ? campaignTypes.find((t) => t.value === campaignDetail.type)
                                      ?.label || campaignDetail.type
                                  : "Not selected"
                              }
                              readOnly
                              className="h-11 mt-1 bg-gray-50 text-gray-500"
                            />
                          </div>
                        )}

                        {contractInfo && (
                          <div>
                            <Label className="text-sm font-medium">Campaign Type</Label>
                            <Input
                              value={
                                campaignTypes.find((t) => t.value === campaignDetail?.type)
                                  ?.label ||
                                campaignDetail?.type ||
                                ""
                              }
                              readOnly
                              className="h-11 mt-1 bg-gray-50 text-gray-500"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Type is set by the contract and cannot be changed.
                            </p>
                          </div>
                        )}

                        <div>
                          <Label className="text-sm font-medium">Description</Label>
                          <Textarea
                            placeholder="Briefly describe your campaign goal or content..."
                            value={campaignDescription}
                            onChange={(e) => setCampaignDescription(e.target.value)}
                            className="min-h-30 mt-1"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">Campaign Timeline</CardTitle>
                        <CardDescription>
                          Campaign timeline cannot be modified (read-only)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                          <Input
                            value={
                              campaignDetail?.start_date
                                ? format(new Date(campaignDetail.start_date), "MMM dd, yyyy")
                                : "Not set"
                            }
                            readOnly
                            className="h-11 bg-gray-50 text-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-600">End Date</Label>
                          <Input
                            value={
                              campaignDetail?.end_date
                                ? format(new Date(campaignDetail.end_date), "MMM dd, yyyy")
                                : "Not set"
                            }
                            readOnly
                            className="h-11 bg-gray-50 text-gray-500"
                          />
                        </div>
                      </CardContent>
                      <CardContent className="pt-0">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">
                            <strong>Note:</strong> Campaign timeline is fixed and cannot be changed
                            during editing to maintain milestone and task scheduling integrity.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline" onClick={handleGoBack}>
                        <FaArrowLeft className="mr-2" />
                        Back to Campaign
                      </Button>
                      <Button onClick={() => setActiveTab("milestone")} disabled={!isCampaignValid}>
                        Next: Tasks & Milestones
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="milestone">
                  {(() => {
                    if (!campaignDetail) {
                      return (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Campaign data not loaded yet...</p>
                        </div>
                      );
                    }

                    if (milestones.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <div className="max-w-2xl mx-auto">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No Tasks Found in UI
                            </h3>
                            <p className="text-gray-500 mb-4">
                              Debugging task loading and mapping process...
                            </p>
                            <div className="text-sm text-gray-600 space-y-3 mb-6 p-4 bg-gray-50 rounded-lg text-left">
                              <div className="space-y-2">
                                <p className="font-medium">Step-by-step debug:</p>

                                <div className="grid grid-cols-1 gap-3">
                                  <div className="p-3 bg-white rounded border">
                                    <p className="font-medium text-xs">1. Basic Info</p>
                                    <p className="text-xs">Campaign ID: {id}</p>
                                    <p className="text-xs">
                                      Campaign loaded: {campaignDetail ? "✅" : "❌"}
                                    </p>
                                    <p className="text-xs">
                                      Campaign name: {campaignDetail?.name || "N/A"}
                                    </p>
                                  </div>

                                  <div className="p-3 bg-white rounded border">
                                    <p className="font-medium text-xs">2. Loading States</p>
                                    <p className="text-xs">
                                      Campaign loading: {detailLoading ? "🔄" : "✅"}
                                    </p>
                                    <p className="text-xs">
                                      Tasks loading: {isLoadingTasks ? "🔄" : "✅"}
                                    </p>
                                    <p className="text-xs">Processing: {isLoading ? "🔄" : "✅"}</p>
                                  </div>

                                  <div className="p-3 bg-white rounded border">
                                    <p className="font-medium text-xs">3. Campaign Milestones</p>
                                    <p className="text-xs">
                                      Milestones count: {campaignDetail?.milestones?.length || 0}
                                    </p>
                                    <p className="text-xs">
                                      Milestones exist: {campaignDetail?.milestones ? "✅" : "❌"}
                                    </p>
                                    {campaignDetail?.milestones &&
                                      campaignDetail.milestones.length > 0 && (
                                        <p className="text-xs">
                                          First milestone ID: {campaignDetail.milestones[0]?.id}
                                        </p>
                                      )}
                                  </div>

                                  <div className="p-3 bg-white rounded border">
                                    <p className="font-medium text-xs">4. API Tasks</p>
                                    <p className="text-xs">Tasks from API: {tasksDetail.length}</p>
                                    {tasksDetail.length > 0 && (
                                      <>
                                        <p className="text-xs">
                                          First task ID: {tasksDetail[0]?.id}
                                        </p>
                                        <p className="text-xs">
                                          First task milestone_id: {tasksDetail[0]?.milestone_id}
                                        </p>
                                        <p className="text-xs">
                                          First task name: {tasksDetail[0]?.name}
                                        </p>
                                      </>
                                    )}
                                  </div>

                                  <div className="p-3 bg-white rounded border">
                                    <p className="font-medium text-xs">5. Final State</p>
                                    <p className="text-xs">
                                      Formatted milestones: {milestones.length}
                                    </p>
                                    <p className="text-xs">
                                      Total tasks in milestones:{" "}
                                      {milestones.reduce(
                                        (sum, m) => sum + (m.tasks?.length || 0),
                                        0,
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 flex gap-2 justify-center flex-wrap">
                              <Button variant="outline" onClick={() => setActiveTab("campaign")}>
                                Back to Campaign
                              </Button>
                              <Button
                                onClick={() => {
                                  if (id) {
                                    fetchTasksDetail(id);
                                  }
                                }}
                              >
                                Refresh Tasks
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Task
                        milestones={milestones}
                        setMilestones={setMilestones}
                        selectedContract={contractInfo}
                        campaignType={campaignDetail?.type || ""}
                        campaignMode={contractInfo ? "contract" : "internal"}
                        campaignData={{
                          start_date: campaignDetail?.start_date
                            ? formatDateForInput(campaignDetail.start_date)
                            : "",
                          end_date: campaignDetail?.end_date
                            ? formatDateForInput(campaignDetail.end_date)
                            : "",
                        }}
                        onBack={() => setActiveTab("campaign")}
                        onNext={() => setActiveTab("review")}
                        isEditMode={true}
                      />
                    );
                  })()}
                </TabsContent>

                <TabsContent value="review">
                  <Review
                    campaignData={{
                      name: campaignName || "",
                      type: campaignDetail?.type || "",
                      description: campaignDescription || "",
                      start_date: campaignDetail?.start_date || "",
                      end_date: campaignDetail?.end_date || "",
                      contract_id: campaignDetail?.contract_id || "",
                    }}
                    milestones={milestones}
                    selectedContract={contractInfo}
                    toPayload={toPayload}
                    onBack={() => setActiveTab("milestone")}
                    onSubmit={handleSubmit}
                    isEditMode={true}
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

export default EditCampaignPage;
