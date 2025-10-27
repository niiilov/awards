import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ApplicationsTable } from "@shared/ui/orders";
import { Sidebar } from "@shared/ui/sidebar";
import { Button } from "@shared/ui/button";
import { Link } from "react-router-dom";
import { CheckUpMessage } from "./CheckUpMessage";
import { useState } from "react";

// ⚠️ Заглушки вместо реальных хуков
const useDashboardData = () => {
  const requests = [
    { id: 1, name: "Заявка 1", status: "Новая", date: "2025-10-20" },
    { id: 2, name: "Заявка 2", status: "В работе", date: "2025-10-21" },
    { id: 3, name: "Заявка 3", status: "Завершена", date: "2025-10-22" },
  ];

  const stats = {
    totalRequests: 125,
    pending: 15,
    completed: 100,
    rejected: 10,
  };

  const chartData = [
    { name: "15.10", value: 10 },
    { name: "16.10", value: 15 },
    { name: "17.10", value: 8 },
    { name: "18.10", value: 20 },
    { name: "19.10", value: 12 },
    { name: "20.10", value: 17 },
    { name: "21.10", value: 25 },
    { name: "22.10", value: 18 },
    { name: "23.10", value: 22 },
    { name: "24.10", value: 30 },
  ];

  return { requests, loading: false, error: null, stats, chartData };
};

// 🔹 Простые моки для таблицы и карточек
const useTableData = (requests: any[]) => requests;
const useStatsCards = (stats: any) => [
  { label: "Всего кандидатов", value: stats.totalRequests },
  { label: "Допущено", value: stats.pending },
  { label: "Не допущено", value: stats.completed },
];

export const DashboardPage = () => {
  const { requests, loading, error, stats, chartData } = useDashboardData();
  const tableData = useTableData(requests);
  const statsCards = useStatsCards(stats);

  const [showMessage, setShowMessage] = useState(false);

  const handleAutoCheck = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000); // 4 секунды
  };

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        {/* Статистика */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Статистика</h2>
          <Button onClick={handleAutoCheck} className="rounded-[8px]">
            Автопроверка кандидатов
          </Button>
        </div>
        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          {statsCards.map((item) => (
            <Card key={item.label} className="w-[250px] shrink-0 shadow-sm">
              <CardContent className="px-6 text-left">
                <div className="text-4xl font-medium">{item.value}</div>
                <div className="text-gray-600">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Таблица */}
        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          <ApplicationsTable
            title="Последние кандидаты"
            data={tableData}
            showMoreButton={true}
            maxVisibleRows={5}
          />
        </div>

        {/* Быстрые действия */}

        <h2 className="text-xl font-bold">Быстрые действия</h2>
        <div className="px-8 py-6 rounded-[8px] border">
          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button className="bg-[#F6F6F6] hover:text-black hover:bg-neutral-200 text-[#9E9E9E] rounded-[8px] border-none w-full">
                Загрузить листы
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-[#F6F6F6] hover:text-black hover:bg-neutral-200 text-[#9E9E9E] rounded-[8px] border-none w-full">
                Сформировать протокол
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-[#F6F6F6] hover:text-black hover:bg-neutral-200 text-[#9E9E9E] rounded-[8px] border-none w-full">
                Сформировать грамоту
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <CheckUpMessage isVisible={showMessage} />
    </div>
  );
};
