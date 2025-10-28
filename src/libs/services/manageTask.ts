import api from "@/libs/api";
import type { TaskListParams, SingleTaskResponse } from "@/libs/types/task";

export const manageTask = {
  getTasksByProfile: (params?: TaskListParams) => {
    return api.get("/tasks/profile", { params });
  },

  getTaskById: (taskId: string) => {
    return api.get<SingleTaskResponse>(`/tasks/${taskId}`);
  },
};
