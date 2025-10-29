import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/libs/stores";
import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";
import { createTag, updateTag } from "@/libs/stores/tagManager";
import type { Tag } from "@/libs/types/tag";

interface TagManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  tag?: Tag | null;
  onSuccess?: () => void;
}

const TagManagement: React.FC<TagManagementProps> = ({
  open,
  onOpenChange,
  mode,
  tag,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.manageTag);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (mode === "edit" && tag) {
      setName(tag.name);
      setDescription(tag.description || "");
    } else if (mode === "create") {
      setName("");
      setDescription("");
    }
    setErrors({});
  }, [mode, tag, open]);

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Tag name is required";
    } else if (name.length > 100) {
      newErrors.name = "Tag name must be less than 100 characters";
    }

    if (description && description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const data = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      if (mode === "create") {
        await dispatch(createTag(data)).unwrap();
      } else if (mode === "edit" && tag) {
        await dispatch(updateTag({ id: tag.id, data })).unwrap();
      }

      handleCancel();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to save tag:", error);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Tag" : "Edit Tag"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new tag to categorize your content."
              : "Update the tag information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tag Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter tag name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter tag description (optional)"
              className={`resize-none ${errors.description ? "border-red-500" : ""}`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "create" ? "Create Tag" : "Update Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TagManagement;
