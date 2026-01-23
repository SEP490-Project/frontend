import React from "react";
import type { SaleAnalyticDetailData } from "@/libs/types/sale-analytic-detail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SaleAnalyticDetailData | null;
}

export const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[50vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Order Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Order ID</label>
                <p className="font-mono text-sm">{data.id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Order Type</label>
                <p className="font-semibold">{data.order_type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <p>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded ${getStatusColor(data.status)}`}
                  >
                    {data.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Source</label>
                <p className="font-semibold">{data.source}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Customer ID</label>
                <p className="font-mono text-sm">{data.customer_id}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Customer Name</label>
                <p className="font-semibold">{data.customer_name}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-sm">{data.customer_email}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Financial Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Total Amount</label>
                <p className="font-bold text-lg">
                  {convertNumberToCurrency(String(data.total_amount))}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Net Amount</label>
                <p
                  className={`font-bold text-lg  ${data.net_amount < 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {convertNumberToCurrency(String(data.net_amount))}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Shipping Fee</label>
                <p className="font-semibold">
                  {convertNumberToCurrency(String(data.shipping_fee))}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">KOL Percent</label>
                <p className="font-semibold">{data.kol_percent}%</p>
              </div>
            </div>
          </div>

          {/* Payment Transaction Information */}
          {data.payment_transaction && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Payment Transaction</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Transaction ID</label>
                  <p className="font-mono text-sm">{data.payment_transaction.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Reference Type</label>
                  <p className="font-semibold">{data.payment_transaction.reference_type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Payment Method</label>
                  <p className="font-semibold">{data.payment_transaction.method}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Amount</label>
                  <p className="font-semibold">
                    {convertNumberToCurrency(String(data.payment_transaction.amount))}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded ${getStatusColor(data.payment_transaction.status)}`}
                    >
                      {data.payment_transaction.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Gateway ID</label>
                  <p className="font-mono text-sm">
                    {data.payment_transaction.gateway_id || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Transaction Date</label>
                  <p className="text-sm">
                    {formatDateTime(data.payment_transaction.transaction_date)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Timestamps</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-600">Created Date</label>
                <p className="text-sm">{formatDateTime(data.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
