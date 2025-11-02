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
  // unpublishContent,
  submitContent,
  approveContent,
  rejectContent,
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
    (id: string, publishDate?: string) => {
      return dispatch(publishContent({ id, publishDate }));
    },
    [dispatch],
  );

  // const unpublishExistingContent = useCallback(
  //   (id: string) => {
  //     return dispatch(unpublishContent(id));
  //   },
  //   [dispatch],
  // );

  const submitExistingContent = useCallback(
    (id: string) => {
      return dispatch(submitContent(id));
    },
    [dispatch],
  );

  const approveExistingContent = useCallback(
    (id: string) => {
      return dispatch(approveContent(id));
    },
    [dispatch],
  );

  const rejectExistingContent = useCallback(
    (id: string, feedback: string) => {
      return dispatch(rejectContent({ id, feedback }));
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
    // unpublishExistingContent,
    submitExistingContent,
    approveExistingContent,
    rejectExistingContent,
    clearErrors,
    clearCurrentContent,
  };
};
