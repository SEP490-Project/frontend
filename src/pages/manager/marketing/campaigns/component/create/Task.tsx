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
import { DatePicker } from "@/components/date-picker";
import { FileUploader } from "@/components/global";
import { Plus, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAppDispatch } from "@/libs/stores";
import { getContractById } from "@/libs/stores/contractManager/thunk";
import { useContract } from "@/libs/hooks/useContract";

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

interface CreateTaskProps {
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  selectedContract: any;
  campaignType: string;
  campaignMode: "contract" | "internal";
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
  onBack,
  onNext,
}) => {
  const taskTypeOptions = getTaskTypeOptions(campaignType);
  const contractStart = formatDateForInput(selectedContract?.start_date);
  const contractEnd = formatDateForInput(selectedContract?.end_date);
  const dispatch = useAppDispatch();
  const { contractDetail, detailLoading } = useContract();
  const [hasLoadedContract, setHasLoadedContract] = React.useState<string | null>(null);

  // Reset flag when campaign mode changes
  React.useEffect(() => {
    if (campaignMode === "internal") {
      setHasLoadedContract(null);
    }
  }, [campaignMode]);

  // Auto-populate milestones from contract financial terms
  React.useEffect(() => {
    if (
      campaignMode === "contract" &&
      selectedContract?.id &&
      hasLoadedContract !== selectedContract.id
    ) {
      // Fetch contract detail to get financial terms
      dispatch(getContractById(selectedContract.id));
      setHasLoadedContract(selectedContract.id);
    }
  }, [dispatch, selectedContract?.id, campaignMode, hasLoadedContract]);

  // Populate milestones from contract financial terms schedule
  React.useEffect(() => {
    if (
      campaignMode === "contract" &&
      contractDetail?.id === selectedContract?.id &&
      (contractDetail?.financial_terms as any)?.schedule &&
      milestones.length === 0 // Only populate if milestones are empty
    ) {
      const schedule = (contractDetail!.financial_terms as any).schedule;
      const contractMilestones = schedule.map((scheduleItem: any) => ({
        id: crypto.randomUUID(),
        description: scheduleItem.milestone || `Payment milestone ${scheduleItem.id}`,
        due_date: formatDateForInput(scheduleItem.due_date),
        tasks: [],
      }));

      setMilestones(contractMilestones);
    }
  }, [contractDetail, selectedContract?.id, campaignMode, milestones.length, setMilestones]);

  console.log("contract selected", selectedContract);
  console.log("contract detail", contractDetail);

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
    const defaultType = taskTypeOptions[0]?.value || "OTHER";
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: [
                ...m.tasks,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  type: defaultType,
                  description: { description: "", material_url: "" },
                  deadline: "",
                  materialFiles: [],
                },
              ],
            }
          : m,
      ),
    );
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

  const handleTaskMaterialUpload = (milestoneId: string, taskId: string, urls: string[]) => {
    const material_url = urls[0] || "";
    const task = milestones.find((m) => m.id === milestoneId)?.tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(milestoneId, taskId, {
        description: { ...task.description, material_url },
      });
    }
  };

  const handleTaskMaterialFilesChange = (milestoneId: string, taskId: string, files: File[]) =>
    updateTask(milestoneId, taskId, { materialFiles: files });

  const handleTaskMaterialRemove = (milestoneId: string, taskId: string) => {
    const task = milestones.find((m) => m.id === milestoneId)?.tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(milestoneId, taskId, {
        description: { ...task.description, material_url: "" },
        materialFiles: [],
      });
    }
  };

  return (
    <div className="pt-6 space-y-6">
      {/* Loading State */}
      {campaignMode === "contract" && detailLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            <span className="text-sm text-gray-600">Loading contract milestones...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Milestones & Tasks</h3>
          {campaignMode === "contract" && selectedContract && (
            <p className="text-sm text-gray-600 mt-1">
              Contract: <span className="font-medium">{selectedContract.title}</span>{" "}
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                {campaignType.replace(/_/g, " ")}
              </span>
              <span className="ml-2 text-xs text-green-600">
                • Milestones auto-populated from contract
              </span>
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

      {/* Milestones */}
      {milestones.map((m, mi) => {
        const milestoneMin = contractStart;
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
              {/* Milestone fields */}
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
                </div>
              </div>

              {/* Tasks */}
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Tasks</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addTask(m.id)}
                    className="text-blue-600"
                  >
                    <Plus size={12} /> Add Task
                  </Button>
                </div>

                {m.tasks.map((t, ti) => {
                  const taskMin = contractStart;
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

                        <div>
                          <Label>Material Upload (Optional)</Label>
                          <FileUploader
                            userId="demo"
                            multiple={false}
                            maxFiles={1}
                            onFilesChange={(files) =>
                              handleTaskMaterialFilesChange(m.id, t.id, files)
                            }
                            onUploadComplete={(urls) => handleTaskMaterialUpload(m.id, t.id, urls)}
                            onFilesRemove={() => handleTaskMaterialRemove(m.id, t.id)}
                          />
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

      {/* Footer Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={
            milestones.length === 0 ||
            milestones.some(
              (m) =>
                !m.description ||
                !m.due_date ||
                m.tasks.some((t) => !t.name || !t.type || !t.deadline),
            )
          }
        >
          Review & Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateTask;
