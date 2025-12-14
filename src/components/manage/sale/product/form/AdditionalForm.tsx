import { Input } from "@/components/ui/input";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CreateLimitedProductPayload, LimitedProductData } from "@/libs/types/product";
import { useEffect } from "react";
import { getItem } from "@/libs/local-storage";
import { DatePicker } from "@/components/date-picker";

interface AdditionalInfoFormProps {
  form: UseFormReturn<CreateLimitedProductPayload>;
}

export const AdditionalInfoForm = ({ form }: AdditionalInfoFormProps) => {
  const { control, watch, setError, clearErrors } = form;
  const premiereDate = watch("limited_attribute.premiere_date");
  const startSaleDate = watch("limited_attribute.availability_start_date");
  const endSaleDate = watch("limited_attribute.availability_end_date");

  const today = new Date(Date.now()).toISOString().split("T")[0];

  // Load existing product data once on mount
  useEffect(() => {
    const existingProduct = getItem<LimitedProductData>("currentProduct");
    if (existingProduct && existingProduct.id) {
      form.reset({
        limited_attribute: {
          achievable_quantity: existingProduct.limited_product?.achievable_quantity || 1,
          premiere_date: existingProduct.limited_product?.premiere_date || "",
          availability_start_date: existingProduct.limited_product?.availability_start_date || "",
          availability_end_date: existingProduct.limited_product?.availability_end_date || "",
        },
      } as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md mb-12">
      <h2 className="text-lg font-semibold mb-4">Additional Information</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="achievableQuantity"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Achievable Quantity
        </label>
        <Controller
          name="limited_attribute.achievable_quantity"
          control={control}
          render={({ field }) => (
            <Input
              id="achievableQuantity"
              type="number"
              min={1}
              className="col-span-3"
              autoComplete="off"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="premiereDate"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Premiere Date
        </label>
        <Controller
          name="limited_attribute.premiere_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value || ""}
              onChange={field.onChange}
              minDate={today}
              placeholder="Select premiere date"
              className="col-span-3"
            />
          )}
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
        <Controller
          name="limited_attribute.availability_start_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value || ""}
              onChange={field.onChange}
              minDate={premiereDate || today}
              placeholder="Select start sale date"
              disabled={!premiereDate}
              className="col-span-3"
            />
          )}
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
        <Controller
          name="limited_attribute.availability_end_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value || ""}
              onChange={field.onChange}
              minDate={startSaleDate || today}
              placeholder="Select end sale date"
              disabled={!startSaleDate}
              className="col-span-3"
            />
          )}
        />
      </div>
    </div>
  );
};
