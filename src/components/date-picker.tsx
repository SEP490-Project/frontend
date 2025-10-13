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

    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
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
            variant="outline2"
            disabled={disabled}
            className={`h-11 w-full justify-start text-left font-normal ${
              !value ? "text-muted-foreground" : ""
            } ${error ? "border-red-500" : ""} ${
              disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(parseDate(value)!, dateFormat) : placeholder}
          </Button>
        </PopoverTrigger>

        {!disabled && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              autoFocus
              hidden={[
                ...(parseDate(minDate) ? [{ before: parseDate(minDate)! }] : []),
                ...(parseDate(maxDate) ? [{ after: parseDate(maxDate)! }] : []),
              ]}
            />
          </PopoverContent>
        )}
      </Popover>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
