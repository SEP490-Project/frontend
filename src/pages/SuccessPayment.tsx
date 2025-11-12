import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaHome, FaReceipt, FaPrint } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detectedAmount, setDetectedAmount] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const code = searchParams.get("code");
  const txId = searchParams.get("id");
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");
  const amountParam = searchParams.get("amount");

  useEffect(() => {
    let amt: number | null = null;
    if (amountParam) {
      const n = parseFloat(amountParam);
      if (!isNaN(n)) amt = n;
    }

    if (amt === null) {
      try {
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
  }, [code, txId, status, orderCode, amountParam]);

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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

  const printStyles = `
  @page {
    size: 100mm 150mm;
    margin: 0;
  }

  @media print {
    body {
      background: white !important;
      -webkit-print-color-adjust: exact !important; /* giữ màu */
      print-color-adjust: exact !important;
    }

    body * {
      visibility: hidden;
    }

    .receipt-root, .receipt-root * {
      visibility: visible;
    }

    .receipt-root {
      width: 80mm;
      margin: 0 auto;
      position: relative;
      left: 0;
      right: 0;
      top: 0;
      font-family: 'Courier New', monospace;
      background: white !important;
      color: black !important;
      box-shadow: none !important;
      border: none !important;
    }

    .no-print, button {
      display: none !important;
    }

    .receipt-root h1, .receipt-root h2, .receipt-root h3 {
      font-size: 14px !important;
      margin: 4px 0;
    }

    .receipt-root p, .receipt-root div, .receipt-root span {
      font-size: 11px !important;
      line-height: 1.3;
    }

    .receipt-root .border-t, .receipt-root .border-b {
      border-color: #000 !important;
    }

    .receipt-root .p-6 {
      padding: 8px !important;
    }
  }
`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <style>{printStyles}</style>
      <motion.div
        className="w-full max-w-2xl receipt-root"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-md border-0 overflow-hidden">
          <CardContent className="p-0 bg-white">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 text-center"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <FaCheckCircle className="w-8 h-8" />
              </motion.div>
              <h1 className="text-2xl font-bold mb-1">
                Payment {status === "PAID" ? "Successful" : "Result"}
              </h1>
              <p className="text-green-100 text-sm">Thank you. This is your payment receipt.</p>
            </motion.div>

            <motion.div className="p-6 space-y-4 text-sm" variants={itemVariants}>
              <div className="text-center font-mono text-lg">RECEIPT</div>

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
                  <div className="text-sm text-gray-900">{status || "-"}</div>
                </div>
              </div>

              <div className="py-2">
                <div className="text-xs text-gray-600">Description</div>
                <div className="text-sm text-gray-900">{description || "Contract Payment"}</div>
              </div>

              <div className="flex justify-between items-end py-3 border-t">
                <div>
                  <div className="text-xs text-gray-600">Paid At</div>
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
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(detectedAmount)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-600">
                Payment gateway response code: <span className="font-mono">{code || "-"}</span>
              </div>

              <div className="text-center text-xs text-gray-500 mt-2">
                This is an electronic receipt. Please keep it for your records.
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4 no-print">
                <Button
                  onClick={() => navigate("/manage/brand/contract-payment")}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <FaReceipt className="w-4 h-4 mr-2" />
                  View all your Transaction
                </Button>
                <Button onClick={handlePrintReceipt} variant="outline" size="sm" className="flex-1">
                  <FaPrint className="w-4 h-4 mr-2" />
                  Print Receipt
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

export default SuccessPayment;
