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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaPenToSquare, FaFilter, FaEye } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusModal } from "@/components/modal/StatusModal";
import { useNavigate } from "react-router";
import { useAppDispatch, type RootState } from "@/libs/stores";
import {
  getAllStandardProductsThunk,
  updateProductVisibilityThunk,
} from "@/libs/stores/productManager/thunk";
import { useSelector } from "react-redux";
import type { ProductData, ProductParams } from "@/libs/types/product";
import { PaginationTable } from "@/components/global";
import { SelectAddProductType } from "@/components/manage/sale/product/SelectAddProductType";
import { toast } from "sonner";
import { getAllCategoriesThunk } from "@/libs/stores/categoryManager/thunk";

const StandardProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { standardProducts, isLoading } = useSelector((state: RootState) => state?.manageProduct);
  const { categories } = useSelector((state: RootState) => state?.manageCategory);
  const error = useSelector((state: any) => state?.manageProduct?.error);

  const [params, setParams] = useState<ProductParams>({
    page: 1,
    limit: 5,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const pagination = standardProducts?.pagination;
  const products: ProductData[] = standardProducts?.data || [];
  const filterParentCategory = categories?.data.filter((cat) => !cat.parent_category);

  useEffect(() => {
    if (searchTerm === "") {
      setParams((prev) => ({ ...prev, search: undefined, page: 1 }));
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    Promise.all([
      dispatch(getAllStandardProductsThunk(params)),
      dispatch(getAllCategoriesThunk({ page: 1, limit: 1000 })),
    ]);
  }, [dispatch, params]);

  const handleToggleVisibility = async (product: ProductData, isActive: boolean) => {
    if (product.variants?.length === 0 || !product.variants) {
      toast.error("Cannot change visibility of a product with no variants.");
      return;
    }
    const result = await dispatch(
      updateProductVisibilityThunk({ productId: product.id, isActive }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      return await dispatch(
        getAllStandardProductsThunk({
          ...params,
        }),
      );
    }
  };

  const handleResetFilters = () => {
    setParams({
      page: 1,
      limit: 5,
    });
    setSearchTerm("");
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Products</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-[#f794a8] text-white">Create product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>Select the type of product you want to add.</DialogDescription>
            </DialogHeader>
            <SelectAddProductType />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Button variant="outline" onClick={handleResetFilters}>
              Clear All
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            value={params.category_id ?? ""}
            onValueChange={(value) => {
              setParams({ ...params, category_id: value === "" ? undefined : value, page: 1 });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {filterParentCategory?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Variants</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading products...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-600">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : !products || products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
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
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {product.brand_name}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">{product.variants?.length || 0}</TableCell>

                    <TableCell className="py-4">
                      {product.category ? product.category.name : "N/A"}
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        className={
                          product.type === "STANDARD"
                            ? "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 "
                            : "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200"
                        }
                      >
                        {product.type}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      {product.type === "LIMITED" ? (
                        <Badge
                          className={
                            product.is_active
                              ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 "
                              : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                          }
                        >
                          {product.status}
                        </Badge>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <span>
                              <Switch checked={product.is_active} />
                            </span>
                          </DialogTrigger>
                          <StatusModal
                            name={product.name}
                            status={product.is_active ? "Inactive" : "Active"}
                            onConfirm={() => handleToggleVisibility(product, !product.is_active)}
                          />
                        </Dialog>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className=" hover:bg-blue-100"
                          title="View"
                          onClick={() => {
                            navigate(`/manage/sale/product/${product.id}`, {
                              state: { data: product },
                            });
                          }}
                        >
                          <FaEye className="text-blue-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className=" hover:bg-yellow-100"
                          title="Edit"
                          onClick={() => {
                            navigate(`/manage/sale/product/${product.id}/edit`, {
                              state: { id: product.id, product: product },
                            });
                          }}
                        >
                          <FaPenToSquare className="text-yellow-600" />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className=" hover:bg-red-100"
                              title="Delete"
                            >
                              <Trash className="text-red-600" />
                            </Button>
                          </DialogTrigger>
                          {/* <DeleteModal name={product.name} /> */}
                        </Dialog>
                      </div>
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
      </div>
    </div>
  );
};

export default StandardProduct;
