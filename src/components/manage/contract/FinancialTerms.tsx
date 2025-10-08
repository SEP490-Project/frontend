import React, { useState } from "react";
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

// Constants
const PAYMENT_CYCLE_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "SEMI_ANNUALLY", label: "Semi-Annually" },
  { value: "ANNUALLY", label: "Annually" },
];

const PAYMENT_DATE_OPTIONS = {
  MONTHLY: [
    { value: "1st", label: "1st of month" },
    { value: "5th", label: "5th of month" },
    { value: "15th", label: "15th of month" },
    { value: "last", label: "Last day of month" },
  ],
  QUARTERLY: [
    { value: "end_of_quarter", label: "End of Quarter" },
    { value: "15th_last_month", label: "15th of Last Month" },
  ],
  SEMI_ANNUALLY: [
    { value: "june_30", label: "June 30th" },
    { value: "december_31", label: "December 31st" },
  ],
  ANNUALLY: [
    { value: "december_31", label: "December 31st" },
    { value: "march_31", label: "March 31st (Fiscal Year)" },
  ],
};

// Helper Functions
const formatNumber = (value: number | string): string => {
  if (!value) return "";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "" : numValue.toLocaleString("vi-VN");
};

const parseNumber = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  return parseFloat(formattedValue.replace(/\./g, "")) || 0;
};

const parseDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
};

// Validation Functions
const validateSchedulePercentage = (schedule: any[]) => {
  if (!schedule?.length) return null;
  const totalPercent = schedule.reduce((sum: number, item: any) => sum + (item.percent || 0), 0);
  return totalPercent > 100 ? `Total percentage is ${totalPercent}% which exceeds 100%` : null;
};

const validateScheduleDates = (schedule: any[]) => {
  if (!schedule || schedule.length < 2) return null;
  for (let i = 1; i < schedule.length; i++) {
    const current = schedule[i].dueDate;
    const previous = schedule[i - 1].dueDate;
    if (current && previous && new Date(current) <= new Date(previous)) {
      return `Schedule ${i + 1} date must be after Schedule ${i} date`;
    }
  }
  return null;
};

