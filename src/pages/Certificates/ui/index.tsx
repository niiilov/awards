// components/Certificates.tsx
import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Sidebar } from "@shared/ui/sidebar";
import { Card, CardContent } from "@shared/ui/card";
import { useGenerateDiploma } from "@features/certificates/hooks/useGenerateDiploma";
import { useGenerateLetter } from "@features/certificates/hooks/useGenerateLetter";
import { useCandidates } from "@features/candidates/hooks/useCandidates";

export const Certificates = () => {
  const [activeType, setActiveType] = useState<"certificate" | "gratitude">(
    "certificate",
  );
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [reason, setReason] = useState<string>("");

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

  // Получаем данные выбранных кандидатов
  const selectedCandidatesData = candidates.filter((c) =>
    selectedCandidates.includes(c.id),
  );

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
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

    console.log("🎯 Starting generation...", {
      type: activeType,
      count: selectedCandidates.length,
      reason: reason,
    });

    // Формируем массив данных для отправки
    const candidatesData = selectedCandidatesData.map((candidate) => {
      const data: any = {
        name: candidate.full_name,
        position: candidate.position,
      };

      // Добавляем reason только если оно заполнено
      if (reason.trim()) {
        data.reason = reason;
      } else if (candidate.reason && candidate.reason.trim()) {
        // Или если есть reason в профиле кандидата
        data.reason = candidate.reason;
      }
      // Если оба reason пустые - поле не добавляется

      return data;
    });

    console.log("Sending candidates data:", candidatesData);

    const success =
      activeType === "certificate"
        ? await generateDiploma(candidatesData)
        : await generateLetter(candidatesData);

    if (success) {
      alert(`Успешно сгенерировано`);
      console.log(
        `✅ Generation completed successfully: ${selectedCandidates.length} documents`,
      );
    } else {
      alert(`Ошибка при генерации документов`);
      console.log(`❌ Generation failed`);
    }
  };

  // Фильтруем кандидатов по статусу "Прошёл"
  const filteredCandidates = candidates.filter(
    (candidate) => candidate.status === "Прошёл",
  );

  // Форматирование даты
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

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full gap-4 flex flex-col border-l border-gray-200 p-6 space-y-6">
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
            {/* Секция выбора кандидатов */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Выбор кандидатов
                </h3>
                {filteredCandidates.length > 0 && (
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    {selectedCandidates.length === filteredCandidates.length
                      ? "Снять выделение"
                      : "Выбрать всех"}
                  </Button>
                )}
              </div>

              <div className="p-4 border border-gray-200 rounded-lg max-h-96 overflow-y-auto space-y-2">
                {isLoadingCandidates ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-sm text-gray-500">
                      Загрузка кандидатов...
                    </p>
                  </div>
                ) : filteredCandidates.length > 0 ? (
                  <>
                    <div className="text-xs text-gray-500 mb-2 flex justify-between">
                      <span>
                        Найдено кандидатов: {filteredCandidates.length}
                      </span>
                      <span>Выбрано: {selectedCandidates.length}</span>
                    </div>
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`flex items-start gap-2 p-3 hover:bg-gray-50 rounded border cursor-pointer ${
                          selectedCandidates.includes(candidate.id)
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-100"
                        }`}
                        onClick={() => handleCandidateToggle(candidate.id)}
                      >
                        <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                          {/* Чекбокс для выбора нескольких кандидатов */}
                          <div
                            className={`w-4 h-4 border rounded ${
                              selectedCandidates.includes(candidate.id)
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedCandidates.includes(candidate.id) && (
                              <svg
                                className="w-3 h-3 text-white m-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-gray-800">
                                  {candidate.full_name || "Без имени"}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                  {candidate.position || "Без должности"}
                                </span>
                              </div>
                              <div className="mt-1 space-y-1">
                                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                  <span>
                                    Дата рождения:{" "}
                                    {formatDate(candidate.birth_date)}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Стаж: {candidate.experience_total || 0} лет
                                  </span>
                                </div>
                                {candidate.achievements && (
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Достижения:
                                    </span>{" "}
                                    {candidate.achievements}
                                  </div>
                                )}
                                {candidate.previous_awards && (
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">
                                      Награды:
                                    </span>{" "}
                                    {candidate.previous_awards}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                              ID: {candidate.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Нет кандидатов со статусом "Прошёл"
                    </p>
                    <p className="text-xs text-gray-400">
                      {candidates.length > 0
                        ? `Все ${candidates.length} кандидатов имеют другие статусы`
                        : "Кандидаты не найдены в системе"}
                    </p>
                  </div>
                )}
              </div>

              {selectedCandidates.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800">
                    <span className="font-medium">
                      Выбрано кандидатов: {selectedCandidates.length}
                    </span>
                    <div className="text-xs mt-1 space-y-1">
                      {selectedCandidates.slice(0, 3).map((candidateId) => {
                        const candidate = candidates.find(
                          (c) => c.id === candidateId,
                        );
                        return candidate ? (
                          <div
                            key={candidateId}
                            className="flex items-center gap-1"
                          >
                            <span className="text-blue-700">•</span>
                            <span>
                              {candidate.full_name} ({candidate.position})
                            </span>
                          </div>
                        ) : null;
                      })}
                      {selectedCandidates.length > 3 && (
                        <div className="text-gray-500 italic">
                          ...и еще {selectedCandidates.length - 3} кандидатов
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Поле для основания награждения */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Основание для награждения
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Основание для награждения (необязательно)
                  {selectedCandidates.length > 1 &&
                    " - будет использовано для всех выбранных кандидатов"}
                </label>
                <Input
                  placeholder="Введите основание для награждения (оставьте пустым, если основание не требуется)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Ошибка:</strong> {error}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isLoading || selectedCandidates.length === 0}
              className="bg-blue-600 w-full rounded border-none hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Генерация..."
                : `Сгенерировать для ${selectedCandidates.length} кандидатов`}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
