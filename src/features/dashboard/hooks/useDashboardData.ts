import { useState, useEffect } from "react";
import { getRequests } from "@features/request/hooks/useRequestsLog";
import type { Request } from "@features/request/hooks/useRequestsLog";

export interface DashboardStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export const useDashboardData = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const calculateStats = (data: Request[]) => {
    const stats: DashboardStats = {
      total: data.length,
      new: data.filter(
        (request) => request.status === "Новая"
      ).length,
      inProgress: data.filter(
        (request) => request.status === "В работе"
      ).length,
      completed: data.filter(
        (request) => request.status === "Выполнена"
      ).length,
    };
    setStats(stats);
  };

  const generateChartData = (data: Request[]) => {
    const last10Days = Array.from({ length: 10 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString("ru-RU");
    }).reverse();

    const chartData = last10Days.map((date) => {
      const count = data.filter((request) => {
        const requestDate = new Date(request.created_at).toLocaleDateString(
          "ru-RU"
        );
        return requestDate === date;
      }).length;

      return {
        name: date,
        value: count,
      };
    });

    setChartData(chartData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRequests();
        setRequests(data);
        calculateStats(data);
        generateChartData(data);
        setError(null);
      } catch (err: any) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Произошла ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    calculateStats(requests);
    generateChartData(requests);
  }, [requests]);

  return {
    requests,
    loading,
    error,
    stats,
    chartData,
  };
};