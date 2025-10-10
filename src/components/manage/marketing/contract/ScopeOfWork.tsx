import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Plus, Trash2 } from "lucide-react";

interface ScopeOfWorkProps {
  formData: any;
  onUpdateScopeOfWork: (updates: any) => void;
  contractTypeOptions: { value: string; label: string }[];
  onContractTypeChange: (type: string) => void;
  errors?: any;
}

const CHANNEL_OPTIONS = [
  { value: "web", label: "Website" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
];

const ScopeOfWork: React.FC<ScopeOfWorkProps> = ({
  formData,
  onUpdateScopeOfWork,
  contractTypeOptions,
  onContractTypeChange,
  errors = {},
}) => {
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Scope of Work</CardTitle>
          <p className="text-sm text-slate-600">
            Define tasks and deliverables based on your contract type
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contract Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Contract Type *</Label>
            <Select value={formData.type} onValueChange={onContractTypeChange}>
              <SelectTrigger className={`h-11 ${errors.type ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>

          {/* ADVERTISING – Content + Product */}
          {formData.type === "ADVERTISING" && (
            <>
              {/* Content Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Content Tasks *</Label>
                  <Button
                    type="button"
                    onClick={() =>
                      onUpdateScopeOfWork({
                        contents: [
                          ...(formData.scopeOfWork?.contents || []),
                          { title: "", platform: "", deadline: "" },
                        ],
                      })
                    }
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Content
                  </Button>
                </div>
                {(formData.scopeOfWork?.contents || []).map((content: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="Content title *"
                        value={content.title || ""}
                        onChange={(e) => {
                          const updated = [...(formData.scopeOfWork?.contents || [])];
                          updated[index].title = e.target.value;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                        className="h-10"
                      />
                      <Select
                        value={content.platform || ""}
                        onValueChange={(v) => {
                          const updated = [...(formData.scopeOfWork?.contents || [])];
                          updated[index].platform = v;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Platform *" />
                        </SelectTrigger>
                        <SelectContent>
                          {CHANNEL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <DatePicker
                        value={content.deadline || ""}
                        onChange={(v: string) => {
                          const updated = [...(formData.scopeOfWork?.contents || [])];
                          updated[index].deadline = v;
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                        placeholder="Deadline *"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = (formData.scopeOfWork?.contents || []).filter(
                            (_: any, i: number) => i !== index,
                          );
                          onUpdateScopeOfWork({ contents: updated });
                        }}
                        className="h-10 gap-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
                {(formData.scopeOfWork?.contents || []).length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No content tasks added yet</p>
                  </div>
                )}
              </div>

              {/* Product Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Product Delivery *</Label>
                  <Button
                    type="button"
                    onClick={() =>
                      onUpdateScopeOfWork({
                        products: [
                          ...(formData.scopeOfWork?.products || []),
                          { name: "", quantity: 1, delivery_date: "" },
                        ],
                      })
                    }
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </div>
                {(formData.scopeOfWork?.products || []).map((product: any, index: number) => (
                  <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="Product name *"
                        value={product.name || ""}
                        onChange={(e) => {
                          const updated = [...(formData.scopeOfWork?.products || [])];
                          updated[index].name = e.target.value;
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        className="h-10"
                      />
                      <Input
                        type="number"
                        min="1"
                        placeholder="Quantity *"
                        value={product.quantity || 1}
                        onChange={(e) => {
                          const updated = [...(formData.scopeOfWork?.products || [])];
                          updated[index].quantity = parseInt(e.target.value);
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        className="h-10"
                      />
                      <DatePicker
                        value={product.delivery_date || ""}
                        onChange={(v: string) => {
                          const updated = [...(formData.scopeOfWork?.products || [])];
                          updated[index].delivery_date = v;
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        placeholder="Delivery date *"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = (formData.scopeOfWork?.products || []).filter(
                            (_: any, i: number) => i !== index,
                          );
                          onUpdateScopeOfWork({ products: updated });
                        }}
                        className="h-10 gap-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
                {(formData.scopeOfWork?.products || []).length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No products added yet</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* AFFILIATE – Content only */}
          {formData.type === "AFFILIATE" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Affiliate Content *</Label>
                <Button
                  type="button"
                  onClick={() =>
                    onUpdateScopeOfWork({
                      contents: [
                        ...(formData.scopeOfWork?.contents || []),
                        {
                          title: "",
                          platform: "",
                          tracking_link: "",
                          deadline: "",
                        },
                      ],
                    })
                  }
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Content
                </Button>
              </div>
              {(formData.scopeOfWork?.contents || []).map((c: any, index: number) => (
                <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <Input
                      placeholder="Title *"
                      value={c.title || ""}
                      onChange={(e) => {
                        const updated = [...(formData.scopeOfWork?.contents || [])];
                        updated[index].title = e.target.value;
                        onUpdateScopeOfWork({ contents: updated });
                      }}
                      className="h-10"
                    />
                    <Select
                      value={c.platform || ""}
                      onValueChange={(v) => {
                        const updated = [...(formData.scopeOfWork?.contents || [])];
                        updated[index].platform = v;
                        onUpdateScopeOfWork({ contents: updated });
                      }}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Platform *" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHANNEL_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Tracking Link"
                      value={c.tracking_link || ""}
                      onChange={(e) => {
                        const updated = [...(formData.scopeOfWork?.contents || [])];
                        updated[index].tracking_link = e.target.value;
                        onUpdateScopeOfWork({ contents: updated });
                      }}
                      className="h-10"
                    />
                    <DatePicker
                      value={c.deadline || ""}
                      onChange={(v: string) => {
                        const updated = [...(formData.scopeOfWork?.contents || [])];
                        updated[index].deadline = v;
                        onUpdateScopeOfWork({ contents: updated });
                      }}
                      placeholder="Deadline *"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = (formData.scopeOfWork?.contents || []).filter(
                          (_: any, i: number) => i !== index,
                        );
                        onUpdateScopeOfWork({ contents: updated });
                      }}
                      className="h-10 gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
              {(formData.scopeOfWork?.contents || []).length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No affiliate content added yet</p>
                </div>
              )}
            </div>
          )}

          {/* CO_PRODUCING – Product only */}
          {formData.type === "CO_PRODUCING" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Co-Produced Products *</Label>
                <Button
                  type="button"
                  onClick={() =>
                    onUpdateScopeOfWork({
                      products: [
                        ...(formData.scopeOfWork?.products || []),
                        { name: "", role: "", quantity: 1, delivery_date: "" },
                      ],
                    })
                  }
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </div>
              {(formData.scopeOfWork?.products || []).map((p: any, index: number) => (
                <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Input
                      placeholder="Product name *"
                      value={p.name || ""}
                      onChange={(e) => {
                        const updated = [...(formData.scopeOfWork?.products || [])];
                        updated[index].name = e.target.value;
                        onUpdateScopeOfWork({ products: updated });
                      }}
                      className="h-10"
                    />
                    <Input
                      placeholder="Role *"
                      value={p.role || ""}
                      onChange={(e) => {
                        const updated = [...(formData.scopeOfWork?.products || [])];
                        updated[index].role = e.target.value;
                        onUpdateScopeOfWork({ products: updated });
                      }}
                      className="h-10"
                    />
                    <Input
                      type="number"
                      min="1"
                      placeholder="Quantity *"
                      value={p.quantity || 1}
                      onChange={(e) => {
                        const updated = [...(formData.scopeOfWork?.products || [])];
                        updated[index].quantity = parseInt(e.target.value);
                        onUpdateScopeOfWork({ products: updated });
                      }}
                      className="h-10"
                    />
                    <DatePicker
                      value={p.delivery_date || ""}
                      onChange={(v: string) => {
                        const updated = [...(formData.scopeOfWork?.products || [])];
                        updated[index].delivery_date = v;
                        onUpdateScopeOfWork({ products: updated });
                      }}
                      placeholder="Delivery date *"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = (formData.scopeOfWork?.products || []).filter(
                          (_: any, i: number) => i !== index,
                        );
                        onUpdateScopeOfWork({ products: updated });
                      }}
                      className="h-10 gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
              {(formData.scopeOfWork?.products || []).length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No co-produced products added yet</p>
                </div>
              )}
            </div>
          )}

          {/* BRAND_AMBASSADOR – Event only */}
          {formData.type === "BRAND_AMBASSADOR" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Events *</Label>
                <Button
                  type="button"
                  onClick={() =>
                    onUpdateScopeOfWork({
                      events: [
                        ...(formData.scopeOfWork?.events || []),
                        { event_name: "", date: "", location: "", note: "" },
                      ],
                    })
                  }
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </div>
              {(formData.scopeOfWork?.events || []).map((e: any, index: number) => (
                <Card key={index} className="p-4 bg-slate-50/50 border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Input
                      placeholder="Event name *"
                      value={e.event_name || ""}
                      onChange={(ev) => {
                        const updated = [...(formData.scopeOfWork?.events || [])];
                        updated[index].event_name = ev.target.value;
                        onUpdateScopeOfWork({ events: updated });
                      }}
                      className="h-10"
                    />
                    <DatePicker
                      value={e.date || ""}
                      onChange={(v: string) => {
                        const updated = [...(formData.scopeOfWork?.events || [])];
                        updated[index].date = v;
                        onUpdateScopeOfWork({ events: updated });
                      }}
                      placeholder="Event date *"
                      className="flex-1"
                    />
                    <Input
                      placeholder="Location *"
                      value={e.location || ""}
                      onChange={(ev) => {
                        const updated = [...(formData.scopeOfWork?.events || [])];
                        updated[index].location = ev.target.value;
                        onUpdateScopeOfWork({ events: updated });
                      }}
                      className="h-10"
                    />
                    <Input
                      placeholder="Note"
                      value={e.note || ""}
                      onChange={(ev) => {
                        const updated = [...(formData.scopeOfWork?.events || [])];
                        updated[index].note = ev.target.value;
                        onUpdateScopeOfWork({ events: updated });
                      }}
                      className="h-10"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = (formData.scopeOfWork?.events || []).filter(
                          (_: any, i: number) => i !== index,
                        );
                        onUpdateScopeOfWork({ events: updated });
                      }}
                      className="h-10 gap-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
              {(formData.scopeOfWork?.events || []).length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No events added yet</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScopeOfWork;
