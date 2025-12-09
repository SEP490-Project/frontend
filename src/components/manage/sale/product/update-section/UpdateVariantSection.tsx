import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { useState } from "react";
import { FaMoneyBill } from "react-icons/fa6";

interface UpdateVariantSectionProps {
  form: UseFormReturn<any>;
  onSubmit: (variantId: string, isLimited: boolean, data: any) => void;
}

export const UpdateVariantSection = ({ form, onSubmit }: UpdateVariantSectionProps) => {
  const { productDetail } = useSelector((state: RootState) => state.manageProduct);
  const isLimitedProduct = productDetail?.data?.type === "LIMITED";
  const variants = productDetail?.data?.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    watch,
  } = form;

  const manufactureDate = watch("manufacturing_date");
  // const expiryDate = watch("expiry_date");

  // Get current date for validation
  const today = new Date().toISOString().split("T")[0];

  const handleVariantSelect = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (variant) {
      setSelectedVariantId(variantId);
      reset({
        capaity: variant.capacity,
        capacity_unit: variant.capacity_unit,
        container_type: variant.container_type,
        dispenser_type: variant.dispenser_type,
        expiry_date: String(variant.expiry_date)?.split("T")[0] || "",
        height: variant.height,
        input_stock: variant.current_stock,
        instrucstions: variant.instructions || "",
        is_default: variant.is_default,
        length: variant.length,
        manufacturing_date: String(variant.manufacturing_date)?.split("T")[0] || "",
        max_stock: isLimitedProduct ? (variant as any).max_stock : undefined,
        pre_order_limit: isLimitedProduct ? (variant as any).bought_limit : undefined,
        price: variant.price,
        uses: variant.uses || "",
        weight: variant.weight,
        width: variant.width,
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    if (selectedVariantId) {
      onSubmit(selectedVariantId, isLimitedProduct, data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Product Variants</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Variant Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-2 block">Select Variant to Update</Label>
          <Accordion type="single" collapsible className="w-full">
            {variants.map((variant, index) => (
              <AccordionItem key={variant.id} value={variant.id!}>
                <AccordionTrigger
                  className="hover:no-underline"
                  onClick={() => handleVariantSelect(variant.id!)}
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {variant.name || `Variant ${index + 1}`}
                      </span>
                      {variant.is_default && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {variant.capacity} {variant.capacity_unit}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <FaMoneyBill className="w-4 h-4" />
                        {convertNumberToCurrency(String(variant.price) || "0")}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600">Type:</span>{" "}
                        <span className="font-medium">{variant.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Stock:</span>{" "}
                        <span className="font-medium">{variant.current_stock}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Container:</span>{" "}
                        <span className="font-medium">{variant.container_type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Dispenser:</span>{" "}
                        <span className="font-medium">{variant.dispenser_type}</span>
                      </div>
                    </div>
                  </div>
                  {/* Variant Update Form */}
                  {selectedVariantId && (
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                      {/* Basic Information */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Price */}
                          <div className="space-y-2">
                            <Label htmlFor="price">
                              Price (VND) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              step={1000}
                              min={1000}
                              placeholder="Minimum 1000 VND"
                              {...register("price", { valueAsNumber: true })}
                              className={errors.price ? "border-red-500" : ""}
                            />
                            {errors.price && (
                              <p className="text-sm text-red-500">
                                {errors.price.message as string}
                              </p>
                            )}
                          </div>

                          {/* Input Stock */}
                          <div className="space-y-2">
                            <Label htmlFor="input_stock">
                              Current Stock <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="input_stock"
                              type="number"
                              min={0}
                              {...register("input_stock", { valueAsNumber: true })}
                              className={errors.input_stock ? "border-red-500" : ""}
                            />
                            {errors.input_stock && (
                              <p className="text-sm text-red-500">
                                {errors.input_stock.message as string}
                              </p>
                            )}
                          </div>

                          {/* Is Default */}
                          <div className="flex items-center space-x-2 col-span-2">
                            <Controller
                              name="is_default"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id="is_default"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <Label htmlFor="is_default" className="cursor-pointer">
                              Set as default variant
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Limited Edition Fields */}
                      {isLimitedProduct && (
                        <div className="border-b pb-6">
                          <h3 className="text-lg font-semibold mb-4 text-pink-900">
                            Limited Edition Settings
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Max Stock */}
                            <div className="space-y-2">
                              <Label htmlFor="max_stock">
                                Max Stock <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="max_stock"
                                type="number"
                                min={1}
                                {...register("max_stock", { valueAsNumber: true })}
                                className={errors.max_stock ? "border-red-500" : ""}
                              />
                              {errors.max_stock && (
                                <p className="text-sm text-red-500">
                                  {errors.max_stock.message as string}
                                </p>
                              )}
                            </div>

                            {/* Pre-order Limit */}
                            <div className="space-y-2">
                              <Label htmlFor="pre_order_limit">
                                Purchase Limit per Customer <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="pre_order_limit"
                                type="number"
                                min={1}
                                {...register("pre_order_limit", { valueAsNumber: true })}
                                className={errors.pre_order_limit ? "border-red-500" : ""}
                              />
                              {errors.pre_order_limit && (
                                <p className="text-sm text-red-500">
                                  {errors.pre_order_limit.message as string}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Capacity & Container */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Capacity & Container</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Capacity */}
                          <div className="space-y-2">
                            <Label htmlFor="capaity">
                              Capacity <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="capaity"
                              type="number"
                              step="0.01"
                              min={0}
                              {...register("capaity", { valueAsNumber: true })}
                              className={errors.capaity ? "border-red-500" : ""}
                            />
                            {errors.capaity && (
                              <p className="text-sm text-red-500">
                                {errors.capaity.message as string}
                              </p>
                            )}
                          </div>

                          {/* Capacity Unit */}
                          <div className="space-y-2">
                            <Label htmlFor="capacity_unit">
                              Capacity Unit <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="capacity_unit"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger
                                    className={errors.capacity_unit ? "border-red-500" : ""}
                                  >
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ML">ML</SelectItem>
                                    <SelectItem value="L">L</SelectItem>
                                    <SelectItem value="G">G</SelectItem>
                                    <SelectItem value="KG">KG</SelectItem>
                                    <SelectItem value="OZ">OZ</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.capacity_unit && (
                              <p className="text-sm text-red-500">
                                {errors.capacity_unit.message as string}
                              </p>
                            )}
                          </div>

                          {/* Container Type */}
                          <div className="space-y-2">
                            <Label htmlFor="container_type">
                              Container Type <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="container_type"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger
                                    className={errors.container_type ? "border-red-500" : ""}
                                  >
                                    <SelectValue placeholder="Select container" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="BOTTLE">Bottle</SelectItem>
                                    <SelectItem value="TUBE">Tube</SelectItem>
                                    <SelectItem value="JAR">Jar</SelectItem>
                                    <SelectItem value="STICK">Stick</SelectItem>
                                    <SelectItem value="PENCIL">Pencil</SelectItem>
                                    <SelectItem value="COMPACT">Compact</SelectItem>
                                    <SelectItem value="PALLETE">Palette</SelectItem>
                                    <SelectItem value="SACHET">Sachet</SelectItem>
                                    <SelectItem value="VIAL">Vial</SelectItem>
                                    <SelectItem value="ROLLER_BOTTLE">Roller Bottle</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.container_type && (
                              <p className="text-sm text-red-500">
                                {errors.container_type.message as string}
                              </p>
                            )}
                          </div>

                          {/* Dispenser Type */}
                          <div className="space-y-2">
                            <Label htmlFor="dispenser_type">
                              Dispenser Type <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="dispenser_type"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger
                                    className={errors.dispenser_type ? "border-red-500" : ""}
                                  >
                                    <SelectValue placeholder="Select dispenser" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PUMP">Pump</SelectItem>
                                    <SelectItem value="SPRAY">Spray</SelectItem>
                                    <SelectItem value="DROPPER">Dropper</SelectItem>
                                    <SelectItem value="ROLL_ON">Roll On</SelectItem>
                                    <SelectItem value="TWIST_UP">Twist Up</SelectItem>
                                    <SelectItem value="SQUEEZE">Squeeze</SelectItem>
                                    <SelectItem value="NONE">None</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.dispenser_type && (
                              <p className="text-sm text-red-500">
                                {errors.dispenser_type.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dimensions & Weight */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Dimensions & Weight</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="length">
                              Length (cm) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="length"
                              type="number"
                              step="0.01"
                              min={0}
                              {...register("length", { valueAsNumber: true })}
                              className={errors.length ? "border-red-500" : ""}
                            />
                            {errors.length && (
                              <p className="text-sm text-red-500">
                                {errors.length.message as string}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="width">
                              Width (cm) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="width"
                              type="number"
                              step="0.01"
                              min={0}
                              {...register("width", { valueAsNumber: true })}
                              className={errors.width ? "border-red-500" : ""}
                            />
                            {errors.width && (
                              <p className="text-sm text-red-500">
                                {errors.width.message as string}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="height">
                              Height (cm) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="height"
                              type="number"
                              step="0.01"
                              min={0}
                              {...register("height", { valueAsNumber: true })}
                              className={errors.height ? "border-red-500" : ""}
                            />
                            {errors.height && (
                              <p className="text-sm text-red-500">
                                {errors.height.message as string}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="weight">
                              Weight (g) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="weight"
                              type="number"
                              step="0.01"
                              min={0}
                              {...register("weight", { valueAsNumber: true })}
                              className={errors.weight ? "border-red-500" : ""}
                            />
                            {errors.weight && (
                              <p className="text-sm text-red-500">
                                {errors.weight.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Manufacturing & Expiry</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="manufacturing_date">
                              Manufacturing Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="manufacturing_date"
                              type="date"
                              max={today}
                              {...register("manufacturing_date")}
                              className={errors.manufacturing_date ? "border-red-500" : ""}
                            />
                            {errors.manufacturing_date && (
                              <p className="text-sm text-red-500">
                                {errors.manufacturing_date.message as string}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="expiry_date">
                              Expiry Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="expiry_date"
                              type="date"
                              min={manufactureDate || today}
                              {...register("expiry_date")}
                              className={errors.expiry_date ? "border-red-500" : ""}
                            />
                            {errors.expiry_date && (
                              <p className="text-sm text-red-500">
                                {errors.expiry_date.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details & Instructions */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Details & Instructions</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="instrucstions">Instructions</Label>
                            <Textarea
                              id="instrucstions"
                              placeholder="How to use this product..."
                              rows={3}
                              {...register("instrucstions")}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="uses">
                              Uses <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="uses"
                              placeholder="What is this product used for..."
                              rows={3}
                              {...register("uses")}
                              className={errors.uses ? "border-red-500" : ""}
                            />
                            {errors.uses && (
                              <p className="text-sm text-red-500">
                                {errors.uses.message as string}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => reset()}
                          disabled={!isDirty}
                        >
                          Reset Changes
                        </Button>
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary/90"
                          disabled={!isDirty}
                        >
                          Update Variant
                        </Button>
                      </div>
                    </form>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {!selectedVariantId && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a variant above to update its details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
