import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useMarketingAnalytic = () => {
  const {
    loading,
    loadingKPI,
    loadingRevenue,
    loadingTopBrands,
    loadingDeadlines,
    dashboard,
    activeBrands,
    activeCampaigns,
    draftCampaigns,
    monthlyRevenue,
    revenueByType,
    topBrands,
    upcomingDeadlines,
  } = useSelector((state: RootState) => state.manageMarketingAnalytic);
  return {
    loading,
    loadingKPI,
    loadingRevenue,
    loadingTopBrands,
    loadingDeadlines,
    dashboard,
    activeBrands,
    activeCampaigns,
    draftCampaigns,
    monthlyRevenue,
    revenueByType,
    topBrands,
    upcomingDeadlines,
  };
};
