import api from "../api";
import type { UserData, UserParams } from "../types/user";

export const manageUser = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (updateData: UserData) => api.put("/users/profile", updateData),
  getAllUsers: (params: UserParams) => api.get("/users", { params }),
  getUserDetailByAdmin: (userId: string) => api.get(`/users/${userId}`),
  updateUserStatus: (is_active: boolean, userId: string) =>
    api.put(`/users/${userId}/status`, { is_active }),
  activateBrand: (userId: string) => api.patch(`/users/${userId}/activate-brand`),
};
