import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const usePayment = () => {
  const {
    loading,
    payments,
    paymentProfile,
    pagination,
    detailLoading,
    paymentDetail,
    linkLoading,
    paymentLink,
  } = useSelector((state: RootState) => state.managePayment);

  return {
    loading,
    payments,
    paymentProfile,
    pagination,
    detailLoading,
    paymentDetail,
    linkLoading,
    paymentLink,
  };
};
