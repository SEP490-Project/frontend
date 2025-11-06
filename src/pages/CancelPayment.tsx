import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimesCircle, FaHome, FaReceipt, FaRedo, FaInfoCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CancelPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get payment details from URL params
  const orderCode = searchParams.get("orderCode");
  const amount = searchParams.get("amount");
  const description = searchParams.get("description");
  const reason = searchParams.get("reason") || "Payment was cancelled by user";

  useEffect(() => {
    // Optional: Log cancelled payment or send analytics
    console.log("Payment cancelled", { orderCode, amount, description, reason });
  }, [orderCode, amount, description, reason]);

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "N/A";
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewPayments = () => {
    navigate("/manager/brand/contract-payment");
  };

  const handleRetryPayment = () => {
    navigate("/manager/brand/contract-payment");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            {/* Header Section */}
            <motion.div
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 text-center"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimesCircle className="w-10 h-10" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
              <p className="text-red-100 text-lg">Your contract payment has been cancelled</p>
            </motion.div>

            {/* Payment Details Section */}
            <motion.div className="p-8 space-y-6" variants={itemVariants}>
              <div className="border-l-4 border-red-500 pl-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {orderCode && (
                    <div>
                      <span className="font-medium text-gray-600">Order Code:</span>
                      <div className="font-mono text-lg text-gray-900">{orderCode}</div>
                    </div>
                  )}
                  {amount && (
                    <div>
                      <span className="font-medium text-gray-600">Cancelled Amount:</span>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(amount)}
                      </div>
                    </div>
                  )}
                  {description && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-600">Description:</span>
                      <div className="text-gray-900">{description}</div>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Cancellation Date:</span>
                    <div className="text-gray-900">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <div className="inline-flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 font-medium">Cancelled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Message */}
              <motion.div
                className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                variants={itemVariants}
              >
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Payment Was Cancelled</h3>
                    <p className="text-orange-700 text-sm mt-1">
                      {reason}. No charges have been made to your account. You can retry the payment
                      at any time.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* What's Next Section */}
              <motion.div
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                variants={itemVariants}
              >
                <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• You can retry the payment using the "Retry Payment" button below</li>
                  <li>• Check your payment details and try a different payment method</li>
                  <li>• Contact support if you continue to experience issues</li>
                  <li>• The payment can be completed later from your dashboard</li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div className="flex flex-col sm:flex-row gap-3 pt-4" variants={itemVariants}>
                <Button
                  onClick={handleRetryPayment}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <FaRedo className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
                <Button onClick={handleViewPayments} variant="outline" size="lg" className="flex-1">
                  <FaReceipt className="w-4 h-4 mr-2" />
                  View Payments
                </Button>
                <Button onClick={handleGoHome} variant="outline" size="lg" className="flex-1">
                  <FaHome className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </motion.div>

              {/* Support Information */}
              <motion.div className="bg-gray-50 rounded-lg p-4 text-center" variants={itemVariants}>
                <p className="text-gray-600 text-sm">
                  Need help with your payment? Our support team is available 24/7 to assist you. You
                  can also find answers in our FAQ section or payment troubleshooting guide.
                </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CancelPayment;
