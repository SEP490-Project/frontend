import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/libs/stores";
import { censorAnOrderThunk, getOrderForSaleStaffThunk } from "@/libs/stores/orderManager/thunk";
import type { OrderData } from "@/libs/types/order";
import { useState } from "react";
import { toast } from "sonner";
import { SelfPickUpChangeStatusModal } from "./change-status-order/CustomerSelfPickUp";
import { SelfDeliveryChangeStatusModal } from "./change-status-order/StaffSelfDelivery";
import { RefundRequestModal } from "./change-status-order/RefundRequest";
import { CompensateRequest } from "./change-status-order/CompensateRequest";

interface ChangeStatusModalProps {
  order: OrderData | null;
  onSuccess?: () => void;
}

const nextState = (currentState: string, nextState?: string) => {
  const validTransitions: Record<string, string[]> = {
    PENDING: ["CANCELLED", "PAID"],
    PAID: ["CONFIRMED", "CANCELLED"],
    SHIPPED: ["IN_TRANSIT"],
    IN_TRANSIT: ["DELIVERED"],
    DELIVERED: ["RECEIVED"],
    CONFIRMED: ["SHIPPED"],
    CANCELLED: [],
    RECEIVED: [],
    REFUNDED: [],
  };
  return {
    nextState: validTransitions?.[currentState] || [],
    isValid: nextState ? validTransitions[currentState]?.includes(nextState) : null,
  };
};

export const ChangeStatusModal = ({ order, onSuccess }: ChangeStatusModalProps) => {
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const handleCensorOrder = async (action: "CONFIRM" | "CANCEL", reason?: any) => {
    if (!order) return;
    try {
      await dispatch(
        censorAnOrderThunk({
          orderId: order.id,
          action,
          reason,
        }),
      ).unwrap();

      toast.success("Order status updated successfully!");
      dispatch(getOrderForSaleStaffThunk({ page: 1, limit: 10 }));
      onSuccess?.();
    } catch (error: any) {
      toast.error("Failed to update order status", {
        description: error?.message || "Please try again.",
      });
    }
  };

  if (order?.status === "PAID") {
    return (
      <div className="w-full">
        <div>
          <Label htmlFor="status">Change Status:</Label>
          <Select onValueChange={(value) => setSelectedStatus(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select next status" />
            </SelectTrigger>
            <SelectContent>
              {nextState(order.status).nextState.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedStatus === "CANCELLED" && (
          <div className="mb-2">
            <Label htmlFor="reason">Reason for cancellation:</Label>
            <Input
              type="text"
              id="reason"
              name="reason"
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}
        <div className="flex justify-end">
          <Button
            disabled={!selectedStatus}
            onClick={() =>
              handleCensorOrder(selectedStatus === "CONFIRMED" ? "CONFIRM" : "CANCEL", {
                reason: selectedStatus === "CANCELLED" ? reason : undefined,
              })
            }
            className="mt-4"
          >
            Change Status
          </Button>
        </div>
      </div>
    );
  } else if (order?.status === "CANCELLED") {
    return (
      <div>
        <p className="text-red-600 font-medium">
          This order has been cancelled and cannot be changed.
        </p>
      </div>
    );
  } else if (order?.status === "REFUND_REQUEST") {
    return <RefundRequestModal order={order} onSuccess={onSuccess} />;
  } else if (order?.status === "COMPENSATE_REQUEST") {
    return <CompensateRequest order={order} onSuccess={onSuccess} />;
  }

  if (order?.is_self_picked_up) {
    return <SelfPickUpChangeStatusModal order={order} onSuccess={onSuccess} />;
  }

  // Check if it's a limited product order (self-delivery by staff)
  if (order?.order_type === "LIMITED") {
    return <SelfDeliveryChangeStatusModal order={order} onSuccess={onSuccess} />;
  }

  return (
    <div>
      {(() => {
        switch (order?.status) {
          case "PENDING":
            return <div>Waiting for user paid</div>;
          case "CANCELLED":
            return <div>Order has been cancelled</div>;
          case "SHIPPED":
            return <div>GHN have stored customer order items</div>;
          case "IN_TRANSIT":
            return (
              <div>
                Order is on the way to{" "}
                <span className="font-medium">
                  {order?.street}, {order?.ward_name}, {order.district_name}, {order.province_name}
                </span>{" "}
                for <span className="font-medium">{order?.full_name}</span>
              </div>
            );
          case "DELIVERED":
            return (
              <div>
                Order has been delivered to{" "}
                <span className="font-medium">
                  {order?.street}, {order?.ward_name}, {order.district_name}, {order.province_name}
                </span>{" "}
                for <span className="font-medium">{order?.full_name}</span>
              </div>
            );
          case "CONFIRMED":
            return <div>Order has been confirmed, please send customer order items to GHN</div>;
          case "RECEIVED":
            return (
              <div>
                Order has been received by <span className="font-medium">{order?.full_name}</span>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};
