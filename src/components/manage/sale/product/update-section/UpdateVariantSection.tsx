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
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { useState } from "react";
import { FaMoneyBill } from "react-icons/fa6";
import type { VariantWithImage, ProductVariant } from "@/libs/types/product";
import { VariationForm } from "../form/VariationForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { productVariantSchema } from "@/libs/validation/productValidation";

interface UpdateVariantSectionProps {
  form: UseFormReturn<any>;
  onSubmit: (variantId: string, isLimited: boolean, data: any) => void;
  onCreateVariant?: (data: ProductVariant) => void;
}

export const UpdateVariantSection = ({
  form,
  onSubmit,
  onCreateVariant,
}: UpdateVariantSectionProps) => {
  const dispatch = useAppDispatch();
  const { productDetail } = useSelector((state: RootState) => state.manageProduct);
  const isLimitedProduct = productDetail?.data?.type === "LIMITED";
  const variants = productDetail?.data?.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const newVariantForm = useForm<ProductVariant>({
    resolver: yupResolver(productVariantSchema),
    context: { isLimited: isLimitedProduct },
    defaultValues: {
      is_default: false,
      attributes: [],
      type: isLimitedProduct ? "LIMITED" : "STANDARD",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    watch,
  } = form;

  const manufactureDate = watch("manufacturing_date");
  const today = new Date().toISOString().split("T")[0];

  const handleVariantSelect = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (variant) {
      setSelectedVariantId(variantId);

      // Helper function to safely format dates
      const formatDate = (dateValue: any): string => {
        if (!dateValue) return "";
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
      };

      reset({
        capacity: variant.capacity,
        capacity_unit: variant.capacity_unit,
        container_type: variant.container_type,
        dispenser_type: variant.dispenser_type,
        expiry_date: formatDate(variant.expiry_date),
        height: variant.height,
        input_stock: variant.current_stock,
        instrucstions: variant.instructions || "",
        is_default: variant.is_default,
        length: variant.length,
        manufacturing_date: formatDate(variant.manufacturing_date),
        pre_order_limit: isLimitedProduct ? (variant as any).pre_order_limit : undefined,
        price: variant.price,
        uses: variant.uses || "",
        weight: variant.weight,
        width: variant.width,
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log("Submitting variant update:", data);
    if (selectedVariantId) {
      onSubmit(selectedVariantId, isLimitedProduct, data);
    }
  };

  const onError = (errors: any) => {
    console.log("Form errors:", errors);
  };

  const handleCreateVariant = (data: ProductVariant) => {
    console.log("Creating new variant:", data);
    if (onCreateVariant) {
      onCreateVariant(data);
      setIsCreateDialogOpen(false);
      newVariantForm.reset();
    }
  };

  return (
    <Card className="mb-10">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle className="text-xl font-semibold">Product Variants</CardTitle>
        <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
          Create New Variant
        </Button>
      </CardHeader>
      <CardContent>
        {/* Variant Selection */}
        <div className="mb-6">
          <Accordion type="single" collapsible className="w-full">
            {variants.map((variant, index) => (
              <AccordionItem key={variant.id} value={variant.id!}>
                <AccordionTrigger
                  className="hover:no-underline"
                  onClick={() => handleVariantSelect(variant.id!)}
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={(variant as VariantWithImage)?.images?.[0]?.image_url || "/logo.svg"}
                        alt={variant.name || `Variant ${index + 1}`}
                        className="w-10 h-10 object-cover rounded-md"
                      />
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
                  {/* Variant Update Form */}
                  {selectedVariantId && (
                    <form onSubmit={handleSubmit(handleFormSubmit, onError)} className="space-y-6">
                      {/* Basic Information */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Price */}
                          <div className="space-y-2">
                            <Label htmlFor="price">
                              Price (VND) <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="price"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="price"
                                  type="number"
                                  step={1000}
                                  min={1000}
                                  placeholder="Minimum 1000 VND"
                                  {...field}
                                  className={errors.price ? "border-red-500" : ""}
                                />
                              )}
                            />
                            {errors.price && (
                              <p className="text-sm text-red-500">
                                {errors.price.message as string}
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
                              <Label htmlFor="input_stock">
                                Stock <span className="text-red-500">*</span>
                              </Label>
                              <Controller
                                name="input_stock"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    id="input_stock"
                                    type="number"
                                    min={1}
                                    {...field}
                                    className={errors.input_stock ? "border-red-500" : ""}
                                  />
                                )}
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
                                Pre-order Limit <span className="text-red-500">*</span>
                              </Label>
                              <Controller
                                name="pre_order_limit"
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    id="pre_order_limit"
                                    type="number"
                                    min={1}
                                    {...field}
                                    className={errors.pre_order_limit ? "border-red-500" : ""}
                                  />
                                )}
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
                            <Label htmlFor="capacity">
                              Capacity <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name="capacity"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="capacity"
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  {...field}
                                  className={errors.capacity ? "border-red-500" : ""}
                                />
                              )}
                            />
                            {errors.capacity && (
                              <p className="text-sm text-red-500">
                                {errors.capacity.message as string}
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
                            <Controller
                              name="length"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="length"
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  {...field}
                                  className={errors.length ? "border-red-500" : ""}
                                />
                              )}
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
                            <Controller
                              name="width"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="width"
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  {...field}
                                  className={errors.width ? "border-red-500" : ""}
                                />
                              )}
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
                            <Controller
                              name="height"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="height"
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  {...field}
                                  className={errors.height ? "border-red-500" : ""}
                                />
                              )}
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
                            <Controller
                              name="weight"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  id="weight"
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  {...field}
                                  className={errors.weight ? "border-red-500" : ""}
                                />
                              )}
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
                            <Controller
                              name="manufacturing_date"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  label="Manufacturing Date"
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Select manufacturing date"
                                  maxDate={today}
                                  dateFormat="dd/MM/yyyy hh:mm"
                                  required
                                  error={errors.manufacturing_date?.message as string}
                                />
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Controller
                              name="expiry_date"
                              control={control}
                              render={({ field }) => (
                                <DatePicker
                                  label="Expiry Date"
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Select expiry date"
                                  minDate={manufactureDate || today}
                                  dateFormat="dd/MM/yyyy hh:mm"
                                  required
                                  error={errors.expiry_date?.message as string}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Details & Instructions */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Details & Instructions</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="instrucstions">Instructions</Label>
                            <Controller
                              name="instrucstions"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  id="instrucstions"
                                  placeholder="How to use this product..."
                                  rows={3}
                                  {...field}
                                />
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="uses">Uses</Label>
                            <Controller
                              name="uses"
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  id="uses"
                                  placeholder="What is this product used for..."
                                  rows={3}
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3">
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
      </CardContent>

      {/* Create New Variant Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Variant</DialogTitle>
            <DialogDescription>
              Add a new variant for this {isLimitedProduct ? "limited edition" : "standard"}{" "}
              product.
            </DialogDescription>
          </DialogHeader>
          <VariationForm
            form={newVariantForm}
            onSubmit={handleCreateVariant}
            state={{ productType: isLimitedProduct ? "LIMITED" : "STANDARD" }}
            dispatch={dispatch}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
