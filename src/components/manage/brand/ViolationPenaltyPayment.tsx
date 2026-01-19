import { useState, useEffect } from "react";
import { CreditCard, Loader2, AlertTriangle, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { manageViolation } from "@/libs/services/manageViolation";
import type { ContractViolation } from "@/libs/types/violation";
import { toast } from "sonner";
import PaymentModal from "@/components/manage/marketing/contract-payment/PaymentModal";

interface ViolationPenaltyPaymentProps {
  violation: ContractViolation;
  contractId: string;
  onPaymentCreated?: (paymentLink: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function ViolationPenaltyPayment({
  violation,
  contractId,
  onPaymentCreated,
}: ViolationPenaltyPaymentProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(violation.payment_data || null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (violation.payment_data) {
      setPaymentData(violation.payment_data);
    }
  }, [violation.payment_data]);

  const handleCreatePayment = async () => {
    setIsLoading(true);
    try {
      const response = await manageViolation.createPenaltyPayment(contractId, {
        violation_id: violation.id,
        return_url: window.location.href,
        cancel_url: window.location.href,
      });
      const data = response.data.data;
      setPaymentData(data);
      setIsPaymentModalOpen(true);
      toast.success("Payment link created successfully!");
      onPaymentCreated?.(data.checkoutUrl);
      setShowConfirmDialog(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create payment link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <CreditCard className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-semibold text-gray-900">Penalty Payment</h2>
      </div>

      {/* Payment Summary */}
      <div className="bg-red-50 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Paid (Forfeited)</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(violation.total_paid_by_brand)}
            </span>
          </div>
          {violation.penalty_amount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Additional Penalty Fee</span>
              <span className="font-medium text-red-600">
                {formatCurrency(violation.penalty_amount)}
              </span>
            </div>
          )}
          <div className="border-t border-red-200 pt-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Total Penalty Due</span>
            <span className="text-xl font-bold text-red-700">
              {formatCurrency(violation.penalty_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Actions */}
      {paymentData ? (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-800 mb-3">
              Payment link has been created. Scan the QR code or click the button below to proceed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Payment Details
              </Button>
              <a
                href={paymentData.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Proceed to PayOS
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            You will be redirected to PayOS to complete the payment. Once payment is confirmed, the
            contract will be automatically updated.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            To complete the violation process, you must pay the penalty amount. Click the button
            below to generate a payment link.
          </p>
          <Button
            onClick={() => setShowConfirmDialog(true)}
            className="bg-red-600 hover:bg-red-700 text-white w-full"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Create Payment Link
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <DialogTitle>Confirm Payment Creation</DialogTitle>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <DialogDescription className="text-gray-600">
              You are about to create a payment link for the penalty amount of{" "}
              <span className="font-semibold text-red-700">
                {formatCurrency(violation.penalty_amount)}
              </span>
              .
            </DialogDescription>
            <DialogDescription className="mt-2 text-gray-600">
              This action cannot be undone. Once the payment is completed, the contract will be
              marked as terminated.
            </DialogDescription>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePayment}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        paymentData={paymentData}
      />
    </div>
  );
}
