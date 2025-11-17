// features/candidates/components/CandidatesModal.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@shared/ui/button";
import { Upload, Download, Edit, Save, X, Trash2 } from "lucide-react";
import { authStore } from "@features/auth";
import { useDeleteCandidate } from "@features/candidates/hooks/useDeleteCandidate";
import { useChangeStatus } from "@features/candidates/hooks/useChangeStatus";

export interface CandidateData {
  id: string;
  full_name: string;
  position: string;
  experience_total: number;
  experience_current: number;
  status: string;
  birth_date?: string;
  achievements?: string;
  has_conviction?: boolean;
  previous_awards?: string;
  reason?: string;
  created_at?: string;
}

export interface CandidatesModalProps {
  open: boolean;
  onClose: () => void;
  data?: CandidateData;
  onStatusChange?: (id: string, newStatus: string) => void;
  onOpenUploadModal?: (candidateData: CandidateData) => void;
  onCandidateDelete?: (id: string) => void;
}

export const CandidatesModal: React.FC<CandidatesModalProps> = ({
  open,
  onClose,
  data,
  onStatusChange,
  onOpenUploadModal,
  onCandidateDelete,
}) => {
  const [isStatusEditMode, setIsStatusEditMode] = useState(false);
  const [localData, setLocalData] = useState<CandidateData | undefined>(data);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { changeCandidateStatus, loading: statusLoading, error: statusError, clearError: clearStatusError } = useChangeStatus();
  const { deleteCandidate: deleteCandidateApi, loading: deleteLoading, error: deleteError, clearError: clearDeleteError } = useDeleteCandidate();

  useEffect(() => {
    setLocalData(data);
    setSelectedStatus(data?.status || "");
    setShowDeleteConfirm(false);
    clearStatusError();
    clearDeleteError();
  }, [data, clearStatusError, clearDeleteError]);

  const handleStatusUpdate = async () => {
    if (!localData?.id || !selectedStatus) return;

    try {
      // Используем useChangeStatus для обновления статуса
      await changeCandidateStatus(localData.id, selectedStatus);
      
      setLocalData(prev => prev ? { ...prev, status: selectedStatus } : prev);
      onStatusChange?.(localData.id, selectedStatus);
      setIsStatusEditMode(false);
    } catch (err: any) {
      console.error("Ошибка при обновлении статуса:", err);
    }
  };

  const handleDeleteClick = async () => {
    if (!localData?.id) return;

    try {
      await deleteCandidateApi(localData.id);
      onCandidateDelete?.(localData.id);
      onClose();
    } catch (err: any) {
      console.error("Ошибка при удалении кандидата:", err);
    }
  };

  const handleDownloadDocuments = () => {
    console.log("Скачать документы кандидата:", localData);
  };

  const handleUploadDocuments = () => {
    console.log("Загрузить документы кандидата:", localData);
    if (localData) {
      onOpenUploadModal?.(localData);
    }
  };

  const formatExperience = (years: number) => {
    if (years === 0) return "Менее года";
    if (years === 1) return "1 год";
    if (years >= 2 && years <= 4) return `${years} года`;
    return `${years} лет`;
  };

  const translateStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "Одобрено";
      case "rejected":
        return "Отклонено";
      case "pending":
        return "На рассмотрении";
      default:
        return status || "На рассмотрении";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const statusOptions = [
    { value: "pending", label: "На рассмотрении" },
    { value: "approved", label: "Одобрено" },
    { value: "rejected", label: "Отклонено" },
  ];

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

        {(statusError || deleteError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">{statusError || deleteError}</div>
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

            <div className="flex justify-between items-center">
              <span className="font-medium">Статус:</span>
              {isStatusEditMode ? (
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border rounded px-2 py-1"
                  disabled={statusLoading}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`px-2 py-1 rounded ${getStatusColor(localData.status)}`}>
                  {translateStatus(localData.status)}
                </span>
              )}
            </div>

            {localData.birth_date && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Дата рождения:</span>
                <span>{new Date(localData.birth_date).toLocaleDateString('ru-RU')}</span>
              </div>
            )}

            {localData.achievements && (
              <div>
                <span className="font-medium block mb-1">Достижения:</span>
                <p className="text-sm text-gray-600">{localData.achievements}</p>
              </div>
            )}

            {localData.previous_awards && (
              <div>
                <span className="font-medium block mb-1">Предыдущие награды:</span>
                <p className="text-sm text-gray-600">{localData.previous_awards}</p>
              </div>
            )}

            {localData.reason && (
              <div>
                <span className="font-medium block mb-1">Основание для награды:</span>
                <p className="text-sm text-gray-600">{localData.reason}</p>
              </div>
            )}

            {localData.has_conviction !== undefined && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Наличие судимости:</span>
                <span>{localData.has_conviction ? "Да" : "Нет"}</span>
              </div>
            )}

            {localData.created_at && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Дата создания:</span>
                <span>{new Date(localData.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {isStatusEditMode ? (
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
                onClick={() => {
                  setIsStatusEditMode(false);
                  setSelectedStatus(localData.status || "");
                  clearStatusError();
                  clearDeleteError();
                }}
                disabled={statusLoading}
              >
                <X size={16} className="mr-2" />
                Отмена
              </Button>
            </div>
          ) : showDeleteConfirm ? (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 text-sm font-medium mb-2">
                  Вы уверены, что хотите удалить кандидата?
                </div>
                <div className="text-red-700 text-xs">
                  Это действие нельзя отменить. Все данные кандидата будут удалены.
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="cube"
                  color="red"
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
              <Button
                variant="cube"
                onClick={() => setIsStatusEditMode(true)}
              >
                <Edit size={16} className="mr-2" />
                Изменить статус
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="cube"
                  className="flex-1"
                  onClick={handleDownloadDocuments}
                >
                  <Download size={16} className="mr-2" />
                  Скачать документы
                </Button>

                <Button
                  variant="cube"
                  className="flex-1"
                  onClick={handleUploadDocuments}
                >
                  <Upload size={16} className="mr-2" />
                  Загрузить документы
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