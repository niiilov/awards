// features/upload/hooks/useUploadedFiles.ts
import { useState, useEffect } from "react";

export interface UploadedFileInfo {
  id: string;
  name: string;
  status: "Загружен" | "Ошибка" | "Обработан" | "В обработке";
  size?: string;
  uploaded_at: string;
  download_url?: string;
}

export const useUploadedFiles = () => {
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUploadedFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { api } = await import("@shared/api/axios");
      const response = await api.get("/uploaded-files");
      
      console.log('=== Ответ от API /uploaded-files ===', response.data);
      
      let filesData: UploadedFileInfo[] = [];
      
      if (response.data && typeof response.data === 'object') {
        // Преобразуем данные из API в наш формат
        filesData = transformApiData(response.data);
      } else {
        console.error('Неверный формат ответа от API:', response.data);
        filesData = [];
      }
      
      console.log('Извлеченные файлы:', filesData);
      setFiles(filesData);
      setHasFetched(true);
      
    } catch (err: any) {
      console.error("Ошибка загрузки списка файлов:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось загрузить список файлов. Пожалуйста, попробуйте позже."
      );
      setFiles([]);
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filename: string) => {
    try {
      const { api } = await import("@shared/api/axios");
      await api.delete(`/uploaded-files/${encodeURIComponent(filename)}`);
      
      // Обновляем локальное состояние
      setFiles(prev => prev.filter(file => file.name !== filename));
      return true;
    } catch (err: any) {
      console.error("Ошибка при удалении файла:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось удалить файл. Пожалуйста, попробуйте позже."
      );
      return false;
    }
  };

  // Загружаем файлы только при первом монтировании
  useEffect(() => {
    if (!hasFetched) {
      fetchUploadedFiles();
    }
  }, [hasFetched]);

  return {
    files,
    loading,
    error,
    refetch: fetchUploadedFiles,
    deleteFile,
  };
};

// Функция для преобразования данных из API в наш формат
const transformApiData = (apiData: any): UploadedFileInfo[] => {
  const files: UploadedFileInfo[] = [];
  
  // Обрабатываем каждый ключ в ответе API
  Object.keys(apiData).forEach(key => {
    const fileArray = apiData[key];
    if (Array.isArray(fileArray)) {
      fileArray.forEach((fileName: string, index: number) => {
        files.push({
          id: `${key}_${index}`, // Генерируем ID для React key
          name: fileName,
          status: "Загружен", // По умолчанию считаем загруженными
          uploaded_at: new Date().toISOString(),
        });
      });
    }
  });
  
  return files;
};