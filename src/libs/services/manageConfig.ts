import api from "@/libs/api";

export const manageConfig = {
  getRepresentativeConfig: () => api.get("/configs/representative"),
};
