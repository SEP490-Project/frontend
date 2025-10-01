import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, AlertCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface FinancialTermsProps {
  formData: any;
  contractTypeOptions: { value: string; label: string }[];
  onContractTypeChange: (type: string) => void;
  onUpdateFinancialTerms: (updates: any) => void;
  errors?: any;
}

const FinancialTerms: React.FC<FinancialTermsProps> = ({
  formData,
  contractTypeOptions,
  onContractTypeChange,
  onUpdateFinancialTerms,
  errors = {},
}) => {
  // Format number with thousand separators
  const formatNumber = (value: number | string): string => {
    if (!value) return "";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "";
    return numValue.toLocaleString("vi-VN");
  };

  // Parse formatted number back to number
  const parseNumber = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    // Remove dots and convert to number
    const cleanValue = formattedValue.replace(/\./g, "");
    return parseFloat(cleanValue) || 0;
  };

  // Handle formatted number input
  const handleNumberInput = (value: string, callback: (num: number) => void) => {
    const numValue = parseNumber(value);
    callback(numValue);
  };

  // Payment cycle options
  const paymentCycleOptions = [
    { value: "MONTHLY", label: "Monthly" },
    { value: "QUARTERLY", label: "Quarterly" },
    { value: "SEMI_ANNUALLY", label: "Semi-Annually" },
    { value: "ANNUALLY", label: "Annually" },
  ];

  // Payment date options for different cycles
  const getPaymentDateOptions = (cycle: string) => {
    switch (cycle) {
      case "MONTHLY":
        return [
          { value: "1st", label: "1st of month" },
          { value: "5th", label: "5th of month" },
          { value: "10th", label: "10th of month" },
          { value: "15th", label: "15th of month" },
          { value: "last", label: "Last day of month" },
        ];
      case "QUARTERLY":
        return [
          { value: "end_of_quarter", label: "End of Quarter" },
          { value: "15th_last_month", label: "15th of Last Month" },
        ];
      case "SEMI_ANNUALLY":
        return [
          { value: "june_30", label: "June 30th" },
          { value: "december_31", label: "December 31st" },
        ];
      case "ANNUALLY":
        return [
          { value: "december_31", label: "December 31st" },
          { value: "march_31", label: "March 31st (Fiscal Year)" },
        ];
      default:
        return [];
    }
  };

  // Calculate total from schedule
  const calculateScheduleTotal = () => {
    const schedule = formData.financialTerms?.schedule || [];
    return schedule.reduce((total: number, item: any) => total + (item.amount || 0), 0);
  };

  // Check if schedule total matches total cost
  const isScheduleTotalValid = () => {
    const totalCost = formData.financialTerms?.totalCost || 0;
    const scheduleTotal = calculateScheduleTotal();
    return Math.abs(totalCost - scheduleTotal) < 0.01; // Allow small floating point differences
  };

  // Add payment schedule item
  const addScheduleItem = () => {
    const schedule = formData.financialTerms?.schedule || [];
    const newItem = {
      milestone: "",
      percent: 0,
      amount: 0,
      dueDate: "",
      requiredDocs: [],
    };
    onUpdateFinancialTerms({ schedule: [...schedule, newItem] });
  };

  // Validate schedule dates chronologically
  const validateScheduleDates = (schedule: any[]) => {
    if (!schedule || schedule.length < 2) return null;

    for (let i = 1; i < schedule.length; i++) {
      const currentDate = schedule[i].dueDate;
      const previousDate = schedule[i - 1].dueDate;

      if (currentDate && previousDate) {
        const current = new Date(currentDate);
        const previous = new Date(previousDate);

        if (current <= previous) {
          return `Schedule ${i + 1} date must be after Schedule ${i} date`;
        }
      }
    }
    return null;
  };

  // Validate total percentage doesn't exceed 100%
  const validateSchedulePercentage = (schedule: any[]) => {
    if (!schedule || schedule.length === 0) return null;

    const totalPercent = schedule.reduce((sum: number, item: any) => sum + (item.percent || 0), 0);

    if (totalPercent > 100) {
      return `Total percentage is ${totalPercent}% which exceeds 100%`;
    }

    return null;
  };

  // Update payment schedule item with validations
  const updateScheduleItem = (index: number, field: string, value: any) => {
    const schedule = [...(formData.financialTerms?.schedule || [])];
    schedule[index] = { ...schedule[index], [field]: value };

    const updateData: any = { schedule };

    // Validate percentage total
    if (field === "percent") {
      const percentError = validateSchedulePercentage(schedule);
      if (percentError) {
        updateData.scheduleError = percentError;
      } else {
        updateData.scheduleError = null;
      }

      // Auto-calculate amount from percent for fixed payment models
      if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
        const totalCost = formData.financialTerms?.totalCost || 0;
        updateData.schedule[index].amount = Math.round((totalCost * value) / 100);
      }
    }

    // Validate schedule dates
    if (field === "dueDate") {
      const dateError = validateScheduleDates(updateData.schedule);
      if (dateError) {
        updateData.scheduleDateError = dateError;
      } else {
        updateData.scheduleDateError = null;
      }
    }

    onUpdateFinancialTerms(updateData);
  };

  // Remove payment schedule item
  const removeScheduleItem = (index: number) => {
    const schedule = (formData.financialTerms?.schedule || []).filter(
      (_: any, i: number) => i !== index,
    );
    onUpdateFinancialTerms({ schedule });
  };

  // Update total cost and recalculate schedule amounts
  const updateTotalCost = (totalCost: number) => {
    const updates: any = { totalCost };

    // Recalculate amounts for fixed payment models
    if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
      const schedule = formData.financialTerms?.schedule || [];
      const updatedSchedule = schedule.map((item: any) => ({
        ...item,
        amount: Math.round((totalCost * (item.percent || 0)) / 100),
      }));
      updates.schedule = updatedSchedule;
    }

    onUpdateFinancialTerms(updates);
  };

  // Add affiliate level
  const addAffiliateLevel = () => {
    const levels = formData.financialTerms?.levels || [];
    const newLevel = {
      level: levels.length + 1,
      minClicks: 0,
      multiplier: 0.1,
    };
    onUpdateFinancialTerms({ levels: [...levels, newLevel] });
  };

  // Update affiliate level
  const updateAffiliateLevel = (index: number, field: string, value: any) => {
    const levels = [...(formData.financialTerms?.levels || [])];
    levels[index] = { ...levels[index], [field]: value };
    onUpdateFinancialTerms({ levels });
  };

  // Remove affiliate level
  const removeAffiliateLevel = (index: number) => {
    const levels = (formData.financialTerms?.levels || []).filter(
      (_: any, i: number) => i !== index,
    );
    onUpdateFinancialTerms({ levels });
  };

  // Handle date selection for schedule items
  const handleDateSelect = (index: number, date: Date | undefined) => {
    if (date) {
      updateScheduleItem(index, "dueDate", format(date, "yyyy-MM-dd"));
    } else {
      updateScheduleItem(index, "dueDate", "");
    }
  };

  // Parse date string to Date object
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  // Handle percentage input to prevent leading zeros
  const handlePercentageInput = (index: number, value: string) => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, "");

    // Convert to number and back to string to remove leading zeros
    const numValue = parseFloat(cleanValue) || 0;

    // Ensure it doesn't exceed 100
    const finalValue = Math.min(100, Math.max(0, numValue));

    updateScheduleItem(index, "percent", finalValue);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Financial Terms</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Contract Type *</Label>
          <Select value={formData.type} onValueChange={onContractTypeChange}>
            <SelectTrigger className={`h-11 ${errors.type ? "border-red-500" : ""}`}>
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
          {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
        </div>

        {/* Common Payment Settings */}
        {formData.type && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Method</Label>
              <Input
                value="Chuyển khoản"
                disabled
                className="h-11 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Currency</Label>
              <Input
                value="VND (₫)"
                disabled
                className="h-11 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Fixed Payment Model (ADVERTISING, BRAND_AMBASSADOR) */}
        {(formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Total Cost (VND) *</Label>
              <Input
                type="text"
                value={formatNumber(formData.financialTerms?.totalCost || "")}
                onChange={(e) => handleNumberInput(e.target.value, updateTotalCost)}
                placeholder="0"
                className={`h-11 ${errors.financialTerms?.totalCost ? "border-red-500" : ""}`}
              />
              {errors.financialTerms?.totalCost && (
                <p className="text-sm text-red-500">{errors.financialTerms.totalCost}</p>
              )}
            </div>

            {/* Total Validation Warning */}
            {formData.financialTerms?.schedule &&
              formData.financialTerms.schedule.length > 0 &&
              !isScheduleTotalValid() && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Schedule total ({formatNumber(calculateScheduleTotal())} VND) doesn't match
                    total cost ({formatNumber(formData.financialTerms?.totalCost || 0)} VND)
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Affiliate Model */}
        {formData.type === "AFFILIATE" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Base Per Click (VND) *</Label>
                <Input
                  type="text"
                  value={formatNumber(formData.financialTerms?.basePerClick || "")}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, (value) =>
                      onUpdateFinancialTerms({ basePerClick: value }),
                    )
                  }
                  placeholder="5.000"
                  className={`h-11 ${errors.financialTerms?.basePerClick ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.basePerClick && (
                  <p className="text-sm text-red-500">{errors.financialTerms.basePerClick}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Cycle *</Label>
                <Select
                  value={formData.financialTerms?.paymentCycle || ""}
                  onValueChange={(value) => onUpdateFinancialTerms({ paymentCycle: value })}
                >
                  <SelectTrigger
                    className={`h-11 ${errors.financialTerms?.paymentCycle ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentCycleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.financialTerms?.paymentCycle && (
                  <p className="text-sm text-red-500">{errors.financialTerms.paymentCycle}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Date</Label>
                <Select
                  value={formData.financialTerms?.paymentDate || ""}
                  onValueChange={(value) => onUpdateFinancialTerms({ paymentDate: value })}
                  disabled={!formData.financialTerms?.paymentCycle}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPaymentDateOptions(formData.financialTerms?.paymentCycle || "").map(
                      (option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tax Withholding Threshold (VND)</Label>
                <Input
                  type="text"
                  value={formatNumber(formData.financialTerms?.taxWithholding?.threshold || "")}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, (value) =>
                      onUpdateFinancialTerms({
                        taxWithholding: {
                          ...formData.financialTerms?.taxWithholding,
                          threshold: value,
                        },
                      }),
                    )
                  }
                  placeholder="2.000.000"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tax Withholding Rate (%)</Label>
                <Input
                  type="number"
                  value={formData.financialTerms?.taxWithholding?.ratePercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      taxWithholding: {
                        ...formData.financialTerms?.taxWithholding,
                        ratePercent: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="10"
                  className="h-11"
                />
              </div>
            </div>

            {/* Affiliate Levels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Commission Levels</Label>
                <Button type="button" onClick={addAffiliateLevel} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Level
                </Button>
              </div>

              <div className="space-y-3">
                {(formData.financialTerms?.levels || []).map((level: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Level</Label>
                        <Input
                          type="number"
                          value={level.level}
                          onChange={(e) =>
                            updateAffiliateLevel(index, "level", parseInt(e.target.value) || 0)
                          }
                          placeholder="1"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Min Clicks</Label>
                        <Input
                          type="number"
                          value={level.minClicks}
                          onChange={(e) =>
                            updateAffiliateLevel(index, "minClicks", parseInt(e.target.value) || 0)
                          }
                          placeholder="0"
                          className="h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Multiplier</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={level.multiplier}
                          onChange={(e) =>
                            updateAffiliateLevel(
                              index,
                              "multiplier",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.1"
                          className="h-10"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAffiliateLevel(index)}
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
          </div>
        )}

        {/* Co-Production Model */}
        {formData.type === "CO_PRODUCING" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label className="text-lg font-medium">Company Capital Contribution</Label>
                <div className="space-y-2">
                  <Input
                    value={formData.financialTerms?.capitalContribution?.company?.description || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capitalContribution: {
                          ...formData.financialTerms?.capitalContribution,
                          company: {
                            ...formData.financialTerms?.capitalContribution?.company,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Description"
                    className="h-11"
                  />
                  <Input
                    type="text"
                    value={formatNumber(
                      formData.financialTerms?.capitalContribution?.company?.value || "",
                    )}
                    onChange={(e) =>
                      handleNumberInput(e.target.value, (value) =>
                        onUpdateFinancialTerms({
                          capitalContribution: {
                            ...formData.financialTerms?.capitalContribution,
                            company: {
                              ...formData.financialTerms?.capitalContribution?.company,
                              value: value,
                            },
                          },
                        }),
                      )
                    }
                    placeholder="Value (VND)"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">KOL Capital Contribution</Label>
                <div className="space-y-2">
                  <Input
                    value={formData.financialTerms?.capitalContribution?.kol?.description || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capitalContribution: {
                          ...formData.financialTerms?.capitalContribution,
                          kol: {
                            ...formData.financialTerms?.capitalContribution?.kol,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Description"
                    className="h-11"
                  />
                  <Input
                    type="text"
                    value={formatNumber(
                      formData.financialTerms?.capitalContribution?.kol?.value || "",
                    )}
                    onChange={(e) =>
                      handleNumberInput(e.target.value, (value) =>
                        onUpdateFinancialTerms({
                          capitalContribution: {
                            ...formData.financialTerms?.capitalContribution,
                            kol: {
                              ...formData.financialTerms?.capitalContribution?.kol,
                              value: value,
                            },
                          },
                        }),
                      )
                    }
                    placeholder="Value (VND)"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company Profit Share (%) *</Label>
                <Input
                  type="number"
                  value={formData.financialTerms?.profitSplitCompanyPercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profitSplitCompanyPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="70"
                  className={`h-11 ${errors.financialTerms?.profitSplitCompanyPercent ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.profitSplitCompanyPercent && (
                  <p className="text-sm text-red-500">
                    {errors.financialTerms.profitSplitCompanyPercent}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">KOL Profit Share (%) *</Label>
                <Input
                  type="number"
                  value={formData.financialTerms?.profitSplitKolPercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profitSplitKolPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="30"
                  className={`h-11 ${errors.financialTerms?.profitSplitKolPercent ? "border-red-500" : ""}`}
                />
                {errors.financialTerms?.profitSplitKolPercent && (
                  <p className="text-sm text-red-500">
                    {errors.financialTerms.profitSplitKolPercent}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profit Distribution Cycle</Label>
                <Select
                  value={formData.financialTerms?.profitDistributionCycle || ""}
                  onValueChange={(value) =>
                    onUpdateFinancialTerms({ profitDistributionCycle: value })
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentCycleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profit Distribution Date</Label>
                <Select
                  value={formData.financialTerms?.profitDistributionDate || ""}
                  onValueChange={(value) =>
                    onUpdateFinancialTerms({ profitDistributionDate: value })
                  }
                  disabled={!formData.financialTerms?.profitDistributionCycle}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPaymentDateOptions(
                      formData.financialTerms?.profitDistributionCycle || "",
                    ).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Payment Schedule - Common for all contract types */}
        {formData.type && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-lg font-medium">Payment Schedule</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Define payment milestones with amounts and percentages
                </p>
              </div>
              <Button type="button" onClick={addScheduleItem} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Schedule
              </Button>
            </div>

            {/* Schedule Percentage Error */}
            {formData.financialTerms?.scheduleError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700">{formData.financialTerms.scheduleError}</p>
              </div>
            )}

            {/* Schedule Date Error */}
            {formData.financialTerms?.scheduleDateError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700">{formData.financialTerms.scheduleDateError}</p>
              </div>
            )}

            <div className="space-y-3">
              {(formData.financialTerms?.schedule || []).map((item: any, index: number) => (
                <Card key={index} className="p-4 bg-slate-50 border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Milestone</Label>
                      <Input
                        value={item.milestone}
                        onChange={(e) => updateScheduleItem(index, "milestone", e.target.value)}
                        placeholder="Upon Signing"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Percent (%)</Label>
                      <Input
                        type="text"
                        value={item.percent || ""}
                        onChange={(e) => handlePercentageInput(index, e.target.value)}
                        placeholder="50"
                        className={`h-10 ${
                          formData.financialTerms?.scheduleError ? "border-red-300" : ""
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Amount (VND)</Label>
                      <Input
                        type="text"
                        value={formatNumber(item.amount)}
                        onChange={(e) =>
                          handleNumberInput(e.target.value, (value) =>
                            updateScheduleItem(index, "amount", value),
                          )
                        }
                        placeholder="0"
                        className={`h-10 ${
                          formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR"
                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                            : ""
                        }`}
                        readOnly={
                          formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR"
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`h-10 w-full justify-start text-left font-normal ${
                              !item.dueDate ? "text-muted-foreground" : ""
                            } ${
                              formData.financialTerms?.scheduleDateError ? "border-red-500" : ""
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {item.dueDate ? (
                              format(parseDate(item.dueDate)!, "dd/MM/yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={parseDate(item.dueDate)}
                            onSelect={(date) => handleDateSelect(index, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeScheduleItem(index)}
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

            {/* Schedule Summary */}
            {formData.financialTerms?.schedule && formData.financialTerms.schedule.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-900">Schedule Total:</span>
                  <span className="font-bold text-blue-900">
                    {formatNumber(calculateScheduleTotal())} VND
                  </span>
                </div>
                {(formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") &&
                  formData.financialTerms?.totalCost && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-blue-900">Total Cost:</span>
                      <span className="font-bold text-blue-900">
                        {formatNumber(formData.financialTerms.totalCost || 0)} VND
                      </span>
                    </div>
                  )}
                {/* Progress bar for percentage total */}
                {formData.financialTerms?.schedule &&
                  formData.financialTerms.schedule.length > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center text-xs text-blue-700 mb-1">
                        <span>Percentage Total:</span>
                        <span>
                          {(formData.financialTerms.schedule || []).reduce(
                            (sum: number, item: any) => sum + (item.percent || 0),
                            0,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            (formData.financialTerms.schedule || []).reduce(
                              (sum: number, item: any) => sum + (item.percent || 0),
                              0,
                            ) === 100
                              ? "bg-green-500"
                              : (formData.financialTerms.schedule || []).reduce(
                                    (sum: number, item: any) => sum + (item.percent || 0),
                                    0,
                                  ) > 100
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (formData.financialTerms.schedule || []).reduce(
                                (sum: number, item: any) => sum + (item.percent || 0),
                                0,
                              ),
                            )}%`,
                          }}
                        ></div>
                      </div>
                      {(formData.financialTerms.schedule || []).reduce(
                        (sum: number, item: any) => sum + (item.percent || 0),
                        0,
                      ) !== 100 && (
                        <p
                          className={`text-xs mt-1 ${
                            (formData.financialTerms.schedule || []).reduce(
                              (sum: number, item: any) => sum + (item.percent || 0),
                              0,
                            ) > 100
                              ? "text-red-700"
                              : "text-yellow-700"
                          }`}
                        >
                          Total percentage should equal 100%
                        </p>
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialTerms;
