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
import { format } from "date-fns";

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
  depositPercent?: number;
}> = ({ schedules, totalCost, onUpdate, startDate, endDate, depositPercent = 0 }) => {
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

      // Calculate max allowed percentage (100% - deposit percentage)
      const maxAllowedPercent = 100 - depositPercent;

      if (otherTotal + newPercent > maxAllowedPercent) {
        newPercent = Math.max(0, maxAllowedPercent - otherTotal);
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

  // Calculate expected totals considering deposit
  const expectedPercent = 100 - depositPercent;
  const expectedAmount = totalCost ? Math.round((totalCost * expectedPercent) / 100) : 0;

  const percentValid = totalPercent === expectedPercent;
  const amountValid = totalAmount === expectedAmount;

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

      {depositPercent > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <strong>Deposit Info:</strong> {depositPercent}% (
          {formatCurrency((totalCost * depositPercent) / 100)} VND) is reserved for deposit. Payment
          schedule can only cover the remaining {100 - depositPercent}% (
          {formatCurrency((totalCost * (100 - depositPercent)) / 100)} VND).
        </div>
      )}

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
              {totalPercent}% / {expectedPercent}%
            </div>
            <div className="text-sm text-gray-600">Schedule Percent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalAmount || 0)}
            </div>
            <div className="text-sm text-purple-800">Schedule Amount</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${amountValid ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(expectedAmount - totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>

        {/* Validation message */}
        {(!percentValid || !amountValid) && (
          <div className="mt-3 text-center text-xs text-red-600">
            {depositPercent > 0
              ? `Payment schedule must equal ${expectedPercent}% (${depositPercent}% is reserved for deposit). Total amount should be ${formatCurrency(expectedAmount)} VND.`
              : "Total milestone percentage must equal 100%, and total amount must match the contract cost."}
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
                value={
                  level.multiplier !== undefined && level.multiplier !== null
                    ? level.multiplier
                    : ""
                }
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue === "") {
                    updateLevel(index, "multiplier", null);
                  } else {
                    const parsedValue = parseFloat(inputValue);
                    updateLevel(index, "multiplier", isNaN(parsedValue) ? null : parsedValue);
                  }
                }}
                onBlur={(e) => {
                  // Set default value of 1.0 if empty on blur
                  if (
                    e.target.value === "" ||
                    level.multiplier === null ||
                    level.multiplier === undefined
                  ) {
                    updateLevel(index, "multiplier", 1.0);
                  }
                }}
                className="bg-white"
                min="0"
                max="10"
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

export const PaymentDateSelector: React.FC<PaymentDateSelectorProps> = ({
  cycle,
  value,
  onChange,
  onScheduleGenerated,
  startDate,
  endDate,
}) => {
  // Hàm trợ giúp để chuẩn hóa ngày về 00:00:00.000
  const normalizeDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const start = normalizeDate(new Date(startDate));
  const end = normalizeDate(new Date(endDate));

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

  interface PreviewItem {
    milestone: string;
    display: string;
  }
  // Generate schedule data separately without calling onScheduleGenerated
  const generateScheduleData = React.useMemo((): {
    dates: Date[];
    schedule: { id: number; day: number; month: number; year: number }[];
  } => {
    if (!value) return { dates: [], schedule: [] };

    if (cycle === "MONTHLY" && typeof value === "string") {
      const dates: Date[] = [];
      const day = parseInt(value, 10);

      let current = normalizeDate(new Date(start.getFullYear(), start.getMonth(), 1));
      const firstPaymentDay = Math.min(
        day,
        new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate(),
      );
      let firstPaymentDate = normalizeDate(
        new Date(current.getFullYear(), current.getMonth(), firstPaymentDay),
      );

      if (firstPaymentDate < start) {
        firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
        firstPaymentDate = normalizeDate(firstPaymentDate);
      }

      current = firstPaymentDate;

      if (current > end) return { dates: [], schedule: [] };

      while (current <= end) {
        dates.push(new Date(current));

        let nextMonth = current.getMonth() + 1;
        let nextYear = current.getFullYear();
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }

        const maxDayInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
        const actualDayForNextMonth = Math.min(day, maxDayInNextMonth);

        current = normalizeDate(new Date(nextYear, nextMonth, actualDayForNextMonth));
      }

      // Thêm ngày kết thúc hợp đồng nếu chưa có
      if (end >= start && !dates.some((d) => d.getTime() === end.getTime())) {
        dates.push(new Date(end));
      }

      dates.sort((a, b) => a.getTime() - b.getTime());

      const schedule = dates.map((d, idx) => ({
        id: idx + 1,
        day: d.getDate(),
        month: d.getMonth() + 1, // Convert to 1-based month
        year: d.getFullYear(),
      }));

      return { dates, schedule };
    }

    if (cycle === "QUARTERLY" && value && typeof value === "string") {
      try {
        const { day: selectedDay, month: selectedMonth1Indexed } = JSON.parse(value); // month là 1-indexed
        const dates: Date[] = [];

        let currentYear = start.getFullYear();
        let currentMonth0Indexed = selectedMonth1Indexed - 1; // 0-indexed month

        // Tính toán ngày thanh toán đầu tiên
        let firstPaymentDateCandidate: Date;
        do {
          // Tạo ngày mới bằng cách đặt năm và tháng trước, sau đó điều chỉnh ngày
          const tempDate = new Date(currentYear, currentMonth0Indexed, 1); // Đặt về ngày 1 trước để tránh tràn tháng
          const maxDayInCurrentMonth = new Date(
            tempDate.getFullYear(),
            tempDate.getMonth() + 1,
            0,
          ).getDate();
          const actualDay = Math.min(selectedDay, maxDayInCurrentMonth);
          firstPaymentDateCandidate = normalizeDate(
            new Date(currentYear, currentMonth0Indexed, actualDay),
          );

          if (firstPaymentDateCandidate < start) {
            // Nếu ngày này trước ngày bắt đầu hợp đồng, chuyển sang quý tiếp theo
            currentMonth0Indexed += 3;
            if (currentMonth0Indexed > 11) {
              currentMonth0Indexed -= 12;
              currentYear++;
            }
          }
        } while (firstPaymentDateCandidate < start);

        if (firstPaymentDateCandidate > end) return { dates: [], schedule: [] };

        dates.push(firstPaymentDateCandidate);
        let currentQuarterDate = new Date(firstPaymentDateCandidate); // Bắt đầu từ ngày đã tính

        while (true) {
          // Luôn tạo một Date object mới hoặc reset ngày về 1 trước khi setMonth
          // để tránh hiệu ứng tràn ngày của Date.setMonth()
          let nextPaymentMonth = currentQuarterDate.getMonth() + 3;
          let nextPaymentYear = currentQuarterDate.getFullYear();

          if (nextPaymentMonth > 11) {
            // Nếu vượt quá tháng 11, tăng năm
            nextPaymentMonth -= 12;
            nextPaymentYear++;
          }

          // Tạo một Date object tạm thời cho tháng mới (đặt ngày là 1)
          const tempNextDate = new Date(nextPaymentYear, nextPaymentMonth, 1);
          // Sau đó, tìm số ngày tối đa của tháng đó
          const maxDayInNextQuarterMonth = new Date(
            tempNextDate.getFullYear(),
            tempNextDate.getMonth() + 1,
            0,
          ).getDate();
          // Và điều chỉnh ngày về giá trị đã chọn ban đầu, nhưng không vượt quá maxDay
          const actualDayForNextQuarter = Math.min(selectedDay, maxDayInNextQuarterMonth);

          currentQuarterDate = normalizeDate(
            new Date(nextPaymentYear, nextPaymentMonth, actualDayForNextQuarter),
          );

          if (currentQuarterDate > end) break;
          dates.push(new Date(currentQuarterDate));
        }

        // Thêm ngày kết thúc hợp đồng nếu chưa có
        if (end >= start && !dates.some((d) => d.getTime() === end.getTime())) {
          dates.push(new Date(end));
        }

        dates.sort((a, b) => a.getTime() - b.getTime());

        const schedule = dates.map((d, idx) => ({
          id: idx + 1,
          day: d.getDate(),
          month: d.getMonth() + 1, // Convert to 1-based month
          year: d.getFullYear(),
        }));

        return { dates, schedule };
      } catch (e) {
        console.error("Error parsing quarterly value:", e);
        return { dates: [], schedule: [] };
      }
    }

    if (cycle === "ANNUALLY" && typeof value === "string") {
      const dates: Date[] = [];
      const selectedDateFromValue = normalizeDate(new Date(value));
      const selectedMonth = selectedDateFromValue.getMonth();
      const selectedDay = selectedDateFromValue.getDate();

      const startYear = start.getFullYear();
      const oneYearAfterStart = new Date(start);
      oneYearAfterStart.setFullYear(oneYearAfterStart.getFullYear() + 1);

      // Giới hạn ngày đầu trả
      const maxFirstPayment = end < oneYearAfterStart ? end : oneYearAfterStart;

      // Nếu selectedDate < start hoặc > maxFirstPayment → điều chỉnh về start
      let currentYear = selectedDateFromValue.getFullYear();
      let firstPossiblePaymentDate = normalizeDate(
        new Date(currentYear, selectedMonth, selectedDay),
      );
      if (firstPossiblePaymentDate < start || firstPossiblePaymentDate > maxFirstPayment) {
        firstPossiblePaymentDate = normalizeDate(new Date(startYear, selectedMonth, selectedDay));
        if (firstPossiblePaymentDate < start) {
          firstPossiblePaymentDate = start;
        }
      }

      // Generate các annual payment từ firstPossiblePaymentDate
      currentYear = firstPossiblePaymentDate.getFullYear();
      while (true) {
        const maxDayInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
        const actualDay = Math.min(selectedDay, maxDayInMonth);
        const annualDate = normalizeDate(new Date(currentYear, selectedMonth, actualDay));

        if (annualDate > end) break;
        if (annualDate >= start && !dates.some((d) => d.getTime() === annualDate.getTime())) {
          dates.push(new Date(annualDate));
        }
        currentYear++;
      }

      // Thêm ngày kết thúc hợp đồng nếu chưa có
      if (end >= start && !dates.some((d) => d.getTime() === end.getTime())) {
        dates.push(new Date(end));
      }

      dates.sort((a, b) => a.getTime() - b.getTime());

      const schedule = dates.map((d, idx) => ({
        id: idx + 1,
        day: d.getDate(),
        month: d.getMonth() + 1, // Convert to 1-based month
        year: d.getFullYear(),
      }));

      return { dates, schedule };
    }

    return { dates: [], schedule: [] };
  }, [value, cycle, start, end]);

  // Use useEffect to call onScheduleGenerated to avoid infinite loops - only for QUARTERLY
  const scheduleStringRef = React.useRef<string>("");
  React.useEffect(() => {
    if (onScheduleGenerated && cycle === "QUARTERLY" && generateScheduleData.schedule.length > 0) {
      const currentScheduleString = JSON.stringify(generateScheduleData.schedule);
      if (scheduleStringRef.current !== currentScheduleString) {
        scheduleStringRef.current = currentScheduleString;
        onScheduleGenerated(generateScheduleData.schedule);
      }
    }
  }, [onScheduleGenerated, cycle, generateScheduleData.schedule]);

  // Generate preview items for display
  const previewSchedule: PreviewItem[] = React.useMemo(() => {
    const { dates } = generateScheduleData;

    if (cycle === "MONTHLY") {
      return dates.map((d: Date, idx: number) => ({
        milestone:
          d.getTime() === end.getTime() && idx === dates.length - 1
            ? "Final Payment"
            : `Payment ${idx + 1}`,
        display: formatDate(d),
      }));
    }

    if (cycle === "QUARTERLY") {
      return dates.map((d: Date, idx: number) => ({
        milestone:
          d.getTime() === end.getTime() && idx === dates.length - 1
            ? "Final Payment"
            : `Quarter ${idx + 1}`,
        display: formatDate(d),
      }));
    }

    if (cycle === "ANNUALLY") {
      return dates.map((d: Date, idx: number) => ({
        milestone:
          d.getTime() === end.getTime() && idx === dates.length - 1
            ? "Final Payment"
            : `Annual Payment ${idx + 1}`,
        display: formatDate(d),
      }));
    }

    return [];
  }, [generateScheduleData, cycle, end, formatDate]);

  let maxFirstPayment = new Date(start);
  maxFirstPayment.setFullYear(maxFirstPayment.getFullYear() + 1);
  if (maxFirstPayment > end) maxFirstPayment = end;

  const handleMonthlyChange = (val: number) => onChange(val.toString());
  const handleQuarterlyChange = (day: number, month: number) =>
    onChange(JSON.stringify({ day, month }));
  const handleAnnualChange = (date: Date | string | undefined) => {
    if (date instanceof Date) {
      // DatePicker của bạn đã định dạng thành "yyyy-MM-dd",
      // nên chúng ta có thể truyền thẳng chuỗi này.
      // Chỉ cần đảm bảo date là hợp lệ trước khi format.
      onChange(format(date, "yyyy-MM-dd"));
    } else if (typeof date === "string") {
      onChange(date);
    } else {
      onChange(undefined);
    }
  };

  // Hàm trợ giúp để lấy số ngày tối đa trong một tháng cụ thể của một năm cụ thể
  const getDaysInMonth = (year: number, month: number): number => {
    // month là 0-indexed (0-11) cho Date constructor
    // month + 1, 0 sẽ trả về ngày cuối cùng của tháng trước
    return new Date(year, month + 1, 0).getDate();
  };

  // State cục bộ để lưu trữ ngày và tháng cho Quarterly để tính toán số ngày tối đa
  // Khởi tạo từ `value` prop
  const [quarterlySelectedDay, setQuarterlySelectedDay] = React.useState<number>(() => {
    try {
      return value && cycle === "QUARTERLY" ? JSON.parse(value).day || 1 : 1;
    } catch {
      return 1;
    }
  });
  const [quarterlySelectedMonth, setQuarterlySelectedMonth] = React.useState<number>(() => {
    try {
      return value && cycle === "QUARTERLY" ? JSON.parse(value).month || 1 : 1;
    } catch {
      return 1;
    }
  });

  // Calculate available months for Quarterly selection
  const availableQuarterlyMonths = React.useMemo(() => {
    const months: { value: number; label: string }[] = [];
    const startMonth = start.getMonth() + 1; // Convert to 1-based
    const endMonth = end.getMonth() + 1;
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    // Get current month to determine quarter
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Determine current quarter (0-3)
    const getCurrentQuarter = (month: number) => Math.floor((month - 1) / 3);
    const currentQuarter = getCurrentQuarter(currentMonth);

    // Get months of a quarter
    const getQuarterMonths = (quarter: number) => {
      const baseMonth = quarter * 3 + 1;
      return [baseMonth, baseMonth + 1, baseMonth + 2];
    };

    // Include current quarter and next quarter
    const quartersToInclude = [currentQuarter, (currentQuarter + 1) % 4];

    for (const quarter of quartersToInclude) {
      const quarterMonths = getQuarterMonths(quarter);

      for (const month of quarterMonths) {
        // Check if this month is within contract period
        let isValidMonth = false;

        // For current year - check against current month
        if (currentYear >= startYear && currentYear <= endYear) {
          if (currentYear === startYear && currentYear === endYear) {
            // Contract within single year
            isValidMonth = month >= Math.max(startMonth, currentMonth) && month <= endMonth;
          } else if (currentYear === startYear) {
            // First year of contract
            isValidMonth = month >= Math.max(startMonth, currentMonth);
          } else if (currentYear === endYear) {
            // Last year of contract
            isValidMonth = month <= endMonth;
          } else {
            // Middle years of contract - all months valid
            isValidMonth = true;
          }
        }

        // For next quarter that crosses into next year
        if (!isValidMonth && quarter === (currentQuarter + 1) % 4) {
          const nextYear = currentYear + (currentQuarter === 3 ? 1 : 0);
          if (nextYear <= endYear) {
            if (nextYear === endYear) {
              isValidMonth = month <= endMonth;
            } else {
              isValidMonth = true;
            }
          }
        }

        if (isValidMonth && !months.some((m) => m.value === month)) {
          months.push({
            value: month,
            label: `Month ${month}`,
          });
        }
      }
    }

    // Sort by month order
    return months.sort((a, b) => a.value - b.value);
  }, [start, end]);

  // Cập nhật state cục bộ khi `value` hoặc `cycle` từ props thay đổi
  React.useEffect(() => {
    if (cycle === "QUARTERLY" && value && availableQuarterlyMonths.length > 0) {
      try {
        const parsed = JSON.parse(value);
        const newDay = parsed.day || 1;
        const newMonth = parsed.month || 1;

        // Kiểm tra xem tháng có trong danh sách available không
        const isMonthAvailable = availableQuarterlyMonths.some((m) => m.value === newMonth);

        if (isMonthAvailable) {
          // Chỉ cập nhật nếu giá trị từ prop khác với giá trị hiện tại trong state
          if (newMonth !== quarterlySelectedMonth) setQuarterlySelectedMonth(newMonth);

          // Kiểm tra và điều chỉnh ngày nếu cần
          const yearForCalc = start.getFullYear();
          const maxDays = getDaysInMonth(yearForCalc, newMonth - 1);
          let minDay = 1;

          if (newMonth === start.getMonth() + 1 && start.getFullYear() === yearForCalc) {
            minDay = start.getDate();
          }

          const adjustedDay = Math.min(Math.max(newDay, minDay), maxDays);
          if (adjustedDay !== quarterlySelectedDay) setQuarterlySelectedDay(adjustedDay);
        } else {
          // Reset về tháng đầu tiên có sẵn
          const firstAvailableMonth = availableQuarterlyMonths[0]?.value || 1;
          if (firstAvailableMonth !== quarterlySelectedMonth)
            setQuarterlySelectedMonth(firstAvailableMonth);

          // Reset ngày về giá trị hợp lệ cho tháng mới
          const yearForCalc = start.getFullYear();
          let minDay = 1;
          if (firstAvailableMonth === start.getMonth() + 1 && start.getFullYear() === yearForCalc) {
            minDay = start.getDate();
          }
          if (minDay !== quarterlySelectedDay) setQuarterlySelectedDay(minDay);
        }
      } catch {
        // Reset về giá trị mặc định
        const firstAvailableMonth = availableQuarterlyMonths[0]?.value || 1;
        if (firstAvailableMonth !== quarterlySelectedMonth)
          setQuarterlySelectedMonth(firstAvailableMonth);

        const yearForCalc = start.getFullYear();
        let minDay = 1;
        if (firstAvailableMonth === start.getMonth() + 1 && start.getFullYear() === yearForCalc) {
          minDay = start.getDate();
        }
        if (minDay !== quarterlySelectedDay) setQuarterlySelectedDay(minDay);
      }
    } else if (cycle !== "QUARTERLY") {
      // Reset nếu chuyển sang cycle khác
      if (quarterlySelectedDay !== 1) setQuarterlySelectedDay(1);
      if (quarterlySelectedMonth !== 1) setQuarterlySelectedMonth(1);
    } else if (cycle === "QUARTERLY" && availableQuarterlyMonths.length > 0 && !value) {
      // Khởi tạo giá trị mặc định khi chưa có value
      const firstAvailableMonth = availableQuarterlyMonths[0]?.value || 1;
      setQuarterlySelectedMonth(firstAvailableMonth);

      const yearForCalc = start.getFullYear();
      let minDay = 1;
      if (firstAvailableMonth === start.getMonth() + 1 && start.getFullYear() === yearForCalc) {
        minDay = start.getDate();
      }
      setQuarterlySelectedDay(minDay);
    }
  }, [cycle, value, availableQuarterlyMonths, start]);

  // Tính toán số ngày tối đa và ngày tối thiểu cho tháng được chọn hiện tại trong QUARTERLY
  const quarterlyDayConstraints = React.useMemo(() => {
    // Sử dụng năm của start date để tính toán
    const yearForCalc = start.getFullYear();
    const maxDays = getDaysInMonth(yearForCalc, quarterlySelectedMonth - 1);

    let minDay = 1;

    // Nếu tháng được chọn trùng với tháng start_date, thì ngày phải >= ngày start_date
    if (quarterlySelectedMonth === start.getMonth() + 1 && start.getFullYear() === yearForCalc) {
      minDay = start.getDate();
    }

    return { minDay, maxDays };
  }, [quarterlySelectedMonth, start]);

  return (
    <div className="space-y-3">
      {/* Select Fields */}
      {cycle === "MONTHLY" && (
        <div className="flex items-center gap-2">
          <Label htmlFor="monthly-day-select">Monthly Day</Label>
          <Select
            value={value?.toString() || "1"}
            onValueChange={(v) => handleMonthlyChange(parseInt(v, 10))}
          >
            <SelectTrigger id="monthly-day-select" className="w-24">
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
        <div className="flex flex-col gap-4">
          {/* Hiển thị tháng trước */}
          <div className="flex items-center gap-2">
            <Label htmlFor="quarterly-month-select">Quarterly Month</Label>
            <Select
              value={quarterlySelectedMonth.toString()} // Sử dụng state cục bộ
              onValueChange={(v) => {
                const newMonth = parseInt(v, 10);
                setQuarterlySelectedMonth(newMonth); // Cập nhật state cục bộ

                // Tính lại constraints cho tháng mới
                const yearForCalc = start.getFullYear();
                const newMaxDays = getDaysInMonth(yearForCalc, newMonth - 1);

                let newMinDay = 1;
                // Nếu tháng được chọn trùng với tháng start_date, thì ngày phải >= ngày start_date
                if (newMonth === start.getMonth() + 1 && start.getFullYear() === yearForCalc) {
                  newMinDay = start.getDate();
                }

                let adjustedDay = quarterlySelectedDay;
                // Nếu ngày hiện tại nhỏ hơn minDay hoặc lớn hơn maxDays, điều chỉnh
                if (quarterlySelectedDay < newMinDay) {
                  adjustedDay = newMinDay;
                  setQuarterlySelectedDay(newMinDay);
                } else if (quarterlySelectedDay > newMaxDays) {
                  adjustedDay = newMaxDays;
                  setQuarterlySelectedDay(newMaxDays);
                }

                handleQuarterlyChange(adjustedDay, newMonth); // Gọi onChange của prop với ngày đã điều chỉnh
              }}
            >
              <SelectTrigger id="quarterly-month-select" className="w-40">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {availableQuarterlyMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hiển thị ngày sau khi đã chọn tháng */}
          <div className="flex items-center gap-2">
            <Label htmlFor="quarterly-day-select">Quarterly Day</Label>
            <Select
              value={quarterlySelectedDay.toString()} // Sử dụng state cục bộ
              onValueChange={(v) => {
                const newDay = parseInt(v, 10);
                setQuarterlySelectedDay(newDay); // Cập nhật state cục bộ
                handleQuarterlyChange(newDay, quarterlySelectedMonth); // Gọi onChange của prop
              }}
            >
              <SelectTrigger id="quarterly-day-select" className="w-24">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {/* Render số ngày dựa trên constraints */}
                {Array.from(
                  { length: quarterlyDayConstraints.maxDays - quarterlyDayConstraints.minDay + 1 },
                  (_, i) => {
                    const day = quarterlyDayConstraints.minDay + i;
                    return (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    );
                  },
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Information */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Only showing months from current and next quarter within contract period</p>
            {quarterlySelectedMonth === start.getMonth() + 1 &&
              start.getFullYear() === new Date().getFullYear() && (
                <p>• Day must be from {start.getDate()} onwards (after contract start date)</p>
              )}
            <p>
              • System will automatically calculate payment periods based on selected month and day
            </p>
          </div>
        </div>
      )}

      {cycle === "ANNUALLY" && (
        <div className="flex items-center gap-2">
          <Label htmlFor="annual-date-picker">Annual Payment Date</Label>
          <DatePicker
            value={value}
            onChange={handleAnnualChange}
            minDate={format(start, "yyyy-MM-dd")}
            maxDate={format(maxFirstPayment, "yyyy-MM-dd")}
          />
        </div>
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
