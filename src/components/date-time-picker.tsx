import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateTimePickerProps {
  label?: string;
  value?: string; // Format: "2025-09-10 09:00:00"
  onChange: (dateTime: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

// Helper parse datetime safely
const parseDateTime = (dateTimeString?: string): { date?: Date; time?: string } => {
  if (!dateTimeString) return {};
  try {
    // Handle both formats: "2025-09-10 09:00:00" and "2024-10-16T14:30"
    let d: Date;
    if (dateTimeString.includes("T")) {
      d = new Date(dateTimeString);
    } else if (dateTimeString.includes(" ")) {
      // Parse "2025-09-10 09:00:00" format
      d = new Date(dateTimeString.replace(" ", "T"));
    } else {
      d = new Date(dateTimeString);
    }

    if (isNaN(d.getTime())) return {};

    const date = d;
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return { date, time };
  } catch {
    return {};
  }
};

// Format to required output: "2025-09-10 09:00:00"
const formatToOutput = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = "00"; // Always use 00 for seconds

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  className = "",
}) => {
  const [isDateOpen, setIsDateOpen] = useState(false);

  const { date: selectedDate, time: selectedTime } = parseDateTime(value);

  const handleDateSelect = (date?: Date) => {
    if (!date) {
      onChange("");
      return setIsDateOpen(false);
    }

    if (minDate && date < new Date(minDate)) return;
    if (maxDate && date > new Date(maxDate)) return;

    // Combine with existing time or default to 09:00
    const time = selectedTime || "09:00";
    const [hours, minutes] = time.split(":");
    const newDateTime = new Date(date);
    newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    onChange(formatToOutput(newDateTime));
    setIsDateOpen(false);
  };

  const handleTimeChange = (timeValue: string) => {
    if (!timeValue) return;

    // Combine with existing date or default to today
    const date = selectedDate || new Date();
    const [hours, minutes] = timeValue.split(":");
    const newDateTime = new Date(date);
    newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    onChange(formatToOutput(newDateTime));
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="flex gap-2">
        {/* Date Picker */}
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline2"
              disabled={disabled}
              className={`flex-1 justify-start text-left font-normal ${
                !selectedDate ? "text-muted-foreground" : ""
              } ${error ? "border-red-500" : ""} ${
                disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Pick date"}
            </Button>
          </PopoverTrigger>

          {!disabled && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                autoFocus
                disabled={[
                  ...(minDate ? [{ before: new Date(minDate) }] : []),
                  ...(maxDate ? [{ after: new Date(maxDate) }] : []),
                ]}
              />
            </PopoverContent>
          )}
        </Popover>

        {/* Time Input */}
        <div className="flex-1 relative">
          <Input
            type="time"
            value={selectedTime || ""}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={disabled}
            className={`${error ? "border-red-500" : ""} ${
              disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
            }`}
            placeholder="Select time"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DateTimePicker;
