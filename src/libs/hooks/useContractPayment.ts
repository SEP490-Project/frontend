import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContractPayment = () => {
  const {
    loading,
    detailLoading,
    contractPayments,
    contractPaymentBrand,
    pagination,
    contractPaymentDetail,
    paymentLink,
    loadingPayment,
  } = useSelector((state: RootState) => state.manageContractPayment);
  return {
    loading,
    detailLoading,
    contractPayments,
    contractPaymentBrand,
    pagination,
    contractPaymentDetail,
    paymentLink,
    loadingPayment,
  };
};
