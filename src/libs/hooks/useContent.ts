import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useContent = () => {
  const {
    loading,
    contents,
    content,
    tikTokCreatorInfo,
    aiModels,
    generatedContent,
    structuredContent,
    isStreaming,
    streamingContent,
    streamingTipTapContent,
    tokensUsed,
    pagination,
    error,
  } = useSelector((state: RootState) => state.manageContent);

  return {
    loading,
    contents,
    content,
    tikTokCreatorInfo,
    aiModels,
    generatedContent,
    structuredContent,
    isStreaming,
    streamingContent,
    streamingTipTapContent,
    tokensUsed,
    pagination,
    error,
  };
};
