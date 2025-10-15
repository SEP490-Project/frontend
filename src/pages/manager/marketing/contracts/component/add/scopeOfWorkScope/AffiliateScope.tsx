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
import { FaLink, FaBullhorn, FaHashtag, FaPenToSquare, FaBars, FaChartLine } from "react-icons/fa6";
import { CollapsibleSection, KPIFields, DynamicListInput } from "../shared/SharedComponents";
import type { AdvertisingItem, ScopeOfWorkProps } from "../types/scopeTypes";

const AffiliateScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
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
      <Card className="shadow-sm border border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
          <CardTitle className="flex items-center gap-2 text-pink-900">
            <FaLink className="w-5 h-5" style={{ color: "#ff9fb2" }} />
            Affiliate Marketing Program
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Affiliate Link & Platform Overview */}
          <CollapsibleSection title="Affiliate Link & Target Platforms" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                  <FaLink className="w-4 h-4" />
                  Tracking Link
                </Label>
                <Input
                  placeholder="https://www.shopee.com/s/xxxxxxxxxx"
                  value={deliverables.tracking_link || ""}
                  onChange={(e) => updateDeliverables({ tracking_link: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The main affiliate link that should be promoted across all platforms
                </p>
              </div>

              <DynamicListInput
                label="Target Platforms"
                icon={<FaBullhorn className="w-4 h-4" />}
                items={deliverables.platform || []}
                placeholder="Facebook, TikTok, Instagram..."
                helpText="Platforms where the affiliate link will be promoted"
                onChange={(platform) => updateDeliverables({ platform })}
              />
            </div>
          </CollapsibleSection>

          {/* Advertised Items Section */}
          <CollapsibleSection
            title="Advertising Content"
            badge={ensureArray(deliverables.advertised_items).length}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {ensureArray(deliverables.advertised_items).map(
                (item: AdvertisingItem, i: number) => {
                  const items = ensureArray(deliverables.advertised_items);
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
                          <FaBullhorn className="w-4 h-4" />
                          Content #{i + 1}
                        </Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() =>
                            updateDeliverables({
                              advertised_items: items.filter((_, idx) => idx !== i),
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Content name (e.g., Facebook posts)"
                            value={item.name || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], name: e.target.value };
                              updateDeliverables({ advertised_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />
                          <Select
                            value={item.platform || ""}
                            onValueChange={(value) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], platform: value };
                              updateDeliverables({ advertised_items: updated });
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

                        <Input
                          placeholder="Tagline / Call to Action"
                          value={item.tagline || ""}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], tagline: e.target.value };
                            updateDeliverables({ advertised_items: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />

                        <Textarea
                          placeholder="Content description and messaging"
                          value={item.description || ""}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], description: e.target.value };
                            updateDeliverables({ advertised_items: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />

                        <Textarea
                          placeholder="Creative notes, tone, style guidelines..."
                          value={item.creative_notes || ""}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], creative_notes: e.target.value };
                            updateDeliverables({ advertised_items: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />

                        <DynamicListInput
                          label="Hashtags"
                          icon={<FaHashtag className="w-4 h-4" />}
                          items={item.hashtags || []}
                          placeholder="#product1 #affiliate #awesome"
                          helpText="Relevant hashtags for this content"
                          onChange={(hashtags) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], hashtags };
                            updateDeliverables({ advertised_items: updated });
                          }}
                        />

                        <DynamicListInput
                          label="Content Requirements"
                          icon={<FaBars className="w-4 h-4" />}
                          items={item.content_requirements || []}
                          placeholder="e.g., Tone: Professional, Minimum 500 words"
                          helpText="Specific requirements for this content"
                          multiline
                          onChange={(content_requirements) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], content_requirements };
                            updateDeliverables({ advertised_items: updated });
                          }}
                        />

                        <DynamicListInput
                          label="Creative Materials"
                          icon={<FaPenToSquare className="w-4 h-4" />}
                          items={item.materials || []}
                          placeholder="https://s3.amazonaws.com/my-bucket/image.jpg"
                          helpText="Links to images, videos, graphics, or other creative materials"
                          onChange={(materials) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], materials };
                            updateDeliverables({ advertised_items: updated });
                          }}
                        />

                        <KPIFields
                          kpis={item.kpis || []}
                          onChange={(kpis) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ advertised_items: updated });
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
                    advertised_items: [
                      ...ensureArray(deliverables.advertised_items),
                      newAdvertisingItem(),
                    ],
                  })
                }
                className="w-full py-6 border-2 border-dashed hover:bg-pink-50"
                style={{ borderColor: "#ff9fb2" }}
              >
                <Plus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Content
              </Button>
            </div>
          </CollapsibleSection>

          {/* Quick Actions */}
          {deliverables.platform && deliverables.platform.length > 0 && (
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-pink-900 flex items-center gap-2">
                      <FaChartLine className="w-4 h-4" />
                      Quick Actions
                    </h4>
                    <p className="text-sm text-pink-700">
                      Create content for each platform automatically
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newItems = deliverables.platform.map((platform: string) => ({
                        ...newAdvertisingItem(),
                        name: `${platform} Content`,
                        platform: platform,
                        tagline: `Promote on ${platform}`,
                      }));
                      updateDeliverables({
                        advertised_items: [
                          ...ensureArray(deliverables.advertised_items),
                          ...newItems,
                        ],
                      });
                    }}
                    className="bg-white hover:bg-pink-50 border-pink-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content for Each Platform
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateScope;
