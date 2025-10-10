import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useCampaign = () => {
  const { loading, campaigns, pagination } = useSelector(
    (state: RootState) => state.manageCampaign,
  );
  return { loading, campaigns, pagination };
};
