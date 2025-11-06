import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHome, FaReceipt, FaPrint } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get payment details from URL params
  const orderCode = searchParams.get("orderCode");
  const amount = searchParams.get("amount");
  const description = searchParams.get("description");

  useEffect(() => {
    // Optional: Log successful payment or send analytics
    console.log("Payment successful", { orderCode, amount, description });
  }, [orderCode, amount, description]);

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

  const handlePrintReceipt = () => {
    window.print();
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
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
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <FaCheckCircle className="w-10 h-10" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-green-100 text-lg">
                Your contract payment has been processed successfully
              </p>
            </motion.div>

            {/* Payment Details Section */}
            <motion.div className="p-8 space-y-6" variants={itemVariants}>
              <div className="border-l-4 border-green-500 pl-4">
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
                      <span className="font-medium text-gray-600">Amount Paid:</span>
                      <div className="text-2xl font-bold text-green-600">
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
                    <span className="font-medium text-gray-600">Payment Date:</span>
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
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <motion.div
                className="bg-green-50 border border-green-200 rounded-lg p-4"
                variants={itemVariants}
              >
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800">Payment Processed Successfully</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Your contract payment has been confirmed and processed. You will receive a
                      confirmation email shortly with the payment receipt.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div className="flex flex-col sm:flex-row gap-3 pt-4" variants={itemVariants}>
                <Button
                  onClick={handleViewPayments}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <FaReceipt className="w-4 h-4 mr-2" />
                  View All Payments
                </Button>
                <Button onClick={handlePrintReceipt} variant="outline" size="lg" className="flex-1">
                  <FaPrint className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
                <Button onClick={handleGoHome} variant="outline" size="lg" className="flex-1">
                  <FaHome className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </motion.div>

              {/* Additional Information */}
              <motion.div className="bg-gray-50 rounded-lg p-4 text-center" variants={itemVariants}>
                <p className="text-gray-600 text-sm">
                  If you have any questions about this payment, please contact our support team or
                  check your payment history in the dashboard.
                </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessPayment;
