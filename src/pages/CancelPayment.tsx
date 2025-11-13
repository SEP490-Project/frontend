import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimesCircle, FaHome, FaRedo, FaReceipt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CancelPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detectedAmount, setDetectedAmount] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const code = searchParams.get("code");
  const txId = searchParams.get("id");
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");
  const amountParam = searchParams.get("amount");
  const reason = searchParams.get("reason") || "Payment was cancelled by user";

  useEffect(() => {
    let amt: number | null = null;
    if (amountParam) {
      const n = parseFloat(amountParam);
      if (!isNaN(n)) amt = n;
    }

    if (amt === null) {
      try {
        // try txId-based
        if (txId) {
          const s = sessionStorage.getItem(`payment_amount_${txId}`);
          if (s) {
            const n = parseFloat(s);
            if (!isNaN(n)) amt = n;
          }
        }
        if (amt === null && orderCode) {
          const s2 =
            sessionStorage.getItem(`payment_amount_${orderCode}`) ||
            sessionStorage.getItem(`payment_order_${orderCode}`);
          if (s2) {
            const n2 = parseFloat(s2);
            if (!isNaN(n2)) amt = n2;
          }
        }
        if (amt === null) {
          const keys = Object.keys(sessionStorage);
          for (const k of keys) {
            if (
              k.includes("payment_amount_") ||
              k.includes("contract_payment_amount_") ||
              k.includes("payment_contractNumber_")
            ) {
              const s = sessionStorage.getItem(k);
              if (s) {
                const n = parseFloat(s);
                if (!isNaN(n)) {
                  amt = n;
                  break;
                }
              }
            }
          }
        }
      } catch {
        // intentionally left blank
      }
    }

    setDetectedAmount(amt);

    try {
      if (txId) {
        const desc = sessionStorage.getItem(`payment_contractNumber_${txId}`);
        if (desc) setDescription(desc);
      }
      if (!description && orderCode) {
        const desc2 = sessionStorage.getItem(`payment_contractNumber_${orderCode}`);
        if (desc2) setDescription(desc2);
      }
    } catch {
      // intentionally left blank
    }
  }, [code, txId, status, orderCode, amountParam, reason]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
        <Card className="shadow-md border-0 overflow-hidden">
          <CardContent className="p-0 bg-white">
            {/* Header Section */}
            <motion.div
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 text-center"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimesCircle className="w-8 h-8" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-1">
                Payment {status === "CANCELLED" ? "Cancelled" : "Failed"}
              </h1>
              <p className="text-red-100 text-sm">
                Payment was not completed. This is your cancellation receipt.
              </p>
            </motion.div>

            <motion.div className="p-6 space-y-4 text-sm" variants={itemVariants}>
              <div className="text-center font-mono text-lg">CANCELLATION RECEIPT</div>

              <div className="border-t border-b py-3">
                <div className="flex justify-between">
                  <div className="text-xs text-gray-600">Order Code</div>
                  <div className="font-mono text-sm text-gray-900">{orderCode || "-"}</div>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-gray-600">Transaction ID</div>
                  <div className="text-sm text-gray-900">{txId || "-"}</div>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-gray-600">Status</div>
                  <div className="text-sm text-gray-900">{status || "CANCELLED"}</div>
                </div>
              </div>

              <div className="py-2">
                <div className="text-xs text-gray-600">Description</div>
                <div className="text-sm text-gray-900">{description || "Contract Payment"}</div>
              </div>

              <div className="py-2">
                <div className="text-xs text-gray-600">Cancellation Reason</div>
                <div className="text-sm text-gray-900">{reason}</div>
              </div>

              <div className="flex justify-between items-end py-3 border-t">
                <div>
                  <div className="text-xs text-gray-600">Cancelled At</div>
                  <div className="text-sm text-gray-900">
                    {new Date().toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">Amount</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(detectedAmount)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600">
                Payment gateway response code: <span className="font-mono">{code || "-"}</span>
              </div>

              <div className="text-center text-xs text-gray-500 mt-2">
                This is an electronic cancellation receipt. No charges have been made to your
                account.
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 no-print">
                <Button
                  onClick={() => navigate("/manage/brand/contract-payment")}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <FaRedo className="w-4 h-4 mr-2" />
                  Retry Payment
                </Button>
                <Button
                  onClick={() => navigate("/manage/brand/transaction-payment")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FaReceipt className="w-4 h-4 mr-2" />
                  View Payments
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FaHome className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CancelPayment;
