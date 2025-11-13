import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContractPayment = () => {
  const {
    loading,
    contractPayments,
    contractPaymentBrand,
    pagination,
    contractPaymentDetail,
    paymentLink,
    loadingPayment,
  } = useSelector((state: RootState) => state.manageContractPayment);
  return {
    loading,
    contractPayments,
    contractPaymentBrand,
    pagination,
    contractPaymentDetail,
    paymentLink,
    loadingPayment,
  };
};
