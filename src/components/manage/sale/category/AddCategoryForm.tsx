import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategoryThunk } from "@/libs/stores/categoryManager/thunk";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/libs/stores";
import type { CategoryResponse } from "@/libs/types/category";
import manageCategories from "@/libs/services/manageCategories";
import { AxiosError } from "axios";

interface AddCategoryFormProps {
  onSuccess?: () => void;
  loading?: boolean;
}

export const AddCategoryForm = ({ onSuccess, loading }: AddCategoryFormProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_category_id: "",
  });
  const [allCategories, setAllCategories] = useState<CategoryResponse>({} as CategoryResponse);

  const filteredParentCategories = allCategories?.data?.filter((cat) => !cat.parent_category);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resultAction = await manageCategories.getAllCategories({ page: 1, limit: 1000 });
        setAllCategories(resultAction.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Failed to fetch categories");
          return;
        }
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload: any = {
      name: formData.name,
    };

    if (formData.description.trim()) {
      payload.description = formData.description;
    }

    if (formData.parent_category_id && formData.parent_category_id !== " ") {
      payload.parent_category_id = formData.parent_category_id;
    }

    try {
      await dispatch(createCategoryThunk(payload)).unwrap();
      toast.success("Category created successfully!");
      setFormData({ name: "", description: "", parent_category_id: "" });
      onSuccess?.();
    } catch (error) {
      toast.error(String(error) || "Failed to create category");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label className="mb-2 block">Category Name *</Label>
        <Input
          type="text"
          placeholder="Category Name"
          className="mb-4"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label className="mb-2 block">Category Description</Label>
        <Textarea
          placeholder="Category Description"
          className="mb-4"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <Label className="mb-2 block">Parent Category</Label>
        <Select
          value={formData.parent_category_id}
          onValueChange={(value) => setFormData({ ...formData, parent_category_id: value })}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select parent category (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={" "}>None</SelectItem>
            {filteredParentCategories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
};
