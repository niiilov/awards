export interface SignInDto {
  login: string;
  password: string;
};

export type User = {
  id: string;
  full_name: string;
  login: string;
  role: string;
};

export interface AuthResponse {
  message: string;
  status: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: User;
}