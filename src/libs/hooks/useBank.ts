import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useBank = () => {
  const { loading, bank } = useSelector((state: RootState) => state.manageBank);
  return { loading, bank };
};
