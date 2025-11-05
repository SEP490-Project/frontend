import api from "@/libs/api";
import type { TaskListParams, SingleTaskResponse } from "@/libs/types/task";

export const manageTask = {
  getTasksByProfile: (params?: TaskListParams) => {
    return api.get("/tasks/profile", { params });
  },

  getTaskById: (taskId: string) => {
    return api.get<SingleTaskResponse>(`/tasks/${taskId}`);
  },

  getTaskListMarketing: (params: {
    page: number;
    limit: number;
    created_by_id?: string;
    assigned_to_id?: string;
    milestone_id?: string;
    campaign_id?: string;
    contract_id?: string;
    deadline_from_date?: string;
    deadline_to_date?: string;
    updated_from_date?: string;
    updated_to_date?: string;
    status?: string;
    type?: string;
    sort_by?: string;
    sort_order?: string;
  }) => api.get("/tasks", { params }),

  assignTask: (params: { task_id: string; user_id: string }) => {
    return api.post(`/tasks/${params.task_id}/assign/${params.user_id}`);
  },

  getTaskDetailMarketing: (taskId: string) => {
    return api.get(`/tasks/${taskId}`);
  },
};
