import { Button } from "@shared/ui/button";
import { Sidebar } from "@shared/ui/sidebar";
import { useState, useRef } from "react";
import SendIcon from "../assets/Icon.svg";
import { UploadedTable } from "./UploadedTable";
import { useUploadFile } from "@features/upload-awards/hooks/useUploadFile";

export const UploadAwards = () => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    loading: uploadLoading,
    error: uploadError,
    uploadMultipleFiles,
    clearError
  } = useUploadFile();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    // Проверяем форматы файлов
    const validFiles = Array.from(files).filter(file => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      return fileExtension === "pdf" || fileExtension === "docx";
    });

    if (validFiles.length === 0) {
      alert("Пожалуйста, выберите файлы формата PDF или DOCX");
      return;
    }

    // Создаем новый FileList с валидными файлами
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));
    
    await uploadMultipleFiles(dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Загрузка файлов</h2>
          <h3 className="text-sm text-neutral-500">
            Загрузка поддерживает документы только форматом PDF/DOCX
          </h3>
        </div>

        {/* Основная карточка загрузки */}
        <div className="space-y-6">
          {/* Область перетаскивания */}
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
              <p className="text-bold">
                {uploadLoading ? "Загрузка файлов..." : "Переместите файлы или выберите их в \"Обзоре\""}
              </p>
              <p className="text-sm text-gray-500">Формат: pdf, docx</p>
              <Button
                onClick={handleBrowseClick}
                disabled={uploadLoading}
                className="bg-blue-600 hover:bg-blue-700 rounded-[8px] px-4 py-1 hover:text-white text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadLoading ? "Загрузка..." : "Обзор"}
              </Button>
            </div>
          </div>

          {/* Отображение ошибок загрузки */}
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

          {/* Скрытый input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleChange}
            className="hidden"
            disabled={uploadLoading}
          />

          {/* Таблица загруженных файлов */}
          <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
            <UploadedTable />
          </div>
        </div>
      </main>
    </div>
  );
};