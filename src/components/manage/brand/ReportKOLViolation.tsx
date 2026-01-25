import { useState } from "react";
import { AlertTriangle, Loader2, FileText, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { manageViolation } from "@/libs/services/manageViolation";
import type { ReportViolationRequest } from "@/libs/types/violation";
import { toast } from "sonner";

interface ReportKOLViolationProps {
  contractId: string;
  contractNumber?: string;
  onReportSuccess?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ReportKOLViolation({
  contractId,
  contractNumber,
  onReportSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ReportKOLViolationProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const setOpenState = (newState: boolean) => {
    if (onOpenChange) {
      onOpenChange(newState);
    }
    if (!newState) {
      // Small delay to prevent flickering during close animation
      setTimeout(() => {
        if (!open) {
          setShowConfirmation(false);
          setReason("");
        }
      }, 300);
    }
  };

  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = () => {
    if (reason.trim().length < 10) {
      toast.error("Please provide a detailed reason (minimum 10 characters)");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const data: ReportViolationRequest = { reason: reason.trim() };
      await manageViolation.reportKOLViolation(contractId, data);
      toast.success("KOL violation reported successfully");
      setOpenState(false);
      setShowConfirmation(false);
      setReason("");
      onReportSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to report violation");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleCancel = () => {
  //   if (showConfirmation) {
  //     setShowConfirmation(false);
  //   } else {
  //     setOpenState(false);
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={setOpenState}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 transition-colors"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report KOL Violation
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-xl">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Report KOL Violation</DialogTitle>
                  <DialogDescription>
                    {contractNumber
                      ? `Contract #${contractNumber}`
                      : "Report a violation for this contract"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-2 space-y-6">
              <Alert className="bg-orange-50 border-orange-200 text-orange-900">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800 font-semibold mb-2">
                  Outcome of Reporting Violation
                </AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    <li>
                      Contract status will change to <strong>KOL Violated</strong> immediately
                    </li>
                    <li>
                      You will be eligible for a <strong>100% refund</strong> of paid amounts
                    </li>
                    <li>Marketing team will verify standard terms within 24-48 hours</li>
                    <li>This action is visible to the Admin team for processing</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="violation-reason" className="text-base font-medium">
                    Violation Reason <span className="text-red-500">*</span>
                  </Label>
                  <span className="text-xs text-gray-500">{reason.length}/1000 characters</span>
                </div>
                <Textarea
                  id="violation-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe specifically how the KOL violated the contract terms (e.g., missed deadlines, inappropriate content, poor quality)..."
                  className="min-h-[150px] resize-none focus-visible:ring-orange-500"
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" /> Minimum 10 characters required for submission.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setOpenState(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={reason.trim().length < 10}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Continue <FileText className="h-4 w-4 ml-2" />
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 flex-shrink-0 animate-pulse">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-red-700">
                    Confirm Violation Report
                  </DialogTitle>
                  <DialogDescription className="text-red-600 font-medium">
                    This action is irreversible.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-4 space-y-5">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-red-800 leading-relaxed">
                  Are you sure you want to mark this contract as violated? The contract will be
                  terminated for violation and the refund process will begin. This cannot be undone.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Reason being submitted:</Label>
                <div className="bg-gray-50 rounded-md p-4 border border-gray-200 text-sm text-gray-700 italic border-l-4 border-l-orange-400">
                  "{reason}"
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  "Yes, Confirm Report"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
