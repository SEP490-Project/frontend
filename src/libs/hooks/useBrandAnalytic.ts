import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useBrandAnalytic = () => {
  const {
    loadingAffiliates,
    loadingCampaigns,
    loadingContent,
    loadingContracts,
    loadingRevenueTrend,
    loadingTopProducts,
    affiliates,
    campaigns,
    content,
    contracts,
    revenueTrend,
    topProducts,
  } = useSelector((state: RootState) => state.manageBrandAnalytic);
  return {
    loadingAffiliates,
    loadingCampaigns,
    loadingContent,
    loadingContracts,
    loadingRevenueTrend,
    loadingTopProducts,
    affiliates,
    campaigns,
    content,
    contracts,
    revenueTrend,
    topProducts,
  };
};
