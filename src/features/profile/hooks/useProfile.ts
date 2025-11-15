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

    setLoading(true);

    try {
      const { api } = await import("@shared/api/axios");
      
      // TODO: Заменить на реальный эндпоинт смены пароля когда он будет доступен
      // Временно используем моковый вызов
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Пример реального вызова (раскомментировать когда API будет готово):
      // await api.put("/auth/change-password", {
      //   username,
      //   oldPassword: passwordData.oldPassword,
      //   newPassword: passwordData.newPassword,
      // });

      // Временная заглушка - всегда успех для демонстрации
      setSuccess(true);
      handleCancel(); // Очищаем поля после успешного сохранения
      
    } catch (err: any) {
      console.error("Ошибка смены пароля:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось изменить пароль. Пожалуйста, попробуйте позже."
      );
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