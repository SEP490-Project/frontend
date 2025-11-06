import { AdditionalInfoForm } from "@/components/manage/sale/product/form/AdditionalForm";
import { BasicInfoForm } from "@/components/manage/sale/product/form/BasicInfoForm";
import {
  type CreateProductPayload,
  type CreateLimitedProductPayload,
  type ProductData,
  type ProductResponse,
} from "@/libs/types/product";
import {
  createStandardProductSchema,
  createLimitedProductSchema,
} from "@/libs/validation/productValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext, type NavigateFunction } from "react-router";
import { getItem } from "@/libs/local-storage";
import { Input } from "@/components/ui/input";

const BasicInfoStep = () => {
  const { setOnSubmitStep, steps, currentStep, navigate, state, setIsDisabled, isDisabled } =
    useOutletContext<{
      setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
      steps: { path: string; label: string }[];
      currentStep: number;
      navigate: NavigateFunction;
      state: any;
      isDisabled: boolean;
      setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    }>();

  const isLimitedProduct = state?.productType === "LIMITED";

  const standardForm = useForm<CreateProductPayload>({
    resolver: yupResolver(createStandardProductSchema),
    defaultValues: {
      brand_id: "",
      category_id: "",
      description: null,
      name: "",
    },
  });

  const limitedForm = useForm<CreateLimitedProductPayload>({
    resolver: yupResolver(createLimitedProductSchema),
    defaultValues: {
      brand_id: "",
      category_id: "",
      description: null,
      name: "",
      task_id: "",
      limited_attribute: {
        premiere_date: "",
        availability_start_date: "",
        availability_end_date: "",
        bought_limit: null,
        max_stock: null,
        is_free_shipping: true,
        concept_id: undefined,
      },
    },
  });

  const form = isLimitedProduct ? limitedForm : standardForm;

  // Load existing product data from localStorage
  useEffect(() => {
    const existingProduct = getItem<ProductResponse<ProductData>>("currentProduct");
    if (existingProduct?.data?.id) {
      const productData = existingProduct.data;
      if (isLimitedProduct) {
        limitedForm.reset({
          name: productData.name,
          category_id: productData.category?.id?.toString() || "",
          brand_id: productData.brand_id?.toString() || "",
          description: productData.description || null,
          task_id: (productData as any).task_id || "",
          limited_attribute: {
            premiere_date: (productData as any).limited_attribute?.premiere_date || "",
            availability_start_date:
              (productData as any).limited_attribute?.availability_start_date || "",
            availability_end_date:
              (productData as any).limited_attribute?.availability_end_date || "",
            bought_limit: (productData as any).limited_attribute?.bought_limit || null,
            max_stock: (productData as any).limited_attribute?.max_stock || null,
            is_free_shipping: (productData as any).limited_attribute?.is_free_shipping ?? true,
            concept_id: (productData as any).limited_attribute?.concept_id || undefined,
          },
        });
      } else {
        standardForm.reset({
          name: productData.name,
          category_id: productData.category?.id?.toString() || "",
          brand_id: productData.brand_id?.toString() || "",
          description: productData.description || null,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {state?.productType === "LIMITED" && (
        <div className="flex mb-6 bg-white p-6 rounded-lg mt-6 shadow-md">
          <label
            htmlFor="taskId"
            className="text-lg font-medium text-gray-700 text-nowrap flex items-center justify-start md:justify-end mr-4"
          >
            Task ID
          </label>
          <Input
            id="taskId"
            type="text"
            placeholder="Optional"
            className="col-span-3"
            autoComplete="off"
            {...(form.register as any)("task_id")}
            // disabled
          />
        </div>
      )}

      <BasicInfoForm
        form={form as any}
        setOnSubmitStep={setOnSubmitStep}
        steps={steps}
        currentStep={currentStep}
        navigate={navigate}
        state={state}
        setIsDisabled={setIsDisabled}
        isDisabled={isDisabled}
      />
      {isLimitedProduct && <AdditionalInfoForm form={limitedForm} />}
    </>
  );
};

export default BasicInfoStep;
