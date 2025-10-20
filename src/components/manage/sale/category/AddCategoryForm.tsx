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
import { useAppDispatch } from "@/libs/stores";
import { createCategoryThunk } from "@/libs/stores/categoryManager/thunk";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import type { ProductCategory } from "@/libs/types/category";

interface AddCategoryFormProps {
  onSuccess?: () => void;
  categories?: ProductCategory[];
  loading?: boolean;
}

export const AddCategoryForm = ({ onSuccess, categories, loading }: AddCategoryFormProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_category_id: "",
  });

  const filteredParentCategories = categories?.filter((cat) => !cat.parent_category);

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

    if (formData.parent_category_id) {
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
            <SelectItem value=" ">None</SelectItem>
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
