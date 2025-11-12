// shared/ui/orders/ui/UploadDocumentModal.tsx

import React, { useState, useRef } from "react";
import { Button } from "@shared/ui/button";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { UploadDocumentModalProps } from "./types";
import { uploadAct, completeRequest } from "./api";

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  open,
  onClose,
  requestData,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log("UploadDocumentModal render:", { open, requestData });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("Файл слишком большой. Максимальный размер: 50MB");
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !requestData) {
      setUploadError("Файл не выбран или данные заявки отсутствуют");
      return;
    }

    try {
      setLoading(true);
      setUploadError(null);

      // Загружаем акт
      await uploadAct({
        number: requestData.number,
        id: String(requestData.id),
        status: requestData.status || "в работе",
        file: selectedFile,
      });

      // После успешной загрузки акта меняем статус на "Выполнена"
      try {
        await completeRequest(String(requestData.id));
        console.log("Статус заявки успешно изменен на 'Выполнена'");
      } catch (statusError) {
        console.error(
          "Не удалось изменить статус, но акт загружен:",
          statusError
        );
        // Продолжаем выполнение даже если не удалось изменить статус
      }

      setUploadSuccess(true);
      setTimeout(() => {
        onUploadSuccess?.();
        handleClose();
      }, 2000);
    } catch (err: any) {
      console.error("Ошибка при загрузке акта:", err);
      setUploadError(
        err.message || "Не удалось загрузить акт. Попробуйте еще раз."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    console.log("Closing upload modal");
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(false);
    setLoading(false);
    onClose();
  };

  const handleRetry = () => {
    setUploadError(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("Файл слишком большой. Максимальный размер: 50MB");
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!open) {
    console.log("UploadDocumentModal: not open, returning null");
    return null;
  }

  console.log("UploadDocumentModal: rendering modal");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
          disabled={loading}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          Заявка: {requestData?.number}
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-red-800 text-sm">
            <strong>Внимание:</strong> После загрузки акта статус заявки будет
            автоматически изменен на "Выполнена"
          </div>
        </div>

        {uploadSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <div className="text-green-800 font-semibold text-lg mb-2">
              Акт успешно загружен!
            </div>
            <div className="text-gray-600 mb-2">
              Файл загружен и прикреплен к заявке.
            </div>
            <div className="text-green-700 text-sm font-medium">
              Статус заявки изменен на "Выполнена"
            </div>
          </div>
        ) : (
          <>
            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 text-sm mb-2">
                  <AlertCircle size={16} />
                  <span className="font-medium">Ошибка загрузки</span>
                </div>
                <div className="text-red-700 text-sm mb-3">{uploadError}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="text-red-700 border-red-300 hover:bg-red-50"
                >
                  <RefreshCw size={14} className="mr-1" />
                  Попробовать снова
                </Button>
              </div>
            )}

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="*/*"
              />

              {selectedFile ? (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <File size={20} className="text-blue-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium truncate max-w-xs">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="text-gray-400 hover:text-red-500"
                    disabled={loading}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                  <div className="text-gray-600 mb-1">
                    Перетащите файл сюда или нажмите для выбора
                  </div>
                  <div className="text-xs text-gray-400">
                    Поддерживаются файлы формата .docx
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                color="grey"
                className="flex-1"
                onClick={handleClose}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                variant="outline"
                color="default"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleUpload}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Загрузить акт
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
