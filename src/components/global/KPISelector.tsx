import React, { useState } from "react";
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
  className?: string;
}

const KPI_METRICS = [
  { value: "likes", label: "Total Likes" },
  { value: "comments", label: "Total Comments" },
  { value: "engagement_rate", label: "Engagement Rate (%)" },
  { value: "reach", label: "Reach" },
  { value: "click_through", label: "Click-through Rate (%)" },
  { value: "conversion_rate", label: "Conversion Rate (%)" },
  { value: "sales", label: "Sales (VND)" },
];

export const KPISelector: React.FC<KPISelectorProps> = ({
  kpis = [],
  onChange,
  className = "",
}) => {
  const [metric, setMetric] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const addKPI = () => {
    if (!metric || !value) return;

    const newItem = {
      metric,
      value: parseFloat(value),
      description: description.trim() || undefined,
    };

    onChange([...kpis, newItem]);
    setMetric("");
    setValue("");
    setDescription("");
  };

  const removeKPI = (metricValue: string) => {
    onChange(kpis.filter((kpi) => kpi.metric !== metricValue));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Existing Metrics */}
      {kpis.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FaChartLine className="w-4 h-4" />
            Selected Metrics ({kpis.length})
          </Label>
          <div className="space-y-2">
            {kpis.map((kpi, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{kpi.metric}</div>
                    <div className="text-lg font-bold text-blue-600">
                      Value: {kpi.value.toLocaleString()}
                    </div>
                    {kpi.description && (
                      <div className="text-xs text-gray-600 mt-1">{kpi.description}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 ml-2"
                    onClick={() => removeKPI(kpi.metric)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Metric Form */}
      <Card className="p-4 border-2 border-dashed border-slate-300">
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2 text-pink-600">
            <Plus className="w-4 h-4" />
            Add Metric
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Metric Select */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Metric</Label>
              <Select onValueChange={(val) => setMetric(val)} value={metric || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {KPI_METRICS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Value</Label>
              <Input
                type="number"
                placeholder="Enter target value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label className="text-xs font-medium mb-2 block">Description (Optional)</Label>
              <Input
                placeholder="Additional notes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={addKPI} disabled={!metric || !value} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Metric
          </Button>
        </div>
      </Card>

      {/* Empty State */}
      {kpis.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FaChartLine className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No metrics added yet. Add metrics to track performance.</p>
        </div>
      )}
    </div>
  );
};

export default KPISelector;
