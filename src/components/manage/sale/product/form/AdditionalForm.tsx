import { Input } from "@/components/ui/input";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { CreateLimitedProductPayload } from "@/libs/types/product";
import { useEffect } from "react";

interface AdditionalInfoFormProps {
  form: UseFormReturn<CreateLimitedProductPayload>;
}

export const AdditionalInfoForm = ({ form }: AdditionalInfoFormProps) => {
  const { control, watch, setError, clearErrors } = form;
  const premiereDate = watch("limited_attribute.premiere_date");
  const startSaleDate = watch("limited_attribute.availability_start_date");
  const endSaleDate = watch("limited_attribute.availability_end_date");

  const today = new Date(Date.now() + 86400000).toISOString().split("T")[0];

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
            <Input
              id="premiereDate"
              type="date"
              min={today}
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
            <Input
              id="startSaleDate"
              type="date"
              min={premiereDate || today}
              className="col-span-3"
              autoComplete="off"
              disabled={!premiereDate}
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
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
            <Input
              id="endSaleDate"
              type="date"
              min={startSaleDate || today}
              className="col-span-3"
              autoComplete="off"
              disabled={!startSaleDate}
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>
    </div>
  );
};
