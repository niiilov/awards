// features/auth/api/authHelpers.ts
import type { User } from "@features/auth/api/types";

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

export const saveTokens = (accessToken: string, refreshToken: string, user?: User) => {
  if (!isValidToken(accessToken)) {
    console.error('Попытка сохранить невалидный access token');
    return;
  }
  
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  if (refreshToken && isValidToken(refreshToken)) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  // Сохраняем пользователя если передан
  if (user) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
  
  console.log('Токены и пользователь сохранены');
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  
  if (!isValidToken(token)) {
    console.log('Access token не найден или невалиден');
    return null;
  }
  
  return token;
};

export const getRefreshToken = (): string | null => {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!isValidToken(token)) {
    console.log('Refresh token не найден или невалиден');
    return null;
  }
  
  return token;
};

export const getUserData = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) return null;
    
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Ошибка при чтении данных пользователя:', error);
    return null;
  }
};

export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  console.log('Токены и данные пользователя удалены');
};

export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  if (token === 'undefined') return false;
  if (token === 'null') return false;
  if (token.length < 10) return false;
  return true;
};