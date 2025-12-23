import api from "@/libs/api";
import type {
  ScheduleFilterParams,
  ScheduleContentRequest,
  BatchScheduleRequest,
  RescheduleContentRequest,
} from "@/libs/types/schedule";

export const manageSchedule = {
  // ========== Generic Schedule Endpoints ==========

  /**
   * List all schedules with filtering and pagination
   * Staff can only see their own schedules unless they are Admin/Marketing Manager
   */
  listSchedules: (params: ScheduleFilterParams) => {
    return api.get("/schedules", { params });
  },

  /**
   * Get schedule details by ID
   */
  getSchedule: (scheduleId: string) => {
    return api.get(`/schedules/${scheduleId}`);
  },

  /**
   * Cancel a schedule
   */
  cancelSchedule: (scheduleId: string) => {
    return api.delete(`/schedules/${scheduleId}`);
  },

  /**
   * Get upcoming schedules
   */
  getUpcomingSchedules: (params?: { limit?: number }) => {
    return api.get("/schedules/upcoming", { params });
  },

  // ========== Content Schedule Endpoints ==========

  /**
   * Schedule content for publishing to a single channel
   */
  scheduleContent: (data: ScheduleContentRequest) => {
    return api.post("/schedules/contents", data);
  },

  /**
   * Batch schedule content to multiple channels with different times
   */
  batchScheduleContent: (data: BatchScheduleRequest) => {
    return api.post("/schedules/contents/batch", data);
  },

  /**
   * Reschedule content to a new time
   */
  rescheduleContent: (scheduleId: string, data: Omit<RescheduleContentRequest, "schedule_id">) => {
    return api.put(`/schedules/contents/${scheduleId}/reschedule`, data);
  },

  /**
   * Get all schedules for a specific content
   */
  getSchedulesByContent: (contentId: string, params?: ScheduleFilterParams) => {
    return api.get(`/schedules/contents/content/${contentId}`, { params });
  },
};
