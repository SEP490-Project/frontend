import type { OrderData, OrderRequestQuery } from "@/libs/types/order";
import ConfirmOrder from "./change-status-order/ConfirmOrder";
import AwaitingPickupOrder from "./change-status-order/AwaitingPickupOrder";
import ShipOrder from "./change-status-order/ShipOrder";
import CompleteSelfPickUpOrder from "./change-status-order/CompleteSelfPickUpOrder";
import RefundRequestOrder from "./change-status-order/RefundRequestOrder";
import CompensateRequestOrder from "./change-status-order/CompensateRequestOrder";
import { useAppDispatch } from "@/libs/stores";
import {
  approveRefundAnOrderThunk,
  censorAnOrderThunk,
  compensateAnOrderThunk,
  getOrderForSaleStaffThunk,
  markLimitedOrderAsDeliveredThunk,
  markLimitedOrderAsInTransitThunk,
  markOrderIsReadyToPickedUpThunk,
  markOrderIsReceivedAfterPickedUpThunk,
  obligateRefundAnOrderThunk,
} from "@/libs/stores/orderManager/thunk";
import { toast } from "sonner";
import { useState } from "react";
import ShipLimitedOrder from "./change-status-order/ShipLimitedOrder";
import CompleteShipLimitedOrder from "./change-status-order/CompleteShipLimitedOrder";

interface ChangeStatusModalProps {
  order: OrderData | null;
  onSuccess?: () => void;
}

const ChangeOrderStatusModal = ({ order, onSuccess }: ChangeStatusModalProps) => {
  const dispatch = useAppDispatch();

  const [params] = useState<OrderRequestQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const handleConfirmOrder = async (payload: { action: "CONFIRM" | "CANCEL"; reason?: string }) => {
    const { action, reason } = payload;
    const result = await dispatch(
      censorAnOrderThunk({ action, orderId: order?.id as string, reason: reason || "" }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order status updated successfully");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to update order status");
    }
  };

  const handleAwaitingPickupOrder = async () => {
    const result = await dispatch(markOrderIsReadyToPickedUpThunk(order?.id as string));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order marked as ready to be picked up");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to update order status");
    }
  };

  const handleCompleteSelfPickUpOrder = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    const result = await dispatch(
      markOrderIsReceivedAfterPickedUpThunk({ orderId: order?.id as string, files: formData }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order marked as received after pickup");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to update order status");
    }
  };

  const handleRefundRequestOrder = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const result = await dispatch(
      approveRefundAnOrderThunk({ orderId: order?.id as string, file: formData }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Refund approved successfully");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to approve refund");
    }
  };

  const handleCompensateRequestOrder = async ({
    file,
    isApproved,
    reason,
  }: {
    file: File;
    isApproved: boolean;
    reason?: string;
  }) => {
    const formData = new FormData();
    formData.append("reason", reason || "");
    formData.append("isApproved", isApproved ? "true" : "false");
    formData.append("file", file);

    const result = await dispatch(
      compensateAnOrderThunk({ orderId: order?.id as string, file: formData }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Compensation request handled successfully");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to handle compensation request");
    }
  };

  const handleCancelOrderAfterPayment = async ({
    reason,
    file,
  }: {
    reason?: string;
    file: File;
  }) => {
    const formData = new FormData();
    formData.append("reason", reason || "");
    formData.append("file", file);

    const result = await dispatch(
      obligateRefundAnOrderThunk({ orderId: order?.id as string, file: formData }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order cancellation after payment handled successfully");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to handle order cancellation after payment");
    }
  };

  const handleLimitedOrderAsDelivered = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);

    const result = await dispatch(
      markLimitedOrderAsDeliveredThunk({ orderId: order?.id as string, files: formData }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order marked as delivered successfully");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to mark order as delivered");
    }
  };

  const handleLimitedOrderAsInTransit = async () => {
    const result = await dispatch(markLimitedOrderAsInTransitThunk(order?.id as string));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order marked as in transit successfully");
      onSuccess?.();
      dispatch(getOrderForSaleStaffThunk(params));
    } else {
      toast.error("Failed to mark order as in transit");
    }
  };

  switch (order?.status) {
    case "PAID":
      return (
        <ConfirmOrder
          order={order}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelOrderAfterPayment}
        />
      );
    case "CONFIRMED":
      if (order.is_self_picked_up) {
        return <AwaitingPickupOrder order={order} onHandle={handleAwaitingPickupOrder} />;
      }
      if (order.order_type === "LIMITED" && order.is_self_picked_up === false) {
        return <ShipLimitedOrder order={order} onHandle={handleLimitedOrderAsInTransit} />;
      }

      return <ShipOrder order={order} />;
    case "IN_TRANSIT":
      if (order.order_type === "LIMITED") {
        return <CompleteShipLimitedOrder order={order} onHandle={handleLimitedOrderAsDelivered} />;
      }
      return <ShipOrder order={order} />;
    case "SHIPPED":
    case "DELIVERED":
      return <ShipOrder order={order} />;
    case "AWAITING_PICKUP":
      return <CompleteSelfPickUpOrder order={order} onComplete={handleCompleteSelfPickUpOrder} />;
    case "REFUND_REQUEST":
      return <RefundRequestOrder order={order} onHandle={handleRefundRequestOrder} />;
    case "COMPENSATE_REQUEST":
      return <CompensateRequestOrder order={order} onHandle={handleCompensateRequestOrder} />;
  }
};

export default ChangeOrderStatusModal;
