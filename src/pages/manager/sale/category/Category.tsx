import { AddCategoryForm } from "@/components/manage/sale/category/AddCategoryForm";
import { EditCategoryForm } from "@/components/manage/sale/category/EditCategoryForm";
import { AssignParentCategoryForm } from "@/components/manage/sale/category/AssignParentCategoryForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { FaFilter } from "react-icons/fa6";
import { useAppDispatch } from "@/libs/stores";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";
import { getAllCategoriesThunk, deleteCategoryThunk } from "@/libs/stores/categoryManager/thunk";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { PaginationTable } from "@/components/global";
import { formatDate } from "@/libs/helper/helper";

const Category = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, pagination } = useSelector(
    (state: RootState) => state.manageCategory,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParentFilter, setSelectedParentFilter] = useState("ALL");
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
  const [categoryToAssign, setCategoryToAssign] = useState<string | null>(null);
  const [params, setParams] = useState({ page: 1, limit: 5 });

  useEffect(() => {
    dispatch(getAllCategoriesThunk(params));
  }, [dispatch, params]);

  const filteredCategories = useMemo(() => {
    if (!categories?.data) return [];

    return categories.data.filter((category) => {
      const matchesSearch =
        searchTerm === "" ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesParent =
        selectedParentFilter === "ALL" ||
        (selectedParentFilter === "NONE" && !category.parent_category) ||
        category.parent_category?.id === selectedParentFilter;

      return matchesSearch && matchesParent;
    });
  }, [categories, searchTerm, selectedParentFilter]);

  const parentCategories = useMemo(() => {
    if (!categories?.data) return [];
    return categories.data.filter((cat) => !cat.parent_category);
  }, [categories]);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await dispatch(deleteCategoryThunk(categoryToDelete)).unwrap();
      toast.success("Category deleted successfully!");
      setCategoryToDelete(null);
      dispatch(getAllCategoriesThunk(params));
    } catch (error) {
      toast.error(String(error) || "Failed to delete category");
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    dispatch(getAllCategoriesThunk(params));
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setCategoryToEdit(null);
    dispatch(getAllCategoriesThunk(params));
  };

  const handleAssignSuccess = () => {
    setIsAssignDialogOpen(false);
    setCategoryToAssign(null);
    dispatch(getAllCategoriesThunk(params));
  };

  const categoryToDeleteName = useMemo(() => {
    if (!categoryToDelete || !categories?.data) return "";
    const category = categories.data.find((cat) => cat.id === categoryToDelete);
    return category?.name || "";
  }, [categoryToDelete, categories]);

  const categoryToAssignData = useMemo(() => {
    if (!categoryToAssign || !categories?.data) return undefined;
    return categories.data.find((cat) => cat.id === categoryToAssign);
  }, [categoryToAssign, categories]);

  const categoryToEditData = useMemo(() => {
    if (!categoryToEdit || !categories?.data) return undefined;
    return categories.data.find((cat) => cat.id === categoryToEdit);
  }, [categoryToEdit, categories]);

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Category</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-[#f794a8] text-white">Create Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Fill in the form below to add a new category.</DialogDescription>
            </DialogHeader>
            <AddCategoryForm onSuccess={handleFormSuccess} loading={loading} />
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
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="min-w-[150px]">
            <Select value={selectedParentFilter} onValueChange={setSelectedParentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="NONE">Root Categories</SelectItem>
                {parentCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
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
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Parent Category</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading categories...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-gray-100">
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">{category.description || "N/A"}</div>
                    </TableCell>
                    <TableCell>{category.parent_category?.name || "N/A"}</TableCell>
                    <TableCell>{formatDate(category.create_at)}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-blue-100"
                        onClick={() => {
                          setCategoryToAssign(category.id);
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-yellow-100"
                        onClick={() => {
                          setCategoryToEdit(category.id);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-yellow-500" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-red-100"
                        onClick={() => setCategoryToDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
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
      </div>

      <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DeleteModal name={categoryToDeleteName} onDelete={handleDeleteCategory} />
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category information below.</DialogDescription>
          </DialogHeader>
          {categoryToEditData && (
            <EditCategoryForm
              category={categoryToEditData}
              onSuccess={handleEditSuccess}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Parent Category</DialogTitle>
            <DialogDescription>
              {categoryToAssignData?.parent_category
                ? "This category already has a parent category assigned."
                : "Select a parent category to assign to this category."}
            </DialogDescription>
          </DialogHeader>
          <AssignParentCategoryForm
            onSuccess={handleAssignSuccess}
            loading={loading}
            currentCategory={categoryToAssignData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Category;
