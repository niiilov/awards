// DashboardPage.tsx
import { Card, CardContent } from "@shared/ui/card";
import { Sidebar } from "@shared/ui/sidebar";
import { Button } from "@shared/ui/button";
import { Link } from "react-router-dom";
import { CheckUpMessage } from "./CheckUpMessage";
import { useState } from "react";
import { useCandidates } from "@features/candidates/hooks/useCandidates";
import { AllCandidates } from "@pages/Candidates/ui/AllCandidates";

export const DashboardPage = () => {
  const { candidates } = useCandidates();
  
  const stats = {
    totalRequests: candidates.length,
    pending: candidates.filter(c => c.status !== "Прошёл" && c.status !== "Не прошёл").length,
    completed: candidates.filter(c => c.status === "Прошёл").length,
    rejected: candidates.filter(c => c.status === "Не прошёл").length,
  };

  const statsCards = [
    { label: "Всего кандидатов", value: stats.totalRequests },
    { label: "Допущено", value: stats.completed },
    { label: "Не допущено", value: stats.rejected },
  ];

  const [showMessage, setShowMessage] = useState(false);

  const handleAutoCheck = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
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
          <AllCandidates maxVisibleRows={10} showMoreButton={true} />
        </div>

        {/* Быстрые действия */}
        <h2 className="text-xl font-bold">Быстрые действия</h2>
        <div className="px-8 py-6 rounded-[8px] border">
          <div className="flex flex-col gap-2">
            <Link to="/upload-awards">
              <Button className="bg-[#F6F6F6] hover:text-black hover:bg-neutral-200 text-[#9E9E9E] rounded-[8px] border-none w-full">
                Загрузить листы
              </Button>
            </Link>
            <Link to="/protocol">
              <Button className="bg-[#F6F6F6] hover:text-black hover:bg-neutral-200 text-[#9E9E9E] rounded-[8px] border-none w-full">
                Сформировать протокол
              </Button>
            </Link>
            <Link to="/certificates">
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