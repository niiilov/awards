import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Sidebar } from "@shared/ui/sidebar";
import { useState, useRef } from "react";
import SendIcon from "../assets/Icon.svg";
import { UploadedTable } from "./UploadedTable";

interface UploadedFile {
  id: string;
  name: string;
  status: "Загружен" | "Ошибка" | "Загрузка";
  size?: string;
  date?: string;
}

export const UploadAwards = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "1", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "2", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "3", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "4", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "5", name: "nagradnoy_list.docx", status: "Загружен" },
  ]);

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(files).forEach((file, index) => {
      // Проверяем формат файла
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const isValidFormat = fileExtension === "pdf" || fileExtension === "docx";

      newFiles.push({
        id: Date.now() + index.toString(),
        name: file.name,
        status: isValidFormat ? "Загружен" : "Ошибка",
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString("ru-RU"),
      });
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleShowMore = () => {
    // Логика для загрузки дополнительных файлов
    console.log("Загружаем больше файлов...");
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
            }`}
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
                Переместите файлы или выберите их в "Обзоре"
              </p>
              <p className="text-sm text-gray-500">Формат: pdf, docx</p>
              <Button
                onClick={handleBrowseClick}
                className="bg-blue-600 hover:bg-blue-700 rounded-[8px] px-4 py-1 hover:text-white text-white"
              >
                Обзор
              </Button>
            </div>
          </div>

          {/* Скрытый input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleChange}
            className="hidden"
          />

          {/* Разделитель */}
          <div className="min-w-full flex pb-2 gap-6 overflow-x-auto flex-nowrap">
            <UploadedTable />
          </div>
        </div>
      </main>
    </div>
  );
};
