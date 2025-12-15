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
import { useAuth } from "@/libs/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText, Target, Hash, Calendar, Users, CheckSquare } from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  CompactKPISelector,
  DynamicListInput,
} from "@/pages/manager/marketing/contracts/component/create/shared/SharedComponents";
import type { KPI } from "@/pages/manager/marketing/contracts/component/create/types/scopeTypes";
import AddressSelector from "@/components/global/AddressSelector";
import DateTimePicker from "@/components/date-time-picker";
import DurationPicker from "@/components/duration-picker";

interface TaskDescriptionJson {
  // Advertising/Affiliate
  advertised_item_id?: number;
  name?: string; // Advertised item name
  product_name?: string;
  platform?: string;
  tagline?: string;
  creative_notes?: string;
  hashtags?: string[];
  kpi_goals?: KPI[];
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

  // Co-Producing (Product & Concept)
  is_product_creation_task?: boolean;
  product_id?: number;
  product_description?: string;
  subtasks?: string[];
  materials?: string[];

  // Concept fields
  concept_id?: number;
  concept_name?: string;
  concept_description?: string;
  related_product_id?: number;
  related_product_name?: string;
}

// Interface for suggested task data from API
interface SuggestedTaskData {
  name: string;
  type: string;
  deadline: string;
  description: TaskDescriptionJson;
  scope_of_work_item_id?: string;
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

// Interface for suggested task data from API
interface SuggestedTaskData {
  name: string;
  type: string;
  deadline: string;
  description: TaskDescriptionJson;
  scope_of_work_item_id?: string;
}

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
  campaignType: string;
  taskTypeOptions: { value: string; label: string }[];
  milestoneDueDate?: string;
  suggestedTaskData?: SuggestedTaskData; // Data from campaign suggestion
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
  suggestedTaskData,
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

