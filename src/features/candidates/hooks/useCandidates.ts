// features/candidates/hooks/useCandidates.ts
import { useState, useEffect } from "react";
import { useChangeStatus } from "./useChangeStatus";

export interface Candidate {
  id: string;
  full_name: string;
  position: string;
  experience_total: number;
  experience_current: number;
  status: string;
  birth_date: string;
  achievements: string;
  has_conviction: boolean;
  previous_awards: string;
  reason: string;
  created_at: string;
}

interface CandidatesResponse {
  candidates: Candidate[];
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { changeCandidateStatus, loading: changeLoading, error: changeError } = useChangeStatus();

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { api } = await import("@shared/api/axios");
      const response = await api.get<CandidatesResponse>("/candidates");
      
      console.log('=== Ответ от API /candidates ===', response.data);
      
      // API возвращает { candidates: [...] }
      let candidatesData: Candidate[] = [];
      
      if (response.data && Array.isArray(response.data.candidates)) {
        candidatesData = response.data.candidates;
      } else {
        console.error('Неверный формат ответа от API:', response.data);
        candidatesData = [];
      }
      
      console.log('Извлеченные кандидаты:', candidatesData);
      setCandidates(candidatesData);
      
    } catch (err: any) {
      console.error("Ошибка загрузки кандидатов:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось загрузить список кандидатов. Пожалуйста, попробуйте позже."
      );
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (candidateId: string, newStatus: string) => {
    try {
      // Обновляем статус через API
      await changeCandidateStatus(candidateId, newStatus);
      
      // Обновляем локальное состояние
      setCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status: newStatus }
            : candidate
        )
      );
      
      return true;
    } catch (err) {
      console.error("Ошибка при обновлении статуса в локальном состоянии:", err);
      return false;
    }
  };

  const deleteCandidate = (candidateId: string) => {
    // Локальное удаление кандидата из состояния
    setCandidates(prev => prev.filter(candidate => candidate.id !== candidateId));
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    loading: loading || changeLoading,
    error: error || changeError,
    refetch: fetchCandidates,
    updateCandidateStatus,
    deleteCandidate,
  };
};