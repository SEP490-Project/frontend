import React, { useEffect, useState, useCallback } from "react";
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
import { FaBullhorn, FaBullseye, FaHashtag, FaPalette, FaPlus, FaTrash } from "react-icons/fa6";
import {
  CollapsibleSection,
  DynamicListInput,
  CompactKPISelector,
} from "../shared/SharedComponents";
import type { AdvertisingItem, ScopeOfWorkProps } from "../types/scopeTypes";
import ContractUploader from "@/components/global/ContractUploader";
import { WarningDialog } from "@/components/global";

const AdvertisingScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scope_of_work || {}; // Changed from scopeOfWork to scope_of_work
  const deliverables = scope.deliverables || {};
  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    itemIdx: number | null;
    itemName: string;
  }>({
    isOpen: false,
    itemIdx: null,
    itemName: "",
  });

  const updateDeliverables = useCallback(
    (partialDeliverables: any) => {
      const updated = { ...deliverables, ...partialDeliverables };
      onUpdateScopeOfWork({ ...scope, deliverables: updated });
    },
    [deliverables, onUpdateScopeOfWork, scope],
  );

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

  const platformOptions = ["Website", "TikTok", "Facebook"];

  useEffect(() => {
    if (
      formData &&
      (!deliverables.advertised_items || deliverables.advertised_items.length === 0) // snake_case
    ) {
      updateDeliverables({
        advertised_items: [{ ...newAdvertisingItem(), id: 1 }], // snake_case
      });
    }
  }, [formData, deliverables.advertised_items, updateDeliverables]);

  const advertisedItems = ensureArray(deliverables.advertised_items); // snake_case

  const handleConfirmDelete = () => {
    if (deleteDialog.itemIdx !== null) {
      const items = advertisedItems;
      updateDeliverables({
        advertised_items: items.filter((_, idx) => idx !== deleteDialog.itemIdx), // snake_case
      });
    }
    setDeleteDialog({ isOpen: false, itemIdx: null, itemName: "" });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
          <CardTitle className="flex items-center justify-between text-pink-900">
            <div className="flex items-center gap-2">
              <FaBullhorn className="w-5 h-5" style={{ color: "#ff9fb2" }} />
              Advertising Campaign Deliverables
            </div>
            <span className="text-sm font-semibold text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              {advertisedItems.length} items
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {advertisedItems.map((item: AdvertisingItem, i: number) => {
            const items = [...advertisedItems];
            const isDefaultOpen = i === 0 || i === advertisedItems.length - 1;
            const itemName = item.name || `Content #${i + 1}`;

            // Hàm mở dialog
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
                <div className="p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Content Name</Label>
                      <Input
                        placeholder="Content name (e.g., Summer Sale Post)"
                        value={item.name || ""}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[i] = {
                            ...updated[i],
                            name: e.target.value,
                            id: i + 1,
                          };
                          updateDeliverables({ advertised_items: updated }); // snake_case
                        }}
                        className="bg-white border-pink-200 focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Platform</Label>
                      <Select
                        value={
                          (item.platform &&
                            platformOptions.find(
                              (p) => p.toUpperCase() === String(item.platform).toUpperCase(),
                            )) ||
                          ""
                        }
                        onValueChange={(value) => {
                          const updated = [...items];
                          updated[i] = {
                            ...updated[i],
                            platform: value ? value.toUpperCase() : "",
                          };
                          updateDeliverables({ advertised_items: updated }); // snake_case
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
                        updateDeliverables({ advertised_items: updated }); // snake_case
                      }}
                      className="bg-white border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Content Description</Label>
                    <Textarea
                      placeholder="Content description and messaging"
                      value={item.description || ""}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = {
                          ...updated[i],
                          description: e.target.value,
                        };
                        updateDeliverables({ advertised_items: updated }); // snake_case
                      }}
                      className="bg-white border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Creative Notes</Label>
                    <Textarea
                      placeholder="Creative notes, tone, style guidelines..."
                      value={item.creative_notes || ""} // snake_case
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = {
                          ...updated[i],
                          creative_notes: e.target.value, // snake_case
                        };
                        updateDeliverables({ advertised_items: updated }); // snake_case
                      }}
                      className="bg-white border-pink-200 focus:border-pink-400"
                    />
                  </div>

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
                                if (val && !val.startsWith("#")) val = "#" + val.replace(/^#+/, "");
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
                    icon={<FaBullseye className="w-4 h-4" />}
                    items={item.content_requirements || []} // snake_case
                    placeholder="e.g., Must include brand logo"
                    multiline
                    onChange={(content_requirements) => {
                      // snake_case
                      const updated = [...items];
                      updated[i] = { ...updated[i], content_requirements }; // snake_case
                      updateDeliverables({ advertised_items: updated }); // snake_case
                    }}
                    addLabel="Add Content Requirement"
                  />

                  <div>
                    <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                      <FaPalette className="w-4 h-4" />
                      Creative Assets
                    </Label>

                    <ContractUploader
                      userId={formData?.brand_id || "unknown"} // snake_case
                      accept="image/*,video/*"
                      multiple
                      maxFiles={10}
                      maxSize={100}
                      allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                      title="Upload creative assets"
                      context={`advertising-content-${i + 1}`}
                      initialUrls={item.material_url || []} // snake_case
                      onUploadComplete={(urls) => {
                        const updated = [...items];
                        updated[i] = {
                          ...updated[i],
                          material_url: [...(updated[i].material_url || []), ...urls], // snake_case
                        };
                        updateDeliverables({ advertised_items: updated }); // snake_case
                      }}
                      onFilesRemove={(removedUrls) => {
                        const updated = [...items];
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
                      contractType="ADVERTISING"
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
            onClick={() =>
              updateDeliverables({
                advertised_items: [
                  // snake_case
                  ...advertisedItems,
                  { ...newAdvertisingItem(), id: advertisedItems.length + 1 },
                ],
              })
            }
            className="w-full py-6 border-2 border-dashed hover:bg-pink-50"
            style={{ borderColor: "#ff9fb2" }}
          >
            <FaPlus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Advertisement
          </Button>
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

export default AdvertisingScope;
