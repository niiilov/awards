import { Sidebar } from "@shared/ui/sidebar";
import React, { useState } from "react";
import { AreaList } from "./AreaList";
import { Orders } from "./Orders";
import { Button } from "@shared/ui/button";

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<"areas" | "orders">("areas");

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        <h1 className="text-xl font-bold">Админ-панель</h1>

        {/* Переключатель вкладок */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("areas")}
            className={`h-[42px] ${
              activeTab === "areas"
                ? "bg-blue-600 text-white"
                : "bg-neutral-200 text-black"
            }`}
          >
            Муниципальные округа
          </Button>

          <Button
            variant="ghost"
            onClick={() => setActiveTab("orders")}
            className={`h-[42px] ${
              activeTab === "orders"
                ? "bg-blue-600 text-white"
                : "bg-neutral-200 text-black"
            }`}
          >
            Заявки
          </Button>
        </div>

        {/* Контент */}
        {activeTab === "areas" && <AreaList />}
        {activeTab === "orders" && <Orders />}
      </main>
    </div>
  );
};
