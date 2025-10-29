import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

// Hook để lấy state file
export const useFile = () => {
  const { loading, dataFiles } = useSelector((state: RootState) => state.manageFile);

  return {
    loading,
    dataFiles,
  };
};
