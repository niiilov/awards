// features/auth/api/authHelpers.ts
import type { User } from "@features/auth/api/types";

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const saveTokens = (accessToken: string, refreshToken: string, user?: User) => {
  if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
    console.error('Попытка сохранить невалидный access token');
    return;
  }
  
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  // Сохраняем пользователя если передан
  if (user) {
    localStorage.setItem('userData', JSON.stringify(user));
  }
  
  console.log('Токены и пользователь сохранены');
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  
  if (!token || token === 'undefined' || token === 'null') {
    console.log('Access token не найден или невалиден');
    return null;
  }
  
  return token;
};

export const getRefreshToken = (): string | null => {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  
  if (!token || token === 'undefined' || token === 'null') {
    console.log('Refresh token не найден или невалиден');
    return null;
  }
  
  return token;
};

export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  console.log('Токены удалены');
};

export const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  if (token === 'undefined') return false;
  if (token === 'null') return false;
  if (token.length < 10) return false;
  return true;
};