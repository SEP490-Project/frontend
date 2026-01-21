import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FaEye } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/libs/stores";
import { getAllLimitedProductsThunk } from "@/libs/stores/productManager/thunk";
import { useProduct } from "@/libs/hooks/useProduct";
import { useSelector } from "react-redux";
import { getAllCategoriesThunk } from "@/libs/stores/categoryManager/thunk";
import PaginationTable from "@/components/global/PaginationTable";
import { getItem } from "@/libs/local-storage";
import { motion } from "framer-motion";

const ProductApprovalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, limitedProducts } = useProduct();
  const navigate = useNavigate();
  const user = getItem<{ id: string }>("user");
  const { categories } = useSelector((state: any) => state?.manageCategory || {});

  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    type: "LIMITED",
    status: " ",
    search: "",
    user_id: user?.id || "",
    category_id: " ",
  });

  useEffect(() => {
    dispatch(getAllCategoriesThunk({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Get products data and pagination from useProduct hook
  const productsData = limitedProducts?.data || [];
  const pagination = limitedProducts?.pagination;

  // Motion variants for animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  useEffect(() => {
    dispatch(
      getAllLimitedProductsThunk({
        ...params,
        status: params.status === " " || !params.status ? undefined : params.status,
        category_id:
          params.category_id === " " || !params.category_id ? undefined : params.category_id,
      }),
    );
  }, [dispatch, params]);

  const handleViewDetails = (product: any) => {
    navigate(`/manage/brand/product-approval/${product.id}`);
  };

  const getStatusBadge = (status: string) => {
    // Match color style with Product.tsx
    const statusColors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200",
      SUBMITTED: "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
      REJECTED: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
      REVISION: "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200",
      ACTIVED: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      INACTIVED: "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200",
    };
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status === "ACTIVED" ? "ACTIVE" : status === "INACTIVED" ? "DEACTIVATED" : status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.h1 className="text-xl sm:text-2xl font-semibold" variants={itemVariants}>
            Brand Product Approval
          </motion.h1>
          <motion.p className="text-gray-600 mt-1" variants={itemVariants}>
            Review and approve product submissions as brand representative
          </motion.p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-lg shadow mb-4 p-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <motion.div variants={itemVariants} className="flex-1 min-w-48">
            <Input
              placeholder="Search by product name..."
              value={params.search || ""}
              onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
              className="w-full"
              autoComplete="off"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="min-w-36">
            <Select
              value={params.category_id || undefined}
              onValueChange={(value) => setParams({ ...params, category_id: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Categories</SelectItem>
                {categories?.data
                  ?.filter((cat: any) => !cat.parent_category)
                  ?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants} className="min-w-36">
            <Select
              value={params.status || undefined}
              onValueChange={(value) => setParams({ ...params, status: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REVISION">Revision</SelectItem>
                <SelectItem value="ACTIVED">Active</SelectItem>
                <SelectItem value="INACTIVED">Deactivated</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              onClick={() =>
                setParams({
                  page: 1,
                  limit: 5,
                  type: "LIMITED",
                  status: " ",
                  search: "",
                  user_id: user?.id || "",
                  category_id: " ",
                })
              }
              className="px-4 py-2"
            >
              Reset Filters
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Product Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 text-primary animate-spin" />
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Desktop Grid Layout */}
              <div className="hidden lg:block">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-medium text-sm text-gray-600">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2">Variants</div>
                  <div className="col-span-3">Category</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {/* Table Body */}
                {productsData.map((product: any, index) => (
                  <motion.div
                    key={product.id}
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-5">
                      <div className="flex items-center">
                        <img
                          src={
                            product.thumbnail_url?.[0] ||
                            "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789"
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded mr-4"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-gray-600">{product.variants?.length || 0}</span>
                    </div>

                    <div className="col-span-3 flex items-center">
                      <span className="text-sm text-gray-600">
                        {product.category ? product.category.name : "N/A"}
                      </span>
                    </div>

                    <div className="col-span-1 flex items-center">
                      {getStatusBadge(product.status)}
                    </div>

                    <div className="col-span-1 flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                            onClick={() => handleViewDetails(product)}
                          >
                            <FaEye className="text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View details</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Card List */}
              <div className="lg:hidden divide-y">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  {productsData.map((product: any) => (
                    <motion.div
                      key={product.id}
                      className="p-4 flex flex-col gap-3 bg-white"
                      variants={itemVariants}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <img
                            src={
                              product.thumbnail_url?.[0] ||
                              "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789"
                            }
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 line-clamp-2">
                              {product.name}
                            </h4>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {getStatusBadge(product.status)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          {product.brand_logo_url && (
                            <img
                              src={product.brand_logo_url}
                              alt={product.brand_name}
                              className="w-4 h-4 object-cover rounded mr-2"
                            />
                          )}
                          <span className="font-medium">Brand:</span>
                          <span className="ml-1">{product.brand_name}</span>
                        </div>

                        <div>
                          <span className="font-medium">Variants:</span>
                          <span className="ml-1">{product.variants?.length || 0}</span>
                        </div>

                        <div>
                          <span className="font-medium">Category:</span>
                          <span className="ml-1">{product.category?.name || "N/A"}</span>
                        </div>

                        <div>
                          <span className="font-medium">Submitted:</span>
                          <span className="ml-1">{formatDate(product.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex gap-1 pt-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => handleViewDetails(product)}
                            >
                              <FaEye className="text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View details</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* No results message */}
              {(!productsData || productsData.length === 0) && (
                <motion.div
                  className="p-8 text-center text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p>
                    {params.search
                      ? "No products match your current search."
                      : "No products found for approval."}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: productsData.length * 0.05 + 0.2 }}
        >
          <PaginationTable
            page={pagination.page}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={(page) => setParams({ ...params, page })}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ProductApprovalPage;
