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
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaClipboardList } from "react-icons/fa6";

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
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <CollapsibleTrigger asChild>
          <div className="w-full flex items-center justify-between px-6 py-4 cursor-pointer bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 transition-all border-b border-gray-100">
            <div className="flex items-center gap-3 text-gray-800 font-semibold">
              <span>{title}</span>
              {badge !== undefined && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold border border-blue-200">
                  {badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {actionComponent}
              {open ? (
                <FaChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <FaChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-6 bg-white">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

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

  const KPI_METRICS_GENERAL = [
    { value: "likes", label: "Total Likes" },
    { value: "comments", label: "Total Comments" },
    { value: "shares", label: "Total Shares" },
    { value: "reach", label: "Reach" },
    { value: "click_through", label: "Click-through Total" },
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
          { value: "shares", label: "Total Shares" },
        ];
      case "AFFILIATE":
        return [
          { value: "reach", label: "Reach" },
          { value: "likes", label: "Total Likes" },
          { value: "comments", label: "Total Comments" },
          { value: "shares", label: "Total Shares" },
          { value: "click_through", label: "Click-through Total" },
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
      <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
        Key Performance Indicators
        {kpis.length > 0 && (
          <span className="bg-indigo-100 text-indigo-800 text-xs w-6 h-6 flex items-center justify-center rounded-full border border-indigo-200">
            {kpis.length}
          </span>
        )}
      </Label>

      <div className="space-y-4">
        {kpis.map((kpi, i) => {
          const selectedMetrics = kpis
            .map((k, idx) => (idx !== i ? k.metric : null))
            .filter(Boolean);

          const availableMetrics = metricOptions.filter(
            (opt) => !selectedMetrics.includes(opt.value) || opt.value === kpi.metric,
          );

          return (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 p-4 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-white to-gray-50">
                <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 items-start">
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
                        className="flex-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm h-9 rounded-lg"
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

                  <div className="space-y-1">
                    <Label htmlFor={`target-${i}`} className="text-xs font-medium text-gray-600">
                      Target
                    </Label>
                    <Input
                      id={`target-${i}`}
                      placeholder="e.g., 100"
                      value={kpi.target}
                      onChange={(e) => handleChange(i, "target", e.target.value)}
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm h-9 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`desc-${i}`} className="text-xs font-medium text-gray-600">
                      Description
                    </Label>
                    <Input
                      id={`desc-${i}`}
                      placeholder="e.g., For 30 days"
                      value={kpi.description || ""}
                      onChange={(e) => handleChange(i, "description", e.target.value)}
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm h-9 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 h-9 w-9 flex-shrink-0 mt-4"
                onClick={() => handleRemove(i)}
                title="Remove KPI"
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full mt-4 py-6 border-2 border-dashed border-indigo-300 hover:bg-indigo-50 hover:border-indigo-400 transition-all rounded-lg"
      >
        <div className="flex items-center gap-2">
          <FaPlus className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-700">Add KPI</span>
        </div>
      </Button>
    </div>
  );
});
CompactKPISelector.displayName = "CompactKPISelector";

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
        <Label className="font-semibold flex items-center gap-2 text-gray-700">
          {icon && <div className="bg-blue-100 p-1 rounded">{icon}</div>}
          {label}
          {items.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs w-6 h-6 flex items-center justify-center rounded-full border border-blue-200">
              {items.length}
            </span>
          )}
        </Label>
      )}
      {helpText && (
        <p className="text-xs text-gray-600 mb-2 bg-blue-50 p-2 rounded border-l-4 border-blue-300">
          {helpText}
        </p>
      )}

      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-center">
            {multiline ? (
              <Textarea
                placeholder={placeholder || "Item"}
                value={it}
                onChange={(e) => handleChange(i, e.target.value)}
                className="bg-white flex-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                rows={3}
              />
            ) : (
              <Input
                placeholder={placeholder || "Item"}
                value={it}
                onChange={(e) => handleChange(i, e.target.value)}
                className="bg-white flex-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
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
        className="w-full mt-3 py-6 border-2 border-dashed border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all rounded-lg"
      >
        <div className="flex items-center gap-2">
          <FaPlus className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-700">{addLabel || defaultAddLabel}</span>
        </div>
      </Button>
    </div>
  );
};

export const GeneralRequirements: React.FC<{
  requirements: string[];
  onChange: (requirements: string[]) => void;
}> = ({ requirements, onChange }) => {
  return (
    <Card className="rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
        <CardTitle className="flex items-center gap-3 text-gray-800">
          <div className="bg-slate-100 p-2 rounded-lg">
            <FaClipboardList className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">General Requirements</h2>
            <p className="text-sm text-gray-600 font-normal mt-1">
              Define overall requirements for all deliverables
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DynamicListInput
          label="Requirements"
          items={requirements}
          placeholder="Enter a general requirement..."
          onChange={onChange}
          multiline
          addLabel="Add Requirement"
        />
      </CardContent>
    </Card>
  );
};
