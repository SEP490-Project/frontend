import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  FileText,
  Info,
  Clock,
  ShoppingCart,
  Tag,
  Droplet,
  Box,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch } from "@/libs/stores";
import { getProductDetailThunk } from "@/libs/stores/productManager/thunk";
import { useSelector } from "react-redux";
import type {
  ProductData,
  ProductVariant,
  ProductAttribute,
  VariantWithImage,
} from "@/libs/types/product";

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
      // Set the default variant or first variant
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
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/manage/sale/product")}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
          </div>
          <div className="flex gap-2">
            <Badge
              className={
                product.type === "STANDARD"
                  ? "bg-blue-100 text-blue-800 border border-blue-200 text-base px-4 py-1"
                  : "bg-orange-100 text-orange-800 border border-orange-200 text-base px-4 py-1"
              }
            >
              {product.type}
            </Badge>
            <Badge
              className={
                product.is_active
                  ? "bg-green-100 text-green-800 border border-green-200 text-base px-4 py-1"
                  : "bg-gray-100 text-gray-800 border border-gray-200 text-base px-4 py-1"
              }
            >
              {product.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="relative bg-gray-100 rounded-lg aspect-square overflow-hidden mb-4">
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

              {/* Thumbnail Gallery */}
              {Array.isArray(displayImages) && displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {displayImages.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
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
            </CardContent>
          </Card>

          {/* Brand Information */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tag className="h-5 w-5 text-primary" />
                Brand Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {product.brand_logo_url && (
                  <img
                    src={product.brand_logo_url}
                    alt={product.brand_name}
                    className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{product.brand_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
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
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {product.category?.description && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-900 font-medium mb-1">Category Description</p>
                  <p className="text-sm text-blue-800">{product.category.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Limited Product Information */}
          {isLimited && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Star className="h-5 w-5" />
                  Limited Edition Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedVariant?.story && (
                    <div className="md:col-span-2 bg-white p-4 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-700 font-medium mb-2">Story</p>
                      <p className="text-gray-900">{selectedVariant.story}</p>
                    </div>
                  )}

                  {selectedVariant?.current_stock !== undefined && (
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-700 font-medium mb-1 flex items-center gap-1">
                        <ShoppingCart className="h-4 w-4" />
                        Current Stock
                      </p>
                      <p className="text-2xl font-bold text-orange-900">
                        {selectedVariant.current_stock} units
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Variants */}
          {product.variants && product.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Product Variants
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        {variant.name}
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
                        {/* Variant Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              Price
                            </p>
                            <p className="text-2xl font-bold text-primary">
                              {variant.price?.toLocaleString() || "N/A"}đ
                            </p>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <Droplet className="h-4 w-4" />
                              Capacity
                            </p>
                            <p className="text-xl font-semibold text-gray-900">
                              {variant.capacity || "N/A"} {variant.capacity_unit || ""}
                            </p>
                          </div>

                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <Box className="h-4 w-4" />
                              Container Type
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {getContainerTypeLabel(variant.container_type)}
                            </p>
                          </div>

                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <Zap className="h-4 w-4" />
                              Dispenser Type
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {getDispenserTypeLabel(variant.dispenser_type)}
                            </p>
                          </div>

                          {variant.manufacture_date && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Manufacture Date
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(variant.manufacture_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}

                          {variant.expiry_date && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Expiry Date
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(variant.expiry_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Variant Description */}
                        {variant.description && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 font-medium mb-2 flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              Description
                            </p>
                            <p className="text-gray-900">{variant.description}</p>
                          </div>
                        )}

                        {/* Instructions */}
                        {variant.instructions && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 font-medium mb-2">
                              Usage Instructions
                            </p>
                            <p className="text-gray-900">{variant.instructions}</p>
                          </div>
                        )}

                        {/* Uses */}
                        {variant.uses && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-sm text-green-900 font-medium mb-2">Uses</p>
                            <p className="text-gray-900">{variant.uses}</p>
                          </div>
                        )}

                        {/* Attributes */}
                        {variant.attributes && variant.attributes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Attributes
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {variant.attributes.map((attr: ProductAttribute, idx: number) => (
                                <div
                                  key={idx}
                                  className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-200"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-medium text-gray-900">
                                      Attribute {idx + 1}
                                    </p>
                                    <Badge variant="outline" className="text-xs">
                                      {attr.value} {attr.unit}
                                    </Badge>
                                  </div>
                                  {attr.description && (
                                    <p className="text-sm text-gray-600 mb-1">{attr.description}</p>
                                  )}
                                  {attr.ingredients && (
                                    <p className="text-xs text-gray-500 italic">
                                      Ingredients: {attr.ingredients}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => navigate(`/manage/sale/product/${product.id}/edit`)}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Edit Product
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/manage/sale/product")}
              className="flex-1"
            >
              Back to List
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
