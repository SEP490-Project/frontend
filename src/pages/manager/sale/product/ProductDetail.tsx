import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  DollarSign,
  FileText,
  Info,
  Clock,
  ShoppingCart,
  Droplet,
  Box,
  Zap,
  Star,
  Weight,
  RulerDimensionLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/libs/stores";
import { getProductDetailThunk } from "@/libs/stores/productManager/thunk";
import { useSelector } from "react-redux";
import type {
  ProductData,
  ProductVariant,
  ProductAttribute,
  VariantWithImage,
  LimitedProductData,
} from "@/libs/types/product";
import { MdHeight, MdWidthNormal } from "react-icons/md";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | VariantWithImage | null>(
    null,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productDetail = useSelector((state: any) => state?.manageProduct?.productDetail);
  const isLoading = useSelector((state: any) => state?.manageProduct?.isLoading);
  const error = useSelector((state: any) => state?.manageProduct?.error);

  const product: ProductData | null = productDetail?.data || null;

  useEffect(() => {
    if (id) {
      dispatch(getProductDetailThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find((v) => v.is_default) || product.variants[0];
      setSelectedVariant(defaultVariant);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || "Product not found"}</p>
          <Button onClick={() => navigate("/manage/sale/product")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const isLimited = product.type === "LIMITED";
  const displayImages =
    (selectedVariant as VariantWithImage)?.images || product.thumbnail_url || [];
  const currentImage = Array.isArray(displayImages)
    ? displayImages[selectedImageIndex]
    : displayImages;

  const getContainerTypeLabel = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getDispenserTypeLabel = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Product Details</h1>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow mb-3">
          <div className="p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Info className="h-5 w-5" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p className="text-sm text-gray-500 mb-1">Product Name</p>
                  <div className="flex gap-2">
                    <Badge
                      className={
                        product.type === "STANDARD"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-orange-100 text-orange-800 border border-orange-200"
                      }
                    >
                      {product.type}
                    </Badge>
                    <Badge
                      className={
                        product.is_active
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <p className="text-2xl sm:text-2xl font-bold text-gray-900">{product.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Brand</p>
                <div className="flex items-center gap-2">
                  {product.brand_logo_url && (
                    <img
                      src={product.brand_logo_url}
                      alt={product.brand_name}
                      className="w-12 h-12 object-contain rounded-lg border border-gray-200"
                    />
                  )}
                  <p className="text-gray-900">{product.brand_name || "No brand available"}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-900">{product.description || "No description available"}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{product.category?.name || "N/A"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Variants</p>
                  <p className="font-semibold text-gray-900">{product.variants?.length || 0}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created At
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {product.created_at ? new Date(product.created_at).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {isLimited && (
            <div className="px-6 pb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Info className="h-5 w-5" />
                Additional Information
              </h2>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Max Stock</p>
                  <p className="font-semibold text-gray-900">
                    {isLimited
                      ? (product as LimitedProductData).limited_product?.max_stock || "N/A"
                      : "N/A"}{" "}
                    items
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 md:mt-0">
                  <p className="text-sm text-gray-500 mb-2">Bought Limit</p>
                  <p className="font-semibold text-gray-900">
                    {isLimited
                      ? (product as LimitedProductData).limited_product?.bought_limit || "N/A"
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-2">
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-500 mb-2">Premiere Date</p>
                  <p className="font-semibold text-gray-900">
                    {isLimited
                      ? (product as LimitedProductData).limited_product?.premiere_date || "N/A"
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-500 mb-2">Start Date</p>
                  <p className="font-semibold text-gray-900">
                    {isLimited
                      ? (product as LimitedProductData).limited_product?.availability_start_date ||
                        "N/A"
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-500 mb-2">End Date</p>
                  <p className="font-semibold text-gray-900">
                    {isLimited
                      ? (product as LimitedProductData).limited_product?.availability_end_date ||
                        "N/A"
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
          {isLimited && (product as LimitedProductData).concept && (
            <div className="px-6 pb-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Star className="h-5 w-5" />
                Concept Information
              </h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 mb-1">Concept Name</p>
                  <p className="text-xl font-bold text-purple-900">
                    {(product as LimitedProductData).concept?.name || "N/A"}
                  </p>
                </div>

                {(product as LimitedProductData).concept?.description && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-900">
                      {(product as LimitedProductData).concept?.description}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  {(product as LimitedProductData).concept?.status && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Status</p>
                      <Badge
                        className={
                          (product as LimitedProductData).concept?.status === "ACTIVE"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }
                      >
                        {(product as LimitedProductData).concept?.status}
                      </Badge>
                    </div>
                  )}

                  {(product as LimitedProductData).concept?.start_date && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Concept Start Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(
                          (product as LimitedProductData).concept?.start_date || "",
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {(product as LimitedProductData).concept?.end_date && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Concept End Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(
                          (product as LimitedProductData).concept?.end_date || "",
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {(product as LimitedProductData).concept?.created_at && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Created At</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(
                          (product as LimitedProductData).concept?.created_at || "",
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {(product as LimitedProductData).concept?.video_thumbnail && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Concept Video</p>
                    <video
                      controls
                      className="w-full rounded-lg border border-gray-200"
                      style={{ maxHeight: "400px" }}
                    >
                      <source
                        src={(product as LimitedProductData).concept?.video_thumbnail}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {(product as LimitedProductData).concept?.banner_url && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Concept Banners</p>
                    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                      {(product as LimitedProductData).concept?.banner_url
                        .split(",")
                        .map((url: string, index: number) => (
                          <div key={index} className="relative group">
                            <img
                              src={url.trim()}
                              alt={`Concept Banner ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer"
                              onClick={() => window.open(url.trim(), "_blank")}
                            />
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                              <p className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                Click to view full size
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-12 bg-white rounded-lg shadow">
        <div className="lg:col-span-1">
          <div className=" overflow-hidden">
            <div className="flex flex-col justify-center items-center p-6">
              <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden mb-4 w-full">
                <img
                  src={
                    typeof currentImage === "string"
                      ? currentImage
                      : currentImage?.image_url ||
                        "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {Array.isArray(displayImages) && displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 w-full">
                  {displayImages.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all cursor-pointer ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-300 hover:ring-1 hover:ring-gray-400"
                      }`}
                    >
                      <img
                        src={typeof img === "string" ? img : img?.image_url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 border-l border-gray-200">
          {product.variants && product.variants.length > 0 && (
            <div>
              <div className="p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Package className="h-5 w-5" />
                  Product Variants
                </h2>
                <Tabs defaultValue={selectedVariant?.id || product.variants[0]?.id}>
                  <TabsList className="w-full flex-wrap h-auto gap-2">
                    {product.variants.map((variant) => (
                      <TabsTrigger
                        key={variant.id}
                        value={variant.id || ""}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setSelectedImageIndex(0);
                        }}
                        className="flex-1 min-w-[120px]"
                      >
                        {variant.capacity} {variant.capacity_unit}
                        {variant.is_default && (
                          <Badge className="ml-2 text-xs" variant="secondary">
                            Default
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {product.variants.map((variant) => (
                    <TabsContent key={variant.id} value={variant.id || ""} className="mt-4">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              Price
                            </p>
                            <p className="font-semibold">
                              {variant.price?.toLocaleString() || "N/A"}đ
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <Droplet className="h-4 w-4" />
                              Capacity
                            </p>
                            <p className="font-semibold text-gray-900">
                              {variant.capacity || "N/A"} {variant.capacity_unit || ""}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <Box className="h-4 w-4" />
                              Container Type
                            </p>
                            <p className="font-semibold text-gray-900">
                              {getContainerTypeLabel(variant.container_type)}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              Dispenser Type
                            </p>
                            <p className="font-semibold text-gray-900">
                              {getDispenserTypeLabel(variant.dispenser_type)}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <Weight className="h-4 w-4" />
                              Weight
                            </p>
                            <p className="font-semibold text-gray-900">{variant.weight} g</p>
                          </div>

                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <MdHeight className="h-4 w-4" />
                              Height
                            </p>
                            <p className="font-semibold text-gray-900">{variant.height} cm</p>
                          </div>

                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <MdWidthNormal className="h-4 w-4" />
                              Width
                            </p>
                            <p className="font-semibold text-gray-900">{variant.width} cm</p>
                          </div>

                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <RulerDimensionLine className="h-4 w-4" />
                              Length
                            </p>
                            <p className="font-semibold text-gray-900">{variant.length} cm</p>
                          </div>

                          {variant.manufacture_date && (
                            <div className="p-4 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Manufacture Date
                              </p>
                              <p className="font-semibold text-gray-900">
                                {new Date(variant?.manufacture_date).toLocaleDateString() || "N/A"}
                              </p>
                            </div>
                          )}

                          {variant.expiry_date && (
                            <div className="p-4 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Expiry Date
                              </p>
                              <p className=" font-semibold text-gray-900">
                                {new Date(variant.expiry_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {selectedVariant?.current_stock && isLimited && (
                            <div className="p-4 rounded-lg border border-orange-200 bg-yellow-50">
                              <p className="text-sm text-orange-700 font-medium mb-1 flex items-center gap-1">
                                <ShoppingCart className="h-4 w-4" />
                                Current Stock
                              </p>
                              <p className="font-bold text-orange-900">
                                {variant.current_stock} units
                              </p>
                            </div>
                          )}
                        </div>

                        {selectedVariant?.current_stock && isLimited && (
                          <div className="p-4 rounded-lg border border-orange-200 bg-yellow-50">
                            <p className="text-sm text-orange-700 font-medium mb-2 flex items-center gap-1">
                              <span>
                                <Star className="h-5 w-5" />
                              </span>
                              Story
                            </p>
                            <p className="text-gray-900">{variant.story || "Test"}</p>
                          </div>
                        )}

                        {variant.description && (
                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 font-medium mb-2 flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              Description
                            </p>
                            <p className="text-gray-900">{variant.description}</p>
                          </div>
                        )}

                        {variant.instructions && (
                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 font-medium mb-2">
                              Usage Instructions
                            </p>
                            <p className="text-gray-900">{variant.instructions}</p>
                          </div>
                        )}

                        {variant.uses && (
                          <div className="p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 font-medium mb-2">Uses</p>
                            <p className="text-gray-900">{variant.uses}</p>
                          </div>
                        )}

                        {variant.attributes && variant.attributes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Attributes
                            </h4>
                            <div className="flex gap-2">
                              {variant.attributes.map((attr: ProductAttribute, idx: number) => (
                                <div key={idx} className="rounded-lg border p-2 border-gray-200">
                                  <div className="flex justify-between items-start gap-2">
                                    {attr.ingredient && (
                                      <p className="text-sm">{attr.ingredient} :</p>
                                    )}
                                    <p className="text-sm">
                                      {attr.value} ({attr.unit})
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-gray-200 absolute min-w-full bottom-0 left-0 bg-white min-h-fit border-t flex justify-end items-center px-4 py-2 gap-2">
        <div className="space-x-2">
          <Button variant={"outline"} size={"sm"} onClick={() => navigate("/manage/sale/product")}>
            Back To Products
          </Button>
          <Button size={"sm"}>Edit Product</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
