import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface DurationPickerProps {
  label?: string;
  value?: string; // Format: "1H", "2H30m", "0H30m"
  onChange: (duration: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxHours?: number;
  className?: string;
}

// Parse duration string to hours and minutes
const parseDuration = (duration?: string): { hours: number; minutes: number } => {
  if (!duration) return { hours: 0, minutes: 0 };
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
  return { hours, minutes };
};

// Generate predefined duration options (max 3h)
const generateDurationOptions = (maxHours = 3) => {
  const options = [
    { value: "0H15m", label: "15 minutes" },
    { value: "0H30m", label: "30 minutes" },
    { value: "0H45m", label: "45 minutes" },
  ];

  for (let hour = 1; hour <= maxHours; hour++) {
    options.push({
      value: `${hour}H`,
      label: `${hour} hour${hour > 1 ? "s" : ""}`,
    });
  }

  return options;
};

export const DurationPicker: React.FC<DurationPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select duration",
  error,
  required = false,
  disabled = false,
  maxHours = 3,
  className = "",
}) => {
  const durationOptions = generateDurationOptions(maxHours);

  const displayValue = () => {
    if (!value) return placeholder;
    const { hours, minutes } = parseDuration(value);
    if (hours === 0 && minutes === 0) return placeholder;
    if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (hours === 0) return `${minutes} minutes`;
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`;
  };

  const handleValueChange = (newValue: string) => {
    onChange(newValue === "clear" ? "" : newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <Select value={value || "clear"} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger
          className={`${error ? "border-red-500" : ""} ${
            disabled ? "bg-gray-100 text-gray-700 cursor-not-allowed" : ""
          }`}
        >
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className={!value ? "text-muted-foreground" : ""}>{displayValue()}</span>
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="clear">No duration</SelectItem>
          {durationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DurationPicker;
