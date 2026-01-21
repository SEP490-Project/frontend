import { useState } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaTimes, FaMoneyBill } from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ContractPayment, SubmitRefundProofRequest } from "@/libs/types/contract-payments";

// ============== Submit Refund Proof Modal (For Marketing Staff) ==============
interface SubmitRefundProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: ContractPayment | null;
  onSubmit: (data: SubmitRefundProofRequest) => Promise<void>;
  isSubmitting: boolean;
}

export function SubmitRefundProofModal({
  isOpen,
  onClose,
  payment,
  onSubmit,
  isSubmitting,
}: SubmitRefundProofModalProps) {
  const [proofUrl, setProofUrl] = useState("");
  const [proofNote, setProofNote] = useState("");

  const handleSubmit = async () => {
    if (!proofUrl.trim()) {
      toast.error("Please provide the refund proof URL");
      return;
    }

    try {
      await onSubmit({
        refund_proof_url: proofUrl.trim(),
        refund_proof_note: proofNote.trim() || undefined,
      });
      // Reset form
      setProofUrl("");
      setProofNote("");
    } catch {
      // Error handled by parent
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaUpload className="h-5 w-5 text-blue-600" />
            Submit Refund Proof
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
            {payment.refund_attempts && payment.refund_attempts > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attempt</span>
                <span className="text-sm font-medium">#{payment.refund_attempts + 1}</span>
              </div>
            )}
          </div>

          {/* Brand Bank Info */}
          {(payment.brand_bank_name || payment.brand_bank_account_number) && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                <FaBuildingColumns className="h-4 w-4" />
                Brand Bank Details (Recipient)
              </div>
              {payment.brand_bank_name && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">Bank Name</span>
                  <span className="font-medium text-blue-900">{payment.brand_bank_name}</span>
                </div>
              )}
              {payment.brand_bank_account_number && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">Account Number</span>
                  <span className="font-medium text-blue-900">
                    {payment.brand_bank_account_number}
                  </span>
                </div>
              )}
              {payment.brand_bank_account_holder && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">Account Holder</span>
                  <span className="font-medium text-blue-900">
                    {payment.brand_bank_account_holder}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Previous Rejection Reason */}
          {payment.status === "KOL_PROOF_REJECTED" && payment.refund_reject_reason && (
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-1">
                <FaTimes className="h-4 w-4" />
                Previous Rejection Reason
              </div>
              <p className="text-sm text-red-700">{payment.refund_reject_reason}</p>
            </div>
          )}

          {/* Proof URL Input */}
          <div className="space-y-2">
            <Label htmlFor="proofUrl">Refund Proof URL *</Label>
            <Input
              id="proofUrl"
              type="url"
              placeholder="https://example.com/transfer-receipt.png"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Upload the bank transfer receipt/screenshot to a file hosting service and paste the
              URL here.
            </p>
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <Label htmlFor="proofNote">Note (Optional)</Label>
            <Textarea
              id="proofNote"
              placeholder="Add any additional notes about the refund..."
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>
        </motion.div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !proofUrl.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaUpload className="mr-2 h-4 w-4" />
                Submit Proof
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
