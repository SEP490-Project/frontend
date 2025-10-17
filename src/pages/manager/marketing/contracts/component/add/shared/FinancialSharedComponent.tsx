import React, { useEffect, useMemo, useState } from "react";
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
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { FaDollarSign, FaCalendarDay, FaPercent, FaChartLine } from "react-icons/fa6";

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

export const PaymentSchedule: React.FC<{
  schedules: any[];
  totalCost: number;
  onUpdate: (schedules: any[]) => void;
  startDate?: string;
  endDate?: string;
}> = ({ schedules, totalCost, onUpdate, startDate, endDate }) => {
  // Thêm id tự tăng (number)
  const addSchedule = () => {
    const newId = schedules.length > 0 ? Math.max(...schedules.map((s) => s.id || 0)) + 1 : 1;
    const newSchedule = {
      id: newId,
      milestone: "",
      percent: 0,
      amount: 0,
      due_date: "",
      note: "", // ✅ thêm field note
    };
    onUpdate([...schedules, newSchedule]);
  };

  const updateSchedule = (index: number, field: string, value: any) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };

    // Tự tính amount nếu người dùng đổi % (ngược lại thì không động tới)
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

  const minDate = startDate || undefined;
  const maxDate = endDate || undefined;

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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Milestone */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium">Milestone Description</Label>
              <Input
                placeholder="e.g., Initial payment, Final delivery"
                value={schedule.milestone || ""}
                onChange={(e) => updateSchedule(index, "milestone", e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Percent */}
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

            {/* Amount */}
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

            {/* Due Date */}
            <div>
              <Label className="text-sm font-medium mb-1">Due Date</Label>
              <DatePicker
                value={schedule.due_date || ""}
                onChange={(date) => updateSchedule(index, "due_date", date)}
                placeholder="Select date"
                className="bg-white"
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>

            {/* ✅ Note field */}
            <div className="md:col-span-1">
              <Label className="text-sm font-medium">Note</Label>
              <Input
                placeholder="Optional note"
                value={schedule.note || ""}
                onChange={(e) => updateSchedule(index, "note", e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Remove button */}
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

      {/* Summary */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
            <div className="text-sm text-blue-800">Milestones</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${
                totalPercent === 100 ? "text-green-600" : "text-orange-600"
              }`}
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
              className={`text-2xl font-bold ${
                totalAmount === totalCost ? "text-green-600" : "text-red-600"
              }`}
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

// UPDATED PaymentDateSelector - NO PERCENTAGES, JUST DATES
export const PaymentDateSelector: React.FC<PaymentDateSelectorProps> = ({
  cycle,
  value,
  onChange,
  startDate,
  endDate,
}) => {
  const [warning, setWarning] = useState<string | null>(null);
  const start = useMemo(() => new Date(startDate), [startDate]);
  const end = useMemo(() => new Date(endDate), [endDate]);

  const monthDiff =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const durationMonths = monthDiff + 1;

  useEffect(() => {
    let msg: string | null = null;
    if (cycle === "ANNUALLY" && durationMonths < 12)
      msg = "Contract too short for Annual payment (requires ≥ 12 months)";
    if (cycle === "QUARTERLY" && durationMonths < 3)
      msg = "Contract too short for Quarterly payment (requires ≥ 3 months)";
    setWarning(msg);
  }, [cycle, durationMonths]);

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  const handleSelectDate = (dateString: string) => {
    if (!dateString) {
      onChange(null);
      return;
    }

    const baseDate = new Date(dateString);
    const baseDay = baseDate.getDate();

    if (cycle === "MONTHLY") {
      const dates: string[] = [];
      const current = new Date(start);
      while (current <= end) {
        const y = current.getFullYear();
        const m = current.getMonth();
        const maxDay = new Date(y, m + 1, 0).getDate();
        const actualDay = Math.min(baseDay, maxDay);
        dates.push(formatDate(new Date(y, m, actualDay)));
        current.setMonth(current.getMonth() + 1);
      }
      onChange(baseDay.toString()); // gửi chỉ số ngày
    } else if (cycle === "QUARTERLY") {
      const quarterlyPayments: { id: number; day: number; month: number; year: number }[] = [];
      const current = new Date(baseDate);
      let id = 1;

      while (current <= end) {
        quarterlyPayments.push({
          id: id++,
          day: current.getDate(),
          month: current.getMonth() + 1, // getMonth() returns 0-11, so add 1
          year: current.getFullYear(),
        });
        current.setMonth(current.getMonth() + 3);
      }

      // Add final payment if it doesn't exist and end date is different
      const lastPayment = quarterlyPayments[quarterlyPayments.length - 1];
      if (
        lastPayment &&
        !(
          lastPayment.day === end.getDate() &&
          lastPayment.month === end.getMonth() + 1 &&
          lastPayment.year === end.getFullYear()
        )
      ) {
        quarterlyPayments.push({
          id: id,
          day: end.getDate(),
          month: end.getMonth() + 1,
          year: end.getFullYear(),
        });
      }

      onChange(quarterlyPayments);
    } else if (cycle === "ANNUALLY") {
      const tzOffset = baseDate.getTimezoneOffset() * 60000;
      const localISO = new Date(baseDate.getTime() - tzOffset).toISOString().split("T")[0];
      onChange(localISO);
    }
  };

  interface PreviewItem {
    milestone: string;
    display: string;
  }

  const previewSchedule = useMemo<PreviewItem[]>(() => {
    if (!value) return [];

    if (cycle === "MONTHLY" && typeof value === "string") {
      const dates: Date[] = [];
      const current = new Date(start);
      const baseDay = parseInt(value, 10);
      while (current <= end) {
        const y = current.getFullYear();
        const m = current.getMonth();
        const maxDay = new Date(y, m + 1, 0).getDate();
        const actualDay = Math.min(baseDay, maxDay);
        dates.push(new Date(y, m, actualDay));
        current.setMonth(current.getMonth() + 1);
      }
      return dates.map((d, idx) => ({
        milestone: `Payment ${idx + 1}`,
        display: formatDate(d),
      }));
    }

    if (cycle === "QUARTERLY" && Array.isArray(value)) {
      return value.map((payment: { id: number; day: number; month: number; year: number }) => ({
        milestone: `Quarterly Payment ${payment.id}`,
        display: `${String(payment.day).padStart(2, "0")}/${String(payment.month).padStart(2, "0")}/${payment.year}`,
      }));
    }

    if (cycle === "ANNUALLY" && typeof value === "string")
      return [{ milestone: "Annual Payment", display: value }];

    return [];
  }, [value, cycle, start, end]);

  return (
    <div className="space-y-4">
      <Card
        className={`p-4 border transition-colors ${
          warning ? "border-yellow-400 bg-yellow-50" : "border-blue-100 bg-blue-50"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold text-blue-900">
            {cycle === "MONTHLY"
              ? "Select day for monthly payments"
              : cycle === "QUARTERLY"
                ? "Select reference date for quarterly payments"
                : "Select date for annual payment"}
          </Label>
          <span className="text-xs text-gray-500 italic">
            Contract: {start.toLocaleDateString("vi-VN")} → {end.toLocaleDateString("vi-VN")}
          </span>
        </div>

        <DatePicker
          value={cycle === "MONTHLY" ? "" : value}
          onChange={handleSelectDate}
          placeholder="Choose date"
          minDate={startDate}
          maxDate={endDate}
        />

        {warning && (
          <div className="mt-3 flex items-start gap-2 text-sm text-yellow-700">
            <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-600" />
            <p>{warning}</p>
          </div>
        )}
      </Card>

      {previewSchedule.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <FaCalendarDay className="w-4 h-4" />
            Selected Payment Dates ({previewSchedule.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {previewSchedule.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm bg-white p-3 rounded-md"
              >
                <span className="font-medium">{p.milestone}</span>
                <span className="text-gray-600">{p.display}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
