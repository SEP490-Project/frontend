import api from "../api";
import type { UserData } from "../types/user";

export const manageUser = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (updateData: UserData) => api.put("/users/profile", updateData),
};
