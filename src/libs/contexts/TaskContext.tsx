import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from "react";
import { manageTask } from "@/libs/services/manageTask";
import type { Task, TaskListParams, TaskResponse } from "@/libs/types/task";

interface TaskContextValue {
  // State
  loading: boolean;
  tasks: Task[];
  selectedTask: Task | null;
  error: string | null;
  pagination: {
    has_next: boolean;
    has_prev: boolean;
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };

  // Actions
  fetchTasksByProfile: (params?: TaskListParams) => Promise<void>;
  fetchTaskById: (taskId: string) => Promise<Task | undefined>;
  clearError: () => void;
  clearSelectedTask: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const useTaskManager = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskManager must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
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

  // Use refs to track ongoing requests and prevent duplicates
  const fetchTasksRequestRef = useRef<Promise<void> | null>(null);
  const fetchTaskByIdCache = useRef<Map<string, Promise<Task | undefined>>>(new Map());
  const isInitialized = useRef(false);

  const fetchTasksByProfile = useCallback(async (params?: TaskListParams) => {
    // If there's already a request in progress, return the existing promise
    if (fetchTasksRequestRef.current) {
      return fetchTasksRequestRef.current;
    }

    const requestPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await manageTask.getTasksByProfile(params);
        const taskResponse = response.data as TaskResponse;

        if (taskResponse && taskResponse.success) {
          setTasks(taskResponse.data || []);
          setPagination(taskResponse.pagination);
          isInitialized.current = true;
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
        // Clear the request reference when done
        fetchTasksRequestRef.current = null;
      }
    })();

    fetchTasksRequestRef.current = requestPromise;
    return requestPromise;
  }, []);

  // Initialize tasks on provider mount - only once
  useEffect(() => {
    let mounted = true;

    const initializeTasks = async () => {
      if (!isInitialized.current && mounted) {
        try {
          await fetchTasksByProfile();
        } catch (error) {
          console.error("Failed to initialize tasks:", error);
        }
      }
    };

    initializeTasks();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once on mount

  const fetchTaskById = useCallback(async (taskId: string) => {
    // Check if we already have a request for this task ID
    if (fetchTaskByIdCache.current.has(taskId)) {
      return fetchTaskByIdCache.current.get(taskId);
    }

    const requestPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await manageTask.getTaskById(taskId);

        // Handle the SingleTaskResponse format based on the actual API response
        if (response.data && response.data.success && response.data.data) {
          const taskData = response.data.data;
          setSelectedTask(taskData);
          return taskData;
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to fetch task details");
      } finally {
        setLoading(false);
        // Remove from cache after a short delay to allow for component updates
        setTimeout(() => {
          fetchTaskByIdCache.current.delete(taskId);
        }, 1000);
      }
    })();

    fetchTaskByIdCache.current.set(taskId, requestPromise);
    return requestPromise;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSelectedTask = useCallback(() => {
    setSelectedTask(null);
  }, []);

  const value: TaskContextValue = {
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

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
