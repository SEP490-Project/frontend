import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { validateField } from "@/libs/validation/contractValidation";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import {} from "react-icons/fa6";
import { format } from "date-fns";

interface ContractTypeTemplateProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onUpdateScopeOfWork: (updates: any) => void;
  errors?: any;
  onFieldValidation?: (field: string, error: string | null) => void;
}

const ContractTypeTemplate: React.FC<ContractTypeTemplateProps> = ({
  formData,
  onInputChange,
  onUpdateScopeOfWork,
  errors = {},
  onFieldValidation,
}) => {
  // Real-time validation helper
  const handleFieldChange = async (field: string, value: any) => {
    onInputChange(field, value);

    if (onFieldValidation) {
      const validation = await validateField(field, value, { ...formData, [field]: value });
      onFieldValidation(field, validation.isValid ? null : validation.error);
    }
  };

  const handleScopeFieldChange = async (field: string, value: any) => {
    const updates = { [field]: value };
    onUpdateScopeOfWork(updates);

    if (onFieldValidation) {
      const newScopeOfWork = { ...formData.scopeOfWork, ...updates };
      const validation = await validateField(`scopeOfWork.${field}`, value, {
        ...formData,
        scopeOfWork: newScopeOfWork,
      });
      onFieldValidation(`scopeOfWork.${field}`, validation.isValid ? null : validation.error);
    }
  };

  // Date validation helper
  const validateDateRange = async () => {
    if (formData.startDate && formData.endDate && onFieldValidation) {
      const endValidation = await validateField("endDate", formData.endDate, formData);
      onFieldValidation("endDate", endValidation.isValid ? null : endValidation.error);
    }

    if (formData.signedDate && formData.startDate && formData.endDate && onFieldValidation) {
      const signedValidation = await validateField("signedDate", formData.signedDate, formData);
      onFieldValidation("signedDate", signedValidation.isValid ? null : signedValidation.error);
    }
  };

  // Fixed date formatting to avoid timezone issues
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Parse date string safely
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    // Create date from YYYY-MM-DD string without timezone issues
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Deliverable type options
  const deliverableTypeOptions = [
    { value: "Video Review", label: "Video Review" },
    { value: "Photo Post", label: "Photo Post" },
    { value: "Story Post", label: "Story Post" },
    { value: "Live Stream", label: "Live Stream" },
  ];

  // Add deliverable
  const addDeliverable = () => {
    const newDeliverable = {
      type: "",
      channelId: "",
      channelName: "",
      channelLink: "",
      quantity: 1,
      deadline: "",
    };

    const updatedDeliverables = [...(formData.scopeOfWork.deliverables || []), newDeliverable];
    onUpdateScopeOfWork({ deliverables: updatedDeliverables });
  };

  // Update deliverable
  const updateDeliverable = (index: number, field: string, value: any) => {
    const updatedDeliverables = [...(formData.scopeOfWork.deliverables || [])];
    updatedDeliverables[index] = { ...updatedDeliverables[index], [field]: value };
    onUpdateScopeOfWork({ deliverables: updatedDeliverables });
  };

  // Remove deliverable
  const removeDeliverable = (index: number) => {
    const updatedDeliverables = (formData.scopeOfWork.deliverables || []).filter(
      (_: any, i: number) => i !== index,
    );
    onUpdateScopeOfWork({ deliverables: updatedDeliverables });
  };

  // Add branding restriction
  const addBrandingRestriction = () => {
    const updatedRestrictions = [...(formData.scopeOfWork.brandingRestrictions || []), ""];
    onUpdateScopeOfWork({ brandingRestrictions: updatedRestrictions });
  };

  // Update branding restriction
  const updateBrandingRestriction = (index: number, value: string) => {
    const updatedRestrictions = [...(formData.scopeOfWork.brandingRestrictions || [])];
    updatedRestrictions[index] = value;
    onUpdateScopeOfWork({ brandingRestrictions: updatedRestrictions });
  };

  // Remove branding restriction
  const removeBrandingRestriction = (index: number) => {
    const updatedRestrictions = (formData.scopeOfWork.brandingRestrictions || []).filter(
      (_: any, i: number) => i !== index,
    );
    onUpdateScopeOfWork({ brandingRestrictions: updatedRestrictions });
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Contract Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contractNumber" className="text-sm font-medium">
                Contract Number *
              </Label>
              <Input
                id="contractNumber"
                value={formData.contractNumber}
                onChange={(e) => handleFieldChange("contractNumber", e.target.value)}
                placeholder="Contract number from the signed document"
                className={`h-11 ${errors.contractNumber ? "border-red-500" : ""}`}
              />
              {errors.contractNumber && (
                <p className="text-sm text-red-500">{errors.contractNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Signed Location *</Label>
              <Input
                value={formData.signedLocation}
                onChange={(e) => handleFieldChange("signedLocation", e.target.value)}
                placeholder="Location where contract is signed"
                className={`h-11 ${errors.signedLocation ? "border-red-500" : ""}`}
              />
              {errors.signedLocation && (
                <p className="text-sm text-red-500">{errors.signedLocation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Currency</Label>
              <Input
                value="VND (₫)"
                disabled
                className="h-11 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                Contract Duration *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline2"
                        className={`h-11 justify-start text-left font-normal w-full ${
                          !formData.startDate ? "text-muted-foreground" : ""
                        } ${errors.startDate ? "border-red-500" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate
                          ? format(parseDate(formData.startDate) || new Date(), "dd/MM/yyyy")
                          : "Start"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDate(formData.startDate)}
                        onSelect={async (date) => {
                          const value = date ? formatDateForInput(date) : "";
                          await handleFieldChange("startDate", value);
                          validateDateRange();
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline2"
                        className={`h-11 justify-start text-left font-normal w-full ${
                          !formData.endDate ? "text-muted-foreground" : ""
                        } ${errors.endDate ? "border-red-500" : ""}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate
                          ? format(parseDate(formData.endDate) || new Date(), "dd/MM/yyyy")
                          : "End"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseDate(formData.endDate)}
                        onSelect={async (date) => {
                          const value = date ? formatDateForInput(date) : "";
                          await handleFieldChange("endDate", value);
                          validateDateRange();
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Signed Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline2"
                    className={`h-11 w-full justify-start text-left font-normal px-3 ${
                      !formData.signedDate ? "text-muted-foreground" : ""
                    } ${errors.signedDate ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.signedDate
                      ? format(parseDate(formData.signedDate) || new Date(), "dd/MM/yyyy")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(formData.signedDate)}
                    onSelect={async (date) => {
                      const value = date ? formatDateForInput(date) : "";
                      await handleFieldChange("signedDate", value);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.signedDate && <p className="text-sm text-red-500">{errors.signedDate}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scope of Work */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Scope of Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project Description *</Label>
            <Textarea
              value={formData.scopeOfWork.description || ""}
              onChange={(e) => handleScopeFieldChange("description", e.target.value)}
              placeholder="Describe the project scope and objectives..."
              rows={4}
              className={errors.scopeOfWork?.description ? "border-red-500" : ""}
            />
            {errors.scopeOfWork?.description && (
              <p className="text-sm text-red-500">{errors.scopeOfWork.description}</p>
            )}
          </div>

          {/* Technical Requirements */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Technical Requirements</Label>
            <Textarea
              value={formData.scopeOfWork.technicalRequirements || ""}
              onChange={(e) => onUpdateScopeOfWork({ technicalRequirements: e.target.value })}
              placeholder="Specify technical requirements, quality standards, etc..."
              rows={3}
            />
          </div>

          {/* Deliverables */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Deliverables</Label>
              <Button
                type="button"
                onClick={addDeliverable}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Deliverable
              </Button>
            </div>

            <div className="space-y-3">
              {(formData.scopeOfWork.deliverables || []).map((deliverable: any, index: number) => (
                <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Type</Label>
                      <Select
                        value={deliverable.type}
                        onValueChange={(value) => updateDeliverable(index, "type", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliverableTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Channel Name</Label>
                      <Input
                        placeholder="Channel name"
                        value={deliverable.channelName}
                        onChange={(e) => updateDeliverable(index, "channelName", e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Channel Link</Label>
                      <Input
                        placeholder="https://..."
                        value={deliverable.channelLink}
                        onChange={(e) => updateDeliverable(index, "channelLink", e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={deliverable.quantity}
                        onChange={(e) =>
                          updateDeliverable(index, "quantity", parseInt(e.target.value))
                        }
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Deadline</Label>
                      <Input
                        type="date"
                        value={deliverable.deadline}
                        onChange={(e) => updateDeliverable(index, "deadline", e.target.value)}
                        className="h-10"
                      />
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDeliverable(index)}
                        className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Branding Restrictions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Branding Restrictions</Label>
              <Button
                type="button"
                onClick={addBrandingRestriction}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Restriction
              </Button>
            </div>

            <div className="space-y-3">
              {(formData.scopeOfWork.brandingRestrictions || []).map(
                (restriction: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={restriction}
                      onChange={(e) => updateBrandingRestriction(index, e.target.value)}
                      placeholder="Enter branding restriction..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBrandingRestriction(index)}
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Co-Production Roles */}
          {formData.type === "CO_PRODUCING" && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Co-Production Roles</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">Company Role</Label>
                  <Textarea
                    value={formData.scopeOfWork.coProductionRoles?.company || ""}
                    onChange={(e) =>
                      onUpdateScopeOfWork({
                        coProductionRoles: {
                          ...formData.scopeOfWork.coProductionRoles,
                          company: e.target.value,
                        },
                      })
                    }
                    placeholder="Company responsibilities..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-600">KOL Role</Label>
                  <Textarea
                    value={formData.scopeOfWork.coProductionRoles?.kol || ""}
                    onChange={(e) =>
                      onUpdateScopeOfWork({
                        coProductionRoles: {
                          ...formData.scopeOfWork.coProductionRoles,
                          kol: e.target.value,
                        },
                      })
                    }
                    placeholder="KOL responsibilities..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTypeTemplate;
