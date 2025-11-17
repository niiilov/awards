import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { useUploadedFiles } from "@features/upload-awards/hooks/useUploadedFiles";

interface UploadedTableProps {
  onFileSelect?: (filename: string) => void;
}

export const UploadedTable = ({ onFileSelect }: UploadedTableProps) => {
  const { files, loading, error, deleteFile, downloadFile, refetch } = useUploadedFiles();

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
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleDelete = async (filename: string) => {
    if (confirm(`Вы уверены, что хотите удалить файл "${filename}"?`)) {
      const success = await deleteFile(filename);
      if (success) {
        console.log(`Файл "${filename}" успешно удален`);
      }
    }
  };

  const handleDownload = async (filename: string) => {
    const success = await downloadFile(filename);
    if (success) {
      console.log(`Файл "${filename}" успешно скачан`);
    }
  };

  if (loading) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-bold">Загруженные файлы</CardTitle>
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

  if (error) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-bold">Загруженные файлы</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
            <div className="text-red-800 text-sm mb-2">{error}</div>
            <Button 
              onClick={refetch}
              variant="outline" 
              size="sm"
            >
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
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-bold">Загруженные файлы</CardTitle>
          <Button 
            onClick={refetch}
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E]">Имя файла</TableHead>
              <TableHead className="text-center text-[#6C6C6E]">Статус</TableHead>
              <TableHead className="text-center text-[#6C6C6E]">Дата загрузки</TableHead>
              <TableHead className="text-center text-[#6C6C6E]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Нет загруженных файлов
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="text-center font-medium">
                    {file.name}
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
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file.name)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        Скачать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file.name)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {files.length > 0 && (
          <Link
            to="/order-log"
            className="text-center text-gray-500 py-4 cursor-pointer hover:underline block"
          >
            Показать больше...
          </Link>
        )}
      </CardContent>
    </Card>
  );
};