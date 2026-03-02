import React, { useRef, useState } from "react";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";

interface AreaListModalProps {
  open: boolean;
  onClose: () => void;
}

const allowedExtensions = ["zip", "rar", "doc", "docx"];

export const TemplateModal: React.FC<AreaListModalProps> = ({
  open,
  onClose,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const validateFiles = (fileList: FileList | null) => {
    if (!fileList) return [];

    const validFiles: File[] = [];

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && allowedExtensions.includes(ext)) {
        validFiles.push(file);
      }
    });

    return validFiles;
  };

  const handleFiles = (fileList: FileList | null) => {
    const validFiles = validateFiles(fileList);

    if (!validFiles.length) {
      alert("Недопустимый формат файла");
      return;
    }

    setUploadLoading(true);

    // имитация загрузки
    setTimeout(() => {
      setFiles((prev) => [...prev, ...validFiles]);
      setUploadLoading(false);
    }, 800);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    console.log("Файлы:", files);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-[500px] shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute text-3xl cursor-pointer top-2 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Добавление нового шаблона
        </h2>

        <div className="space-y-4 mb-6">
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
              <p className="font-bold">
                {uploadLoading
                  ? "Загрузка файлов..."
                  : 'Переместите файлы или выберите их в "Обзоре"'}
              </p>
              <p className="text-sm text-gray-500">Формат: doc, docx</p>
              <Button
                type="button"
                onClick={handleBrowseClick}
                disabled={uploadLoading}
              >
                {uploadLoading ? "Загрузка..." : "Обзор"}
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleChange}
          />

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 rounded px-3 py-2 text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid w-full items-center gap-2">
            <Label>Название шаблона</Label>
            <Input type="text" placeholder="Введите название шаблона" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="cube" color="grey" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="cube" onClick={handleAdd} disabled={!files.length}>
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
};
