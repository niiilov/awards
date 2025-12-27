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
import { API_BASE_URL } from "@shared/config";

interface UploadedTableProps {
  refreshTrigger?: number;
}

export const UploadedTable = ({ refreshTrigger = 0 }: UploadedTableProps) => {
  const { files, loading, error, deleteFile, refetch } = useUploadedFiles();

  const previousRefreshTrigger = useRef(refreshTrigger);
  const lastRefreshTime = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();

    if (
      refreshTrigger > previousRefreshTrigger.current &&
      now - lastRefreshTime.current > 2000
    ) {
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
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("ru-RU");
  };

  const handleDelete = async (filename: string) => {
    if (confirm(`Вы уверены, что хотите удалить файл "${filename}"?`)) {
      await deleteFile(filename);
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
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("Нет токена авторизации");

    try {
      const response = await fetch(
        `${API_BASE_URL}/uploaded-files/${encodeURIComponent(fileName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (fileName.endsWith(".pdf")) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
      }
    } catch (e) {
      alert("Не удалось открыть файл");
    }
  };

  const handleDownload = async (fileName: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("Нет токена авторизации");

    try {
      const response = await fetch(
        `${API_BASE_URL}/uploaded-files/${encodeURIComponent(fileName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
    } catch (e) {
      alert("Не удалось скачать файл");
    }
  };

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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm">Действия</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => handleDelete(file.display_name)}
                          >
                            Удалить
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePreview(file.server_name)}
                          >
                            Просмотр
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownload(file.server_name)}
                          >
                            Скачать документ
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {loading && files.length > 0 && (
          <div className="flex justify-center py-4 text-sm text-gray-500">
            Обновление списка файлов...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
