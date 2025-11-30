import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContentAnalytic = () => {
  const {
    loadingCampaigns,
    loadingChannel,
    loadingPlatform,
    loadingStatus,
    loadingTop,
    loadingTrend,
    campaigns,
    channel,
    platform,
    status,
    top,
    trend,
  } = useSelector((state: RootState) => state.manageContentAnalytic);
  return {
    loadingCampaigns,
    loadingChannel,
    loadingPlatform,
    loadingStatus,
    loadingTop,
    loadingTrend,
    campaigns,
    channel,
    platform,
    status,
    top,
    trend,
  };
};
