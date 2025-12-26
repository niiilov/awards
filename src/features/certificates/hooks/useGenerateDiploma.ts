// hooks/useGenerateDiploma.ts
import { useState } from "react";
import { api } from "@shared/api/axios";

interface GenerateDiplomaParams {
  name: string;
  position: string;
  reason: string;
}

interface UseGenerateDiplomaReturn {
  generateDiploma: (params: GenerateDiplomaParams[]) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  data: Blob | null;
}

export const useGenerateDiploma = (): UseGenerateDiplomaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Blob | null>(null);

  const generateDiploma = async (
    candidates: GenerateDiplomaParams[],
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending diploma request:", candidates);

      const response = await api.post("/generate-gramota", candidates, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      });

      console.log("Diploma response status:", response.status);
      console.log("Response data size:", response.data?.size || 0);

      // Проверяем, что файл не пустой
      if (!response.data || response.data.size === 0) {
        throw new Error("Сервер вернул пустой файл");
      }

      // Проверяем, что это действительно PPTX файл
      const contentType = response.headers["content-type"];
      const contentDisposition = response.headers["content-disposition"];

      console.log("Content-Type:", contentType);
      console.log("Content-Disposition:", contentDisposition);

      // Создаем Blob из полученных данных
      const blob = new Blob([response.data], {
        type:
          contentType ||
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });

      setData(blob);

      // Автоматически скачиваем файл
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Генерируем имя файла на основе кандидатов
      let filename = `gramota_${new Date().toISOString().split("T")[0]}.pptx`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      } else if (candidates.length === 1) {
        // Для одного кандидата используем его имя в названии файла
        filename = `gramota_${candidates[0].name.replace(/\s+/g, "_")}.pptx`;
      } else {
        // Для нескольких кандидатов указываем количество
        filename = `gramoty_${candidates.length}_candidate_${new Date().toISOString().split("T")[0]}.pptx`;
      }

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("Diploma generated successfully");
      return true;
    } catch (err: any) {
      console.error("Full diploma error:", err);

      let errorMessage = "Ошибка при генерации грамоты";

      if (err.response?.status === 500) {
        // Пытаемся прочитать текст ошибки из blob
        if (err.response.data instanceof Blob) {
          try {
            const errorText = await err.response.data.text();
            if (errorText && errorText.length > 0) {
              // Парсим XML ошибки если нужно
              if (errorText.includes("<?xml")) {
                // Это XML ошибка, извлекаем сообщение
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(errorText, "text/xml");
                const faultString =
                  xmlDoc.getElementsByTagName("faultstring")[0];
                if (faultString) {
                  errorMessage = `Ошибка сервера: ${faultString.textContent}`;
                } else {
                  errorMessage = "Внутренняя ошибка сервера";
                }
              } else {
                errorMessage = `Ошибка сервера: ${errorText}`;
              }
            }
          } catch (blobError) {
            console.error("Error reading error blob:", blobError);
            errorMessage = "Внутренняя ошибка сервера (500)";
          }
        } else {
          errorMessage = "Внутренняя ошибка сервера (500)";
        }
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Превышено время ожидания ответа от сервера";
      } else if (err.response?.status === 400) {
        errorMessage = "Неверные данные запроса. Проверьте введенные данные.";
      } else if (err.response?.status === 404) {
        errorMessage = "Сервис генерации грамот недоступен";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateDiploma,
    isLoading,
    error,
    data,
  };
};
