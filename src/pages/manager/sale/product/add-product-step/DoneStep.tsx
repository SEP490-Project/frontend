import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, Calendar, Box, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { getItem, removeItem } from "@/libs/local-storage";
import type { ProductData, ProductResponse, VariantWithImage } from "@/libs/types/product";

const DoneStep = () => {
  const navigate = useNavigate();
  const { setIsDisabled, setOnSubmitStep } = useOutletContext<{
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
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
              Your product has been created with all details. Here's a summary of what you've
              created.
            </p>
          </div>

          {/* Product Details */}
          {product && (
            <div className="max-w-4xl mx-auto space-y-6 mb-8">
              {/* Basic Information */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Badge variant={product.type === "LIMITED" ? "destructive" : "default"}>
                      {product.type}
                    </Badge>
                  </div>
                  {product.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-900">{product.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Variants Information */}
              {variants && variants.length > 0 && (
                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Box className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product Variants ({variants.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
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
                                <DollarSign className="w-4 h-4" />
                                {variant.price.toLocaleString()}
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
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-700" />
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="font-medium text-gray-900">
                      {new Date(product.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="outline"
              onClick={() => {
                removeItem("currentProduct");
                removeItem("currentProductVariants");
                navigate("/manage/sale/product");
              }}
            >
              View Product List
            </Button>
            <Button
              onClick={() => {
                removeItem("currentProduct");
                removeItem("currentProductVariants");
                navigate("/manage/sale/product/create", {
                  state: {
                    formType: "CREATE",
                    productType: "STANDARD",
                  },
                });
              }}
            >
              Create Another Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoneStep;
