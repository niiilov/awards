// components/Certificates.tsx
import { useState, useEffect } from "react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Sidebar } from "@shared/ui/sidebar";
import { useGenerateDiploma } from "@features/certificates/hooks/useGenerateDiploma";
import { useGenerateLetter } from "@features/certificates/hooks/useGenerateLetter";
import { useCandidates } from "@features/candidates/hooks/useCandidates";

export const Certificates = () => {
  const [activeType, setActiveType] = useState<"certificate" | "gratitude">("certificate");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    position: "", 
    reason: ""
  });

  const { candidates, loading: isLoadingCandidates } = useCandidates();
  const { generateDiploma, isLoading: isLoadingDiploma, error: errorDiploma } = useGenerateDiploma();
  const { generateLetter, isLoading: isLoadingLetter, error: errorLetter } = useGenerateLetter();

  const isLoading = isLoadingDiploma || isLoadingLetter;
  const error = errorDiploma || errorLetter;

  // Автозаполнение формы при выборе кандидата
  useEffect(() => {
    if (selectedCandidateId) {
      const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
      if (selectedCandidate) {
        setFormData({
          name: selectedCandidate.full_name,
          position: selectedCandidate.position,
          reason: selectedCandidate.reason || "За высокие профессиональные достижения и добросовестный труд"
        });
      }
    } else {
      // Сброс формы при очистке выбора кандидата
      setFormData({
        name: "",
        position: "", 
        reason: ""
      });
    }
  }, [selectedCandidateId, candidates]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.name.trim() || !formData.position.trim() || !formData.reason.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    console.log('🎯 Starting generation...', { type: activeType, data: formData });

    const success = activeType === "certificate" 
      ? await generateDiploma(formData)
      : await generateLetter(formData);

    if (success) {
      console.log('✅ Generation successful');
    } else {
      console.log('❌ Generation failed');
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

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-2xl">
          {/* Выбор кандидата - используем обычный select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Выберите кандидата
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              disabled={isLoadingCandidates}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Выберите кандидата</option>
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.full_name} - {candidate.position}
                </option>
              ))}
            </select>
            {isLoadingCandidates && (
              <span className="text-xs text-gray-500">Загрузка списка кандидатов...</span>
            )}
            {!selectedCandidateId && (
              <span className="text-xs text-gray-500">
                Выберите кандидата для автозаполнения
              </span>
            )}
          </div>

          {/* ФИО */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              ФИО *
            </label>
            <Input
              placeholder="Введите ФИО"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {selectedCandidateId && (
              <span className="text-xs text-gray-500">ФИО автоматически заполнено из выбранного кандидата</span>
            )}
          </div>

          {/* Должность */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Должность *
            </label>
            <Input
              placeholder="Введите должность"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
            />
            {selectedCandidateId && (
              <span className="text-xs text-gray-500">Должность автоматически заполнена из выбранного кандидата</span>
            )}
          </div>

          {/* Основание */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Основание для награждения *
            </label>
            <Input
              placeholder="Введите основание для награждения"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl">
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        <Button 
          onClick={handleGenerate}
          disabled={isLoading || !formData.name || !formData.position || !formData.reason}
          className="bg-blue-600 w-full max-w-2xl rounded border-none hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Генерация..." : "Сгенерировать"}
        </Button>

        {/* Информация о выбранном кандидате */}
        {selectedCandidateId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl">
            <h4 className="font-medium text-blue-800 mb-2">Информация о выбранном кандидате:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Статус:</span>{" "}
                <span className={
                  candidates.find(c => c.id === selectedCandidateId)?.status === "Прошёл" 
                    ? "text-green-600 font-medium" 
                    : "text-red-600 font-medium"
                }>
                  {candidates.find(c => c.id === selectedCandidateId)?.status || "Неизвестно"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Общий стаж:</span>{" "}
                <span className="font-medium">
                  {candidates.find(c => c.id === selectedCandidateId)?.experience_total || 0} лет
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Достижения:</span>{" "}
                <span className="font-medium">
                  {candidates.find(c => c.id === selectedCandidateId)?.achievements || "Не указаны"}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};