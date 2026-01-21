import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaMoneyBill } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ContractPayment, ReviewRefundProofRequest } from "@/libs/types/contract-payments";

// ============== Review Refund Proof Modal (For Brand) ==============
interface ReviewRefundProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: ContractPayment | null;
  onReview: (data: ReviewRefundProofRequest) => Promise<void>;
  isReviewing: boolean;
}

export function ReviewRefundProofModal({
  isOpen,
  onClose,
  payment,
  onReview,
  isReviewing,
}: ReviewRefundProofModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    try {
      await onReview({ approved: true });
      onClose();
    } catch {
      // Error handled by parent
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await onReview({ approved: false, reject_reason: rejectReason.trim() });
      setRejectReason("");
      setShowRejectForm(false);
      onClose();
    } catch {
      // Error handled by parent
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaCheck className="h-5 w-5 text-green-600" />
            Review Refund Proof
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Payment Info Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contract</span>
              <span className="font-medium">{payment.contract_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Refund Amount</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <FaMoneyBill className="mr-1 h-3 w-3" />
                {formatCurrency(payment.refund_amount || 0)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Submitted At</span>
              <span className="text-sm">{formatDate(payment.refund_submitted_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Attempt</span>
              <span className="text-sm font-medium">#{payment.refund_attempts || 1}</span>
            </div>
          </div>

          {/* Proof URL */}
          {payment.refund_proof_url && (
            <div className="space-y-2">
              <Label>Refund Proof</Label>
              <a
                href={payment.refund_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors break-all"
              >
                {payment.refund_proof_url}
              </a>
            </div>
          )}

          {/* Proof Note */}
          {payment.refund_proof_note && (
            <div className="space-y-2">
              <Label>Note from Staff</Label>
              <div className="p-3 bg-gray-100 rounded-lg text-sm">{payment.refund_proof_note}</div>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <Label htmlFor="rejectReason">Rejection Reason *</Label>
              <Textarea
                id="rejectReason"
                placeholder="Explain why the refund proof is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={isReviewing}
                rows={3}
              />
            </motion.div>
          )}
        </motion.div>

        <DialogFooter className="gap-2">
          {!showRejectForm ? (
            <>
              <Button
                variant="outline"
                onClick={() => setShowRejectForm(true)}
                disabled={isReviewing}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isReviewing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2 h-4 w-4" />
                    Approve Refund
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowRejectForm(false)}
                disabled={isReviewing}
              >
                Back
              </Button>
              <Button
                onClick={handleReject}
                disabled={isReviewing || !rejectReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaTimes className="mr-2 h-4 w-4" />
                    Confirm Rejection
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
