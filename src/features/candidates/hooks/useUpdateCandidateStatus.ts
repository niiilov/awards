// features/candidates/hooks/useUpdateCandidateStatus.ts
import { useState } from "react";

export const useUpdateCandidateStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCandidateStatus = async (candidateId: string, newStatus: string) => {
    setLoading(true);
    setError(null);

    try {
      const { api } = await import("@shared/api/axios");
      
      console.log('Обновление статуса кандидата:', {
        candidateId,
        newStatus
      });

      // Отправляем только статус или минимальные необходимые данные
      const updateData = {
        status: newStatus
      };

      console.log('Данные для обновления статуса:', updateData);

      // Используем правильный эндпоинт
      const response = await api.put(`/candidates-status/${candidateId}`, updateData);

      console.log('Статус кандидата успешно обновлен:', response.data);
      return response.data;
    } catch (err: any) {
      console.error("Ошибка при обновлении статуса кандидата:", err);
      console.error("Детали ошибки:", err.response?.data);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Не удалось обновить статус кандидата";
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    updateCandidateStatus,
    loading,
    error,
    clearError,
  };
};