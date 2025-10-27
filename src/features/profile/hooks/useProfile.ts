import { useState } from "react";
import { api } from "@shared/api/axios";

interface ChangePasswordData {
  login: string;
  old_password: string;
  new_password: string;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useProfile = (userLogin: string) => {
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  const validatePasswordForm = (): boolean => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("Заполните все поля");
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Новые пароли не совпадают");
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return false;
    }

    return true;
  };

  const handleChangePassword = async (): Promise<boolean> => {
    if (!validatePasswordForm()) {
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const changePasswordData: ChangePasswordData = {
        login: userLogin,
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      };

      console.log("Отправка данных смены пароля:", changePasswordData);

      const response = await api.post(
        "/auth/change-password",
        changePasswordData
      );

      console.log("Ответ сервера:", response.data);

      if (response.status === 200) {
        setSuccess(true);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Ошибка при смене пароля:", err);
      console.error("Данные ошибки:", err.response?.data);

      // Более детальная обработка ошибок
      if (err.response?.status === 400) {
        setError("Неверный старый пароль или некорректные данные");
      } else if (err.response?.status === 500) {
        setError("Ошибка на сервере. Попробуйте позже.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Произошла ошибка при смене пароля");
      }
      return false;
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