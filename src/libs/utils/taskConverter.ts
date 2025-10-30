import type { Task } from "@/libs/types/task";

// Legacy interface for backward compatibility with existing components
export interface LegacyTask {
  id: string; // Keep original UUID - no conversion needed
  title: string;
  type: string; // Keep original API type instead of converting
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
    id: apiTask.id, // Keep original UUID - simple and clean
    title: apiTask.name,
    type: apiTask.type, // Keep original API type without conversion
    campaign: `Campaign ${apiTask.campaign_id.slice(-6)}`, // Use part of campaign_id as campaign name
    status: mapApiStatusToLegacy(apiTask.status),
    details: {
      description: (() => {
        // Safely handle description field that might be an object or string
        if (apiTask.description) {
          if (typeof apiTask.description === "string") return apiTask.description;
          if (typeof apiTask.description === "object") {
            // If it's an object, try to extract meaningful content
            const desc = apiTask.description as any;
            if (desc.details && typeof desc.details === "string") return desc.details;
            if (desc.description && typeof desc.description === "string") return desc.description;
            // If it's a simple string in an object wrapper, try to extract it
            if (typeof desc === "string") return desc;
            // Fallback to JSON string representation
            return JSON.stringify(desc);
          }
        }

        // If no description field, try to create a meaningful description from available data
        if (apiTask.name && apiTask.name.trim()) {
          // Use the task name directly as it's already descriptive
          return apiTask.name;
        }

        // Fallback to task type
        if (apiTask.type) {
          return `Task type: ${apiTask.type}`;
        }

        return "No description available";
      })(),
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
      return "Post";
    case "Design":
      return "Video"; // Map Design to Video for now
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
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "No deadline";
  }
};

export const getTaskColor = (type: string): string => {
  switch (type) {
    case "CONTENT":
      return "#f7c06d"; // Yellow for content tasks
    case "MARKETING":
      return "#ff88fa"; // Pink for marketing tasks
    case "PRODUCT":
      return "#9976ff"; // Purple for product tasks
    case "Design":
      return "#ff88fa"; // Pink for design tasks (same as marketing)
    default:
      return "#9976ff"; // Purple for unknown tasks
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
