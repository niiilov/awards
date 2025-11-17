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

export interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  username: string;
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message?: string;
  // Дополнительные поля могут быть в ответе
  additionalProp1?: string;
  additionalProp2?: string;
  additionalProp3?: string;
}