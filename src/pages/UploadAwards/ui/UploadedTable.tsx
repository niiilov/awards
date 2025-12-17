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
import { useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
interface UploadedTableProps {
  refreshTrigger?: number;
}

import { API_BASE_URL } from "@shared/config";

export const UploadedTable = ({ refreshTrigger = 0 }: UploadedTableProps) => {
  const { files, loading, error, deleteFile, refetch } = useUploadedFiles();
  const previousRefreshTrigger = useRef(refreshTrigger);
  const lastRefreshTime = useRef<number>(0);

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

  const handlePreview = async (fileName: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена авторизации");

      const url = `${API_BASE_URL}/uploaded-files/${encodeURIComponent(
        fileName
      )}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);

      const blob = await response.blob();

      // Для PDF открываем в новом окне
      if (fileName.endsWith(".pdf")) {
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, "_blank");
      } else {
        // Для всех остальных (.docx, .xlsx и т.д.) предлагаем скачать
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err: any) {
      console.error(
        "Ошибка при получении файла для просмотра",
        err.message || err
      );
      alert("Не удалось открыть файл: " + (err.message || "Unknown error"));
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Нет токена авторизации");

      const url = `${API_BASE_URL}/uploaded-files/${encodeURIComponent(
        fileName
      )}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Ошибка при скачивании файла", err.message || err);
      alert("Не удалось скачать файл: " + (err.message || "Unknown error"));
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
              variant="outline"
              size="sm"
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
              variant="outline"
              size="sm"
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
    <Card className="border-none w-full p-0 shadow-none">
      <CardHeader className="w-full p-0">
        <div className="flex items-center justify-between w-full mb-4">
          <CardTitle className="text-xl font-bold">Загруженные файлы</CardTitle>
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
                                onClick={() => handleDelete(file.display_name)}
                                disabled={loading}
                              >
                                Удалить
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <button
                                onClick={() => handlePreview(file.server_name)}
                              >
                                Просмотр
                              </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <button
                                onClick={() => handleDownload(file.server_name)}
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
  );
};
