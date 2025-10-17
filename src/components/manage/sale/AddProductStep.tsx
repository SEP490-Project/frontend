import { Outlet, useLocation, useNavigate } from "react-router";
import { MiniStepper, Stepper } from "./Stepper";
import { Button } from "@/components/ui/button";
import { ProductFormMode } from "@/enums/product";

const AddProductStep = () => {
  const navigate = useNavigate();
  const { state, pathname } = useLocation();

  const steps = [
    { path: "/manage/sale/product/create", label: "Basic Info" },
    { path: "/manage/sale/product/create/variants", label: "Variants" },
    { path: "/manage/sale/product/create/done", label: "Done" },
  ];

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

  const handleNext = () => {
    if (currentStep < steps.length) {
      navigate(steps[currentStep].path, { state });
    } else {
      console.log("Form completed!");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(steps[currentStep - 2].path, { state });
    } else {
      navigate("/manage/sale/product");
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
      case ProductFormMode.EDIT:
        return "Edit Product";
      case ProductFormMode.VIEW:
        return "View Product";
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="min-h-screen">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-semibold">{renderForm()}</h1>
          <Stepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
          <Outlet />
        </div>
      </div>
      <div className="border-gray-200 sticky bottom-0 bg-white min-h-fit border-t flex justify-between items-center px-4 py-2 gap-2">
        <MiniStepper steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
        <div className="space-x-2">
          <Button variant={"outline"} size={"sm"} onClick={handleBack}>
            Back
          </Button>
          <Button size={"sm"} onClick={handleNext} disabled={currentStep >= steps.length}>
            {currentStep >= steps.length ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductStep;
