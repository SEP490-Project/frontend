import React, { useEffect, useState } from "react";
import { PaginationTable } from "@/components/global";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Plus } from "lucide-react";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { useSelector } from "react-redux";
import {
  getAllProductOptionsThunk,
  deleteProductOptionThunk,
} from "@/libs/stores/productOptionManager/thunk";
import type { ProductOptionType } from "@/libs/types/productOption";
import ProductOptionDialog from "./ProductOptionDialog";

const OPTION_TYPES: { value: ProductOptionType; label: string }[] = [
  { value: "CAPACITY_UNIT", label: "Capacity Units" },
  { value: "CONTAINER_TYPE", label: "Container Types" },
  { value: "DISPENSER_TYPE", label: "Dispenser Types" },
  { value: "ATTRIBUTE_UNIT", label: "Attribute Units" },
];

const ProductOptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { options, pagination, loading, error } = useSelector(
    (state: RootState) => state.manageProductOption,
  );

  const [activeTab, setActiveTab] = useState<ProductOptionType>("CAPACITY_UNIT");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [editingOption, setEditingOption] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(
      getAllProductOptionsThunk({
        type: activeTab,
        page,
      }),
    );
  }, [dispatch, activeTab, page, limit]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ProductOptionType);
    setPage(1);
    setSearch("");
  };

  const handleCreatedOrUpdated = async () => {
    setIsDialogOpen(false);
    setEditingOption(null);
    await dispatch(
      getAllProductOptionsThunk({
        type: activeTab,
        page: 1,
      }),
    );
    setPage(1);
  };

  const handleEdit = (option: any) => {
    setEditingOption(option);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteProductOptionThunk(id));
    await dispatch(
      getAllProductOptionsThunk({
        type: activeTab,
        page,
      }),
    );
  };

  const handleOpenCreate = () => {
    setEditingOption(null);
    setIsDialogOpen(true);
  };

  // Filter options by search term
  const filteredOptions = (options || []).filter(
    (opt) =>
      opt.type === activeTab &&
      (opt.code.toLowerCase().includes(search.toLowerCase()) ||
        opt.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Product Options</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage capacity units, container types, dispenser types, and attribute units
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          {OPTION_TYPES.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {OPTION_TYPES.map((type) => (
          <TabsContent key={type.value} value={type.value}>
            <div className="bg-white rounded-lg shadow mb-4 p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Filters:</span>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search by code or name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="ml-auto">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={handleOpenCreate}>
                        <Plus className="w-4 h-4 mr-1" />
                        Create
                      </Button>
                    </DialogTrigger>
                    <ProductOptionDialog
                      option={editingOption}
                      defaultType={activeTab}
                      onSuccess={handleCreatedOrUpdated}
                      onClose={() => {
                        setIsDialogOpen(false);
                        setEditingOption(null);
                      }}
                    />
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-24">Sort Order</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32">Created</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredOptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No options found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOptions.map((option, idx) => (
                      <TableRow key={option.id}>
                        <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {option.code}
                          </code>
                        </TableCell>
                        <TableCell>{option.name}</TableCell>
                        <TableCell>{option.sort_order}</TableCell>
                        <TableCell>
                          <Badge variant={option.is_active ? "default" : "secondary"}>
                            {option.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {option.created_at
                            ? new Date(option.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-blue-100"
                              title="Edit"
                              onClick={() => handleEdit(option)}
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-red-100"
                                  title="Delete"
                                >
                                  <Trash className="w-4 h-4 text-red-600" />
                                </Button>
                              </DialogTrigger>
                              <DeleteModal
                                name={option.name}
                                onDelete={() => handleDelete(option.id)}
                              />
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
                  page={pagination.page || 1}
                  totalItems={pagination.total || 0}
                  pageSize={pagination.limit || 10}
                  onPageChange={(p) => setPage(p)}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
    </div>
  );
};

export default ProductOptions;
