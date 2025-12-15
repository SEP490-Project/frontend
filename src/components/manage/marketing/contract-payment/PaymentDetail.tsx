import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCreditCard,
  FaFileContract,
  FaBuilding,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/libs/helper/helper";
import { useAppDispatch } from "@/libs/stores";
import { getContractPaymentDetail } from "@/libs/stores/contractPaymentManager/thunk";
import { useContractPayment } from "@/libs/hooks/useContractPayment";
import { Loader2 } from "lucide-react";

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string | null;
  showPayNowButton?: boolean;
  onPayNow?: (paymentId: string) => void;
  isPaymentLoading?: boolean;
}

const CONTRACT_PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  CHECK: "Check",
  CREDIT_CARD: "Credit Card",
};

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  OVERDUE: "bg-red-100 text-red-800 border-red-200",
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  BANK_TRANSFER: "bg-blue-100 text-blue-800 border-blue-200",
  CASH: "bg-green-100 text-green-800 border-green-200",
  CREDIT_CARD: "bg-purple-100 text-purple-800 border-purple-200",
  CHECK: "bg-orange-100 text-orange-800 border-orange-200",
};

function PaymentDetailModal({
  isOpen,
  onClose,
  paymentId,
  showPayNowButton = false,
  onPayNow,
  isPaymentLoading = false,
}: PaymentDetailModalProps) {
  const dispatch = useAppDispatch();
  const { contractPaymentDetail, detailLoading } = useContractPayment();

  useEffect(() => {
    if (isOpen && paymentId) {
      dispatch(getContractPaymentDetail(paymentId));
    }
  }, [dispatch, isOpen, paymentId]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaMoneyBillWave className="h-5 w-5 text-primary" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        {detailLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading payment details...</span>
          </div>
        ) : contractPaymentDetail ? (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {/* Payment Status and Amount */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                  <p className="text-sm text-gray-600">Payment ID: {contractPaymentDetail.id}</p>
                </div>
                <Badge
                  className={`border text-sm font-medium px-3 py-1 ${
                    STATUS_COLORS[contractPaymentDetail.status] || ""
                  }`}
                >
                  {CONTRACT_PAYMENT_STATUS_LABELS[contractPaymentDetail.status] ||
                    contractPaymentDetail.status}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(contractPaymentDetail.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Installment Percentage</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {contractPaymentDetail.installment_percentage}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contract Information */}
            <motion.div className="bg-white border rounded-lg p-6" variants={itemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <FaFileContract className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Contract Information</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Contract Number</p>
                  <p className="font-medium text-gray-900">
                    {contractPaymentDetail.contract_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Title</p>
                  <p className="font-medium text-gray-900">
                    {contractPaymentDetail.contract_title}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Brand Information */}
            <motion.div className="bg-white border rounded-lg p-6" variants={itemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <FaBuilding className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Brand Information</h3>
              </div>
              <div>
                <p className="text-sm text-gray-600">Brand Name</p>
                <p className="font-medium text-gray-900">{contractPaymentDetail.brand_name}</p>
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div className="bg-white border rounded-lg p-6" variants={itemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <Badge
                    className={`border text-sm font-medium px-3 py-1 mt-1 ${
                      PAYMENT_METHOD_COLORS[contractPaymentDetail.payment_method] || ""
                    }`}
                  >
                    {PAYMENT_METHOD_LABELS[contractPaymentDetail.payment_method] ||
                      contractPaymentDetail.payment_method}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FaCalendarAlt className="h-4 w-4 text-gray-500" />
                    <p className="font-medium text-gray-900">
                      {formatDate(contractPaymentDetail.due_date)}
                    </p>
                  </div>
                </div>
              </div>
              {contractPaymentDetail.note && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Note</p>
                  <p className="font-medium text-gray-900 bg-gray-50 rounded-lg p-3 mt-1">
                    {contractPaymentDetail.note}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Timeline Information */}
            <motion.div className="bg-white border rounded-lg p-6" variants={itemVariants}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Created At</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(contractPaymentDetail.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(contractPaymentDetail.updated_at)}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Payment details not found</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          {showPayNowButton && contractPaymentDetail?.status === "PENDING" && onPayNow && (
            <Button
              onClick={() => onPayNow(contractPaymentDetail.id)}
              className="bg-primary hover:bg-primary/90"
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDetailModal;
