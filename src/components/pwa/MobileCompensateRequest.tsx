import React, { useState } from "react";
import type { OrderData } from "@/libs/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/libs/stores";
import { compensateAnOrderThunk, compensateAPreOrderThunk } from "@/libs/stores/orderManager/thunk";
import MobileFileUploader from "./MobileFileUploader";
import { toast } from "sonner";
import {
  FaXmark as FaTimes,
  FaImage,
  FaSpinner,
  FaTriangleExclamation,
  FaCircleCheck,
} from "react-icons/fa6";

interface MobileCompensateRequestProps {
  order: OrderData;
  onSuccess: () => void;
  onCancel: () => void;
}

const MobileCompensateRequest: React.FC<MobileCompensateRequestProps> = ({
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

  const handleCompensateOrder = async (isApproved: boolean) => {
    if (!order) return;

    if (proofFiles.length === 0) {
      toast.error("Please upload proof image/video");
      return;
    }

    if (!isApproved && !reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      proofFiles.forEach((file) => {
        formData.append("file", file);
      });

      formData.append("isApproved", String(isApproved));
      if (reason.trim()) {
        formData.append("reason", reason.trim());
      }

      const isPreOrderType = isPreOrder();

      if (isPreOrderType) {
        // For pre-orders, use pre-order compensation thunk
        await dispatch(
          compensateAPreOrderThunk({
            id: order.id,
            file: formData,
          }),
        ).unwrap();
      } else {
        // For regular orders and limited orders, use regular compensation thunk
        await dispatch(
          compensateAnOrderThunk({
            orderId: order.id,
            file: formData,
          }),
        ).unwrap();
      }

      toast.success(`Compensation request ${isApproved ? "approved" : "rejected"} successfully!`);
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to process compensation request", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FaTriangleExclamation className="w-4 h-4 text-amber-600" />
            Compensation Request
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-sm text-amber-800">
            This order has a compensation request that needs to be processed.
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
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
              COMPENSATE REQUEST
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
              Please provide photo/video proof for the compensation decision (Max 5MB per file).
            </div>

            <MobileFileUploader
              userId={order.user_id}
              accept="image/*,video/*"
              multiple={true}
              maxFiles={3}
              maxSize={5}
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
            Reason/Notes
            <span className="text-red-500 text-sm ml-1">* (Required for rejection)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="Enter reason or notes about this compensation decision..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="text-xs text-gray-500 mt-2">
            Provide detailed explanation about your decision
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
          onClick={() => handleCompensateOrder(false)}
          disabled={proofFiles.length === 0 || isSubmitting || !reason.trim()}
          variant="destructive"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FaTimes className="w-4 h-4 mr-2" />
              Reject
            </>
          )}
        </Button>
      </div>

      <Button
        type="button"
        onClick={() => handleCompensateOrder(true)}
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
            <FaCircleCheck className="w-4 h-4 mr-2" />
            Approve Compensation
          </>
        )}
      </Button>
    </div>
  );
};

export default MobileCompensateRequest;
