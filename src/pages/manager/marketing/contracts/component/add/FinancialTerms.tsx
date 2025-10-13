import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Plus, Trash2 } from "lucide-react";
import {
  FaDollarSign,
  FaCalendarDay,
  FaPercent,
  FaHandshake,
  FaChartLine,
  FaCreditCard,
  FaBuildingColumns,
} from "react-icons/fa6";

// Props
interface FinancialTermsProps {
  formData: any;
  onUpdateFinancialTerms: (updates: any) => void;
  errors?: any;
}

// Constants
const CONTRACT_TYPE_CONFIG = {
  ADVERTISING: { model: "FIXED", title: "Fixed Payment", icon: FaDollarSign, color: "blue" },
  BRAND_AMBASSADOR: { model: "FIXED", title: "Fixed Payment", icon: FaDollarSign, color: "orange" },
  AFFILIATE: { model: "LEVELS", title: "Commission Levels", icon: FaChartLine, color: "green" },
  CO_PRODUCING: { model: "SHARE", title: "Profit Sharing", icon: FaHandshake, color: "purple" },
};

const PAYMENT_CYCLE_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "ANNUALLY", label: "Annually" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: FaBuildingColumns },
  { value: "CREDIT_CARD", label: "Credit Card", icon: FaCreditCard },
];

// Generate day options for monthly payments (1-31 + last day)
const MONTHLY_DAY_OPTIONS = [
  ...Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Day ${i + 1}${i + 1 === 1 ? "st" : i + 1 === 2 ? "nd" : i + 1 === 3 ? "rd" : "th"} of month`,
  })),
  { value: "last", label: "Last day of month" },
];

// Quarter information
const QUARTERS = [
  {
    quarter: "Q1",
    months: [
      { value: "1", label: "January" },
      { value: "2", label: "February" },
      { value: "3", label: "March" },
    ],
  },
  {
    quarter: "Q2",
    months: [
      { value: "4", label: "April" },
      { value: "5", label: "May" },
      { value: "6", label: "June" },
    ],
  },
  {
    quarter: "Q3",
    months: [
      { value: "7", label: "July" },
      { value: "8", label: "August" },
      { value: "9", label: "September" },
    ],
  },
  {
    quarter: "Q4",
    months: [
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ],
  },
];

// Helper functions
const formatCurrency = (value: number | string) => {
  if (!value) return "";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "" : numValue.toLocaleString("vi-VN");
};

const parseCurrency = (formattedValue: string) => {
  if (!formattedValue) return 0;
  return parseFloat(formattedValue.replace(/\./g, "")) || 0;
};

// Components
const CurrencyInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, error, disabled = false }) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium flex items-center gap-2">
      <FaDollarSign className="w-3 h-3" />
      {label}
    </Label>
    <Input
      type="text"
      value={formatCurrency(value || 0)}
      onChange={(e) => onChange(parseCurrency(e.target.value))}
      placeholder={placeholder}
      className={`h-11 ${error ? "border-red-500" : ""} ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: any }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  icon?: any;
}> = ({ label, value, onChange, options, placeholder, error, disabled = false, icon: Icon }) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium flex items-center gap-2">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={`h-11 ${error ? "border-red-500" : ""}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              {option.icon && <option.icon className="w-4 h-4" />}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

