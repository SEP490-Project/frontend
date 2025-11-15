import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext, type NavigateFunction } from "react-router";
import { getItem, removeItem } from "@/libs/local-storage";
import type { ProductData, ProductResponse, VariantWithImage } from "@/libs/types/product";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppDispatch } from "@/libs/stores";
import { updateProductVisibilityThunk } from "@/libs/stores/productManager/thunk";
import { toast } from "sonner";

const DoneStep = () => {
  const dispatch = useAppDispatch();
  const { setOnSubmitStep, navigate, state, setIsDisabled } = useOutletContext<{
    setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
    navigate: NavigateFunction;
    state: any;
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [variants, setVariants] = useState<VariantWithImage[]>([]);

  useEffect(() => {
    const savedProduct = getItem<ProductResponse<ProductData>>("currentProduct")?.data;
    const savedVariants = getItem<VariantWithImage[]>("currentProductVariants");

    if (savedProduct) {
      setProduct(savedProduct);
    }
    if (savedVariants) {
      setVariants(savedVariants);
    }
  }, []);

  useEffect(() => {
    setIsDisabled(false);

    setOnSubmitStep(() => async () => {
      removeItem("currentProduct");
      removeItem("currentProductVariants");

      navigate("/manage/sale/product");
    });

    return () => {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/manage/sale/product/create")) {
        removeItem("currentProduct");
        removeItem("currentProductVariants");
      }
    };
  }, [navigate, setIsDisabled, setOnSubmitStep]);

  const handlePublishProduct = async () => {
    if (!product) return;
    const result = await dispatch(
      updateProductVisibilityThunk({ productId: product.id as string, isActive: true }),
    );

    if (updateProductVisibilityThunk.fulfilled.match(result)) {
      removeItem("currentProduct");
      removeItem("currentProductVariants");

      navigate("/manage/sale/product");
      toast.success("Product published successfully");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg mt-6 mb-12 shadow-md">
      <Card className="border-none shadow-none">
        <CardContent className="py-8">
          {/* Success Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="mb-4">
              <CheckCircle2 className="w-20 h-20 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Created Successfully!</h2>
            <p className="text-gray-600 text-center max-w-md">
              Your product has been created with all details. Do you want to publish it now?
            </p>
          </div>

          {/* Product Details */}
          {product && (
            <div className="max-w-4xl mx-auto space-y-6 mb-8">
              {/* Basic Information */}
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                  </AccordionTrigger>
                  <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Product Name</p>
                      <p className="font-medium text-gray-900">{product.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">{product.category?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Brand</p>
                      <p className="font-medium text-gray-900">{product.brand_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Product Type</p>
                      <Badge
                        className={
                          product.type === "STANDARD"
                            ? "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 "
                            : "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200"
                        }
                      >
                        {product.type}
                      </Badge>
                    </div>
                    {product.description && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="text-gray-900">{product.description}</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                {variants && variants.length > 0 && (
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Product Variants ({variants.length})
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {variants.map((variant, index) => (
                        <div
                          key={variant.id || index}
                          className="border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <p className="text-sm text-gray-600">Variant Name</p>
                              <p className="font-medium text-gray-900">
                                {variant.capacity} {variant.capacity_unit} {variant.container_type}
                              </p>
                            </div>
                            {variant.price && (
                              <div>
                                <p className="text-sm text-gray-600">Price</p>
                                <p className="font-medium text-gray-900 flex items-center gap-1">
                                  {convertNumberToCurrency(variant.price.toString())}
                                </p>
                              </div>
                            )}
                            {variant.capacity && (
                              <div>
                                <p className="text-sm text-gray-600">Capacity</p>
                                <p className="font-medium text-gray-900">
                                  {variant.capacity} {variant.capacity_unit}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-600">Container Type</p>
                              <p className="font-medium text-gray-900">{variant.container_type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Dispenser Type</p>
                              <p className="font-medium text-gray-900">{variant.dispenser_type}</p>
                            </div>
                            {variant.images && variant.images.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-600">Images</p>
                                <p className="font-medium text-gray-900">
                                  {variant.images.length} image(s)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          )}

          {/* Action Buttons */}
          {state?.productType === "STANDARD" && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={handlePublishProduct}>Publish Product</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoneStep;
