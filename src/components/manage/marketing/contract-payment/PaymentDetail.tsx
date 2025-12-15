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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/libs/hooks/useAuth";

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string | null;
  showPayNowButton?: boolean;
  onPayNow?: (paymentId: string) => void;
  isPaymentLoading?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
};

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  OVERDUE: "bg-red-100 text-red-800 border-red-200",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  CHECK: "Check",
  CREDIT_CARD: "Credit Card",
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
  const navigate = useNavigate();
  const { role } = useAuth();
  const { contractPaymentDetail, detailLoading } = useContractPayment();

  useEffect(() => {
    if (isOpen && paymentId) {
      dispatch(getContractPaymentDetail(paymentId));
    }
  }, [dispatch, isOpen, paymentId]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const goToContract = () => {
    if (!contractPaymentDetail) return;

    if (role === "BRAND_PARTNER") {
      navigate(`/manage/brand/contracts/${contractPaymentDetail.contract_id}`);
    }

    if (role === "MARKETING_STAFF") {
      navigate(`/manage/marketing/contracts/${contractPaymentDetail.contract_id}`);
    }
  };

  const goToBrand = () => {
    if (role === "MARKETING_STAFF" && contractPaymentDetail?.brand_id) {
      navigate(`/manage/marketing/brands/${contractPaymentDetail.brand_id}`);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaMoneyBillWave className="text-primary" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        {detailLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-primary" />
          </div>
        ) : !contractPaymentDetail ? (
          <p className="text-center text-gray-500 py-10">Payment not found</p>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {/* Payment summary */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Payment Information</h3>
                <Badge className={`border ${STATUS_COLORS[contractPaymentDetail.status]}`}>
                  {STATUS_LABELS[contractPaymentDetail.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(contractPaymentDetail.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Installment</p>
                  <p className="text-xl font-semibold">
                    {contractPaymentDetail.installment_percentage}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contract */}
            <motion.div variants={itemVariants} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaFileContract className="text-blue-600" />
                  <h3 className="font-semibold text-lg">Contract</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToContract}
                  className="text-primary hover:text-primary"
                >
                  View Contract
                </Button>
              </div>

              <div>
                <p className="font-medium">{contractPaymentDetail.contract_title}</p>
                <p className="text-sm text-gray-600">{contractPaymentDetail.contract_number}</p>
              </div>
            </motion.div>

            {/* Brand */}
            <motion.div variants={itemVariants} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-green-600" />
                  <h3 className="font-semibold text-lg">Brand</h3>
                </div>
                {role === "MARKETING_STAFF" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToBrand}
                    className="text-primary hover:text-primary"
                  >
                    View Brand
                  </Button>
                )}
              </div>

              <p className="font-medium">{contractPaymentDetail.brand_name}</p>
            </motion.div>

            {/* Payment details */}
            <motion.div variants={itemVariants} className="border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-purple-600" />
                <h3 className="font-semibold text-lg">Payment Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <Badge
                    className={`mt-1 border ${
                      PAYMENT_METHOD_COLORS[contractPaymentDetail.payment_method]
                    }`}
                  >
                    {PAYMENT_METHOD_LABELS[contractPaymentDetail.payment_method]}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Due date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FaCalendarAlt className="text-gray-500" />
                    <span className="font-medium">
                      {formatDate(contractPaymentDetail.due_date)}
                    </span>
                  </div>
                </div>
              </div>

              {contractPaymentDetail.note && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Note</p>
                  <p className="bg-gray-50 rounded-md p-3 text-sm">{contractPaymentDetail.note}</p>
                </div>
              )}
            </motion.div>

            {/* Timeline */}
            <motion.div variants={itemVariants} className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">Timeline</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium">{formatDate(contractPaymentDetail.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Updated</p>
                  <p className="font-medium">{formatDate(contractPaymentDetail.updated_at)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          {showPayNowButton && contractPaymentDetail?.status === "PENDING" && onPayNow && (
            <Button onClick={() => onPayNow(contractPaymentDetail.id)} disabled={isPaymentLoading}>
              {isPaymentLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                "Pay now"
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
