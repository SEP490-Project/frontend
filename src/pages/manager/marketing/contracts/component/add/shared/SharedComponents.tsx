import React, { memo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import type { KPI } from "../types/scopeTypes";
import {
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaChartBar,
  FaClipboard,
  FaPen,
} from "react-icons/fa6";

export const CollapsibleSection: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  badge?: number;
}> = ({ title, defaultOpen = false, children, badge }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all">
            <div className="flex items-center gap-2">
              <span className="font-medium">{title}</span>
              {badge !== undefined && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <span className="flex items-center gap-2">
              {open ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-4 bg-white">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

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
        <Label className="font-semibold text-sm flex items-center gap-2">
          <FaChartBar className="w-4 h-4" /> KPIs
          {kpis.length > 0 && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {kpis.length}
            </span>
          )}
        </Label>
        <Button size="sm" variant="outline" onClick={handleAdd} className="hover:bg-blue-50">
          <FaPlus className="w-4 h-4 mr-1" /> Add KPI
        </Button>
      </div>
      {kpis.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500">No KPIs defined yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add KPI" to get started</p>
        </div>
      )}
      <div className="space-y-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-gray-50 p-3 rounded-lg border">
            <div className="grid md:grid-cols-3 gap-3 mb-2">
              <Input
                placeholder="Metric (e.g., Views)"
                value={kpi.metric}
                onChange={(e) => handleChange(i, "metric", e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Target (e.g., 10K)"
                value={kpi.target}
                onChange={(e) => handleChange(i, "target", e.target.value)}
                className="bg-white"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Description (optional)"
                  value={kpi.description || ""}
                  onChange={(e) => handleChange(i, "description", e.target.value)}
                  className="bg-white"
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
}> = ({ label, items = [], placeholder, icon, onChange, helpText, multiline = false }) => {
  const handleAdd = () => onChange([...items, ""]);
  const handleRemove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const handleChange = (i: number, val: string) => {
    const updated = [...items];
    updated[i] = val;
    onChange(updated);
  };

  return (
    <div className="mt-4">
      {label && (
        <div className="flex justify-between items-center mb-3">
          <Label className="font-semibold mb-0 flex items-center gap-2">
            {icon} {label}
            {items.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {items.length}
              </span>
            )}
          </Label>
          <Button variant="outline" size="sm" onClick={handleAdd} className="hover:bg-blue-50">
            <FaPlus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      )}
      {helpText && <p className="text-xs text-gray-500 mb-2">{helpText}</p>}

      {items.length === 0 && (
        <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-500">No items added yet</p>
        </div>
      )}

      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2 items-start">
            {multiline ? (
              <Textarea
                placeholder={placeholder || "Item"}
                value={it}
                onChange={(e) => handleChange(i, e.target.value)}
                className="bg-white flex-1"
                rows={3}
              />
            ) : (
              <Input
                placeholder={placeholder || "Item"}
                value={it}
                onChange={(e) => handleChange(i, e.target.value)}
                className="bg-white flex-1"
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
    </div>
  );
};

export const GeneralRequirements: React.FC<{
  requirements: string[];
  onChange: (requirements: string[]) => void;
}> = ({ requirements, onChange }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <FaClipboard className="w-4 h-4" /> General Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DynamicListInput
          label="General Requirement"
          items={requirements}
          placeholder="Enter a general requirement..."
          icon={<FaPen className="w-4 h-4" />}
          onChange={onChange}
          helpText="Define overall requirements that apply to all deliverables"
          multiline
        />
      </CardContent>
    </Card>
  );
};
