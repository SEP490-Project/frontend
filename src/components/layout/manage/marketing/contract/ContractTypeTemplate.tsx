import React, { useState } from "react";
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
import { format } from "date-fns";

interface ContractTypeTemplateProps {
  formData: any;
  onContractTypeChange: (type: string) => void;
  onInputChange: (field: string, value: any) => void;
  onUpdateScopeOfWork: (updates: any) => void;
  errors?: any;
  onFieldValidation?: (field: string, error: string | null) => void;
}

// Constants
const CONTRACT_TYPE_OPTIONS = [
  { value: "ADVERTISING", label: "Advertising Contract" },
  { value: "AFFILIATE", label: "Affiliate Marketing" },
  { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
  { value: "CO_PRODUCING", label: "Co-Production" },
];

const CHANNEL_OPTIONS = [
  { value: "web", label: "Website" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
];

// Helper Components
const DatePicker = ({
  field,
  value,
  placeholder,
  onChange,
  error,
  openPopovers,
  setOpenPopovers,
}: any) => {
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <Popover
        open={openPopovers[field]}
        onOpenChange={(open) => setOpenPopovers((prev: any) => ({ ...prev, [field]: open }))}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline2"
            className={`h-11 w-full justify-start text-left font-normal ${
              !value ? "text-muted-foreground" : ""
            } ${error ? "border-red-500" : ""}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(parseDate(value) || new Date(), "dd/MM/yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parseDate(value)}
            onSelect={(date) => {
              const dateValue = date ? formatDateForInput(date) : "";
              onChange(dateValue);
              setOpenPopovers((prev: any) => ({ ...prev, [field]: false }));
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const ContractTypeTemplate: React.FC<ContractTypeTemplateProps> = ({
  formData,
  onContractTypeChange,
  onInputChange,
  onUpdateScopeOfWork,
  errors = {},
  onFieldValidation,
}) => {
  const [openPopovers, setOpenPopovers] = useState({
    startDate: false,
    endDate: false,
    signedDate: false,
  });

  // Field change handlers with validation
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

  return (
    <div className="space-y-8">
      {/* Contract Type Selection */}
      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-primary/90 to-primary/30 relative overflow-hidden">
        {/* overlay sáng nhẹ để bớt gắt */}
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />

        <CardHeader className="relative pb-4">
          <CardTitle className="text-xl font-semibold text-white drop-shadow">
            Contract Type Selection
          </CardTitle>
          <p className="text-sm text-pink-50 drop-shadow-sm">
            Choose the type of contract you want to create
          </p>
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-2">
            <Label htmlFor="contractType" className="text-sm font-medium text-white/90">
              Contract Type *
            </Label>
            <Select value={formData.type} onValueChange={onContractTypeChange}>
              <SelectTrigger
                className={`h-12 text-base bg-white/90 backdrop-blur-sm rounded-lg ${
                  errors.type ? "border-red-500" : "border-pink-200"
                } focus:border-pink-400`}
              >
                <SelectValue placeholder="Select contract type to get started..." />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-base py-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-200">{errors.type}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information - Only show if contract type is selected */}
      {formData.type && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Contract Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Number *</Label>
                <Input
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
                <Label className="text-sm font-medium">Contract Duration *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    field="startDate"
                    value={formData.startDate}
                    placeholder="Start"
                    onChange={(value: string) => handleFieldChange("startDate", value)}
                    error={errors.startDate}
                    openPopovers={openPopovers}
                    setOpenPopovers={setOpenPopovers}
                  />
                  <DatePicker
                    field="endDate"
                    value={formData.endDate}
                    placeholder="End"
                    onChange={(value: string) => handleFieldChange("endDate", value)}
                    error={errors.endDate}
                    openPopovers={openPopovers}
                    setOpenPopovers={setOpenPopovers}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Signed Date</Label>
                <DatePicker
                  field="signedDate"
                  value={formData.signedDate}
                  placeholder="Select date"
                  onChange={(value: string) => handleFieldChange("signedDate", value)}
                  error={errors.signedDate}
                  openPopovers={openPopovers}
                  setOpenPopovers={setOpenPopovers}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scope of Work - Only show if contract type is selected */}
      {formData.type && (
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

            {/* Technical Requirements (only for Advertising) */}
            {formData.type === "ADVERTISING" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Technical Requirements</Label>
                <Textarea
                  value={formData.scopeOfWork.technical_requirements || ""}
                  onChange={(e) => onUpdateScopeOfWork({ technical_requirements: e.target.value })}
                  placeholder="Specify technical requirements, quality standards, etc..."
                  rows={3}
                />
              </div>
            )}

            {/* Co-Production Roles (only for Co-Producing) */}
            {formData.type === "CO_PRODUCING" && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">Co-Production Roles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-600">Company Role</Label>
                    <Textarea
                      value={formData.scopeOfWork.co_production_roles?.company || ""}
                      onChange={(e) =>
                        onUpdateScopeOfWork({
                          co_production_roles: {
                            ...formData.scopeOfWork.co_production_roles,
                            company: e.target.value,
                          },
                        })
                      }
                      placeholder="Describe the company's responsibilities..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-600">KOL Role</Label>
                    <Textarea
                      value={formData.scopeOfWork.co_production_roles?.kol || ""}
                      onChange={(e) =>
                        onUpdateScopeOfWork({
                          co_production_roles: {
                            ...formData.scopeOfWork.co_production_roles,
                            kol: e.target.value,
                          },
                        })
                      }
                      placeholder="Describe the KOL's responsibilities..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Event Participation (only for Brand Ambassador) */}
            {formData.type === "BRAND_AMBASSADOR" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Event Participation</Label>
                  <Button
                    type="button"
                    onClick={() =>
                      onUpdateScopeOfWork({
                        event_participation: [
                          ...(formData.scopeOfWork.event_participation || []),
                          { event_name: "", note: "" },
                        ],
                      })
                    }
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Event
                  </Button>
                </div>
                <div className="space-y-3">
                  {(formData.scopeOfWork.event_participation || []).map(
                    (event: any, index: number) => (
                      <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Event Name</Label>
                            <Input
                              value={event.event_name}
                              onChange={(e) => {
                                const updated = [...formData.scopeOfWork.event_participation];
                                updated[index].event_name = e.target.value;
                                onUpdateScopeOfWork({ event_participation: updated });
                              }}
                              placeholder="Event name"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Note</Label>
                            <Input
                              value={event.note}
                              onChange={(e) => {
                                const updated = [...formData.scopeOfWork.event_participation];
                                updated[index].note = e.target.value;
                                onUpdateScopeOfWork({ event_participation: updated });
                              }}
                              placeholder="Note"
                              className="h-10"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updated = formData.scopeOfWork.event_participation.filter(
                                  (_: any, i: number) => i !== index,
                                );
                                onUpdateScopeOfWork({ event_participation: updated });
                              }}
                              className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Deliverables */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Deliverables</Label>
                <Button
                  type="button"
                  onClick={() =>
                    onUpdateScopeOfWork({
                      deliverables: [
                        ...(formData.scopeOfWork.deliverables || []),
                        formData.type === "AFFILIATE"
                          ? {
                              type: "",
                              channel: "",
                              tracking_link: "",
                              coupon_code: "",
                              quantity: 1,
                              deadline: "",
                            }
                          : {
                              type: "",
                              channel: "",
                              quantity: 1,
                              deadline: "",
                            },
                      ],
                    })
                  }
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Deliverable
                </Button>
              </div>
              <div className="space-y-3">
                {(formData.scopeOfWork.deliverables || []).map(
                  (deliverable: any, index: number) => (
                    <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-600">Type</Label>
                          <Input
                            value={deliverable.type}
                            onChange={(e) => {
                              const updated = [...formData.scopeOfWork.deliverables];
                              updated[index].type = e.target.value;
                              onUpdateScopeOfWork({ deliverables: updated });
                            }}
                            placeholder="Deliverable type"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-600">Channel</Label>
                          <Select
                            value={deliverable.channel}
                            onValueChange={(value) => {
                              const updated = [...formData.scopeOfWork.deliverables];
                              updated[index].channel = value;
                              onUpdateScopeOfWork({ deliverables: updated });
                            }}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                              {CHANNEL_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Affiliate-specific fields */}
                        {formData.type === "AFFILIATE" && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-xs text-slate-600">Tracking Link</Label>
                              <Input
                                value={deliverable.tracking_link || ""}
                                onChange={(e) => {
                                  const updated = [...formData.scopeOfWork.deliverables];
                                  updated[index].tracking_link = e.target.value;
                                  onUpdateScopeOfWork({ deliverables: updated });
                                }}
                                placeholder="Tracking link"
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-slate-600">Coupon Code</Label>
                              <Input
                                value={deliverable.coupon_code || ""}
                                onChange={(e) => {
                                  const updated = [...formData.scopeOfWork.deliverables];
                                  updated[index].coupon_code = e.target.value;
                                  onUpdateScopeOfWork({ deliverables: updated });
                                }}
                                placeholder="Coupon code"
                                className="h-10"
                              />
                            </div>
                          </>
                        )}
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-600">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={deliverable.quantity}
                            onChange={(e) => {
                              const updated = [...formData.scopeOfWork.deliverables];
                              updated[index].quantity = parseInt(e.target.value);
                              onUpdateScopeOfWork({ deliverables: updated });
                            }}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-600">Deadline</Label>
                          <DatePicker
                            field={`deliverable-deadline-${index}`}
                            value={deliverable.deadline}
                            placeholder="Select date"
                            onChange={(value: string) => {
                              const updated = [...formData.scopeOfWork.deliverables];
                              updated[index].deadline = value;
                              onUpdateScopeOfWork({ deliverables: updated });
                            }}
                            error={undefined}
                            openPopovers={openPopovers}
                            setOpenPopovers={setOpenPopovers}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = formData.scopeOfWork.deliverables.filter(
                                (_: any, i: number) => i !== index,
                              );
                              onUpdateScopeOfWork({ deliverables: updated });
                            }}
                            className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ),
                )}
              </div>
            </div>

            {/* Branding Restrictions (not for Co-Producing) */}
            {formData.type !== "CO_PRODUCING" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Branding Restrictions</Label>
                  <Button
                    type="button"
                    onClick={() =>
                      onUpdateScopeOfWork({
                        branding_restrictions: [
                          ...(formData.scopeOfWork.branding_restrictions || []),
                          "",
                        ],
                      })
                    }
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Restriction
                  </Button>
                </div>
                <div className="space-y-3">
                  {(formData.scopeOfWork.branding_restrictions || []).map(
                    (restriction: string, index: number) => (
                      <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="md:col-span-4 space-y-2">
                            <Label className="text-xs text-slate-600">Restriction</Label>
                            <Input
                              value={restriction}
                              onChange={(e) => {
                                const updated = [...formData.scopeOfWork.branding_restrictions];
                                updated[index] = e.target.value;
                                onUpdateScopeOfWork({ branding_restrictions: updated });
                              }}
                              placeholder="Enter branding restriction..."
                              className="h-10"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updated = formData.scopeOfWork.branding_restrictions.filter(
                                  (_: any, i: number) => i !== index,
                                );
                                onUpdateScopeOfWork({ branding_restrictions: updated });
                              }}
                              className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ),
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legal Terms */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Legal Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Breach of Contract */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-primary">Breach of Contract</Label>
            <ul className="space-y-2 text-sm text-gray-700 list-disc pl-5">
              <li>
                <span className="font-semibold text-gray-900">
                  If Party A (the Brand) breaches the contract:
                </span>
                <ul className="list-disc pl-5">
                  <li>The contract shall be terminated immediately.</li>
                  <li>Party A forfeits the entire deposit paid.</li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  If Party B (the Service Provider) breaches the contract:
                </span>
                <ul className="list-disc pl-5">
                  <li>The contract shall be terminated immediately.</li>
                  <li className="flex items-center gap-2">
                    Party B must refund the entire deposit to Party A and compensate an additional
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={formData.legalTerms?.compensationPercent ?? ""}
                        onChange={(e) =>
                          onInputChange("legalTerms", {
                            ...formData.legalTerms,
                            compensationPercent: e.target.value,
                          })
                        }
                        className="w-20 h-8 pr-7"
                        placeholder="0"
                      />
                      <span className="absolute right-2 text-gray-500 text-sm">%</span>
                    </div>
                    of the deposit amount to Party A.
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  If both parties mutually agree to terminate the contract:
                </span>
                <ul className="list-disc pl-5">
                  <li>Neither party shall bear any liability or compensation obligations.</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Additional Standard Terms */}
          <div className="space-y-2 text-sm text-gray-700">
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded">
              <span className="font-semibold">Confidentiality:</span> Both parties agree to keep all
              information related to this contract strictly confidential and not disclose it to any
              third party without prior written consent from the other party.
            </div>
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded">
              <span className="font-semibold">Dispute Resolution:</span> Any disputes arising from
              or relating to this contract shall be resolved amicably through negotiation. If no
              agreement is reached, the dispute shall be settled at a competent court as prescribed
              by law.
            </div>
            <div className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded">
              <span className="font-semibold">Contract Effectiveness:</span> This contract becomes
              effective from the date of signing and shall terminate upon full completion of
              obligations by both parties.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTypeTemplate;
