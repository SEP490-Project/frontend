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
import AddressSelector from "@/components/global/AddressSelector";
import DateTimePicker from "@/components/date-time-picker";
import DurationPicker from "@/components/duration-picker";

interface KPIGoal {
  metric: string;
  target: string;
  description?: string;
}

interface TaskDescriptionJson {
  // Advertising/Affiliate
  advertised_item_id?: number;
  name?: string; // Advertised item name
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
  suggestedTaskData?: any; // Data from campaign suggestion
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

  const [kpiGoals, setKpiGoals] = useState<KPIGoal[]>([]);
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
      const populateFromSuggestion = (data: any) => {
        // Populate basic task info if available
        if (data.name) {
          setTaskData((prev) => ({ ...prev, name: data.name }));
        }

        // Populate based on campaign type and task structure from JSON
        if (campaignType === "ADVERTISING" || campaignType === "AFFILIATE") {
          const adData = data.advertised_item || data;
          if (adData) {
            const formUpdates: any = {};
            if (adData.advertised_item_id || adData.id)
              formUpdates.advertised_item_id = adData.advertised_item_id || adData.id;
            if (adData.name) formUpdates.advertised_item_name = adData.name;
            if (adData.platform) formUpdates.platform = adData.platform;
            if (adData.tagline) formUpdates.tagline = adData.tagline;
            if (adData.creative_notes) formUpdates.creative_notes = adData.creative_notes;
            if (adData.tracking_link) formUpdates.tracking_link = adData.tracking_link;
            setFormData(formUpdates);

            if (adData.hashtags && Array.isArray(adData.hashtags)) {
              setHashtags(adData.hashtags);
            }
            if (adData.kpi_goals && Array.isArray(adData.kpi_goals)) {
              setKpiGoals(adData.kpi_goals);
            }
            if (adData.materials && Array.isArray(adData.materials)) {
              setMaterials(adData.materials);
            } else if (adData.material_urls && Array.isArray(adData.material_urls)) {
              setMaterials(adData.material_urls);
            }
          }
        } else if (campaignType === "BRAND_AMBASSADOR") {
          // For Brand Ambassador, the data structure is different - look for description_json first
          const eventData = data.description_json || data.brand_ambassador || data;
          if (eventData) {
            const formUpdates: any = {};
            if (eventData.event_id) formUpdates.event_id = eventData.event_id;
            if (eventData.event_name) formUpdates.event_name = eventData.event_name;
            if (eventData.event_date) formUpdates.event_date = eventData.event_date;
            if (eventData.event_duration) formUpdates.event_duration = eventData.event_duration;
            if (eventData.location) formUpdates.location = eventData.location;
            setFormData(formUpdates);

            if (eventData.activities && Array.isArray(eventData.activities)) {
              setActivities(eventData.activities);
            }
            if (eventData.representation_rules && Array.isArray(eventData.representation_rules)) {
              setRepresentationRules(eventData.representation_rules);
            }
            if (eventData.kpi_goals && Array.isArray(eventData.kpi_goals)) {
              setKpiGoals(eventData.kpi_goals);
            }
            // For Brand Ambassador, materials might not be present in the suggestion
            // Only set materials if they exist - keep them separate from uploaded files
            if (eventData.materials && Array.isArray(eventData.materials)) {
              setMaterials(eventData.materials);
            } else if (eventData.material_urls && Array.isArray(eventData.material_urls)) {
              setMaterials(eventData.material_urls);
            }
          }
        } else if (campaignType === "CO_PRODUCING") {
          // Handle both product and concept data
          const productData = data.product || data;
          const conceptData = data.concept || data;

          if (productData && productData.is_product_creation_task !== false) {
            const formUpdates: any = {};
            if (productData.product_id || productData.id)
              formUpdates.product_id = productData.product_id || productData.id;
            if (productData.product_name || productData.name)
              formUpdates.product_name = productData.product_name || productData.name;
            if (productData.product_description || productData.description)
              formUpdates.product_description =
                productData.product_description || productData.description;
            setFormData(formUpdates);

            if (productData.subtasks && Array.isArray(productData.subtasks)) {
              setSubtasks(productData.subtasks);
            }
            if (productData.materials && Array.isArray(productData.materials)) {
              setMaterials(productData.materials);
            } else if (productData.material_urls && Array.isArray(productData.material_urls)) {
              setMaterials(productData.material_urls);
            }
            if (productData.kpi_goals && Array.isArray(productData.kpi_goals)) {
              setKpiGoals(productData.kpi_goals);
            }
          } else if (conceptData && conceptData.is_product_creation_task === false) {
            const formUpdates: any = {};
            if (conceptData.concept_id || conceptData.id)
              formUpdates.concept_id = conceptData.concept_id || conceptData.id;
            if (conceptData.concept_name || conceptData.name)
              formUpdates.concept_name = conceptData.concept_name || conceptData.name;
            if (conceptData.concept_description || conceptData.description)
              formUpdates.concept_description =
                conceptData.concept_description || conceptData.description;
            if (conceptData.related_product_id)
              formUpdates.related_product_id = conceptData.related_product_id;
            if (conceptData.related_product_name)
              formUpdates.related_product_name = conceptData.related_product_name;
            if (conceptData.platform) formUpdates.platform = conceptData.platform;
            setFormData(formUpdates);

            if (conceptData.hashtags && Array.isArray(conceptData.hashtags)) {
              setHashtags(conceptData.hashtags);
            }
            if (conceptData.materials && Array.isArray(conceptData.materials)) {
              setMaterials(conceptData.materials);
            } else if (conceptData.material_urls && Array.isArray(conceptData.material_urls)) {
              setMaterials(conceptData.material_urls);
            }
            if (conceptData.kpi_goals && Array.isArray(conceptData.kpi_goals)) {
              setKpiGoals(conceptData.kpi_goals);
            }
          }
        }
      };

      populateFromSuggestion(suggestedTaskData);
    }
  }, [open, suggestedTaskData, campaignType]);

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
    } else if (campaignType === "CO_PRODUCING" && taskData.type === "CONCEPT") {
      // Co-Producing Concept Task
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
      (taskData.type === "PRODUCT" || taskData.type === "CONCEPT")
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
                  Co-Producing {taskData.type === "CONCEPT" ? "Concept" : "Product"} Details
                </h3>
                <p className="text-sm text-gray-600">
                  Configure{" "}
                  {taskData.type === "CONCEPT" ? "concept development" : "product creation"}{" "}
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
                {taskData.type === "CONCEPT" ? "Concept Description" : "Product Description"}
              </Label>
              <Textarea
                rows={4}
                placeholder={
                  taskData.type === "CONCEPT"
                    ? "Describe the concept, creative direction, brand positioning, messaging strategy, etc..."
                    : "Provide detailed product description, features, specifications, target audience, etc..."
                }
                value={
                  taskData.type === "CONCEPT"
                    ? formData.concept_description || ""
                    : formData.product_description || ""
                }
                onChange={(e) =>
                  updateFormData(
                    taskData.type === "CONCEPT" ? "concept_description" : "product_description",
                    e.target.value,
                  )
                }
                className="resize-none"
              />
            </div>

            {taskData.type === "CONCEPT" && (
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
                contractType={campaignType}
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
