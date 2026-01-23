import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCreditCard,
  FaFileContract,
  FaBuilding,
  FaChartLine,
  FaLayerGroup,
  FaHandHoldingUsd,
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
import type { AffiliateBreakdown, CoProducingBreakdown } from "@/libs/types/contract-payments";

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

  const isAffiliateBreakdown = (breakdown: any): breakdown is AffiliateBreakdown => {
    return breakdown && "total_clicks" in breakdown && "breakdown" in breakdown;
  };

  const isCoProducingBreakdown = (breakdown: any): breakdown is CoProducingBreakdown => {
    return breakdown && "total_revenue" in breakdown && "revenue_breakdown" in breakdown;
  };

  const hasPerformanceBreakdown =
    contractPaymentDetail &&
    contractPaymentDetail.breakdown &&
    (contractPaymentDetail.contract_type === "AFFILIATE" ||
      contractPaymentDetail.contract_type === "CO_PRODUCING");

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
          {/* Contract Payment Status Badge */}
          {contractPaymentDetail && (
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[contractPaymentDetail.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
              >
                {STATUS_LABELS[contractPaymentDetail.status] || contractPaymentDetail.status}
              </span>
            </div>
          )}
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
              <div className="mb-4">
                <h3 className="font-semibold text-lg">Payment Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(Math.abs(contractPaymentDetail.amount))}
                  </p>
                  {(contractPaymentDetail.base_amount !== undefined ||
                    contractPaymentDetail.performance_amount !== undefined) && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-2 space-y-1"
                    >
                      {contractPaymentDetail.base_amount !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaLayerGroup className="text-xs" />
                          <span>Base: {formatCurrency(contractPaymentDetail.base_amount)}</span>
                        </div>
                      )}
                      {contractPaymentDetail.performance_amount !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaChartLine className="text-xs" />
                          <span>
                            Performance: {formatCurrency(contractPaymentDetail.performance_amount)}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Installment</p>
                  <p className="text-xl font-semibold">
                    {contractPaymentDetail.installment_percentage}%
                  </p>
                  {contractPaymentDetail.is_deposit && (
                    <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                      Deposit Payment
                    </Badge>
                  )}
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
                  <p className="bg-gray-50 rounded-md p-3 text-sm whitespace-pre-wrap">
                    {contractPaymentDetail.note}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Performance Breakdown - AFFILIATE */}
            <AnimatePresence>
              {hasPerformanceBreakdown &&
                contractPaymentDetail.contract_type === "AFFILIATE" &&
                isAffiliateBreakdown(contractPaymentDetail.breakdown) && (
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border rounded-lg p-6 bg-gradient-to-br from-pink-50 to-purple-50"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <FaChartLine className="text-pink-600" />
                      <h3 className="font-semibold text-lg">Affiliate Performance Breakdown</h3>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <p className="text-xs text-gray-600 mb-1">Total Clicks</p>
                        <p className="text-xl font-bold text-pink-600">
                          {contractPaymentDetail.breakdown.total_clicks.toLocaleString()}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <p className="text-xs text-gray-600 mb-1">Gross Payment</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(contractPaymentDetail.breakdown.gross_payment)}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <p className="text-xs text-gray-600 mb-1">Tax Amount</p>
                        <p className="text-lg font-semibold text-orange-600">
                          {formatCurrency(contractPaymentDetail.breakdown.tax_amount)}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <p className="text-xs text-gray-600 mb-1">Net Payment</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(contractPaymentDetail.breakdown.net_payment)}
                        </p>
                      </motion.div>
                    </div>

                    {/* Tiered Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">
                        Tiered Payment Structure
                      </h4>
                      {contractPaymentDetail.breakdown.breakdown.map((tier, idx) => (
                        <motion.div
                          key={tier.level}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-pink-400"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                                Level {tier.level}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Multiplier: {tier.multiplier}x
                              </span>
                            </div>
                            <span className="font-bold text-pink-600">
                              {formatCurrency(tier.tier_payment)}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Clicks</p>
                              <p className="font-semibold">
                                {tier.clicks_in_tier.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Rate/Click</p>
                              <p className="font-semibold">{formatCurrency(tier.rate_per_click)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tier Total</p>
                              <p className="font-semibold text-pink-600">
                                {formatCurrency(tier.tier_payment)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Period */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 pt-4 border-t text-xs text-gray-600"
                    >
                      <div className="flex justify-between">
                        <span>
                          Period: {formatDate(contractPaymentDetail.breakdown.period_start)} -{" "}
                          {formatDate(contractPaymentDetail.breakdown.period_end)}
                        </span>
                        <span>
                          Calculated: {formatDate(contractPaymentDetail.breakdown.calculated_at)}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Performance Breakdown - CO_PRODUCING */}
            <AnimatePresence>
              {hasPerformanceBreakdown &&
                contractPaymentDetail.contract_type === "CO_PRODUCING" &&
                isCoProducingBreakdown(contractPaymentDetail.breakdown) && (
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border rounded-lg p-6 bg-gradient-to-br from-violet-50 to-indigo-50"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <FaHandHoldingUsd className="text-violet-600" />
                      <h3 className="font-semibold text-lg">Co-Producing Revenue Distribution</h3>
                    </div>

                    {/* Revenue Sources */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Revenue Sources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="bg-white rounded-lg p-4 shadow-sm"
                        >
                          <p className="text-xs text-gray-600 mb-1">Pre-Order Revenue</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(
                              contractPaymentDetail.breakdown.revenue_breakdown.preorder_revenue,
                            )}
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 }}
                          className="bg-white rounded-lg p-4 shadow-sm"
                        >
                          <p className="text-xs text-gray-600 mb-1">Order Revenue</p>
                          <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(
                              contractPaymentDetail.breakdown.revenue_breakdown.order_revenue,
                            )}
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white rounded-lg p-4 shadow-sm border-2 border-violet-200"
                        >
                          <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                          <p className="text-xl font-bold text-violet-600">
                            {formatCurrency(contractPaymentDetail.breakdown.total_revenue)}
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Revenue Split */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-gray-700">Revenue Distribution</h4>

                      {/* Company Share */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              Company Share
                            </Badge>
                            <span className="text-sm font-semibold text-gray-700">
                              {contractPaymentDetail.breakdown.company_percent}%
                            </span>
                          </div>
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(contractPaymentDetail.breakdown.company_share)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${contractPaymentDetail.breakdown.company_percent}%`,
                            }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="bg-blue-500 h-2 rounded-full"
                          />
                        </div>
                      </motion.div>

                      {/* Brand Share */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-white rounded-lg p-4 shadow-sm border-2 border-violet-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-violet-100 text-violet-800 border-violet-200">
                              Brand/KOL Share
                            </Badge>
                            <span className="text-sm font-semibold text-gray-700">
                              {contractPaymentDetail.breakdown.brand_percent}%
                            </span>
                          </div>
                          <span className="text-xl font-bold text-violet-600">
                            {formatCurrency(contractPaymentDetail.breakdown.brand_share)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${contractPaymentDetail.breakdown.brand_percent}%`,
                            }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-violet-500 h-2 rounded-full"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Period */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 pt-4 border-t text-xs text-gray-600"
                    >
                      <div className="flex justify-between">
                        <span>
                          Period: {formatDate(contractPaymentDetail.breakdown.period_start)} -{" "}
                          {formatDate(contractPaymentDetail.breakdown.period_end)}
                        </span>
                        <span>
                          Calculated: {formatDate(contractPaymentDetail.breakdown.calculated_at)}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>

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
          {showPayNowButton &&
            contractPaymentDetail?.pay_now === true &&
            contractPaymentDetail?.status === "PENDING" &&
            onPayNow && (
              <Button
                onClick={() => onPayNow(contractPaymentDetail.id)}
                disabled={isPaymentLoading}
              >
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
