import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContentMarketing = () => {
  const { loading, detailLoading, contents, content, pagination } = useSelector(
    (state: RootState) => state.manageContentMarketing,
  );
  return { loading, detailLoading, contents, content, pagination };
};
