import { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { getRaw } from "./local-storage";

export interface ConsoleError {
  status: number;
  data: unknown;
}

export const requestInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = getRaw("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
};

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = async (error: AxiosError): Promise<never> => {
  if (error.response?.status === 401) {
    return Promise.reject(error);
  }

  if (error.response) {
    const errorMessage: ConsoleError = {
      status: error.response.status,
      data: error.response.data,
    };
    console.error(errorMessage);
  } else if (error.request) {
    console.error(error.request);
  } else {
    console.error("Error", error.message);
  }

  return Promise.reject(error);
};
