import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useTaskMarketing = () => {
  const { loading, taskListMarketing, pagination, actionLoading, detailLoading } = useSelector(
    (state: RootState) => state.manageTask,
  );
  return { loading, taskListMarketing, pagination, actionLoading, detailLoading };
};
