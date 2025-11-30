// useUploadFile.tsx
import { useState } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  status: "Загрузка" | "Загружен" | "Ошибка";
  size?: string;
  date?: string;
  file?: File;
}

export const useUploadFile = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const uploadFile = async (file: File, id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { api } = await import("@shared/api/axios");
      const formData = new FormData();
      formData.append("file", file);

      await api.post("/upload-candidate-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "Загружен" } : f))
      );
      return true;
    } catch (err: any) {
      console.error("Ошибка при загрузке файла:", err);
      setError(
        err.response?.data?.message ||
          "Не удалось загрузить файл. Попробуйте позже."
      );

      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "Ошибка" } : f))
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadMultipleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const id = Date.now().toString() + Math.random();
      setUploadedFiles((prev) => [
        ...prev,
        {
          id,
          name: file.name,
          status: "Загрузка",
          size: formatFileSize(file.size),
          date: new Date().toLocaleDateString("ru-RU"),
          file,
        },
      ]);
      await uploadFile(file, id);
    }
  };

  const deleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearError = () => setError(null);

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
