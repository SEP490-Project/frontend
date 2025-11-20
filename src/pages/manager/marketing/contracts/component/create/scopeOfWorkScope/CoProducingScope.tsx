import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaHandshake, FaPalette, FaHashtag, FaNewspaper, FaTrash, FaPlus } from "react-icons/fa6";
import {
  CollapsibleSection,
  DynamicListInput,
  CompactKPISelector,
} from "../shared/SharedComponents";
import type { Product, Concept, ScopeOfWorkProps } from "../types/scopeTypes";
import ContractUploader from "@/components/global/ContractUploader";
import { useAuth } from "@/libs/hooks/useAuth";
import WarningDialog from "@/components/global/WarningDialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const CoProducingScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scope_of_work || {};
  const deliverables = scope.deliverables || {};
  const { user } = useAuth();

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: "product" | "concept" | null;
    productIdx: number | null;
    conceptIdx: number | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    productIdx: null,
    conceptIdx: null,
    name: "",
  });

  const updateDeliverables = (partialDeliverables: any) => {
    const updated = { ...deliverables, ...partialDeliverables };
    onUpdateScopeOfWork({ ...scope, deliverables: updated });
  };

  const newProduct = (): Product => ({
    id: 0,
    name: "",
    description: "",
    material_url: [], // snake_case
    kpis: [{ metric: "", target: "", description: "" }],
    concepts: [],
  });

  const newConcept = (): Concept => ({
    product_id: 0, // snake_case
    platform: "",
    name: "",
    description: "",
    tagline: "",
    hash_tag: [""], // snake_case
    creative_notes: "", // snake_case
    content_requirements: [""], // snake_case
    material_url: [], // snake_case
    kpis: [{ metric: "", target: "", description: "" }],
  });

  // Ensure products have concepts array
  const products = ensureArray(deliverables.products).map((p: any) => ({
    ...p,
    concepts: ensureArray(p.concepts),
  }));

  // Thêm effect này để tự động có 1 product nếu chưa có
  useEffect(() => {
    if (!products.length) {
      updateDeliverables({
        products: [{ ...newProduct(), id: 1 }],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]); // chỉ chạy khi formData thay đổi

  const platformOptions = ["Website", "TikTok", "Facebook"];

  // Handle delete confirm
  const handleConfirmDelete = () => {
    if (deleteDialog.type === "product" && deleteDialog.productIdx !== null) {
      updateDeliverables({
        products: products.filter((_, idx) => idx !== deleteDialog.productIdx),
      });
    }
    if (
      deleteDialog.type === "concept" &&
      deleteDialog.productIdx !== null &&
      deleteDialog.conceptIdx !== null
    ) {
      const updatedProducts = [...products];
      updatedProducts[deleteDialog.productIdx].concepts = updatedProducts[
        deleteDialog.productIdx
      ].concepts.filter((_: any, idx: number) => idx !== deleteDialog.conceptIdx);
      updateDeliverables({ products: updatedProducts });
    }
    setDeleteDialog({
      isOpen: false,
      type: null,
      productIdx: null,
      conceptIdx: null,
      name: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaHandshake className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Co-Producing Deliverables</h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Define products and concepts for collaboration
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Products Section */}
          <div className="space-y-4">
            {products.map((p: Product, i: number) => {
              const isDefaultOpen = i === 0 || i === products.length - 1;

              const DeleteActionComponent = (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      type: "product",
                      productIdx: i,
                      conceptIdx: null,
                      name: p.name || `Product ${i + 1}`,
                    })
                  }
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              );

              return (
                <CollapsibleSection
                  key={i}
                  title={p.name || `Product ${i + 1}`}
                  defaultOpen={isDefaultOpen}
                  badge={p.concepts.length > 0 ? p.concepts.length : undefined}
                  actionComponent={DeleteActionComponent}
                >
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Product Name</Label>
                      <Input
                        placeholder="Product name"
                        value={p.name || ""}
                        onChange={(e) => {
                          const updated = [...products];
                          updated[i] = { ...updated[i], name: e.target.value, id: i + 1 };
                          updateDeliverables({ products: updated });
                        }}
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Product Description</Label>
                      <Textarea
                        placeholder="Product description"
                        value={p.description || ""}
                        onChange={(e) => {
                          const updated = [...products];
                          updated[i] = { ...updated[i], description: e.target.value };
                          updateDeliverables({ products: updated });
                        }}
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                        <div className="bg-green-100 p-1 rounded">
                          <FaPalette className="w-4 h-4 text-green-600" />
                        </div>
                        Product Materials
                      </Label>

                      <ContractUploader
                        userId={user?.id || "unknown"}
                        accept="image/*,video/*"
                        multiple={true}
                        maxFiles={20}
                        maxSize={200}
                        allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                        title="Upload product materials"
                        context={`coproducing-product-${i + 1}`}
                        initialUrls={p.material_url || []}
                        onUploadComplete={(urls) => {
                          const updated = [...products];
                          updated[i] = {
                            ...updated[i],
                            material_url: [...(updated[i].material_url || []), ...urls],
                          };
                          updateDeliverables({ products: updated });
                        }}
                        onFilesRemove={(removedUrls) => {
                          const updated = [...products];
                          const currentUrls = updated[i].material_url || [];
                          updated[i] = {
                            ...updated[i],
                            material_url: currentUrls.filter(
                              (url: string) => !removedUrls.includes(url),
                            ),
                          };
                          updateDeliverables({ products: updated });
                        }}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <CompactKPISelector
                        contractType="CO_PRODUCING"
                        kpis={(p.kpis || []).map((kpi: any) => ({
                          metric: kpi.type || kpi.metric || "",
                          target: kpi.target_value || kpi.target || "",
                          description: kpi.description || "",
                        }))}
                        onChange={(kpis) => {
                          const updated = [...products];
                          updated[i] = { ...updated[i], kpis };
                          updateDeliverables({ products: updated });
                        }}
                      />
                    </div>

                    {/* Concepts Section inside Product */}
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <div className="bg-purple-100 p-1 rounded">
                          <FaNewspaper className="w-4 h-4 text-purple-600" />
                        </div>
                        Concepts
                      </div>
                      {p.concepts.map((c: Concept, j: number) => {
                        const isConceptOpen = j === 0 || j === p.concepts.length - 1;
                        const DeleteConceptAction = (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() =>
                              setDeleteDialog({
                                isOpen: true,
                                type: "concept",
                                productIdx: i,
                                conceptIdx: j,
                                name: c.name || `Concept #${j + 1}`,
                              })
                            }
                          >
                            <FaTrash className="w-4 h-4" />
                          </Button>
                        );
                        return (
                          <CollapsibleSection
                            key={j}
                            title={c.name || `Concept #${j + 1}`}
                            defaultOpen={isConceptOpen}
                            actionComponent={DeleteConceptAction}
                          >
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium mb-2 block">
                                  Concept Name
                                </Label>
                                <Input
                                  placeholder="Concept name"
                                  value={c.name || ""}
                                  onChange={(e) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = { ...concepts[j], name: e.target.value };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                />
                              </div>

                              <div>
                                <Label className="text-sm font-medium mb-2 block">Platform</Label>
                                <Select
                                  value={
                                    (c.platform &&
                                      platformOptions.find(
                                        (p) => p.toUpperCase() === String(c.platform).toUpperCase(),
                                      )) ||
                                    ""
                                  }
                                  onValueChange={(value) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = {
                                      ...concepts[j],
                                      platform: value ? String(value).toUpperCase() : "",
                                    };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                >
                                  <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
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

                              <div>
                                <Label className="text-sm font-medium mb-2 block">Tagline</Label>
                                <Input
                                  placeholder="Tagline"
                                  value={c.tagline || ""}
                                  onChange={(e) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = { ...concepts[j], tagline: e.target.value };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                />
                              </div>

                              <div>
                                <Label className="text-sm font-medium mb-2 block">
                                  Concept Description
                                </Label>
                                <Textarea
                                  placeholder="Concept description"
                                  value={c.description || ""}
                                  onChange={(e) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = { ...concepts[j], description: e.target.value };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                />
                              </div>

                              <div>
                                <Label className="text-sm font-medium mb-2 block">
                                  Creative Notes
                                </Label>
                                <Textarea
                                  placeholder="Creative notes and guidelines"
                                  value={c.creative_notes || ""}
                                  onChange={(e) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = {
                                      ...concepts[j],
                                      creative_notes: e.target.value,
                                    };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                  className="bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                                  <div className="bg-blue-100 p-1 rounded">
                                    <FaHashtag className="w-4 h-4 text-blue-600" />
                                  </div>
                                  Hashtags
                                </Label>
                                <div className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-white to-gray-50">
                                  {ensureArray(c.hash_tag).map((tag, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 shadow-sm hover:bg-blue-100 transition-colors"
                                    >
                                      <Input
                                        placeholder={`#hashtag${idx + 1}`}
                                        value={tag}
                                        onChange={(e) => {
                                          const updated = [...products];
                                          const concepts = [...updated[i].concepts];
                                          const newTags = [...ensureArray(concepts[j].hash_tag)];
                                          let val = e.target.value;
                                          if (val && !val.startsWith("#"))
                                            val = "#" + val.replace(/^#+/, "");
                                          newTags[idx] = val;
                                          concepts[j] = { ...concepts[j], hash_tag: newTags };
                                          updated[i].concepts = concepts;
                                          updateDeliverables({ products: updated });
                                        }}
                                        className="w-24 text-xs shadow-none border-none focus:ring-0 focus:outline-none focus-visible:ring-0"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:bg-red-50 rounded-full"
                                        onClick={() => {
                                          const updated = [...products];
                                          const concepts = [...updated[i].concepts];
                                          concepts[j] = {
                                            ...concepts[j],
                                            hash_tag: ensureArray(concepts[j].hash_tag).filter(
                                              (_: any, tIdx: number) => tIdx !== idx,
                                            ),
                                          };
                                          updated[i].concepts = concepts;
                                          updateDeliverables({ products: updated });
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
                                      const updated = [...products];
                                      const concepts = [...updated[i].concepts];
                                      concepts[j] = {
                                        ...concepts[j],
                                        hash_tag: [...ensureArray(concepts[j].hash_tag), ""],
                                      };
                                      updated[i].concepts = concepts;
                                      updateDeliverables({ products: updated });
                                    }}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-100 rounded-full px-3 py-1 transition-colors"
                                  >
                                    <FaPlus className="w-3 h-3 mr-1" /> Add Hashtag
                                  </Button>
                                </div>
                              </div>

                              <DynamicListInput
                                label="Content Requirements"
                                icon={<FaNewspaper className="w-4 h-4" />}
                                items={c.content_requirements || []}
                                placeholder="e.g., Must include product logo"
                                multiline
                                onChange={(items) => {
                                  const updated = [...products];
                                  const concepts = [...updated[i].concepts];
                                  concepts[j] = {
                                    ...concepts[j],
                                    content_requirements: items,
                                  };
                                  updated[i].concepts = concepts;
                                  updateDeliverables({ products: updated });
                                }}
                              />

                              <div>
                                <Label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                  <div className="bg-green-100 p-1 rounded">
                                    <FaPalette className="w-4 h-4 text-green-600" />
                                  </div>
                                  Concept Materials
                                </Label>
                                <ContractUploader
                                  userId={formData?.brand_id || "unknown"}
                                  accept="image/*,video/*"
                                  multiple={true}
                                  maxFiles={20}
                                  maxSize={200}
                                  allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                                  title="Upload concept materials"
                                  context={`coproducing-concept-${i + 1}-${j + 1}`}
                                  initialUrls={c.material_url || []}
                                  onUploadComplete={(urls) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = {
                                      ...concepts[j],
                                      material_url: [...(concepts[j].material_url || []), ...urls],
                                    };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                  onFilesRemove={(removedUrls) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    const currentUrls = concepts[j].material_url || [];
                                    concepts[j] = {
                                      ...concepts[j],
                                      material_url: currentUrls.filter(
                                        (url: string) => !removedUrls.includes(url),
                                      ),
                                    };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                />
                              </div>

                              <div className="border-t pt-4">
                                <CompactKPISelector
                                  contractType="ADVERTISING"
                                  kpis={(c.kpis || []).map((kpi: any) => ({
                                    metric: kpi.type || kpi.metric || "",
                                    target: kpi.target_value || kpi.target || "",
                                    description: kpi.description || "",
                                  }))}
                                  onChange={(kpis) => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = { ...concepts[j], kpis };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
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
                          const updated = [...products];
                          updated[i].concepts = [
                            ...updated[i].concepts,
                            { ...newConcept(), product_id: updated[i].id || i + 1 },
                          ];
                          updateDeliverables({ products: updated });
                        }}
                        className="w-full py-6 border-2 border-dashed border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FaPlus className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-700">Add New Concept</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </CollapsibleSection>
              );
            })}

            <Button
              variant="outline"
              onClick={() =>
                updateDeliverables({
                  products: [...products, { ...newProduct(), id: products.length + 1 }],
                })
              }
              className="w-full py-6 border-2 border-dashed border-blue-300 hover:bg-blue-50 hover:border-blue-400 transition-all rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaPlus className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">Add New Product</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <WarningDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, isOpen: open }))}
        title={
          deleteDialog.type === "product" ? "Confirm Product Deletion" : "Confirm Concept Deletion"
        }
        description={
          deleteDialog.type === "product"
            ? `You are deleting the product: "${deleteDialog.name}".`
            : `You are deleting the concept: "${deleteDialog.name}".`
        }
        warningMessage="This action cannot be undone and will permanently delete this data."
        additionalInfo="Please confirm to proceed."
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteDialog({
            isOpen: false,
            type: null,
            productIdx: null,
            conceptIdx: null,
            name: "",
          })
        }
        confirmText="Delete Permanently"
      />
    </div>
  );
};

export default CoProducingScope;
