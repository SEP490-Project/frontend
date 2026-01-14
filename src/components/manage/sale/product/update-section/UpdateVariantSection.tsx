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
import { Package, Upload, Trash2, ImagePlus, Plus } from "lucide-react";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { useState, useRef, useEffect } from "react";
import { FaMoneyBill } from "react-icons/fa6";
import { fetchAllProductOptionTypesThunk } from "@/libs/stores/productOptionManager/thunk";
import type { VariantWithImage, ProductVariant } from "@/libs/types/product";
import { VariationForm } from "../form/VariationForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { productVariantSchema } from "@/libs/validation/productValidation";
import {
  deleteVariantImageThunk,
  createVariantImageThunk,
} from "@/libs/stores/productManager/thunk";
import { getProductDetailThunk } from "@/libs/stores/productManager/thunk";

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
  const { capacityUnits, containerTypes, dispenserTypes } = useSelector(
    (state: RootState) => state.manageProductOption,
  );
  const isLimitedProduct = productDetail?.data?.type === "LIMITED";
  const variants = productDetail?.data?.variants || [];

  // Fetch product options from API
  useEffect(() => {
    if (!capacityUnits || !containerTypes || !dispenserTypes) {
      dispatch(fetchAllProductOptionTypesThunk());
    }
  }, [dispatch, capacityUnits, containerTypes, dispenserTypes]);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDeleteImage = async (imageId: string) => {
    try {
      await dispatch(deleteVariantImageThunk(imageId)).unwrap();
      if (productDetail?.data?.id) {
        await dispatch(getProductDetailThunk(productDetail.data.id));
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedVariantId) return;

    const currentVariant = variants.find((v) => v.id === selectedVariantId);
    if (!currentVariant) return;

    setUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i], files[i].name);
        formData.append("is_primary", i === 0 ? "true" : "false");
        formData.append(
          "alt_text",
          currentVariant.name ? `${currentVariant.name} image` : "Product variant image",
        );

        await dispatch(
          createVariantImageThunk({
            variantId: selectedVariantId,
            payload: formData,
          }),
        ).unwrap();
      }

      if (productDetail?.data?.id) {
        await dispatch(getProductDetailThunk(productDetail.data.id));
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 bg-white mb-10">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-white border-b px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Product Variants</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage different versions of your product
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Variant Selection */}
        <div>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {variants.map((variant, index) => (
              <AccordionItem
                key={variant.id}
                value={variant.id!}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-lg data-[state=open]:border-emerald-200"
              >
                <AccordionTrigger
                  className="hover:no-underline px-5 py-4 hover:bg-slate-50/50"
                  onClick={() => handleVariantSelect(variant.id!)}
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={(variant as VariantWithImage)?.images?.[0]?.image_url || "/logo.svg"}
                          alt={variant.name || `Variant ${index + 1}`}
                          className="w-14 h-14 object-cover rounded-xl border-2 border-slate-100 shadow-sm"
                        />
                        {variant.is_default && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-slate-900 block">
                          {variant.name || `Variant ${index + 1}`}
                        </span>
                        {variant.is_default && (
                          <span className="text-xs text-blue-600 font-medium">Default Variant</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-700">
                          {variant.capacity} {variant.capacity_unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
                        <FaMoneyBill className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-700">
                          {convertNumberToCurrency(String(variant.price) || "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  {/* Variant Update Form */}
                  {selectedVariantId && (
                    <form
                      onSubmit={handleSubmit(handleFormSubmit, onError)}
                      className="space-y-8 pt-4"
                    >
                      {/* Variant Images */}
                      <div className="pb-6 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-1 bg-emerald-500 rounded-full" />
                            <h3 className="text-lg font-bold text-slate-900">Variant Images</h3>
                          </div>
                          <div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md"
                            >
                              <ImagePlus className="w-4 h-4" />
                              {uploadingImage ? "Uploading..." : "Add Images"}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(() => {
                            const currentVariant = variants.find(
                              (v) => v.id === selectedVariantId,
                            ) as VariantWithImage;
                            const images = currentVariant?.images || [];

                            if (images.length === 0) {
                              return (
                                <div
                                  className="col-span-full text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-all cursor-pointer"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm mb-3">
                                    <Upload className="w-7 h-7 text-slate-400" />
                                  </div>
                                  <p className="font-semibold text-slate-600">
                                    No images uploaded yet
                                  </p>
                                  <p className="text-sm text-slate-400 mt-1">
                                    Click here or "Add Images" button to upload
                                  </p>
                                </div>
                              );
                            }

                            return images.map((image, idx) => (
                              <div
                                key={image.id}
                                className="relative group rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
                              >
                                <img
                                  src={image.image_url}
                                  alt={image.alt_text || `Variant image ${idx + 1}`}
                                  className="w-full h-36 object-cover"
                                />
                                {image.is_primary && (
                                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                                    Primary
                                  </Badge>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-10 w-10 rounded-full shadow-lg"
                                    onClick={() => handleDeleteImage(image.id)}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className="pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="h-7 w-1 bg-emerald-500 rounded-full" />
                          <h3 className="text-lg font-bold text-slate-900">Basic Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
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
                        <div className="pb-6 border-b border-slate-100">
                          <div className="flex items-center gap-2 mb-5">
                            <div className="h-7 w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
                            <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                              Limited Edition Settings
                            </h3>
                          </div>
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
                      <div className="pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="h-7 w-1 bg-emerald-500 rounded-full" />
                          <h3 className="text-lg font-bold text-slate-900">Capacity & Container</h3>
                        </div>
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
                                    {(capacityUnits && capacityUnits.length > 0
                                      ? capacityUnits
                                      : [
                                          { code: "ML", name: "ML" },
                                          { code: "L", name: "L" },
                                          { code: "G", name: "G" },
                                          { code: "KG", name: "KG" },
                                          { code: "OZ", name: "OZ" },
                                        ]
                                    ).map((unit) => (
                                      <SelectItem key={unit.code} value={unit.code}>
                                        {unit.name}
                                      </SelectItem>
                                    ))}
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
                                    {(containerTypes && containerTypes.length > 0
                                      ? containerTypes
                                      : [
                                          { code: "BOTTLE", name: "Bottle" },
                                          { code: "TUBE", name: "Tube" },
                                          { code: "JAR", name: "Jar" },
                                          { code: "STICK", name: "Stick" },
                                          { code: "PENCIL", name: "Pencil" },
                                          { code: "COMPACT", name: "Compact" },
                                          { code: "PALLETE", name: "Palette" },
                                          { code: "SACHET", name: "Sachet" },
                                          { code: "VIAL", name: "Vial" },
                                          { code: "ROLLER_BOTTLE", name: "Roller Bottle" },
                                        ]
                                    ).map((type) => (
                                      <SelectItem key={type.code} value={type.code}>
                                        {type.name}
                                      </SelectItem>
                                    ))}
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
                                    {(dispenserTypes && dispenserTypes.length > 0
                                      ? dispenserTypes
                                      : [
                                          { code: "PUMP", name: "Pump" },
                                          { code: "SPRAY", name: "Spray" },
                                          { code: "DROPPER", name: "Dropper" },
                                          { code: "ROLL_ON", name: "Roll On" },
                                          { code: "TWIST_UP", name: "Twist Up" },
                                          { code: "SQUEEZE", name: "Squeeze" },
                                          { code: "NONE", name: "None" },
                                        ]
                                    ).map((type) => (
                                      <SelectItem key={type.code} value={type.code}>
                                        {type.name}
                                      </SelectItem>
                                    ))}
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
                      <div className="pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="h-7 w-1 bg-emerald-500 rounded-full" />
                          <h3 className="text-lg font-bold text-slate-900">Dimensions & Weight</h3>
                        </div>
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
                      <div className="pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="h-7 w-1 bg-emerald-500 rounded-full" />
                          <h3 className="text-lg font-bold text-slate-900">
                            Manufacturing & Expiry
                          </h3>
                        </div>
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
                        <div className="flex items-center gap-2 mb-5">
                          <div className="h-7 w-1 bg-emerald-500 rounded-full" />
                          <h3 className="text-lg font-bold text-slate-900">
                            Details & Instructions
                          </h3>
                        </div>
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
                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => reset()}
                          disabled={!isDirty}
                          className="px-6 border-slate-200 hover:bg-slate-50"
                        >
                          Reset Changes
                        </Button>
                        <Button
                          type="submit"
                          className="px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          <div className="bg-gradient-to-r from-emerald-50 to-white px-6 py-5 border-b">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                Create New Variant
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Add a new variant for this {isLimitedProduct ? "limited edition" : "standard"}{" "}
                product.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6">
            <VariationForm
              form={newVariantForm}
              onSubmit={handleCreateVariant}
              state={{ productType: isLimitedProduct ? "LIMITED" : "STANDARD" }}
              dispatch={dispatch}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
