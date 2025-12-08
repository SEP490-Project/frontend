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
import type {
  CreateProductPayload,
  CreateLimitedProductPayload,
  ProductFormProps,
  ProductData,
  ProductResponse,
} from "@/libs/types/product";
import {
  createLimitedProductThunk,
  createStandardProductThunk,
} from "@/libs/stores/productManager/thunk";
import { toast } from "sonner";
import { getAllCategoriesThunk } from "@/libs/stores/categoryManager/thunk";
import { useSelector } from "react-redux";
import type { ProductCategory } from "@/libs/types/category";
import { getItem, setItem } from "@/libs/local-storage";

export const BasicInfoForm = ({
  form,
  setOnSubmitStep,
  steps,
  currentStep,
  navigate,
  state,
  setIsDisabled,
  setIsCreating,
}: ProductFormProps<CreateProductPayload | CreateLimitedProductPayload> & {
  isCreating?: boolean;
  setIsCreating?: (value: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const categories = useSelector((state: any) => state?.manageCategory?.categories?.data);
  const { brands } = useBrand();
  const [params] = useState({ page: 1, limit: 100 });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = form;
  const productBasicInfos = getItem<ProductResponse<ProductData>>("currentProduct")?.data;
  const isLimitedProduct = state?.productType === "LIMITED";

  const [name, category_id, brand_id] = watch(["name", "category_id", "brand_id"]);

  const premiere_date = watch("limited_attribute.premiere_date" as any);
  const availability_start_date = watch("limited_attribute.availability_start_date" as any);
  const availability_end_date = watch("limited_attribute.availability_end_date" as any);
  const achievable_quantity = watch("limited_attribute.achievable_quantity" as any);

  const onSubmit = useCallback(
    async (payload: CreateProductPayload | CreateLimitedProductPayload) => {
      try {
        if (productBasicInfos?.id) {
          navigate(steps[currentStep]?.path, { state });
          return;
        }
        setIsCreating?.(true);
        const result = await dispatch(
          state.productType === "STANDARD"
            ? createStandardProductThunk(payload as CreateProductPayload)
            : createLimitedProductThunk(payload as CreateLimitedProductPayload),
        ).unwrap();
        console.log("Created product:", result);
        if (result) {
          setItem("currentProduct", result);
          toast.success("Product created successfully");
          navigate(steps[currentStep]?.path, { state });
        }
      } catch (error) {
        toast.error((error as string) || "Failed to create product");
      } finally {
        setIsCreating?.(false);
      }
    },
    [dispatch, state, navigate, steps, currentStep, setIsCreating, productBasicInfos?.id],
  );

  const onError = useCallback((errors: any) => {
    toast.error(errors[Object.keys(errors)[0]].message);
  }, []);

  useEffect(() => {
    if (setIsDisabled) {
      const isBasicFormValid = Boolean(
        name &&
          name.trim() !== "" &&
          category_id &&
          brand_id &&
          !errors.name &&
          !errors.category_id &&
          !errors.brand_id,
      );

      if (isLimitedProduct) {
        const isLimitedFormValid = Boolean(
          premiere_date && availability_start_date && availability_end_date && achievable_quantity,
        );

        setIsDisabled(!(isBasicFormValid && isLimitedFormValid));
      } else {
        setIsDisabled(!isBasicFormValid);
      }
    }
  }, [
    name,
    category_id,
    brand_id,
    errors,
    setIsDisabled,
    isLimitedProduct,
    premiere_date,
    availability_start_date,
    availability_end_date,
    achievable_quantity,
  ]);

  // Load existing product data once on mount
  useEffect(() => {
    const existingProduct = getItem<ProductData>("currentProduct");
    if (existingProduct && existingProduct.id) {
      form.reset({
        name: existingProduct.name,
        category_id: existingProduct.category?.id?.toString() || "",
        brand_id: existingProduct.brand_id?.toString() || "",
        description: existingProduct.description || null,
      } as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (setOnSubmitStep) {
      const existingProduct = getItem<ProductResponse<ProductData>>("currentProduct")?.data;

      if (existingProduct && existingProduct.id) {
        setOnSubmitStep(() => async () => {
          navigate(steps[currentStep]?.path, { state });
        });
        return;
      }

      const submitHandler = async () => {
        await handleSubmit(onSubmit, onError)();
      };
      setOnSubmitStep(() => submitHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOnSubmitStep, productBasicInfos?.id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await dispatch(getAllCategoriesThunk(params)).unwrap();
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [dispatch, params]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        await dispatch(brand(params)).unwrap();
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        toast.error("Failed to load brands");
      }
    };

    fetchBrands();
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
              <SelectContent className="max-h-70">
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
              <SelectContent className="max-h-70">
                {brands?.map((brand) => (
                  <SelectItem key={brand.id} value={brand?.id}>
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
          htmlFor="productDescription"
          className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
        >
          <span className="text-red-600">*</span>
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
