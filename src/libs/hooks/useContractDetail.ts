import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  getContractById,
  approveContract,
  rejectContract,
} from "@/libs/stores/contractManager/thunk";
import { manageContractActions } from "@/libs/stores/contractManager/slice";
import type { RootState, AppDispatch } from "@/libs/stores";

export const useContractDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { detailLoading, contractDetail, actionLoading } = useSelector(
    (state: RootState) => state.manageContract,
  );

  const fetchContractDetail = useCallback(
    (contractId: string) => {
      dispatch(getContractById(contractId));
    },
    [dispatch],
  );

  const approveContractAction = useCallback(
    (contractId: string) => {
      return dispatch(approveContract(contractId));
    },
    [dispatch],
  );

  const rejectContractAction = useCallback(
    (contractId: string) => {
      return dispatch(rejectContract(contractId));
    },
    [dispatch],
  );

  const clearContractDetail = useCallback(() => {
    dispatch(manageContractActions.clearContractDetail());
  }, [dispatch]);

  return {
    detailLoading,
    contractDetail,
    actionLoading,
    fetchContractDetail,
    approveContractAction,
    rejectContractAction,
    clearContractDetail,
  };
};
