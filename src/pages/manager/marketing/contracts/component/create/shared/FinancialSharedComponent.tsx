import React from "react";
import { Card } from "@/components/ui/card";
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
import { DatePicker } from "@/components/date-picker";
import { Plus, Trash2 } from "lucide-react";
import { FaCalendarDay, FaChartLine } from "react-icons/fa6";

// Helper functions
const formatCurrency = (value: number | string) => {
  if (!value) return 0;
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(numValue) ? "" : numValue.toLocaleString("vi-VN");
};

const parseCurrency = (formattedValue: string) => {
  if (!formattedValue) return 0;
  return parseFloat(formattedValue.replace(/\./g, "")) || 0;
};

interface PaymentDateSelectorProps {
  cycle: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  value?: any;
  onChange: (val: any) => void;
  onScheduleGenerated?: (schedule: any[]) => void;
  startDate: string;
  endDate: string;
}

// Shared Components
export const CurrencyInput: React.FC<{
  label?: string;
  value: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, error, disabled = false }) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium flex items-center">{label}</Label>
    <Input
      type="text"
      value={formatCurrency(value || 0)}
      onChange={(e) => onChange?.(parseCurrency(e.target.value))}
      placeholder={placeholder}
      className={`w-full ${error ? "border-red-500" : ""} ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export const SelectField: React.FC<{
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
      <SelectTrigger className={`${error ? "border-red-500" : ""}`}>
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

export const PaymentSchedule: React.FC<{
  schedules: any[];
  totalCost: number;
  onUpdate: (schedules: any[]) => void;
  startDate?: string;
  endDate?: string;
}> = ({ schedules, totalCost, onUpdate, startDate, endDate }) => {
  const addSchedule = () => {
    const newId = schedules.length > 0 ? Math.max(...schedules.map((s) => s.id || 0)) + 1 : 1;
    const newSchedule = {
      id: newId,
      milestone: "",
      percent: 0,
      amount: 0,
      due_date: "",
      note: "",
    };
    onUpdate([...schedules, newSchedule]);
  };

  const updateSchedule = (index: number, field: string, value: any) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "percent") {
      let newPercent = Math.max(0, value);

      const otherTotal = updated.reduce(
        (sum, s, i) => (i === index ? sum : sum + (s.percent || 0)),
        0,
      );

      if (otherTotal + newPercent > 100) {
        newPercent = Math.max(0, 100 - otherTotal);
      }

      updated[index].percent = newPercent;
      updated[index].amount = totalCost ? Math.round((totalCost * newPercent) / 100) : 0;
    }

    onUpdate(updated);
  };

  const removeSchedule = (index: number) => {
    onUpdate(schedules.filter((_, i) => i !== index));
  };

  const totalPercent = schedules.reduce((sum, s) => sum + (s.percent || 0), 0);
  const totalAmount = schedules.reduce((sum, s) => sum + (s.amount || 0), 0);

  const minDate = startDate || undefined;
  const maxDate = endDate || undefined;

  const percentValid = totalPercent === 100;
  const amountValid = totalAmount === totalCost;

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

      {startDate && endDate && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          <strong>Note:</strong> Payment dates must be between{" "}
          {new Date(startDate).toLocaleDateString("vi-VN")} and{" "}
          {new Date(endDate).toLocaleDateString("vi-VN")}
        </div>
      )}

      {schedules.map((schedule, index) => (
        <Card key={schedule.id || index} className="p-4 bg-slate-50 border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_2fr_auto] gap-4">
            <div>
              <Label className="text-sm font-medium">Milestone Description</Label>
              <Input
                placeholder="Initial payment, Final delivery"
                value={schedule.milestone || ""}
                onChange={(e) => updateSchedule(index, "milestone", e.target.value)}
                className="bg-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Percent</Label>
              <Input
                type="number"
                placeholder="30"
                value={schedule.percent || ""}
                onChange={(e) => updateSchedule(index, "percent", parseFloat(e.target.value) || 0)}
                className="bg-white"
                min={0}
                max={100}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Amount (VND)</Label>
              <Input
                type="text"
                placeholder="3,000,000"
                value={formatCurrency(schedule.amount || 0)}
                disabled
                className="bg-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Due Date</Label>
              <DatePicker
                value={schedule.due_date || ""}
                onChange={(date) => updateSchedule(index, "due_date", date)}
                placeholder="Select date"
                className="bg-white"
                minDate={index === 0 ? minDate : schedules[index - 1]?.due_date || minDate}
                maxDate={maxDate}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Note</Label>
              <Input
                placeholder="Optional note"
                value={schedule.note || ""}
                onChange={(e) => updateSchedule(index, "note", e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="flex items-end">
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
        </Card>
      ))}

      {/* Summary Section */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
            <div className="text-sm text-blue-800">Milestones</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${
                percentValid ? "text-green-600" : "text-orange-600"
              }`}
            >
              {totalPercent}%
            </div>
            <div className="text-sm text-gray-600">Total Percent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalAmount || 0)}
            </div>
            <div className="text-sm text-purple-800">Total Amount</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${amountValid ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(totalCost - totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Validation message */}
        {(!percentValid || !amountValid) && (
          <div className="mt-3 text-center text-xs text-red-600">
            Total milestone percentage must equal 100%, and total amount must match the contract
            cost.
          </div>
        )}
      </Card>
    </div>
  );
};

