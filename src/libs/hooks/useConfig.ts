import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useConfig = () => {
  const { loading, allConfigs, representativeConfig, termsOfService, privacyPolicy } = useSelector(
    (state: RootState) => state.manageConfig,
  );
  return { loading, allConfigs, representativeConfig, termsOfService, privacyPolicy };
};
