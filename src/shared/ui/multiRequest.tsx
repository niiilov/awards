import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@shared/ui/dropdown-menu";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { api } from "@shared/api/axios";

interface DownloadMultipleResponse {
  status: string;
  url: string;
}

export default function FilterDropdownInline() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция для форматирования ввода в ДД.ММ.ГГГГ
  const formatDateInput = (value: string): string => {
    // Удаляем все нецифровые символы
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 2) {
      return numbers;
    }
    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    }
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(
      4,
      8
    )}`;
  };

  // Функция для валидации даты в формате ДД.ММ.ГГГГ
  const isValidDate = (dateString: string): boolean => {
    if (!dateString || dateString.length !== 10) return false;

    const [day, month, year] = dateString.split(".").map(Number);

    // Проверяем корректность чисел
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 2000 ||
      year > 2100
    ) {
      return false;
    }

    // Проверяем существование даты
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  };

  // Функция для преобразования ДД.ММ.ГГГГ в ГГГГ-ММ-ДД
  const formatDateForAPI = (
    dateString: string,
    isEndOfDay: boolean = false
  ) => {
    if (!isValidDate(dateString)) return "";

    const [day, month, year] = dateString.split(".");
    const isoDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    const date = new Date(isoDateString);

    if (isEndOfDay) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }

    return date.toISOString();
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value);
    setStartDate(formattedValue);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateInput(e.target.value);
    setEndDate(formattedValue);
  };

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      setError("Выберите начальную и конечную дату");
      return;
    }

    if (!isValidDate(startDate)) {
      setError("Неверный формат начальной даты. Используйте ДД.ММ.ГГГГ");
      return;
    }

    if (!isValidDate(endDate)) {
      setError("Неверный формат конечной даты. Используйте ДД.ММ.ГГГГ");
      return;
    }

    const startDateObj = new Date(formatDateForAPI(startDate, false));
    const endDateObj = new Date(formatDateForAPI(endDate, false));

    if (startDateObj > endDateObj) {
      setError("Начальная дата не может быть больше конечной");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Форматируем даты в правильный ISO формат
      const dateFrom = formatDateForAPI(startDate, false);
      const dateTo = formatDateForAPI(endDate, true);

      console.log("Отправляемые данные:", {
        date_from: dateFrom,
        date_to: dateTo,
        original_start: startDate,
        original_end: endDate,
      });

      const response = await api.post<DownloadMultipleResponse>(
        "/request/download_multiDate",
        {
          date_from: dateFrom,
          date_to: dateTo,
        }
      );

      console.log("Ответ сервера:", response);

      if (response.data.url) {
        window.open(response.data.url, "_blank");
        console.log("Документы успешно сгенерированы:", response.data.url);
      } else {
        throw new Error("URL для скачивания не получен");
      }
    } catch (err: any) {
      console.error("Полная ошибка:", err);

      if (err.response) {
        if (err.response.status === 500) {
          setError(
            "Ошибка сервера. Попробуйте позже или обратитесь к администратору"
          );
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Произошла ошибка при генерации документов");
        }
      } else if (err.request) {
        setError("Сервер не отвечает. Проверьте подключение к интернету");
      } else {
        setError("Ошибка при отправке запроса");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setError(null);
  };

  return (
    <div className="inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <span>Скачать заявки по дате</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={4}
          className="w-80 p-0 overflow-hidden shadow-lg border border-gray-200 rounded-xl"
        >
          <div className="bg-white text-[14px]">
            <div className="p-4">
              <h4 className="text-lg font-semibold mb-2">Диапазон дат</h4>

              {error && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-red-700 text-sm">{error}</div>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Начальная дата
                  </label>
                  <Input
                    type="text"
                    placeholder="ДД.ММ.ГГГГ"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="w-full"
                    maxLength={10}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Формат: ДД.ММ.ГГГГ
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Конечная дата
                  </label>
                  <Input
                    type="text"
                    placeholder="ДД.ММ.ГГГГ"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="w-full"
                    maxLength={10}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Формат: ДД.ММ.ГГГГ
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 justify-between">
                <Button
                  color="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Сбросить
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={
                    loading || !isValidDate(startDate) || !isValidDate(endDate)
                  }
                >
                  {loading ? "Скачивание..." : "Скачать"}
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
