import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaCopy, FaCreditCard, FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    bin?: string;
    accountNumber?: string;
    accountName?: string;
    currency?: string;
    paymentLinkId?: string;
    amount?: number;
    description?: string;
    orderCode?: number;
    expiredAt?: number;
    status?: string;
    checkoutUrl?: string;
    qrCode?: string;
  } | null;
}

function PaymentModal({ isOpen, onClose, paymentData }: PaymentModalProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const formatExpiryDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("vi-VN");
  };

  //   const handleCopyQR = () => {
  //     if (paymentData?.qrCode) {
  //       navigator.clipboard.writeText(paymentData.qrCode);
  //       toast.success("QR code copied to clipboard!");
  //     }
  //   };

  const handleCopyOrderCode = () => {
    if (paymentData?.orderCode) {
      navigator.clipboard.writeText(paymentData.orderCode.toString());
      toast.success("Order code copied!");
    }
  };

  const handleCheckout = () => {
    if (paymentData?.checkoutUrl) {
      window.open(paymentData.checkoutUrl, "_blank");
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!paymentData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaCreditCard className="h-5 w-5 text-primary" />
            Payment Information
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
          {/* Payment Status and Amount */}
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                <p className="text-sm text-gray-600">Order Code: {paymentData.orderCode}</p>
              </div>
              <Badge
                className={`border text-sm font-medium px-3 py-1 ${
                  paymentData.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
                }`}
              >
                {paymentData.status}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Payment Amount</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(paymentData.amount || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-xl font-semibold text-gray-900">{paymentData.description}</p>
              </div>
            </div>
          </motion.div>

          {/* QR Code Section */}
          {/* <motion.div className="bg-white border rounded-lg p-6" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <FaQrcode className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment QR Code</h3>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaQrcode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Scan QR code to pay</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Use your banking app or e-wallet
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyQR}
                className="flex items-center gap-2"
              >
                <FaCopy className="h-4 w-4" />
                Copy QR Code
              </Button>
            </div>
          </motion.div> */}

          {/* Account Information */}
          <motion.div className="bg-white border rounded-lg p-6" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <FaCreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium text-gray-900">{paymentData.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-medium text-gray-900">{paymentData.accountName}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">BIN Code</p>
                  <p className="font-medium text-gray-900">{paymentData.bin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-medium text-gray-900">{paymentData.currency}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Details */}
          <motion.div className="bg-white border rounded-lg p-6" variants={itemVariants}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Code</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{paymentData.orderCode}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyOrderCode}
                    className="h-6 w-6 p-0"
                  >
                    <FaCopy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {paymentData.expiredAt && (
                <div>
                  <p className="text-gray-600">Expires At</p>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-gray-500" />
                    <p className="font-medium text-gray-900">
                      {formatExpiryDate(paymentData.expiredAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {paymentData.paymentLinkId && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Payment Link ID</p>
                <p className="text-xs font-mono text-gray-900 bg-gray-50 rounded p-2 break-all">
                  {paymentData.paymentLinkId}
                </p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div className="flex gap-3" variants={itemVariants}>
            <Button
              onClick={handleCheckout}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <FaExternalLinkAlt className="h-4 w-4 mr-2" />
              Open Payment Page
            </Button>
            <Button variant="outline" onClick={onClose} size="lg">
              Close
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentModal;
