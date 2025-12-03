import React, { useState } from "react";
import type { OrderData } from "@/libs/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { FaCheck, FaXmark as FaTimes, FaImage, FaSpinner } from "react-icons/fa6";
import MobileFileUploader from "./MobileFileUploader";
import MobileCompensateRequest from "./MobileCompensateRequest";
import MobileRefundRequest from "./MobileRefundRequest";
import { toast } from "sonner";

interface MobileChangeStatusModalProps {
  order: OrderData;
  onSuccess: () => void;
  onCancel: () => void;
}

const MobileChangeStatusModal: React.FC<MobileChangeStatusModalProps> = ({
  order,
  onSuccess,
  onCancel,
}) => {
  // Hooks phải luôn được gọi ở top-level, không sau return conditionally
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [proofUrls, setProofUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle special request statuses
  if (order.status === "REFUND_REQUEST") {
    return <MobileRefundRequest order={order} onSuccess={onSuccess} onCancel={onCancel} />;
  }

  if (order.status === "COMPENSATE_REQUEST") {
    return <MobileCompensateRequest order={order} onSuccess={onSuccess} onCancel={onCancel} />;
  }

  // Get available next statuses based on current status and delivery type
  const getNextStatuses = () => {
    const currentStatus = order.status.toUpperCase();

    if (order.is_self_picked_up) {
      // Self pickup flow
      switch (currentStatus) {
        case "PAID":
          return ["CONFIRMED"];
        case "CONFIRMED":
          return ["AWAITING_PICKUP"];
        case "AWAITING_PICKUP":
          return ["RECEIVED"];
        default:
          return [];
      }
    } else {
      // Delivery flow
      switch (currentStatus) {
        case "PAID":
          return ["CONFIRMED"];
        case "CONFIRMED":
          return ["SHIPPED", "IN_TRANSIT"];
        case "SHIPPED":
        case "IN_TRANSIT":
          return ["DELIVERED"];
        case "DELIVERED":
          return ["RECEIVED"];
        default:
          return [];
      }
    }
  };

  const availableStatuses = getNextStatuses();

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      CONFIRMED: "Confirmed",
      AWAITING_PICKUP: "Awaiting Pickup",
      SHIPPED: "Shipped",
      IN_TRANSIT: "In Transit",
      DELIVERED: "Delivered",
      RECEIVED: "Received",
      CANCELLED: "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      CONFIRMED: "bg-green-100 text-green-800 border border-green-200",
      AWAITING_PICKUP: "bg-blue-100 text-blue-800 border border-blue-200",
      SHIPPED: "bg-blue-100 text-blue-800 border border-blue-200",
      IN_TRANSIT: "bg-orange-100 text-orange-800 border border-orange-200",
      DELIVERED: "bg-green-200 text-green-900 border border-green-300",
      RECEIVED: "bg-green-100 text-green-800 border border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border border-red-200",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  // Check if proof is required for this status change
  const isProofRequired = () => {
    return ["DELIVERED", "RECEIVED"].includes(selectedStatus);
  };

  const handleFilesCapture = (files: File[]) => {
    setProofFiles(files);
  };

  const handleUploadComplete = (urls: string[]) => {
    setProofUrls(urls);
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    if (isProofRequired() && proofUrls.length === 0) {
      toast.error("Proof image/video is required for this status");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data for the API call
      const formData = new FormData();
      formData.append("state", selectedStatus);

      if (notes.trim()) {
        formData.append("notes", notes.trim());
      }

      // Add proof files
      if (proofFiles.length > 0) {
        proofFiles.forEach((file) => {
          formData.append("file", file);
        });
      }

      // Call appropriate thunk based on order type and status
      if (selectedStatus === "RECEIVED" && order.is_self_picked_up) {
        // Handle self pickup received
        // await dispatch(receivedSelfPickupOrderThunk({ id: order.id, file: formData })).unwrap();
        console.log("Self pickup received:", { orderId: order.id, formData });
      } else if (selectedStatus === "DELIVERED" && !order.is_self_picked_up) {
        // Handle delivery completed
        // await dispatch(deliveredSelfDeliveryOrderThunk({ id: order.id, file: formData })).unwrap();
        console.log("Delivery completed:", { orderId: order.id, formData });
      } else {
        // Handle other status changes
        // await dispatch(updateOrderStatusThunk({ id: order.id, status: selectedStatus, notes })).unwrap();
        console.log("Status change:", { orderId: order.id, status: selectedStatus, notes });
      }

      toast.success("Order status updated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error("Failed to update order status", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <Badge className={getStatusBadgeClass(order.status.toUpperCase())}>
              {getStatusLabel(order.status.toUpperCase())}
            </Badge>
            <span className="text-sm text-gray-600">
              {order.is_self_picked_up ? "Self Pickup" : "Delivery"} Order
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Status Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Change Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {availableStatuses.length > 0 ? (
            <>
              <div>
                <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                  Select New Status
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose next status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              status === "CONFIRMED"
                                ? "bg-green-500"
                                : status === "AWAITING_PICKUP"
                                  ? "bg-blue-500"
                                  : status === "SHIPPED" || status === "IN_TRANSIT"
                                    ? "bg-orange-500"
                                    : status === "DELIVERED" || status === "RECEIVED"
                                      ? "bg-green-600"
                                      : "bg-gray-500"
                            }`}
                          />
                          {getStatusLabel(status)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStatus && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadgeClass(selectedStatus)}>
                      {getStatusLabel(selectedStatus)}
                    </Badge>
                    {isProofRequired() && (
                      <Badge variant="outline" className="text-xs">
                        Proof Required
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
              No status changes available for this order
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="Add notes about this status change..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Proof Upload */}
      {selectedStatus && isProofRequired() && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FaImage className="w-4 h-4" />
              Proof Required
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Please provide photo/video proof for {getStatusLabel(selectedStatus).toLowerCase()}{" "}
                status.
              </div>

              <MobileFileUploader
                userId={order.user_id}
                accept="image/*,video/*"
                multiple={true}
                maxFiles={3}
                maxSize={20}
                allowedTypes={["jpg", "jpeg", "png", "webp", "mp4", "webm", "mov"]}
                title="Upload Proof"
                onFilesChange={handleFilesCapture}
                onUploadComplete={handleUploadComplete}
                showCamera={true}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Info */}
      <Card className="border-gray-200">
        <CardContent className="p-3">
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              Order ID: <span className="font-mono">#{order.id.slice(0, 8)}</span>
            </div>
            <div>Customer: {order.full_name}</div>
            <div>Phone: {order.phone_number}</div>
            {order.is_self_picked_up ? (
              <div className="text-blue-600 font-medium">Self Pickup Order</div>
            ) : (
              <div className="text-green-600 font-medium">Delivery Order</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
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
          onClick={handleSubmit}
          disabled={
            !selectedStatus || isSubmitting || (isProofRequired() && proofUrls.length === 0)
          }
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <FaCheck className="w-4 h-4 mr-2" />
              Update Status
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileChangeStatusModal;
