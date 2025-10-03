import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useAuth = () => {
  const { loading } = useSelector((state: RootState) => state.manageAuthen);
  return { loading };
};
