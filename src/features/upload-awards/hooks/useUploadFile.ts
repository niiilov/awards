// useUploadFile.tsx
import { useState } from "react";

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMultipleFiles = async (files: FileList) => {
    setLoading(true);
    setError(null);

    try {
      const { api } = await import("@shared/api/axios");

      // Для каждого файла создаем отдельный FormData
      const uploadPromises = Array.from(files).map(async (file) => {
        console.log("Загружаем файл:", {
          name: file.name,
          originalName: file.name,
          type: file.type,
          size: file.size,
        });

        const formData = new FormData();
        formData.append("file", file);
        // Отправляем оригинальное имя файла как отдельное поле
        formData.append("original_filename", file.name);

        return await api.post("/upload-candidate-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });

      // Ждем завершения всех загрузок
      const results = await Promise.all(uploadPromises);
      console.log("Все файлы загружены:", results.length);

      return true;
    } catch (err: any) {
      console.error("Ошибка при загрузке файлов:", err);
      setError(
        err.response?.data?.message ||
          "Не удалось загрузить файлы. Попробуйте позже.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    uploadMultipleFiles,
    clearError,
  };
};
