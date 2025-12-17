import React, { useState } from "react";
import type { PreOrderData } from "@/libs/types/pre-order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { FaCheck, FaXmark as FaTimes, FaImage, FaSpinner } from "react-icons/fa6";
import MobileFileUploader from "./MobileFileUploader";
import MobilePreOrderCompensateRequest from "./MobilePreOrderCompensateRequest";
import { toast } from "sonner";
import { useAppDispatch } from "@/libs/stores";
import {
  approvePreOrderThunk,
  receivedSelfPickupPreOrderThunk,
  deliveredSelfDeliveryPreOrderThunk,
  obligateRefundAPreOrderThunk,
} from "@/libs/stores/orderManager/thunk";

interface MobileChangePreOrderStatusModalProps {
  preOrder: PreOrderData;
  onSuccess: () => void;
  onCancel: () => void;
}

const MobileChangePreOrderStatusModal: React.FC<MobileChangePreOrderStatusModalProps> = ({
  preOrder,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);

  if (preOrder.status === "COMPENSATE_REQUEST") {
    return (
      <MobilePreOrderCompensateRequest
        preOrder={preOrder}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
  }

  const getAvailableActions = () => {
    const currentStatus = preOrder.status.toUpperCase();
    const actions = [];

    if (preOrder.is_self_picked_up) {
      switch (currentStatus) {
        case "PAID":
          actions.push({
            action: "CONFIRM",
            label: "Confirm Pre-Order",
            variant: "default" as const,
          });
          actions.push({
            action: "CANCEL",
            label: "Cancel Pre-Order",
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
          actions.push({
            action: "CONFIRM",
            label: "Confirm Pre-Order",
            variant: "default" as const,
          });
          actions.push({
            action: "CANCEL",
            label: "Cancel Pre-Order",
            variant: "destructive" as const,
            requiresReason: true,
          });
          break;
        case "CONFIRMED":
          actions.push({
            action: "DELIVERED",
            label: "Mark as Delivered",
            variant: "default" as const,
            requiresProof: true,
          });
          break;
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
      if (action === "CONFIRM") {
        await dispatch(approvePreOrderThunk({ id: preOrder.id })).unwrap();
      } else if (action === "CANCEL") {
        const formData = new FormData();
        if (proofFiles.length > 0) {
          proofFiles.forEach((file) => {
            formData.append("file", file);
          });
        }
        formData.append("reason", notes.trim());

        await dispatch(obligateRefundAPreOrderThunk({ id: preOrder.id, file: formData })).unwrap();
      } else if (action === "AWAITING_PICKUP") {
        toast.success("Pre-order marked as ready for pickup!");
        onSuccess();
        return;
      } else if (action === "DELIVERED") {
        const formData = new FormData();
        proofFiles.forEach((file) => {
          formData.append("file", file);
        });
        if (notes.trim()) {
          formData.append("notes", notes.trim());
        }

        await dispatch(
          deliveredSelfDeliveryPreOrderThunk({ id: preOrder.id, file: formData }),
        ).unwrap();
      } else if (action === "RECEIVED") {
        const formData = new FormData();
        proofFiles.forEach((file) => {
          formData.append("file", file);
        });
        if (notes.trim()) {
          formData.append("notes", notes.trim());
        }

        await dispatch(
          receivedSelfPickupPreOrderThunk({ id: preOrder.id, file: formData }),
        ).unwrap();
      }

      toast.success("Pre-order updated successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error("Failed to update pre-order", {
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
            <Badge className={getStatusBadgeClass(preOrder.status.toUpperCase())}>
              {getStatusLabel(preOrder.status.toUpperCase())}
            </Badge>
            <Badge variant="outline" className="border-purple-300 text-purple-700">
              PRE-ORDER
            </Badge>
            <span className="text-sm text-gray-600">
              {preOrder.is_self_picked_up ? "Self Pickup" : "Delivery"}
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
              No actions available for this pre-order
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
              Cancel Pre-Order
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm text-red-600">
                Please provide a reason for cancelling this pre-order.
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
                      Cancel Pre-Order
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
              Pre-Order ID: <span className="font-mono">#{preOrder.id.slice(0, 8)}</span>
            </div>
            <div>Customer: {preOrder.full_name}</div>
            <div>Phone: {preOrder.phone_number}</div>
            {preOrder.is_self_picked_up ? (
              <div className="text-blue-600 font-medium">Self Pickup Pre-Order</div>
            ) : (
              <div className="text-green-600 font-medium">Delivery Pre-Order</div>
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

export default MobileChangePreOrderStatusModal;
