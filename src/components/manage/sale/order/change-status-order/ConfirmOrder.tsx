import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Package, AlertCircle, Upload, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { convertNumberToCurrency } from "@/libs/helper/helper";

interface ConfirmOrderProps {
  order: OrderData;
  onConfirm: (payload: { action: "CONFIRM" | "CANCEL"; reason?: string }) => void;
  onCancel: (payload: { reason?: string; file: File }) => void;
}

const ConfirmOrder = ({ order, onConfirm, onCancel }: ConfirmOrderProps) => {
  const [action, setAction] = useState<"CONFIRM" | "CANCEL" | null>(null);
  const [reason, setReason] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!action) return;
    if (action === "CANCEL" && !reason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm({ action, reason: reason.trim() });
      setAction(null);
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }
    if (!selectedFile) {
      alert("Please upload refund proof image");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCancel({ reason: reason.trim(), file: selectedFile });
      setAction(null);
      setReason("");
      handleRemoveFile();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setAction(null);
    setReason("");
    handleRemoveFile();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Confirmation
          </CardTitle>
          <CardDescription>Review and confirm or cancel this paid order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{order.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">{convertNumberToCurrency(String(order.total_amount))}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Delivery Method</p>
              <p className="font-medium">
                {order.is_self_picked_up ? "Self Pick-up" : "Shipping Delivery"}
              </p>
            </div>
          </div>

          <Separator />

          {!action ? (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Action Required</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Please review the order details and choose to confirm or cancel this order.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setAction("CONFIRM")}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Order
                </Button>
                <Button
                  onClick={() => setAction("CANCEL")}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </Button>
              </div>
            </div>
          ) : action === "CONFIRM" ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Confirm Order</p>
                    <p className="text-sm text-green-700 mt-1">
                      The order will be confirmed and proceed to the next stage.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Processing..." : "Confirm"}
                </Button>
                <Button onClick={handleBack} variant="outline" className="flex-1">
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Cancel Order & Process Refund</p>
                    <p className="text-sm text-red-700 mt-1">
                      This order has been paid. Please provide cancellation reason and upload refund
                      proof.
                    </p>
                  </div>
                </div>
              </div>

              {order.bank_account && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Customer Bank Details</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Bank:</span>
                      <span className="ml-2 font-medium">{order.bank_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Account:</span>
                      <span className="ml-2 font-medium">{order.bank_account}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Account Holder:</span>
                      <span className="ml-2 font-medium">{order.bank_account_holder}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reason">Cancellation Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for cancellation..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundProof">Refund Proof (Bank Transfer Screenshot) *</Label>
                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                      id="refundProof"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="refundProof" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg p-4">
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded"
                      />
                    )}
                    <p className="text-sm text-gray-600 mt-2 truncate">{selectedFile.name}</p>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Important:</strong> Make sure to transfer the full amount to the
                  customer's bank account before uploading the proof.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCancelOrder}
                  disabled={isSubmitting || !reason.trim() || !selectedFile}
                  variant="destructive"
                  className="flex-1"
                >
                  {isSubmitting ? "Processing..." : "Submit Cancellation & Refund"}
                </Button>
                <Button onClick={handleBack} variant="outline" className="flex-1">
                  Back
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmOrder;
