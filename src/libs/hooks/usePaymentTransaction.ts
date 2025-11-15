import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const usePaymentTransaction = () => {
  const { loading, detailsLoading, errors, transactionDetails, transactions } = useSelector(
    (state: RootState) => state.manageTransaction,
  );
  return { loading, detailsLoading, errors, transactionDetails, transactions };
};
