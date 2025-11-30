import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useAdminAnalytic = () => {
  const {
    loading,
    loadingRevenue,
    loadingUserGrowth,
    loadingUserOverview,
    campaigns,
    contracts,
    health,
    revenue,
    userGrowth,
    userOverview,
  } = useSelector((state: RootState) => state.manageAdminAnalytic);
  return {
    loading,
    loadingRevenue,
    loadingUserGrowth,
    loadingUserOverview,
    campaigns,
    contracts,
    health,
    revenue,
    userGrowth,
    userOverview,
  };
};