  const [kpiGoals, setKpiGoals] = useState<KPI[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [representationRules, setRepresentationRules] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [freeformDescription, setFreeformDescription] = useState<string>("");

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
      setFreeformDescription("");
      setFormData({});
    }
  }, [open, defaultType]);

  // Populate data from suggestion when available
  React.useEffect(() => {
    if (open && suggestedTaskData) {
      const data = suggestedTaskData;
      const desc = data.description || {};

      // Set basic task info
      setTaskData((prev) => ({
        ...prev,
        name: data.name || "",
        type: data.type || defaultType,
        deadline: formatDateForInput(data.deadline),
      }));

      // Set KPI goals
      if (desc.kpi_goals && Array.isArray(desc.kpi_goals)) {
        setKpiGoals(desc.kpi_goals);
      }

      // Set material URLs and materials
      if (desc.material_urls && Array.isArray(desc.material_urls)) {
        setTaskData((prev) => ({
          ...prev,
          material_urls: desc.material_urls,
          description: {
            ...prev.description,
            material_url: desc.material_urls?.[0] || "",
          },
        }));
      }

      // Handle materials array (for CO_PRODUCING)
      if (desc.materials && Array.isArray(desc.materials)) {
        setMaterials(desc.materials);
        setTaskData((prev) => ({
          ...prev,
          material_urls: desc.materials,
          description: {
            ...prev.description,
            material_url: desc.materials?.[0] || "",
          },
        }));
      }

      // Set hashtags
      if (desc.hashtags && Array.isArray(desc.hashtags)) {
        setHashtags(desc.hashtags);
      }

      // Type-specific population based on campaign type and task type
      if (
        (campaignType === "ADVERTISING" || campaignType === "AFFILIATE") &&
        data.type === "CONTENT"
      ) {
        // Advertising/Affiliate Content Task
        const formUpdates: any = {};
        if (desc.advertised_item_id) formUpdates.advertised_item_id = desc.advertised_item_id;
        if (desc.name || desc.product_name)
          formUpdates.advertised_item_name = desc.name || desc.product_name;
        if (desc.product_name) formUpdates.product_name = desc.product_name;
        if (desc.platform) formUpdates.platform = desc.platform;
        if (desc.tagline) formUpdates.tagline = desc.tagline;
        if (desc.creative_notes) formUpdates.creative_notes = desc.creative_notes;
        if (desc.tracking_link) formUpdates.tracking_link = desc.tracking_link;
        setFormData(formUpdates);

        // Set description to creative notes or general description
        setFreeformDescription(desc.creative_notes || "");
      } else if (campaignType === "BRAND_AMBASSADOR" && data.type === "EVENT") {
        // Brand Ambassador Event Task
        const formUpdates: any = {};
        if (desc.event_id) formUpdates.event_id = desc.event_id;
        if (desc.event_name) formUpdates.event_name = desc.event_name;
        if (desc.event_date) {
          // Handle both "2025-12-22 00:30:00" and ISO formats
          const dateStr = desc.event_date.includes(" ")
            ? desc.event_date.split(" ")[0]
            : desc.event_date;
          formUpdates.event_date = formatDateForInput(dateStr);
        }
        if (desc.event_duration) formUpdates.event_duration = desc.event_duration;
        if (desc.location) formUpdates.location = desc.location;
        setFormData(formUpdates);

        if (desc.activities && Array.isArray(desc.activities)) {
          setActivities(desc.activities);
        }
        if (desc.representation_rules && Array.isArray(desc.representation_rules)) {
          setRepresentationRules(desc.representation_rules);
        }

        // Set description to event name
        setFreeformDescription(desc.event_name || "");
      } else if (campaignType === "CO_PRODUCING" && data.type === "PRODUCT") {
        // Co-Producing Product Task
        const formUpdates: any = {};
        if (desc.product_id) formUpdates.product_id = desc.product_id;
        if (desc.product_name) formUpdates.product_name = desc.product_name;
        if (desc.product_description) formUpdates.product_description = desc.product_description;
        setFormData(formUpdates);

        if (desc.subtasks && Array.isArray(desc.subtasks)) {
          setSubtasks(desc.subtasks);
        }

        // Set description to product description
        setFreeformDescription(desc.product_description || "");
      } else if (campaignType === "CO_PRODUCING" && data.type === "CONTENT") {
        // Co-Producing Concept Task (marketing concept)
        const formUpdates: any = {};
        if (desc.concept_id) formUpdates.concept_id = desc.concept_id;
        if (desc.concept_name) formUpdates.concept_name = desc.concept_name;
        if (desc.concept_description) formUpdates.concept_description = desc.concept_description;
        if (desc.related_product_id) formUpdates.related_product_id = desc.related_product_id;
        if (desc.related_product_name) formUpdates.related_product_name = desc.related_product_name;
        if (desc.platform) formUpdates.platform = desc.platform;
        setFormData(formUpdates);

        // Set description to concept description
        setFreeformDescription(desc.concept_description || "");
      }
    }
  }, [open, suggestedTaskData, campaignType, defaultType]);

  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      if (formData.advertised_item_name) {
        descriptionJson.name = formData.advertised_item_name;
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
    } else if (campaignType === "CO_PRODUCING" && taskData.type === "CONTENT") {
      // Co-Producing Content/Concept Task
      descriptionJson.is_product_creation_task = false;
      if (formData.concept_id) {
        descriptionJson.concept_id = Number(formData.concept_id);
      }
      if (formData.concept_name) {
        descriptionJson.concept_name = formData.concept_name;
      }
      if (formData.concept_description) {
        descriptionJson.concept_description = formData.concept_description;
      }
      if (formData.related_product_id) {
        descriptionJson.related_product_id = Number(formData.related_product_id);
      }
      if (formData.related_product_name) {
        descriptionJson.related_product_name = formData.related_product_name;
      }
      if (formData.platform) {
        descriptionJson.platform = formData.platform;
      }
      if (hashtags.length > 0) {
        descriptionJson.hashtags = hashtags;
      }
      if (materials.length > 0) {
        descriptionJson.materials = materials;
      }
    }

    const finalTask: Task = {
      ...taskData,
      description: {
        ...taskData.description,
        description: freeformDescription || taskData.description.description,
        description_json: descriptionJson,
      },
    };

    onAdd(finalTask);
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    // Keep suggested materials separate from uploaded ones
    // No need to clear materials array now since they're displayed separately
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

    // Keep suggested materials separate - don't remove them when removing uploaded files
  };

  const renderTypeSpecificFields = () => {
    if (
      (campaignType === "ADVERTISING" || campaignType === "AFFILIATE") &&
      taskData.type === "CONTENT"
    ) {
      return (
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {campaignType === "AFFILIATE" ? "Affiliate" : "Advertising"} Content Details
                </h3>
                <p className="text-sm text-gray-600">Configure content-specific parameters</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Advertised Item ID
                </Label>
                <Input
                  type="number"
                  placeholder="Enter item ID"
                  value={formData.advertised_item_id || ""}
                  onChange={(e) => updateFormData("advertised_item_id", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Advertised Item Name
                </Label>
                <Input
                  placeholder="Enter advertised item name"
                  value={formData.advertised_item_name || ""}
                  onChange={(e) => updateFormData("advertised_item_name", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Product Name
              </Label>
              <Input
                placeholder="Enter product name (if different from item name)"
                value={formData.product_name || ""}
                onChange={(e) => updateFormData("product_name", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Use if the product name differs from the advertised item name
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Platform</Label>
                <Select
                  value={formData.platform || ""}
                  onValueChange={(value) => updateFormData("platform", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEBSITE">Website</SelectItem>
                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                    <SelectItem value="TIKTOK">TikTok</SelectItem>
                    <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                    <SelectItem value="YOUTUBE">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Tagline</Label>
                <Input
                  placeholder="Enter catchy tagline"
                  value={formData.tagline || ""}
                  onChange={(e) => updateFormData("tagline", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Creative Notes
              </Label>
              <Textarea
                rows={4}
                placeholder="Provide detailed creative direction, style preferences, tone of voice, visual elements, etc..."
                value={formData.creative_notes || ""}
                onChange={(e) => updateFormData("creative_notes", e.target.value)}
                className="resize-none"
              />
            </div>

            {campaignType === "AFFILIATE" && (
              <div>
                <Label className="text-sm font-medium">Tracking Link</Label>
                <Input
                  placeholder="https://affiliate-tracking-url.com"
                  value={formData.tracking_link || ""}
                  onChange={(e) => updateFormData("tracking_link", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for affiliate performance tracking
                </p>
              </div>
            )}

            <DynamicListInput
              label="Hashtags"
              items={hashtags}
              placeholder="Enter hashtag (without #)..."
              icon={<Hash className="w-4 h-4" />}
              onChange={setHashtags}
              helpText="Add relevant hashtags for social media content. Don't include the # symbol."
              addLabel="Add Hashtag"
            />
          </CardContent>
        </Card>
      );
    }

    if (campaignType === "BRAND_AMBASSADOR" && taskData.type === "EVENT") {
      return (
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Brand Ambassador Event Details
                </h3>
                <p className="text-sm text-gray-600">Configure event-specific parameters</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Event ID
                </Label>
                <Input
                  type="number"
                  placeholder="Enter event ID"
                  value={formData.event_id || ""}
                  onChange={(e) => updateFormData("event_id", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Event Name
                </Label>
                <Input
                  placeholder="Enter event name"
                  value={formData.event_name || ""}
                  onChange={(e) => updateFormData("event_name", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <DateTimePicker
                  label="Date & Time"
                  value={formData.event_date || ""}
                  onChange={(dateTime) => updateFormData("event_date", dateTime)}
                  placeholder="Select event date and time"
                  className="bg-white"
                />
              </div>
              <div>
                <DurationPicker
                  label="Expected Duration"
                  value={formData.event_duration || ""}
                  onChange={(duration) => updateFormData("event_duration", duration)}
                  placeholder="Select duration"
                  maxHours={8}
                  className="bg-white"
                />
              </div>
            </div>

            <div>
              <AddressSelector
                label="Location"
                placeholder="Search for event address..."
                value={formData.location || ""}
                onChange={(address) => updateFormData("location", address)}
              />
            </div>

            <DynamicListInput
              label="Activities"
              items={activities}
              placeholder="Describe an activity or task for the event..."
              icon={<CheckSquare className="w-4 h-4" />}
              onChange={setActivities}
              helpText="List specific activities, performances, or tasks to be completed during the event."
              multiline={true}
              addLabel="Add Activity"
            />

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Representation Rules
              </Label>
              <Textarea
                rows={5}
                placeholder={
                  "Enter detailed representation guidelines, such as:\n\n• Dress code and appearance requirements\n• Brand messaging and talking points\n• Prohibited behaviors or activities\n• Social media posting guidelines\n• Interaction protocols with attendees"
                }
                value={representationRules.join("\n") || ""}
                onChange={(e) =>
                  setRepresentationRules(e.target.value.split("\n").filter((rule) => rule.trim()))
                }
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter each rule on a separate line. These guidelines ensure consistent brand
                representation.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (
      campaignType === "CO_PRODUCING" &&
      (taskData.type === "PRODUCT" || taskData.type === "CONTENT")
    ) {
      return (
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 p-2 rounded-lg">
                <CheckSquare className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Co-Producing {taskData.type === "CONTENT" ? "Concept" : "Product"} Details
                </h3>
                <p className="text-sm text-gray-600">
                  Configure{" "}
                  {taskData.type === "CONTENT" ? "concept development" : "product creation"}{" "}
                  parameters
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {taskData.type === "PRODUCT" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Product ID
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter product ID"
                    value={formData.product_id || ""}
                    onChange={(e) => updateFormData("product_id", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Product Name
                  </Label>
                  <Input
                    placeholder="Enter product name"
                    value={formData.product_name || ""}
                    onChange={(e) => updateFormData("product_name", e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Concept ID
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter concept ID"
                      value={formData.concept_id || ""}
                      onChange={(e) => updateFormData("concept_id", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Concept Name
                    </Label>
                    <Input
                      placeholder="Enter concept name"
                      value={formData.concept_name || ""}
                      onChange={(e) => updateFormData("concept_name", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Related Product ID
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter related product ID"
                      value={formData.related_product_id || ""}
                      onChange={(e) => updateFormData("related_product_id", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Related Product Name
                    </Label>
                    <Input
                      placeholder="Enter related product name"
                      value={formData.related_product_name || ""}
                      onChange={(e) => updateFormData("related_product_name", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Platform</Label>
                  <Select
                    value={formData.platform || ""}
                    onValueChange={(value) => updateFormData("platform", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEBSITE">Website</SelectItem>
                      <SelectItem value="FACEBOOK">Facebook</SelectItem>
                      <SelectItem value="TIKTOK">TikTok</SelectItem>
                      <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                      <SelectItem value="YOUTUBE">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {taskData.type === "CONTENT" ? "Concept Description" : "Product Description"}
              </Label>
              <Textarea
                rows={4}
                placeholder={
                  taskData.type === "CONTENT"
                    ? "Describe the concept, creative direction, brand positioning, messaging strategy, etc..."
                    : "Provide detailed product description, features, specifications, target audience, etc..."
                }
                value={
                  taskData.type === "CONTENT"
                    ? formData.concept_description || ""
                    : formData.product_description || ""
                }
                onChange={(e) =>
                  updateFormData(
                    taskData.type === "CONTENT" ? "concept_description" : "product_description",
                    e.target.value,
                  )
                }
                className="resize-none"
              />
            </div>

            {taskData.type === "CONTENT" && (
              <DynamicListInput
                label="Hashtags"
                items={hashtags}
                placeholder="Enter hashtag (without #)..."
                icon={<Hash className="w-4 h-4" />}
                onChange={setHashtags}
                helpText="Add relevant hashtags for the concept's social media presence."
                addLabel="Add Hashtag"
              />
            )}

            {taskData.type === "PRODUCT" && (
              <DynamicListInput
                label="Subtasks"
                items={subtasks}
                placeholder="Describe a specific subtask or milestone..."
                icon={<CheckSquare className="w-4 h-4" />}
                onChange={setSubtasks}
                helpText="Break down the product creation process into manageable subtasks and milestones."
                multiline={true}
                addLabel="Add Subtask"
              />
            )}
          </CardContent>
        </Card>
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

        <div id="task-form" className="space-y-6">
          {/* Basic Task Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Basic Task Information</h3>
                  <p className="text-sm text-gray-600">Essential task details and timeline</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Task Name *</Label>
                  <Input
                    value={taskData.name}
                    onChange={(e) => setTaskData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter descriptive task name"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Task Type *</Label>
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
                <Label className="text-sm font-medium">Basic Task Description</Label>
                <Textarea
                  rows={3}
                  value={taskData.description.description}
                  onChange={(e) =>
                    setTaskData((prev) => ({
                      ...prev,
                      description: { ...prev.description, description: e.target.value },
                    }))
                  }
                  placeholder="Provide a brief overview of the task requirements..."
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use this field for basic task information. Detailed specifications will be
                  configured below.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline *
                </Label>
                <DatePicker
                  value={taskData.deadline}
                  onChange={(date) => setTaskData((prev) => ({ ...prev, deadline: date }))}
                  placeholder="Select task deadline"
                  required
                  maxDate={milestoneDueDate ? formatDateForInput(milestoneDueDate) : undefined}
                />
                {milestoneDueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Task deadline must be before milestone due date:{" "}
                    {formatDateForInput(milestoneDueDate)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* KPI Goals */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <CompactKPISelector
                kpis={kpiGoals}
                onChange={setKpiGoals}
                contractType={
                  campaignType === "CO_PRODUCING" && taskData.type === "CONTENT"
                    ? "ADVERTISING" // Use ADVERTISING metrics for CO_PRODUCING CONTENT (concept)
                    : campaignType
                }
                requiredMetrics={campaignType === "AFFILIATE" ? ["click_through"] : []}
              />
            </CardContent>
          </Card>

          {/* Type-specific fields */}
          {renderTypeSpecificFields()}

          {/* Additional Notes */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Additional Notes
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Add any additional instructions, requirements, or context that doesn't fit in the
                categories above.
              </p>
              <Textarea
                rows={4}
                placeholder="Enter any additional notes, special requirements, or context for this task..."
                value={freeformDescription}
                onChange={(e) => setFreeformDescription(e.target.value)}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Materials Upload */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Task Materials & Resources (Optional)
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                Upload reference materials, guidelines, assets, or any files needed to complete this
                task. Suggested materials from the campaign will also appear here.
              </p>

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
                title="Upload Additional Materials"
                className="w-full"
                initialFiles={taskData.materialFiles || []}
                initialUrls={taskData.material_urls || []}
                context={`add-task-${taskData.id}`}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit()} disabled={!isFormValid}>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
