// вход
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useSignIn = () => {
  const { signIn, loading } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setGeneralError(null);

    // Валидация
    if (!login.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    try {
      // Используем username вместо login согласно вашему API
      const success = await signIn({ 
        username: login.trim(), 
        password: password.trim() 
      });

      if (success) {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError("Неверный логин или пароль. Попробуйте снова.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setGeneralError(
        errorMessage || "Не удалось выполнить вход. Пожалуйста, попробуйте позже."
      );
      console.error("Ошибка входа:", err);
    }
  };

  const clearErrors = () => {
    setError(null);
    setGeneralError(null);
  };

  return {
    login,
    setLogin,
    password,
    setPassword,
    error,
    generalError,
    loading,
    onSubmit,
    clearErrors,
  };
};