export const CommissionLevels: React.FC<{
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4">
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

// UPDATED PaymentDateSelector - NO PERCENTAGES, JUST DATES
export const PaymentDateSelector: React.FC<PaymentDateSelectorProps> = ({
  cycle,
  value,
  onChange,
  startDate,
  endDate,
}) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const [warning, setWarning] = React.useState<string | null>(null);

  React.useEffect(() => {
    let msg: string | null = null;
    const monthDiff =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const durationMonths = monthDiff + 1;
    if (cycle === "ANNUALLY" && durationMonths < 12)
      msg = "Contract too short for Annual payment (≥ 12 months)";
    if (cycle === "QUARTERLY" && durationMonths < 3)
      msg = "Contract too short for Quarterly payment (≥ 3 months)";
    setWarning(msg);
  }, [cycle, start, end]);

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  // Preview
  interface PreviewItem {
    milestone: string;
    display: string;
  }
  const previewSchedule = React.useMemo<PreviewItem[]>(() => {
    if (!value) return [];

    if (cycle === "MONTHLY" && typeof value === "number") {
      const dates: Date[] = [];
      const day = value;
      const current = new Date(start);
      while (current <= end) {
        const maxDay = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
        const actualDay = Math.min(day, maxDay);
        dates.push(new Date(current.getFullYear(), current.getMonth(), actualDay));
        current.setMonth(current.getMonth() + 1);
      }
      return dates.map((d, idx) => ({ milestone: `Payment ${idx + 1}`, display: formatDate(d) }));
    }

    if (cycle === "QUARTERLY" && value && typeof value === "object") {
      const { day, month } = value;
      const current = new Date(start.getFullYear(), month - 1, day);
      const dates: Date[] = [];
      const temp = new Date(current);
      while (temp <= end) {
        dates.push(new Date(temp));
        temp.setMonth(temp.getMonth() + 3);
      }
      return dates.map((d, idx) => ({ milestone: `Quarter ${idx + 1}`, display: formatDate(d) }));
    }

    if (cycle === "ANNUALLY" && typeof value === "string") {
      return [{ milestone: "Annual Payment", display: formatDate(new Date(value)) }];
    }

    return [];
  }, [value, cycle, start, end]);

  const handleMonthlyChange = (val: number) => onChange(val);
  const handleQuarterlyChange = (day: number, month: number) => onChange({ day, month });

  return (
    <div className="space-y-3">
      {/* Select Fields */}
      {cycle === "MONTHLY" && (
        <div className="flex items-center gap-2">
          <Label>Day</Label>
          <Select
            value={value?.toString() || "1"}
            onValueChange={(v) => handleMonthlyChange(parseInt(v, 10))}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {Array.from({ length: 31 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {cycle === "QUARTERLY" && (
        <div className="flex items-center gap-2">
          <Label>Day</Label>
          <Select
            value={(value?.day || 1).toString()}
            onValueChange={(v) => handleQuarterlyChange(parseInt(v, 10), value?.month || 1)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {Array.from({ length: 31 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Month</Label>
          <Select
            value={(value?.month || 1).toString()}
            onValueChange={(v) => handleQuarterlyChange(value?.day || 1, parseInt(v, 10))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {cycle === "ANNUALLY" && (
        <DatePicker value={value} onChange={onChange} minDate={startDate} maxDate={endDate} />
      )}

      {warning && <p className="text-xs text-yellow-700">{warning}</p>}

      {/* Preview Cards - vertical scroll */}
      {previewSchedule.length > 0 && (
        <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
          {previewSchedule.map((p, idx) => (
            <Card key={idx} className="p-2 bg-green-50 border-green-200 text-sm">
              <div className="font-medium">{p.milestone}</div>
              <div className="text-gray-600">{p.display}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
