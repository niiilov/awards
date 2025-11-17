// features/upload/hooks/useUploadFile.ts
import { useState } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  status: "Загружен" | "Ошибка" | "Загрузка";
  size?: string;
  date?: string;
  file?: File;
}

export const useUploadFile = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { api } = await import("@shared/api/axios");
      
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append("file", file);

      console.log('Отправка файла на сервер:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const response = await api.post("/upload-candidate-file", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Файл успешно загружен:', response.data);
      
      // Добавляем файл в список с статусом "Загружен"
      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        status: "Загружен",
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString("ru-RU"),
        file: file
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      return true;

    } catch (err: any) {
      console.error("Ошибка при загрузке файла:", err);
      
      const errorMessage = err.response?.data?.message || 
                          "Не удалось загрузить файл. Пожалуйста, попробуйте позже.";
      
      setError(errorMessage);

      // Добавляем файл в список с статусом "Ошибка"
      const failedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        status: "Ошибка",
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString("ru-RU"),
        file: file
      };

      setUploadedFiles(prev => [...prev, failedFile]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadMultipleFiles = async (files: FileList): Promise<void> => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Сначала добавляем файл с статусом "Загрузка"
      const uploadingFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        status: "Загрузка",
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString("ru-RU"),
        file: file
      };

      setUploadedFiles(prev => [...prev, uploadingFile]);

      // Затем загружаем файл
      await uploadFile(file);
    }
  };

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const clearError = () => setError(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return {
    uploadedFiles,
    loading,
    error,
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    clearError,
  };
};