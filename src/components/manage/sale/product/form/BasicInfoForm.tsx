import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useBrand } from "@/libs/hooks/useBrand";
import { useAppDispatch } from "@/libs/stores";
import { brand } from "@/libs/stores/brandManager/thunk";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import type { CreateProductPayload, ProductFormProps } from "@/libs/types/product";
import { createStandardProductThunk } from "@/libs/stores/productManager/thunk";
import { toast } from "sonner";
import { getAllCategoriesThunk } from "@/libs/stores/categoryManager/thunk";
import { useSelector } from "react-redux";
import type { ProductCategory } from "@/libs/types/category";

export const BasicInfoForm = ({
  form,
  setOnSubmitStep,
  steps,
  currentStep,
  navigate,
}: ProductFormProps<CreateProductPayload>) => {
  const dispatch = useAppDispatch();
  const categories = useSelector((state: any) => state?.manageCategory?.categories?.data);
  const { brands } = useBrand();
  const [params] = useState({ page: 1, limit: 100 });
  const { register, handleSubmit, control } = form;

  const onSubmit = useCallback(
    async (payload: CreateProductPayload) => {
      const result = await dispatch(createStandardProductThunk(payload)).unwrap();
      console.log("Created product:", result);
      navigate(steps[currentStep]?.path);
    },
    [dispatch],
  );

  const onError = useCallback((errors: any) => {
    toast.error(errors[Object.keys(errors)[0]].message);
  }, []);

  useEffect(() => {
    if (setOnSubmitStep) {
      const submitHandler = async () => {
        await handleSubmit(onSubmit, onError)();
      };
      setOnSubmitStep(() => submitHandler);
    }
  }, [setOnSubmitStep, handleSubmit, onSubmit, onError]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(getAllCategoriesThunk(params)).unwrap(),
          dispatch(brand(params)).unwrap(),
        ]);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast.error("Failed to load categories or brands");
      }
    };

    fetchInitialData();
  }, [dispatch, params]);

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="productName"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Product Name
        </label>
        <Input
          id="productName"
          placeholder="Input"
          className="col-span-3"
          autoComplete="off"
          {...register("name")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="productCategory"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Category
        </label>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: ProductCategory) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="productBrand"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Brand
        </label>
        <Controller
          name="brand_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands?.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="productPrice"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
          Price (VND)
        </label>
        <Input
          id="productPrice"
          type="number"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label
          htmlFor="productDescription"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          Description
        </label>
        <Textarea
          id="productDescription"
          placeholder="Input"
          className="col-span-3"
          {...register("description")}
        />
      </div>
    </div>
  );
};
