import { Button } from "@shared/ui/button";
import { Sidebar } from "@shared/ui/sidebar";
import { Select } from "@shared/ui/dropdown";
import { InputWithLabel } from "@shared/ui/inputLabel";
import { Search } from "lucide-react";
import { AllCandidates } from "./AllCandidates";

export const Candidates = () => {
  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        <div className="flex flex-wrap gap-3 items-center">
          <Button className="md:w-fit w-full h-[42px]" variant="ghost">
            Выделить все
          </Button>
          <Button
            variant="ghost"
            className="md:w-fit w-full h-[42px] bg-neutral-300 text-black"
          >
            Снять выделения
          </Button>

          {/* Контейнер для поля ввода и селекта */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <InputWithLabel
              type="text"
              placeholder="Поиск по ФИО"
              required
              className="w-full sm:flex-1 md:w-auto"
            />
            <Select
              variant="default"
              placeholder="Выберите поведение"
              items={[
                { label: "Прошли", value: "Прошли" },
                { label: "Не прошли", value: "Не прошли" },
              ]}
            />
          </div>
        </div>

        <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
          <AllCandidates />
        </div>
      </main>
    </div>
  );
};
