import { useSelector } from "react-redux";
import type { RootState } from "@/libs/stores";

export const useTask = () => {
  const {
    loading,
    taskListMarketing,
    taskDetail,
    taskDetailById,
    pagination,
    actionLoading,
    detailLoading,
    // Profile tasks
    profileTasks,
    profileTasksLoading,
    selectedProfileTask,
    profilePagination,
  } = useSelector((state: RootState) => state.manageTask);

  return {
    loading,
    taskListMarketing,
    taskDetail,
    taskDetailById,
    pagination,
    actionLoading,
    detailLoading,
    // Profile tasks
    profileTasks,
    profileTasksLoading,
    selectedProfileTask,
    profilePagination,
  };
};
