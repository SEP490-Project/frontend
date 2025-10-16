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
import { Plus, Trash2, X } from "lucide-react";
import { FaLink, FaBullhorn, FaHashtag, FaPenToSquare, FaBars, FaChartLine } from "react-icons/fa6";
import { CollapsibleSection, DynamicListInput } from "../shared/SharedComponents";
import type { AdvertisingItem, ScopeOfWorkProps } from "../types/scopeTypes";
import FileUploader from "@/components/global/FileUploader";
import { KPISelector } from "@/components/global";
import clsx from "clsx";

const AffiliateScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
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

  const allPlatformOptions = ["Website", "TikTok", "Facebook"];
  const selectedPlatforms = ensureArray(deliverables.platform);

  // Helper to remove platform from items when removed from main platforms
  const removePlatformFromItems = (
    platformToRemove: string,
    currentAdvertisedItems: AdvertisingItem[],
  ) => {
    // Ensure we're working with a new array reference to trigger update
    const updatedItems = currentAdvertisedItems.map((item: AdvertisingItem) => ({
      ...item,
      // If the item's platform matches the one being removed, set it to an empty string
      // This ensures the select dropdown for that item becomes "Select platform" again.
      platform: item.platform === platformToRemove ? "" : item.platform,
    }));
    return updatedItems;
  };

  const addPlatform = (platform: string) => {
    const current = ensureArray(deliverables.platform);
    if (!current.includes(platform)) {
      updateDeliverables({ platform: [...current, platform] });
    }
  };

  const removePlatform = (platform: string) => {
    const currentPlatforms = ensureArray(deliverables.platform);
    const updatedPlatforms = currentPlatforms.filter((p: string) => p !== platform);

    const currentAdvertisedItems = ensureArray(deliverables.advertised_items);
    const updatedAdvertisedItems = removePlatformFromItems(platform, currentAdvertisedItems);

    // Update both platforms and advertised_items in a single call to trigger one re-render
    updateDeliverables({
      platform: updatedPlatforms,
      advertised_items: updatedAdvertisedItems,
    });
  };

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
          {/* LINK + PLATFORM */}
          <CollapsibleSection title="Affiliate Link & Target Platforms" defaultOpen>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="tracking-link"
                  className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800"
                >
                  <FaLink className="w-4 h-4" />
                  Tracking Link
                </Label>
                <Input
                  id="tracking-link"
                  placeholder="https://www.example.com"
                  value={deliverables.tracking_link || ""}
                  onChange={(e) => updateDeliverables({ tracking_link: e.target.value })}
                  className="bg-white border-pink-200 focus:border-pink-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The main affiliate link that should be promoted across all platforms.
                </p>
              </div>

              {/* IMPROVED PLATFORM SELECTION */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center gap-2 text-pink-800">
                  <FaBullhorn className="w-4 h-4" />
                  Target Platforms
                </Label>

                {/* Platform Selection Buttons - Compact Version */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {allPlatformOptions.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform);
                    return (
                      <Button
                        key={platform}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={clsx(
                          "transition-all",
                          isSelected
                            ? "bg-pink-500 text-white hover:bg-pink-600 border-pink-500"
                            : "border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400",
                        )}
                        onClick={() => {
                          if (isSelected) {
                            removePlatform(platform);
                          } else {
                            addPlatform(platform);
                          }
                        }}
                      >
                        {platform}
                        {isSelected && <X className="w-3 h-3 ml-2" />}
                      </Button>
                    );
                  })}
                </div>

                {/* Selected Platforms Summary */}
                {selectedPlatforms.length > 0 ? (
                  <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                    <p className="text-xs font-medium text-pink-800">
                      Selected: {selectedPlatforms.join(", ")} ({selectedPlatforms.length} platform
                      {selectedPlatforms.length !== 1 ? "s" : ""})
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Select at least one platform to create content for.
                  </p>
                )}
              </div>
            </div>
          </CollapsibleSection>

          {/* ADVERTISING CONTENT */}
          {selectedPlatforms.length > 0 && (
            <CollapsibleSection
              title="Advertising Content"
              badge={ensureArray(deliverables.advertised_items).length}
              defaultOpen
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

                        {/* MAIN FIELDS */}
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`content-name-${i}`}>Content Name</Label>
                              <Input
                                id={`content-name-${i}`}
                                placeholder="Content name (e.g., Facebook post)"
                                value={item.name || ""}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[i] = {
                                    ...updated[i],
                                    name: e.target.value,
                                    id: i + 1,
                                  };
                                  updateDeliverables({ advertised_items: updated });
                                }}
                                className="bg-white border-pink-200 focus:border-pink-400"
                              />
                            </div>

                            {/* SINGLE PLATFORM SELECT - Only available platforms */}
                            <div>
                              <Label htmlFor={`platform-select-${i}`}>Platform</Label>
                              <Select
                                value={item.platform || ""}
                                onValueChange={(value) => {
                                  const updated = [...items];
                                  updated[i] = { ...updated[i], platform: value };
                                  updateDeliverables({ advertised_items: updated });
                                }}
                              >
                                <SelectTrigger
                                  id={`platform-select-${i}`}
                                  className="bg-white border-pink-200 focus:border-pink-400"
                                >
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedPlatforms.map((platform: string) => (
                                    <SelectItem key={platform} value={platform}>
                                      <div className="flex items-center gap-2">{platform}</div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {selectedPlatforms.length === 0 && (
                                <p className="text-xs text-red-500 mt-1">
                                  Please select platforms in the section above first.
                                </p>
                              )}
                            </div>
                          </div>

                          <Label htmlFor={`tagline-${i}`}>Tagline</Label>
                          <Input
                            id={`tagline-${i}`}
                            placeholder="Tagline"
                            value={item.tagline || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = { ...updated[i], tagline: e.target.value };
                              updateDeliverables({ advertised_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />

                          <Label htmlFor={`description-${i}`}>Content Description</Label>
                          <Textarea
                            id={`description-${i}`}
                            placeholder="Content description"
                            value={item.description || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = {
                                ...updated[i],
                                description: e.target.value,
                              };
                              updateDeliverables({ advertised_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />

                          <Label htmlFor={`creative-notes-${i}`}>Creative Notes</Label>
                          <Textarea
                            id={`creative-notes-${i}`}
                            placeholder="Creative notes, tone, style guidelines..."
                            value={item.creative_notes || ""}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[i] = {
                                ...updated[i],
                                creative_notes: e.target.value,
                              };
                              updateDeliverables({ advertised_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />

                          {/* HASHTAGS INLINE */}
                          <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                              <FaHashtag className="w-4 h-4" />
                              Hashtags
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {ensureArray(item.hash_tag).map((tag, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <Label htmlFor={`hashtag-${i}-${idx}`}>Hashtag {idx + 1}</Label>
                                  <Input
                                    id={`hashtag-${i}-${idx}`}
                                    value={tag}
                                    onChange={(e) => {
                                      const updated = [...items];
                                      const newTags = [...ensureArray(item.hash_tag)];
                                      newTags[idx] = e.target.value;
                                      updated[i] = { ...updated[i], hash_tag: newTags };
                                      updateDeliverables({ advertised_items: updated });
                                    }}
                                    className="w-28 text-xs border-pink-200 focus:border-pink-400"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() => {
                                      const updated = [...items];
                                      updated[i] = {
                                        ...updated[i],
                                        hash_tag: ensureArray(item.hash_tag).filter(
                                          (_, tIdx) => tIdx !== idx,
                                        ),
                                      };
                                      updateDeliverables({ advertised_items: updated });
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updated = [...items];
                                  updated[i] = {
                                    ...updated[i],
                                    hash_tag: [...ensureArray(item.hash_tag), ""],
                                  };
                                  updateDeliverables({ advertised_items: updated });
                                }}
                                className="border-pink-200 text-pink-700 hover:bg-pink-50"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Each hashtag is an individual field.
                            </p>
                          </div>

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

                          <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                              <FaPenToSquare className="w-4 h-4" />
                              Creative Materials
                            </Label>
                            <FileUploader
                              userId={formData?.brand_id || "unknown"}
                              accept="image/*,video/*"
                              multiple
                              maxFiles={10}
                              maxSize={100}
                              allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                              title="Upload creative materials"
                              onUploadComplete={(urls) => {
                                const updated = [...items];
                                updated[i] = {
                                  ...updated[i],
                                  material_url: [...(updated[i].material_url || []), ...urls],
                                };
                                updateDeliverables({ advertised_items: updated });
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
                                updateDeliverables({ advertised_items: updated });
                              }}
                            />
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
                                updateDeliverables({ advertised_items: updated });
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
                      advertised_items: [
                        ...ensureArray(deliverables.advertised_items),
                        {
                          ...newAdvertisingItem(),
                          id: ensureArray(deliverables.advertised_items).length + 1,
                        },
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateScope;
