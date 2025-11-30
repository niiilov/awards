// features/candidates/hooks/useDeleteCandidate.ts
import { useState } from "react";

export const useDeleteCandidate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCandidate = async (candidateId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { api } = await import("@shared/api/axios");
      
      console.log('Удаление кандидата с ID:', candidateId);

      // Отправляем DELETE запрос
      const response = await api.delete(`/candidates/${candidateId}`);
      
      console.log('Кандидат успешно удален:', response.data);
      return response.data;
    } catch (err: any) {
      console.error("Ошибка при удалении кандидата:", err);
      console.error("Детали ошибки:", err.response?.data);
      
      let errorMessage = "Не удалось удалить кандидата";
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
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
    deleteCandidate,
    loading,
    error,
    clearError,
  };
};