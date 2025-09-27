import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataSelector, FileUploader } from "@/components/global";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  CalendarIcon,
  FileText,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  DollarSign,
  Calendar as CalendarDays,
  Paperclip,
  Plus,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/libs/helper";
import brands from "./brands.json";
import contracts from "./contracts.json";

const CreateContractPage: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    brandId: "",
    parentContractId: "",
    title: "",
    contractType: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    compensationAmount: "",
    paymentTerms: "",
    contractFiles: [],
    proposalFiles: [],
    // Type-specific
    deliverables: [], // Changed to array for structured data
    usageRights: "",
    commissionRate: "",
    cookieDuration: "",
    payoutThreshold: "",
    monthlyRetainer: "",
    requiredPosts: "",
    revenueShare: "",
    ipOwnership: "",
  });

  const [installments, setInstallments] = useState<any[]>([
    { installmentPercentage: "", amount: "", dueDate: "" },
  ]);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [isExtension, setIsExtension] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handler for contract files
  const handleContractFilesChange = (files: File[]) => {
    handleInputChange("contractFiles", files);
  };

  // Handler for proposal files
  const handleProposalFilesChange = (files: File[]) => {
    handleInputChange("proposalFiles", files);
  };

  // Upload handlers (optional - for immediate upload)
  const handleContractUpload = async (files: File[]) => {
    try {
      // Implement your upload logic here
      console.log("Uploading contract files:", files);
      // Example: await uploadFiles(files, 'contracts');
    } catch (error) {
      console.error("Contract upload failed:", error);
      throw error;
    }
  };

  const handleProposalUpload = async (files: File[]) => {
    try {
      // Implement your upload logic here
      console.log("Uploading proposal files:", files);
      // Example: await uploadFiles(files, 'proposals');
    } catch (error) {
      console.error("Proposal upload failed:", error);
      throw error;
    }
  };

  const addInstallment = () => {
    setInstallments((prev) => [...prev, { installmentPercentage: "", amount: "", dueDate: "" }]);
  };

  const updateInstallment = (idx: number, field: string, value: any) => {
    const newList = [...installments];
    newList[idx][field] = value;
    setInstallments(newList);
  };

  const removeInstallment = (idx: number) => {
    setInstallments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ formData, installments });
    // TODO: call API
  };

  const handleBrandChange = (id: string | null) => {
    handleInputChange("brandId", id || "");
    const brand = brands.find((b) => b.id === id) || null;
    setSelectedBrand(brand);
  };

  const contractTypeOptions = [
    { value: "ADVERTISING", label: "Advertising Contract" },
    { value: "AFFILIATE", label: "Affiliate Marketing" },
    { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
    { value: "CO_PRODUCING", label: "Co-Production" },
  ];

  // Get available deliverable types (not already selected)
  const getAvailableDeliverableTypes = () => {
    const selectedTypes = formData.deliverables.map((d: any) => d.type).filter(Boolean);
    return deliverableTypeOptions.filter((option) => !selectedTypes.includes(option.value));
  };

  // Check if we can add more deliverables
  const canAddDeliverable = () => {
    return getAvailableDeliverableTypes().length > 0;
  };

  // Add deliverable item
  const addDeliverable = () => {
    const newDeliverable = {
      id: Math.random().toString(36).substr(2, 9),
      type: "",
      count: "",
    };
    handleInputChange("deliverables", [...formData.deliverables, newDeliverable]);
  };

  // Update deliverable item
  const updateDeliverable = (id: string, field: string, value: any) => {
    const updatedDeliverables = formData.deliverables.map((item: any) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    handleInputChange("deliverables", updatedDeliverables);
  };

  // Remove deliverable item
  const removeDeliverable = (id: string) => {
    const filteredDeliverables = formData.deliverables.filter((item: any) => item.id !== id);
    handleInputChange("deliverables", filteredDeliverables);
  };

  // Initialize with one empty deliverable if none exist
  React.useEffect(() => {
    if (formData.contractType === "ADVERTISING" && formData.deliverables.length === 0) {
      addDeliverable();
    }
  }, [formData.contractType]);

  // Deliverable type options
  const deliverableTypeOptions = [
    { value: "POST", label: "Social Media Post" },
    { value: "VIDEO", label: "Video Content" },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-semibold mb-8">Create New Contract</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Brand Selection & Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">Brand Selection</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="gap-6">
                {/* Select Brand */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4" />
                    Select Brand *
                  </Label>
                  <DataSelector
                    data={brands}
                    selectedId={formData.brandId}
                    onSelect={handleBrandChange}
                    renderItem={(brand) => (
                      <div className="flex items-center gap-3 p-2">
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="h-8 w-8 rounded-lg object-cover border"
                        />
                        <div>
                          <span className="font-medium">{brand.name}</span>
                          <p className="text-xs text-slate-500">{brand.contact_email}</p>
                        </div>
                      </div>
                    )}
                    getLabel={(brand) => brand.name}
                    title="Brands"
                    placeholder="Choose a brand to work with"
                  />
                </div>

                {/* Contract Extension */}
                {selectedBrand && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isExtension"
                        checked={isExtension}
                        onCheckedChange={(checked) => {
                          setIsExtension(!!checked);
                          if (!checked) handleInputChange("parentContractId", "");
                        }}
                      />
                      <Label htmlFor="isExtension" className="text-sm font-medium">
                        Contract Extension
                      </Label>
                    </div>

                    {isExtension && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Parent Contract</Label>
                        <DataSelector
                          data={contracts.filter((c) => c.brandId === formData.brandId)}
                          selectedId={formData.parentContractId}
                          onSelect={(id) => handleInputChange("parentContractId", id || "")}
                          renderItem={(contract) => (
                            <div className="flex items-start gap-3 p-2">
                              <div className="flex-shrink-0 mt-1">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    contract.status === "ACTIVE"
                                      ? "bg-green-500"
                                      : contract.status === "EXPIRED"
                                        ? "bg-red-500"
                                        : "bg-yellow-500"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{contract.title}</div>
                                <div className="text-xs text-slate-500 space-y-1">
                                  <div>
                                    Type:{" "}
                                    {
                                      contractTypeOptions.find(
                                        (opt) => opt.value === contract.contractType,
                                      )?.label
                                    }
                                  </div>
                                  <div className="flex gap-4">
                                    <span>
                                      Start: {format(new Date(contract.startDate), "dd/MM/yyyy")}
                                    </span>
                                    <span>
                                      End: {format(new Date(contract.endDate), "dd/MM/yyyy")}
                                    </span>
                                  </div>
                                  {contract.compensationAmount && (
                                    <div>
                                      Amount: ${contract.compensationAmount.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge
                                variant={contract.status === "ACTIVE" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {contract.status}
                              </Badge>
                            </div>
                          )}
                          getLabel={(contract) => `${contract.title} (${contract.contractType})`}
                          title="Existing Contracts"
                          placeholder="Select a parent contract to extend"
                        />
                        {formData.parentContractId && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-sm text-blue-800">
                              <div className="font-medium mb-1">Selected Parent Contract:</div>
                              {(() => {
                                const parentContract = contracts.find(
                                  (c) => c.id === formData.parentContractId,
                                );
                                return parentContract ? (
                                  <div className="space-y-1">
                                    <div>{parentContract.title}</div>
                                    <div className="text-xs text-blue-600">
                                      {format(new Date(parentContract.startDate), "dd/MM/yyyy")} -{" "}
                                      {format(new Date(parentContract.endDate), "dd/MM/yyyy")}
                                    </div>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedBrand && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Brand Info */}
                    <div className="xl:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedBrand.logo_url}
                            alt={`${selectedBrand.name} logo`}
                            className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {selectedBrand.name}
                            </h3>
                            <Badge
                              variant={selectedBrand.status === "ACTIVE" ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {selectedBrand.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="h-4 w-4" />
                          <span>{selectedBrand.contact_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="h-4 w-4" />
                          <span>{selectedBrand.contact_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Globe className="h-4 w-4" />
                          <a
                            href={selectedBrand.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedBrand.website_url}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{selectedBrand.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Representative */}
                    <div className="bg-white/80 rounded-lg p-4 border border-white/50">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Representative</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedBrand.representative_ava}
                          alt={selectedBrand.representative}
                          className="w-12 h-12 rounded-full border-2 border-blue-200 object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-900">
                            {selectedBrand.representative}
                          </p>
                          <p className="text-xs text-slate-500">
                            {selectedBrand.representative_email}
                          </p>
                          <p className="text-xs text-slate-500">
                            {selectedBrand.representative_phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contract Details */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="xl:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-xl">Contract Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Contract Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter contract title"
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Contract Type *</Label>
                      <Select
                        value={formData.contractType}
                        onValueChange={(value) => handleInputChange("contractType", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contractTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Duration
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline2"
                              className={`h-11 justify-start text-left font-normal ${!formData.startDate ? "text-muted-foreground" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.startDate
                                ? format(new Date(formData.startDate), "dd/MM/yyyy")
                                : "Start"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                formData.startDate ? new Date(formData.startDate) : undefined
                              }
                              onSelect={(date) =>
                                handleInputChange(
                                  "startDate",
                                  date ? formatDate(date, "input") : "",
                                )
                              }
                            />
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline2"
                              className={`h-11 justify-start text-left font-normal ${!formData.endDate ? "text-muted-foreground" : ""}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.endDate
                                ? format(new Date(formData.endDate), "dd/MM/yyyy")
                                : "End"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.endDate ? new Date(formData.endDate) : undefined}
                              onSelect={(date) =>
                                handleInputChange("endDate", date ? formatDate(date, "input") : "")
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Type-specific Details */}
              {formData.contractType && (
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Contract Specifics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {formData.contractType === "ADVERTISING" && (
                      <div className="space-y-6">
                        {/* Deliverables Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Deliverables *</Label>
                            <Button
                              type="button"
                              onClick={addDeliverable}
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              disabled={!canAddDeliverable()}
                            >
                              <Plus className="h-4 w-4" />
                              Add Deliverable
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {formData.deliverables.map((deliverable: any) => (
                              <Card
                                key={deliverable.id}
                                className="p-4 bg-slate-50/50 border-slate-200"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                  <div className="md:col-span-5 space-y-2">
                                    <Label className="text-xs text-slate-600">Content Type *</Label>
                                    <Select
                                      value={deliverable.type}
                                      onValueChange={(value) =>
                                        updateDeliverable(deliverable.id, "type", value)
                                      }
                                    >
                                      <SelectTrigger className="h-10 mb-0">
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {/* Show currently selected option even if it would normally be filtered */}
                                        {deliverable.type && (
                                          <SelectItem value={deliverable.type}>
                                            {
                                              deliverableTypeOptions.find(
                                                (opt) => opt.value === deliverable.type,
                                              )?.label
                                            }
                                          </SelectItem>
                                        )}
                                        {/* Show available options */}
                                        {getAvailableDeliverableTypes().map((option) => (
                                          <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                              <span>{option.label}</span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="md:col-span-4 space-y-2">
                                    <Label className="text-xs text-slate-600">Quantity *</Label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      min="1"
                                      value={deliverable.count}
                                      onChange={(e) =>
                                        updateDeliverable(deliverable.id, "count", e.target.value)
                                      }
                                      className="h-10"
                                    />
                                  </div>

                                  <div className="md:col-span-3">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeDeliverable(deliverable.id)}
                                      className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      disabled={formData.deliverables.length === 1}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>

                          {/* Show message when all types are used */}
                          {!canAddDeliverable() && formData.deliverables.length > 0 && (
                            <p className="text-sm text-slate-500 italic text-center py-2">
                              All available deliverable types have been added
                            </p>
                          )}
                        </div>

                        {/* Usage Rights */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Usage Rights</Label>
                          <Textarea
                            value={formData.usageRights}
                            onChange={(e) => handleInputChange("usageRights", e.target.value)}
                            placeholder="Define usage rights and content ownership terms..."
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {/* Other contract types remain the same */}
                    {formData.contractType === "AFFILIATE" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Commission Rate (%)</Label>
                          <Input
                            type="number"
                            value={formData.commissionRate}
                            onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Cookie Duration (days)</Label>
                          <Input
                            type="number"
                            value={formData.cookieDuration}
                            onChange={(e) => handleInputChange("cookieDuration", e.target.value)}
                            placeholder="30"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Payout Threshold</Label>
                          <Input
                            type="number"
                            value={formData.payoutThreshold}
                            onChange={(e) => handleInputChange("payoutThreshold", e.target.value)}
                            placeholder="100.00"
                            step="0.01"
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}

                    {formData.contractType === "BRAND_AMBASSADOR" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Monthly Retainer</Label>
                          <Input
                            type="number"
                            value={formData.monthlyRetainer}
                            onChange={(e) => handleInputChange("monthlyRetainer", e.target.value)}
                            placeholder="1000.00"
                            step="0.01"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Required Posts/Month</Label>
                          <Input
                            type="number"
                            value={formData.requiredPosts}
                            onChange={(e) => handleInputChange("requiredPosts", e.target.value)}
                            placeholder="4"
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}

                    {formData.contractType === "CO_PRODUCING" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Revenue Share (%)</Label>
                          <Input
                            type="number"
                            value={formData.revenueShare}
                            onChange={(e) => handleInputChange("revenueShare", e.target.value)}
                            placeholder="50.00"
                            step="0.01"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">IP Ownership</Label>
                          <Input
                            value={formData.ipOwnership}
                            onChange={(e) => handleInputChange("ipOwnership", e.target.value)}
                            placeholder="Shared ownership"
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Financial Terms */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-xl">Financial Terms</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(formData.contractType === "ADVERTISING" ||
                    formData.contractType === "BRAND_AMBASSADOR") && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Total Compensation Amount</Label>
                      <Input
                        type="number"
                        value={formData.compensationAmount}
                        onChange={(e) => handleInputChange("compensationAmount", e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="h-11 text-lg font-medium"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Payment Terms</Label>
                    <Textarea
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                      placeholder="Describe payment terms and conditions..."
                      rows={4}
                    />
                  </div>

                  <Separator />

                  {/* Payment Installments */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">Payment Schedule</h4>
                      <Button type="button" onClick={addInstallment} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Installment
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {installments.map((installment, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs text-slate-600">Percentage (%)</Label>
                              <Input
                                type="number"
                                placeholder="25"
                                value={installment.installmentPercentage}
                                onChange={(e) =>
                                  updateInstallment(idx, "installmentPercentage", e.target.value)
                                }
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-slate-600">Amount</Label>
                              <Input
                                type="number"
                                placeholder="1000.00"
                                value={installment.amount}
                                onChange={(e) => updateInstallment(idx, "amount", e.target.value)}
                                step="0.01"
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-slate-600">Due Date</Label>
                              <Input
                                type="date"
                                value={installment.dueDate}
                                onChange={(e) => updateInstallment(idx, "dueDate", e.target.value)}
                                className="h-10"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeInstallment(idx)}
                                className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={installments.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Attachments */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-xl">Contract Documents</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contract Files */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Contract Documents</Label>
                    <FileUploader
                      accept=".pdf,.doc,.docx"
                      multiple={true}
                      maxSize={10}
                      maxFiles={1}
                      allowedTypes={["pdf", "doc", "docx"]}
                      onFilesChange={handleContractFilesChange}
                      onUpload={handleContractUpload}
                      showPreview={false}
                      title="Contract Files"
                      showSummary={true}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500">
                      Upload contract documents (PDF, DOC, DOCX only)
                    </p>
                  </div>

                  <Separator />

                  {/* Proposal Files */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Proposal Documents</Label>
                    <FileUploader
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      multiple={true}
                      maxSize={10}
                      maxFiles={1}
                      allowedTypes={["pdf", "doc", "docx", "ppt", "pptx"]}
                      onFilesChange={handleProposalFilesChange}
                      onUpload={handleProposalUpload}
                      showPreview={false}
                      title="Proposal Files"
                      showSummary={true}
                    />
                    <p className="text-xs text-slate-500">
                      Upload proposal documents and presentations
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button type="submit" className="w-full h-12 text-base font-semibold ">
                      Request Contract Approval
                    </Button>
                    <Button type="button" variant="outline" className="w-full h-11">
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContractPage;
