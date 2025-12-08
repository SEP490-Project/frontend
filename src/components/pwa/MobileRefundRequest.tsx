import React, { useState } from "react";
import type { OrderData } from "@/libs/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/libs/stores";
import { approveRefundAnOrderThunk, refundAPreOrderThunk } from "@/libs/stores/orderManager/thunk";
import MobileFileUploader from "./MobileFileUploader";
import { toast } from "sonner";
import { FaXmark as FaTimes, FaImage, FaSpinner, FaMoneyBillWave } from "react-icons/fa6";

interface MobileRefundRequestProps {
  order: OrderData;
  onSuccess: () => void;
  onCancel: () => void;
}

const MobileRefundRequest: React.FC<MobileRefundRequestProps> = ({
  order,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const [reason, setReason] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleFilesCapture = (files: File[]) => {
    setProofFiles(files);
  };

  const isPreOrder = () => {
    return order.order_type === "PRE_ORDER";
  };

  const handleApproveRefund = async () => {
    if (!order) return;

    if (proofFiles.length === 0) {
      toast.error("Please upload proof image");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      proofFiles.forEach((file) => {
        formData.append("file", file);
      });

      formData.append("isApproved", "true");

      if (reason.trim()) {
        formData.append("reason", reason.trim());
      }

      const isPreOrderType = isPreOrder();

      if (isPreOrderType) {
        await dispatch(
          refundAPreOrderThunk({
            id: order.id,
            file: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(
          approveRefundAnOrderThunk({
            orderId: order.id,
            file: formData,
          }),
        ).unwrap();
      }

      toast.success("Refund request approved successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to process refund request", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaMoneyBillWave className="w-4 h-4 text-blue-600" />
            Refund Request
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm text-blue-800">
            This order has a refund request that needs to be processed.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Order Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Order ID:</span>
              <div className="font-mono">#{order.id.slice(0, 8)}</div>
            </div>
            <div>
              <span className="text-gray-600">Customer:</span>
              <div className="font-medium">{order.full_name}</div>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <div>{order.phone_number}</div>
            </div>
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <div className="font-semibold text-green-600">
                {formatCurrency(order.total_amount)}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
              REFUND REQUEST
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaImage className="w-4 h-4" />
            Upload Proof
            <span className="text-red-500 text-sm">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Please provide photo proof for the refund decision (Max 10MB).
            </div>

            <MobileFileUploader
              accept="image/*"
              multiple={true}
              maxFiles={1}
              maxSize={10}
              allowedTypes={["jpg", "jpeg", "png", "webp"]}
              title="Upload Proof"
              onFilesChange={handleFilesCapture}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Notes <span className="text-xs text-gray-500 ml-1">(Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="Enter notes about this refund decision (optional)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="text-xs text-gray-500 mt-2">
            You can provide additional information about your decision.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full"
        >
          <FaTimes className="w-4 h-4 mr-2" />
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleApproveRefund}
          disabled={proofFiles.length === 0 || isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FaMoneyBillWave className="w-4 h-4 mr-2" />
              Approve Refund
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileRefundRequest;
