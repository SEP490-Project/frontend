import React, { useEffect, useState, useCallback } from "react";
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
import { FaBullhorn, FaPlus, FaTrash } from "react-icons/fa6";
import {
  CollapsibleSection,
  DynamicListInput,
  CompactKPISelector,
} from "../shared/SharedComponents";
import type { AdvertisingItem, ScopeOfWorkProps } from "../types/scopeTypes";
import ContractUploader from "@/components/global/ContractUploader";
import { WarningDialog } from "@/components/global";
import { getItem } from "@/libs/local-storage";

const AdvertisingScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scope_of_work || {};
  const deliverables = scope.deliverables || {};
  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
  const user = getItem<{ id: string }>("user");

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
    material_url: [],
    tagline: "",
    platform: "",
    hash_tag: ["#"],
    creative_notes: "",
    content_requirements: [""],
    kpis: [{ metric: "", target: "", description: "" }],
  });

  const platformOptions = ["Website", "TikTok", "Facebook"];

  useEffect(() => {
    if (
      formData &&
      (!deliverables.advertised_items || deliverables.advertised_items.length === 0)
    ) {
      updateDeliverables({
        advertised_items: [{ ...newAdvertisingItem(), id: 1 }],
      });
    }
  }, [formData, deliverables.advertised_items, updateDeliverables]);

  const advertisedItems = ensureArray(deliverables.advertised_items);

  useEffect(() => {
    const items = [...advertisedItems];
    let hasChanges = false;

    items.forEach((item, index) => {
      if (!item.hash_tag || item.hash_tag.length === 0) {
        items[index] = { ...item, hash_tag: ["#"] };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      updateDeliverables({ advertised_items: items });
    }
  }, [advertisedItems, updateDeliverables]);

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
    <div>
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 border border-gray-200 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 p-2 rounded-lg">
            <FaBullhorn className="w-5 h-5 text-orange-800" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Advertising Campaign Deliverables
            </h2>
            <p className="text-sm text-gray-600 mt-1">Create and manage advertising content</p>
          </div>
        </div>

        <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full border">
          {advertisedItems.length} items
        </span>
      </div>

      <div className="pt-6 space-y-6">
        {advertisedItems.map((item: AdvertisingItem, i: number) => {
          const items = [...advertisedItems];
          const isDefaultOpen = i === 0 || i === advertisedItems.length - 1;
          const itemName = item.name || `Content #${i + 1}`;

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
                        updateDeliverables({ advertised_items: updated });
                      }}
                      className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
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
                        updateDeliverables({ advertised_items: updated });
                      }}
                    >
                      <SelectTrigger className="bg-white focus:border-orange-400">
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
                      updateDeliverables({ advertised_items: updated });
                    }}
                    className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
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
                      updateDeliverables({ advertised_items: updated });
                    }}
                    className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Creative Notes</Label>
                  <Textarea
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
                    className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium mb-2 block">Hashtags</Label>

                  <div className="flex items-center flex-wrap gap-2">
                    {ensureArray(item.hash_tag).map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 bg-white border rounded-full px-3 py-1 shadow-sm flex-shrink-0"
                      >
                        <Input
                          placeholder={`#hashtag${idx + 1}`}
                          value={tag}
                          onChange={(e) => {
                            const updated = [...items];
                            const newTags = [...ensureArray(item.hash_tag)];
                            let val = e.target.value;
                            if (val && !val.startsWith("#")) val = "#" + val.replace(/^#+/, "");
                            newTags[idx] = val;
                            updated[i] = { ...updated[i], hash_tag: newTags };
                            updateDeliverables({ advertised_items: updated });
                          }}
                          className="text-xs shadow-none border-none focus:ring-0 focus:outline-none focus-visible:ring-0 p-0"
                        />

                        {ensureArray(item.hash_tag).length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-50 rounded-full w-5 h-5 p-0"
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
                        )}
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const updated = [...items];
                        updated[i] = {
                          ...updated[i],
                          hash_tag: [...ensureArray(item.hash_tag), "#"],
                        };
                        updateDeliverables({ advertised_items: updated });
                      }}
                      className="border-orange-300 text-orange-800 hover:bg-orange-100/70 rounded-full flex-shrink-0 w-8 h-8"
                    >
                      <FaPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <DynamicListInput
                  label="Content Requirements"
                  items={item.content_requirements || []}
                  placeholder="e.g., Must include brand logo"
                  multiline
                  onChange={(content_requirements) => {
                    const updated = [...items];
                    updated[i] = { ...updated[i], content_requirements };
                    updateDeliverables({ advertised_items: updated });
                  }}
                  addLabel="Add Content Requirement"
                />

                <div>
                  <ContractUploader
                    userId={user?.id || "unknown"}
                    accept="image/*,video/*, .pdf, .doc, .docx, .ppt,.pptx"
                    multiple
                    maxFiles={10}
                    maxSize={100}
                    allowedTypes={[
                      "jpg",
                      "jpeg",
                      "png",
                      "webp",
                      "mp4",
                      "mov",
                      "avi",
                      "doc",
                      "docx",
                      "pdf",
                      "ppt",
                      "pptx",
                    ]}
                    title="Upload creative assets"
                    context={`advertising-content-${i + 1}`}
                    initialUrls={item.material_url || []}
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

                <div className="border-t pt-4">
                  <CompactKPISelector
                    contractType="ADVERTISING"
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
                { ...newAdvertisingItem(), id: advertisedItems.length + 1 },
              ],
            })
          }
          className="w-full py-6 border-2 border-dashed bg-white border-orange-200 hover:bg-orange-50 hover:border-orange-400 transition-all rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FaPlus className="w-5 h-5 text-orange-700" />
            <span className="font-medium text-orange-800">Add New Advertisement</span>
          </div>
        </Button>
      </div>

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
