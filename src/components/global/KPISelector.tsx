import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { FaChartLine } from "react-icons/fa6";

interface KPIValue {
  metric: string;
  value: number;
  description?: string;
}

interface KPISelectorProps {
  kpis: KPIValue[];
  onChange: (kpis: KPIValue[]) => void;
  contractType?: string;
  className?: string;
}

const KPI_METRICS_GENERAL = [
  { value: "likes", label: "Total Likes", type: "number" },
  { value: "comments", label: "Total Comments", type: "number" },
  { value: "reach", label: "Reach", type: "number" },
  { value: "click_through", label: "Click-through Total", type: "number" },
  { value: "sales", label: "Sales (VND)", type: "number" },
  { value: "event_participation", label: "Event Participation Count", type: "number" },
];

const getMetricsForType = (type?: string) => {
  switch (type) {
    case "ADVERTISING":
    case "AFFILIATE":
      return [
        { value: "reach", label: "Reach", type: "number" },
        { value: "likes", label: "Total Likes", type: "number" },
        { value: "comments", label: "Total Comments", type: "number" },
        { value: "click_through", label: "Click-through Total", type: "number" },
      ];
    case "CO_PRODUCE":
      return [
        { value: "reach", label: "Reach", type: "number" },
        { value: "likes", label: "Total Likes", type: "number" },
        { value: "comments", label: "Total Comments", type: "number" },
        { value: "sales", label: "Sales (VND)", type: "number" },
      ];
    case "BRAND_AMBASSADOR":
      return [{ value: "event_participation", label: "Event Participation Count", type: "number" }];
    default:
      return KPI_METRICS_GENERAL;
  }
};

export const KPISelector: React.FC<KPISelectorProps> = ({
  kpis = [],
  onChange,
  contractType,
  className = "",
}) => {
  const [metric, setMetric] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const metrics = getMetricsForType(contractType);

  // Lọc bỏ các KPI đã thêm ra khỏi danh sách select
  const availableMetrics = metrics.filter((m) => !kpis.some((k) => k.metric === m.value));

  const findMetricDef = (mValue?: string) => {
    if (!mValue) return undefined;
    return (
      metrics.find((m) => m.value === mValue) || KPI_METRICS_GENERAL.find((m) => m.value === mValue)
    );
  };

  // 🔹 Live validation
  useEffect(() => {
    if (!metric) {
      setError("");
      return;
    }

    // Value trống
    if (value === "") {
      setError("");
      return;
    }

    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) {
      setError("Invalid number.");
      return;
    }

    const def = findMetricDef(metric);
    if (def?.type === "percent") {
      if (numeric < 0 || numeric > 100) {
        setError("Value must be between 0 and 100 for percent metrics.");
        return;
      }
    } else if (def?.type === "number" && numeric < 0) {
      setError("Value cannot be negative.");
      return;
    }

    setError("");
  }, [metric, value, metrics]);

  const addKPI = () => {
    if (!metric) {
      setError("Please select a metric.");
      return;
    }
    if (value === "") {
      setError("Please enter a value.");
      return;
    }
    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) {
      setError("Invalid number.");
      return;
    }

    const def = findMetricDef(metric);
    if (def?.type === "percent" && (numeric < 0 || numeric > 100)) {
      setError("Value must be between 0 and 100 for percent metrics.");
      return;
    }
    if (def?.type === "number" && numeric < 0) {
      setError("Value cannot be negative.");
      return;
    }

    const newItem: KPIValue = {
      metric,
      value: numeric,
      description: description.trim() || undefined,
    };

    onChange([...kpis, newItem]);
    setMetric("");
    setValue("");
    setDescription("");
    setError("");
  };

  const removeKPI = (index: number) => {
    onChange(kpis.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Add KPI */}
      <Card className="p-4 border-2 border-dashed border-slate-300">
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2 text-pink-600">
            <Plus className="w-4 h-4" />
            Add KPI
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Metric */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Metric</Label>
              <Select value={metric || undefined} onValueChange={(val) => setMetric(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {availableMetrics.length > 0 ? (
                    availableMetrics.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 px-2 py-1">All KPIs added</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Value */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Value</Label>
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="Enter target value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Description (Optional)</Label>
              <Input
                placeholder="Additional notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button onClick={addKPI} disabled={!metric || value === "" || !!error} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add KPI
          </Button>
        </div>
      </Card>

      {/* KPI List */}
      {kpis.length > 0 ? (
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FaChartLine className="w-4 h-4" />
            Selected KPIs ({kpis.length})
          </Label>

          <div className="space-y-2">
            {kpis.map((kpi, index) => {
              const label =
                metrics.find((m) => m.value === kpi.metric)?.label ||
                KPI_METRICS_GENERAL.find((m) => m.value === kpi.metric)?.label ||
                kpi.metric;

              return (
                <Card key={index} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-lg font-bold text-blue-600">
                        Value:{" "}
                        {kpi.value.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      {kpi.description && (
                        <div className="text-xs text-gray-600 mt-1">{kpi.description}</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 ml-2"
                      onClick={() => removeKPI(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaChartLine className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No KPIs added yet. Add KPIs to track performance.</p>
        </div>
      )}
    </div>
  );
};

export default KPISelector;
