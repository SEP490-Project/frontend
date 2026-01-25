import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useUserManager = () => {
  const { users, loading, error } = useSelector((state: RootState) => state.manageUser);

  return {
    users: users?.data || [],
    loading,
    error,
    pagination: users?.pagination,
    success: users?.success,
    message: users?.message,
  };
};
