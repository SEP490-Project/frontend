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
  const scope = formData?.scope_of_work || {}; // Changed from scopeOfWork to scope_of_work
  const deliverables = scope.deliverables || {};

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
  const advertisedItems = ensureArray(deliverables.advertised_items); // snake_case

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
        // snake_case
        normalized.advertised_items = normalizeAdvertisedItems(
          // snake_case
          partialDeliverables.advertised_items, // snake_case
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
      (!deliverables.advertised_items || deliverables.advertised_items.length === 0) && // snake_case
      ensureArray(deliverables.platform).length > 0
    ) {
      // Create initial content for each selected platform
      const platforms = ensureArray(deliverables.platform);
      const initialItems = platforms.map((platform: string, index: number) => ({
        ...newAdvertisingItem(),
        id: index + 1,
        platform: platform.toUpperCase(),
      }));

      updateDeliverables({
        advertised_items: initialItems, // snake_case
      });
    }
  }, [formData, deliverables.platform, deliverables.advertised_items, updateDeliverables]);

  const newAdvertisingItem = (): AdvertisingItem => ({
    id: 0,
    name: "",
    description: "",
    material_url: [], // snake_case
    tagline: "",
    platform: "",
    hash_tag: [""], // snake_case
    creative_notes: "", // snake_case
    content_requirements: [""], // snake_case
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

    const currentAdvertisedItems = ensureArray(deliverables.advertised_items); // snake_case
    const updatedAdvertisedItems = removePlatformFromItems(platform, currentAdvertisedItems);

    // After removing platform, redistribute items to remaining platforms
    if (updatedPlatforms.length > 0 && updatedAdvertisedItems.length > 0) {
      // Find items that lost their platform and reassign them
      const itemsWithoutPlatform = updatedAdvertisedItems.filter((item) => !item.platform);
      itemsWithoutPlatform.forEach((item, idx) => {
        const assignedPlatform = updatedPlatforms[idx % updatedPlatforms.length];
        item.platform = assignedPlatform;
      });
    }

    updateDeliverables({ platform: updatedPlatforms, advertised_items: updatedAdvertisedItems }); // snake_case
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.itemIdx !== null) {
      const items = advertisedItems;
      const updatedItems = items.filter((_, idx) => idx !== deleteDialog.itemIdx);

      // After deletion, ensure all selected platforms are still covered
      ensureAllPlatformsCovered(updatedItems);

      updateDeliverables({
        advertised_items: updatedItems, // snake_case
      });
    }
    setDeleteDialog({ isOpen: false, itemIdx: null, itemName: "" });
  };

  // Helper function to ensure all selected platforms have at least one content
  const ensureAllPlatformsCovered = (items: AdvertisingItem[]) => {
    const selectedPlatformsUpper = selectedPlatforms.map((p) => p.toUpperCase());
    const usedPlatforms = items.map((item) => item.platform?.toUpperCase()).filter(Boolean);

    // Find platforms that don't have any content
    const uncoveredPlatforms = selectedPlatformsUpper.filter(
      (platform) => !usedPlatforms.includes(platform),
    );

    // If there are uncovered platforms and we have items, assign them
    if (uncoveredPlatforms.length > 0 && items.length > 0) {
      uncoveredPlatforms.forEach((platform, idx) => {
        // Assign to items that don't have a platform yet, or cycle through existing items
        const targetItemIdx = idx % items.length;
        if (!items[targetItemIdx].platform) {
          items[targetItemIdx].platform = platform;
        }
      });
    }
  };

  // Function to get the next platform that should be assigned to new content
  const getNextPlatformToAssign = () => {
    if (selectedPlatforms.length === 0) return "";

    const selectedPlatformsUpper = selectedPlatforms.map((p) => p.toUpperCase());
    const currentPlatformCounts = selectedPlatformsUpper.reduce(
      (counts, platform) => {
        counts[platform] = advertisedItems.filter(
          (item) => item.platform?.toUpperCase() === platform,
        ).length;
        return counts;
      },
      {} as Record<string, number>,
    );

    // Find the platform with the least content assigned
    const minCount = Math.min(...Object.values(currentPlatformCounts));
    const leastUsedPlatform = selectedPlatformsUpper.find(
      (platform) => currentPlatformCounts[platform] === minCount,
    );

    return leastUsedPlatform || selectedPlatformsUpper[0];
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <FaLink className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Affiliate Marketing Program</h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Configure affiliate links and target platforms
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="space-y-6 p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaLink className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg">
                Affiliate Link & Target Platforms
              </h3>
            </div>
            <div>
              <Label
                htmlFor="tracking-link"
                className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700"
              >
                <div className="bg-blue-100 p-1 rounded">
                  <FaLink className="w-4 h-4 text-blue-600" />
                </div>
                Tracking Link
              </Label>
              <Input
                id="tracking-link"
                placeholder="example.com"
                value={deliverables.tracking_link || ""}
                onChange={(e) => {
                  let val = e.target.value.trim();
                  if (val && !/^https?:\/\//i.test(val)) {
                    val = `https://${val}`;
                  }

                  updateDeliverables({ tracking_link: val });
                }}
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                The main affiliate link that should be promoted across all platforms.
              </p>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700">
                <div className="bg-purple-100 p-1 rounded">
                  <FaBullhorn className="w-4 h-4 text-purple-600" />
                </div>
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
                <div className="bg-pink-50 p-3 rounded-lg border border-pink-200 space-y-2">
                  <p className="text-xs font-medium text-pink-800">
                    Selected: {selectedPlatforms.join(", ")} ({selectedPlatforms.length} platform
                    {selectedPlatforms.length !== 1 ? "s" : ""})
                  </p>
                  {advertisedItems.length > 0 && (
                    <div className="text-xs text-pink-700">
                      <p className="font-medium mb-1">Platform Distribution:</p>
                      {selectedPlatforms.map((platform) => {
                        const count = advertisedItems.filter(
                          (item) => item.platform?.toUpperCase() === platform.toUpperCase(),
                        ).length;
                        return (
                          <span key={platform} className="inline-block mr-3">
                            {platform}: {count} content{count !== 1 ? "s" : ""}
                          </span>
                        );
                      })}
                    </div>
                  )}
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

              {/* Platform Coverage Warning */}
              {(() => {
                const uncoveredPlatforms = selectedPlatforms.filter(
                  (platform) =>
                    !advertisedItems.some(
                      (item) => item.platform?.toUpperCase() === platform.toUpperCase(),
                    ),
                );
                return (
                  uncoveredPlatforms.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-800">
                        ⚠️ Missing content for platforms: {uncoveredPlatforms.join(", ")}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Each selected platform must have at least one content item.
                      </p>
                    </div>
                  )
                );
              })()}

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
                              updateDeliverables({ advertised_items: updated }); // snake_case
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
                              updateDeliverables({ advertised_items: updated }); // snake_case
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
                          updateDeliverables({ advertised_items: updated }); // snake_case
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
                          updateDeliverables({ advertised_items: updated }); // snake_case
                        }}
                        className="bg-white border-pink-200 focus:border-pink-400"
                      />

                      <Label htmlFor={`creative-notes-${i}`}>Creative Notes</Label>
                      <Textarea
                        id={`creative-notes-${i}`}
                        placeholder="Creative notes, tone, style guidelines..."
                        value={item.creative_notes || ""} // snake_case
                        onChange={(e) => {
                          const updated = [...advertisedItems];
                          updated[i] = { ...updated[i], creative_notes: e.target.value }; // snake_case
                          updateDeliverables({ advertised_items: updated }); // snake_case
                        }}
                        className="bg-white border-pink-200 focus:border-pink-400"
                      />

                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2 text-pink-800">
                          <FaHashtag className="w-4 h-4" />
                          Hashtags
                        </Label>

                        <div className="flex flex-wrap items-center gap-2 border border-pink-200 rounded-lg p-3">
                          {ensureArray(item.hash_tag).map(
                            (
                              tag,
                              idx, // snake_case
                            ) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1 bg-white border border-pink-200 rounded-full px-3 py-1 shadow-sm"
                              >
                                <Input
                                  placeholder={`#hashtag${idx + 1}`}
                                  value={tag}
                                  onChange={(e) => {
                                    const updated = [...items];
                                    const newTags = [...ensureArray(item.hash_tag)]; // snake_case
                                    let val = e.target.value;
                                    if (val && !val.startsWith("#"))
                                      val = "#" + val.replace(/^#+/, "");
                                    newTags[idx] = val;
                                    updated[i] = { ...updated[i], hash_tag: newTags }; // snake_case
                                    updateDeliverables({ advertised_items: updated }); // snake_case
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
                                        // snake_case
                                        (_, tIdx) => tIdx !== idx,
                                      ),
                                    };
                                    updateDeliverables({ advertised_items: updated }); // snake_case
                                  }}
                                >
                                  <FaTrash className="w-3 h-3" />
                                </Button>
                              </div>
                            ),
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = [...items];
                              updated[i] = {
                                ...updated[i],
                                hash_tag: [...ensureArray(item.hash_tag), ""], // snake_case
                              };
                              updateDeliverables({ advertised_items: updated }); // snake_case
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
                        items={item.content_requirements || []} // snake_case
                        placeholder="e.g., Tone: Professional"
                        helpText="Specific requirements for this content"
                        multiline
                        onChange={(content_requirements) => {
                          // snake_case
                          const updated = [...advertisedItems];
                          updated[i] = { ...updated[i], content_requirements }; // snake_case
                          updateDeliverables({ advertised_items: updated }); // snake_case
                        }}
                        addLabel="Add Content Requirement"
                      />

                      <div>
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                          <FaPenToSquare className="w-4 h-4" />
                          Creative Materials
                        </Label>

                        <ContractUploader
                          userId={formData?.brand_id || "unknown"} // snake_case
                          accept="image/*,video/*"
                          multiple
                          maxFiles={10}
                          maxSize={100}
                          allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                          title="Upload creative materials"
                          context={`affiliate-content-${i + 1}`}
                          initialUrls={item.material_url || []} // snake_case
                          onUploadComplete={(urls) => {
                            const updated = [...advertisedItems];
                            updated[i] = {
                              ...updated[i],
                              material_url: [...(updated[i].material_url || []), ...urls], // snake_case
                            };
                            updateDeliverables({ advertised_items: updated }); // snake_case
                          }}
                          onFilesRemove={(removedUrls) => {
                            const updated = [...advertisedItems];
                            const currentUrls = updated[i].material_url || []; // snake_case
                            updated[i] = {
                              ...updated[i],
                              material_url: currentUrls.filter(
                                // snake_case
                                (url: string) => !removedUrls.includes(url),
                              ),
                            };
                            updateDeliverables({ advertised_items: updated }); // snake_case
                          }}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <CompactKPISelector
                          contractType="AFFILIATE"
                          kpis={(item.kpis || []).map((kpi: any) => ({
                            metric: kpi.type || kpi.metric || "",
                            target: kpi.target_value || kpi.target || "", // snake_case
                            description: kpi.description || "",
                          }))}
                          onChange={(kpis) => {
                            const updated = [...items];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ advertised_items: updated }); // snake_case
                          }}
                        />
                      </div>
                    </div>
                  </CollapsibleSection>
                );
              })}

              <Button
                variant="outline"
                onClick={() => {
                  const newItems = [
                    ...advertisedItems,
                    {
                      ...newAdvertisingItem(),
                      id: advertisedItems.length + 1,
                      platform: getNextPlatformToAssign(),
                    },
                  ];
                  updateDeliverables({
                    advertised_items: newItems, // snake_case
                  });
                }}
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
