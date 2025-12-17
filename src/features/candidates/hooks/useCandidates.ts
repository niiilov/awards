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
  candidates: Candidate[] | null;
}

// Интерфейс для данных из базы
interface DBCandidate {
  id: string;
  full_name: string;
  birth_date: string;
  position: string;
  experience_total: number;
  experience_current: number;
  achievements: string;
  has_conviction: boolean;
  previous_awards: string;
  status: string;
  reason: string;
  created_at: string;
  updated_at: string;
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    changeCandidateStatus,
    loading: changeLoading,
    error: changeError,
  } = useChangeStatus();

  // Функция для преобразования данных из базы в формат фронтенда
  const transformCandidateFromDB = (dbCandidate: DBCandidate): Candidate => {
    return {
      id: dbCandidate.id,
      full_name: dbCandidate.full_name,
      position: dbCandidate.position,
      experience_total: dbCandidate.experience_total,
      experience_current: dbCandidate.experience_current,
      status: dbCandidate.status,
      birth_date: dbCandidate.birth_date,
      achievements: dbCandidate.achievements,
      has_conviction: dbCandidate.has_conviction,
      previous_awards: dbCandidate.previous_awards,
      reason: dbCandidate.reason,
      created_at: dbCandidate.created_at,
    };
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { api } = await import("@shared/api/axios");
      const response = await api.get<CandidatesResponse>("/candidates");

      console.log("=== Ответ от API /candidates ===", response.data);

      let candidatesData: Candidate[] = [];

      if (
        response.data &&
        response.data.candidates &&
        Array.isArray(response.data.candidates)
      ) {
        // Если API возвращает данные в правильном формате
        candidatesData = response.data.candidates;
      } else if (response.data && Array.isArray(response.data)) {
        // Если API возвращает массив напрямую (альтернативный формат)
        candidatesData = response.data.map(transformCandidateFromDB);
      } else if (response.data && typeof response.data === "object") {
        // Если API возвращает объект с данными кандидатов
        // Пробуем найти массив кандидатов в ответе
        const data = response.data as any;

        // Ищем первый массив в ответе
        const candidatesArray = Object.values(data).find((value: any) =>
          Array.isArray(value),
        ) as DBCandidate[] | undefined;

        if (candidatesArray) {
          candidatesData = candidatesArray.map(transformCandidateFromDB);
        } else {
          console.log(
            "API вернул объект без массива кандидатов, используем пустой массив",
          );
          candidatesData = [];
        }
      } else {
        console.error("Неверный формат ответа от API:", response.data);
        candidatesData = [];
      }

      console.log("Извлеченные кандидаты:", candidatesData);
      setCandidates(candidatesData);
    } catch (err: any) {
      console.error("Ошибка загрузки кандидатов:", err);
      setError(
        err.response?.data?.message ||
          "Не удалось загрузить список кандидатов. Пожалуйста, попробуйте позже.",
      );
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (
    candidateId: string,
    newStatus: string,
  ) => {
    try {
      // Обновляем статус через API
      await changeCandidateStatus(candidateId, newStatus);

      // Обновляем локальное состояние
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, status: newStatus }
            : candidate,
        ),
      );

      return true;
    } catch (err) {
      console.error(
        "Ошибка при обновлении статуса в локальном состоянии:",
        err,
      );
      return false;
    }
  };

  const deleteCandidate = (candidateId: string) => {
    // Локальное удаление кандидата из состояния
    setCandidates((prev) =>
      prev.filter((candidate) => candidate.id !== candidateId),
    );
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
