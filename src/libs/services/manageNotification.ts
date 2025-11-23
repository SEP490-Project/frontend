import api from "@/libs/api";

export const manageNotification = {
  notifications: (params: {
    page: number;
    limit: number;
    user_id?: string;
    type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) => api.get("/notifications", { params }),
  notificationDetail: (id: string) => api.get(`/notifications/${id}`),
};
