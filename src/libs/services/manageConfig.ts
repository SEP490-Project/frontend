import api from "@/libs/api";

export const manageConfig = {
  getRepresentativeConfig: () => api.get("/configs/representative"),
  getTermsOfService: () => api.get("configs/public/term-of-service"),
  getPrivacyPolicy: () => api.get("configs/public/privacy-policy"),
};
