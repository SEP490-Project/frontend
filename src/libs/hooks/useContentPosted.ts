import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const usePostedContent = () => {
  const { loading, postedContents, postedContent, pagination } = useSelector(
    (state: RootState) => state.managePostedContent,
  );
  return { loading, postedContents, postedContent, pagination };
};
