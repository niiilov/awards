// features/dashboard/hooks/useStatsCards.ts
import type { DashboardStats } from "./useDashboardData";

export interface StatsCard {
  label: string;
  value: number;
}

export const useStatsCards = (stats: DashboardStats) => {
  const statsCards: StatsCard[] = [
    { label: "Всего заявок", value: stats.total },
    { label: "Новые заявки", value: stats.new },
    { label: "В работе", value: stats.inProgress },
    { label: "Завершено", value: stats.completed },
  ];

  return statsCards;
};