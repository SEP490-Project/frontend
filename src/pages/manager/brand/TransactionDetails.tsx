import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { TransactionData } from "@/libs/types/transaction";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELLED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    };

    return <Badge className={statusColors[status]}>{status}</Badge>;
  };

  const formatCurrency = (amount: string) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm:ss");
    } catch {
      return dateString;
    }
  };

  if (loading || !transaction) return null;

  const ref = transaction.reference_info;
  const hasBrandInfo = !!ref?.brand_info;
  const hasBankInfo = !!ref?.bank_info;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              {getStatusBadge(transaction.status)}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(transaction.amount)}</p>
            </div>
          </div>

          <Separator />

          {/* Contract Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contract Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Contract Number</label>
                <p className="font-medium mt-1">{ref?.contract_number}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Type</label>
                <div className="mt-1">
                  <Badge
                    className={
                      ref?.is_deposit
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-indigo-100 text-indigo-800"
                    }
                  >
                    {ref?.is_deposit ? "Deposit" : "Payment"}
                  </Badge>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm text-gray-500">Contract</label>
                <div className="mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/manage/brand/contracts/${ref?.contract_id}`)}
                  >
                    View Contract
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Brand Info */}
          {hasBrandInfo && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Brand Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Brand Name</label>
                    <p className="mt-1 font-medium">{ref?.brand_info?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Representative</label>
                    <p className="mt-1">{ref?.brand_info?.representative_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="mt-1">{ref?.brand_info?.contact_email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="mt-1">{ref?.brand_info?.contact_phone}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Bank Info */}
          {hasBankInfo && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Bank Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Bank Name</label>
                    <p className="mt-1">{ref?.bank_info?.bank_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Holder</label>
                    <p className="mt-1">{ref?.bank_info?.bank_account_holder}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">Account Number</label>
                    <p className="mt-1 font-mono">{ref?.bank_info?.bank_account}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Gateway */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Gateway</h3>
            <div className="flex items-center justify-between">
              <Badge>{transaction.method}</Badge>

              {transaction.gateway_ref && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(transaction.gateway_ref, "_blank")}
                >
                  Open Payment Link
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Transaction Date</label>
              <p className="mt-1">{formatDate(transaction.transaction_date)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Updated</label>
              <p className="mt-1">{formatDate(transaction.updated_at)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;
