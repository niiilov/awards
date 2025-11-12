import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Select } from "@shared/ui/dropdown";
import { Sidebar } from "@shared/ui/sidebar";

export const Certificates = () => {
  const [activeType, setActiveType] = useState<"certificate" | "gratitude">(
    "certificate"
  );

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full gap-4 flex flex-col border-l border-gray-200 p-6 space-y-6">
        <span className="text-sm text-neutral-500">
          Система автоматического формирования и хранения почётных грамот и
          благодарственных писем.
        </span>

        <div className="flex md:flex-row flex-col gap-2">
          {/* Кнопка 1 — Создать грамоту */}
          <Button
            onClick={() => setActiveType("certificate")}
            variant="ghost"
            className={`md:w-fit w-full h-[42px] ${
              activeType === "certificate"
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                : "bg-neutral-300 hover:bg-neutral-400 text-black hover:text-black"
            }`}
          >
            Создать грамоту
          </Button>

          {/* Кнопка 2 — Создать благодарность */}
          <Button
            onClick={() => setActiveType("gratitude")}
            variant="ghost"
            className={`md:w-fit w-full h-[42px] ${
              activeType === "gratitude"
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                : "bg-neutral-300 hover:bg-neutral-400 text-black hover:text-black"
            }`}
          >
            Создать благодарность
          </Button>
        </div>

        {/* Остальная часть формы */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                Председатель
              </label>
              <Select
                variant="default"
                placeholder="Выберите председателя"
                items={[
                  { label: "Такой то", value: "Прошли" },
                  { label: "Какой то", value: "Не прошли" },
                ]}
              />
            </div>
          ))}
        </div>

        <Button className="bg-green-600 w-full rounded border-none hover:bg-green-700 hover:text-white text-white">
          Предпросмотр
        </Button>
      </main>
    </div>
  );
};
