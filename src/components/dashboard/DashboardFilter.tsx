import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";

// Period presets matching backend DashboardFilterRequest
export const PERIOD_PRESETS = [
  { value: "TODAY", label: "Today" },
  { value: "YESTERDAY", label: "Yesterday" },
  { value: "THIS_WEEK", label: "This Week" },
  { value: "LAST_WEEK", label: "Last Week" },
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "THIS_QUARTER", label: "This Quarter" },
  { value: "LAST_QUARTER", label: "Last Quarter" },
  { value: "THIS_YEAR", label: "This Year" },
  { value: "LAST_YEAR", label: "Last Year" },
  { value: "LAST_7_DAYS", label: "Last 7 Days" },
  { value: "LAST_30_DAYS", label: "Last 30 Days" },
  { value: "CUSTOM", label: "Custom Range" },
] as const;

export const GRANULARITY_OPTIONS = [
  { value: "HOUR", label: "Hourly" },
  { value: "DAY", label: "Daily" },
  { value: "WEEK", label: "Weekly" },
  { value: "MONTH", label: "Monthly" },
] as const;

export type PeriodPreset = (typeof PERIOD_PRESETS)[number]["value"];
export type TrendGranularity = (typeof GRANULARITY_OPTIONS)[number]["value"];

export interface DashboardFilterValue {
  period: PeriodPreset;
  fromDate?: string; // YYYY-MM-DD format
  toDate?: string; // YYYY-MM-DD format
  trendGranularity?: TrendGranularity;
  limit?: number;
}

interface DashboardFilterProps {
  value: DashboardFilterValue;
  onChange: (value: DashboardFilterValue) => void;
  showGranularity?: boolean;
  showLimit?: boolean;
  limitOptions?: number[];
  className?: string;
}

export const DashboardFilter: React.FC<DashboardFilterProps> = ({
  value,
  onChange,
  showGranularity = false,
  showLimit = false,
  limitOptions = [5, 10, 20, 50],
  className,
}) => {
  const handlePeriodChange = (period: PeriodPreset) => {
    onChange({
      ...value,
      period,
      // Clear custom dates when selecting a preset other than CUSTOM
      fromDate: period === "CUSTOM" ? value.fromDate : undefined,
      toDate: period === "CUSTOM" ? value.toDate : undefined,
    });
  };

  const handleFromDateChange = (dateStr: string) => {
    onChange({
      ...value,
      fromDate: dateStr || undefined,
    });
  };

  const handleToDateChange = (dateStr: string) => {
    onChange({
      ...value,
      toDate: dateStr || undefined,
    });
  };

  const handleGranularityChange = (granularity: TrendGranularity) => {
    onChange({
      ...value,
      trendGranularity: granularity,
    });
  };

  const handleLimitChange = (limit: string) => {
    onChange({
      ...value,
      limit: parseInt(limit, 10),
    });
  };

  return (
    <div className={`flex flex-wrap items-end gap-4 ${className || ""}`}>
      {/* Period Preset */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Period</Label>
        <Select value={value.period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Date Range (visible only when CUSTOM is selected) */}
      {value.period === "CUSTOM" && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">From</Label>
            <DatePicker
              value={value.fromDate}
              onChange={handleFromDateChange}
              className="w-[140px]"
              placeholder="Start date"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">To</Label>
            <DatePicker
              value={value.toDate}
              onChange={handleToDateChange}
              className="w-[140px]"
              placeholder="End date"
            />
          </div>
        </>
      )}

      {/* Granularity (optional) */}
      {showGranularity && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Granularity</Label>
          <Select value={value.trendGranularity || "DAY"} onValueChange={handleGranularityChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Granularity" />
            </SelectTrigger>
            <SelectContent>
              {GRANULARITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Limit (optional) */}
      {showLimit && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Limit</Label>
          <Select value={String(value.limit || 5)} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map((limit) => (
                <SelectItem key={limit} value={String(limit)}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

// Helper function to convert DashboardFilterValue to API query params
export const toApiParams = (filter: DashboardFilterValue): Record<string, string> => {
  const params: Record<string, string> = {
    period: filter.period,
  };

  if (filter.period === "CUSTOM") {
    if (filter.fromDate) {
      params.from_date = filter.fromDate;
    }
    if (filter.toDate) {
      params.to_date = filter.toDate;
    }
  }

  if (filter.trendGranularity) {
    params.trend_granularity = filter.trendGranularity;
  }

  if (filter.limit) {
    params.limit = String(filter.limit);
  }

  return params;
};

// Default filter value
export const DEFAULT_DASHBOARD_FILTER: DashboardFilterValue = {
  period: "THIS_MONTH",
  trendGranularity: "DAY",
  limit: 5,
};

export default DashboardFilter;
