export interface User {
  id: string;
  username: string;
  email: string; // Email теперь обязательное поле
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  id: string;
  username: string;
  email: string; // Email теперь обязательное поле в ответе
}

export interface SignInDto {
  username: string;
  password: string;
}