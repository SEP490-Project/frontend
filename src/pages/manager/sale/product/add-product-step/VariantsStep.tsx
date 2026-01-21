import { useOutletContext, type NavigateFunction } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, ImageIcon, Loader2, Package, ImagePlus } from "lucide-react";
import { FaMoneyBill } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
import { clearProductDetail } from "@/libs/stores/productManager/slice";
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

  console.log("Product Type in VariantsStep:", state?.productType);

  const form = useForm<ProductVariant>({
    resolver: yupResolver(productVariantSchema),
    defaultValues: {
      name: "",
      price: null,
      input_stock: 1,
      pre_order_limit: null,
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
      manufacturing_date: null,
      instructions: "",
      weight: null,
      height: null,
      length: null,
      width: null,
    },
  });

  useEffect(() => {
    const productId = String(
      getItem<ProductResponse<ProductData>>("currentProduct")?.data.id || "",
    );
    if (productId) {
      // Clear any previous product detail from Redux before fetching new one
      dispatch(clearProductDetail());
      dispatch(getProductDetailThunk(productId));
    } else {
      // No product ID means we're in a new product creation session
      dispatch(clearProductDetail());
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

    if (productDetail?.data.variants && productDetail?.data?.variants?.length > 2) {
      toast.error("You can only add up to 3 variants per product.");
      return;
    }

    setIsLoading(true);
    try {
      setIsDialogOpen(false);
      await dispatch(
        createVariantProductThunk({ payload: data, productId: String(currentProduct?.id) }),
      ).unwrap();

      await dispatch(getProductDetailThunk(String(currentProduct.id))).unwrap();

      toast.success("Product variant added successfully!");

      form.reset();
    } catch (error) {
      toast.error((error as string) || "Failed to add product variant");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (variants.length > 0) {
      setIsDisabled(false);
      setOnSubmitStep(() => async () => {
        navigate(steps[currentStep]?.path, { state });
      });
    } else {
      setIsDisabled(true);
    }
  }, [variants.length, setIsDisabled, setOnSubmitStep, navigate, steps, currentStep, state]);

  return (
    <Card className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 bg-white mt-6 mb-12">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">Processing variant...</p>
            <p className="text-sm text-gray-500">Please wait while we save your changes</p>
          </div>
        </div>
      )}

      <CardHeader className="bg-gradient-to-r from-primary/5 to-white border-b px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Product Variants</CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage different versions of your product
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
              <div className="bg-gradient-to-r from-primary/5 to-white px-6 py-5 border-b">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    Add New Variant
                  </DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-6">
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
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {variants.length === 0 ? (
          <div
            className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-sm mb-4">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-2">No variants created yet</p>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Create product variants to offer different sizes, packaging options, or formulations
            </p>
            <Button className="inline-flex items-center gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              Create First Variant
            </Button>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {variants.map((variant, index) => (
              <AccordionItem
                key={variant.id || `${variant.name}-${index}`}
                value={variant.id || `variant-${index}`}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-lg data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="hover:no-underline px-5 py-4 hover:bg-slate-50/50">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      {/* Variant Thumbnail */}
                      <div className="relative">
                        <img
                          src={variant?.images?.[0]?.image_url || "/logo.svg"}
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
                      {/* Variant Name & Default Badge */}
                      <div className="text-left">
                        <span className="font-bold text-slate-900 block">
                          {variant.name || `Variant ${index + 1}`}
                        </span>
                        {variant.is_default && (
                          <span className="text-xs text-blue-600 font-medium">Default Variant</span>
                        )}
                      </div>
                    </div>
                    {/* Quick Info Pills */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-700">
                          {variant.capacity} {variant.capacity_unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                        <FaMoneyBill className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">
                          {convertNumberToCurrency(variant.price?.toString() || "0")}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5">
                  <div className="space-y-6 pt-4">
                    {/* Variant Images Section */}
                    <div className="pb-6 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-1 bg-primary rounded-full" />
                          <h3 className="text-lg font-bold text-slate-900">Variant Images</h3>
                          {variant?.images && variant.images.length > 0 && (
                            <span className="text-sm text-slate-500 font-normal">
                              ({variant.images.length}{" "}
                              {variant.images.length === 1 ? "image" : "images"})
                            </span>
                          )}
                        </div>
                        {variant.id && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => fileInputRefs.current[variant.id!]?.click()}
                            className="gap-2 bg-primary hover:bg-primary/90 shadow-md"
                          >
                            <ImagePlus className="w-4 h-4" />
                            Add Images
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {variant?.images && variant.images.length > 0 ? (
                          variant.images.map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative group rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                            >
                              <img
                                src={image.image_url}
                                alt={image.alt_text || `${variant.name} image ${imgIndex + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              {imgIndex === 0 && (
                                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                                  Primary
                                </Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <div
                            className="col-span-full text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-primary/30 transition-all cursor-pointer"
                            onClick={() => variant.id && fileInputRefs.current[variant.id]?.click()}
                          >
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm mb-3">
                              <ImageIcon className="w-7 h-7 text-slate-400" />
                            </div>
                            <p className="font-semibold text-slate-600">No images uploaded yet</p>
                            <p className="text-sm text-slate-400 mt-1">
                              Click here or "Add Images" button to upload
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Hidden File Input */}
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

                    {/* Variant Details Section */}
                    <div className="pb-6 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-7 w-1 bg-primary rounded-full" />
                        <h3 className="text-lg font-bold text-slate-900">Variant Details</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                            Capacity
                          </p>
                          <p className="text-base font-semibold text-slate-900">
                            {variant.capacity} {variant.capacity_unit}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                            Container
                          </p>
                          <p className="text-base font-semibold text-slate-900">
                            {variant.container_type}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                            Dispenser
                          </p>
                          <p className="text-base font-semibold text-slate-900">
                            {variant.dispenser_type}
                          </p>
                        </div>
                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                          <p className="text-xs text-primary/70 font-medium uppercase tracking-wide mb-1">
                            Price
                          </p>
                          <p className="text-base font-bold text-primary">
                            {convertNumberToCurrency(variant.price?.toString() || "0")}
                          </p>
                        </div>
                        {variant.input_stock !== undefined && state.productType === "LIMITED" && (
                          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <p className="text-xs text-amber-700 font-medium uppercase tracking-wide mb-1">
                              Stock
                            </p>
                            <p className="text-base font-semibold text-amber-900">
                              {variant.input_stock} units
                            </p>
                          </div>
                        )}
                        {variant.pre_order_limit && (
                          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                            <p className="text-xs text-purple-700 font-medium uppercase tracking-wide mb-1">
                              Pre-order Limit
                            </p>
                            <p className="text-base font-semibold text-purple-900">
                              {variant.pre_order_limit}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attributes/Ingredients Section */}
                    {variant.attributes && variant.attributes?.length > 0 && (
                      <div className="pb-6 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-7 w-1 bg-primary rounded-full" />
                          <h3 className="text-lg font-bold text-slate-900">Ingredients</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variant.attributes.map((attr, attrIndex) => (
                            <span
                              key={attrIndex}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-xl text-sm font-medium border border-slate-200 shadow-sm"
                            >
                              <span className="w-2 h-2 rounded-full bg-primary/60 mr-2"></span>
                              {attr.ingredient}: {attr.value} {attr.unit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      {variant.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteVariant(variant.id!)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Variant
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default VariantsStep;
