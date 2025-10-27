import { authStore } from "../store/authStore";

export const useAuth = () => {
  return {
    user: authStore.user,
    isAuth: authStore.isAuthenticated,
    loading: authStore.loading,
    error: authStore.error,
    isAuthChecked: authStore.isAuthChecked,
    signIn: authStore.signIn.bind(authStore),
    logout: authStore.logout.bind(authStore),
  };
};