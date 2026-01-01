import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/libs/stores";
import {
  createProductOptionThunk,
  updateProductOptionThunk,
} from "@/libs/stores/productOptionManager/thunk";
import type { ProductOption, ProductOptionType } from "@/libs/types/productOption";

interface Props {
  option?: ProductOption | null;
  defaultType?: ProductOptionType;
  onSuccess?: () => void;
  onClose?: () => void;
}

const OPTION_TYPES: { value: ProductOptionType; label: string }[] = [
  { value: "CAPACITY_UNIT", label: "Capacity Unit" },
  { value: "CONTAINER_TYPE", label: "Container Type" },
  { value: "DISPENSER_TYPE", label: "Dispenser Type" },
  { value: "ATTRIBUTE_UNIT", label: "Attribute Unit" },
];

const ProductOptionDialog: React.FC<Props> = ({
  option,
  defaultType = "CAPACITY_UNIT",
  onSuccess,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const isEditing = !!option;

  const [type, setType] = useState<ProductOptionType>(option?.type || defaultType);
  const [code, setCode] = useState(option?.code || "");
  const [name, setName] = useState(option?.name || "");
  const [sortOrder, setSortOrder] = useState(option?.sort_order || 0);
  const [isActive, setIsActive] = useState(option?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (option) {
      setType(option.type);
      setCode(option.code);
      setName(option.name);
      setSortOrder(option.sort_order);
      setIsActive(option.is_active);
    } else {
      setType(defaultType);
      setCode("");
      setName("");
      setSortOrder(0);
      setIsActive(true);
    }
    setError(null);
  }, [option, defaultType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError("Code is required");
      return;
    }

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);

      if (isEditing && option) {
        await dispatch(
          updateProductOptionThunk({
            id: option.id,
            data: {
              code: code.trim(),
              name: name.trim(),
              sort_order: sortOrder,
              is_active: isActive,
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          createProductOptionThunk({
            type,
            code: code.trim().toUpperCase(),
            name: name.trim(),
            sort_order: sortOrder,
          }),
        ).unwrap();
      }

      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        `Failed to ${isEditing ? "update" : "create"} product option`;
      setError(msg);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit" : "Create"} Product Option</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the product option details."
            : "Add a new product option to the system."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as ProductOptionType)}
            disabled={isEditing || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {OPTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isEditing && (
            <p className="text-xs text-muted-foreground">Type cannot be changed after creation</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">
              Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ML, BOTTLE"
              disabled={loading}
              className="uppercase"
            />
            <p className="text-xs text-muted-foreground">Unique identifier used in API</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Milliliter, Bottle"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Display name shown to users</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              min={0}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                  disabled={loading}
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Inactive options won't appear in dropdowns
              </p>
            </div>
          )}
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ProductOptionDialog;
