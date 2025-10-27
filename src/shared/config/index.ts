export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||"http://82.202.169.245:8091/api";

export const ROUTES = {
  HOME: "/",
  CHAT: "/chat",
  PROFILE: "/profile",
  SIGN_IN: "/sign-in",
  NOT_FOUND: "/404",
  SERVER_ERROR: "/500",
  DASHBOARD: "/dashboard",
  ORDER_LOG: "/order-log",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/sign-in",
    PROFILE: "/profile",
    DASHBOARD: "/dashboard",
    SIGN_OUT: "/auth/sign-out/",
    REFRESH: "/auth/refresh/",
    ORDER_LOG: "/order-log",
    REQUEST: "/request",
  },
} as const;
