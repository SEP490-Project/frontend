import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  dateFormat?: string;
  className?: string;
  onlyPast?: boolean; // chỉ cho chọn ngày trong quá khứ (bao gồm hôm nay)
  explainLine?: string; // dòng giải thích màu đỏ
}

// Helper parse date safely
const parseDate = (dateString?: string): Date | undefined => {
  if (!dateString) return undefined;
  try {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? undefined : d;
  } catch {
    return undefined;
  }
};

// Safe format function
const safeFormat = (date: Date | undefined, formatStr: string): string | null => {
  if (!date) return null;
  try {
    return format(date, formatStr);
  } catch {
    return null;
  }
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
  error,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  dateFormat = "dd/MM/yyyy",
  className = "",
  onlyPast = false,
  explainLine,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = parseDate(value);

  const handleSelect = (date?: Date) => {
    if (!date) {
      onChange("");
      return setIsOpen(false);
    }

    if (minDate && date < new Date(minDate)) return;
    if (maxDate && date > new Date(maxDate)) return;
    if (onlyPast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date > today) return;
    }

    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  // Safe display text
  const getDisplayText = () => {
    if (!value) return placeholder;
    const formattedDate = safeFormat(selectedDate, dateFormat);
    return formattedDate || placeholder;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={`w-full justify-start text-left font-normal ${
              !value ? "text-muted-foreground" : ""
            } ${error ? "border-red-500" : ""} ${
              disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getDisplayText()}
          </Button>
        </PopoverTrigger>

        {!disabled && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              captionLayout="dropdown"
              startMonth={new Date(1900, 0, 1)}
              endMonth={new Date(2099, 11, 31)}
              weekStartsOn={0}
              autoFocus
              disabled={(date) => {
                // Giới hạn signed_date: chỉ được chọn trong khoảng 2 tháng trước đến hôm nay
                if (explainLine === "signed_date") {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const twoMonthsAgo = new Date(today);
                  twoMonthsAgo.setMonth(today.getMonth() - 2);
                  if (date < twoMonthsAgo || date > today) return true;
                }
                // Giới hạn start_date: phải sau ngày ký và sau hôm nay
                if (explainLine && explainLine.startsWith("start_date:")) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const signedDateStr = explainLine.replace("start_date:", "").trim();
                  const signedDate = parseDate(signedDateStr);

                  // Phải sau hôm nay
                  if (date <= today) return true;

                  // Nếu có signed_date, phải sau signed_date
                  if (signedDate) {
                    signedDate.setHours(0, 0, 0, 0);
                    if (date <= signedDate) return true;
                  }
                }
                // Giới hạn end_date: chỉ được chọn sau start_date (không bắt buộc 1 tháng)
                if (explainLine && explainLine.startsWith("end_date:")) {
                  const minDateStr = explainLine.replace("end_date:", "").trim();
                  const minDate = parseDate(minDateStr);
                  if (minDate) {
                    minDate.setHours(0, 0, 0, 0);
                    if (date <= minDate) return true;
                  }
                }
                if (minDate && date < parseDate(minDate)!) return true;
                if (maxDate && date > parseDate(maxDate)!) return true;
                if (onlyPast) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (date > today) return true;
                }
                return false;
              }}
            />
          </PopoverContent>
        )}
      </Popover>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {explainLine === "signed_date" && (
        <p className="text-xs text-gray-500 mt-1">
          *You can only select a date within the last 2 months up to today.
        </p>
      )}
      {explainLine && explainLine.startsWith("end_date:") && (
        <p className="text-xs text-gray-500 mt-1">*End date must be after the start date.</p>
      )}
    </div>
  );
};

export default DatePicker;
