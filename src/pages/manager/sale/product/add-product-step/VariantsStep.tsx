import { useState } from "react";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProductVariant } from "@/libs/types/product";

// Create a form variant interface that includes id for local state
interface FormVariant extends ProductVariant {
  id: string;
}

const VariantsStep = () => {
  const { state } = useLocation();
  const productType = state?.productType || "STANDARD"; // Get product type from navigation state

  const [variants, setVariants] = useState<FormVariant[]>([]);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariant, setNewVariant] = useState<Partial<FormVariant>>({
    name: "",
    capacity: 0,
    capacity_unit: "ml",
    container_type: "",
    current_stock: 0,
    description: "",
    dispenser_type: "",
    expiry_date: null,
    instructions: "",
    is_default: false,
    manufacture_date: null,
    price: 0,
    story: productType === "LIMITED" ? "" : undefined, // Only include story for LIMITED products
    type: productType, // Use the productType from navigation state
    uses: "",
    attributes: [],
  });

  const handleAddVariant = () => {
    if (newVariant.name && newVariant.price && newVariant.current_stock !== undefined) {
      const variant: FormVariant = {
        id: Date.now().toString(),
        name: newVariant.name || "",
        price: newVariant.price || 0,
        capacity: newVariant.capacity || 0,
        capacity_unit: newVariant.capacity_unit || "ml",
        container_type: newVariant.container_type || "",
        current_stock: newVariant.current_stock || 0,
        description: newVariant.description || "",
        dispenser_type: newVariant.dispenser_type || "",
        expiry_date: newVariant.expiry_date || null,
        instructions: newVariant.instructions || "",
        is_default: newVariant.is_default || false,
        manufacture_date: newVariant.manufacture_date || null,
        story: productType === "LIMITED" ? newVariant.story || "" : "",
        type: productType, // Use the productType from navigation state
        uses: newVariant.uses || "",
        attributes: newVariant.attributes || [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      setVariants([...variants, variant]);
      setNewVariant({
        name: "",
        capacity: 0,
        capacity_unit: "ml",
        container_type: "",
        current_stock: 0,
        description: "",
        dispenser_type: "",
        expiry_date: null,
        instructions: "",
        is_default: false,
        manufacture_date: null,
        price: 0,
        story: productType === "LIMITED" ? "" : undefined,
        type: productType,
        uses: "",
        attributes: [],
      });
      setIsAddingVariant(false);
    }
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Product Variants</h2>
        <Dialog open={isAddingVariant} onOpenChange={setIsAddingVariant}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Variant</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="variant-name">Variant Name *</Label>
                <Input
                  id="variant-name"
                  placeholder="e.g., Red Rose Serum"
                  value={newVariant.name}
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-price">Price (VND) *</Label>
                <Input
                  id="variant-price"
                  type="number"
                  placeholder="0"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-stock">Current Stock *</Label>
                <Input
                  id="variant-stock"
                  type="number"
                  placeholder="0"
                  value={newVariant.current_stock}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, current_stock: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-capacity">Capacity</Label>
                <Input
                  id="variant-capacity"
                  type="number"
                  placeholder="0"
                  value={newVariant.capacity}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, capacity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-capacity-unit">Capacity Unit</Label>
                <Select
                  value={newVariant.capacity_unit}
                  onValueChange={(value) => setNewVariant({ ...newVariant, capacity_unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-container">Container Type</Label>
                <Input
                  id="variant-container"
                  placeholder="e.g., Bottle, Tube, Jar"
                  value={newVariant.container_type}
                  onChange={(e) => setNewVariant({ ...newVariant, container_type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variant-dispenser">Dispenser Type</Label>
                <Input
                  id="variant-dispenser"
                  placeholder="e.g., Pump, Dropper, Tube"
                  value={newVariant.dispenser_type}
                  onChange={(e) => setNewVariant({ ...newVariant, dispenser_type: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="variant-description">Description</Label>
                <Textarea
                  id="variant-description"
                  placeholder="Product variant description..."
                  value={newVariant.description}
                  onChange={(e) => setNewVariant({ ...newVariant, description: e.target.value })}
                />
              </div>
              {productType === "LIMITED" && (
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="variant-story">Product Story</Label>
                  <Textarea
                    id="variant-story"
                    placeholder="Tell the story behind this limited edition product..."
                    value={newVariant.story || ""}
                    onChange={(e) => setNewVariant({ ...newVariant, story: e.target.value })}
                  />
                </div>
              )}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="variant-uses">Uses</Label>
                <Textarea
                  id="variant-uses"
                  placeholder="How to use this product..."
                  value={newVariant.uses}
                  onChange={(e) => setNewVariant({ ...newVariant, uses: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingVariant(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVariant}>Add Variant</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="mb-4">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-300" />
          </div>
          <p className="text-lg font-medium">No variants created yet</p>
          <p className="text-sm">Click "Add Variant" to create your first product variant</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {variants.map((variant) => (
            <Card key={variant.id} className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{variant.name}</CardTitle>
                    <p className="text-sm text-gray-600">Type: {variant.type}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVariant(variant.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(variant.price)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Stock</span>
                    <span className="font-semibold">
                      {variant.current_stock}
                      <Badge
                        variant={variant.current_stock > 0 ? "default" : "destructive"}
                        className="ml-2 text-xs"
                      >
                        {variant.current_stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Capacity</span>
                    <span className="font-semibold">
                      {variant.capacity} {variant.capacity_unit}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Image</span>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-400 mt-1">Will be added in next step</span>
                  </div>
                </div>
                {variant.description && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 uppercase tracking-wide block mb-1">
                      Description
                    </span>
                    <p className="text-sm text-gray-700">{variant.description}</p>
                  </div>
                )}
                {productType === "LIMITED" && variant.story && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-xs text-amber-700 uppercase tracking-wide block mb-1 font-semibold">
                      Limited Edition Story
                    </span>
                    <p className="text-sm text-amber-800">{variant.story}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {variants.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-blue-700">
              <strong>{variants.length}</strong> variant{variants.length > 1 ? "s" : ""} created.
              You"ll be able to add images for each variant in the next step.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantsStep;
