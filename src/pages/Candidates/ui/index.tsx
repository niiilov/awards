import { Sidebar } from "@shared/ui/sidebar";
import { InputWithLabel } from "@shared/ui/inputLabel";
import { AllCandidates } from "./AllCandidates";
import { useState } from "react";

export const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Контейнер для поля ввода и селекта */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1">
              <InputWithLabel
                type="text"
                placeholder="Поиск по ФИО"
                required
                className="w-full h-[42px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-[42px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Все статусы</option>
                <option value="Прошёл">Прошли</option>
                <option value="Не прошёл">Не прошли</option>
              </select>
            </div>
          </div>
        </div>

        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          <AllCandidates 
            searchQuery={searchQuery}
            statusFilter={selectedStatus}
          />
        </div>
      </main>
    </div>
  );
};