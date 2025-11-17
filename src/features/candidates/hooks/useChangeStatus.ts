// features/candidates/hooks/useChangeStatus.ts
import { useState } from "react";

export const useChangeStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeCandidateStatus = async (candidateId: string, newStatus: string) => {
    try {
      setLoading(true);
      setError(null);

      const { api } = await import("@shared/api/axios");
      
      // Получаем текущие данные кандидата
      const currentResponse = await api.get(`/candidates/${candidateId}`);
      const currentCandidate = currentResponse.data;

      // Обновляем только статус, сохраняя остальные данные
      const updateData = {
        ...currentCandidate,
        status: newStatus
      };

      // Отправляем обновленные данные
      const response = await api.put(`/candidates/${candidateId}`, updateData);
      
      return response.data;
    } catch (err: any) {
      console.error("Ошибка при изменении статуса кандидата:", err);
      const errorMessage = err.response?.data?.message || "Не удалось изменить статус кандидата";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    changeCandidateStatus,
    loading,
    error,
    clearError,
  };
};