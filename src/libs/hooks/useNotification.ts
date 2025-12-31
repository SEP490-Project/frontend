import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useNotificationStore = () => {
  const { loading, notifications, pagination, notification } = useSelector(
    (state: RootState) => state.manageNotification,
  );
  return { loading, notifications, pagination, notification };
};
