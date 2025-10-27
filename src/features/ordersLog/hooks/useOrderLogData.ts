import { useState, useEffect } from "react";
import { getRequests } from "@features/request/hooks/useRequestsLog";
import type { Request } from "@features/request/hooks/useRequestsLog";

export interface TableRowData {
  id: string;
  number: string;
  applicant: string;
  address: string;
  dogsCount: number;
  urgency: string;
  status: string;
  date: string;
  behavior: string;
  contactPerson: string;
  source: {
    id: string;
    name: string;
  };
}

export const useOrderLogData = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getRequests();

        console.log("Полученные данные:", data);
        console.log("Тип данных:", typeof data);
        console.log("Является массивом:", Array.isArray(data));
        console.log("Количество элементов:", data.length);

        setRequests(data);
        setError(null);
      } catch (err: any) {
        console.error("Ошибка при загрузке заявок:", err);
        console.error("Данные ошибки:", err.response?.data);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Произошла ошибка при загрузке заявок"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Преобразуем данные для таблицы с порядковыми номерами
  const tableData: TableRowData[] = requests.map((request) => ({
    id: request.id,
    number: request.number, // Простой порядковый номер
    applicant: request.applicant?.name || "Не указан",
    address: request.address || "Не указан",
    dogsCount: request.dogs_count || 0,
    urgency: request.urgency || "Не указана",
    status: request.status || "Не указан",
    date: request.created_at
      ? new Date(request.created_at).toLocaleDateString("ru-RU")
      : "Не указана",
    behavior: request.behavior || "Не указано",
    contactPerson: request.contact_person || "Не указано",
    source: request.source || { id: "", name: "" },
  }));

  return {
    requests,
    loading,
    error,
    tableData,
  };
};