import React from "react";
import type { SaleAnalyticDetailData } from "@/libs/types/sale-analytic-detail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SaleAnalyticDetailData | null;
  type?:
    | "total_revenue_modal"
    | "limited_product_revenue_net_modal"
    | "limited_product_revenue_gross_modal"
    | "standard_product_revenue"
    | "total_refund_modal";
}

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data, type }) => {
  if (!data) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800 border border-green-700/20";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border border-yellow-700/20";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-700/20";
      case "delivered":
      case "received":
        return "bg-green-100 text-green-800 border border-green-700/20 ";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-700/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Order Information */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Order Information
            </h3>
            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Order ID</label>
                <p className="text-sm font-semibold text-gray-900">{data.id}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Order Type</label>
                <p className="text-sm font-semibold text-gray-900">{data.order_type}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Status</label>
                <div className="flex">
                  <div
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(data.status)}`}
                  >
                    {data.status}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-medium">Source</label>
                <p className="text-sm font-semibold text-gray-900">{data.source}</p>
              </div>
            </div>
          </section>

          {/* Customer Information */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Customer Information
            </h3>
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-500 font-medium">Customer ID</label>
                <p className="text-sm font-semibold text-gray-900">{data.customer_id}</p>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-500 font-medium">Customer Name</label>
                <p className="text-sm font-semibold text-gray-900">{data.customer_name}</p>
              </div>
              <div className="border-t pt-4">
                <label className="text-xs text-gray-500 font-medium">Email</label>
                <p className="text-sm text-gray-900 mt-1">{data.customer_email}</p>
              </div>
            </div>
          </section>

          {/* Financial Information */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Financial Information
            </h3>
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-600 font-medium">Total Amount</label>
                  <p className="text-lg font-bold text-gray-900">
                    {convertNumberToCurrency(String(data.total_amount))}
                  </p>
                </div>
                <div>
                  {data.order_type === "LIMITED" &&
                    !["total_revenue_modal", "limited_product_revenue_gross_modal"].includes(
                      type as string,
                    ) && (
                      <div>
                        <div className="flex items-center justify-between py-2">
                          <label className="text-sm text-gray-600 ">
                            Brand Revenue Share ({(1 - data.kol_percent / 100) * 100}%)
                          </label>
                          <p
                            className={`text-sm ${data.order_type === "LIMITED" ? "text-red-600" : ""}`}
                          >
                            {data.order_type === "LIMITED"
                              ? `- ${convertNumberToCurrency(String((1 - data.kol_percent / 100) * data.total_amount))}`
                              : ""}
                          </p>
                        </div>
                        <div className="border-t border-gray-200 flex items-center justify-between pt-2">
                          <label className="text-sm text-gray-600">
                            System Revenue Share ({data.kol_percent}%)
                          </label>
                          <p className="text-sm">
                            {convertNumberToCurrency(
                              String((data.kol_percent / 100) * data.total_amount),
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {!["total_revenue_modal", "limited_product_revenue_gross_modal"].includes(
                  type as string,
                ) && (
                  <div>
                    <div className="flex items-center justify-between pt-2">
                      <label className="text-sm text-gray-600 ">Shipping Fee</label>
                      <p
                        className={`text-sm ${data.order_type === "LIMITED" && data.shipping_fee > 0 ? "text-red-600" : ""}`}
                      >
                        {data.order_type === "LIMITED" && data.shipping_fee > 0
                          ? `- ${convertNumberToCurrency(String(data.shipping_fee))}`
                          : data.shipping_fee > 0 && data.order_type === "STANDARD"
                            ? "Paid by customer"
                            : "Customer pick up at store"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!["total_revenue_modal", "limited_product_revenue_gross_modal"].includes(
                type as string,
              ) && (
                <div>
                  <div className=" border-t border-gray-200 pt-2 flex items-center justify-between">
                    <label className="text-sm text-gray-600 font-medium">Net Amount</label>
                    <p
                      className={`text-lg font-bold ${data.net_amount < 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {convertNumberToCurrency(String(data.net_amount))}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Payment Transaction Information */}
          {data.payment_transaction && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Payment Transaction
              </h3>
              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Transaction ID</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.payment_transaction.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Reference Type</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.payment_transaction.reference_type}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Payment Method</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {data.payment_transaction.method}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Amount</label>
                  <p className="text-sm font-semibold text-gray-900">
                    {convertNumberToCurrency(String(data.payment_transaction.amount))}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Status</label>
                  <div className="flex">
                    <div
                      className={` px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(data.payment_transaction.status)}`}
                    >
                      {data.payment_transaction.status}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium">Date</label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(data.payment_transaction.transaction_date)}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Created Date
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-900">{formatDateTime(data.created_at)}</p>
            </div>
          </section>

          {/* Close Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={onClose} className="px-6">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
