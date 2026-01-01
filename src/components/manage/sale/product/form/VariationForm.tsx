import type { ProductFormProps, ProductVariant } from "@/libs/types/product";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useFieldArray } from "react-hook-form";
import { DatePicker } from "@/components/date-picker";
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
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/libs/stores";
import { getAllVariantAttributesThunk } from "@/libs/stores/attributeManager/thunk";
import { fetchAllProductOptionTypesThunk } from "@/libs/stores/productOptionManager/thunk";

interface VariationFormProps extends ProductFormProps<ProductVariant> {
  onSubmit?: (data: ProductVariant) => void;
  dispatch?: AppDispatch;
}

export const VariationForm = ({ form, onSubmit, state, dispatch }: VariationFormProps) => {
  const variantAttributes = useSelector(
    (state: RootState) => state?.manageAttribute?.attributes?.data,
  );

  // Get product options from Redux store
  const productOptions = useSelector((state: RootState) => state?.manageProductOption);

  // Map options to code arrays for backward compatibility
  const capacityUnits =
    productOptions?.capacityUnits?.length > 0
      ? productOptions.capacityUnits.map((o) => {
          return {
            code: o.code,
            name: `${o.code} (${o.name})`,
          };
        })
      : [
          { code: "ML", name: "Milliliter (ML)" },
          { code: "L", name: "Liter (L)" },
          { code: "G", name: "Gram (G)" },
          { code: "KG", name: "Kilogram (KG)" },
          { code: "OZ", name: "Ounce (OZ)" },
        ];
  const containerTypes =
    productOptions?.containerTypes?.length > 0
      ? productOptions.containerTypes.map((o) => {
          return {
            code: o.code,
            name: o.name,
          };
        })
      : [
          { code: "BOTTLE", name: "Bottle" },
          { code: "TUBE", name: "Tube" },
          { code: "JAR", name: "Jar" },
          { code: "STICK", name: "Stick" },
          { code: "PENCIL", name: "Pencil" },
          { code: "COMPACT", name: "Compact" },
          { code: "PALLETE", name: "Palette" },
          { code: "SACHET", name: "Sachet" },
          { code: "VIAL", name: "Vial" },
          { code: "ROLLER_BOTTLE", name: "Roller Bottle" },
        ];
  const dispenserTypes =
    productOptions?.dispenserTypes?.length > 0
      ? productOptions.dispenserTypes.map((o) => {
          return {
            code: o.code,
            name: o.name,
          };
        })
      : [
          { code: "PUMP", name: "Pump" },
          { code: "SPRAY", name: "Spray" },
          { code: "DROPPER", name: "Dropper" },
          { code: "ROLL_ON", name: "Roll On" },
          { code: "TWIST_UP", name: "Twist Up" },
          { code: "SQUEEZE", name: "Squeeze" },
          { code: "NONE", name: "None" },
        ];
  const attributeUnits =
    productOptions?.attributeUnits?.length > 0
      ? productOptions.attributeUnits.map((o) => {
          return {
            code: o.code,
            name: `${o.code} (${o.name})`,
          };
        })
      : [
          { code: "%", name: "Percentage (%)" },
          { code: "MG", name: "Milligram (MG)" },
          { code: "G", name: "Gram (G)" },
          { code: "ML", name: "Milliliter (ML)" },
          { code: "L", name: "Liter (L)" },
          { code: "IU", name: "International Unit (IU)" },
          { code: "PPM", name: "Parts Per Million (PPM)" },
          { code: "NONE", name: "None" },
        ];

  const { register, handleSubmit, control, watch, setError, clearErrors } = form;

  const manufactureDate = watch("manufacturing_date");
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
          message: "Expiry date must be after manufactured date",
        });
        setError("manufacturing_date", {
          type: "manual",
          message: "Manufacture date must be before expiry date",
        });
      } else {
        clearErrors("expiry_date");
        clearErrors("manufacturing_date");
      }
    } else {
      clearErrors("expiry_date");
      clearErrors("manufacturing_date");
    }
  }, [manufactureDate, expiryDate, today, setError, clearErrors]);

  useEffect(() => {
    if (dispatch) {
      dispatch(
        getAllVariantAttributesThunk({
          limit: 100,
        }),
      );
      // Fetch product options from database
      dispatch(fetchAllProductOptionTypesThunk());
    }
  }, [dispatch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const handleAddAttribute = () => {
    append({
      attribute_id: "",
      unit: "",
      value: 0,
    });
  };

  const onFormSubmit = (data: ProductVariant) => {
    console.log("Form submitted:", data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);

    // Function to extract the first error message from nested error objects
    const getFirstErrorMessage = (obj: any): string | null => {
      if (!obj) return null;

      // If it's a direct error with message
      if (obj.message) {
        return obj.message;
      }

      // If it's an array of errors (for field arrays like attributes)
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const msg = getFirstErrorMessage(item);
          if (msg) return msg;
        }
      }

      // If it's an object, recursively search for error messages
      if (typeof obj === "object") {
        for (const key in obj) {
          const msg = getFirstErrorMessage(obj[key]);
          if (msg) return msg;
        }
      }

      return null;
    };

    const errorMessage = getFirstErrorMessage(errors);
    toast.error(errorMessage || "Validation failed. Please check all required fields.");
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
              {...register("price")}
            />
          </div>
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

      {state?.productType === "LIMITED" && (
        <div className=" space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Limited Information</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input_stock" className="text-sm font-medium">
                Stock
              </Label>
              <Input id="input_stock" type="number" {...register("input_stock")} placeholder="1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pre_order_limit" className="text-sm font-medium">
                Preorder Limit
              </Label>
              <Input
                id="pre_order_limit"
                type="number"
                {...register("pre_order_limit")}
                placeholder="e.g., 10"
              />
            </div>
          </div>
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
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Size & Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">
              Weight (g) <span className="text-red-500">*</span>
            </Label>
            <Input id="weight" type="number" step="0.1" {...register("weight")} placeholder="1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-sm font-medium">
              Height (cm) <span className="text-red-500">*</span>
            </Label>
            <Input id="height" type="number" step="0.1" {...register("height")} placeholder="1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width" className="text-sm font-medium">
              Width (cm) <span className="text-red-500">*</span>
            </Label>
            <Input id="width" type="number" step="0.1" {...register("width")} placeholder="1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="length" className="text-sm font-medium">
              Length (cm) <span className="text-red-500">*</span>
            </Label>
            <Input id="length" type="number" step="0.1" {...register("length")} placeholder="1" />
          </div>
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
              step="0.1"
              {...register("capacity")}
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity_unit" className="text-sm font-medium">
              Capacity Unit <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="capacity_unit"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="capacity_unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {capacityUnits.map((unit) => (
                      <SelectItem key={unit.code} value={unit.code}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="container_type" className="text-sm font-medium">
              Container Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="container_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="container_type">
                    <SelectValue placeholder="Select container type" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerTypes.map((type) => (
                      <SelectItem key={type.code} value={type.code}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dispenser_type" className="text-sm font-medium">
              Dispenser Type <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="dispenser_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="dispenser_type">
                    <SelectValue placeholder="Select dispenser type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispenserTypes.map((type) => (
                      <SelectItem key={type.code} value={type.code}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Manufacturing & Expiry
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manufacturing_date" className="text-sm font-medium">
              Manufactured Date
            </Label>
            <Controller
              name="manufacturing_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value || ""
                  }
                  onChange={field.onChange}
                  maxDate={state.productType === "LIMITED" ? expiryDateStr || undefined : today}
                  placeholder="Select manufacturing date"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date" className="text-sm font-medium">
              Expiry Date
            </Label>
            <Controller
              name="expiry_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value || ""
                  }
                  onChange={field.onChange}
                  minDate={
                    manufactureDateStr && manufactureDateStr >= today ? manufactureDateStr : today
                  }
                  placeholder="Select expiry date"
                />
              )}
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
                  <TableHead className="w-20 text-center font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Controller
                        name={`attributes.${index}.attribute_id`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ingredient" />
                            </SelectTrigger>
                            <SelectContent>
                              {variantAttributes?.map((ingredient) => (
                                <SelectItem key={ingredient.id} value={ingredient.id}>
                                  {ingredient.ingredient}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`attributes.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="min-w-[100px]">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {attributeUnits.map((unit) => (
                                <SelectItem key={unit.code} value={unit.code}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
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
              Instructions
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
