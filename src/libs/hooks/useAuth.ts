import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useAuth = () => {
  const { loading, isAuthenticated, role, user, accessToken, refreshToken, error } = useSelector(
    (state: RootState) => state.manageAuthen,
  );

  return {
    loading,
    isAuthenticated,
    role,
    user,
    accessToken,
    refreshToken,
    error,
  };
};
