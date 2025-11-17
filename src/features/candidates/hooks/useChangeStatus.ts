// features/candidates/hooks/useChangeStatus.ts
import { useState } from "react";
import type { Candidate } from "./useCandidates";

export const useChangeStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeCandidateStatus = async (candidateId: string, newStatus: string, currentCandidate?: Candidate) => {
    setLoading(true);
    setError(null);

    try {
      const { api } = await import("@shared/api/axios");
      
      console.log('Изменение статуса кандидата:', {
        candidateId,
        newStatus,
        currentCandidate
      });

      // Формируем полный объект кандидата с ВСЕМИ обязательными полями
      const updateData = {
        id: candidateId,
        full_name: currentCandidate?.full_name || "",
        position: currentCandidate?.position || "",
        experience_total: currentCandidate?.experience_total || 0,
        experience_current: currentCandidate?.experience_current || 0,
        status: newStatus,
        birth_date: currentCandidate?.birth_date || "",
        achievements: currentCandidate?.achievements || "",
        has_conviction: currentCandidate?.has_conviction || false,
        previous_awards: currentCandidate?.previous_awards || "",
        reason: currentCandidate?.reason || "",
        created_at: currentCandidate?.created_at || new Date().toISOString()
      };

      console.log('Данные для обновления:', updateData);

      const response = await api.put(`/candidates/${candidateId}`, updateData);

      console.log('Статус кандидата успешно изменен:', response.data);
      return response.data;
    } catch (err: any) {
      console.error("Ошибка при изменении статуса кандидата:", err);
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Не удалось изменить статус кандидата";
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    changeCandidateStatus,
    loading,
    error,
    clearError,
  };
};