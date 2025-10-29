import React, { useState, useEffect, useCallback } from "react";
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
import {
  FaLink,
  FaBullhorn,
  FaHashtag,
  FaPenToSquare,
  FaBars,
  FaTrash,
  FaPlus,
  FaXmark,
} from "react-icons/fa6";
import {
  CollapsibleSection,
  DynamicListInput,
  CompactKPISelector,
} from "../shared/SharedComponents";
import type { AdvertisingItem, ScopeOfWorkProps } from "../types/scopeTypes";
import ContractUploader from "@/components/global/ContractUploader";
import WarningDialog from "@/components/global/WarningDialog";

const AffiliateScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scopeOfWork || {};
  const deliverables = scope.deliverables || {};

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
  const advertisedItems = ensureArray(deliverables.advertised_items);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    itemIdx: number | null;
    itemName: string;
  }>({
    isOpen: false,
    itemIdx: null,
    itemName: "",
  });

  const normalizeAdvertisedItems = (items: any[]) =>
    Array.isArray(items)
      ? items.map((it) => ({
          ...it,
          platform: it.platform ? String(it.platform).toUpperCase() : "",
        }))
      : items;

  const normalizePlatformArray = (arr: any[]) =>
    Array.isArray(arr) ? arr.map((p) => String(p).toUpperCase()) : arr;

  const updateDeliverables = useCallback(
    (partialDeliverables: any) => {
      const normalized: any = { ...partialDeliverables };

      if (partialDeliverables?.advertised_items) {
        normalized.advertised_items = normalizeAdvertisedItems(
          partialDeliverables.advertised_items,
        );
      }

      if (partialDeliverables?.platform) {
        normalized.platform = normalizePlatformArray(partialDeliverables.platform);
      }

      const updated = { ...deliverables, ...normalized };
      onUpdateScopeOfWork({ ...scope, deliverables: updated });
    },
    [deliverables, onUpdateScopeOfWork, scope],
  );

  useEffect(() => {
    if (
      formData &&
      (!deliverables.advertised_items || deliverables.advertised_items.length === 0) &&
      ensureArray(deliverables.platform).length > 0
    ) {
      updateDeliverables({
        advertised_items: [{ ...newAdvertisingItem(), id: 1 }],
      });
    }
  }, [formData, deliverables.platform, deliverables.advertised_items, updateDeliverables]);

  const newAdvertisingItem = (): AdvertisingItem => ({
    id: 0,
    name: "",
    description: "",
    material_url: [],
    tagline: "",
    platform: "",
    hash_tag: [""],
    creative_notes: "",
    content_requirements: [""],
    kpis: [{ metric: "", target: "", description: "" }],
  });

  const allPlatformOptions = ["Website", "TikTok", "Facebook"];
  const selectedPlatformsRaw = ensureArray(deliverables.platform);
  const selectedPlatforms = allPlatformOptions.filter((p) =>
    selectedPlatformsRaw.includes(p.toUpperCase()),
  );

  const removePlatformFromItems = (
    platformToRemove: string,
    currentAdvertisedItems: AdvertisingItem[],
  ) => {
    const upperToRemove = String(platformToRemove).toUpperCase();
    const updatedItems = currentAdvertisedItems.map((item: AdvertisingItem) => ({
      ...item,
      platform:
        item.platform && String(item.platform).toUpperCase() === upperToRemove ? "" : item.platform,
    }));
    return updatedItems;
  };

  const addPlatform = (platform: string) => {
    const current = ensureArray(deliverables.platform).map((p: string) => String(p).toUpperCase());
    const upper = platform.toUpperCase();
    if (!current.includes(upper)) updateDeliverables({ platform: [...current, upper] });
  };

  const removePlatform = (platform: string) => {
    const upper = platform.toUpperCase();
    const currentPlatforms = ensureArray(deliverables.platform).map((p: string) =>
      String(p).toUpperCase(),
    );
    const updatedPlatforms = currentPlatforms.filter((p: string) => p !== upper);

    const currentAdvertisedItems = ensureArray(deliverables.advertised_items);
    const updatedAdvertisedItems = removePlatformFromItems(platform, currentAdvertisedItems);

    updateDeliverables({ platform: updatedPlatforms, advertised_items: updatedAdvertisedItems });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.itemIdx !== null) {
      const items = advertisedItems;
      updateDeliverables({
        advertised_items: items.filter((_, idx) => idx !== deleteDialog.itemIdx),
      });
    }
    setDeleteDialog({ isOpen: false, itemIdx: null, itemName: "" });
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
          <div className="space-y-4 p-4 border border-pink-200 rounded-lg bg-white shadow-sm">
            <div className="text-pink-900 font-semibold text-lg mb-4">
              Affiliate Link & Target Platforms
            </div>
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
                placeholder="example.com"
                value={deliverables.tracking_link || ""}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  if (val && !/^https?:\/\//i.test(val)) {
                    val = "https://" + val.replace(/^\/+/, "");
                  }

                  updateDeliverables({ tracking_link: val });
                }}
                className="bg-white border-pink-200 focus:border-pink-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                The main affiliate link that should be promoted across all platforms.
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 flex items-center gap-2 text-pink-800">
                <FaBullhorn className="w-4 h-4" />
                Target Platforms
              </Label>

              <div className="flex flex-wrap gap-2 mb-4">
                {allPlatformOptions.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform);
                  return (
                    <Button
                      key={platform}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`transition-all ${
                        isSelected
                          ? "bg-pink-500 text-white hover:bg-pink-600 border-pink-500"
                          : "border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400"
                      }`}
                      onClick={() =>
                        isSelected ? removePlatform(platform) : addPlatform(platform)
                      }
                    >
                      {platform}
                      {isSelected && <FaXmark className="w-3 h-3 ml-2" />}
                    </Button>
                  );
                })}
              </div>

              {selectedPlatforms.length > 0 ? (
                <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                  <p className="text-xs font-medium text-pink-800">
                    Selected: {selectedPlatforms.join(", ")} ({selectedPlatforms.length} platform
                    {selectedPlatforms.length !== 1 ? "s" : ""})
                  </p>
                </div>
              ) : (
                <p className="text-sm text-red-500 italic">
                  Select at least one platform to create content for.
                </p>
              )}
            </div>
          </div>

          {selectedPlatforms.length > 0 && (
            <div className="space-y-4">
              <p className="text-lg font-bold text-pink-900">Affiliate Content</p>

              {advertisedItems.map((item: AdvertisingItem, i: number) => {
                const items = [...advertisedItems];
                const itemName = item.name || `Affiliate Content #${i + 1}`;
                const isDefaultOpen = i === 0 || i === advertisedItems.length - 1;

                const openDeleteDialog = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setDeleteDialog({
                    isOpen: true,
                    itemIdx: i,
                    itemName: itemName,
                  });
                };

                const DeleteActionComponent = (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50"
                    onClick={openDeleteDialog}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                );

                return (
                  <CollapsibleSection
                    key={i}
                    title={itemName}
                    defaultOpen={isDefaultOpen}
                    actionComponent={DeleteActionComponent}
                  >
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`content-name-${i}`}>Content Name</Label>
                          <Input
                            id={`content-name-${i}`}
                            placeholder="Content name (e.g., Facebook post)"
                            value={item.name || ""}
                            onChange={(e) => {
                              const updated = [...advertisedItems];
                              updated[i] = { ...updated[i], name: e.target.value, id: i + 1 };
                              updateDeliverables({ advertised_items: updated });
                            }}
                            className="bg-white border-pink-200 focus:border-pink-400"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`platform-select-${i}`}>Platform</Label>
                          <Select
                            value={
                              (item.platform &&
                                selectedPlatforms.find(
                                  (p) => p.toUpperCase() === String(item.platform).toUpperCase(),
                                )) ||
                              ""
                            }
                            onValueChange={(value) => {
                              const updated = [...advertisedItems];
                              updated[i] = {
                                ...updated[i],
                                platform: value ? value.toUpperCase() : "",
                              };
                              updateDeliverables({ advertised_items: updated });
                            }}
                          >
                            <SelectTrigger
                              id={`platform-select-${i}`}
                              className="bg-white border-pink-200 focus:border-pink-400"
                              disabled={selectedPlatforms.length === 0}
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
                          const updated = [...advertisedItems];
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
                          const updated = [...advertisedItems];
                          updated[i] = { ...updated[i], description: e.target.value };
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
                          const updated = [...advertisedItems];
                          updated[i] = { ...updated[i], creative_notes: e.target.value };
                          updateDeliverables({ advertised_items: updated });
                        }}
                        className="bg-white border-pink-200 focus:border-pink-400"
                      />

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-pink-800">
                          <FaHashtag className="w-4 h-4" />
                          Hashtags
                        </Label>

                        <div className="flex flex-wrap items-center gap-2 border border-pink-200 rounded-lg p-3">
                          {ensureArray(item.hash_tag).map((tag, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 bg-white border border-pink-200 rounded-full px-3 py-1 shadow-sm"
                            >
                              <Input
                                placeholder={`#hashtag${idx + 1}`}
                                value={tag}
                                onChange={(e) => {
                                  const updated = [...items];
                                  const newTags = [...ensureArray(item.hash_tag)];
                                  let val = e.target.value;
                                  if (val && !val.startsWith("#"))
                                    val = "#" + val.replace(/^#+/, "");
                                  newTags[idx] = val;
                                  updated[i] = { ...updated[i], hash_tag: newTags };
                                  updateDeliverables({ advertised_items: updated });
                                }}
                                className="w-24 text-xs shadow-none border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:bg-red-50 rounded-full"
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
                                <FaTrash className="w-3 h-3" />
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
                            className="border-pink-300 text-pink-700 hover:bg-pink-100/70 rounded-full px-3 py-1"
                          >
                            <FaPlus className="w-3 h-3 mr-1" /> Add Hashtag
                          </Button>
                        </div>
                      </div>

                      <DynamicListInput
                        label="Content Requirements"
                        icon={<FaBars className="w-4 h-4" />}
                        items={item.content_requirements || []}
                        placeholder="e.g., Tone: Professional"
                        helpText="Specific requirements for this content"
                        multiline
                        onChange={(content_requirements) => {
                          const updated = [...advertisedItems];
                          updated[i] = { ...updated[i], content_requirements };
                          updateDeliverables({ advertised_items: updated });
                        }}
                        addLabel="Add Content Requirement"
                      />

                      <div>
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                          <FaPenToSquare className="w-4 h-4" />
                          Creative Materials
                        </Label>

                        <ContractUploader
                          userId={formData?.brand_id || "unknown"}
                          accept="image/*,video/*"
                          multiple
                          maxFiles={10}
                          maxSize={100}
                          allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                          title="Upload creative materials"
                          context={`affiliate-content-${i + 1}`}
                          initialUrls={item.material_url || []}
                          onUploadComplete={(urls) => {
                            const updated = [...advertisedItems];
                            updated[i] = {
                              ...updated[i],
                              material_url: [...(updated[i].material_url || []), ...urls],
                            };
                            updateDeliverables({ advertised_items: updated });
                          }}
                          onFilesRemove={(removedUrls) => {
                            const updated = [...advertisedItems];
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

                      <div className="border-t pt-4">
                        <CompactKPISelector
                          contractType="AFFILIATE"
                          kpis={(item.kpis || []).map((kpi: any) => ({
                            metric: kpi.type || kpi.metric || "",
                            target: kpi.target_value || kpi.target || "",
                            description: kpi.description || "",
                          }))}
                          onChange={(kpis) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ advertised_items: updated });
                          }}
                        />
                      </div>
                    </div>
                  </CollapsibleSection>
                );
              })}

              <Button
                variant="outline"
                onClick={() =>
                  updateDeliverables({
                    advertised_items: [
                      ...advertisedItems,
                      {
                        ...newAdvertisingItem(),
                        id: advertisedItems.length + 1,
                        platform: selectedPlatforms[0] ? selectedPlatforms[0].toUpperCase() : "",
                      },
                    ],
                  })
                }
                className="w-full py-6 border-2 border-dashed hover:bg-pink-50"
                style={{ borderColor: "#ff9fb2" }}
              >
                <FaPlus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <WarningDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, isOpen: open }))}
        title="Confirm Advertisement Deletion"
        description={`You are deleting the advertisement item: "${deleteDialog.itemName}".`}
        warningMessage="This action cannot be undone and will permanently delete this data."
        additionalInfo="Please confirm to proceed."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, itemIdx: null, itemName: "" })}
        confirmText="Delete Permanently"
      />
    </div>
  );
};

export default AffiliateScope;
