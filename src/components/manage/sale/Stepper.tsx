import { Button } from "@/components/ui/button";

interface Step {
  label: string;
  path: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors
              ${index + 1 <= currentStep ? "bg-primary hover:bg-primary/90" : "bg-gray-400"}
              ${index + 1 > currentStep ? "cursor-not-allowed" : ""}`}
            onClick={() => {
              if (index + 1 <= currentStep && onStepClick) {
                onStepClick(index);
              }
            }}
          >
            {index + 1}
          </div>
          <span
            className={`ml-2 text-sm ${
              index + 1 <= currentStep ? "text-primary font-semibold" : "text-gray-500"
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-10 h-[2px] mx-2 ${
                index + 1 < currentStep ? "bg-primary" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export const MiniStepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((_, index) => (
        <div key={index} className="flex items-center">
          <Button
            className={"w-8 h-8 flex items-center justify-center font-semibold"}
            variant={`${index + 1 <= currentStep ? "default" : "outline"}`}
            disabled={index + 1 > currentStep}
            onClick={() => {
              if (index + 1 <= currentStep && onStepClick) {
                onStepClick(index);
              }
            }}
          >
            {index + 1}
          </Button>
        </div>
      ))}
    </div>
  );
};
