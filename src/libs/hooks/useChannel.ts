import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useChannel = () => {
  const { loading, channel } = useSelector((state: RootState) => state.manageChannel);
  return { loading, channel };
};
