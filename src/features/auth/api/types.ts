export interface SignInDto {
  username: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
};

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  id: string;
  username: string;
}