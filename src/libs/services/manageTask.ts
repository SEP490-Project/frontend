import api from "@/libs/api";
import type { TaskListParams, SingleTaskResponse } from "@/libs/types/task";

export const manageTask = {
  getTasksByProfile: (params?: TaskListParams) => {
    return api.get("/tasks/profile", { params });
  },

  getTaskById: (taskId: string): Promise<SingleTaskResponse> => {
    return api.get(`/tasks/${taskId}`);
  },
};
