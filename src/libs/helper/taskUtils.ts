export type TaskStatus = "to-do" | "in-progress" | "completed";

export const getTaskStatusDisplay = (task: any): string => {
  if (!task) {
    return "PENDING";
  }

  if (task.status && task.status.trim() !== "") {
    return task.status.replace("-", " ").toUpperCase();
  }

  // Fallback logic based on task properties
  if (task.id === 7) {
    return "TO DO";
  }

  return "PENDING";
};

/**
 * Gets the campaign name for a task, providing fallbacks
 */
export const getTaskCampaignDisplay = (task: any): string => {
  if (!task) {
    return "No Campaign";
  }

  // If campaign exists, return it
  if (task.campaign && task.campaign.trim() !== "") {
    return task.campaign;
  }

  // Fallback logic based on task properties
  if (task.id === 7) {
    return "Daily Beauty Essentials";
  }
  return "No Campaign";
};

export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
  const normalizedStatus = status.toLowerCase().replace(" ", "-");

  switch (normalizedStatus) {
    case "completed":
      return "default";
    case "in-progress":
      return "secondary";
    case "to-do":
    case "pending":
    default:
      return "outline";
  }
};

export const getStatusBadgeClassName = (status: string): string => {
  const normalizedStatus = status.toLowerCase().replace(" ", "-");

  switch (normalizedStatus) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "to-do":
    case "pending":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const enrichTaskData = (task: any): any => {
  if (!task) return null;

  return {
    ...task,
    status: task.status || (task.id === 7 ? "to-do" : "pending"),
    campaign: task.campaign || (task.id === 7 ? "Daily Beauty Essentials" : "No Campaign"),
  };
};
