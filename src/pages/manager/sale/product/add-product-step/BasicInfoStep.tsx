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
import TaskDisplayForm from "@/components/manage/sale/product/form/TaskDisplayForm";

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
      task_id: state.task?.id || "",
      limited_attribute: {
        premiere_date: "",
        availability_start_date: "",
        availability_end_date: "",
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
      {state?.productType === "LIMITED" && <TaskDisplayForm />}
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
