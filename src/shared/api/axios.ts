// shared/api/axios.ts
import axios from "axios";
import { API_BASE_URL } from "@shared/config";
import {
  getAccessToken,
  isValidToken,
  removeTokens,
} from "@features/auth/api/authHelpers";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Добавлен заголовок Authorization для URL:", config.url);
    } else {
      console.log("Токен невалиден, заголовок не добавлен");
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    // Логируем CORS информацию только если есть заголовки
    const corsOrigin = response.headers["access-control-allow-origin"];
    if (corsOrigin) {
      console.log("✅ CORS разрешен для origin:", corsOrigin);
      console.log("✅ Запрос успешен, статус:", response.status);
    }
    return response;
  },
  (error) => {
    console.log("=== ОШИБКА API ===");
    console.log("URL:", error.config?.url);
    console.log("Метод:", error.config?.method);
    console.log("Статус:", error.response?.status);

    // Более детальная информация об ошибке
    if (error.response) {
      console.log("Данные ошибки:", error.response.data);
      console.log("Заголовки ответа:", error.response.headers);
    }

    if (error.code === "ERR_NETWORK") {
      console.error("❌ Сетевая ошибка");
    }

    if (error.response?.status === 401) {
      console.log("🔐 Обнаружена 401 ошибка, выполняем logout");
      removeTokens();
    }

    return Promise.reject(error);
  },
);

export { api };
