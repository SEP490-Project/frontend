import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/libs/stores";
import { assignParentCategoryThunk } from "@/libs/stores/categoryManager/thunk";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { ProductCategory } from "@/libs/types/category";

interface AssignParentCategoryFormProps {
  onSuccess?: () => void;
  categories?: ProductCategory[];
  loading?: boolean;
  currentCategory?: ProductCategory;
}

export const AssignParentCategoryForm = ({
  onSuccess,
  categories,
  loading,
  currentCategory,
}: AssignParentCategoryFormProps) => {
  const dispatch = useAppDispatch();
  const [selectedParentId, setSelectedParentId] = useState("");

  const hasParent = !!currentCategory?.parent_category;

  useEffect(() => {
    if (currentCategory?.parent_category) {
      setSelectedParentId(currentCategory.parent_category.id);
    }
  }, [currentCategory]);

  const availableParentCategories = categories?.filter(
    (cat) => cat.id !== currentCategory?.id && !cat.parent_category,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedParentId) {
      toast.error("Please select a parent category");
      return;
    }

    if (!currentCategory?.id) {
      toast.error("Category ID is missing");
      return;
    }

    try {
      await dispatch(
        assignParentCategoryThunk({
          categoryId: currentCategory.id,
          parentCategoryId: selectedParentId,
        }),
      ).unwrap();
      toast.success("Parent category assigned successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error(String(error) || "Failed to assign parent category");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label className="mb-2 block">Current Category</Label>
        <div className="p-2 bg-gray-100 rounded border">
          <p className="font-medium">{currentCategory?.name}</p>
          {currentCategory?.description && (
            <p className="text-sm text-gray-600">{currentCategory.description}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <Label className="mb-2 block">Parent Category {hasParent && "(Already Assigned)"}</Label>
        <Select value={selectedParentId} onValueChange={setSelectedParentId} disabled={hasParent}>
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            {availableParentCategories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasParent && (
          <p className="text-sm text-gray-500 mt-2">
            This category already has a parent: {currentCategory.parent_category?.name}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading || hasParent}>
        {loading ? "Assigning..." : hasParent ? "Already Assigned" : "Assign Parent Category"}
      </Button>
    </form>
  );
};
