import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Download } from "lucide-react";
import { api } from "@shared/api/axios";

interface DownloadMultipleByIdsResponse {
  status: string;
  url: string;
}

/**
 * Генерация нескольких заявок на отлов бродячих собак в одном файле по ID заявок
 * @param ids - массив ID заявок
 * @returns Promise с URL для скачивания
 */
const downloadMultipleRequestsByIds = async (
  ids: string[]
): Promise<string> => {
  if (!ids || ids.length === 0) {
    throw new Error("Не выбрано ни одной заявки");
  }

  const response = await api.post<DownloadMultipleByIdsResponse>(
    "/request/download_multiID",
    { ids }
  );

  if (response.data.url) {
    return response.data.url;
  } else {
    throw new Error("URL для скачивания не получен");
  }
};

interface MultiRequestByIdsButtonProps {
  selectedIds: (string | number)[];
  onSuccess?: (url: string, count: number) => void;
  onError?: (error: string) => void;
}

export const MultiRequestByIdsButton: React.FC<
  MultiRequestByIdsButtonProps
> = ({ selectedIds, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (selectedIds.length === 0) {
      onError?.("Не выбрано ни одной заявки");
      return;
    }

    setLoading(true);

    try {
      const selectedIdsString = selectedIds.map((id) => String(id));
      console.log("Отправляемые ID заявок:", selectedIdsString);

      const downloadUrl = await downloadMultipleRequestsByIds(
        selectedIdsString
      );

      window.open(downloadUrl, "_blank");
      console.log(`Успешно сгенерировано ${selectedIds.length} заявок`);

      onSuccess?.(downloadUrl, selectedIds.length);
    } catch (error: any) {
      console.error("Ошибка при генерации заявок:", error);
      onError?.(error.message || "Произошла ошибка при генерации документов");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading || selectedIds.length === 0}
      variant="default"
      size="sm"
    >
      <Download size={16} />
      {loading ? "Скачивание..." : `Скачать (${selectedIds.length})`}
    </Button>
  );
};

// Экспорт функции для использования в других компонентах
export { downloadMultipleRequestsByIds };
