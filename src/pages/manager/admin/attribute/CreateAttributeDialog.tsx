import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { manageAttribute } from "@/libs/services/manageAttribute";
import type { CreateVariantAttributePayload } from "@/libs/types/variant-attribute";

interface Props {
  onCreated?: () => void;
}

const CreateAttributeDialog: React.FC<Props> = ({ onCreated }) => {
  const [ingredient, setIngredient] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIngredient("");
    setDescription("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ingredient.trim()) {
      setError("Ingredient is required");
      return;
    }

    const payload: CreateVariantAttributePayload = {
      ingredient: ingredient.trim(),
      description: description.trim(),
    };

    try {
      setLoading(true);
      await manageAttribute.createVariantAttributes(payload);
      setLoading(false);
      if (onCreated) onCreated();
      reset();
    } catch (err: any) {
      setLoading(false);
      const msg = err?.response?.data?.message || err?.message || "Failed to create attribute";
      setError(msg);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Create Attribute</DialogTitle>
        <DialogDescription>Add a new variant attribute to the system.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="ingredient">Ingredient</Label>
          <Input
            id="ingredient"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="e.g. Vitamin C"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            disabled={loading}
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CreateAttributeDialog;
