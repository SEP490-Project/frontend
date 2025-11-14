import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FaFilter, FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/libs/stores";
import { getAllProductsThunk } from "@/libs/stores/productManager/thunk";
import { useProduct } from "@/libs/hooks/useProduct";
import { PaginationTable } from "@/components/global";

const ProductApprovalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, products } = useProduct();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    // type: "LIMITED",
    status: "SUBMITTED",
    search: "",
  });

  // Get products data and pagination from useProduct hook
  const productsData = products?.data || [];
  const pagination = products?.pagination;
  const error = null; // useProduct hook should handle errors internally

  console.log(productsData);

  useEffect(() => {
    dispatch(getAllProductsThunk(params));
  }, [dispatch, params]);

  const handleViewDetails = (product: any) => {
    navigate(`/manage/brand/product-approval/${product.id}`);
  };

  const getStatusBadge = (status: string) => {
    console.log(status);
    const statusColors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
      SUBMITTED: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      REVISION: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    };

    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Product Approval</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by product name..."
              value={params.search || ""}
              onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading products...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-red-600">
                    Error: Failed to load products
                  </TableCell>
                </TableRow>
              ) : !productsData || productsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No products found for approval
                  </TableCell>
                </TableRow>
              ) : (
                productsData.map((product: any, index: number) => (
                  <TableRow
                    key={product.id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <TableCell className="py-4 max-w-xs">
                      <div className="flex items-center">
                        <img
                          src={
                            product.thumbnail_url?.[0] ||
                            "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789"
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded mr-4 float-left"
                        />
                        <span className="font-medium text-gray-900 block text-nowrap overflow-hidden text-ellipsis">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center">
                        {product.brand_logo_url && (
                          <img
                            src={product.brand_logo_url}
                            alt={product.brand_name}
                            className="w-8 h-8 object-cover rounded mr-2"
                          />
                        )}
                        <span className="text-sm text-gray-600 max-w-xs truncate">
                          {product.brand_name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      {product.category ? product.category.name : "N/A"}
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        className={
                          product.type === "STANDARD"
                            ? "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200"
                            : "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200"
                        }
                      >
                        {product.type}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100"
                        title="View Details"
                        onClick={() => handleViewDetails(product)}
                      >
                        <FaEye className="text-blue-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {pagination && (
            <PaginationTable
              page={pagination.page}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(page) => setParams({ ...params, page })}
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2">Loading products...</span>
            </div>
          ) : !productsData || productsData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No products found for approval</div>
          ) : (
            productsData.map((product: any) => (
              <div
                key={product.id}
                className="bg-white border rounded-lg p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(product)}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={
                      product.thumbnail_url?.[0] ||
                      "https://cdn.shopify.com/s/files/1/0069/4471/8937/products/Chanel-Coco-Mademoiselle-Intense-EDP-W-50ml-2_de2881cf-4ddb-4a2d-a65a-12b75ff4ec7f_1200x1200.jpg?v=1573190789"
                    }
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      {product.brand_logo_url && (
                        <img
                          src={product.brand_logo_url}
                          alt={product.brand_name}
                          className="w-4 h-4 object-cover rounded mr-1"
                        />
                      )}
                      <span className="text-sm text-gray-600">{product.brand_name}</span>
                    </div>
                  </div>
                  {getStatusBadge(product.status)}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-semibold text-primary">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm">{product.category?.name || "N/A"}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Submitted: {formatDate(product.created_at)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(product);
                    }}
                  >
                    <FaEye className="mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductApprovalPage;
