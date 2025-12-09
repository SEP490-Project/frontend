import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/libs/hooks/useAuth";
import { DatePicker } from "@/components/date-picker";
import { ContractUploader } from "@/components/global";
import { Plus, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAppDispatch } from "@/libs/stores";
import { getContractById } from "@/libs/stores/contractManager/thunk";
import { useContract } from "@/libs/hooks/useContract";
import { generateMilestonesFromContract } from "../../utils/milestoneGenerator";
import AddTaskModal from "./AddTaskModal";

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
  material_urls?: string[];
}

interface Milestone {
  id: string;
  description: string;
  due_date: string;
  tasks: Task[];
}

interface CreateTaskProps {
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  selectedContract: any;
  campaignType: string;
  campaignMode: "contract" | "internal";
  campaignData?: {
    start_date: string;
    end_date: string;
  };
  onBack: () => void;
  onNext: () => void;
}

const getTaskTypeOptions = (campaignType: string) => {
  switch (campaignType) {
    case "ADVERTISING":
    case "AFFILIATE":
      return [
        { value: "CONTENT", label: "Content" },
        { value: "OTHER", label: "Other" },
      ];
    case "BRAND_AMBASSADOR":
      return [
        { value: "EVENT", label: "Event" },
        { value: "OTHER", label: "Other" },
      ];
    case "CO_PRODUCING":
      return [
        { value: "PRODUCT", label: "Product" },
        { value: "CONTENT", label: "Content" },
        { value: "OTHER", label: "Other" },
      ];
    default:
      return [{ value: "OTHER", label: "Other" }];
  }
};

const formatDateForInput = (dateString?: string | null) => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "yyyy-MM-dd");
  } catch {
    return "";
  }
};

