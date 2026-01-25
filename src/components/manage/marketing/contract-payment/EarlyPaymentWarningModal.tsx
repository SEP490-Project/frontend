import { motion } from "framer-motion";
import { FaExclamationTriangle, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/libs/helper/helper";

interface EarlyPaymentWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentData: {
    amount: number;
    contractNumber: string;
    dueDate: string;
    installmentPercentage?: number;
  } | null;
  isLoading?: boolean;
}

function EarlyPaymentWarningModal({
  isOpen,
  onClose,
  onConfirm,
  paymentData,
  isLoading = false,
}: EarlyPaymentWarningModalProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!paymentData) return null;

  const daysUntilDue = getDaysUntilDue(paymentData.dueDate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <FaExclamationTriangle className="h-5 w-5" />
            Early Payment Warning
          </DialogTitle>
        </DialogHeader>

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
          {/* Warning Message */}
          <motion.div
            className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200"
            variants={itemVariants}
          >
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">
                  You are making an early payment
                </h3>
                <p className="text-orange-700 text-sm">
                  This payment is not due for another{" "}
                  <span className="font-semibold">{daysUntilDue} days</span>. Are you sure you want
                  to proceed with the payment now?
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div className="bg-white border rounded-lg p-4" variants={itemVariants}>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaMoneyBillWave className="h-4 w-4 text-green-600" />
              Payment Details
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Contract Number</p>
                  <p className="font-medium text-gray-900">{paymentData.contractNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Amount</p>
                  <p className="font-medium text-primary text-lg">
                    {formatCurrency(paymentData.amount)}
                  </p>
                </div>
              </div>
              {paymentData.installmentPercentage && (
                <div>
                  <p className="text-sm text-gray-600">Installment Percentage</p>
                  <p className="font-medium text-gray-900">{paymentData.installmentPercentage}%</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FaCalendarAlt className="h-3 w-3" />
                  Original Due Date
                </p>
                <p className="font-medium text-gray-900">{formatDate(paymentData.dueDate)}</p>
              </div>
            </div>
          </motion.div>

          {/* Notice */}
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            variants={itemVariants}
          >
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">Note:</span> Early payments may affect your cash flow
              and payment schedule. Please ensure this payment aligns with your financial planning.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div className="flex gap-3 pt-2" variants={itemVariants}>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Processing...
                </>
              ) : (
                "Continue with Early Payment"
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default EarlyPaymentWarningModal;
