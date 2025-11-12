import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContentMarketing = () => {
  const { loading, contents, content, pagination } = useSelector(
    (state: RootState) => state.manageContentMarketing,
  );
  return { loading, contents, content, pagination };
};
