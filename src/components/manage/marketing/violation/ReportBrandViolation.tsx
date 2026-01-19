import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { manageViolation } from "@/libs/services/manageViolation";
import { toast } from "sonner";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type FormValues = {
  reason: string;
};

const reportBrandViolationSchema = yup.object({
  reason: yup
    .string()
    .trim()
    .required("Violation reason is required")
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must be at most 500 characters"),
});

interface ReportBrandViolationProps {
  contractId: string;
  contractNumber: string;
  brandName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ReportBrandViolation({
  contractId,
  contractNumber,
  brandName,
  open,
  onOpenChange,
  onSuccess,
}: ReportBrandViolationProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(reportBrandViolationSchema),
    defaultValues: {
      reason: "",
    },
  });

  const reason = watch("reason");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      await manageViolation.reportBrandViolation(contractId, {
        reason: data.reason.trim(),
      });

      toast.success("Brand violation reported successfully");
      reset();
      setShowConfirmation(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to report violation");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setShowConfirmation(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showConfirmation} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Report Brand Violation
            </DialogTitle>
            <DialogDescription>
              Report a violation for contract <strong>{contractNumber}</strong> with brand{" "}
              <strong>{brandName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Warning banner */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Important Information</h4>
              <ul className="text-sm text-orange-700 list-disc list-inside space-y-1">
                <li>This action will mark the contract as violated</li>
                <li>
                  The brand will be required to pay any remaining contract amount plus a penalty fee
                </li>
                <li>The contract status will change to BRAND_VIOLATED</li>
                <li>This action cannot be easily undone</li>
              </ul>
            </div>

            {/* Reason input */}
            <div className="space-y-2">
              <Label htmlFor="violation-reason" className="text-sm font-medium">
                Violation Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="violation-reason"
                placeholder="Describe the reason for reporting this brand violation..."
                rows={4}
                className="resize-none"
                {...register("reason")}
              />

              {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
              <p className="text-xs text-gray-500">
                {reason.length}/500 characters. Be specific about the violation details.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleSubmit(() => setShowConfirmation(true))}
              disabled={isSubmitting || !!errors.reason}
            >
              Report Violation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onOpenChange={(open) => !isSubmitting && setShowConfirmation(open)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Brand Violation Report
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <p>
                  You are about to report a violation for contract <strong>{contractNumber}</strong>
                  .
                </p>
                <p>This will:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Change the contract status to BRAND_VIOLATED</li>
                  <li>Calculate penalty amount based on remaining contract value</li>
                  <li>Notify the brand about the violation and required penalty payment</li>
                </ul>
                <p className="font-medium text-red-600 mt-2">
                  This action cannot be easily undone. Are you sure you want to proceed?
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Confirm Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
