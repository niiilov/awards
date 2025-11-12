import { Card, CardContent } from "@shared/ui/card";
import { Sidebar } from "@shared/ui/sidebar";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { useState } from "react";
import { Select } from "@shared/ui/dropdown";
import { OrderModal } from "@shared/ui/cardModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false); // 👈 состояние модалки
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolData | null>(
    null
  );

  const [protocols, setProtocols] = useState<ProtocolData[]>([
    {
      id: "1",
      number: "1",
      applicant: "Иванов И.И.",
      urgency: "5 лет",
      date: "01.11.2025",
      status: "Активен",
    },
    {
      id: "2",
      number: "2",
      applicant: "Петров П.П.",
      urgency: "3 года",
      date: "02.11.2025",
      status: "Неактивен",
    },
    {
      id: "3",
      number: "3",
      applicant: "Сидорова А.С.",
      urgency: "10 лет",
      date: "03.11.2025",
      status: "Активен",
    },
  ]);

  const filteredProtocols = protocols.filter(
    (protocol) =>
      protocol.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.urgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenList = () => {
    setSelectedProtocol(filteredProtocols[0]); // Пример — открываем первую запись
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 border-l w-full border-gray-200 p-6 space-y-6">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-6">
            {/* Фильтры */}
            <div className="grid grid-cols-1 md:grid-cols-3 h-full gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Введите дату
                </label>
                <Input type="date" className="h-[42px] w-full" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Место
                </label>
                <Select
                  variant="default"
                  placeholder="Выберите место"
                  items={[
                    { label: "Тут", value: "Прошли" },
                    { label: "Там", value: "Не прошли" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-2">
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
            </div>

            {/* Кнопки */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleOpenList} // 👈 открываем модалку
              >
                Открыть список
              </Button>
              <Button
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Удалить всех
              </Button>
            </div>

            {/* Список участников */}
            <div className="p-4 max-h-64 overflow-y-auto space-y-2">
              {Array(6)
                .fill("Кузнецов Алексей Сергеевич")
                .map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-800">{name}</span>
                  </div>
                ))}
            </div>

            {/* Нижние кнопки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Предпросмотр
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Сформировать протокол
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Модалка */}
        <OrderModal
          open={isModalOpen}
          onClose={handleCloseModal}
          data={selectedProtocol}
        />
      </main>
    </div>
  );
};
