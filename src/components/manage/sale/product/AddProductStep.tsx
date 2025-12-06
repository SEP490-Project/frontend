import { Outlet, useLocation, useNavigate } from "react-router";
import { MiniStepper, Stepper } from "./Stepper";
import { Button } from "@/components/ui/button";
import { ProductFormMode } from "@/enums/product";
import { useState, useMemo } from "react";
import { getItem, removeItem } from "@/libs/local-storage";
import { useAppDispatch } from "@/libs/stores";
import { updateProductStateThunk } from "@/libs/stores/stateManager/thunk";
import type { ProductData, ProductResponse } from "@/libs/types/product";

const AddProductStep = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const [onSubmitStep, setOnSubmitStep] = useState<null | (() => Promise<void>)>(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const steps = useMemo(() => {
    const baseSteps = [
      { path: "/manage/sale/product/create", label: "Basic Info" },
      { path: "/manage/sale/product/create/variants", label: "Variants" },
      { path: "/manage/sale/product/create/done", label: "Done" },
    ];

    if (state?.productType === "LIMITED") {
      return [
        baseSteps[0],
        { path: "/manage/sale/product/create/concept", label: "Concept" },
        ...baseSteps.slice(1),
      ];
    }

    return baseSteps;
  }, [state?.productType]);

  const getCurrentStep = () => {
    const exactMatch = steps.findIndex((step) => pathname === step.path);
    if (exactMatch !== -1) return exactMatch + 1;

    let bestMatch = 0;
    let longestMatch = 0;

    steps.forEach((step, index) => {
      if (pathname.startsWith(step.path) && step.path.length > longestMatch) {
        longestMatch = step.path.length;
        bestMatch = index + 1;
      }
    });

    return bestMatch || 1;
  };

  const currentStep = getCurrentStep();

  const handleNext = async () => {
    if (onSubmitStep) {
      await onSubmitStep();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(steps[currentStep - 2]?.path, { state });
    } else {
      // Clean up localStorage when exiting the creation flow
      removeItem("currentProduct");
      removeItem("currentProductVariants");
      removeItem("currentConcept");

      navigate("/manage/sale/product", { state });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex + 1 <= currentStep) {
      navigate(steps[stepIndex].path, { state });
    }
  };

  const renderForm = () => {
    switch (state?.formType) {
      case ProductFormMode.CREATE:
        if (state?.productType === "LIMITED") {
          return "Create Product (Limited)";
        } else if (state?.productType === "STANDARD") {
          return "Create Product (Standard)";
        }
        break;
      default:
        return null;
    }
  };

  const handleSubmitForReview = async () => {
    try {
      const productId = getItem<ProductResponse<ProductData>>("currentProduct")?.data?.id;
      if (!productId) return;
      dispatch(updateProductStateThunk({ productId: productId, newState: "SUBMITTED" }));
    } catch (error) {
      console.error("Failed to submit product for review:", error);
    } finally {
      removeItem("currentProduct");
      removeItem("currentProductVariants");
      removeItem("currentConcept");

      handleNext();
    }
  };

  return (
    <div>
      <div className="min-h-screen">
        <div className=" p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold">{renderForm()}</h1>
          <Stepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
          <Outlet
            context={{
              setOnSubmitStep,
              navigate,
              steps,
              currentStep,
              state,
              setIsDisabled,
              isDisabled,
            }}
          />
          <div className="border-gray-200 absolute min-w-full bottom-0 left-0 bg-white min-h-fit border-t flex justify-between items-center px-4 py-2 gap-2">
            <MiniStepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
            <div className="space-x-2">
              <Button variant={"outline"} size={"sm"} onClick={handleBack}>
                Back
              </Button>
              {state?.productType === "LIMITED" && currentStep === steps.length ? (
                <Button size={"sm"} onClick={handleSubmitForReview} disabled={isDisabled}>
                  Submit for Review
                </Button>
              ) : (
                <Button size={"sm"} onClick={handleNext} disabled={isDisabled}>
                  {currentStep >= steps.length ? "Finish" : "Next"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductStep;
