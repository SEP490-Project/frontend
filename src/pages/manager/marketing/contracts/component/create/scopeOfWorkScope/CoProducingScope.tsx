import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaHandshake, FaNewspaper, FaTrash, FaPlus } from "react-icons/fa6";
import {
  CollapsibleSection,
  DynamicListInput,
  CompactKPISelector,
} from "../shared/SharedComponents";
import type { Product, Concept, ScopeOfWorkProps } from "../types/scopeTypes";
import ContractUploader from "@/components/global/ContractUploader";
import WarningDialog from "@/components/global/WarningDialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getItem } from "@/libs/local-storage";

const CoProducingScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scope_of_work || {};
  const deliverables = scope.deliverables || {};
  const user = getItem<{ id: string }>("user");

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

    if (updated.products) {
      const allConcepts: Concept[] = [];
      const productsWithoutConcepts: any[] = [];

      updated.products.forEach((product: Product) => {
        if (product.concepts && product.concepts.length > 0) {
          product.concepts.forEach((concept: Concept) => {
            allConcepts.push({
              ...concept,
              product_id: product.id || 0,
            });
          });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { concepts, ...productWithoutConcepts } = product;
        productsWithoutConcepts.push({
          ...productWithoutConcepts,
          material: product.material_url || [],
        });
      });

      const backendCompatibleData = {
        ...updated,
        products: productsWithoutConcepts,
        concepts: allConcepts,
      };

      onUpdateScopeOfWork({ ...scope, deliverables: backendCompatibleData });
    } else {
      onUpdateScopeOfWork({ ...scope, deliverables: updated });
    }
  };

  const newProduct = (): Product => ({
    id: 0,
    name: "",
    description: "",
    material_url: [],
    kpis: [{ metric: "", target: "", description: "" }],
    concepts: [],
  });

  const newConcept = (): Concept => ({
    product_id: 0,
    platform: "",
    name: "",
    description: "",
    tagline: "",
    hash_tag: ["#"],
    creative_notes: "",
    content_requirements: [""],
    material_url: [],
    kpis: [{ metric: "", target: "", description: "" }],
  });

  const products = ensureArray(deliverables.products).map((p: any) => {
    if (p.concepts && p.concepts.length > 0) {
      return {
        ...p,
        concepts: ensureArray(p.concepts),
        material_url: p.material_url || p.material || [],
      };
    }

    const productConcepts = ensureArray(deliverables.concepts).filter(
      (concept: any) => concept.product_id === p.id,
    );

    return {
      ...p,
      concepts: productConcepts,
      material_url: p.material_url || p.material || [],
    };
  });

  useEffect(() => {
    if (!products.length) {
      updateDeliverables({
        products: [{ ...newProduct(), id: 1 }],
      });
    }
  }, [formData]);

  useEffect(() => {
    const updatedProducts = [...products];
    let hasChanges = false;

    updatedProducts.forEach((product, productIdx) => {
      product.concepts.forEach((concept: any, conceptIdx: number) => {
        if (!concept.hash_tag || concept.hash_tag.length === 0) {
          updatedProducts[productIdx].concepts[conceptIdx] = {
            ...concept,
            hash_tag: ["#"],
          };
          hasChanges = true;
        }
      });
    });

    if (hasChanges) {
      updateDeliverables({ products: updatedProducts });
    }
  }, [products, updateDeliverables]);

  const platformOptions = ["Website", "TikTok", "Facebook"];

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
    <div>
      <div className="bg-gradient-to-r from-violet-100 to-violet-100 border border-gray-200 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-violet-50 p-2 rounded-lg">
            <FaHandshake className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Co-Producing Deliverables</h2>
            <p className="text-sm text-gray-600 mt-1">
              Define products and concepts for collaboration
            </p>
          </div>
        </div>
      </div>
      <div className="pt-6 space-y-6">
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
                      className="bg-white border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-lg"
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
                      className="bg-white border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <ContractUploader
                      userId={user?.id || "unknown"}
                      accept="image/*,video/*, .pdf, .doc, .docx, .ppt,.pptx"
                      multiple={true}
                      maxFiles={20}
                      maxSize={200}
                      allowedTypes={[
                        "jpg",
                        "jpeg",
                        "png",
                        "webp",
                        "mp4",
                        "mov",
                        "avi",
                        "pdf",
                        "doc",
                        "docx",
                        "ppt",
                        "pptx",
                      ]}
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

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                      <div className="bg-orange-100 p-1 rounded">
                        <FaNewspaper className="w-4 h-4 text-orange-600" />
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
                              <Label className="text-sm font-medium mb-2 block">Concept Name</Label>
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
                                className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
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
                                <SelectTrigger className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg">
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
                                className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
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
                                className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
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
                                className="bg-white border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium mb-2 block">Hashtags</Label>

                              <div className="flex items-center flex-wrap gap-2">
                                {ensureArray(c.hash_tag).map((tag, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1 bg-white border rounded-full px-3 py-1 shadow-sm flex-shrink-0"
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
                                      className="text-xs shadow-none border-none focus:ring-0 focus:outline-none focus-visible:ring-0 p-0"
                                    />

                                    {ensureArray(c.hash_tag).length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:bg-red-50 rounded-full w-5 h-5 p-0"
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
                                    )}
                                  </div>
                                ))}

                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const updated = [...products];
                                    const concepts = [...updated[i].concepts];
                                    concepts[j] = {
                                      ...concepts[j],
                                      hash_tag: [...ensureArray(concepts[j].hash_tag), "#"],
                                    };
                                    updated[i].concepts = concepts;
                                    updateDeliverables({ products: updated });
                                  }}
                                  className="border-orange-300 text-orange-800 hover:bg-orange-100/70 rounded-full flex-shrink-0 w-8 h-8"
                                >
                                  <FaPlus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <DynamicListInput
                              label="Content Requirements"
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
                              <ContractUploader
                                userId={user?.id || "unknown"}
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
                      className="w-full py-6 border-2 border-dashed border-orange-300 hover:bg-orange-50 hover:border-orange-400 transition-all rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FaPlus className="w-5 h-5 text-orange-600" />
                        <span className="font-medium text-orange-700">Add New Concept</span>
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
            className="w-full py-6 border-2 border-dashed bg-white border-violet-200 hover:bg-violet-50 hover:border-violet-400 transition-all rounded-lg"
          >
            <div className="flex items-center gap-2">
              <FaPlus className="w-5 h-5 text-violet-700" />
              <span className="font-medium text-violet-800">Add New Product</span>
            </div>
          </Button>
        </div>
      </div>

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
