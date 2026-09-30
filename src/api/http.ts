import axios, { AxiosError, Method } from "axios";

export type ApiErrorPayload = {
  message?: string;
  [k: string]: unknown;
};

export type HttpError<E = unknown> = {
  status: number;
  message: string;
  data?: E;
  url?: string;
  method?: Method;
};

const BASE_URL = "http://127.0.0.1:3123"; // move to .env in real projects

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => config);

// Normalized errors with type checks
http.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (!axios.isAxiosError(err)) {
      const out: HttpError = {
        status: 0,
        message: err instanceof Error ? err.message : "Request failed",
      };
      return Promise.reject(out);
    }

    const e = err as AxiosError<ApiErrorPayload>;
    const status = e.response?.status ?? 0;
    const data = e.response?.data;
    const url = e.config?.url;
    const method = e.config?.method as Method | undefined;

    const message =
      (typeof data === "object" && data && typeof data.message === "string"
        ? data.message
        : e.message) || "Request failed";

    const out: HttpError<ApiErrorPayload> = {
      status,
      message,
      data,
      url,
      method,
    };
    return Promise.reject(out);
  }
);

export default http;