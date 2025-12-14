import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TransactionData } from "@/libs/types/transaction";
import { format } from "date-fns";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import image from "@/assets/images/beauty-login-banner.jpg";

interface TransactionDetailsProps {
  transaction: TransactionData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  open,
  onOpenChange,
  loading,
}) => {
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      EXPIRED: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    };

    return <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  const getMethodBadge = (method: string) => {
    const methodColors: Record<string, string> = {
      BANK_TRANSFER: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      CREDIT_CARD: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
      E_WALLET: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
      PAYOS: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    };

    return (
      <Badge className={methodColors[method] || "bg-gray-100 text-gray-800"}>
        {method?.replace(/_/g, " ")}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Transaction Details</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading transaction details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!transaction) {
    return null;
  }

  const referenceInfo = transaction.reference_info;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction ID & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Transaction ID</label>
              <p className="text-base font-mono mt-1">{transaction.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">{getStatusBadge(transaction.status)}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Transaction Date</label>
              <p className="text-base mt-1">{formatDate(transaction.transaction_date)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-base mt-1">{formatDate(transaction.updated_at)}</p>
            </div>
          </div>

          {/* Customer Information */}
          {referenceInfo?.user_info && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-base mt-1">{referenceInfo.user_info.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-base mt-1">{referenceInfo.user_info.phone_number}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-base mt-1">{referenceInfo.user_info.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Bank Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bank Name</label>
                      <p className="text-base mt-1">
                        {referenceInfo?.bank_info.bank_name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Account Holder</label>
                      <p className="text-base mt-1">
                        {referenceInfo?.bank_info.bank_account_holder || "Unknown"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Account Number</label>
                      <p className="text-base font-mono mt-1">
                        {referenceInfo?.bank_info.bank_account || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Order ID</label>
                <p className="text-base font-mono mt-1">{transaction.reference_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-xl font-bold text-primary mt-1">
                  {convertNumberToCurrency(transaction.amount)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Order Type</label>
                <div className="mt-1">
                  {transaction.reference_type === "ORDER" ? (
                    <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200">
                      ORDER
                    </Badge>
                  ) : transaction.reference_type === "PREORDER" ? (
                    <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200">
                      PREORDER
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      {transaction.reference_type}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                <div className="mt-1">{getMethodBadge(transaction.method)}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {referenceInfo?.order_items && referenceInfo.order_items.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {referenceInfo.order_items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center ">
                        <div className="flex items-center">
                          <img
                            src={item?.product_image_url || image}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded-md mr-4 float-left"
                          />
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Unit Price: {convertNumberToCurrency(item.unit_price.toString())}
                          </p>
                          <p className="font-semibold text-primary">
                            {convertNumberToCurrency(item.subtotal.toString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Product Variant Info (for Preorders) */}
          {referenceInfo?.product_variant_info && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={image} // Placeholder image
                        alt={referenceInfo.product_variant_info.product_name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <p className="font-medium">
                          {referenceInfo.product_variant_info.product_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {referenceInfo.product_variant_info.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Unit Price:{" "}
                        {convertNumberToCurrency(
                          referenceInfo.product_variant_info.unit_price.toString(),
                        )}
                      </p>
                      <p className="text-xl font-bold text-primary mt-1">
                        {convertNumberToCurrency(
                          referenceInfo.product_variant_info.total_amount.toString(),
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;
