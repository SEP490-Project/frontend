import { AdditionalInfoForm } from "@/components/manage/sale/product/form/AdditionalForm";
import { BasicInfoForm } from "@/components/manage/sale/product/form/BasicInfoForm";
import type {
  CreateProductPayload,
  CreateLimitedProductPayload,
  ProductData,
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
        bought_limit: 1,
        max_stock: 1,
        is_free_shipping: false,
        concept_id: "",
      },
    },
  });

  const form = isLimitedProduct ? limitedForm : standardForm;

  useEffect(() => {
    const existingProduct = getItem<ProductData>("currentProduct");
    if (existingProduct) {
      form.reset({
        name: existingProduct.name,
        category_id: existingProduct.category?.id?.toString() || "",
        brand_id: existingProduct.brand_id?.toString() || "",
        description: existingProduct.description || null,
      });
    }
  }, [form]);

  return (
    <>
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
