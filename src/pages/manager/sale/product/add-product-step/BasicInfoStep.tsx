import { AdditionalInfoForm } from "@/components/manage/sale/product/form/AdditionalForm";
import { BasicInfoForm } from "@/components/manage/sale/product/form/BasicInfoForm";
import type { CreateProductPayload } from "@/libs/types/product";
import { createStandardProductSchema } from "@/libs/validation/productValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLocation, useOutletContext, type NavigateFunction } from "react-router";

const BasicInfoStep = () => {
  const { state } = useLocation();
  const { setOnSubmitStep, steps, currentStep, navigate } = useOutletContext<{
    setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
    steps: { path: string; label: string }[];
    currentStep: number;
    navigate: NavigateFunction;
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

  return (
    <>
      <BasicInfoForm
        form={form}
        setOnSubmitStep={setOnSubmitStep}
        steps={steps}
        currentStep={currentStep}
        navigate={navigate}
      />
      {state?.productType === "LIMITED" && <AdditionalInfoForm />}
    </>
  );
};

export default BasicInfoStep;
