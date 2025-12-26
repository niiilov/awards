// UploadAwards.tsx
import { Button } from "@shared/ui/button";
import { Sidebar } from "@shared/ui/sidebar";
import { useState, useRef } from "react";
import SendIcon from "../assets/Icon.svg";
import { UploadedTable } from "./UploadedTable";
import { useUploadFile } from "@features/upload-awards/hooks/useUploadFile";
import { UploadMessage } from "./UploadMessage";

export const UploadAwards = () => {
  const [dragActive, setDragActive] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    loading: uploadLoading,
    error: uploadError,
    uploadMultipleFiles,
    clearError,
  } = useUploadFile();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFiles(e.target.files);
  };

  // Функция для проверки допустимых форматов файлов
  const isValidFileType = (fileName: string): boolean => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const validExtensions = ["zip", "rar", "doc", "docx"];
    return validExtensions.includes(ext || "");
  };

  const handleFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter((file) =>
      isValidFileType(file.name),
    );

    if (!validFiles.length) {
      alert("Пожалуйста, выберите файлы формата ZIP/RAR или DOC/DOCX");
      return;
    }

    console.log(
      "Начинаем загрузку файлов:",
      validFiles.map((f) => f.name),
    );

    const dataTransfer = new DataTransfer();
    validFiles.forEach((file) => dataTransfer.items.add(file));

    try {
      const success = await uploadMultipleFiles(dataTransfer.files);
      console.log("================ uploadMultipleFiles result:", success);
      if (success) {
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
        // Даем серверу время обработать файлы
        setTimeout(() => {
          setRefreshTrigger((prev) => prev + 1);
        }, 1500);

        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Ошибка при загрузке файлов:", err);
    }
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />
      <main className="flex-1 relative w-full border-l border-gray-200 p-6 space-y-6">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Загрузка файлов</h2>
          <h3 className="text-sm text-neutral-500">
            Загрузка поддерживает документы форматом ZIP/RAR/DOC/DOCX
          </h3>
        </div>

        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-600 bg-blue-100"
                : "border-blue-500 bg-blue-50"
            } ${uploadLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <img
                src={SendIcon}
                className="w-full flex justify-center h-6"
                alt=""
              />
              <p className="font-bold">
                {uploadLoading
                  ? "Загрузка файлов..."
                  : 'Переместите файлы или выберите их в "Обзоре"'}
              </p>
              <p className="text-sm text-gray-500">
                Формат: zip, rar, doc, docx
              </p>
              <Button
                onClick={handleBrowseClick}
                disabled={uploadLoading}
                className="bg-blue-600 hover:bg-blue-700 rounded-[8px] px-4 py-1 hover:text-white text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadLoading ? "Загрузка..." : "Обзор"}
              </Button>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800 text-sm">{uploadError}</div>
              <Button
                onClick={clearError}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Закрыть
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".zip,.rar,.doc,.docx"
            onChange={handleChange}
            className="hidden"
            disabled={uploadLoading}
          />

          <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
            <UploadedTable refreshTrigger={refreshTrigger} />
          </div>
        </div>
        <UploadMessage isVisible={showSuccessMessage} />
      </main>
    </div>
  );
};
