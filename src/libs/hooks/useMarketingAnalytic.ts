import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useMarketingAnalytic = () => {
  const { loading, dashboard } = useSelector((state: RootState) => state.manageMarketingAnalytic);
  return { loading, dashboard };
};