const CreateTask: React.FC<CreateTaskProps> = ({
  milestones,
  setMilestones,
  selectedContract,
  campaignType,
  campaignMode,
  campaignData,
  onBack,
  onNext,
}) => {
  const taskTypeOptions = getTaskTypeOptions(campaignType);
  const contractStart = formatDateForInput(selectedContract?.start_date);
  const contractEnd = formatDateForInput(selectedContract?.end_date);
  const { user } = useAuth();
  const [addTaskModal, setAddTaskModal] = React.useState<{
    open: boolean;
    milestoneId: string | null;
  }>({ open: false, milestoneId: null });
  const dispatch = useAppDispatch();
  const { contractDetail, detailLoading } = useContract();
  const [hasLoadedContract, setHasLoadedContract] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (campaignMode === "internal") {
      setHasLoadedContract(null);
    }
  }, [campaignMode]);

  React.useEffect(() => {
    if (
      campaignMode === "contract" &&
      selectedContract?.id &&
      hasLoadedContract !== selectedContract.id
    ) {
      dispatch(getContractById(selectedContract.id));
      setHasLoadedContract(selectedContract.id);
    }
  }, [dispatch, selectedContract?.id, campaignMode, hasLoadedContract]);

  React.useEffect(() => {
    if (
      campaignMode === "contract" &&
      contractDetail?.id === selectedContract?.id &&
      campaignData?.start_date &&
      campaignData?.end_date &&
      milestones.length === 0
    ) {
      if ((contractDetail?.financial_terms as any)?.schedule) {
        const schedule = (contractDetail!.financial_terms as any).schedule;
        const contractMilestones = schedule.map((scheduleItem: any) => ({
          id: crypto.randomUUID(),
          description: scheduleItem.milestone || `Payment milestone ${scheduleItem.id}`,
          due_date: formatDateForInput(scheduleItem.due_date),
          tasks: [],
        }));
        setMilestones(contractMilestones);
      } else if (contractDetail?.type === "CO_PRODUCING" || contractDetail?.type === "AFFILIATE") {
        const generatedMilestones = generateMilestonesFromContract(
          contractDetail,
          campaignData.start_date,
          campaignData.end_date,
        );

        if (generatedMilestones.length > 0) {
          setMilestones(generatedMilestones);
        }
      }
    }
  }, [
    contractDetail,
    selectedContract?.id,
    campaignMode,
    campaignData?.start_date,
    campaignData?.end_date,
    milestones.length,
    setMilestones,
  ]);

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", due_date: "", tasks: [] },
    ]);
  };

  const removeMilestone = (id: string) => setMilestones((prev) => prev.filter((m) => m.id !== id));

  const updateMilestone = (id: string, patch: Partial<Milestone>) =>
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const addTask = (milestoneId: string) => {
    setAddTaskModal({ open: true, milestoneId });
  };

  const handleAddTask = (task: Task) => {
    if (addTaskModal.milestoneId) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === addTaskModal.milestoneId ? { ...m, tasks: [...m.tasks, task] } : m,
        ),
      );
    }
    setAddTaskModal({ open: false, milestoneId: null });
  };

  const removeTask = (milestoneId: string, taskId: string) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) } : m,
      ),
    );

  const updateTask = (milestoneId: string, taskId: string, patch: Partial<Task>) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
            }
          : m,
      ),
    );

  // const regenerateMilestonesFromContract = () => {
  //   if (
  //     campaignMode === "contract" &&
  //     contractDetail &&
  //     campaignData?.start_date &&
  //     campaignData?.end_date
  //   ) {
  //     if ((contractDetail?.financial_terms as any)?.schedule) {
  //       const schedule = (contractDetail!.financial_terms as any).schedule;
  //       const contractMilestones = schedule.map((scheduleItem: any) => ({
  //         id: crypto.randomUUID(),
  //         description: scheduleItem.milestone || `Payment milestone ${scheduleItem.id}`,
  //         due_date: formatDateForInput(scheduleItem.due_date),
  //         tasks: [],
  //       }));
  //       setMilestones(contractMilestones);
  //     } else if (contractDetail?.type === "CO_PRODUCING" || contractDetail?.type === "AFFILIATE") {
  //       const generatedMilestones = generateMilestonesFromContract(
  //         contractDetail,
  //         campaignData.start_date,
  //         campaignData.end_date,
  //       );

  //       if (generatedMilestones.length > 0) {
  //         setMilestones(generatedMilestones);
  //       }
  //     }
  //   }
  // };

  const handleTaskMaterialUpload = (milestoneId: string, taskId: string, urls: string[]) => {
    const material_url = urls[0] || "";
    const task = milestones.find((m) => m.id === milestoneId)?.tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(milestoneId, taskId, {
        description: { ...task.description, material_url },
        material_urls: urls,
      });
    }
  };

  const handleTaskMaterialFilesChange = (milestoneId: string, taskId: string, files: File[]) =>
    updateTask(milestoneId, taskId, { materialFiles: files });

  const handleTaskMaterialRemove = (milestoneId: string, taskId: string, removedUrls: string[]) => {
    const task = milestones.find((m) => m.id === milestoneId)?.tasks.find((t) => t.id === taskId);
    if (task) {
      const currentUrls = task.material_urls || [];
      const updatedUrls = currentUrls.filter((url) => !removedUrls.includes(url));

      updateTask(milestoneId, taskId, {
        description: { ...task.description, material_url: updatedUrls[0] || "" },
        material_urls: updatedUrls,
        materialFiles: [],
      });
    }
  };

  // UX: yêu cầu mỗi milestone phải có ít nhất 1 task đầy đủ thông tin
  const isReviewDisabled = React.useMemo(() => {
    if (milestones.length === 0) return true;

    return milestones.some(
      (m) =>
        !m.description?.trim() ||
        !m.due_date ||
        m.tasks.length === 0 ||
        m.tasks.some((t) => !t.name?.trim() || !t.type || !t.deadline),
    );
  }, [milestones]);

  return (
    <div className="pt-6 space-y-6">
      {campaignMode === "contract" && detailLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            <span className="text-sm text-gray-600">Loading contract milestones...</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Milestones & Tasks</h3>
          {campaignMode === "contract" && selectedContract && (
            <p className="text-sm text-gray-600 mt-1">
              Contract: <span className="font-medium">{selectedContract.title}</span>{" "}
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                {campaignType.replace(/_/g, " ")}
              </span>
              {contractDetail && (contractDetail?.financial_terms as any)?.schedule ? (
                <span className="ml-2 text-xs text-green-600">
                  • Milestones from payment schedule
                </span>
              ) : contractDetail &&
                (contractDetail.type === "CO_PRODUCING" || contractDetail.type === "AFFILIATE") ? (
                <span className="ml-2 text-xs text-green-600">
                  • Milestones from payment cycles (
                  {(contractDetail.financial_terms as any)?.profit_distribution_cycle ||
                    (contractDetail.financial_terms as any)?.payment_cycle}
                  )
                </span>
              ) : (
                <span className="ml-2 text-xs text-amber-600">
                  • Manual milestone creation required
                </span>
              )}
            </p>
          )}
          {campaignMode === "internal" && (
            <p className="text-sm text-gray-600 mt-1">
              Internal campaign:{" "}
              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                {campaignType.replace(/_/g, " ")}
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {campaignMode === "internal" && (
            <Button
              onClick={addMilestone}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus size={14} /> Add Milestone
            </Button>
          )}
        </div>
      </div>

      {milestones.map((m, mi) => {
        const milestoneMin =
          mi === 0 ? contractStart : milestones[mi - 1]?.due_date || contractStart;
        const milestoneMax = contractEnd;

        return (
          <Card key={m.id} className="border shadow-sm hover:shadow-md transition">
            <CardHeader className="flex justify-between items-start bg-gray-50/70 p-4">
              <div>
                <CardTitle className="text-base font-semibold">
                  Milestone {mi + 1}
                  {campaignMode === "contract" && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-normal">
                      From Contract
                    </span>
                  )}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  {m.tasks.length} task(s) • Due: {m.due_date || "Not set"}
                  {milestoneMin && (
                    <span className="ml-2">
                      • Period: {milestoneMin} → {m.due_date || contractEnd}
                    </span>
                  )}
                </p>
              </div>
              {campaignMode === "internal" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMilestone(m.id)}
                  className="hover:text-red-600"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-5 p-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    placeholder="Describe this milestone..."
                    value={m.description}
                    onChange={(e) => updateMilestone(m.id, { description: e.target.value })}
                    readOnly={campaignMode === "contract"}
                    className={campaignMode === "contract" ? "bg-gray-50 text-gray-600" : ""}
                  />
                  {campaignMode === "contract" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Milestone description is from contract and cannot be edited.
                    </p>
                  )}
                </div>
                <div>
                  <DatePicker
                    label="Due Date"
                    value={m.due_date}
                    onChange={(date) => updateMilestone(m.id, { due_date: date })}
                    minDate={milestoneMin}
                    maxDate={milestoneMax}
                    disabled={campaignMode === "contract"}
                  />
                  {campaignMode === "contract" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due date is from contract payment schedule.
                    </p>
                  )}
                  {campaignMode === "internal" && milestoneMin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Select date between {milestoneMin} and {contractEnd}
                      {mi > 0 && ` (after milestone ${mi} completion)`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">
                    Tasks{" "}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      (at least 1 per milestone)
                    </span>
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTask(m.id)}
                    className="flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Task
                  </Button>
                </div>

                {m.tasks.map((t, ti) => {
                  const taskMin = milestoneMin;
                  const taskMax = m.due_date || contractEnd;

                  return (
                    <Card key={t.id} className="border border-gray-100 bg-gray-50/70">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex justify-between">
                          <h5 className="text-sm font-medium">Task {ti + 1}</h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(m.id, t.id)}
                            className="hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label>Task Name *</Label>
                            <Input
                              placeholder="Enter task name..."
                              value={t.name}
                              onChange={(e) => updateTask(m.id, t.id, { name: e.target.value })}
                            />
                          </div>

                          <div>
                            <Label>Task Type *</Label>
                            <Select
                              onValueChange={(v) => updateTask(m.id, t.id, { type: v })}
                              value={t.type || undefined}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type..." />
                              </SelectTrigger>
                              <SelectContent>
                                {taskTypeOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <DatePicker
                          label="Deadline *"
                          value={t.deadline}
                          onChange={(date) => updateTask(m.id, t.id, { deadline: date })}
                          minDate={taskMin}
                          maxDate={taskMax}
                        />

                        <div>
                          <Label>Task Description</Label>
                          <Textarea
                            placeholder="Describe what needs to be done..."
                            value={t.description?.description || ""}
                            onChange={(e) =>
                              updateTask(m.id, t.id, {
                                description: {
                                  ...t.description,
                                  description: e.target.value,
                                },
                              })
                            }
                          />
                        </div>

                        {/* Display description_json details if available */}
                        {t.description?.description_json && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                              Task Details from Suggestion
                            </Label>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2 text-xs">
                              {/* Affiliate & Advertising */}
                              {t.type === "CONTENT" &&
                                t.description.description_json.advertised_item_id && (
                                  <>
                                    {t.description.description_json.product_name && (
                                      <p>
                                        <span className="font-medium">Product:</span>{" "}
                                        {t.description.description_json.product_name}
                                      </p>
                                    )}
                                    {t.description.description_json.platform && (
                                      <p>
                                        <span className="font-medium">Platform:</span>{" "}
                                        {t.description.description_json.platform}
                                      </p>
                                    )}
                                    {t.description.description_json.tagline && (
                                      <p>
                                        <span className="font-medium">Tagline:</span>{" "}
                                        {t.description.description_json.tagline}
                                      </p>
                                    )}
                                    {t.description.description_json.creative_notes && (
                                      <p>
                                        <span className="font-medium">Creative Notes:</span>{" "}
                                        {t.description.description_json.creative_notes}
                                      </p>
                                    )}
                                    {t.description.description_json.hashtags &&
                                      t.description.description_json.hashtags.length > 0 && (
                                        <p>
                                          <span className="font-medium">Hashtags:</span>{" "}
                                          {t.description.description_json.hashtags.join(", ")}
                                        </p>
                                      )}
                                    {t.description.description_json.tracking_link && (
                                      <p>
                                        <span className="font-medium">Tracking Link:</span>{" "}
                                        <a
                                          href={t.description.description_json.tracking_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {t.description.description_json.tracking_link}
                                        </a>
                                      </p>
                                    )}
                                  </>
                                )}

                              {/* Co-Production */}
                              {t.type === "PRODUCT" &&
                                t.description.description_json.is_product_creation_task && (
                                  <>
                                    {t.description.description_json.product_name && (
                                      <p>
                                        <span className="font-medium">Product:</span>{" "}
                                        {t.description.description_json.product_name}
                                      </p>
                                    )}
                                    {t.description.description_json.product_description && (
                                      <p>
                                        <span className="font-medium">Description:</span>{" "}
                                        {t.description.description_json.product_description}
                                      </p>
                                    )}
                                    {t.description.description_json.subtasks &&
                                      t.description.description_json.subtasks.length > 0 && (
                                        <div>
                                          <p className="font-medium mb-1">Subtasks:</p>
                                          <ul className="list-disc list-inside ml-2">
                                            {t.description.description_json.subtasks.map(
                                              (subtask: string, idx: number) => (
                                                <li key={idx}>{subtask}</li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                  </>
                                )}

                              {/* Brand Ambassador */}
                              {t.type === "EVENT" && t.description.description_json.event_id && (
                                <>
                                  {t.description.description_json.event_name && (
                                    <p>
                                      <span className="font-medium">Event:</span>{" "}
                                      {t.description.description_json.event_name}
                                    </p>
                                  )}
                                  {t.description.description_json.event_date && (
                                    <p>
                                      <span className="font-medium">Date:</span>{" "}
                                      {t.description.description_json.event_date}
                                    </p>
                                  )}
                                  {t.description.description_json.event_duration && (
                                    <p>
                                      <span className="font-medium">Duration:</span>{" "}
                                      {t.description.description_json.event_duration}
                                    </p>
                                  )}
                                  {t.description.description_json.location && (
                                    <p>
                                      <span className="font-medium">Location:</span>{" "}
                                      {t.description.description_json.location}
                                    </p>
                                  )}
                                  {t.description.description_json.activities &&
                                    t.description.description_json.activities.length > 0 && (
                                      <p>
                                        <span className="font-medium">Activities:</span>{" "}
                                        {t.description.description_json.activities.join(", ")}
                                      </p>
                                    )}
                                  {t.description.description_json.representation_rules &&
                                    t.description.description_json.representation_rules.length >
                                      0 && (
                                      <div>
                                        <p className="font-medium mb-1">Representation Rules:</p>
                                        <ul className="list-disc list-inside ml-2">
                                          {t.description.description_json.representation_rules.map(
                                            (rule: string, idx: number) => (
                                              <li key={idx}>{rule}</li>
                                            ),
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                </>
                              )}

                              {/* KPI Goals (common) */}
                              {t.description.description_json.kpi_goals &&
                                t.description.description_json.kpi_goals.length > 0 && (
                                  <div>
                                    <p className="font-medium mb-1">KPI Goals:</p>
                                    <ul className="list-disc list-inside ml-2">
                                      {t.description.description_json.kpi_goals.map(
                                        (kpi: any, idx: number) => (
                                          <li key={idx}>
                                            {kpi.metric}: {kpi.target}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                        <div>
                          <Label>Task Material (Optional)</Label>
                          <ContractUploader
                            userId={user?.id || ""}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.zip,.rar"
                            multiple={false}
                            maxSize={10}
                            maxFiles={1}
                            allowedTypes={[
                              "pdf",
                              "doc",
                              "docx",
                              "ppt",
                              "pptx",
                              "jpg",
                              "jpeg",
                              "png",
                              "gif",
                              "webp",
                              "mp4",
                              "avi",
                              "mov",
                              "zip",
                              "rar",
                            ]}
                            onFilesChange={(files: File[]) =>
                              handleTaskMaterialFilesChange(m.id, t.id, files)
                            }
                            onUploadComplete={(urls: string[]) =>
                              handleTaskMaterialUpload(m.id, t.id, urls)
                            }
                            onFilesRemove={(removedUrls: string[]) =>
                              handleTaskMaterialRemove(m.id, t.id, removedUrls)
                            }
                            title="Task Material"
                            className="w-full"
                            initialFiles={t.materialFiles || []}
                            initialUrls={t.material_urls || []}
                            context={`task-${t.id}`}
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Upload reference materials, briefs, or assets for this task (Documents,
                            images, videos, archives - max 1 file, up to 10MB)
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Back
        </Button>

        <div className="flex flex-col items-stretch sm:items-end gap-1 order-1 sm:order-2 w-full sm:w-auto">
          <Button
            onClick={onNext}
            type="button"
            disabled={isReviewDisabled}
            className="w-full sm:w-auto"
          >
            Review & Submit
          </Button>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={addTaskModal.open}
        onClose={() => setAddTaskModal({ open: false, milestoneId: null })}
        onAdd={handleAddTask}
        campaignType={campaignType}
        taskTypeOptions={taskTypeOptions}
        milestoneDueDate={
          addTaskModal.milestoneId
            ? milestones.find((m) => m.id === addTaskModal.milestoneId)?.due_date
            : undefined
        }
      />
    </div>
  );
};

export default CreateTask;
