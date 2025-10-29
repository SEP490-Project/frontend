import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";
import { manageCampaignActions } from "@/libs/stores/campaignManager/slice";

export const useCampaign = () => {
  const { loading, campaigns, pagination, detailLoading, campaignDetail, error } = useSelector(
    (state: RootState) => state.manageCampaign,
  );
  return {
    loading,
    campaigns,
    pagination,
    detailLoading,
    campaignDetail,
    error,
    actions: manageCampaignActions, // Export actions để có thể dùng clearError nếu cần
  };
};
