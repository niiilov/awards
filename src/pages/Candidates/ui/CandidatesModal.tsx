import React, { useState } from "react";
import { Button } from "@shared/ui/button";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { useDeleteCandidate } from "@features/candidates/hooks/useDeleteCandidate";
import { useUpdateCandidateStatus } from "@features/candidates/hooks/useUpdateCandidateStatus";
import { useUpdateCandidateConviction } from "@features/candidates/hooks/useUpdateCandidateConviction";
import type { Candidate } from "@features/candidates/hooks/useCandidates";

export interface CandidatesModalProps {
  open: boolean;
  onClose: () => void;
  data?: Candidate;
  onStatusChange?: (id: string, newStatus: string) => void;
  onConvictionChange?: (id: string, hasConviction: boolean) => void; // <-- Добавляем новый пропс
  onCandidateDelete?: (id: string) => void;
  onOpenUploadModal?: (candidateData: Candidate) => void;
}

export const CandidatesModal: React.FC<CandidatesModalProps> = ({
  open,
  onClose,
  data,
  onStatusChange,
  onConvictionChange, // <-- Получаем пропс
  onCandidateDelete,
}) => {
  const [isStatusEditMode, setIsStatusEditMode] = useState(false);
  const [isConvictionEditMode, setIsConvictionEditMode] = useState(false);
  const [localData, setLocalData] = useState<Candidate | undefined>(data);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedConviction, setSelectedConviction] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    updateCandidateStatus,
    loading: statusLoading,
    error: statusError,
    clearError: clearStatusError,
  } = useUpdateCandidateStatus();
  const {
    updateCandidateConviction,
    loading: convictionLoading,
    error: convictionError,
    clearError: clearConvictionError,
  } = useUpdateCandidateConviction();
  const {
    deleteCandidate: deleteCandidateApi,
    loading: deleteLoading,
    error: deleteError,
    clearError: clearDeleteError,
  } = useDeleteCandidate();

  const statusOptions = [
    { value: "Прошёл", label: "Прошёл" },
    { value: "Не прошёл", label: "Не прошёл" },
  ];

  const normalizeStatusForDisplay = (status: string): string => {
    if (!status) return "Не прошёл";
    const statusLower = status.toLowerCase().trim();
    if (
      statusLower === "прошёл" ||
      statusLower === "прошел" ||
      statusLower === "passed" ||
      statusLower === "approved" ||
      statusLower === "одобрено"
    ) {
      return "Прошёл";
    }
    return "Не прошёл";
  };

  const handleStatusSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedStatus(e.target.value);
  };

  const handleConvictionSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedConviction(e.target.value === "true");
  };

  const handleStartStatusEdit = () => {
    setIsStatusEditMode(true);
    clearStatusError();
  };

  const handleCancelStatusEdit = () => {
    setIsStatusEditMode(false);
    setSelectedStatus(normalizeStatusForDisplay(localData?.status || ""));
    clearStatusError();
  };

  const handleStartConvictionEdit = () => {
    setIsConvictionEditMode(true);
    clearConvictionError();
  };

  const handleCancelConvictionEdit = () => {
    setIsConvictionEditMode(false);
    setSelectedConviction(localData?.has_conviction || false);
    clearConvictionError();
  };

  const handleStatusUpdate = async () => {
    if (!localData?.id || !selectedStatus) return;
    try {
      await updateCandidateStatus(localData.id, selectedStatus);
      const updatedCandidate = { ...localData, status: selectedStatus };
      setLocalData(updatedCandidate);
      onStatusChange?.(localData.id, selectedStatus); // Вызываем колбэк
      setIsStatusEditMode(false);
    } catch (err) {
      console.error("Ошибка при обновлении статуса:", err);
    }
  };

  const handleConvictionUpdate = async () => {
    if (!localData?.id) return;
    try {
      await updateCandidateConviction(localData.id, selectedConviction);
      const updatedCandidate = {
        ...localData,
        has_conviction: selectedConviction,
      };
      setLocalData(updatedCandidate);
      onConvictionChange?.(localData.id, selectedConviction); // <-- Вызываем колбэк
      setIsConvictionEditMode(false);
    } catch (err) {
      console.error("Ошибка при обновлении судимости:", err);
    }
  };

  const handleDeleteClick = async () => {
    if (!localData?.id) return;
    try {
      await deleteCandidateApi(localData.id);
      onCandidateDelete?.(localData.id);
      onClose();
    } catch (err) {
      console.error("Ошибка при удалении кандидата:", err);
    }
  };

  const formatExperience = (years: number) => {
    if (years === null || years === undefined) return "Не указан";
    if (years === 0) return "Менее года";
    if (years === 1) return "1 год";
    if (years >= 2 && years <= 4) return `${years} года`;
    return `${years} лет`;
  };

  const getStatusColor = (status: string) => {
    return normalizeStatusForDisplay(status) === "Прошёл"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getConvictionColor = (hasConviction: boolean) => {
    return hasConviction
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  if (!open || !localData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-lg relative">
        <button
          className="absolute text-2xl cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          Кандидат: {localData.full_name || "Не указано"}
        </h2>

        {(statusError || convictionError || deleteError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">
              {statusError || convictionError || deleteError}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">ФИО:</span>
              <span>{localData.full_name || "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Должность:</span>
              <span>{localData.position || "-"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Общий стаж:</span>
              <span>
                {localData.experience_total !== undefined
                  ? formatExperience(localData.experience_total)
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Текущий стаж:</span>
              <span>
                {localData.experience_current !== undefined
                  ? formatExperience(localData.experience_current)
                  : "-"}
              </span>
            </div>

            {/* Статус - только для отображения */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Статус:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded ${getStatusColor(
                    localData.status,
                  )}`}
                >
                  {normalizeStatusForDisplay(localData.status)}
                </span>
              </div>
            </div>
            {normalizeStatusForDisplay(localData.status) === "Не прошёл" &&
              localData.reason && (
                <div className="text-sm text-red-600 mt-1">
                  {localData.reason}
                </div>
              )}

            {/* Наличие судимости - только для отображения */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Наличие судимости:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded ${getConvictionColor(
                    localData.has_conviction || false,
                  )}`}
                >
                  {localData.has_conviction ? "Да" : "Нет"}
                </span>
              </div>
            </div>

            {localData.birth_date && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Дата рождения:</span>
                <span>
                  {new Date(localData.birth_date).toLocaleDateString("ru-RU")}
                </span>
              </div>
            )}

            {localData.achievements && (
              <div>
                <span className="font-medium block mb-1">Достижения:</span>
                <p className="text-sm text-gray-600">
                  {localData.achievements}
                </p>
              </div>
            )}

            {localData.previous_awards && (
              <div>
                <span className="font-medium block mb-1">
                  Предыдущие награды:
                </span>
                <p className="text-sm text-gray-600">
                  {localData.previous_awards}
                </p>
              </div>
            )}

            {localData.created_at && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Дата создания:</span>
                <span>
                  {new Date(localData.created_at).toLocaleDateString("ru-RU")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isStatusEditMode || isConvictionEditMode ? (
            <div className="space-y-3">
              {isStatusEditMode && (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800 text-sm font-medium mb-2">
                      Изменение статуса
                    </div>
                    <select
                      value={selectedStatus}
                      onChange={handleStatusSelectChange}
                      className="w-full border rounded px-3 py-2"
                      disabled={statusLoading}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="cube"
                      className="flex-1"
                      onClick={handleStatusUpdate}
                      disabled={statusLoading || !selectedStatus}
                    >
                      <Save size={16} className="mr-2" />
                      {statusLoading ? "Сохранение..." : "Сохранить статус"}
                    </Button>
                    <Button
                      variant="cube"
                      color="grey"
                      className="flex-1"
                      onClick={handleCancelStatusEdit}
                      disabled={statusLoading}
                    >
                      <X size={16} className="mr-2" />
                      Отмена
                    </Button>
                  </div>
                </>
              )}

              {isConvictionEditMode && (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800 text-sm font-medium mb-2">
                      Изменение наличия судимости
                    </div>
                    <select
                      value={selectedConviction.toString()}
                      onChange={handleConvictionSelectChange}
                      className="w-full border rounded px-3 py-2"
                      disabled={convictionLoading}
                    >
                      <option value="true">Да</option>
                      <option value="false">Нет</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="cube"
                      className="flex-1"
                      onClick={handleConvictionUpdate}
                      disabled={convictionLoading}
                    >
                      <Save size={16} className="mr-2" />
                      {convictionLoading ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button
                      variant="cube"
                      color="grey"
                      className="flex-1"
                      onClick={handleCancelConvictionEdit}
                      disabled={convictionLoading}
                    >
                      <X size={16} className="mr-2" />
                      Отмена
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : showDeleteConfirm ? (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 text-sm font-medium mb-2">
                  Вы уверены, что хотите удалить кандидата?
                </div>
                <div className="text-red-700 text-xs">
                  Это действие нельзя отменить. Все данные кандидата будут
                  удалены.
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="cube"
                  className="flex-1"
                  onClick={handleDeleteClick}
                  disabled={deleteLoading}
                >
                  <Trash2 size={16} className="mr-2" />
                  {deleteLoading ? "Удаление..." : "Да, удалить"}
                </Button>
                <Button
                  variant="cube"
                  color="grey"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    clearDeleteError();
                  }}
                  disabled={deleteLoading}
                >
                  <X size={16} className="mr-2" />
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  variant="cube"
                  className="flex-1"
                  onClick={handleStartStatusEdit}
                >
                  <Edit size={16} className="mr-2" />
                  Изменить статус
                </Button>
                <Button
                  variant="cube"
                  className="flex-1"
                  onClick={handleStartConvictionEdit}
                >
                  <Edit size={16} className="mr-2" />
                  Изменить судимость
                </Button>
              </div>

              <Button
                variant="cube"
                color="grey"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={16} className="mr-2" />
                Удалить кандидата
              </Button>

              <Button variant="cube" color="grey" onClick={onClose}>
                Закрыть
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
