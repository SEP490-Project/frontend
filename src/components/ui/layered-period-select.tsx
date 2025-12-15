import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";

// Period category definitions
export const PERIOD_CATEGORIES = [
  {
    label: "Quick",
    periods: [
      { value: "TODAY", label: "Today" },
      { value: "YESTERDAY", label: "Yesterday" },
      { value: "LAST_7_DAYS", label: "Last 7 Days" },
      { value: "LAST_30_DAYS", label: "Last 30 Days" },
    ],
  },
  {
    label: "Week",
    periods: [
      { value: "THIS_WEEK", label: "This Week" },
      { value: "LAST_WEEK", label: "Last Week" },
    ],
  },
  {
    label: "Month",
    periods: [
      { value: "THIS_MONTH", label: "This Month" },
      { value: "LAST_MONTH", label: "Last Month" },
    ],
  },
  {
    label: "Quarter/Year",
    periods: [
      { value: "THIS_QUARTER", label: "This Quarter" },
      { value: "THIS_YEAR", label: "This Year" },
    ],
  },
  {
    label: "Custom",
    periods: [{ value: "CUSTOM", label: "Custom Range..." }],
  },
];

// Flat list of all period values for lookup
export const ALL_PERIOD_OPTIONS = PERIOD_CATEGORIES.flatMap((cat) => cat.periods);

export interface PeriodFilter {
  period: string;
  startDate?: string;
  endDate?: string;
}

interface LayeredPeriodSelectProps {
  value: string;
  startDate?: string;
  endDate?: string;
  onChange: (filter: PeriodFilter) => void;
  className?: string;
  disabled?: boolean;
}

const STORAGE_KEY = "content_dashboard_period_category";

export const LayeredPeriodSelect: React.FC<LayeredPeriodSelectProps> = ({
  value,
  startDate,
  endDate,
  onChange,
  className,
  disabled = false,
}) => {
  const [isCustom, setIsCustom] = useState(value === "CUSTOM");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined,
  );
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined,
  );
  const [startPickerOpen, setStartPickerOpen] = useState(false);
  const [endPickerOpen, setEndPickerOpen] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setIsCustom(value === "CUSTOM");
    if (startDate) setCustomStartDate(new Date(startDate));
    if (endDate) setCustomEndDate(new Date(endDate));
  }, [value, startDate, endDate]);

  // Get display label for current value
  const getDisplayLabel = useCallback(() => {
    if (isCustom) {
      if (customStartDate && customEndDate) {
        return `${format(customStartDate, "MMM dd")} - ${format(customEndDate, "MMM dd, yyyy")}`;
      }
      // Show "Custom Range..." when in custom mode but dates not fully selected
      return "Custom Range...";
    }
    const option = ALL_PERIOD_OPTIONS.find((opt) => opt.value === value);
    return option?.label || "Select period";
  }, [isCustom, value, customStartDate, customEndDate]);

  // Handle period selection
  const handlePeriodChange = useCallback(
    (newValue: string) => {
      if (newValue === "CUSTOM") {
        setIsCustom(true);
        // Don't trigger onChange yet, wait for date selection
      } else {
        setIsCustom(false);
        setCustomStartDate(undefined);
        setCustomEndDate(undefined);
        onChange({ period: newValue });

        // Store the category in localStorage for UX
        const category = PERIOD_CATEGORIES.find((cat) =>
          cat.periods.some((p) => p.value === newValue),
        );
        if (category) {
          localStorage.setItem(STORAGE_KEY, category.label);
        }
      }
    },
    [onChange],
  );

  // Handle custom date range selection
  const handleCustomDateChange = useCallback(
    (start: Date | undefined, end: Date | undefined) => {
      setCustomStartDate(start);
      setCustomEndDate(end);

      if (start && end) {
        onChange({
          period: "CUSTOM",
          startDate: format(start, "yyyy-MM-dd"),
          endDate: format(end, "yyyy-MM-dd"),
        });
        localStorage.setItem(STORAGE_KEY, "Custom");
      }
    },
    [onChange],
  );

  // Clear custom selection
  const handleClearCustom = useCallback(() => {
    setIsCustom(false);
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
    onChange({ period: "LAST_30_DAYS" });
  }, [onChange]);

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Main Period Selector */}
      <Select
        value={isCustom ? "CUSTOM" : value}
        onValueChange={handlePeriodChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "min-w-[140px] max-w-[200px]",
            isCustom && !customStartDate && !customEndDate && "w-[160px]",
          )}
        >
          <SelectValue placeholder="Select period" className="truncate">
            {getDisplayLabel()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {PERIOD_CATEGORIES.map((category) => (
            <SelectGroup key={category.label}>
              <SelectLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category.label}
              </SelectLabel>
              {category.periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Date Range Pickers */}
      {isCustom && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Start Date Picker */}
          <Popover open={startPickerOpen} onOpenChange={setStartPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                className={cn(
                  "min-w-[120px] justify-start text-left font-normal",
                  !customStartDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {customStartDate ? format(customStartDate, "MMM dd, yyyy") : "Start date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customStartDate}
                onSelect={(date) => {
                  handleCustomDateChange(date, customEndDate);
                  setStartPickerOpen(false);
                }}
                disabled={(date) => (customEndDate ? date > customEndDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-gray-500 flex-shrink-0">to</span>

          {/* End Date Picker */}
          <Popover open={endPickerOpen} onOpenChange={setEndPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                className={cn(
                  "min-w-[120px] justify-start text-left font-normal",
                  !customEndDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {customEndDate ? format(customEndDate, "MMM dd, yyyy") : "End date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customEndDate}
                onSelect={(date) => {
                  handleCustomDateChange(customStartDate, date);
                  setEndPickerOpen(false);
                }}
                disabled={(date) => (customStartDate ? date < customStartDate : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Clear Custom Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearCustom}
            disabled={disabled}
            className="h-8 w-8"
            title="Clear custom range"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LayeredPeriodSelect;
