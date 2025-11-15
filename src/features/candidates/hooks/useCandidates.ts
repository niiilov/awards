// features/candidates/hooks/useCandidates.ts
import { useState, useEffect } from "react";

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

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { api } = await import("@shared/api/axios");
      const response = await api.get("/candidates");
      
      console.log('=== Ответ от API /candidates ===', response);
      console.log('Тип данных:', typeof response.data);
      console.log('Is Array?', Array.isArray(response.data));
      console.log('Данные:', response.data);
      
      // Гарантируем, что candidates всегда массив
      let candidatesData: Candidate[] = [];
      
      if (Array.isArray(response.data)) {
        candidatesData = response.data;
      } else {
        console.error('Ожидался массив, но получен:', typeof response.data, response.data);
        candidatesData = [];
      }
      
      console.log('Обработанные данные:', candidatesData);
      setCandidates(candidatesData);
      
    } catch (err: any) {
      console.error("Ошибка загрузки кандидатов:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось загрузить список кандидатов. Пожалуйста, попробуйте позже."
      );
      // Гарантируем, что даже при ошибке candidates - массив
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const updateCandidateStatus = (candidateId: string, newStatus: string) => {
    setCandidates(prev => {
      if (!Array.isArray(prev)) {
        console.error('candidates не является массивом в updateCandidateStatus:', prev);
        return [];
      }
      return prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: newStatus }
          : candidate
      );
    });
  };

  return {
    candidates,
    loading,
    error,
    refetch: fetchCandidates,
    updateCandidateStatus,
  };
};