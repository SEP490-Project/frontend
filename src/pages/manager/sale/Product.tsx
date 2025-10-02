import React, { useState, useMemo } from "react";
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
import { FaPenToSquare, FaFilter } from "react-icons/fa6";
import { mockProducts } from "./sale-mock-data";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { StatusModal } from "@/components/modal/StatusModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PaginationTable } from "@/components/global";

const PAGE_SIZE = 5;

const Product: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filteredproducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || product.type === statusFilter;

      const matchesCategory = categoryFilter === "ALL" || product.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredproducts.length / PAGE_SIZE);
  const paginatedproducts = filteredproducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Products</h1>
        <Button className="bg-primary hover:bg-[#f794a8] text-white">Add product</Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Category</SelectItem>
                <SelectItem value="Perfumes">Perfumes</SelectItem>
                <SelectItem value="Skincare">Skincare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[150px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="LIMITED">Limited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow">
        <div className="hidden md:block">
          <Table>
            <TableHeader className="px-4">
              <TableRow className="border-b bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Brand</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedproducts.map((product, index) => (
                <TableRow
                  key={product.id}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  <TableCell className="py-4 max-w-xs">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded mr-4 float-left"
                      />
                      <span className="font-medium text-gray-900 block text-nowrap overflow-hidden text-ellipsis">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">{product.brand}</div>
                  </TableCell>

                  <TableCell className="py-4">{product.current_stock}</TableCell>

                  <TableCell className="py-4">{product.category}</TableCell>

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
                    <Dialog>
                      <DialogTrigger>
                        <Switch checked={product.isActive} />
                      </DialogTrigger>
                      <StatusModal
                        name={product.name}
                        status={product.isActive ? "Inactive" : "Active"}
                      />
                    </Dialog>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-yellow-50"
                          >
                            <FaPenToSquare className="text-yellow-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit product</p>
                        </TooltipContent>
                      </Tooltip>

                      <Dialog>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash className="text-red-600" />
                              </Button>
                            </DialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete product</p>
                          </TooltipContent>
                        </Tooltip>
                        <DeleteModal name={product.name} />
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y">
          {paginatedproducts.map((product) => (
            <div key={product.id} className="p-4 flex flex-col gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <Badge
                    className={
                      product.type === "STANDARD"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-orange-100 text-orange-800 border-orange-200"
                    }
                  >
                    {product.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Stock</div>
                  <div className="font-semibold text-lg">{product.current_stock} units</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Brand:</span>
                  <span>{product.brand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Category:</span>
                  <span>{product.category}</span>
                </div>
              </div>

              <div className="flex gap-1 pt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-yellow-50">
                      <FaPenToSquare className="text-yellow-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit product</p>
                  </TooltipContent>
                </Tooltip>

                <Dialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                          <Trash className="text-red-600" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete product</p>
                    </TooltipContent>
                  </Tooltip>
                  <DeleteModal name={product.name} />
                </Dialog>
              </div>
            </div>
          ))}
        </div>

        {filteredproducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found matching your criteria.
          </div>
        )}

        {filteredproducts.length > 0 && (
          <PaginationTable
            page={page}
            totalItems={filteredproducts.length}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            entityName="products"
          />
        )}
      </div>
    </div>
  );
};

export default Product;
