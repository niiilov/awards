// useUploadedFiles.tsx
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

      if (response.data && typeof response.data === "object") {
        const filesData = transformApiData(response.data);
        setFiles(filesData);
      } else {
        setFiles([]);
      }
      setHasFetched(true);
    } catch (err: any) {
      console.error("Ошибка загрузки списка файлов:", err);
      setFiles([]); // пустая таблица вместо ошибки
      setHasFetched(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (filename: string) => {
    try {
      const { api } = await import("@shared/api/axios");
      await api.delete(`/uploaded-files/${encodeURIComponent(filename)}`);
      setFiles((prev) => prev.filter((f) => f.name !== filename));
      return true;
    } catch (err: any) {
      console.error("Ошибка при удалении файла:", err);
      setError(
        err.response?.data?.message ||
          "Не удалось удалить файл. Попробуйте позже."
      );
      return false;
    }
  };

  useEffect(() => {
    if (!hasFetched) fetchUploadedFiles();
  }, [hasFetched]);

  return { files, loading, error, refetch: fetchUploadedFiles, deleteFile };
};

const transformApiData = (apiData: any): UploadedFileInfo[] => {
  const files: UploadedFileInfo[] = [];
  Object.keys(apiData).forEach((key) => {
    const fileArray = apiData[key];
    if (Array.isArray(fileArray)) {
      fileArray.forEach((fileName: string, index: number) => {
        files.push({
          id: `${key}_${index}`,
          name: fileName,
          status: "Загружен",
          uploaded_at: new Date().toISOString(),
        });
      });
    }
  });
  return files;
};
