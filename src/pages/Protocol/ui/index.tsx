import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { ApplicationsTable } from "@shared/ui/orders";
import { Sidebar } from "@shared/ui/sidebar";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { useState } from "react";

interface ProtocolData {
  id: string;
  number: string;
  applicant: string;
  urgency: string;
  date: string;
  status: string;
}

export const Protocol = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [protocols, setProtocols] = useState<ProtocolData[]>([
    { id: "1", number: "1", applicant: "Иванов И.И.", urgency: "5 лет", date: "01.11.2025", status: "Активен" },
    { id: "2", number: "2", applicant: "Петров П.П.", urgency: "3 года", date: "02.11.2025", status: "Неактивен" },
    { id: "3", number: "3", applicant: "Сидорова А.С.", urgency: "10 лет", date: "03.11.2025", status: "Активен" },
    { id: "4", number: "4", applicant: "Кузнецов Д.В.", urgency: "2 года", date: "04.11.2025", status: "На рассмотрении" },
    { id: "5", number: "5", applicant: "Николаева Е.А.", urgency: "7 лет", date: "05.11.2025", status: "Активен" },
    { id: "6", number: "6", applicant: "Волков А.И.", urgency: "1 год", date: "06.11.2025", status: "Неактивен" },
    { id: "7", number: "7", applicant: "Семенова О.В.", urgency: "15 лет", date: "07.11.2025", status: "Активен" },
    { id: "8", number: "8", applicant: "Федоров М.П.", urgency: "4 года", date: "08.11.2025", status: "На рассмотрении" },
  ]);

  // Фильтрация протоколов по поисковому запросу
  const filteredProtocols = protocols.filter(protocol =>
    protocol.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.urgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProtocol = () => {
    // Логика создания нового протокола
    console.log("Создание нового протокола...");
  };

  const handleExportProtocols = () => {
    // Логика экспорта протоколов
    console.log("Экспорт протоколов...");
  };

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        {/* Заголовок и кнопки */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Протоколы</h2>
        </div>

        {/* Строка поиска */}
        <div className="flex gap-3 ">
          <div className="flex gap-3">
            <Button 
              onClick={handleCreateProtocol}
            >
              Выделить все
            </Button>
            <Button 
              onClick={handleExportProtocols}
            >
              Снять выделение
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Поиск по ФИО, стажу или статусу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Таблица протоколов */}
        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          <ApplicationsTable
            title="Список протоколов"
            data={filteredProtocols}
          />
        </div>
      </main>
    </div>
  );
};