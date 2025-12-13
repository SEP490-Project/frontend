import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useConfig = () => {
  const { loading, updating, allConfigs, representativeConfig, termsOfService, privacyPolicy } =
    useSelector((state: RootState) => state.manageConfig);
  return { loading, updating, allConfigs, representativeConfig, termsOfService, privacyPolicy };
};
