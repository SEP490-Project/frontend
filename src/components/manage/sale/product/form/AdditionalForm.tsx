import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { UseFormReturn } from "react-hook-form";
import type { CreateLimitedProductPayload } from "@/libs/types/product";
import { useEffect } from "react";

interface AdditionalInfoFormProps {
  form: UseFormReturn<CreateLimitedProductPayload>;
}

export const AdditionalInfoForm = ({ form }: AdditionalInfoFormProps) => {
  const { register, setValue, watch, setError, clearErrors } = form;
  const isFreeShipping = watch("limited_attribute.is_free_shipping");
  const premiereDate = watch("limited_attribute.premiere_date");
  const startSaleDate = watch("limited_attribute.availability_start_date");
  const endSaleDate = watch("limited_attribute.availability_end_date");

  // Get current datetime in ISO format for min attribute
  const now = new Date();
  const currentDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  // Convert dates to string format for min attributes
  const premiereDateStr = premiereDate ? String(premiereDate).slice(0, 16) : "";
  const startSaleDateStr = startSaleDate ? String(startSaleDate).slice(0, 16) : "";

  // Validate date sequence: premiere < start < end
  useEffect(() => {
    if (premiereDate && startSaleDate) {
      const premDate = new Date(premiereDate);
      const startDate = new Date(startSaleDate);

      if (premDate >= startDate) {
        setError("limited_attribute.availability_start_date", {
          type: "manual",
          message: "Start sale date must be after premiere date",
        });
      } else {
        clearErrors("limited_attribute.availability_start_date");
      }
    }

    if (startSaleDate && endSaleDate) {
      const startDate = new Date(startSaleDate);
      const endDate = new Date(endSaleDate);

      if (startDate >= endDate) {
        setError("limited_attribute.availability_end_date", {
          type: "manual",
          message: "End sale date must be after start sale date",
        });
      } else {
        clearErrors("limited_attribute.availability_end_date");
      }
    }
  }, [premiereDate, startSaleDate, endSaleDate, setError, clearErrors]);

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Limited Edition Information</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="premiereDate"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Premiere Date
        </label>
        <Input
          id="premiereDate"
          type="datetime-local"
          min={currentDateTime}
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.premiere_date")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="startSaleDate"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Start Sale Date
        </label>
        <Input
          id="startSaleDate"
          type="datetime-local"
          min={premiereDateStr || currentDateTime}
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.availability_start_date")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="endSaleDate"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          End Sale Date
        </label>
        <Input
          id="endSaleDate"
          type="datetime-local"
          min={startSaleDateStr || currentDateTime}
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.availability_end_date")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="purchaseLimit"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Purchase Limit
        </label>
        <Input
          id="purchaseLimit"
          type="number"
          min={1}
          placeholder="Minimum 1"
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.bought_limit", {
            valueAsNumber: true,
            onChange: (e) => {
              const number = Number(e.target.value);
              if (number < 1) {
                e.target.value = "1";
              }
            },
          })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="maxStock"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Max Stock
        </label>
        <Input
          id="maxStock"
          type="number"
          min={1}
          placeholder="Minimum 1"
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.max_stock", {
            valueAsNumber: true,
            onChange: (e) => {
              const number = Number(e.target.value);
              if (number < 1) {
                e.target.value = "1";
              }
            },
          })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="conceptId"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          Concept ID
        </label>
        <Input
          id="conceptId"
          type="text"
          placeholder="Optional"
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.concept_id")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="taskId"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          Task ID
        </label>
        <Input
          id="taskId"
          type="text"
          placeholder="Optional"
          className="col-span-3"
          autoComplete="off"
          {...register("task_id")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <div className="col-span-1"></div>
        <div className="col-span-3 flex items-center space-x-2">
          <Checkbox
            id="isFreeShipping"
            checked={isFreeShipping}
            onCheckedChange={(checked) => {
              setValue("limited_attribute.is_free_shipping", checked as boolean);
            }}
          />
          <Label
            htmlFor="isFreeShipping"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Free Shipping
          </Label>
        </div>
      </div>
    </div>
  );
};
