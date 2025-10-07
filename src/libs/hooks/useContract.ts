import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContract = () => {
  const { loading, contracts, pagination, actionLoading, detailLoading, contractDetail } =
    useSelector((state: RootState) => state.manageContract);
  return { loading, contracts, pagination, actionLoading, detailLoading, contractDetail };
};
