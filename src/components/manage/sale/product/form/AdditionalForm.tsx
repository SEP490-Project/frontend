import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { CreateLimitedProductPayload } from "@/libs/types/product";
import { useEffect } from "react";

interface AdditionalInfoFormProps {
  form: UseFormReturn<CreateLimitedProductPayload>;
}

export const AdditionalInfoForm = ({ form }: AdditionalInfoFormProps) => {
  const { register, watch, setError, clearErrors } = form;
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
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Additional Information</h2>

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
          type="date"
          min={today}
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
          type="date"
          min={premiereDate || today}
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.availability_start_date")}
          disabled={!premiereDate}
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
          type="date"
          min={startSaleDate || today}
          className="col-span-3"
          autoComplete="off"
          {...register("limited_attribute.availability_end_date")}
          disabled={!startSaleDate}
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
    </div>
  );
};
