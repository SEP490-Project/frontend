import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export interface KPI {
  metric: string;
  target: string;
  measurement_method?: string;
  frequency?: string;
  description?: string;
}

export interface ScopeOfWork {
  deliverables: string[];
  requirements: string[];
  responsibilities: string[];
  kpis?: KPI[];

  co_produce?: {
    products: {
      name: string;
      description: string;
      concept?: string;
      promotion_plan?: string[];
      kpis?: KPI[];
    }[];
  };

  affiliate?: {
    platforms: string[];
    tracking_links: {
      link: string;
      platform: string;
      description?: string;
    }[];
    kpis?: KPI[];
  };

  advertising?: {
    advertised_items: {
      name: string;
      description?: string;
      key_visual?: string[];
      tagline?: string[];
      creative_notes?: string;
      kpis?: KPI[];
    }[];
    objectives?: string[];
    content_requirements?: string[];
  };

  brand_ambassador?: {
    events: {
      name: string;
      date: string;
      location?: string;
      activities?: string[];
      kpis?: KPI[];
    }[];
    representation_rules?: string[];
  };
}

/* ------------------------ KPI FIELD COMPONENT ------------------------ */
const KPIFields = ({ kpis = [], onChange }: { kpis?: KPI[]; onChange: (next: KPI[]) => void }) => {
  const handleAdd = () =>
    onChange([
      ...kpis,
      { metric: "", target: "", measurement_method: "", frequency: "", description: "" },
    ]);

  const handleRemove = (index: number) => onChange(kpis.filter((_, i) => i !== index));

  const handleChange = (index: number, field: keyof KPI, value: string) => {
    const next = [...kpis];
    next[index][field] = value;
    onChange(next);
  };

  return (
    <div className="mt-3 border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-semibold">KPIs</Label>
        <Button size="sm" variant="outline" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add KPI
        </Button>
      </div>

      {kpis.length > 0 ? (
        kpis.map((kpi, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 border-b pb-3 last:border-none"
          >
            {(
              [
                "metric",
                "target",
                "measurement_method",
                "frequency",
                "description",
              ] as (keyof KPI)[]
            ).map((f) => (
              <Input
                key={f}
                placeholder={f.replace("_", " ")}
                value={kpi[f] || ""}
                onChange={(e) => handleChange(i, f, e.target.value)}
              />
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(i)}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 italic">No KPIs added yet.</p>
      )}
    </div>
  );
};

/* ------------------------ GENERIC ARRAY FIELD ------------------------ */
const StringList = ({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) => {
  const handleAdd = () => onChange([...values, ""]);
  const handleRemove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const handleChange = (i: number, value: string) => {
    const next = [...values];
    next[i] = value;
    onChange(next);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <Button size="sm" variant="outline" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {values.length > 0 ? (
        values.map((v, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input value={v} onChange={(e) => handleChange(i, e.target.value)} />
            <Button variant="ghost" size="icon" onClick={() => handleRemove(i)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 italic">None added</p>
      )}
    </div>
  );
};

/* ------------------------ MAIN COMPONENT ------------------------ */
const ScopeOfWorkForm = ({
  scope,
  setScope,
}: {
  scope: ScopeOfWork;
  setScope: (s: ScopeOfWork) => void;
}) => {
  const updateField = (field: keyof ScopeOfWork, value: any) =>
    setScope({ ...scope, [field]: value });

  return (
    <div className="space-y-8">
      {/* Common Fields */}
      <Card>
        <CardHeader>
          <CardTitle>General Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <StringList
            label="Deliverables"
            values={scope.deliverables}
            onChange={(v) => updateField("deliverables", v)}
          />
          <StringList
            label="Requirements"
            values={scope.requirements}
            onChange={(v) => updateField("requirements", v)}
          />
          <StringList
            label="Responsibilities"
            values={scope.responsibilities}
            onChange={(v) => updateField("responsibilities", v)}
          />
          <KPIFields kpis={scope.kpis} onChange={(v) => updateField("kpis", v)} />
        </CardContent>
      </Card>

      {/* Co-Produce */}
      <Card>
        <CardHeader>
          <CardTitle>Co-Produce</CardTitle>
        </CardHeader>
        <CardContent>
          {scope.co_produce?.products?.map((p, i) => (
            <div key={i} className="border rounded-lg p-3 mb-4 space-y-2">
              <Input
                placeholder="Product name"
                value={p.name}
                onChange={(e) => {
                  const updated = [...(scope.co_produce?.products || [])];
                  updated[i].name = e.target.value;
                  updateField("co_produce", { products: updated });
                }}
              />
              <Textarea
                placeholder="Description"
                value={p.description}
                onChange={(e) => {
                  const updated = [...(scope.co_produce?.products || [])];
                  updated[i].description = e.target.value;
                  updateField("co_produce", { products: updated });
                }}
              />
              <KPIFields
                kpis={p.kpis}
                onChange={(v) => {
                  const updated = [...(scope.co_produce?.products || [])];
                  updated[i].kpis = v;
                  updateField("co_produce", { products: updated });
                }}
              />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              updateField("co_produce", {
                products: [
                  ...(scope.co_produce?.products || []),
                  { name: "", description: "", kpis: [] },
                ],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </CardContent>
      </Card>

      {/* Affiliate */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate</CardTitle>
        </CardHeader>
        <CardContent>
          <StringList
            label="Platforms"
            values={scope.affiliate?.platforms || []}
            onChange={(v) => updateField("affiliate", { ...scope.affiliate, platforms: v })}
          />
          <KPIFields
            kpis={scope.affiliate?.kpis}
            onChange={(v) => updateField("affiliate", { ...scope.affiliate, kpis: v })}
          />
        </CardContent>
      </Card>

      {/* Advertising */}
      <Card>
        <CardHeader>
          <CardTitle>Advertising</CardTitle>
        </CardHeader>
        <CardContent>
          {(scope.advertising?.advertised_items || []).map((ad, i) => (
            <div key={i} className="border rounded-lg p-3 mb-4 space-y-2">
              <Input
                placeholder="Item name"
                value={ad.name}
                onChange={(e) => {
                  const updated = [...(scope.advertising?.advertised_items || [])];
                  updated[i].name = e.target.value;
                  updateField("advertising", { ...scope.advertising, advertised_items: updated });
                }}
              />
              <Textarea
                placeholder="Description"
                value={ad.description}
                onChange={(e) => {
                  const updated = [...(scope.advertising?.advertised_items || [])];
                  updated[i].description = e.target.value;
                  updateField("advertising", { ...scope.advertising, advertised_items: updated });
                }}
              />
              <KPIFields
                kpis={ad.kpis}
                onChange={(v) => {
                  const updated = [...(scope.advertising?.advertised_items || [])];
                  updated[i].kpis = v;
                  updateField("advertising", { ...scope.advertising, advertised_items: updated });
                }}
              />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              updateField("advertising", {
                ...scope.advertising,
                advertised_items: [
                  ...(scope.advertising?.advertised_items || []),
                  { name: "", description: "", kpis: [] },
                ],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Brand Ambassador */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Ambassador</CardTitle>
        </CardHeader>
        <CardContent>
          {(scope.brand_ambassador?.events || []).map((ev, i) => (
            <div key={i} className="border rounded-lg p-3 mb-4 space-y-2">
              <Input
                placeholder="Event name"
                value={ev.name}
                onChange={(e) => {
                  const updated = [...(scope.brand_ambassador?.events || [])];
                  updated[i].name = e.target.value;
                  updateField("brand_ambassador", { ...scope.brand_ambassador, events: updated });
                }}
              />
              <Input
                placeholder="Date"
                value={ev.date}
                onChange={(e) => {
                  const updated = [...(scope.brand_ambassador?.events || [])];
                  updated[i].date = e.target.value;
                  updateField("brand_ambassador", { ...scope.brand_ambassador, events: updated });
                }}
              />
              <KPIFields
                kpis={ev.kpis}
                onChange={(v) => {
                  const updated = [...(scope.brand_ambassador?.events || [])];
                  updated[i].kpis = v;
                  updateField("brand_ambassador", { ...scope.brand_ambassador, events: updated });
                }}
              />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              updateField("brand_ambassador", {
                ...scope.brand_ambassador,
                events: [
                  ...(scope.brand_ambassador?.events || []),
                  { name: "", date: "", kpis: [] },
                ],
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScopeOfWorkForm;
