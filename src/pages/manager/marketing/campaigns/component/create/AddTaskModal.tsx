import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { ContractUploader } from "@/components/global";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/libs/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { format, parseISO } from "date-fns";

interface KPIGoal {
  metric: string;
  target: string;
  description?: string;
}

interface TaskDescriptionJson {
  // Advertising/Affiliate
  advertised_item_id?: number;
  product_name?: string;
  platform?: string;
  tagline?: string;
  creative_notes?: string;
  hashtags?: string[];
  kpi_goals?: KPIGoal[];
  material_urls?: string[];
  is_affiliate_content?: boolean;
  tracking_link?: string;

  // Brand Ambassador (Event)
  event_id?: number;
  event_name?: string;
  event_date?: string;
  event_duration?: string;
  location?: string;
  activities?: string[];
  representation_rules?: string[];

  // Co-Producing (Product)
  is_product_creation_task?: boolean;
  product_id?: number;
  product_description?: string;
  subtasks?: string[];
  materials?: string[];
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

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
  campaignType: string;
  taskTypeOptions: { value: string; label: string }[];
  milestoneDueDate?: string;
}

const formatDateForInput = (dateString?: string | null) => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "yyyy-MM-dd");
  } catch {
    return "";
  }
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onAdd,
  campaignType,
  taskTypeOptions,
  milestoneDueDate,
}) => {
  const defaultType = taskTypeOptions[0]?.value || "OTHER";
  const { user } = useAuth();
  const [taskData, setTaskData] = useState<Task>({
    id: crypto.randomUUID(),
    name: "",
    type: defaultType,
    description: {
      description: "",
      material_url: "",
      description_json: {},
    },
    deadline: "",
    materialFiles: [],
    material_urls: [],
  });

  const [kpiGoals, setKpiGoals] = useState<KPIGoal[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [representationRules, setRepresentationRules] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);

  React.useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setTaskData({
        id: crypto.randomUUID(),
        name: "",
        type: defaultType,
        description: {
          description: "",
          material_url: "",
          description_json: {},
        },
        deadline: "",
        materialFiles: [],
        material_urls: [],
      });
      setKpiGoals([]);
      setHashtags([]);
      setActivities([]);
      setRepresentationRules([]);
      setSubtasks([]);
      setMaterials([]);
      setFormData({});
    }
  }, [open, defaultType]);

  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = () => {
    const descriptionJson: TaskDescriptionJson = {};

    // Common fields
    if (kpiGoals.length > 0) {
      descriptionJson.kpi_goals = kpiGoals;
    }

    if (taskData.material_urls && taskData.material_urls.length > 0) {
      descriptionJson.material_urls = taskData.material_urls;
    }

    // Type-specific fields based on campaign type and task type
    if (
      (campaignType === "ADVERTISING" || campaignType === "AFFILIATE") &&
      taskData.type === "CONTENT"
    ) {
      // Advertising/Affiliate Content Task
      if (formData.advertised_item_id) {
        descriptionJson.advertised_item_id = Number(formData.advertised_item_id);
      }
      if (formData.product_name) {
        descriptionJson.product_name = formData.product_name;
      }
      if (formData.platform) {
        descriptionJson.platform = formData.platform;
      }
      if (formData.tagline) {
        descriptionJson.tagline = formData.tagline;
      }
      if (formData.creative_notes) {
        descriptionJson.creative_notes = formData.creative_notes;
      }
      if (hashtags.length > 0) {
        descriptionJson.hashtags = hashtags;
      }
      if (campaignType === "AFFILIATE") {
        descriptionJson.is_affiliate_content = true;
        if (formData.tracking_link) {
          descriptionJson.tracking_link = formData.tracking_link;
        }
      }
    } else if (campaignType === "BRAND_AMBASSADOR" && taskData.type === "EVENT") {
      // Brand Ambassador Event Task
      if (formData.event_id) {
        descriptionJson.event_id = Number(formData.event_id);
      }
      if (formData.event_name) {
        descriptionJson.event_name = formData.event_name;
      }
      if (formData.event_date) {
        descriptionJson.event_date = formData.event_date;
      }
      if (formData.event_duration) {
        descriptionJson.event_duration = formData.event_duration;
      }
      if (formData.location) {
        descriptionJson.location = formData.location;
      }
      if (activities.length > 0) {
        descriptionJson.activities = activities;
      }
      if (representationRules.length > 0) {
        descriptionJson.representation_rules = representationRules;
      }
    } else if (campaignType === "CO_PRODUCING" && taskData.type === "PRODUCT") {
      // Co-Producing Product Task
      descriptionJson.is_product_creation_task = true;
      if (formData.product_id) {
        descriptionJson.product_id = Number(formData.product_id);
      }
      if (formData.product_name) {
        descriptionJson.product_name = formData.product_name;
      }
      if (formData.product_description) {
        descriptionJson.product_description = formData.product_description;
      }
      if (subtasks.length > 0) {
        descriptionJson.subtasks = subtasks;
      }
      if (materials.length > 0) {
        descriptionJson.materials = materials;
      }
    }

    const finalTask: Task = {
      ...taskData,
      description: {
        ...taskData.description,
        description_json: descriptionJson,
      },
    };

    onAdd(finalTask);
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addKPIGoal = () => {
    setKpiGoals([...kpiGoals, { metric: "", target: "", description: "" }]);
  };

  const removeKPIGoal = (index: number) => {
    setKpiGoals(kpiGoals.filter((_, i) => i !== index));
  };

  const updateKPIGoal = (index: number, field: keyof KPIGoal, value: string) => {
    const updated = [...kpiGoals];
    updated[index] = { ...updated[index], [field]: value };
    setKpiGoals(updated);
  };

  const addStringItem = (
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    if (value.trim()) {
      setItems([...items, value.trim()]);
    }
  };

  const removeStringItem = (
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleMaterialUpload = (urls: string[]) => {
    setTaskData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        material_url: urls[0] || "",
      },
      material_urls: urls,
    }));
  };

  const handleMaterialFilesChange = (files: File[]) => {
    setTaskData((prev) => ({ ...prev, materialFiles: files }));
  };

  const handleMaterialRemove = (removedUrls: string[]) => {
    const updatedUrls = (taskData.material_urls || []).filter((url) => !removedUrls.includes(url));
    setTaskData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        material_url: updatedUrls[0] || "",
      },
      material_urls: updatedUrls,
      materialFiles: [],
    }));
  };

  const renderTypeSpecificFields = () => {
    if (
      (campaignType === "ADVERTISING" || campaignType === "AFFILIATE") &&
      taskData.type === "CONTENT"
    ) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Advertised Item ID</Label>
              <Input
                type="number"
                placeholder="Enter item ID"
                value={formData.advertised_item_id || ""}
                onChange={(e) => updateFormData("advertised_item_id", e.target.value)}
              />
            </div>
            <div>
              <Label>Product Name</Label>
              <Input
                placeholder="Enter product name"
                value={formData.product_name || ""}
                onChange={(e) => updateFormData("product_name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Platform</Label>
              <Select
                value={formData.platform || ""}
                onValueChange={(value) => updateFormData("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FACEBOOK">Facebook</SelectItem>
                  <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                  <SelectItem value="TIKTOK">TikTok</SelectItem>
                  <SelectItem value="YOUTUBE">YouTube</SelectItem>
                  <SelectItem value="TWITTER">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                placeholder="Enter tagline"
                value={formData.tagline || ""}
                onChange={(e) => updateFormData("tagline", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Creative Notes</Label>
            <Textarea
              placeholder="Enter creative notes..."
              value={formData.creative_notes || ""}
              onChange={(e) => updateFormData("creative_notes", e.target.value)}
            />
          </div>

          {campaignType === "AFFILIATE" && (
            <div>
              <Label>Tracking Link</Label>
              <Input
                placeholder="Enter affiliate tracking link"
                value={formData.tracking_link || ""}
                onChange={(e) => updateFormData("tracking_link", e.target.value)}
              />
            </div>
          )}

          <div>
            <Label>Hashtags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add hashtag..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      addStringItem(hashtags, setHashtags, value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.querySelector(
                    "input[placeholder='Add hashtag...']",
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    addStringItem(hashtags, setHashtags, input.value);
                    input.value = "";
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeStringItem(hashtags, setHashtags, index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (campaignType === "BRAND_AMBASSADOR" && taskData.type === "EVENT") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Event ID</Label>
              <Input
                type="number"
                placeholder="Enter event ID"
                value={formData.event_id || ""}
                onChange={(e) => updateFormData("event_id", e.target.value)}
              />
            </div>
            <div>
              <Label>Event Name</Label>
              <Input
                placeholder="Enter event name"
                value={formData.event_name || ""}
                onChange={(e) => updateFormData("event_name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Event Date</Label>
              <DatePicker
                value={formData.event_date || ""}
                onChange={(date) => updateFormData("event_date", date)}
                placeholder="Select event date"
              />
            </div>
            <div>
              <Label>Event Duration</Label>
              <Input
                placeholder="e.g., 2 hours"
                value={formData.event_duration || ""}
                onChange={(e) => updateFormData("event_duration", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <Input
              placeholder="Enter event location"
              value={formData.location || ""}
              onChange={(e) => updateFormData("location", e.target.value)}
            />
          </div>

          <div>
            <Label>Activities</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add activity..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      addStringItem(activities, setActivities, value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.querySelector(
                    "input[placeholder='Add activity...']",
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    addStringItem(activities, setActivities, input.value);
                    input.value = "";
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {activities.map((activity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {activity}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeStringItem(activities, setActivities, index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Representation Rules</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add representation rule..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      addStringItem(representationRules, setRepresentationRules, value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.querySelector(
                    "input[placeholder='Add representation rule...']",
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    addStringItem(representationRules, setRepresentationRules, input.value);
                    input.value = "";
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {representationRules.map((rule, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {rule}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() =>
                      removeStringItem(representationRules, setRepresentationRules, index)
                    }
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (campaignType === "CO_PRODUCING" && taskData.type === "PRODUCT") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product ID</Label>
              <Input
                type="number"
                placeholder="Enter product ID"
                value={formData.product_id || ""}
                onChange={(e) => updateFormData("product_id", e.target.value)}
              />
            </div>
            <div>
              <Label>Product Name</Label>
              <Input
                placeholder="Enter product name"
                value={formData.product_name || ""}
                onChange={(e) => updateFormData("product_name", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Product Description</Label>
            <Textarea
              placeholder="Describe the product..."
              value={formData.product_description || ""}
              onChange={(e) => updateFormData("product_description", e.target.value)}
            />
          </div>

          <div>
            <Label>Subtasks</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add subtask..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      addStringItem(subtasks, setSubtasks, value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.querySelector(
                    "input[placeholder='Add subtask...']",
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    addStringItem(subtasks, setSubtasks, input.value);
                    input.value = "";
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {subtasks.map((subtask, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {subtask}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeStringItem(subtasks, setSubtasks, index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Materials</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add material..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) {
                      addStringItem(materials, setMaterials, value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.querySelector(
                    "input[placeholder='Add material...']",
                  ) as HTMLInputElement;
                  if (input?.value.trim()) {
                    addStringItem(materials, setMaterials, input.value);
                    input.value = "";
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {materials.map((material, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {material}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeStringItem(materials, setMaterials, index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const isFormValid = taskData.name.trim() && taskData.type && taskData.deadline;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <form id="task-form" className="space-y-6">
          {/* Basic Task Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Task Name *</Label>
              <Input
                value={taskData.name}
                onChange={(e) => setTaskData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter task name"
              />
            </div>
            <div>
              <Label>Task Type *</Label>
              <Select
                value={taskData.type}
                onValueChange={(value) => setTaskData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
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

          <div>
            <Label>Task Description</Label>
            <Textarea
              value={taskData.description.description}
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  description: { ...prev.description, description: e.target.value },
                }))
              }
              placeholder="Enter task description..."
            />
          </div>

          <div>
            <Label>Deadline *</Label>
            <DatePicker
              value={taskData.deadline}
              onChange={(date) => setTaskData((prev) => ({ ...prev, deadline: date }))}
              placeholder="Select task deadline"
              required
              maxDate={milestoneDueDate ? formatDateForInput(milestoneDueDate) : undefined}
            />
          </div>

          {/* KPI Goals */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-base font-semibold">KPI Goals</Label>
                <Button type="button" variant="outline" size="sm" onClick={addKPIGoal}>
                  <Plus className="w-4 h-4 mr-1" /> Add KPI
                </Button>
              </div>

              <div className="space-y-3">
                {kpiGoals.map((kpi, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-sm">Metric</Label>
                      <Input
                        value={kpi.metric}
                        onChange={(e) => updateKPIGoal(index, "metric", e.target.value)}
                        placeholder="e.g., reach, engagement"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm">Target</Label>
                      <Input
                        value={kpi.target}
                        onChange={(e) => updateKPIGoal(index, "target", e.target.value)}
                        placeholder="e.g., 10000, 5%"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm">Description</Label>
                      <Input
                        value={kpi.description || ""}
                        onChange={(e) => updateKPIGoal(index, "description", e.target.value)}
                        placeholder="Optional description"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeKPIGoal(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Type-specific fields */}
          {renderTypeSpecificFields()}

          {/* Materials Upload */}
          <div>
            <Label>Materials</Label>
            <ContractUploader
              userId={user?.id || ""}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.avi,.mov,.zip,.rar"
              multiple={true}
              maxSize={10}
              maxFiles={5}
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
              onFilesChange={handleMaterialFilesChange}
              onUploadComplete={handleMaterialUpload}
              onFilesRemove={handleMaterialRemove}
              title="Task Materials"
              className="w-full"
              initialFiles={taskData.materialFiles || []}
              initialUrls={taskData.material_urls || []}
              context={`add-task-${taskData.id}`}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
