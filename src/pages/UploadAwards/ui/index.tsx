import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Sidebar } from "@shared/ui/sidebar";
import { useState, useRef } from "react";

interface UploadedFile {
  id: string;
  name: string;
  status: "Загружен" | "Ошибка" | "Загрузка";
  size?: string;
  date?: string;
}

export const UploadAwards = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "1", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "2", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "3", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "4", name: "nagradnoy_list.docx", status: "Загружен" },
    { id: "5", name: "nagradnoy_list.docx", status: "Загружен" },
  ]);
  
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach((file, index) => {
      // Проверяем формат файла
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isValidFormat = fileExtension === 'pdf' || fileExtension === 'docx';
      
      newFiles.push({
        id: Date.now() + index.toString(),
        name: file.name,
        status: isValidFormat ? "Загружен" : "Ошибка",
        size: formatFileSize(file.size),
        date: new Date().toLocaleDateString('ru-RU')
      });
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleShowMore = () => {
    // Логика для загрузки дополнительных файлов
    console.log("Загружаем больше файлов...");
  };

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        {/* Заголовок */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Загрузка файлов</h2>
        </div>

        {/* Основная карточка загрузки */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Описание */}
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">
                  Загрузка поддерживает документы только форматом PDF/DOCX
                </h3>
                <p className="text-gray-600">
                  Переместите файлы или выберите их в "Обзоре"
                </p>
                <p className="text-sm text-gray-500">
                  Формат: pdf, docx
                </p>
              </div>

              {/* Область перетаскивания */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Перетащите файлы сюда
                  </p>
                  <p className="text-gray-400 text-sm">
                    или
                  </p>
                  <Button 
                    onClick={handleBrowseClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Обзор
                  </Button>
                </div>
              </div>

              {/* Скрытый input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx"
                onChange={handleChange}
                className="hidden"
              />

              {/* Разделитель */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Загруженные файлы</h3>

                {/* Таблица файлов */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Имя файла
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Статус
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFiles.map((file) => (
                        <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600">📄</span>
                              <span className="font-medium">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              file.status === "Загружен" 
                                ? "bg-green-100 text-green-800"
                                : file.status === "Ошибка"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {file.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              color="outline"
                              size="sm"
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              Удалить
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Кнопка "Показать больше" */}
                {uploadedFiles.length > 0 && (
                  <div className="text-center mt-4">
                    <Button
                      color="outline"
                      onClick={handleShowMore}
                      className="text-blue-600 hover:text-blue-700 border-blue-200"
                    >
                      Показать больше...
                    </Button>
                  </div>
                )}

                {/* Сообщение если файлов нет */}
                {uploadedFiles.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Нет загруженных файлов
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};