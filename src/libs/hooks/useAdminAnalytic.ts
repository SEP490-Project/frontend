import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useAdminAnalytic = () => {
  const {
    loading,
    loadingRevenue,
    loadingUserGrowth,
    loadingUserOverview,
    loadingSystemOverview,
    campaigns,
    contracts,
    health,
    revenue,
    userGrowth,
    userOverview,
    systemOverview,
  } = useSelector((state: RootState) => state.manageAdminAnalytic);
  return {
    loading,
    loadingRevenue,
    loadingUserGrowth,
    loadingUserOverview,
    loadingSystemOverview,
    campaigns,
    contracts,
    health,
    revenue,
    userGrowth,
    userOverview,
    systemOverview,
  };
};
