import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useBrand = () => {
  const { loading, brands, pagination } = useSelector((state: RootState) => state.manageBrand);
  return { loading, brands, pagination };
};
