import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useConfig = () => {
  const { loading, representativeConfig } = useSelector((state: RootState) => state.manageConfig);
  return { loading, representativeConfig };
};
