import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Sidebar } from "@shared/ui/sidebar";
import { Card, CardContent } from "@shared/ui/card";
import { useGenerateDiploma } from "@features/certificates/hooks/useGenerateDiploma";
import { useGenerateLetter } from "@features/certificates/hooks/useGenerateLetter";
import { useCandidates } from "@features/candidates/hooks/useCandidates";
import { TemplateModal } from "./TemplateModal";

export const Certificates = () => {
  const [activeType, setActiveType] = useState<"certificate" | "gratitude">(
    "certificate",
  );
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [reason, setReason] = useState<string>("");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const { candidates, loading: isLoadingCandidates } = useCandidates();
  const {
    generateDiploma,
    isLoading: isLoadingDiploma,
    error: errorDiploma,
  } = useGenerateDiploma();
  const {
    generateLetter,
    isLoading: isLoadingLetter,
    error: errorLetter,
  } = useGenerateLetter();

  const isLoading = isLoadingDiploma || isLoadingLetter;
  const error = errorDiploma || errorLetter;

  const selectedCandidatesData = candidates.filter((c) =>
    selectedCandidates.includes(c.id),
  );

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId],
    );
  };

  const handleSelectAll = () => {
    const passedCandidates = candidates.filter((c) => c.status === "Прошёл");

    if (selectedCandidates.length === passedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(passedCandidates.map((c) => c.id));
    }
  };

  const handleGenerate = async () => {
    if (selectedCandidates.length === 0) {
      alert("Пожалуйста, выберите хотя бы одного кандидата");
      return;
    }

    const candidatesData = selectedCandidatesData.map((candidate) => {
      const data: any = {
        name: candidate.full_name,
        position: candidate.position,
      };

      if (reason.trim()) {
        data.reason = reason;
      } else if (candidate.reason?.trim()) {
        data.reason = candidate.reason;
      }

      return data;
    });

    const success =
      activeType === "certificate"
        ? await generateDiploma(candidatesData)
        : await generateLetter(candidatesData);

    if (success) {
      alert("Успешно сгенерировано");
    } else {
      alert("Ошибка при генерации документов");
    }
  };

  const filteredCandidates = candidates.filter(
    (candidate) => candidate.status === "Прошёл",
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? dateString
        : date.toLocaleDateString("ru-RU");
    } catch {
      return dateString;
    }
  };

  const templateFile = [
    { id: 1, name: "Шаблон 1" },
    { id: 2, name: "Шаблон 2" },
    { id: 3, name: "Шаблон 3" },
  ];

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full gap-4 flex flex-col border-l border-gray-200 p-6 space-y-6">
        {/* Переключатель типа документа */}
        <div className="flex md:flex-row flex-col gap-2">
          <Button
            onClick={() => setActiveType("certificate")}
            variant="ghost"
            className={`md:w-fit w-full h-[42px] ${
              activeType === "certificate"
                ? "bg-blue-600 text-white"
                : "bg-neutral-300 text-black"
            }`}
          >
            Создать грамоту
          </Button>

          <Button
            onClick={() => setActiveType("gratitude")}
            variant="ghost"
            className={`md:w-fit w-full h-[42px] ${
              activeType === "gratitude"
                ? "bg-blue-600 text-white"
                : "bg-neutral-300 text-black"
            }`}
          >
            Создать благодарность
          </Button>
        </div>

        <Card className="border-none shadow-none">
          <CardContent className="space-y-6">
            {/* Выбор кандидатов */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Выбор кандидатов</h3>

                {filteredCandidates.length > 0 && (
                  <Button onClick={handleSelectAll} variant="outline" size="sm">
                    {selectedCandidates.length === filteredCandidates.length
                      ? "Снять выделение"
                      : "Выбрать всех"}
                  </Button>
                )}
              </div>

              <div className="p-4 border rounded-lg max-h-96 overflow-y-auto space-y-2">
                {isLoadingCandidates ? (
                  <div className="text-center py-4">Загрузка кандидатов...</div>
                ) : filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`p-3 rounded border cursor-pointer ${
                        selectedCandidates.includes(candidate.id)
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-100"
                      }`}
                      onClick={() => handleCandidateToggle(candidate.id)}
                    >
                      <div className="text-sm font-medium">
                        {candidate.full_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {candidate.position}
                      </div>
                      <div className="text-xs text-gray-400">
                        Дата рождения: {formatDate(candidate.birth_date)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Нет кандидатов со статусом "Прошёл"
                  </div>
                )}
              </div>
            </div>

            {/* Выбор шаблона */}
            <div className="space-y-2 flex flex-col">
              <label className="text-sm font-medium">
                Выберите шаблон для генерации
              </label>

              <select className="border rounded-md px-3 py-2 h-[42px]">
                {templateFile.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>

              <Button
                variant="cube"
                onClick={() => setIsTemplateModalOpen(true)}
              >
                Добавить шаблон
              </Button>
            </div>

            {/* Основание */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Основание для награждения (необязательно)
              </label>

              <Input
                placeholder="Введите основание"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isLoading || selectedCandidates.length === 0}
              className="bg-blue-600 w-full text-white"
            >
              {isLoading
                ? "Генерация..."
                : `Сгенерировать для ${selectedCandidates.length}`}
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* МОДАЛКА ДОБАВЛЕНИЯ ШАБЛОНА */}
      <TemplateModal
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
};
