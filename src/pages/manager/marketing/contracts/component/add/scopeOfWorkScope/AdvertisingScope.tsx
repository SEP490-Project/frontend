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
import { FaBullhorn, FaBullseye, FaHashtag, FaPalette, FaChartLine } from "react-icons/fa6";
import { CollapsibleSection, DynamicListInput } from "../shared/SharedComponents";
import type { AdvertisingItem, ScopeOfWorkProps } from "../types/scopeTypes";
import FileUploader from "@/components/global/FileUploader";
import { KPISelector } from "@/components/global";

const AdvertisingScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scopeOfWork || {};
  const deliverables = scope.deliverables || {};

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const updateDeliverables = (partialDeliverables: any) => {
    const updated = { ...deliverables, ...partialDeliverables };
    onUpdateScopeOfWork({ ...scope, deliverables: updated });
  };

  const newAdvertisingItem = (): AdvertisingItem => ({
    id: 0,
    name: "",
    description: "",
    material_url: [],
    tagline: "",
    platform: "",
    hash_tag: [],
    creative_notes: "",
    content_requirements: [],
    kpis: [],
  });

  const platformOptions = ["Website", "TikTok", "Facebook"];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
          <CardTitle className="flex items-center gap-2 text-pink-900">
            <FaBullhorn className="w-5 h-5" style={{ color: "#ff9fb2" }} />
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
                      className="border-2 rounded-xl p-4 bg-gradient-to-br from-pink-25 to-white"
                      style={{ borderColor: "#ff9fb2" }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <Label
                          className="font-semibold flex items-center gap-2"
                          style={{ color: "#d6336c" }}
                        >
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
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Content Name</Label>
                            <Input
                              placeholder="Content name (e.g., Summer Sale Post)"
                              value={item.name || ""}
                              onChange={(e) => {
                                const updated = [...items];
                                updated[i] = { ...updated[i], name: e.target.value, id: i + 1 };
                                updateDeliverables({ advertising_items: updated });
                              }}
                              className="bg-white border-pink-200 focus:border-pink-400"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Platform</Label>
                            <Select
                              value={item.platform || ""}
                              onValueChange={(value) => {
                                const updated = [...items];
                                updated[i] = { ...updated[i], platform: value };
                                updateDeliverables({ advertising_items: updated });
                              }}
                            >
                              <SelectTrigger className="bg-white border-pink-200 focus:border-pink-400">
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
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">Tagline</Label>
                          <Input
                            placeholder="Tagline"
                            value={item.tagline || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], tagline: e.target.value };
                              updateDeliverables({ advertising_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Content Description
                          </Label>
                          <Textarea
                            placeholder="Content description and messaging"
                            value={item.description || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], description: e.target.value };
                              updateDeliverables({ advertising_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">Creative Notes</Label>
                          <Textarea
                            placeholder="Creative notes, tone, style guidelines..."
                            value={item.creative_notes || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], creative_notes: e.target.value };
                              updateDeliverables({ advertising_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />
                        </div>

                        <DynamicListInput
                          label="Hashtags"
                          icon={<FaHashtag className="w-4 h-4" />}
                          items={item.hash_tag || []}
                          placeholder="#sale #discount #limited"
                          helpText="Relevant hashtags for this advertising content"
                          onChange={(hash_tag) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], hash_tag };
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

                        <div>
                          <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                            <FaPalette className="w-4 h-4" />
                            Creative Assets
                          </Label>
                          <FileUploader
                            userId={formData?.brand_id || "unknown"}
                            accept="image/*,video/*"
                            multiple={true}
                            maxFiles={10}
                            maxSize={100}
                            allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                            title="Upload creative assets"
                            onUploadComplete={(urls) => {
                              const updated = [...items];
                              updated[i] = {
                                ...updated[i],
                                material_url: [...(updated[i].material_url || []), ...urls],
                              };
                              updateDeliverables({ advertising_items: updated });
                            }}
                            onFilesRemove={(removedUrls) => {
                              const updated = [...items];
                              const currentUrls = updated[i].material_url || [];
                              updated[i] = {
                                ...updated[i],
                                material_url: currentUrls.filter(
                                  (url: string) => !removedUrls.includes(url),
                                ),
                              };
                              updateDeliverables({ advertising_items: updated });
                            }}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload images / videos. Uploaded file links will be added to
                            material_url.
                          </p>
                        </div>

                        {/* KPIs */}
                        <div className="border-t pt-4">
                          <Label className="text-sm font-medium mb-3 flex items-center gap-2 text-pink-800">
                            <FaChartLine className="w-4 h-4" />
                            Key Performance Indicators
                          </Label>
                          <KPISelector
                            kpis={(item.kpis || []).map((kpi: any) => ({
                              id: kpi.id ?? "",
                              type: kpi.type ?? "",
                              target_value: kpi.target_value ?? "",
                              unit: kpi.unit ?? "",
                              ...kpi,
                            }))}
                            onChange={(kpis) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], kpis };
                              updateDeliverables({ advertising_items: updated });
                            }}
                          />
                        </div>
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
                      {
                        ...newAdvertisingItem(),
                        id: ensureArray(deliverables.advertising_items).length + 1,
                      },
                    ],
                  })
                }
                className="w-full py-6 border-2 border-dashed hover:bg-pink-50"
                style={{ borderColor: "#ff9fb2" }}
              >
                <Plus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Advertisement
              </Button>
            </div>
          </CollapsibleSection>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingScope;
