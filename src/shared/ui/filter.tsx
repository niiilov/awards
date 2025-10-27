import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@shared/ui/dropdown-menu";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@shared/ui/select";
import { ArrowDownWideNarrow } from "lucide-react";
import { SourceOptions } from "@shared/config/selectOptions";
import { api } from "@shared/api/axios";

type FilterKind = "none" | "terotdel" | "year";

interface Request {
  address: string;
  applicant: {
    id: string;
    name: string;
  };
  behavior: string;
  contact_person: string;
  created_at: string;
  dogs_count: number;
  id: string;
  number: string;
  source: {
    id: string;
    name: string;
  };
  status: string;
  urgency: string;
}

interface FilterDropdownInlineProps {
  onFilteredData?: (data: Request[]) => void;
  onLoading?: (loading: boolean) => void;
  onError?: (error: string | null) => void;
}

export default function FilterDropdownInline({
  onFilteredData,
  onLoading,
  onError,
}: FilterDropdownInlineProps) {
  const [active, setActive] = useState<FilterKind>("none");
  const [terValue, setTerValue] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const applyFilter = async (filters: { otdel_id?: string; year?: string } = {}) => {
    try {
      setLoading(true);
      onLoading?.(true);
      onError?.(null);

      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value && value !== "")
      );

      console.log("Фильтры:", params);

      const response = await api.get("/requests", { params });
      console.log("Отфильтрованные данные:", response.data);
      
      const data = response.data as Request[];
      onFilteredData?.(data);
      return data;
    } catch (error: any) {
      console.error("Ошибка при фильтрации:", error);
      const errorMessage = error.response?.data?.message || "Ошибка при загрузке данных";
      onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  const handleApplyFilter = async () => {
    if (year) {
      const yearNum = parseInt(year);
      const currentYear = new Date().getFullYear();
      if (yearNum < 2000 || yearNum > currentYear + 1) {
        onError?.(`Введите корректный год (2000-${currentYear + 1})`);
        return;
      }
    }

    try {
      await applyFilter({ 
        otdel_id: terValue || undefined,
        year: year || undefined 
      });
      setActive("none");
    } catch (error) {
      // Ошибка уже обработана в applyFilter
    }
  };

  const handleResetFilters = async () => {
    setTerValue("");
    setYear("");
    setActive("none");
    onError?.(null);
    
    try {
      onLoading?.(true);
      const response = await api.get("/requests");
      console.log("✅ Все заявки загружены:", response.data);
      onFilteredData?.(response.data);
    } catch (error: any) {
      console.error("❌ Ошибка при загрузке всех заявок:", error);
      onError?.("Не удалось загрузить список заявок");
      onFilteredData?.([]);
    } finally {
      onLoading?.(false);
    }
  };

  function toggle(kind: FilterKind) {
    setActive((prev) => (prev === kind ? "none" : kind));
  }

  return (
    <div className="inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <span>Фильтр</span>
            <ArrowDownWideNarrow size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={4}
          className="w-80 p-0 overflow-hidden shadow-lg border border-gray-200 rounded-xl"
        >
          <div className="p-3 border-b bg-white">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggle("terotdel")}
                className={`w-full text-left px-3 py-2 rounded-md text-[14px] ${
                  active === "terotdel"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-slate-50"
                }`}
              >
                Теротдел
              </button>

              <button
                type="button"
                onClick={() => toggle("year")}
                className={`w-full text-left px-3 py-2 rounded-md text-[14px] ${
                  active === "year"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-slate-50"
                }`}
              >
                Год
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full text-left px-3 py-2 rounded-md text-[14px] text-red-600 hover:bg-red-50"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          <div
            className={`bg-white transition-[max-height,opacity,transform] duration-200 ease-in-out overflow-hidden text-[14px] ${
              active === "none"
                ? "max-h-0 opacity-0 -translate-y-1"
                : "max-h-[320px] opacity-100 translate-y-0"
            }`}
          >
            <div className={`${active === "terotdel" ? "block" : "hidden"} p-4`}>
              <h4 className="text-lg font-semibold mb-2">Выбрать теротдел</h4>
              <Select value={terValue} onValueChange={(v) => setTerValue(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите теротдел" />
                </SelectTrigger>
                <SelectContent>
                  {SourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 text-center">
                <Button 
                  className="bg-blue-600 text-white w-full"
                  onClick={handleApplyFilter}
                  disabled={loading || !terValue}
                >
                  {loading ? "Загрузка..." : "Применить"}
                </Button>
              </div>
            </div>

            <div className={`${active === "year" ? "block" : "hidden"} p-4`}>
              <h4 className="text-lg font-semibold mb-2">По году</h4>

              <Input
                type="number"
                placeholder="Введите год"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max={new Date().getFullYear() + 1}
                className="mt-1"
              />

              <div className="mt-4 text-center">
                <Button 
                  className="bg-blue-600 text-white w-full"
                  onClick={handleApplyFilter}
                  disabled={loading || !year}
                >
                  {loading ? "Загрузка..." : "Применить"}
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}