import { useOutletContext, type NavigateFunction } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, ImageIcon, Box, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productVariantSchema } from "@/libs/validation/productValidation";
import { VariationForm } from "@/components/manage/sale/product/form/VariationForm";
import type {
  ProductData,
  ProductResponse,
  ProductVariant,
  VariantWithImage,
} from "@/libs/types/product";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, type RootState } from "@/libs/stores";
import {
  createVariantProductThunk,
  createVariantImageThunk,
  getProductDetailThunk,
} from "@/libs/stores/productManager/thunk";
import { getItem, setItem } from "@/libs/local-storage";
import { toast } from "sonner";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { useSelector } from "react-redux";

const VariantsStep = () => {
  const dispatch = useAppDispatch();
  const { productDetail } = useSelector((state: RootState) => state?.manageProduct);

  const [variants, setVariants] = useState<VariantWithImage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { setOnSubmitStep, steps, currentStep, navigate, state, setIsDisabled } = useOutletContext<{
    setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
    steps: { path: string; label: string }[];
    currentStep: number;
    navigate: NavigateFunction;
    state: any;
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const form = useForm<ProductVariant>({
    resolver: yupResolver(productVariantSchema),
    defaultValues: {
      name: "",
      price: null,
      current_stock: 0,
      capacity: null,
      capacity_unit: "ML",
      container_type: "BOTTLE",
      dispenser_type: "PUMP",
      description: "",
      story: null,
      uses: "",
      attributes: [],
      is_default: false,
      type: state?.productType,
      expiry_date: null,
      manufacture_date: null,
      instructions: "",
    },
  });

  useEffect(() => {
    const productId = String(
      getItem<ProductResponse<ProductData>>("currentProduct")?.data.id || "",
    );
    if (productId) {
      dispatch(getProductDetailThunk(productId));
    } else {
      const savedVariants = getItem<VariantWithImage[]>("currentProductVariants");
      if (savedVariants && savedVariants.length > 0) {
        setVariants(savedVariants);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (productDetail?.data?.variants && productDetail.data.variants.length > 0) {
      const variantsWithImages: VariantWithImage[] = productDetail.data.variants.map((v) => ({
        ...v,
        images: (v as any).images || [],
      }));
      setVariants(variantsWithImages);
      setItem("currentProductVariants", variantsWithImages);
    }
  }, [productDetail]);

  const handleDeleteVariant = async (variantId: string) => {
    const updatedVariants = variants.filter((v) => v.id !== variantId);
    setVariants(updatedVariants);

    if (updatedVariants.length === 0) {
      setItem("currentProductVariants", []);
    } else {
      setItem("currentProductVariants", updatedVariants);
    }
    toast.success("Variant removed from list");
  };

  const handleImageUpload = async (variantId: string, file: File) => {
    const currentProduct = getItem<ProductResponse<ProductData>>("currentProduct")?.data;

    if (!currentProduct) {
      toast.error("No product found. Please create a product first.");
      return;
    }

    const variant = variants.find((v) => v.id === variantId);
    console.log("Found variant for image upload:", variant);
    if (!variant || !variant.id) {
      toast.error("Variant not found or missing ID.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("is_primary", "true");
      formData.append("alt_text", variant.name ? `${variant.name} image` : "Product variant image");

      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await dispatch(
        createVariantImageThunk({
          variantId: variant.id,
          payload: formData,
        }),
      ).unwrap();

      // Refresh product detail to get updated images
      await dispatch(getProductDetailThunk(String(currentProduct.id))).unwrap();

      toast.success("Variant image uploaded successfully!");
    } catch (error) {
      toast.error((error as string) || "Failed to upload variant image");
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariant = async (data: ProductVariant) => {
    const currentProduct = getItem<ProductResponse<ProductData>>("currentProduct")?.data;

    if (!currentProduct) {
      toast.error("No product found. Please create a product first.");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        createVariantProductThunk({ payload: data, productId: String(currentProduct?.id) }),
      ).unwrap();

      await dispatch(getProductDetailThunk(String(currentProduct.id))).unwrap();

      toast.success("Product variant added successfully!");
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error((error as string) || "Failed to add product variant");
      console.error("Error adding variant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (variants.length > 0) {
      setIsDisabled(false);
      setOnSubmitStep(() => async () => {
        navigate(steps[currentStep]?.path);
      });
    } else {
      setIsDisabled(true);
    }
  }, [variants.length, setIsDisabled, setOnSubmitStep, navigate, steps, currentStep]);

  return (
    <div className="bg-white p-6 rounded-lg mt-6 mb-12 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Product Variants</h2>
          <p className="text-sm text-gray-500 mt-1">Manage different variations of your product</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Variant</DialogTitle>
            </DialogHeader>
            <VariationForm
              form={form}
              onSubmit={handleAddVariant}
              setOnSubmitStep={setOnSubmitStep}
              steps={steps}
              currentStep={currentStep}
              navigate={navigate}
              state={state}
              isDisabled={false}
              setIsDisabled={setIsDisabled}
              dispatch={dispatch}
            />
          </DialogContent>
        </Dialog>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="mb-4">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300" />
          </div>
          <p className="text-lg font-semibold text-gray-700 mb-2">No variants created yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Click "Add Variant" to create your first product variant
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            Create First Variant
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {variants.map((variant, index) => (
            <Card
              key={variant.id || `${variant.name}-${index}`}
              className="border border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex gap-4 items-start">
                  {/* Variant Image */}
                  <div className="flex-shrink-0">
                    <div
                      onClick={() => variant.id && fileInputRefs.current[variant.id]?.click()}
                      className="relative w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors flex items-center justify-center group overflow-hidden"
                    >
                      {variant?.images && variant.images.length > 0 ? (
                        <>
                          <img
                            src={variant.images[0].image_url}
                            alt={variant.images[0].alt_text || variant.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                            <Upload className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">Add Image</p>
                        </div>
                      )}
                    </div>
                    {variant.id && (
                      <input
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[variant.id!] = el;
                        }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && variant.id) {
                            handleImageUpload(variant.id, file);
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                    )}
                  </div>

                  {/* Variant Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {variant.name}
                          </CardTitle>
                          {variant.is_default && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            {convertNumberToCurrency(Number(variant?.price?.toFixed(2)))}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Box className="w-4 h-4" />
                            {variant.capacity} {variant.capacity_unit}
                          </span>
                        </div>
                      </div>
                      {variant.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVariant(variant.id!)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Container Type</p>
                        <p className="text-gray-900">{variant.container_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Dispenser Type</p>
                        <p className="text-gray-900">{variant.dispenser_type}</p>
                      </div>
                      {variant.current_stock !== undefined && state.productType === "LIMITED" && (
                        <div>
                          <p className="text-gray-500 font-medium mb-1">Current Stock</p>
                          <p className="text-gray-900">{variant.current_stock} units</p>
                        </div>
                      )}
                      {variant.attributes?.length > 0 && (
                        <div className="col-span-2">
                          <p className="text-gray-500 font-medium mb-1">Attributes</p>
                          <div className="flex flex-wrap gap-2">
                            {variant.attributes.map((attr, attrIndex) => (
                              <span
                                key={attrIndex}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                              >
                                {attr.ingredient}: {attr.value} {attr.unit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantsStep;