// Components
const NumberInput = ({ label, value, onChange, placeholder, error, disabled = false }: any) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    <Input
      type="text"
      value={formatNumber(value || "")}
      onChange={(e) => onChange(parseNumber(e.target.value))}
      placeholder={placeholder}
      className={`h-11 ${error ? "border-red-500" : ""} ${disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""}`}
      disabled={disabled}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}: any) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={`h-11 ${error ? "border-red-500" : ""}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: any) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const ScheduleItem = ({ item, index, onUpdate, onRemove, type, hasError, hasDateError }: any) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <Card className="p-4 bg-slate-50 border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Milestone</Label>
          <Input
            value={item.milestone}
            onChange={(e) => onUpdate(index, "milestone", e.target.value)}
            placeholder="Upon Signing"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Percent (%)</Label>
          <Input
            type="text"
            value={item.percent || ""}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/[^\d.]/g, "");
              const numValue = Math.min(100, Math.max(0, parseFloat(cleanValue) || 0));
              onUpdate(index, "percent", numValue);
            }}
            placeholder="50"
            className={`h-10 ${hasError ? "border-red-300" : ""}`}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Amount (VND)</Label>
          <Input
            type="text"
            value={formatNumber(item.amount)}
            onChange={(e) => onUpdate(index, "amount", parseNumber(e.target.value))}
            placeholder="0"
            className={`h-10 ${
              type === "ADVERTISING" || type === "BRAND_AMBASSADOR"
                ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                : ""
            }`}
            readOnly={type === "ADVERTISING" || type === "BRAND_AMBASSADOR"}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Due Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline2"
                className={`h-10 w-full justify-start text-left font-normal ${
                  !item.dueDate ? "text-muted-foreground" : ""
                } ${hasDateError ? "border-red-500" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {item.dueDate ? format(parseDate(item.dueDate)!, "dd/MM/yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseDate(item.dueDate)}
                onSelect={(date) => {
                  onUpdate(index, "dueDate", date ? format(date, "yyyy-MM-dd") : "");
                  setIsCalendarOpen(false); // Đóng calendar sau khi chọn
                }}
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
            onClick={() => onRemove(index)}
            className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};

const AffiliateLevel = ({ level, index, onUpdate, onRemove }: any) => (
  <Card className="p-4 bg-slate-50 border-slate-200">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label className="text-xs text-slate-600">Level</Label>
        <Input
          type="number"
          value={level.level}
          onChange={(e) => onUpdate(index, "level", parseInt(e.target.value) || 0)}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-slate-600">Min Clicks</Label>
        <Input
          type="number"
          value={level.minClicks}
          onChange={(e) => onUpdate(index, "minClicks", parseInt(e.target.value) || 0)}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-slate-600">Multiplier</Label>
        <Input
          type="number"
          step="0.01"
          value={level.multiplier}
          onChange={(e) => onUpdate(index, "multiplier", parseFloat(e.target.value) || 0)}
          className="h-10"
        />
      </div>
      <div className="flex items-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRemove(index)}
          className="h-10 w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
      </div>
    </div>
  </Card>
);

const CapitalContribution = ({ title, data, onChange }: any) => (
  <div className="space-y-4">
    <Label className="text-lg font-medium">{title}</Label>
    <div className="space-y-2">
      <Input
        value={data?.description || ""}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Description"
        className="h-11"
      />
      <Input
        type="text"
        value={formatNumber(data?.value || "")}
        onChange={(e) => onChange("value", parseNumber(e.target.value))}
        placeholder="Value (VND)"
        className="h-11"
      />
    </div>
  </div>
);

const FinancialTerms: React.FC<FinancialTermsProps> = ({
  formData,
  contractTypeOptions,
  onContractTypeChange,
  onUpdateFinancialTerms,
  errors = {},
}) => {
  const financialTerms = formData.financialTerms || {};
  const schedule = financialTerms.schedule || [];

  const calculateScheduleTotal = () =>
    schedule.reduce((total: number, item: any) => total + (item.amount || 0), 0);

  const isScheduleTotalValid = () => {
    const totalCost = financialTerms.totalCost || 0;
    const scheduleTotal = calculateScheduleTotal();
    return Math.abs(totalCost - scheduleTotal) < 0.01;
  };

  const updateScheduleItem = (index: number, field: string, value: any) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };

    const updateData: any = { schedule: newSchedule };

    if (field === "percent") {
      updateData.scheduleError = validateSchedulePercentage(newSchedule);
      if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
        const totalCost = financialTerms.totalCost || 0;
        newSchedule[index].amount = Math.round((totalCost * value) / 100);
        updateData.schedule = newSchedule;
      }
    }

    if (field === "dueDate") {
      updateData.scheduleDateError = validateScheduleDates(newSchedule);
    }

    onUpdateFinancialTerms(updateData);
  };

  const addScheduleItem = () => {
    const newItem = { milestone: "", percent: 0, amount: 0, dueDate: "", requiredDocs: [] };
    onUpdateFinancialTerms({ schedule: [...schedule, newItem] });
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = schedule.filter((_: any, i: number) => i !== index);
    onUpdateFinancialTerms({ schedule: newSchedule });
  };

  const updateTotalCost = (totalCost: number) => {
    const updates: any = { totalCost };
    if (formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") {
      const updatedSchedule = schedule.map((item: any) => ({
        ...item,
        amount: Math.round((totalCost * (item.percent || 0)) / 100),
      }));
      updates.schedule = updatedSchedule;
    }
    onUpdateFinancialTerms(updates);
  };

  // Array handlers
  const addAffiliateLevel = () => {
    const levels = financialTerms.levels || [];
    const newLevel = { level: levels.length + 1, minClicks: 0, multiplier: 0.1 };
    onUpdateFinancialTerms({ levels: [...levels, newLevel] });
  };

  const updateAffiliateLevel = (index: number, field: string, value: any) => {
    const levels = [...(financialTerms.levels || [])];
    levels[index] = { ...levels[index], [field]: value };
    onUpdateFinancialTerms({ levels });
  };

  const removeAffiliateLevel = (index: number) => {
    const levels = (financialTerms.levels || []).filter((_: any, i: number) => i !== index);
    onUpdateFinancialTerms({ levels });
  };

  const getPaymentDateOptions = (cycle: string) =>
    PAYMENT_DATE_OPTIONS[cycle as keyof typeof PAYMENT_DATE_OPTIONS] || [];

  const totalPercent = schedule.reduce((sum: number, item: any) => sum + (item.percent || 0), 0);

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Financial Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contract Type */}
        <SelectField
          label="Contract Type *"
          value={formData.type}
          onChange={onContractTypeChange}
          options={contractTypeOptions}
          placeholder="Select contract type"
          error={errors.type}
        />

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

        {/* Fixed Payment Model */}
        {(formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") && (
          <div className="space-y-6">
            <NumberInput
              label="Total Cost (VND) *"
              value={financialTerms.totalCost}
              onChange={updateTotalCost}
              placeholder="0"
              error={errors.financialTerms?.totalCost}
            />

            {schedule.length > 0 && !isScheduleTotalValid() && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                  Schedule total ({formatNumber(calculateScheduleTotal())} VND) doesn't match total
                  cost ({formatNumber(financialTerms.totalCost || 0)} VND)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Affiliate Model */}
        {formData.type === "AFFILIATE" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NumberInput
                label="Base Per Click (VND) *"
                value={financialTerms.basePerClick}
                onChange={(value: number) => onUpdateFinancialTerms({ basePerClick: value })}
                placeholder="5.000"
                error={errors.financialTerms?.basePerClick}
              />
              <SelectField
                label="Payment Cycle *"
                value={financialTerms.paymentCycle || ""}
                onChange={(value: string) => onUpdateFinancialTerms({ paymentCycle: value })}
                options={PAYMENT_CYCLE_OPTIONS}
                placeholder="Select cycle"
                error={errors.financialTerms?.paymentCycle}
              />
              <SelectField
                label="Payment Date"
                value={financialTerms.paymentDate || ""}
                onChange={(value: string) => onUpdateFinancialTerms({ paymentDate: value })}
                options={getPaymentDateOptions(financialTerms.paymentCycle || "")}
                placeholder="Select date"
                disabled={!financialTerms.paymentCycle}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Tax Withholding Threshold (VND)"
                value={financialTerms.taxWithholding?.threshold}
                onChange={(value: number) =>
                  onUpdateFinancialTerms({
                    taxWithholding: { ...financialTerms.taxWithholding, threshold: value },
                  })
                }
                placeholder="2.000.000"
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tax Withholding Rate (%)</Label>
                <Input
                  type="number"
                  value={financialTerms.taxWithholding?.ratePercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      taxWithholding: {
                        ...financialTerms.taxWithholding,
                        ratePercent: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="10"
                  className="h-11"
                />
              </div>
            </div>

            {/* Commission Levels */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Commission Levels</Label>
                <Button type="button" onClick={addAffiliateLevel} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Level
                </Button>
              </div>
              <div className="space-y-3">
                {(financialTerms.levels || []).map((level: any, index: number) => (
                  <AffiliateLevel
                    key={index}
                    level={level}
                    index={index}
                    onUpdate={updateAffiliateLevel}
                    onRemove={removeAffiliateLevel}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Co-Production Model */}
        {formData.type === "CO_PRODUCING" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CapitalContribution
                title="Company Capital Contribution"
                data={financialTerms.capitalContribution?.company}
                onChange={(field: string, value: any) =>
                  onUpdateFinancialTerms({
                    capitalContribution: {
                      ...financialTerms.capitalContribution,
                      company: { ...financialTerms.capitalContribution?.company, [field]: value },
                    },
                  })
                }
              />
              <CapitalContribution
                title="KOL Capital Contribution"
                data={financialTerms.capitalContribution?.kol}
                onChange={(field: string, value: any) =>
                  onUpdateFinancialTerms({
                    capitalContribution: {
                      ...financialTerms.capitalContribution,
                      kol: { ...financialTerms.capitalContribution?.kol, [field]: value },
                    },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company Profit Share (%) *</Label>
                <Input
                  type="number"
                  value={financialTerms.profitSplitCompanyPercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profitSplitCompanyPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="70"
                  className={`h-11 ${errors.financialTerms?.profitSplitCompanyPercent ? "border-red-500" : ""}`}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">KOL Profit Share (%) *</Label>
                <Input
                  type="number"
                  value={financialTerms.profitSplitKolPercent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profitSplitKolPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="30"
                  className={`h-11 ${errors.financialTerms?.profitSplitKolPercent ? "border-red-500" : ""}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Profit Distribution Cycle"
                value={financialTerms.profitDistributionCycle || ""}
                onChange={(value: string) =>
                  onUpdateFinancialTerms({ profitDistributionCycle: value })
                }
                options={PAYMENT_CYCLE_OPTIONS}
                placeholder="Select cycle"
              />
              <SelectField
                label="Profit Distribution Date"
                value={financialTerms.profitDistributionDate || ""}
                onChange={(value: string) =>
                  onUpdateFinancialTerms({ profitDistributionDate: value })
                }
                options={getPaymentDateOptions(financialTerms.profitDistributionCycle || "")}
                placeholder="Select date"
                disabled={!financialTerms.profitDistributionCycle}
              />
            </div>
          </div>
        )}

        {/* Payment Schedule */}
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

            {/* Errors */}
            {financialTerms.scheduleError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700">{financialTerms.scheduleError}</p>
              </div>
            )}

            {financialTerms.scheduleDateError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700">{financialTerms.scheduleDateError}</p>
              </div>
            )}

            {/* Schedule Items */}
            <div className="space-y-3">
              {schedule.map((item: any, index: number) => (
                <ScheduleItem
                  key={index}
                  item={item}
                  index={index}
                  onUpdate={updateScheduleItem}
                  onRemove={removeScheduleItem}
                  type={formData.type}
                  hasError={!!financialTerms.scheduleError}
                  hasDateError={!!financialTerms.scheduleDateError}
                />
              ))}
            </div>

            {/* Schedule Summary */}
            {schedule.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-900">Schedule Total:</span>
                  <span className="font-bold text-blue-900">
                    {formatNumber(calculateScheduleTotal())} VND
                  </span>
                </div>

                {(formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR") &&
                  financialTerms.totalCost && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium text-blue-900">Total Cost:</span>
                      <span className="font-bold text-blue-900">
                        {formatNumber(financialTerms.totalCost || 0)} VND
                      </span>
                    </div>
                  )}

                <div className="mt-3">
                  <div className="flex justify-between items-center text-xs text-blue-700 mb-1">
                    <span>Percentage Total:</span>
                    <span>{totalPercent}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        totalPercent === 100
                          ? "bg-green-500"
                          : totalPercent > 100
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min(100, totalPercent)}%` }}
                    />
                  </div>
                  {totalPercent !== 100 && (
                    <p
                      className={`text-xs mt-1 ${totalPercent > 100 ? "text-red-700" : "text-yellow-700"}`}
                    >
                      Total percentage should equal 100%
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialTerms;
