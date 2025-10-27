import type { Task } from "@/libs/types/task";

// Legacy interface for backward compatibility with existing components
export interface LegacyTask {
  id: number;
  title: string;
  type: "Blog" | "Video" | "Post";
  campaign: string;
  status: "to-do" | "in-progress" | "completed";
  details: {
    description: string;
    assignee: string;
    dueTime: string;
    priority: "High" | "Medium" | "Low";
  };
  color: string;
}

export interface LegacyTasksByDate {
  date: string;
  items: LegacyTask[];
}

// Utility functions to convert API data to legacy format
export const convertApiTaskToLegacy = (apiTask: Task): LegacyTask => {
  return {
    id: parseInt(apiTask.id.slice(-6), 16) || Math.floor(Math.random() * 1000), // Convert UUID to number
    title: apiTask.name,
    type: mapApiTypeToLegacy(apiTask.type),
    campaign: `Campaign ${apiTask.campaign_id.slice(-6)}`, // Use part of campaign_id as campaign name
    status: mapApiStatusToLegacy(apiTask.status),
    details: {
      description: apiTask.description || "No description available",
      assignee: apiTask.assigned_to_name,
      dueTime: formatDeadline(apiTask.deadline),
      priority: "Medium", // Default priority since API doesn't provide this
    },
    color: getTaskColor(apiTask.type),
  };
};

export const mapApiTypeToLegacy = (apiType: string): "Blog" | "Video" | "Post" => {
  switch (apiType) {
    case "CONTENT":
      return "Blog";
    case "MARKETING":
      return "Video";
    case "PRODUCT":
    default:
      return "Post";
  }
};

export const mapApiStatusToLegacy = (apiStatus: string): "to-do" | "in-progress" | "completed" => {
  switch (apiStatus) {
    case "TODO":
      return "to-do";
    case "IN_PROGRESS":
      return "in-progress";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    default:
      return "to-do";
  }
};

export const formatDeadline = (deadline: string): string => {
  try {
    const date = new Date(deadline);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "All day";
  }
};

export const getTaskColor = (type: string): string => {
  switch (type) {
    case "CONTENT":
      return "#f7c06d"; // Yellow for content tasks
    case "MARKETING":
      return "#ff88fa"; // Pink for marketing tasks
    case "PRODUCT":
    default:
      return "#9976ff"; // Purple for product tasks
  }
};

// Group tasks by date for calendar and timeline views
export const groupTasksByDate = (tasks: Task[]): LegacyTasksByDate[] => {
  const grouped: Record<string, LegacyTask[]> = {};

  tasks.forEach((task) => {
    const dateKey = new Date(task.deadline).toISOString().split("T")[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(convertApiTaskToLegacy(task));
  });

  return Object.entries(grouped)
    .map(([date, items]) => ({ date, items }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Convert legacy status back to API format (for future updates)
export const mapLegacyStatusToApi = (legacyStatus: string): string => {
  switch (legacyStatus) {
    case "to-do":
      return "TODO";
    case "in-progress":
      return "IN_PROGRESS";
    case "completed":
      return "COMPLETED";
    default:
      return "TODO";
  }
};
