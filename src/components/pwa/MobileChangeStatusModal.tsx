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
import { useAppDispatch } from "@/libs/stores";
import {
  markOrderIsReadyToPickedUpThunk,
  markSelfDeliveryOrderAsDeliveredThunk,
  markSelfDeliveryOrderAsInTransitThunk,
  markLimitedOrderAsDeliveredThunk,
  markLimitedOrderAsInTransitThunk,
  deliveredSelfDeliveryPreOrderThunk,
} from "@/libs/stores/orderManager/thunk";

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
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [proofUrls, setProofUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (order.status === "REFUND_REQUEST") {
    return <MobileRefundRequest order={order} onSuccess={onSuccess} onCancel={onCancel} />;
  }

  if (order.status === "COMPENSATE_REQUEST") {
    return <MobileCompensateRequest order={order} onSuccess={onSuccess} onCancel={onCancel} />;
  }

  const getNextStatuses = () => {
    const currentStatus = order.status.toUpperCase();

    if (order.is_self_picked_up) {
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

  const isProofRequired = () => {
    return ["DELIVERED", "RECEIVED"].includes(selectedStatus);
  };

  const handleFilesCapture = (files: File[]) => {
    setProofFiles(files);
  };

  const handleUploadComplete = (urls: string[]) => {
    setProofUrls(urls);
  };

  const isPreOrder = () => {
    return order.order_type === "PRE_ORDER";
  };

  const isLimitedOrder = () => {
    return order.order_type === "LIMITED_PRODUCT";
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    if (isProofRequired() && proofFiles.length === 0) {
      toast.error("Proof image is required for this status");
      return;
    }

    setIsSubmitting(true);

    try {
      const isPreOrderType = isPreOrder();
      const isLimitedOrderType = isLimitedOrder();

      if (selectedStatus === "CONFIRMED") {
        // For CONFIRMED status, use the ready to pickup API
        await dispatch(markOrderIsReadyToPickedUpThunk(order.id)).unwrap();
      } else if (selectedStatus === "AWAITING_PICKUP") {
        // Mark as ready for pickup
        await dispatch(markOrderIsReadyToPickedUpThunk(order.id)).unwrap();
      } else if (selectedStatus === "RECEIVED") {
        // Skip API call for RECEIVED status - just show success message
        // This transition is handled automatically or by other means
        toast.success("Order marked as received!");
        onSuccess();
        return;
      } else if (selectedStatus === "IN_TRANSIT") {
        // Mark as in transit
        if (isLimitedOrderType) {
          // For limited orders, use limited order API
          await dispatch(markLimitedOrderAsInTransitThunk(order.id)).unwrap();
        } else {
          // For regular orders, use regular API
          await dispatch(markSelfDeliveryOrderAsInTransitThunk(order.id)).unwrap();
        }
      } else if (selectedStatus === "DELIVERED") {
        // Mark as delivered with proof
        const formData = new FormData();
        proofFiles.forEach((file) => {
          formData.append("file", file);
        });
        if (notes.trim()) {
          formData.append("notes", notes.trim());
        }

        if (isPreOrderType) {
          // For pre-orders, use pre-order API
          await dispatch(
            deliveredSelfDeliveryPreOrderThunk({ id: order.id, file: formData }),
          ).unwrap();
        } else if (isLimitedOrderType) {
          // For limited orders, use limited order API
          await dispatch(
            markLimitedOrderAsDeliveredThunk({ orderId: order.id, files: formData }),
          ).unwrap();
        } else {
          // For regular orders, use regular API
          await dispatch(
            markSelfDeliveryOrderAsDeliveredThunk({ orderId: order.id, files: formData }),
          ).unwrap();
        }
      } else if (selectedStatus === "SHIPPED") {
        // For shipped status, use in transit API
        if (isLimitedOrderType) {
          // For limited orders, use limited order API
          await dispatch(markLimitedOrderAsInTransitThunk(order.id)).unwrap();
        } else {
          // For regular orders, use regular API
          await dispatch(markSelfDeliveryOrderAsInTransitThunk(order.id)).unwrap();
        }
      }

      toast.success("Order status updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to update order status", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
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
                Please provide photo proof for {getStatusLabel(selectedStatus).toLowerCase()}{" "}
                status.
              </div>

              <MobileFileUploader
                userId={order.user_id}
                accept="image/*"
                multiple={true}
                maxFiles={3}
                maxSize={20}
                allowedTypes={["jpg", "jpeg", "png", "webp"]}
                title="Upload Proof"
                onFilesChange={handleFilesCapture}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </CardContent>
        </Card>
      )}

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

        {availableStatuses.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default MobileChangeStatusModal;
