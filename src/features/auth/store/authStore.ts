import { makeAutoObservable, runInAction } from "mobx";
import { saveTokens, removeTokens, getAccessToken, isValidToken, getUserData } from "../api/authHelpers";
import type { User, SignInDto, AuthResponse } from "../api/types";

class AuthStore {
  user: User | null = null;
  accessToken: string | null = null;
  refreshToken: string | null = null;
  loading = false;
  error: string | null = null;
  isAuthChecked = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  async initializeAuth() {
    console.log('=== initializeAuth вызван ===');
    const token = getAccessToken();
    console.log('Токен из getAccessToken:', token);
    
    runInAction(() => {
      this.accessToken = token;
    });
    
    if (isValidToken(token)) {
      console.log('Токен валиден');
      // Восстанавливаем пользователя из localStorage
      this.restoreUserFromStorage();
    } else {
      console.log('Токен невалиден или отсутствует');
    }
    
    runInAction(() => {
      this.isAuthChecked = true;
    });
    
    console.log('=== initializeAuth завершен ===');
    console.log('Access Token:', this.accessToken);
    console.log('Пользователь:', this.user);
    console.log('isAuthChecked:', this.isAuthChecked);
  }

  // Восстановление пользователя из localStorage между сессиями
  restoreUserFromStorage() {
    try {
      console.log('=== restoreUserFromStorage вызван ===');
      const user = getUserData();
      console.log('Данные пользователя из localStorage:', user);
      
      if (user) {
        runInAction(() => {
          this.user = user;
        });
        console.log('Пользователь восстановлен из localStorage');
      } else {
        console.log('Пользователь не найден в localStorage');
        
        // Современный способ
        console.log('Все ключи в localStorage:');
        for (const key of Object.keys(localStorage)) {
          console.log(`Ключ: ${key}, Значение: ${localStorage.getItem(key)}`);
        }
      }
    } catch (e) {
      console.log('Ошибка восстановления пользователя:', e);
    }
  }

  async signIn(dto: SignInDto) {
    this.loading = true;
    this.error = null;
    
    try {
      const { api } = await import("@shared/api/axios");
      console.log('=== Отправка запроса на вход ===');
      console.log('Данные:', dto);

      // Исправляем данные для отправки согласно вашему API
      const requestData = {
        username: dto.username, // меняем login на username
        password: dto.password,
      };

      console.log('Отправляемые данные:', requestData);

      // Меняем эндпоинт и тип запроса
      const response = await api.post<AuthResponse>("/auth/login", requestData);
      const data = response.data;
      
      console.log('=== Ответ от сервера ===');
      console.log('Данные:', data);

      if (!data.access_token) {
        throw new Error('Сервер не вернул access token');
      }

      console.log('Полученный access token:', data.access_token.substring(0, 20) + '...');

      // Создаем объект пользователя из ответа
      const user: User = {
        id: data.id,
        username: data.username,
      };

      runInAction(() => {
        this.user = user;
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
      });

      // Сохраняем токены и пользователя
      saveTokens(data.access_token, data.refresh_token, user);
      
      console.log('Токены и данные пользователя сохранены');
      
      runInAction(() => {
        this.isAuthChecked = true;
      });
      
      return true;
    } catch (e: any) {
      console.error('=== Ошибка входа ===', e);
      console.error('Детали ошибки:', e.response?.data);
      
      runInAction(() => {
        this.error = e.response?.data?.message || e.message || "Ошибка входа";
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    console.log('=== logout вызван ===');
    runInAction(() => {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAuthChecked = true;
      this.error = null;
    });
    removeTokens();
  }

  get isAuthenticated() {
    return isValidToken(this.accessToken) && !!this.user;
  }

  get userDisplayName() {
    return this.user?.username || "";
  }

  get userInitials() {
    if (!this.user?.username) return "";
    return this.user.username
      .split(" ")
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  }
}

export const authStore = new AuthStore();