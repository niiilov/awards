// отображение информации в профиле и смена пароля
import { useState } from "react";
import type { PasswordData } from "../api/types";

export const useProfile = (username: string) => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Сбрасываем ошибки при изменении полей
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleCancel = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError(null);
    setSuccess(false);
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(false);

    // Валидация
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Новые пароли не совпадают");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Новый пароль должен содержать минимум 6 символов");
      return;
    }

    // Проверка, что новый пароль отличается от старого
    if (passwordData.oldPassword === passwordData.newPassword) {
      setError("Новый пароль должен отличаться от старого");
      return;
    }

    setLoading(true);

    try {
      const { api } = await import("@shared/api/axios");
      
      // Реальный вызов API для смены пароля
      await api.post("/auth/change-password", {
        username: username,
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });

      setSuccess(true);
      handleCancel(); // Очищаем поля после успешного сохранения
      
    } catch (err: any) {
      console.error("Ошибка смены пароля:", err);
      
      // Обработка различных ошибок от сервера
      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message || 
          "Неверный старый пароль. Пожалуйста, проверьте введенные данные."
        );
      } else if (err.response?.status === 500) {
        setError(
          "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже."
        );
      } else {
        setError(
          err.response?.data?.message || 
          "Не удалось изменить пароль. Пожалуйста, попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    passwordData,
    loading,
    error,
    success,
    handlePasswordChange,
    handleCancel,
    handleChangePassword,
  };
};