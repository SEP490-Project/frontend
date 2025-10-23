import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/libs/stores";
import type { RootState } from "@/libs/stores";
import {
  contents,
  createContent,
  contentDetail,
  updateContent,
  deleteContent,
  publishContent,
  unpublishContent,
} from "@/libs/stores/contentManager/thunk";
import { clearError, clearContent } from "@/libs/stores/contentManager/slice";
import type {
  ContentListParams,
  CreateContentRequest,
  UpdateContentRequest,
} from "@/libs/types/content";

export const useContentManager = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    contents: contentList,
    content,
    pagination,
    error,
  } = useSelector((state: RootState) => state.manageContent);

  const fetchContents = useCallback(
    (params: ContentListParams) => {
      return dispatch(contents(params));
    },
    [dispatch],
  );

  const createNewContent = useCallback(
    (data: CreateContentRequest) => {
      return dispatch(createContent(data));
    },
    [dispatch],
  );

  const fetchContentDetail = useCallback(
    (id: string) => {
      return dispatch(contentDetail(id));
    },
    [dispatch],
  );

  const updateExistingContent = useCallback(
    (data: UpdateContentRequest) => {
      return dispatch(updateContent(data));
    },
    [dispatch],
  );

  const removeContent = useCallback(
    (id: string) => {
      return dispatch(deleteContent(id));
    },
    [dispatch],
  );

  const publishExistingContent = useCallback(
    (id: string) => {
      return dispatch(publishContent(id));
    },
    [dispatch],
  );

  const unpublishExistingContent = useCallback(
    (id: string) => {
      return dispatch(unpublishContent(id));
    },
    [dispatch],
  );

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrentContent = useCallback(() => {
    dispatch(clearContent());
  }, [dispatch]);

  return {
    // State
    loading,
    contentList,
    content,
    pagination,
    error,

    // Actions
    fetchContents,
    createNewContent,
    fetchContentDetail,
    updateExistingContent,
    removeContent,
    publishExistingContent,
    unpublishExistingContent,
    clearErrors,
    clearCurrentContent,
  };
};
