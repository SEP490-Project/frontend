import { useState } from "react";
import { Image, Calendar, Check, X, Loader2, ZoomIn, DollarSign, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { manageViolation } from "@/libs/services/manageViolation";
import type { ContractViolation, ReviewProofRequest } from "@/libs/types/violation";
import { toast } from "sonner";
import { Separator } from "@radix-ui/react-separator";

interface ViolationProofReviewProps {
  violation: ContractViolation;
  contractId: string;
  onReviewComplete?: (action: "APPROVE" | "REJECT") => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("us-EN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ViolationProofReview({
  violation,
  contractId,
  onReviewComplete,
}: ViolationProofReviewProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const data: ReviewProofRequest = { action: "APPROVE" };
      await manageViolation.reviewProof(contractId, data);
      toast.success("Refund proof approved successfully!");
      onReviewComplete?.("APPROVE");
      setShowApproveDialog(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to approve proof");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsLoading(true);
    try {
      const data: ReviewProofRequest = {
        action: "REJECT",
        reject_reason: rejectReason.trim(),
      };
      await manageViolation.reviewProof(contractId, data);
      toast.success("Refund proof rejected");
      onReviewComplete?.("REJECT");
      setShowRejectDialog(false);
      setRejectReason("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reject proof");
    } finally {
      setIsLoading(false);
    }
  };

  if (!violation.proof_url) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Proof Submitted Yet</h3>
          <p className="text-gray-500 max-w-sm">
            The marketing team has not yet submitted refund proof. You will be notified when it's
            available for review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-purple-50/50 px-6 py-4 border-b border-purple-100 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FileCheck className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Refund Verification</h2>
            <p className="text-xs text-purple-600 font-medium">Action Required</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white text-purple-700 border-purple-200 shadow-sm">
          Pending Review
        </Badge>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Proof Image */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Proof Document
              </Label>
              <div
                className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer bg-gray-50 aspect-[4/3]"
                onClick={() => setShowImageDialog(true)}
              >
                <img
                  src={violation.proof_url}
                  alt="Refund proof"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <ZoomIn className="w-3.5 h-3.5" /> View Fullscreen
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  Submitted on{" "}
                  <span className="font-medium text-gray-900">
                    {violation.proof_submitted_at
                      ? formatDate(violation.proof_submitted_at)
                      : "N/A"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Financial Summary
              </Label>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 mb-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                  <DollarSign className="w-32 h-32" />
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-500">Paid by brand</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(violation.total_paid_by_brand || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-500">Penalty Amount</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(violation.penalty_amount || 0)}
                    </span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold text-gray-700">Total Due</span>
                    <span className="text-2xl font-bold text-red-600 tracking-tight">
                      {formatCurrency(violation.refund_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Review Instructions</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Please verify that the refund amount in the proof matches the
                  <span className="font-semibold"> {formatCurrency(violation.refund_amount)} </span>
                  required. Once approved, the contract will be officially terminated.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-100">
              <Button
                onClick={() => setShowRejectDialog(true)}
                variant="outline"
                className="h-11 border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all"
              >
                <X className="h-4 w-4 mr-2" />
                Reject Proof
              </Button>
              <Button
                onClick={() => setShowApproveDialog(true)}
                className="h-11 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve & Resolve
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-screen-xl w-full p-0 overflow-hidden bg-black/95 border-none">
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            <button
              onClick={() => setShowImageDialog(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={violation.proof_url}
              alt="Refund proof"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 shrink-0">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-lg">Approve Refund Proof?</DialogTitle>
                <DialogDescription className="mt-1">
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-2">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Refund Amount:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(violation.refund_amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status Update:</span>
                <span className="font-medium text-green-600">Resolved</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              By confirming, you acknowledge receipt of the payment. The contract status will be
              updated to <span className="font-medium text-gray-900">Terminated</span>.
            </p>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
            <div className="flex gap-2 w-full justify-end">
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Approval"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 shrink-0">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg">Reject Refund Proof</DialogTitle>
                <DialogDescription className="mt-1">
                  Request a new proof submission.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="reject-reason" className="text-gray-700">
                Reason for Rejection <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="E.g., Image is blurry, amount mismatch, incorrect account..."
                className="mt-2 min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1.5 flex justify-between">
                <span>Please be specific so the team can correct it.</span>
                <span
                  className={
                    rejectReason.trim().length < 10 && rejectReason.length > 0 ? "text-red-500" : ""
                  }
                >
                  Min 10 chars
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={isLoading || rejectReason.trim().length < 10}
                className="bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
