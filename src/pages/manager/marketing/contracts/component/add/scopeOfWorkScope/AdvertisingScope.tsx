import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { FaBullhorn, FaBullseye, FaHashtag, FaPalette } from "react-icons/fa6";
import { CollapsibleSection, KPIFields, DynamicListInput } from "../shared/SharedComponents";
import type { AdvertisingItem, ScopeOfWorkProps } from "../types/scopeTypes";

const AdvertisingScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scopeOfWork || {};
  const deliverables = scope.deliverables || {};

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const updateDeliverables = (partialDeliverables: any) => {
    const updated = { ...deliverables, ...partialDeliverables };
    onUpdateScopeOfWork({ ...scope, deliverables: updated });
  };

  const newAdvertisingItem = (): AdvertisingItem => ({
    name: "",
    description: "",
    materials: [],
    tagline: "",
    platform: "",
    hashtags: [],
    creative_notes: "",
    content_requirements: [],
    kpis: [],
  });

  const platformOptions = ["Website", "TikTok", "Facebook"];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center gap-2">
            <FaBullhorn className="w-5 h-5 text-blue-600" />
            Advertising Campaign Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Advertising Items Section */}
          <CollapsibleSection
            title="Advertising Content"
            badge={ensureArray(deliverables.advertising_items).length}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {ensureArray(deliverables.advertising_items).map(
                (item: AdvertisingItem, i: number) => {
                  const items = ensureArray(deliverables.advertising_items);
                  return (
                    <div
                      key={i}
                      className="border-2 border-blue-100 rounded-xl p-4 bg-gradient-to-br from-blue-25 to-white"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <Label className="font-semibold text-blue-800 flex items-center gap-2">
                          <FaBullseye className="w-4 h-4" />
                          Ad Content #{i + 1}
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() =>
                            updateDeliverables({
                              advertising_items: items.filter((_, idx) => idx !== i),
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Content name (e.g., Summer Sale Post)"
                            value={item.name || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], name: e.target.value };
                              updateDeliverables({ advertising_items: updated });
                            }}
                            className="bg-white"
                          />
                          <Select
                            value={item.platform || ""}
                            onValueChange={(value) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], platform: value };
                              updateDeliverables({ advertising_items: updated });
                            }}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              {platformOptions.map((platform) => (
                                <SelectItem key={platform} value={platform}>
                                  {platform}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Input
                          placeholder="Tagline / Call to Action"
                          value={item.tagline || ""}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], tagline: e.target.value };
                            updateDeliverables({ advertising_items: updated });
                          }}
                          className="bg-white"
                        />

                        <Textarea
                          placeholder="Content description and messaging"
                          value={item.description || ""}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], description: e.target.value };
                            updateDeliverables({ advertising_items: updated });
                          }}
                          className="bg-white"
                        />

                        <Textarea
                          placeholder="Creative notes, tone, style guidelines..."
                          value={item.creative_notes || ""}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], creative_notes: e.target.value };
                            updateDeliverables({ advertising_items: updated });
                          }}
                          className="bg-white"
                        />

                        <DynamicListInput
                          label="Hashtags"
                          icon={<FaHashtag className="w-4 h-4" />}
                          items={item.hashtags || []}
                          placeholder="#sale #discount #limited"
                          helpText="Relevant hashtags for this advertising content"
                          onChange={(hashtags) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], hashtags };
                            updateDeliverables({ advertising_items: updated });
                          }}
                        />

                        <DynamicListInput
                          label="Content Requirements"
                          icon={<FaBullseye className="w-4 h-4" />}
                          items={item.content_requirements || []}
                          placeholder="e.g., Must include brand logo, Use brand colors"
                          helpText="Specific requirements for this advertising content"
                          multiline
                          onChange={(content_requirements) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], content_requirements };
                            updateDeliverables({ advertising_items: updated });
                          }}
                        />

                        <DynamicListInput
                          label="Creative Assets"
                          icon={<FaPalette className="w-4 h-4" />}
                          items={item.materials || []}
                          placeholder="https://drive.google.com/..."
                          helpText="Links to images, videos, graphics, or other creative materials"
                          onChange={(materials) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], materials };
                            updateDeliverables({ advertising_items: updated });
                          }}
                        />

                        <KPIFields
                          kpis={item.kpis || []}
                          onChange={(kpis) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ advertising_items: updated });
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}

              <Button
                variant="outline"
                onClick={() =>
                  updateDeliverables({
                    advertising_items: [
                      ...ensureArray(deliverables.advertising_items),
                      newAdvertisingItem(),
                    ],
                  })
                }
                className="w-full py-6 border-2 border-dashed border-blue-200 hover:border-blue-300 hover:bg-blue-50"
              >
                <Plus className="w-5 h-5 mr-2" /> Add New Advertisement
              </Button>
            </div>
          </CollapsibleSection>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingScope;
