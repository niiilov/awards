// features/candidates/hooks/useUpdateCandidateConviction.ts
import { useState } from "react";

export const useUpdateCandidateConviction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCandidateConviction = async (
    candidateId: string,
    hasConviction: boolean,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { api } = await import("@shared/api/axios");

      console.log("Обновление судимости кандидата:", {
        candidateId,
        hasConviction,
      });

      // Пробуем разные форматы данных
      const dataFormats = [
        { value: hasConviction }, // Оригинальный boolean
        { value: hasConviction ? true : "false" }, // Для false как строка
        { value: hasConviction ? true : 0 }, // Для false как число
      ];

      let lastError = null;

      for (const updateData of dataFormats) {
        try {
          console.log("Попытка отправки данных формата:", updateData);

          const response = await api.put(
            `/candidates-conviction/${candidateId}`,
            updateData,
          );

          console.log("Судимость кандидата успешно обновлена:", response.data);
          return response.data;
        } catch (formatError: any) {
          console.log(`Формат не сработал:`, formatError.response?.data);
          lastError = formatError;
          // Продолжаем только если это ошибка валидации
          if (
            formatError.response?.status === 400 &&
            formatError.response?.data?.error?.includes("required")
          ) {
            continue;
          } else {
            throw formatError;
          }
        }
      }

      throw lastError;
    } catch (err: any) {
      console.error("Ошибка при обновлении судимости кандидата:", err);
      console.error("Детали ошибки:", err.response?.data);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Не удалось обновить информацию о судимости";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    updateCandidateConviction,
    loading,
    error,
    clearError,
  };
};
