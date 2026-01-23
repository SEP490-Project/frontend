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
  value?: string;
  onChange: (dateTime: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  minDateTime?: string; // Full datetime string for time validation (e.g., "2026-01-24 12:09")
  className?: string;
}

const createLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// Parse minDateTime to get minimum time for a specific date
const parseMinDateTime = (
  minDateTime?: string,
): { date: Date; hours: number; minutes: number } | null => {
  if (!minDateTime) return null;
  try {
    const [datePart, timePart] = minDateTime.split(" ");
    const [y, m, d] = datePart.split("-").map(Number);
    const [h, min] = (timePart || "00:00").split(":").map(Number);
    return { date: new Date(y, m - 1, d), hours: h, minutes: min };
  } catch {
    return null;
  }
};

// Check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Get minimum time string for input if on the same day as minDateTime
const getMinTime = (selectedDate: Date | undefined, minDateTime?: string): string | undefined => {
  if (!selectedDate || !minDateTime) return undefined;
  const parsed = parseMinDateTime(minDateTime);
  if (!parsed) return undefined;
  if (isSameDay(selectedDate, parsed.date)) {
    return `${String(parsed.hours).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")}`;
  }
  return undefined;
};

const parseDateTime = (dateTimeString?: string): { date?: Date; time?: string } => {
  if (!dateTimeString) return {};

  let d: Date;

  try {
    if (dateTimeString.includes("T")) {
      d = new Date(dateTimeString);
    } else if (dateTimeString.includes(" ")) {
      const [datePart, timePart] = dateTimeString.split(" ");
      const [y, m, day] = datePart.split("-").map(Number);
      const [h, min] = timePart.split(":").map(Number);
      d = new Date(y, m - 1, day, h, min);
    } else {
      d = createLocalDate(dateTimeString);
    }

    if (isNaN(d.getTime())) return {};

    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return { date, time };
  } catch {
    return {};
  }
};

const formatToOutput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:00`;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Pick date and time",
  error,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  minDateTime,
  className = "",
}) => {
  const [isDateOpen, setIsDateOpen] = useState(false);

  const { date: selectedDate, time: selectedTime } = parseDateTime(value);

  // Calculate minimum time based on selected date and minDateTime
  const minTime = getMinTime(selectedDate, minDateTime);

  const handleDateSelect = (date?: Date) => {
    if (!date) {
      onChange("");
      return setIsDateOpen(false);
    }

    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (minDate && localDate < createLocalDate(minDate)) return;
    if (maxDate && localDate > createLocalDate(maxDate)) return;

    // Determine the appropriate time for the new date
    let time = selectedTime || "09:00";

    // If selecting the minimum date, ensure time is not before minimum time
    const newMinTime = getMinTime(localDate, minDateTime);
    if (newMinTime) {
      const [minH, minM] = newMinTime.split(":").map(Number);
      const [curH, curM] = time.split(":").map(Number);
      if (curH < minH || (curH === minH && curM < minM)) {
        time = newMinTime;
      }
    }

    const [hours, minutes] = time.split(":");
    const newDateTime = new Date(localDate);
    newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    onChange(formatToOutput(newDateTime));
    setIsDateOpen(false);
  };

  const handleTimeChange = (timeValue: string) => {
    if (!timeValue) return;

    const [hours, minutes] = timeValue.split(":").map(Number);
    const date = selectedDate || new Date();
    const newDateTime = new Date(date);
    newDateTime.setHours(hours, minutes, 0, 0);

    // Validate against minimum datetime if on the same day
    if (minTime && selectedDate) {
      const [minH, minM] = minTime.split(":").map(Number);
      if (hours < minH || (hours === minH && minutes < minM)) {
        // Set to minimum time instead
        newDateTime.setHours(minH, minM, 0, 0);
      }
    }

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
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={`flex-1 justify-start text-left font-normal ${
                !selectedDate ? "text-muted-foreground" : ""
              } ${error ? "border-red-500" : ""} ${
                disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate
                ? format(selectedDate, "dd/MM/yyyy")
                : placeholder.split(" and ")[0] || "Pick date"}
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
                  ...(minDate ? [{ before: createLocalDate(minDate) }] : []),
                  ...(maxDate ? [{ after: createLocalDate(maxDate) }] : []),
                ]}
              />
            </PopoverContent>
          )}
        </Popover>

        <div className="flex-1 relative">
          <Input
            type="time"
            value={selectedTime || ""}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={disabled}
            className={`${error ? "border-red-500" : ""} ${
              disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
            }`}
            placeholder="HH:MM"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DateTimePicker;
