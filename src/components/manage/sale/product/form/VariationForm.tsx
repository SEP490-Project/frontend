import type { ProductFormProps, ProductVariant } from "@/libs/types/product";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VariationFormProps extends ProductFormProps<ProductVariant> {
  onSubmit?: (data: ProductVariant) => void;
}

export const VariationForm = ({ form, onSubmit, state }: VariationFormProps) => {
  const capacityUnits = ["ML", "L", "G", "KG", "OZ"];
  const containerTypes = [
    "BOTTLE",
    "TUBE",
    "JAR",
    "STICK",
    "PENCIL",
    "COMPACT",
    "PALLETE",
    "SACHET",
    "VIAL",
    "ROLLER_BOTTLE",
  ];
  const dispenserTypes = ["PUMP", "SPRAY", "DROPPER", "ROLL_ON", "TWIST_UP", "SQUEEZE", "NONE"];
  const attributeUnits = ["%", "MG", "G", "ML", "L", "IU", "PPM", "NONE"];

  const { register, handleSubmit, control, watch, setError, clearErrors } = form;

  const manufactureDate = watch("manufacture_date");
  const expiryDate = watch("expiry_date");

  const today = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const manufactureDateStr =
    manufactureDate instanceof Date ? manufactureDate.toISOString().split("T")[0] : manufactureDate;

  const expiryDateStr =
    expiryDate instanceof Date ? expiryDate.toISOString().split("T")[0] : expiryDate;

  useEffect(() => {
    if (manufactureDate && expiryDate) {
      const mfgDate = new Date(manufactureDate);
      const expDate = new Date(expiryDate);
      const todayDate = new Date(today);

      if (expDate < todayDate) {
        setError("expiry_date", {
          type: "manual",
          message: "Expiry date must be in the future",
        });
      } else if (mfgDate >= expDate) {
        setError("expiry_date", {
          type: "manual",
          message: "Expiry date must be after manufacture date",
        });
        setError("manufacture_date", {
          type: "manual",
          message: "Manufacture date must be before expiry date",
        });
      } else {
        clearErrors("expiry_date");
        clearErrors("manufacture_date");
      }
    } else {
      clearErrors("expiry_date");
      clearErrors("manufacture_date");
    }
  }, [manufactureDate, expiryDate, today, setError, clearErrors]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const handleAddAttribute = () => {
    append({
      ingredients: "",
      unit: "",
      value: 0,
      description: "",
    });
  };

  const onFormSubmit = (data: ProductVariant) => {
    console.log("Form submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const onError = (errors: any) => {
    toast.error(errors[Object.keys(errors)[0]].message);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onError)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Variant Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" {...register("name")} placeholder="e.g., 50ml Bottle" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price (VND) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step={1000}
              min={0}
              placeholder="Price must be at least 1000"
              className=" col-span-3"
              autoComplete="off"
              {...register("price", {
                valueAsNumber: true,
                onChange: (e) => {
                  const number = Number(e.target.value);
                  if (number < 0) {
                    e.target.value = "0";
                  }
                },
              })}
              onPaste={(e) => {
                const pastedData = e.clipboardData.getData("text");
                const number = Number(pastedData);
                if (number < 0) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {state.productType === "LIMITED" && (
            <div className="space-y-2">
              <Label htmlFor="current_stock" className="text-sm font-medium">
                Current Stock
              </Label>
              <Input
                id="current_stock"
                type="number"
                {...register("current_stock", {
                  valueAsNumber: true,
                  onChange: (e) => {
                    const number = Number(e.target.value);
                    if (number < 0) {
                      e.target.value = "0";
                    }
                  },
                })}
                onPaste={(e) => {
                  const pastedData = e.clipboardData.getData("text");
                  const number = Number(pastedData);
                  if (number < 0) {
                    e.preventDefault();
                  }
                }}
                placeholder="0"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="is_default"
            control={control}
            render={({ field }) => (
              <Checkbox id="is_default" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="is_default" className="text-sm font-medium cursor-pointer">
            Set as default variant
          </Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Capacity & Container</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Capacity <span className="text-red-500">*</span>
            </Label>
            <Input
              id="capacity"
              type="number"
              step="0.01"
              {...register("capacity", {
                valueAsNumber: true,
                onChange: (e) => {
                  const number = Number(e.target.value);
                  if (number < 0) {
                    e.target.value = "0";
                  }
                },
              })}
              onPaste={(e) => {
                const pastedData = e.clipboardData.getData("text");
                const number = Number(pastedData);
                if (number < 0) {
                  e.preventDefault();
                }
              }}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity_unit" className="text-sm font-medium">
              Capacity Unit <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger id="capacity_unit" {...register("capacity_unit")}>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {capacityUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="container_type" className="text-sm font-medium">
              Container Type <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger id="container_type" {...register("container_type")}>
                <SelectValue placeholder="Select container type" />
              </SelectTrigger>
              <SelectContent>
                {containerTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispenser_type" className="text-sm font-medium">
              Dispenser Type <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger id="dispenser_type" {...register("dispenser_type")}>
                <SelectValue placeholder="Select dispenser type" />
              </SelectTrigger>
              <SelectContent>
                {dispenserTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Manufacturing & Expiry
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manufacture_date" className="text-sm font-medium">
              Manufacture Date
            </Label>
            <Input
              id="manufacture_date"
              type="date"
              max={expiryDateStr || undefined}
              {...register("manufacture_date")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date" className="text-sm font-medium">
              Expiry Date
            </Label>
            <Input
              id="expiry_date"
              type="date"
              min={manufactureDateStr && manufactureDateStr >= today ? manufactureDateStr : today}
              {...register("expiry_date")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-900">Product Attributes</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAttribute}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Attribute
          </Button>
        </div>

        {fields.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Ingredient</TableHead>
                  <TableHead className="font-semibold">Unit</TableHead>
                  <TableHead className="font-semibold">Value</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="w-20 text-center font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input
                        {...register(`attributes.${index}.ingredients`)}
                        placeholder="e.g., Vitamin C"
                        className="min-w-[150px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger
                          {...register(`attributes.${index}.unit`)}
                          className="min-w-[100px]"
                        >
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {attributeUnits.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`attributes.${index}.value`, { valueAsNumber: true })}
                        placeholder="0"
                        className="min-w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`attributes.${index}.description`)}
                        placeholder="Optional description"
                        className="min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500 mb-3">No attributes added yet</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddAttribute}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add First Attribute
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Details & Instructions
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-medium">
              Instructions <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="instructions"
              {...register("instructions")}
              placeholder="How to use this product..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the variant..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="uses" className="text-sm font-medium">
              Uses
            </Label>
            <Textarea
              id="uses"
              {...register("uses")}
              placeholder="What is this product used for..."
              rows={3}
            />
          </div>

          {state.productType === "LIMITED" && (
            <div className="space-y-2">
              <Label htmlFor="story" className="text-sm font-medium">
                Story
              </Label>
              <Textarea
                id="story"
                {...register("story")}
                placeholder="Tell the story behind this product..."
                rows={3}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Add Variant
        </Button>
      </div>
    </form>
  );
};
