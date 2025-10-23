import { AdditionalInfoForm } from "@/components/manage/sale/product/form/AdditionalForm";
import { BasicInfoForm } from "@/components/manage/sale/product/form/BasicInfoForm";
import type { CreateProductPayload, ProductData } from "@/libs/types/product";
import { createStandardProductSchema } from "@/libs/validation/productValidation";
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

  const form = useForm<CreateProductPayload>({
    resolver: yupResolver(createStandardProductSchema),
    defaultValues: {
      brand_id: "",
      category_id: "",
      description: null,
      name: "",
      price: null,
    },
  });

  // Load existing product data from localStorage if available
  useEffect(() => {
    const existingProduct = getItem<ProductData>("currentProduct");
    if (existingProduct) {
      form.reset({
        name: existingProduct.name,
        category_id: existingProduct.category?.id?.toString() || "",
        brand_id: existingProduct.brand_id?.toString() || "",
        price: existingProduct.price,
        description: existingProduct.description || null,
      });
    }
  }, [form]);

  return (
    <>
      <BasicInfoForm
        form={form}
        setOnSubmitStep={setOnSubmitStep}
        steps={steps}
        currentStep={currentStep}
        navigate={navigate}
        state={state}
        setIsDisabled={setIsDisabled}
        isDisabled={isDisabled}
      />
      {state?.productType === "LIMITED" && <AdditionalInfoForm />}
    </>
  );
};

export default BasicInfoStep;
