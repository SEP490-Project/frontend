import axios, { type AxiosInstance } from "axios";

const goongApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_GOONG_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

goongApi.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_GOONG_API_KEY;
  if (!config.params) config.params = {};
  config.params.api_key = apiKey;
  return config;
});

export default goongApi;
