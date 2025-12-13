import api from "@/libs/api";

export const manageConfig = {
  getAllConfigs: () => api.get("/configs"),
  getRepresentativeConfig: () => api.get("/configs/representative"),
  getTermsOfService: () => api.get("configs/public/term-of-service"),
  getPrivacyPolicy: () => api.get("configs/public/privacy-policy"),
  updateConfig: (key: string, value: string) => api.put(`/configs/${key}`, { value }),
  bulkUpdateConfigs: (configs: Record<string, string>) => api.put("/configs", configs),
};
