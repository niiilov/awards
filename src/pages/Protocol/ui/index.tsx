import { Card, CardContent } from "@shared/ui/card";
import { Sidebar } from "@shared/ui/sidebar";
import { Button } from "@shared/ui/button";
import { useState, useEffect } from "react";
import { useCommissionMembers } from "@features/template-library/hooks/useCommissionMembers";
import { useCommissionRoles } from "@features/template-library/hooks/useCommissionRoles";
import type { CommissionMember } from "@features/template-library/hooks/useCommissionMembers";

// Тип для кандидата
type Candidate = {
  id: string;
  full_name: string;
  position: string;
  birth_date: string;
  experience_total: number;
  experience_current: number;
  achievements: string;
  previous_awards: string;
  has_conviction: boolean;
  reason: string;
  status: string;
  created_at: string;
};

// Тип для ответа сервера
type CandidatesResponse = {
  candidates: Candidate[];
};

// Тип для выбранных членов с ролями
type SelectedRoleMember = {
  full_name: string;
  position: string;
  role: string;
};

export const Protocol = () => {
  const {
    members,
    loading: membersLoading,
    error: membersError,
  } = useCommissionMembers();
  const { roles, loading: rolesLoading } = useCommissionRoles();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);

  const [selectedMembers, setSelectedMembers] = useState<{
    pred: SelectedRoleMember | null;
    zam: SelectedRoleMember | null;
    secr: SelectedRoleMember | null;
    other: CommissionMember[];
  }>({
    pred: null,
    zam: null,
    secr: null,
    other: [],
  });

  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // Загружаем кандидатов
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setCandidatesLoading(true);
        setCandidatesError(null);

        const { api } = await import("@shared/api/axios");
        console.log("Загрузка кандидатов...");
        const response = await api.get<CandidatesResponse>("/candidates");

        console.log("Получены кандидаты:", response.data);

        // Важно: response.data - это объект с полем candidates
        const candidatesData = response.data?.candidates || [];
        console.log("Количество кандидатов:", candidatesData.length);

        setCandidates(candidatesData);

        if (candidatesData.length === 0) {
          console.log("Кандидаты отсутствуют или пустой массив");
        }
      } catch (err: any) {
        console.error("Ошибка при загрузке кандидатов:", err);
        console.error("Детали ошибки:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setCandidatesError(
          `Не удалось загрузить список кандидатов: ${err.message}`,
        );
      } finally {
        setCandidatesLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Фильтруем членов комиссии по ролям
  const getMembersByRole = (role: string): CommissionMember[] => {
    const roleMembers = roles
      .filter((r) => r.role === role)
      .map((r) => r.member_id);
    return members.filter((member) => roleMembers.includes(member.id));
  };

  const predMembers = getMembersByRole("Председатель");
  const zamMembers = getMembersByRole("Заместитель");
  const secrMembers = getMembersByRole("Секретарь");

  // Автоматически устанавливаем первых членов для каждой роли, если не выбраны
  useEffect(() => {
    if (predMembers.length > 0 && !selectedMembers.pred) {
      const firstPred = predMembers[0];
      setSelectedMembers((prev) => ({
        ...prev,
        pred: {
          full_name: firstPred.full_name,
          position: firstPred.position,
          role: "Председатель",
        },
      }));
    }
    if (zamMembers.length > 0 && !selectedMembers.zam) {
      const firstZam = zamMembers[0];
      setSelectedMembers((prev) => ({
        ...prev,
        zam: {
          full_name: firstZam.full_name,
          position: firstZam.position,
          role: "Заместитель",
        },
      }));
    }
    if (secrMembers.length > 0 && !selectedMembers.secr) {
      const firstSecr = secrMembers[0];
      setSelectedMembers((prev) => ({
        ...prev,
        secr: {
          full_name: firstSecr.full_name,
          position: firstSecr.position,
          role: "Секретарь",
        },
      }));
    }
  }, [predMembers, zamMembers, secrMembers]);

  const handleRoleChange = (
    role: keyof Pick<typeof selectedMembers, "pred" | "zam" | "secr">,
    memberId: string,
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const roleName =
      role === "pred"
        ? "Председатель"
        : role === "zam"
          ? "Заместитель"
          : "Секретарь";

    setSelectedMembers((prev) => ({
      ...prev,
      [role]: {
        full_name: member.full_name,
        position: member.position,
        role: roleName,
      },
    }));
  };

  const handleOtherMemberToggle = (member: CommissionMember) => {
    setSelectedMembers((prev) => ({
      ...prev,
      other: prev.other.some((m) => m.id === member.id)
        ? prev.other.filter((m) => m.id !== member.id)
        : [...prev.other, member],
    }));
  };

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId],
    );
  };

  const handleGenerateProtocol = async () => {
    try {
      // Валидация обязательных полей
      if (
        !selectedMembers.pred ||
        !selectedMembers.zam ||
        !selectedMembers.secr
      ) {
        alert("Пожалуйста, выберите председателя, заместителя и секретаря");
        return;
      }

      if (selectedCandidates.length === 0) {
        alert("Пожалуйста, выберите хотя бы одного кандидата");
        return;
      }

      const { api } = await import("@shared/api/axios");

      // Формируем commission_members_id из всех выбранных членов
      const commission_members_id = [
        ...(selectedMembers.pred
          ? [
              members.find(
                (m) => m.full_name === selectedMembers.pred?.full_name,
              )?.id,
            ]
          : []),
        ...(selectedMembers.zam
          ? [
              members.find(
                (m) => m.full_name === selectedMembers.zam?.full_name,
              )?.id,
            ]
          : []),
        ...(selectedMembers.secr
          ? [
              members.find(
                (m) => m.full_name === selectedMembers.secr?.full_name,
              )?.id,
            ]
          : []),
        ...selectedMembers.other.map((m) => m.id),
      ].filter((id): id is string => id !== undefined);

      // Формируем данные для отправки
      const requestData = {
        candidates_id: selectedCandidates,
        commission_members_id,
        pred: selectedMembers.pred,
        secr: selectedMembers.secr,
        zam: selectedMembers.zam,
      };

      console.log("Данные для генерации протокола:", requestData);

      const response = await api.post("/generate-protocol", requestData, {
        responseType: "blob",
      });

      // Скачиваем файл
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `protocol_${new Date().toISOString().split("T")[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Ошибка при генерации протокола:", err);
      alert(
        "Ошибка при генерации протокола: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  // Все члены комиссии кроме тех, кто уже выбран на основные роли
  const availableMembersForOther = members.filter((member) => {
    const isPred =
      selectedMembers.pred &&
      members.find(
        (m) =>
          selectedMembers.pred &&
          m.full_name === selectedMembers.pred.full_name,
      )?.id === member.id;
    const isZam =
      selectedMembers.zam &&
      members.find(
        (m) =>
          selectedMembers.zam && m.full_name === selectedMembers.zam.full_name,
      )?.id === member.id;
    const isSecr =
      selectedMembers.secr &&
      members.find(
        (m) =>
          selectedMembers.secr &&
          m.full_name === selectedMembers.secr.full_name,
      )?.id === member.id;

    return !isPred && !isZam && !isSecr;
  });

  const loading = membersLoading || rolesLoading || candidatesLoading;

  // Фильтруем кандидатов по статусу
  const filteredCandidates = candidates.filter(
    (candidate) => candidate.status !== "Не прошёл",
  );

  const getSelectedMemberId = (
    role: keyof Pick<typeof selectedMembers, "pred" | "zam" | "secr">,
  ): string => {
    if (!selectedMembers[role]) return "";

    const member = members.find(
      (m) => m.full_name === selectedMembers[role]?.full_name,
    );
    return member?.id || "";
  };

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

  // Отладочная информация
  console.log("Текущее состояние кандидатов:", {
    candidatesLoading,
    candidatesError,
    candidatesCount: candidates.length,
    filteredCandidatesCount: filteredCandidates.length,
    candidates: candidates,
  });

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 border-l w-full border-gray-200 p-6 space-y-6">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-6">
            {/* Секция выбора кандидатов */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Выбор кандидатов
              </h3>

              <div className="p-4 border border-gray-200 rounded-lg max-h-96 overflow-y-auto space-y-2">
                {candidatesLoading ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-sm text-gray-500">
                      Загрузка кандидатов...
                    </p>
                  </div>
                ) : candidatesError ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-red-500 mb-2">
                      {candidatesError}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      Попробовать снова
                    </Button>
                  </div>
                ) : filteredCandidates.length > 0 ? (
                  <>
                    <div className="text-xs text-gray-500 mb-2">
                      Найдено кандидатов: {filteredCandidates.length}
                    </div>
                    {filteredCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-start gap-2 p-3 hover:bg-gray-50 rounded border border-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleCandidateToggle(candidate.id)}
                          className="w-4 h-4 text-blue-400 rounded border-gray-300 focus:ring-blue-500 mt-1"
                        />
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
                                <div className="text-xs text-gray-500">
                                  Статус:{" "}
                                  <span
                                    className={`px-1.5 py-0.5 rounded ${
                                      candidate.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {candidate.status || "не указан"}
                                  </span>
                                </div>
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
                      Нет доступных кандидатов
                    </p>
                    <p className="text-xs text-gray-400">
                      {candidates.length > 0
                        ? `Все ${candidates.length} кандидатов имеют статус "Не прошёл"`
                        : "Кандидаты не найдены в системе"}
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>Возможные причины:</p>
                      <ul className="list-disc list-inside mt-1 text-left">
                        <li>Кандидаты не добавлены в систему</li>
                        <li>Проблема с подключением к серверу</li>
                        <li>Отсутствуют кандидаты с активным статусом</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {selectedCandidates.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-sm text-green-800">
                    <span className="font-medium">Выбрано кандидатов:</span>{" "}
                    {selectedCandidates.length}
                    <div className="text-xs mt-1 space-y-1">
                      {selectedCandidates
                        .map((id) => {
                          const candidate = candidates.find((c) => c.id === id);
                          return candidate ? (
                            <div key={id} className="flex items-center gap-1">
                              <span className="text-green-700">•</span>
                              <span>
                                {candidate.full_name} ({candidate.position})
                              </span>
                            </div>
                          ) : null;
                        })
                        .filter(Boolean)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Обязательные роли комиссии */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Состав комиссии
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Председатель */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Председатель *
                  </label>
                  <select
                    value={getSelectedMemberId("pred")}
                    onChange={(e) => handleRoleChange("pred", e.target.value)}
                    disabled={loading || predMembers.length === 0}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[42px] disabled:bg-gray-100"
                  >
                    {predMembers.length === 0 ? (
                      <option value="">Нет доступных председателей</option>
                    ) : (
                      predMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} - {member.position}
                        </option>
                      ))
                    )}
                  </select>
                  {predMembers.length === 0 && (
                    <span className="text-xs text-red-500">
                      Нет членов комиссии с ролью "Председатель"
                    </span>
                  )}
                </div>

                {/* Заместитель */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Заместитель *
                  </label>
                  <select
                    value={getSelectedMemberId("zam")}
                    onChange={(e) => handleRoleChange("zam", e.target.value)}
                    disabled={loading || zamMembers.length === 0}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[42px] disabled:bg-gray-100"
                  >
                    {zamMembers.length === 0 ? (
                      <option value="">Нет доступных заместителей</option>
                    ) : (
                      zamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} - {member.position}
                        </option>
                      ))
                    )}
                  </select>
                  {zamMembers.length === 0 && (
                    <span className="text-xs text-red-500">
                      Нет членов комиссии с ролью "Заместитель"
                    </span>
                  )}
                </div>

                {/* Секретарь */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Секретарь *
                  </label>
                  <select
                    value={getSelectedMemberId("secr")}
                    onChange={(e) => handleRoleChange("secr", e.target.value)}
                    disabled={loading || secrMembers.length === 0}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[42px] disabled:bg-gray-100"
                  >
                    {secrMembers.length === 0 ? (
                      <option value="">Нет доступных секретарей</option>
                    ) : (
                      secrMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} - {member.position}
                        </option>
                      ))
                    )}
                  </select>
                  {secrMembers.length === 0 && (
                    <span className="text-xs text-red-500">
                      Нет членов комиссии с ролью "Секретарь"
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Другие члены комиссии */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Другие члены комиссии
              </h3>

              <div className="p-4 border border-gray-200 rounded-lg max-h-64 overflow-y-auto space-y-2">
                {loading ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Загрузка членов комиссии...
                  </p>
                ) : availableMembersForOther.length > 0 ? (
                  availableMembersForOther.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMembers.other.some(
                          (m) => m.id === member.id,
                        )}
                        onChange={() => handleOtherMemberToggle(member)}
                        className="w-4 h-4 text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">
                        {member.full_name} - {member.position}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Все члены комиссии уже выбраны на роли
                  </p>
                )}
              </div>
            </div>

            {/* Информация о выбранных членах */}
            {(selectedMembers.pred ||
              selectedMembers.zam ||
              selectedMembers.secr ||
              selectedMembers.other.length > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Выбранный состав комиссии:
                </h4>
                <div className="space-y-1 text-sm">
                  {selectedMembers.pred && (
                    <div>
                      <span className="text-gray-600">Председатель:</span>{" "}
                      <span className="font-medium">
                        {selectedMembers.pred.full_name} (
                        {selectedMembers.pred.position})
                      </span>
                    </div>
                  )}
                  {selectedMembers.zam && (
                    <div>
                      <span className="text-gray-600">Заместитель:</span>{" "}
                      <span className="font-medium">
                        {selectedMembers.zam.full_name} (
                        {selectedMembers.zam.position})
                      </span>
                    </div>
                  )}
                  {selectedMembers.secr && (
                    <div>
                      <span className="text-gray-600">Секретарь:</span>{" "}
                      <span className="font-medium">
                        {selectedMembers.secr.full_name} (
                        {selectedMembers.secr.position})
                      </span>
                    </div>
                  )}
                  {selectedMembers.other.length > 0 && (
                    <div>
                      <span className="text-gray-600">Члены комиссии:</span>{" "}
                      <span className="font-medium">
                        {selectedMembers.other
                          .map(
                            (member) =>
                              `${member.full_name} (${member.position})`,
                          )
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div>
              <Button
                onClick={handleGenerateProtocol}
                disabled={
                  !selectedMembers.pred ||
                  !selectedMembers.zam ||
                  !selectedMembers.secr ||
                  selectedCandidates.length === 0
                }
                variant="cube"
                className="w-full"
              >
                Сформировать протокол
              </Button>
            </div>

            {/* Ошибки */}
            {membersError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Ошибка загрузки членов комиссии:</strong> {membersError}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
