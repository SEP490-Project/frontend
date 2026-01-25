import type { PreOrderData } from "@/libs/types/pre-order";
import ConfirmPreOrder from "./change-status-preorder/ConfirmPreOrder";
import AwaitingPickupPreOrder from "./change-status-preorder/AwaitingPickupPreOrder";
import CompleteSelfPickupPreOrder from "./change-status-preorder/CompleteSelfPickupPreOrder";
import RefundRequestPreOrder from "./change-status-preorder/RefundRequestPreOrder";
import CompensateRequestPreOrder from "./change-status-preorder/CompensateRequestPreOrder";
import { useAppDispatch } from "@/libs/stores";
import {
  approvePreOrderThunk,
  compensateAPreOrderThunk,
  // deliveredSelfDeliveryPreOrderThunk,
  getPreOrdersForSaleStaffThunk,
  obligateRefundAPreOrderThunk,
  receivedSelfPickupPreOrderThunk,
  refundAPreOrderThunk,
} from "@/libs/stores/orderManager/thunk";
import { toast } from "sonner";
import { useState } from "react";
import type { OrderRequestQuery } from "@/libs/types/order";
import ShipPreOrder from "./change-status-preorder/ShipPreOrder";

interface ChangeStatusModalProps {
  preOrder: PreOrderData | null;
  onSuccess?: () => void;
}

const ChangePreOrderStatusModal = ({ preOrder, onSuccess }: ChangeStatusModalProps) => {
  const dispatch = useAppDispatch();
  const [params] = useState<OrderRequestQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const handleConfirmPreorder = async () => {
    const result = await dispatch(approvePreOrderThunk({ id: preOrder!.id }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Pre-order approved successfully");
      onSuccess?.();
      dispatch(getPreOrdersForSaleStaffThunk(params));
    } else {
      toast.error("Failed to approve pre-order");
    }
  };

  const handleMarkReadyForPickup = async () => {
    // TODO: Implement mark ready for pickup thunk when available
    toast.info("Mark ready for pickup functionality to be implemented");
    onSuccess?.();
  };

  const handleCompletePickupPreorder = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const result = await dispatch(
      receivedSelfPickupPreOrderThunk({ id: preOrder!.id, file: formData }),
    );
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Pre-order marked as received successfully");
      onSuccess?.();
      dispatch(getPreOrdersForSaleStaffThunk(params));
    } else {
      toast.error("Failed to mark pre-order as received");
    }
  };

  // const handleShipPreorder = async (file: File) => {
  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const result = await dispatch(
  //     deliveredSelfDeliveryPreOrderThunk({ id: preOrder!.id, file: formData }),
  //   );
  //   if (result.meta.requestStatus === "fulfilled") {
  //     toast.success("Pre-order marked as delivered successfully");
  //     onSuccess?.();
  //     dispatch(getPreOrdersForSaleStaffThunk(params));
  //   } else {
  //     toast.error("Failed to mark pre-order as delivered");
  //   }
  // };

  const handleCompensateRequestOrder = async (file: File, isApproved: boolean, reason: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reason", reason);
    formData.append("isApproved", isApproved ? "true" : "false");

    const result = await dispatch(compensateAPreOrderThunk({ id: preOrder!.id, file: formData }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Pre-order compensation processed successfully");
      onSuccess?.();
      dispatch(getPreOrdersForSaleStaffThunk(params));
    } else {
      toast.error("Failed to process pre-order compensation");
    }
  };

  const handleCancelPreorderAfterPayment = async (reason: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reason", reason);

    const result = await dispatch(
      obligateRefundAPreOrderThunk({ id: preOrder!.id, file: formData }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Pre-order refund obligated successfully");
      onSuccess?.();
      dispatch(getPreOrdersForSaleStaffThunk(params));
    } else {
      toast.error("Failed to obligate pre-order refund");
    }
  };

  const handleRefundRequestOrder = async (file: File, reason: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reason", reason);

    const result = await dispatch(refundAPreOrderThunk({ id: preOrder!.id, file: formData }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Pre-order refund approved successfully");
      onSuccess?.();
      dispatch(getPreOrdersForSaleStaffThunk(params));
    } else {
      toast.error("Failed to approve pre-order refund");
    }
  };

  switch (preOrder?.status) {
    case "PAID":
      return (
        <ConfirmPreOrder
          preOrder={preOrder}
          onConfirm={handleConfirmPreorder}
          onCancel={handleCancelPreorderAfterPayment}
        />
      );
    case "CONFIRMED":
      if (preOrder.is_self_picked_up) {
        return <AwaitingPickupPreOrder preOrder={preOrder} onHandle={handleMarkReadyForPickup} />;
      }
      return <ShipPreOrder preOrder={preOrder} />;
    case "AWAITING_PICKUP":
      return (
        <CompleteSelfPickupPreOrder preOrder={preOrder} onHandle={handleCompletePickupPreorder} />
      );
    case "IN_TRANSIT":
    case "PRE_ORDERED":
    case "SHIPPED":
    case "DELIVERED":
      return <ShipPreOrder preOrder={preOrder} />;

    case "REFUND_REQUEST":
      return <RefundRequestPreOrder preOrder={preOrder} onHandle={handleRefundRequestOrder} />;
    case "COMPENSATE_REQUEST":
      return (
        <CompensateRequestPreOrder preOrder={preOrder} onHandle={handleCompensateRequestOrder} />
      );
  }
};

export default ChangePreOrderStatusModal;

// case "IN_TRANSIT":
//   return <ShipPreOrder preOrder={preOrder} onHandle={handleShipPreorder} />;
