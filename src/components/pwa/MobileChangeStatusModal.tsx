import React, { useState } from "react";
import type { OrderData } from "@/libs/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { FaCheck, FaXmark as FaTimes, FaImage, FaSpinner } from "react-icons/fa6";
import MobileFileUploader from "./MobileFileUploader";
import MobileCompensateRequest from "./MobileCompensateRequest";
import MobileRefundRequest from "./MobileRefundRequest";
import { toast } from "sonner";
import { useAppDispatch } from "@/libs/stores";
import {
  markOrderIsReadyToPickedUpThunk,
  markOrderIsReceivedAfterPickedUpThunk,
  censorAnOrderThunk,
  markSelfDeliveryOrderAsDeliveredThunk,
  markSelfDeliveryOrderAsInTransitThunk,
  markLimitedOrderAsDeliveredThunk,
  markLimitedOrderAsInTransitThunk,
  approvePreOrderThunk,
  receivedSelfPickupPreOrderThunk,
  obligateRefundAnOrderThunk,
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
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);

  if (order.status === "REFUND_REQUEST") {
    return <MobileRefundRequest order={order} onSuccess={onSuccess} onCancel={onCancel} />;
  }

  if (order.status === "COMPENSATE_REQUEST") {
    return <MobileCompensateRequest order={order} onSuccess={onSuccess} onCancel={onCancel} />;
  }

  const getAvailableActions = () => {
    const currentStatus = order.status.toUpperCase();
    const orderType = order.order_type;
    const actions = [];

    if (order.is_self_picked_up) {
      switch (currentStatus) {
        case "PAID":
          actions.push({ action: "CONFIRM", label: "Confirm Order", variant: "default" as const });
          actions.push({
            action: "CANCEL",
            label: "Cancel Order",
            variant: "destructive" as const,
            requiresReason: true,
          });
          break;
        case "CONFIRMED":
          actions.push({
            action: "AWAITING_PICKUP",
            label: "Mark Ready for Pickup",
            variant: "default" as const,
          });
          break;
        case "AWAITING_PICKUP":
          actions.push({
            action: "RECEIVED",
            label: "Mark as Received",
            variant: "default" as const,
            requiresProof: true,
          });
          break;
      }
    } else {
      switch (currentStatus) {
        case "PAID":
          actions.push({ action: "CONFIRM", label: "Confirm Order", variant: "default" as const });
          actions.push({
            action: "CANCEL",
            label: "Cancel Order",
            variant: "destructive" as const,
            requiresReason: true,
          });
          break;
        case "CONFIRMED":
          if (orderType === "LIMITED" || orderType === "LIMITED_PRODUCT") {
            actions.push({
              action: "IN_TRANSIT",
              label: "Mark In Transit",
              variant: "default" as const,
            });
          } else if (orderType === "PRE_ORDER") {
            actions.push({
              action: "DELIVERED",
              label: "Mark as Delivered",
              variant: "default" as const,
              requiresProof: true,
            });
          } else {
            actions.push({
              action: "SHIPPED",
              label: "Mark as Shipped",
              variant: "default" as const,
            });
          }
          break;
        case "SHIPPED":
        case "IN_TRANSIT":
          actions.push({
            action: "DELIVERED",
            label: "Mark as Delivered",
            variant: "default" as const,
            requiresProof: true,
          });
          break;
        case "DELIVERED":
          actions.push({
            action: "RECEIVED",
            label: "Mark as Received",
            variant: "default" as const,
          });
          break;
      }
    }

    return actions;
  };

  const availableActions = getAvailableActions();

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

  const isProofRequired = (action: string) => {
    return ["DELIVERED", "RECEIVED"].includes(action);
  };

  const requiresReason = (action: string) => {
    return action === "CANCEL";
  };

  const handleFilesCapture = (files: File[]) => {
    setProofFiles(files);
  };

  const handleAction = async (action: string) => {
    if (requiresReason(action) && !notes.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    if (isProofRequired(action) && proofFiles.length === 0) {
      toast.error("Proof image is required for this action");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderType = order.order_type;
      const isPreOrderType = orderType === "PRE_ORDER";
      const isLimitedOrderType = orderType === "LIMITED" || orderType === "LIMITED_PRODUCT";

      if (action === "CONFIRM") {
        if (isPreOrderType) {
          await dispatch(approvePreOrderThunk({ id: order.id })).unwrap();
        } else {
          await dispatch(
            censorAnOrderThunk({ orderId: order.id, action: "CONFIRM", reason: notes || "" }),
          ).unwrap();
        }
      } else if (action === "CANCEL") {
        const formData = new FormData();
        if (proofFiles.length > 0) {
          proofFiles.forEach((file) => {
            formData.append("file", file);
          });
        }
        formData.append("reason", notes.trim());

        await dispatch(obligateRefundAnOrderThunk({ orderId: order.id, file: formData })).unwrap();
      } else if (action === "AWAITING_PICKUP") {
        await dispatch(markOrderIsReadyToPickedUpThunk(order.id)).unwrap();
      } else if (action === "IN_TRANSIT" || action === "SHIPPED") {
        if (isLimitedOrderType) {
          await dispatch(markLimitedOrderAsInTransitThunk(order.id)).unwrap();
        } else {
          if (order.is_self_picked_up) {
            await dispatch(markSelfDeliveryOrderAsInTransitThunk(order.id)).unwrap();
          } else {
            toast.success("Order marked as shipped!");
            onSuccess();
            return;
          }
        }
      } else if (action === "DELIVERED") {
        const formData = new FormData();
        proofFiles.forEach((file) => {
          formData.append("files", file);
        });
        if (notes.trim()) {
          formData.append("notes", notes.trim());
        }

        if (isLimitedOrderType) {
          await dispatch(
            markLimitedOrderAsDeliveredThunk({ orderId: order.id, files: formData }),
          ).unwrap();
        } else {
          if (order.is_self_picked_up) {
            await dispatch(
              markSelfDeliveryOrderAsDeliveredThunk({ orderId: order.id, files: formData }),
            ).unwrap();
          } else {
            toast.success("Order marked as delivered!");
            onSuccess();
            return;
          }
        }
      } else if (action === "RECEIVED") {
        const formData = new FormData();
        if (isLimitedOrderType || isPreOrderType) {
          proofFiles.forEach((file) => {
            formData.append("file", file);
          });
        } else {
          proofFiles.forEach((file) => {
            formData.append("files", file);
          });
        }
        if (notes.trim()) {
          formData.append("notes", notes.trim());
        }

        if (isLimitedOrderType || isPreOrderType) {
          await dispatch(
            receivedSelfPickupPreOrderThunk({ id: order.id, file: formData }),
          ).unwrap();
        } else {
          await dispatch(
            markOrderIsReceivedAfterPickedUpThunk({ orderId: order.id, files: formData }),
          ).unwrap();
        }
      }

      toast.success("Order updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to update order", {
        description: error?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setSelectedAction(null);
      setShowCancelForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusBadgeClass(order.status.toUpperCase())}>
              {getStatusLabel(order.status.toUpperCase())}
            </Badge>
            <Badge
              variant="outline"
              className={
                order.order_type === "STANDARD"
                  ? "border-blue-300 text-blue-700"
                  : order.order_type === "LIMITED" || order.order_type === "LIMITED_PRODUCT"
                    ? "border-orange-300 text-orange-700"
                    : "border-purple-300 text-purple-700"
              }
            >
              {order.order_type || "STANDARD"}
            </Badge>
            <span className="text-sm text-gray-600">
              {order.is_self_picked_up ? "Self Pickup" : "Delivery"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Available Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {availableActions.length > 0 ? (
            <div className="space-y-2">
              {availableActions.map((actionItem) => (
                <Button
                  key={actionItem.action}
                  variant={actionItem.variant === "destructive" ? "destructive" : "default"}
                  onClick={() => {
                    if (actionItem.action === "CANCEL") {
                      setShowCancelForm(true);
                      setSelectedAction(actionItem.action);
                    } else if (actionItem.requiresProof || actionItem.requiresReason) {
                      setSelectedAction(actionItem.action);
                    } else {
                      handleAction(actionItem.action);
                    }
                  }}
                  disabled={isSubmitting}
                  className={`w-full justify-start ${
                    actionItem.variant !== "destructive"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }`}
                >
                  {actionItem.label}
                  {actionItem.requiresProof && (
                    <Badge variant="outline" className="ml-auto text-xs text-white">
                      Proof Required
                    </Badge>
                  )}
                  {actionItem.requiresReason && (
                    <Badge variant="outline" className="ml-auto text-xs text-white">
                      Reason Required
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
              No actions available for this order
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAction && isProofRequired(selectedAction) && (
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
                Please provide photo proof for this action.
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

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAction(null);
                    setProofFiles([]);
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={() => handleAction(selectedAction)}
                  disabled={isSubmitting || proofFiles.length === 0}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4 mr-2" />
                      Confirm
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showCancelForm && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-red-700">
              <FaTimes className="w-4 h-4" />
              Cancel Order
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm text-red-600">
                Please provide a reason for cancelling this order.
              </div>

              <Textarea
                placeholder="Enter cancellation reason..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px] resize-none border-red-200 focus:border-red-300"
              />

              <MobileFileUploader
                accept="image/*"
                multiple={true}
                maxFiles={1}
                maxSize={10}
                allowedTypes={["jpg", "jpeg", "png", "webp"]}
                title="Upload Proof (Optional)"
                onFilesChange={handleFilesCapture}
              />

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelForm(false);
                    setSelectedAction(null);
                    setNotes("");
                    setProofFiles([]);
                  }}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction("CANCEL")}
                  disabled={isSubmitting || !notes.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <FaTimes className="w-4 h-4 mr-2" />
                      Cancel Order
                    </>
                  )}
                </Button>
              </div>
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

      {!selectedAction && !showCancelForm && (
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full"
          >
            <FaTimes className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileChangeStatusModal;