// Fixed Payment Schedule Component
const PaymentSchedule: React.FC<{
  schedules: any[];
  totalCost: number;
  onUpdate: (schedules: any[]) => void;
}> = ({ schedules, totalCost, onUpdate }) => {
  const addSchedule = () => {
    const newSchedule = {
      milestone: "",
      percent: 0,
      amount: 0,
      due_date: "",
    };
    onUpdate([...schedules, newSchedule]);
  };

  const updateSchedule = (index: number, field: string, value: any) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate amount when percent changes
    if (field === "percent" && totalCost) {
      updated[index].amount = Math.round((totalCost * value) / 100);
    }

    onUpdate(updated);
  };

  const removeSchedule = (index: number) => {
    onUpdate(schedules.filter((_, i) => i !== index));
  };

  const totalPercent = schedules.reduce((sum, s) => sum + (s.percent || 0), 0);
  const totalAmount = schedules.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-medium flex items-center gap-2">
          <FaCalendarDay className="w-4 h-4" />
          Payment Schedule
        </Label>
        <Button variant="outline" size="sm" onClick={addSchedule}>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {schedules.map((schedule, index) => (
        <Card key={index} className="p-4 bg-slate-50 border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Milestone Description</Label>
              <Input
                placeholder="e.g., Initial payment, Final delivery"
                value={schedule.milestone || ""}
                onChange={(e) => updateSchedule(index, "milestone", e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <FaPercent className="w-3 h-3" />
                Percent
              </Label>
              <Input
                type="number"
                placeholder="30"
                value={schedule.percent || ""}
                onChange={(e) => updateSchedule(index, "percent", parseFloat(e.target.value) || 0)}
                className="bg-white"
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-1">
                <FaDollarSign className="w-3 h-3" />
                Amount (VND)
              </Label>
              <Input
                type="text"
                placeholder="3,000,000"
                value={formatCurrency(schedule.amount || 0)}
                onChange={(e) => updateSchedule(index, "amount", parseCurrency(e.target.value))}
                className="bg-white"
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-1">Due Date</Label>
              <div className="flex gap-2">
                <DatePicker
                  value={schedule.due_date || ""}
                  onChange={(date) => updateSchedule(index, "due_date", date)}
                  placeholder="Select date"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSchedule(index)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {/* Summary */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
            <div className="text-sm text-blue-800">Milestones</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${totalPercent === 100 ? "text-green-600" : "text-orange-600"}`}
            >
              {totalPercent}%
            </div>
            <div className="text-sm text-gray-600">Total Percent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</div>
            <div className="text-sm text-purple-800">Total Amount</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${totalAmount === totalCost ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(totalCost - totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Commission Levels Component
const CommissionLevels: React.FC<{
  levels: any[];
  onUpdate: (levels: any[]) => void;
}> = ({ levels, onUpdate }) => {
  const addLevel = () => {
    const newLevel = {
      level: levels.length + 1,
      max_clicks: 0,
      multiplier: 1.0,
    };
    onUpdate([...levels, newLevel]);
  };

  const updateLevel = (index: number, field: string, value: any) => {
    const updated = [...levels];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeLevel = (index: number) => {
    const updated = levels.filter((_, i) => i !== index);
    // Renumber levels
    updated.forEach((level, i) => {
      level.level = i + 1;
    });
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-medium flex items-center gap-2">
          <FaChartLine className="w-4 h-4" />
          Commission Levels
        </Label>
        <Button variant="outline" size="sm" onClick={addLevel}>
          <Plus className="w-4 h-4 mr-2" />
          Add Level
        </Button>
      </div>

      {levels.map((level, index) => (
        <Card key={index} className="p-4 bg-slate-50 border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">Level</Label>
              <Input
                type="number"
                value={level.level || index + 1}
                onChange={(e) => updateLevel(index, "level", parseInt(e.target.value) || 1)}
                className="bg-white"
                disabled
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Max Clicks</Label>
              <Input
                type="number"
                placeholder="1000"
                value={level.max_clicks || ""}
                onChange={(e) => updateLevel(index, "max_clicks", parseInt(e.target.value) || 0)}
                className="bg-white"
                min="0"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="1.0"
                value={level.multiplier || ""}
                onChange={(e) =>
                  updateLevel(index, "multiplier", parseFloat(e.target.value) || 1.0)
                }
                className="bg-white"
                min="0"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLevel(index)}
                className="text-red-500 hover:bg-red-50 w-full h-10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Payment Date Selector Component - IMPROVED
const PaymentDateSelector: React.FC<{
  cycle: string;
  value: any;
  onChange: (value: any) => void;
}> = ({ cycle, value, onChange }) => {
  if (cycle === "MONTHLY") {
    return (
      <SelectField
        label="Monthly Payment Day"
        value={value || ""}
        onChange={onChange}
        options={MONTHLY_DAY_OPTIONS}
        placeholder="Select payment day"
        icon={FaCalendarDay}
      />
    );
  }

  if (cycle === "QUARTERLY") {
    // Initialize quarterly payments structure if not exist
    const quarterlyPayments = value || [
      { quarter: "Q1", month: "", day: "" },
      { quarter: "Q2", month: "", day: "" },
      { quarter: "Q3", month: "", day: "" },
      { quarter: "Q4", month: "", day: "" },
    ];

    const updateQuarterlyPayment = (quarterIndex: number, field: string, val: string) => {
      const updated = [...quarterlyPayments];
      updated[quarterIndex] = { ...updated[quarterIndex], [field]: val };
      onChange(updated);
    };

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <FaCalendarDay className="w-3 h-3" />
          Quarterly Payment Schedule
        </Label>
        <div className="space-y-4">
          {QUARTERS.map((quarter, quarterIndex) => (
            <Card key={quarter.quarter} className="p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center gap-4">
                <div className="font-medium text-gray-700 w-12">{quarter.quarter}</div>

                <div className="flex-1">
                  <Label className="text-xs text-gray-600 mb-1 block">Month</Label>
                  <Select
                    value={quarterlyPayments[quarterIndex]?.month || ""}
                    onValueChange={(val) => updateQuarterlyPayment(quarterIndex, "month", val)}
                  >
                    <SelectTrigger className="h-9 bg-white">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {quarter.months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label className="text-xs text-gray-600 mb-1 block">Day</Label>
                  <Select
                    value={quarterlyPayments[quarterIndex]?.day || ""}
                    onValueChange={(val) => updateQuarterlyPayment(quarterIndex, "day", val)}
                    disabled={!quarterlyPayments[quarterIndex]?.month}
                  >
                    <SelectTrigger className="h-9 bg-white">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHLY_DAY_OPTIONS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.value === "last" ? "Last day" : `Day ${day.value}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="text-sm">
            <strong>Payment Summary:</strong>
            {quarterlyPayments.map((qp: any, index: number) => {
              if (!qp.month || !qp.day) return null;
              const monthName = QUARTERS.find((q) => q.quarter === qp.quarter)?.months.find(
                (m) => m.value === qp.month,
              )?.label;
              const dayText = qp.day === "last" ? "last day" : `day ${qp.day}`;
              return (
                <div key={index} className="text-blue-800">
                  • {qp.quarter}: {dayText} of {monthName}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  if (cycle === "ANNUALLY") {
    return (
      <DatePicker
        label="Annual Payment Date"
        value={value || ""}
        onChange={onChange}
        placeholder="Select annual payment date"
      />
    );
  }

  return null;
};

// Main Component
const FinancialTerms: React.FC<FinancialTermsProps> = ({
  formData,
  onUpdateFinancialTerms,
  errors = {},
}) => {
  // const contractType = formData?.type;
  const contractType = "CO_PRODUCING"; // TEMP FIX
  const financialTerms = formData?.financialTerms || {};

  if (!contractType) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Financial Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-12">Please select a contract type first</p>
        </CardContent>
      </Card>
    );
  }

  const config = CONTRACT_TYPE_CONFIG[contractType as keyof typeof CONTRACT_TYPE_CONFIG];
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <Card className="shadow-sm">
      <CardHeader className={`bg-gradient-to-r from-${config.color}-50 to-${config.color}-100`}>
        <CardTitle className="flex items-center gap-3">
          <IconComponent className={`w-6 h-6 text-${config.color}-600`} />
          <div>
            <h2 className="text-xl font-bold">{config.title}</h2>
            <p className="text-sm text-gray-600 font-normal">
              Configure financial terms for {contractType.toLowerCase().replace("_", " ")} contract
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        {/* FIXED Model - Advertising & Brand Ambassador */}
        {(contractType === "ADVERTISING" || contractType === "BRAND_AMBASSADOR") && (
          <div className="space-y-6">
            {/* Payment Method & Total Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Payment Method"
                value={financialTerms.payment_method || "BANK_TRANSFER"}
                onChange={(value) => onUpdateFinancialTerms({ payment_method: value })}
                options={PAYMENT_METHOD_OPTIONS}
                placeholder="Select payment method"
                error={errors.payment_method}
              />

              <CurrencyInput
                label="Total Contract Cost (VND)"
                value={financialTerms.total_cost || 0}
                onChange={(value) => onUpdateFinancialTerms({ total_cost: value })}
                placeholder="10,000,000"
                error={errors.total_cost}
              />
            </div>

            {/* Cost Breakdown */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Cost Breakdown (Optional)</Label>
              <Textarea
                placeholder="e.g., Content creation: 5,000,000 VND, Promotion: 3,000,000 VND, Management: 2,000,000 VND"
                value={financialTerms.cost_breakdown_text || ""}
                onChange={(e) => onUpdateFinancialTerms({ cost_breakdown_text: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            {/* Payment Schedule */}
            <PaymentSchedule
              schedules={financialTerms.schedule || []}
              totalCost={financialTerms.total_cost || 0}
              onUpdate={(schedule) => onUpdateFinancialTerms({ schedule })}
            />
          </div>
        )}

        {/* LEVELS Model - Affiliate */}
        {contractType === "AFFILIATE" && (
          <div className="space-y-6">
            {/* Base Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CurrencyInput
                label="Base Per Click (VND)"
                value={financialTerms.base_per_click || 0}
                onChange={(value) => onUpdateFinancialTerms({ base_per_click: value })}
                placeholder="1,000"
                error={errors.base_per_click}
              />

              <SelectField
                label="Payment Cycle"
                value={financialTerms.payment_cycle || ""}
                onChange={(value) => onUpdateFinancialTerms({ payment_cycle: value })}
                options={PAYMENT_CYCLE_OPTIONS}
                placeholder="Select cycle"
                error={errors.payment_cycle}
                icon={FaCalendarDay}
              />

              {financialTerms.payment_cycle && (
                <div className="md:col-span-1">
                  <PaymentDateSelector
                    cycle={financialTerms.payment_cycle}
                    value={financialTerms.payment_date}
                    onChange={(value) => onUpdateFinancialTerms({ payment_date: value })}
                  />
                </div>
              )}
            </div>

            {/* Tax Withholding */}
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-3">Tax Withholding</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CurrencyInput
                  label="Threshold (VND)"
                  value={financialTerms.tax_withholding?.threshold || 0}
                  onChange={(value) =>
                    onUpdateFinancialTerms({
                      tax_withholding: { ...financialTerms.tax_withholding, threshold: value },
                    })
                  }
                  placeholder="10,000,000"
                />

                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <FaPercent className="w-3 h-3" />
                    Tax Rate (%)
                  </Label>
                  <Input
                    type="number"
                    value={financialTerms.tax_withholding?.rate_percent || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        tax_withholding: {
                          ...financialTerms.tax_withholding,
                          rate_percent: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="10"
                    className="h-11"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </Card>

            {/* Commission Levels */}
            <CommissionLevels
              levels={financialTerms.levels || []}
              onUpdate={(levels) => onUpdateFinancialTerms({ levels })}
            />
          </div>
        )}

        {/* SHARE Model - Co-Producing */}
        {contractType === "CO_PRODUCING" && (
          <div className="space-y-6">
            {/* Capital Contributions */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h4 className="font-medium text-purple-900 mb-4 flex items-center gap-2">
                <FaHandshake className="w-4 h-4" />
                Capital Contributions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Contribution */}
                <div className="space-y-4">
                  <h5 className="font-medium">Company Contribution</h5>
                  <Textarea
                    placeholder="Equipment, studio, marketing budget..."
                    value={financialTerms.capital_contribution?.company?.description || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capital_contribution: {
                          ...financialTerms.capital_contribution,
                          company: {
                            ...financialTerms.capital_contribution?.company,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    className="min-h-[80px]"
                  />
                  <CurrencyInput
                    label="Value (VND)"
                    value={financialTerms.capital_contribution?.company?.value || 0}
                    onChange={(value) =>
                      onUpdateFinancialTerms({
                        capital_contribution: {
                          ...financialTerms.capital_contribution,
                          company: { ...financialTerms.capital_contribution?.company, value },
                        },
                      })
                    }
                    placeholder="50,000,000"
                  />
                </div>

                {/* KOL Contribution */}
                <div className="space-y-4">
                  <h5 className="font-medium">KOL Contribution</h5>
                  <Textarea
                    placeholder="Content creation, social media presence, audience..."
                    value={financialTerms.capital_contribution?.kol?.description || ""}
                    onChange={(e) =>
                      onUpdateFinancialTerms({
                        capital_contribution: {
                          ...financialTerms.capital_contribution,
                          kol: {
                            ...financialTerms.capital_contribution?.kol,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                    className="min-h-[80px]"
                  />
                  <CurrencyInput
                    label="Value (VND)"
                    value={financialTerms.capital_contribution?.kol?.value || 0}
                    onChange={(value) =>
                      onUpdateFinancialTerms({
                        capital_contribution: {
                          ...financialTerms.capital_contribution,
                          kol: { ...financialTerms.capital_contribution?.kol, value },
                        },
                      })
                    }
                    placeholder="30,000,000"
                  />
                </div>
              </div>
            </Card>

            {/* Profit Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FaPercent className="w-3 h-3" />
                  Company Profit Share (%)
                </Label>
                <Input
                  type="number"
                  value={financialTerms.profit_split_company_percent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profit_split_company_percent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="60"
                  className="h-11"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FaPercent className="w-3 h-3" />
                  KOL Profit Share (%)
                </Label>
                <Input
                  type="number"
                  value={financialTerms.profit_split_kol_percent || ""}
                  onChange={(e) =>
                    onUpdateFinancialTerms({
                      profit_split_kol_percent: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="40"
                  className="h-11"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Profit Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Profit Distribution Cycle"
                value={financialTerms.profit_distribution_cycle || ""}
                onChange={(value) => onUpdateFinancialTerms({ profit_distribution_cycle: value })}
                options={PAYMENT_CYCLE_OPTIONS}
                placeholder="Select cycle"
                icon={FaCalendarDay}
              />

              {financialTerms.profit_distribution_cycle && (
                <PaymentDateSelector
                  cycle={financialTerms.profit_distribution_cycle}
                  value={financialTerms.profit_distribution_date}
                  onChange={(value) => onUpdateFinancialTerms({ profit_distribution_date: value })}
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialTerms;
