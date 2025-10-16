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
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Link2, AlertCircle } from "lucide-react";
import {
  FaHandshake,
  FaBullseye,
  FaPalette,
  FaHashtag,
  FaLightbulb,
  FaNewspaper,
  FaChartLine,
} from "react-icons/fa6";
import { CollapsibleSection, DynamicListInput } from "../shared/SharedComponents";
import type { Product, Concept, ScopeOfWorkProps } from "../types/scopeTypes";
import FileUploader from "@/components/global/FileUploader";
import { KPISelector } from "@/components/global";
import { useAuth } from "@/libs/hooks/useAuth";

const CoProducingScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scopeOfWork || {};
  const deliverables = scope.deliverables || {};
  const { user } = useAuth();

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const updateDeliverables = (partialDeliverables: any) => {
    const updated = { ...deliverables, ...partialDeliverables };
    onUpdateScopeOfWork({ ...scope, deliverables: updated });
  };

  const newProduct = (): Product => ({
    id: 0,
    name: "",
    description: "",
    material_url: [],
    kpis: [],
  });

  const newConcept = (): Concept => ({
    product_id: 0,
    platform: "",
    name: "",
    description: "",
    tagline: "",
    hash_tag: [],
    creative_notes: "",
    content_requirements: [],
    material_url: [],
    kpis: [],
  });

  // Get products for selection
  const products = ensureArray(deliverables.products);
  const concepts = ensureArray(deliverables.concept);

  // Helper to get product name by ID
  const getProductById = (id: number | undefined) => {
    if (!id) return null;
    return products.find((p) => p.id === id || products.indexOf(p) === id - 1);
  };

  // Helper to get product display name
  const getProductDisplayName = (product: Product, index: number) => {
    return product.name || `Product ${index + 1}`;
  };

  // Platform options
  const platformOptions = ["Website", "TikTok", "Facebook"];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
          <CardTitle className="flex items-center gap-2 text-pink-900">
            <FaHandshake className="w-5 h-5" style={{ color: "#ff9fb2" }} />
            Co-Producing Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Products Section */}
          <CollapsibleSection title="Products" badge={products.length} defaultOpen={true}>
            <div className="space-y-4">
              {products.map((p: Product, i: number) => {
                // Count concepts linked to this product
                const linkedConcepts = concepts.filter(
                  (c) => c.product_id === (p.id || i + 1) || c.product_id === i + 1,
                ).length;

                return (
                  <div
                    key={i}
                    className="border-2 rounded-xl p-4 bg-gradient-to-br from-pink-25 to-white"
                    style={{ borderColor: "#ff9fb2" }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Label
                          className="font-semibold flex items-center gap-2"
                          style={{ color: "#d6336c" }}
                        >
                          <FaBullseye className="w-4 h-4" />
                          Product #{i + 1}
                        </Label>
                        {linkedConcepts > 0 && (
                          <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                            <Link2 className="w-3 h-3 mr-1" />
                            {linkedConcepts} concept{linkedConcepts > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() =>
                          updateDeliverables({ products: products.filter((_, idx) => idx !== i) })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

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
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Product Description
                        </Label>
                        <Textarea
                          placeholder="Product description"
                          value={p.description || ""}
                          onChange={(e) => {
                            const updated = [...products];
                            updated[i] = { ...updated[i], description: e.target.value };
                            updateDeliverables({ products: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                          <FaPalette className="w-4 h-4" />
                          Product Materials
                        </Label>

                        <FileUploader
                          userId={user?.id || "unknown"}
                          accept="image/*,video/*"
                          multiple={true}
                          maxFiles={20}
                          maxSize={200}
                          allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                          title="Upload product materials"
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
                        <p className="text-xs text-gray-500 mt-1">
                          Upload images / videos. Uploaded file links will be added to material_url.
                        </p>
                      </div>

                      {/* KPIs */}
                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium mb-3 flex items-center gap-2 text-pink-800">
                          <FaChartLine className="w-4 h-4" />
                          Key Performance Indicators
                        </Label>
                        <KPISelector
                          kpis={(p.kpis || []).map((kpi: any) => ({
                            id: kpi.id ?? "",
                            type: kpi.type ?? "",
                            target_value: kpi.target_value ?? "",
                            unit: kpi.unit ?? "",
                            ...kpi,
                          }))}
                          onChange={(kpis) => {
                            const updated = [...products];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ products: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button
                variant="outline"
                onClick={() =>
                  updateDeliverables({
                    products: [...products, { ...newProduct(), id: products.length + 1 }],
                  })
                }
                className="w-full py-6 border-2 border-dashed hover:bg-pink-50"
                style={{ borderColor: "#ff9fb2" }}
              >
                <Plus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Product
              </Button>
            </div>
          </CollapsibleSection>

          {/* Concepts Section */}
          <CollapsibleSection
            title="Creative Concepts"
            badge={concepts.length}
            defaultOpen={products.length > 0}
          >
            <div className="space-y-4">
              {/* Warning if no products */}
              {products.length === 0 && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    Add products first to create concepts linked to them.
                  </p>
                </div>
              )}

              {concepts.map((c: Concept, i: number) => {
                const linkedProduct = getProductById(c.product_id);
                return (
                  <div
                    key={i}
                    className="border-2 rounded-xl p-4 bg-gradient-to-br from-pink-25 to-white"
                    style={{ borderColor: "#ff9fb2" }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Label
                          className="font-semibold flex items-center gap-2"
                          style={{ color: "#d6336c" }}
                        >
                          <FaLightbulb className="w-4 h-4" />
                          Concept #{i + 1}
                        </Label>
                        {linkedProduct && (
                          <Badge
                            variant="outline"
                            className="bg-pink-50 text-pink-700 border-pink-200"
                          >
                            <Link2 className="w-3 h-3 mr-1" />
                            {getProductDisplayName(linkedProduct, (c.product_id || 1) - 1)}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() =>
                          updateDeliverables({ concept: concepts.filter((_, idx) => idx !== i) })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Product Selection & Basic Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Linked Product</Label>
                          <Select
                            value={c.product_id?.toString() || ""}
                            onValueChange={(value) => {
                              const updated = [...concepts];
                              updated[i] = { ...updated[i], product_id: parseInt(value) };
                              updateDeliverables({ concept: updated });
                            }}
                          >
                            <SelectTrigger className="bg-white border-pink-200 focus:border-pink-400">
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product, productIndex) => (
                                <SelectItem
                                  key={productIndex}
                                  value={(productIndex + 1).toString()}
                                >
                                  {getProductDisplayName(product, productIndex)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">Platform</Label>
                          <Select
                            value={c.platform || ""}
                            onValueChange={(value) => {
                              const updated = [...concepts];
                              updated[i] = { ...updated[i], platform: value };
                              updateDeliverables({ concept: updated });
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
                        <Label className="text-sm font-medium mb-2 block">Concept Name</Label>
                        <Input
                          placeholder="Concept name"
                          value={c.name || ""}
                          onChange={(e) => {
                            const updated = [...concepts];
                            updated[i] = { ...updated[i], name: e.target.value };
                            updateDeliverables({ concept: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Tagline</Label>
                        <Input
                          placeholder="Tagline"
                          value={c.tagline || ""}
                          onChange={(e) => {
                            const updated = [...concepts];
                            updated[i] = { ...updated[i], tagline: e.target.value };
                            updateDeliverables({ concept: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
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
                            const updated = [...concepts];
                            updated[i] = { ...updated[i], description: e.target.value };
                            updateDeliverables({ concept: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Creative Notes</Label>
                        <Textarea
                          placeholder="Creative notes and guidelines"
                          value={c.creative_notes || ""}
                          onChange={(e) => {
                            const updated = [...concepts];
                            updated[i] = { ...updated[i], creative_notes: e.target.value };
                            updateDeliverables({ concept: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />
                      </div>

                      <DynamicListInput
                        label="Hashtags"
                        icon={<FaHashtag className="w-4 h-4" />}
                        items={c.hash_tag || []}
                        placeholder="#example"
                        onChange={(items) => {
                          const updated = [...concepts];
                          updated[i] = { ...updated[i], hash_tag: items };
                          updateDeliverables({ concept: updated });
                        }}
                      />

                      <DynamicListInput
                        label="Content Requirements"
                        icon={<FaNewspaper className="w-4 h-4" />}
                        items={c.content_requirements || []}
                        placeholder="e.g., Must include product logo"
                        multiline
                        onChange={(items) => {
                          const updated = [...concepts];
                          updated[i] = { ...updated[i], content_requirements: items };
                          updateDeliverables({ concept: updated });
                        }}
                      />

                      <div>
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-pink-800">
                          <FaPalette className="w-4 h-4" />
                          Concept Materials
                        </Label>

                        <FileUploader
                          userId={formData?.brand_id || "unknown"}
                          accept="image/*,video/*"
                          multiple={true}
                          maxFiles={20}
                          maxSize={200}
                          allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "mov", "avi"]}
                          title="Upload concept materials"
                          onUploadComplete={(urls) => {
                            const updated = [...concepts];
                            updated[i] = {
                              ...updated[i],
                              material_url: [...(updated[i].material_url || []), ...urls],
                            };
                            updateDeliverables({ concept: updated });
                          }}
                          onFilesRemove={(removedUrls) => {
                            const updated = [...concepts];
                            const currentUrls = updated[i].material_url || [];
                            updated[i] = {
                              ...updated[i],
                              material_url: currentUrls.filter(
                                (url: string) => !removedUrls.includes(url),
                              ),
                            };
                            updateDeliverables({ concept: updated });
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload images / videos. Uploaded file links will be added to material_url.
                        </p>
                      </div>

                      {/* KPIs */}
                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium mb-3 flex items-center gap-2 text-pink-800">
                          <FaChartLine className="w-4 h-4" />
                          Key Performance Indicators
                        </Label>
                        <KPISelector
                          kpis={(c.kpis || []).map((kpi: any) => ({
                            id: kpi.id ?? "",
                            type: kpi.type ?? "",
                            target_value: kpi.target_value ?? "",
                            unit: kpi.unit ?? "",
                            ...kpi,
                          }))}
                          onChange={(kpis) => {
                            const updated = [...concepts];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ concept: updated });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button
                variant="outline"
                onClick={() =>
                  updateDeliverables({
                    concept: [...concepts, newConcept()],
                  })
                }
                disabled={products.length === 0}
                className="w-full py-6 border-2 border-dashed hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: "#ff9fb2" }}
              >
                <Plus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Concept
              </Button>

              {products.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Create products first to add concepts
                </p>
              )}
            </div>
          </CollapsibleSection>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoProducingScope;
