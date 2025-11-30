import { useSelector } from "react-redux";
import { useCallback } from "react";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { channelList } from "@/libs/stores/channelManager/thunk";

export const useChannel = () => {
  const dispatch = useAppDispatch();
  const { loading, channel } = useSelector((state: RootState) => state.manageChannel);

  const fetchChannels = useCallback(() => {
    dispatch(channelList());
  }, [dispatch]);

  return { loading, channel, fetchChannels };
};
