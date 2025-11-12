// shared/ui/orders/ui/OrderModal.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@shared/ui/button";
import { Upload, Download, FileText } from "lucide-react";
import type { TableRowData, OrderModalProps } from "./types";
import {
  changeRequestStatus,
  getCatchActDocument,
  getCompletedActDocument,
} from "./api";
import { authStore } from "@features/auth";

export const OrderModal: React.FC<OrderModalProps> = ({
  open,
  onClose,
  data,
  onStatusChange,
  onOpenUploadModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [isStatusEditMode, setIsStatusEditMode] = useState(false);
  const [localData, setLocalData] = useState<TableRowData | undefined>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const updateStatus = async (newStatus: string) => {
    if (!localData?.id) return;

    try {
      setLoading(true);
      setDocumentError(null);

      await changeRequestStatus({
        id: String(localData.id),
        status: newStatus,
      });

      setLocalData((prev) => (prev ? { ...prev, status: newStatus } : prev));
      onStatusChange?.(localData.id, newStatus);
      setIsStatusEditMode(false);
    } catch (err: any) {
      console.error("Ошибка при обновлении статуса:", err);
      setDocumentError(
        err.response?.data?.message || "Не удалось изменить статус заявки"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !localData) return null;

  const { user } = authStore;

  // Проверяем статусы заявки
  const isCompleted = localData.status === "Выполнена";
  const isCancelled = localData.status === "Отменена";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative">
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          Кандидат {localData.number}
        </h2>

        {documentError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">{documentError}</div>
          </div>
        )}

        {isStatusEditMode ? (
          <div className="space-y-2 mb-4">
            <div className="text-sm font-medium mb-2">
              Выберите новый статус:
            </div>
            {["Новая", "В работе", "Отменена"].map((status) => (
              <Button
                key={status}
                variant="outline"
                className="w-full bg-neutral-200 hover:bg-neutral-300 border-none text-black"
                onClick={() => updateStatus(status)}
                disabled={loading}
              >
                {loading ? "Изменение..." : status}
              </Button>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setIsStatusEditMode(false)}
              disabled={loading}
            >
              Отмена
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              <div>
                {/* !!!!!!!!!!!!!! Отображение различных полей из localData с резервными вариантами !!!!!!!!!!!!! */}
                <b>Фамилия:</b> {localData.applicant || "-"}
              </div>
              <div>
                <b>Имя:</b> {localData.address || "-"}
              </div>
              <div>
                <b>Отчество:</b>{" "}
                {localData.dogsCount ?? localData.quantity ?? "-"}
              </div>
              <div>
                <b>Должность:</b> {localData.behavior || "-"}
              </div>
              <div>
                <b>Стаж:</b> {localData.urgency}
              </div>
              <div>
                <b>Заслуги:</b> {localData.applicantName || localData.applicant}
              </div>
              <div>
                <b>Прочие заслуги:</b>{" "}
                <ul className="list-disc list-inside">
                  <li>
                    {localData.source?.name || localData.applicantInfo || "-"}
                  </li>
                </ul>
              </div>
              {/* !!!!!!!!!!!!! Заменить */}
              <div>
                <b>Статус:</b> Новая
              </div>
            </div>

            {/* <div className="flex flex-col gap-2">
              {isCompleted ? (
                // Если статус "Выполнена" - показываем кнопку для скачивания готового акта
                <>
                  <Button
                    variant="cube"
                    onClick={handleGetCompletedAct}
                    disabled={loading}
                  >
                    <FileText size={16} className="mr-2" />
                    {loading ? "Загрузка..." : "Скачать акт отлова"}
                  </Button>

                  <Button
                    variant="cube"
                    color="grey"
                    onClick={() => setIsStatusEditMode(true)}
                  >
                    Изменить статус
                  </Button>

                  <Button variant="cube" color="grey" onClick={onClose}>
                    Закрыть
                  </Button>
                </>
              ) : isCancelled ? (
                // Если статус "Отменена" - показываем только кнопку "Изменить статус"
                <>
                  <Button
                    variant="cube"
                    color="grey"
                    onClick={() => setIsStatusEditMode(true)}
                  >
                    Изменить статус
                  </Button>

                  <Button variant="cube" color="grey" onClick={onClose}>
                    Закрыть
                  </Button>
                </>
              ) : (
                // Если статус НЕ "Выполнена" и НЕ "Отменена" - показываем все кнопки
                <>
                  <Button
                    variant="cube"
                    onClick={handleGetCatchAct}
                    disabled={loading}
                  >
                    <Download size={16} className="mr-2" />
                    {loading ? "Загрузка..." : "Получить акт на отлов"}
                  </Button>

                  {/* Показываем кнопку "Загрузить акт отлова" только если пользователь ryaon_comm или podryadchik */}
            {/* {(user?.login === "ryaon_comm" ||
                    user?.login === "podryadchik") && (
                    <Button
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 flex-1"
                      onClick={handleUploadDocument}
                    >
                      <Upload size={16} className="mr-2" />
                      Загрузить акт отлова
                    </Button>
                  )}

                  <Button
                    variant="cube"
                    color="grey"
                    onClick={() => setIsStatusEditMode(true)}
                  >
                    Изменить статус
                  </Button>

                  <Button variant="cube" color="grey" onClick={onClose}>
                    Закрыть
                  </Button>
                </>
              )}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};
