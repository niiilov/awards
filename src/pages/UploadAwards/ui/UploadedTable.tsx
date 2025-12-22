import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { Button } from "@shared/ui/button";
import { useUploadedFiles } from "@features/upload-awards/hooks/useUploadedFiles";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { api } from "@shared/api/axios";

interface UploadedTableProps {
  refreshTrigger?: number;
}

export const UploadedTable = ({ refreshTrigger = 0 }: UploadedTableProps) => {
  const { files, loading, error, deleteFile, refetch } = useUploadedFiles();
  const previousRefreshTrigger = useRef(refreshTrigger);
  const lastRefreshTime = useRef<number>(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewFile, setCurrentPreviewFile] = useState<{
    name: string;
    url: string;
    type: string;
    originalType: string;
    originalName: string;
  } | null>(null);
  const [converting, setConverting] = useState(false);

  // Обновляем список файлов при изменении refreshTrigger
  useEffect(() => {
    const now = Date.now();
    // Защита от слишком частых обновлений (минимум 2 секунды)
    if (
      refreshTrigger > previousRefreshTrigger.current &&
      now - lastRefreshTime.current > 2000
    ) {
      console.log("Обновляем список файлов, trigger:", refreshTrigger);
      refetch();
      previousRefreshTrigger.current = refreshTrigger;
      lastRefreshTime.current = now;
    }
  }, [refreshTrigger, refetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Загружен":
        return "text-green-600 bg-green-50 px-2 py-1 rounded text-xs";
      case "Ошибка":
        return "text-red-600 bg-red-50 px-2 py-1 rounded text-xs";
      case "Обработан":
        return "text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs";
      case "В обработке":
        return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs";
      default:
        return "text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? dateString
        : date.toLocaleDateString("ru-RU");
    } catch {
      return dateString;
    }
  };

  const handleDelete = async (filename: string) => {
    if (confirm(`Вы уверены, что хотите удалить файл "${filename}"?`)) {
      const success = await deleteFile(filename);
      if (success) {
        console.log(`Файл "${filename}" успешно удален`);
      }
    }
  };

  const handleRefresh = () => {
    const now = Date.now();
    if (now - lastRefreshTime.current > 2000) {
      refetch();
      lastRefreshTime.current = now;
    }
  };

  const convertToPdf = async (fileName: string): Promise<string | null> => {
    try {
      console.log("Отправляем запрос на конвертацию файла:", fileName);

      // Используем указанный endpoint для конвертации
      const response = await api.get(`/uploaded-pdf`, {
        params: {
          filename: fileName,
        },
        responseType: "blob",
      });

      if (response.status === 200 && response.data) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(blob);
        console.log("Файл успешно сконвертирован в PDF");
        return blobUrl;
      } else {
        throw new Error(`Ошибка конвертации: статус ${response.status}`);
      }
    } catch (err: any) {
      console.error("Ошибка при конвертации в PDF:", err.message || err);

      // Проверяем, есть ли у нас специфическая ошибка от сервера
      if (err.response && err.response.data) {
        try {
          // Пытаемся прочитать ошибку как текст
          const errorText = await err.response.data.text();
          console.error("Текст ошибки сервера:", errorText);
        } catch {
          // Если не получается прочитать как текст, просто логируем
          console.error("Данные ошибки:", err.response.data);
        }
      }

      return null;
    }
  };

  const handlePreview = async (fileName: string) => {
    try {
      // Определяем тип файла
      let fileType = "other";
      let originalType = "other";

      if (fileName.endsWith(".pdf")) {
        fileType = "pdf";
        originalType = "pdf";
      } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        fileType = "docx";
        originalType = "docx";
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        fileType = "excel";
        originalType = "excel";
      } else if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
        fileType = "image";
        originalType = "image";
      }

      // Для DOCX/DOC файлов сначала пробуем конвертировать в PDF
      if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        setConverting(true);

        // Сначала пытаемся получить сконвертированный PDF
        const pdfUrl = await convertToPdf(fileName);

        if (pdfUrl) {
          // Успешно сконвертировали в PDF
          setCurrentPreviewFile({
            name: fileName.replace(/\.(docx|doc)$/i, ".pdf"),
            originalName: fileName, // Сохраняем оригинальное имя
            url: pdfUrl,
            type: "pdf",
            originalType: originalType,
          });
          setPreviewModalOpen(true);
          setConverting(false);
          return;
        } else {
          // Если конвертация не удалась, загружаем оригинальный файл как есть
          console.log("Конвертация не удалась, загружаем оригинальный файл");
        }
      }

      // Для всех остальных типов файлов загружаем оригинал
      const response = await api.get(
        `/uploaded-files/${encodeURIComponent(fileName)}`,
        {
          responseType: "blob",
        },
      );

      if (response.status === 200 && response.data) {
        const blob = new Blob([response.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        setCurrentPreviewFile({
          name: fileName,
          originalName: fileName,
          url: blobUrl,
          type: fileType,
          originalType: originalType,
        });
        setPreviewModalOpen(true);
        setConverting(false);
      } else {
        throw new Error(`Ошибка загрузки файла: статус ${response.status}`);
      }
    } catch (err: any) {
      console.error(
        "Ошибка при получении файла для просмотра",
        err.message || err,
      );
      alert("Не удалось открыть файл: " + (err.message || "Unknown error"));
      setConverting(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const response = await api.get(
        `/uploaded-files/${encodeURIComponent(fileName)}`,
        {
          responseType: "blob",
        },
      );

      if (response.status === 200 && response.data) {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(`Ошибка скачивания: статус ${response.status}`);
      }
    } catch (err: any) {
      console.error("Ошибка при скачивании файла", err.message || err);
      alert("Не удалось скачать файл: " + (err.message || "Unknown error"));
    }
  };

  const closePreviewModal = () => {
    if (currentPreviewFile) {
      // Освобождаем URL объекта
      window.URL.revokeObjectURL(currentPreviewFile.url);
    }
    setPreviewModalOpen(false);
    setCurrentPreviewFile(null);
    setConverting(false);
  };

  // Функция для рендеринга контента в зависимости от типа файла
  const renderFileContent = () => {
    if (!currentPreviewFile) return null;

    switch (currentPreviewFile.type) {
      case "pdf":
        return (
          <iframe
            src={currentPreviewFile.url}
            title={currentPreviewFile.name}
            className="w-full h-full min-h-[500px] border-0"
          />
        );

      case "image":
        return (
          <div className="flex justify-center">
            <img
              src={currentPreviewFile.url}
              alt={currentPreviewFile.name}
              className="max-w-full max-h-[calc(100vh-200px)] object-contain"
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-gray-500 mb-4">
              Предпросмотр для этого типа файла не поддерживается
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {currentPreviewFile.name}
            </p>
            <Button
              variant="default"
              onClick={() => handleDownload(currentPreviewFile.name)}
            >
              Скачать файл для просмотра
            </Button>
          </div>
        );
    }
  };

  if (loading && files.length === 0) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full mb-4">
            <CardTitle className="text-xl font-bold">
              Загруженные файлы
            </CardTitle>
            <Button
              variant="default"
              onClick={handleRefresh}
              disabled={loading}
            >
              Обновить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-center items-center py-8">
            Загрузка списка файлов...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && files.length === 0) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full mb-4">
            <CardTitle className="text-xl font-bold">
              Загруженные файлы
            </CardTitle>
            <Button
              variant="default"
              onClick={handleRefresh}
              disabled={loading}
            >
              Обновить
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
            <div className="text-red-800 text-sm mb-2">{error}</div>
            <Button onClick={refetch} variant="outline" size="sm">
              Попробовать снова
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full mb-4">
            <CardTitle className="text-xl font-bold">
              Загруженные файлы
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? "Обновление..." : "Обновить"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#CADDFF]">
                <TableHead className="text-center text-[#6C6C6E]">
                  Имя файла
                </TableHead>
                <TableHead className="text-center text-[#6C6C6E]">
                  Статус
                </TableHead>
                <TableHead className="text-center text-[#6C6C6E]">
                  Дата загрузки
                </TableHead>
                <TableHead className="text-center text-[#6C6C6E]">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    Нет загруженных файлов
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file) => (
                  <TableRow key={`${file.id}-${file.server_name}`}>
                    <TableCell className="text-center font-medium">
                      {file.display_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={getStatusColor(file.status)}>
                        {file.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(file.uploaded_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size={"sm"}>Действия</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-46" align="start">
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <button
                                  onClick={() =>
                                    handleDelete(file.display_name)
                                  }
                                  disabled={loading}
                                >
                                  Удалить
                                </button>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <button
                                  onClick={() =>
                                    handlePreview(file.server_name)
                                  }
                                  disabled={converting || loading}
                                >
                                  {converting ? "Конвертация..." : "Просмотр"}
                                </button>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <button
                                  onClick={() =>
                                    handleDownload(file.server_name)
                                  }
                                  disabled={loading}
                                >
                                  Скачать документ
                                </button>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {loading && files.length > 0 && (
            <div className="flex justify-center items-center py-4">
              Обновление списка файлов...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Модальное окно для просмотра документа */}
      {previewModalOpen && currentPreviewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                  {currentPreviewFile.originalName}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => {
                    if (currentPreviewFile.originalType === "docx") {
                      // Скачиваем оригинальный DOCX файл
                      handleDownload(currentPreviewFile.originalName);
                    } else {
                      handleDownload(currentPreviewFile.name);
                    }
                  }}
                >
                  Скачать документ
                </Button>
                <Button variant="default" onClick={closePreviewModal}>
                  Закрыть
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {renderFileContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
