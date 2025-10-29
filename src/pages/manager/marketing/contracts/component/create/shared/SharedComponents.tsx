import React, { memo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KPI } from "../types/scopeTypes";
import {
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaChartLine,
  FaClipboardList,
  FaPenToSquare,
} from "react-icons/fa6";

export const CollapsibleSection: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  badge?: number;
  actionComponent?: React.ReactNode;
}> = ({ title, defaultOpen = false, children, badge, actionComponent }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border border-pink-200 rounded-lg overflow-hidden shadow-sm">
        <div className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 hover:from-pink-100 hover:to-rose-100 transition-all">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-pink-900 font-medium focus:outline-none"
            >
              <span>{title}</span>
              {badge !== undefined && (
                <span
                  className="text-white text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: "#ff9fb2" }}
                >
                  {badge}
                </span>
              )}
            </button>
          </CollapsibleTrigger>
          <div className="flex items-center gap-3">
            {actionComponent}
            <button type="button" onClick={() => setOpen(!open)} className="focus:outline-none">
              {open ? (
                <FaChevronUp className="w-4 h-4" style={{ color: "#ff9fb2" }} />
              ) : (
                <FaChevronDown className="w-4 h-4" style={{ color: "#ff9fb2" }} />
              )}
            </button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="p-4 bg-white">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// NEW: Compact KPI Component with Metric Dropdown
export const CompactKPISelector: React.FC<{
  kpis?: KPI[];
  onChange: (v: KPI[]) => void;
  contractType?: string;
}> = memo(({ kpis = [], onChange, contractType }) => {
  const handleAdd = () => onChange([...kpis, { metric: "", target: "", description: "" }]);
  const handleRemove = (i: number) => onChange(kpis.filter((_, idx) => idx !== i));
  const handleChange = (i: number, field: keyof KPI, value: string) => {
    const updated = [...kpis];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  // Định nghĩa metric giống KPISelector
  const KPI_METRICS_GENERAL = [
    { value: "likes", label: "Total Likes" },
    { value: "comments", label: "Total Comments" },
    { value: "reach", label: "Reach" },
    { value: "click_through", label: "Click-through Rate (%)" },
    { value: "sales", label: "Sales (VND)" },
    { value: "event_participation", label: "Event Participation Count" },
    { value: "custom", label: "Custom Metric" },
  ];

  const getMetricsForType = (type?: string) => {
    switch (type) {
      case "ADVERTISING":
        return [
          { value: "reach", label: "Reach" },
          { value: "likes", label: "Total Likes" },
          { value: "comments", label: "Total Comments" },
        ];
      case "AFFILIATE":
        return [
          { value: "reach", label: "Reach" },
          { value: "likes", label: "Total Likes" },
          { value: "comments", label: "Total Comments" },
          { value: "click_through", label: "Click-through Rate (%)" },
        ];
      case "CO_PRODUCING":
        return [
          {
            value: "units_sold",
            label: "Total Units Sold Achieved",
          },
        ];
      case "BRAND_AMBASSADOR":
        return [{ value: "event_participation", label: "Event Participation Count" }];
      default:
        return KPI_METRICS_GENERAL;
    }
  };

  const metricOptions = getMetricsForType(contractType);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2 text-pink-800">
        <FaChartLine className="w-4 h-4" />
        Key Performance Indicators
        {kpis.length > 0 && (
          <span className="bg-pink-100 text-pink-800 text-xs w-6 h-6 flex items-center justify-center rounded-full">
            {kpis.length}
          </span>
        )}
      </Label>

      <div className="space-y-4">
        {kpis.map((kpi, i) => {
          // Lấy các metric đã chọn ở các KPI khác
          const selectedMetrics = kpis
            .map((k, idx) => (idx !== i ? k.metric : null))
            .filter(Boolean);

          // Chỉ hiển thị các metric chưa được chọn hoặc là metric hiện tại
          const availableMetrics = metricOptions.filter(
            (opt) => !selectedMetrics.includes(opt.value) || opt.value === kpi.metric,
          );

          return (
            <div key={i} className="p-3 rounded-lg border border-pink-200 shadow-sm">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start">
                {/* 1. Metric */}
                <div className="space-y-1">
                  <Label htmlFor={`metric-${i}`} className="text-xs font-medium text-gray-600">
                    Metric
                  </Label>
                  <Select
                    value={kpi.metric}
                    onValueChange={(value) => handleChange(i, "metric", value)}
                  >
                    <SelectTrigger
                      id={`metric-${i}`}
                      className="flex-1 bg-white border-pink-200 focus:border-pink-400 text-sm h-9"
                    >
                      <SelectValue placeholder="Select metric..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMetrics.map((metric) => (
                        <SelectItem key={metric.value} value={metric.value}>
                          {metric.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Target */}
                <div className="space-y-1">
                  <Label htmlFor={`target-${i}`} className="text-xs font-medium text-gray-600">
                    Target
                  </Label>
                  <Input
                    id={`target-${i}`}
                    placeholder="e.g., 100"
                    value={kpi.target}
                    onChange={(e) => handleChange(i, "target", e.target.value)}
                    className="bg-white border-pink-200 focus:border-pink-400 text-sm h-9"
                  />
                </div>

                {/* 3. Description */}
                <div className="space-y-1">
                  <Label htmlFor={`desc-${i}`} className="text-xs font-medium text-gray-600">
                    Description
                  </Label>
                  <Input
                    id={`desc-${i}`}
                    placeholder="e.g., For 30 days"
                    value={kpi.description || ""}
                    onChange={(e) => handleChange(i, "description", e.target.value)}
                    className="bg-white border-pink-200 focus:border-pink-400 text-sm h-9"
                  />
                </div>

                {/* 4. Nút Xóa (Trash Button) */}
                <div className="flex items-end h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 h-9 w-9"
                    onClick={() => handleRemove(i)}
                    title="Remove KPI" // Thêm title để dễ hiểu hơn
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full mt-3 py-6 border-2 border-dashed hover:bg-pink-50"
        style={{ borderColor: "#ff9fb2" }}
      >
        <FaPlus className="w-3 h-3 mr-1" /> Add KPI
      </Button>
    </div>
  );
});
CompactKPISelector.displayName = "CompactKPISelector";

// Keep existing KPIFields for backward compatibility but mark as deprecated
export const KPIFields: React.FC<{
  kpis?: KPI[];
  onChange: (v: KPI[]) => void;
}> = memo(({ kpis = [], onChange }) => {
  const handleAdd = () => onChange([...kpis, { metric: "", target: "", description: "" }]);
  const handleRemove = (i: number) => onChange(kpis.filter((_, idx) => idx !== i));
  const handleChange = (i: number, field: keyof KPI, value: string) => {
    const updated = [...kpis];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <Label className="font-semibold text-sm flex items-center gap-2 text-pink-800">
          <FaChartLine className="w-4 h-4" style={{ color: "#ff9fb2" }} />
          KPIs
          {kpis.length > 0 && (
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
              {kpis.length}
            </span>
          )}
        </Label>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAdd}
          className="border-pink-200 text-pink-700 hover:bg-pink-50"
        >
          <FaPlus className="w-4 h-4 mr-1" style={{ color: "#ff9fb2" }} /> Add KPI
        </Button>
      </div>
      {kpis.length === 0 && (
        <div
          className="text-center py-6 bg-pink-50 rounded-lg border-2 border-dashed"
          style={{ borderColor: "#ff9fb2" }}
        >
          <p className="text-sm text-pink-700">No KPIs defined yet</p>
          <p className="text-xs text-pink-600 mt-1">Click "Add KPI" to get started</p>
        </div>
      )}
      <div className="space-y-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-pink-50 p-3 rounded-lg border border-pink-200">
            <div className="grid md:grid-cols-3 gap-3 mb-2">
              <Input
                placeholder="Metric (e.g., Views)"
                value={kpi.metric}
                onChange={(e) => handleChange(i, "metric", e.target.value)}
                className="bg-white border-pink-200 focus:border-pink-400"
              />
              <Input
                placeholder="Target (e.g., 10K)"
                value={kpi.target}
                onChange={(e) => handleChange(i, "target", e.target.value)}
                className="bg-white border-pink-200 focus:border-pink-400"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Description (optional)"
                  value={kpi.description || ""}
                  onChange={(e) => handleChange(i, "description", e.target.value)}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleRemove(i)}
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
KPIFields.displayName = "KPIFields";

export const DynamicListInput: React.FC<{
  label?: string;
  items?: string[];
  placeholder?: string;
  icon?: React.ReactNode;
  onChange: (items: string[]) => void;
  helpText?: string;
  multiline?: boolean;
  addLabel?: string;
}> = ({
  label,
  items = [],
  placeholder,
  icon,
  onChange,
  helpText,
  multiline = false,
  addLabel,
}) => {
  const handleAdd = () => onChange([...items, ""]);
  const handleRemove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const handleChange = (i: number, val: string) => {
    const updated = [...items];
    updated[i] = val;
    onChange(updated);
  };

  const defaultAddLabel = label
    ? `Add another ${label.toLowerCase().replace(/s$/, "")}`
    : "Add new item";

  return (
    <div className="mt-4 space-y-4">
      {label && (
        <Label className="font-semibold flex items-center gap-2 text-pink-800">
          {icon} {label}
          {items.length > 0 && (
            <span className="bg-pink-100 text-pink-800 text-xs w-6 h-6 flex items-center justify-center rounded-full">
              {items.length}
            </span>
          )}
        </Label>
      )}
      {helpText && <p className="text-xs text-pink-600 mb-2">{helpText}</p>}

      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-center">
            {multiline ? (
              <Textarea
                placeholder={placeholder || "Item"}
                value={it}
                onChange={(e) => handleChange(i, e.target.value)}
                className="bg-white flex-1 border-pink-200 focus:border-pink-400"
                rows={3}
              />
            ) : (
              <Input
                placeholder={placeholder || "Item"}
                value={it}
                onChange={(e) => handleChange(i, e.target.value)}
                className="bg-white flex-1 border-pink-200 focus:border-pink-400"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-50"
              onClick={() => handleRemove(i)}
            >
              <FaTrash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={handleAdd}
        className="w-full mt-3 py-6 border-2 border-dashed hover:bg-pink-50"
        style={{ borderColor: "#ff9fb2" }}
      >
        <FaPlus className="w-4 h-4 mr-2" /> {addLabel || defaultAddLabel}
      </Button>
    </div>
  );
};

export const GeneralRequirements: React.FC<{
  requirements: string[];
  onChange: (requirements: string[]) => void;
}> = ({ requirements, onChange }) => {
  return (
    <Card className="shadow-sm border border-pink-200">
      <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
        <CardTitle className="flex items-center gap-2 text-pink-900">
          <FaClipboardList className="w-5 h-5" style={{ color: "#ff9fb2" }} />
          General Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DynamicListInput
          label="Requirements"
          items={requirements}
          placeholder="Enter a general requirement..."
          icon={<FaPenToSquare className="w-4 h-4" style={{ color: "#ff9fb2" }} />}
          onChange={onChange}
          helpText="Define overall requirements that apply to all deliverables"
          multiline
          addLabel="Add Requirement"
        />
      </CardContent>
    </Card>
  );
};
