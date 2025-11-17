// features/auth/hooks/useSignUp.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setGeneralError(null);

    // Валидация согласно NewUserRequest
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Введите корректный email адрес");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);

    try {
      const { api } = await import("@shared/api/axios");
      
      // Отправляем данные согласно NewUserRequest структуре
      const response = await api.post("/auth/new-login", {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        // fullName не отправляем, так как его нет в NewUserRequest
      });

      if (response.status === 201) {
        // Успешная регистрация
        navigate("/sign-in", { 
          state: { message: "Регистрация успешна! Теперь вы можете войти." } 
        });
      }
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      
      if (err.response?.status === 400) {
        // Проверяем конкретную ошибку от сервера
        const errorMessage = err.response?.data?.error;
        if (errorMessage?.includes("already exists") || errorMessage?.includes("уже существует")) {
          setError("Пользователь с таким именем или email уже существует");
        } else {
          setError(errorMessage || "Ошибка валидации данных");
        }
      } else if (err.response?.status === 500) {
        setGeneralError("Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.");
      } else {
        setGeneralError(
          err.response?.data?.message || 
          "Не удалось завершить регистрацию. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setError(null);
    setGeneralError(null);
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    error,
    generalError,
    loading,
    onSubmit,
    clearErrors,
  };
};