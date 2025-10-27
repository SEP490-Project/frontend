import { useCallback, useState } from "react";
import { manageTask } from "@/libs/services/manageTask";
import type { Task, TaskListParams, TaskResponse } from "@/libs/types/task";

export const useTaskManager = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    has_next: false,
    has_prev: false,
    limit: 10,
    page: 1,
    total: 0,
    total_pages: 0,
  });

  const fetchTasksByProfile = useCallback(async (params?: TaskListParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await manageTask.getTasksByProfile(params);
      const taskResponse = response.data as TaskResponse;

      if (taskResponse && taskResponse.success) {
        setTasks(taskResponse.data || []);
        setPagination(taskResponse.pagination);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTaskById = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await manageTask.getTaskById(taskId);

      if (response.data) {
        setSelectedTask(response.data);
        return response.data;
      }
    } catch (err) {
      console.error("Error fetching task:", err);
      setError("Failed to fetch task details");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelectedTask = useCallback(() => {
    setSelectedTask(null);
  }, []);

  return {
    // State
    loading,
    tasks,
    selectedTask,
    error,
    pagination,

    // Actions
    fetchTasksByProfile,
    fetchTaskById,
    clearError,
    clearSelectedTask,
  };
};
