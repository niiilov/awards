// useUploadedFiles.tsx
import { useState, useEffect, useCallback } from "react";

export interface UploadedFileInfo {
  id: string;
  server_name: string; // Имя файла на сервере (с .docx)
  display_name: string; // Имя для отображения (оригинальное с .doc)
  original_name?: string; // Оригинальное имя (для обратной совместимости)
  status: "Загружен" | "Ошибка" | "Обработан" | "В обработке";
  size?: string;
  uploaded_at: string;
  download_url?: string;
}

export const useUploadedFiles = () => {
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchUploadedFiles = useCallback(async (isRefetch = false) => {
    if (isRefetch) {
      setIsRefetching(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const { api } = await import("@shared/api/axios");
      const response = await api.get("/uploaded-files");

      console.log('Получены файлы с сервера:', response.data);

      if (response.data && typeof response.data === "object") {
        const filesData = transformApiData(response.data);
        console.log('Преобразованные файлы:', filesData);
        setFiles(filesData);
      } else {
        setFiles([]);
      }
    } catch (err: any) {
      console.error("Ошибка загрузки списка файлов:", err);
      setError("Не удалось загрузить список файлов");
      setFiles([]);
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  }, []);

  const deleteFile = async (displayName: string) => {
    try {
      // Находим серверное имя файла по отображаемому имени
      const file = files.find(f => f.display_name === displayName);
      if (!file) {
        console.error('Файл не найден:', displayName);
        return false;
      }
      
      const { api } = await import("@shared/api/axios");
      // Удаляем по серверному имени
      await api.delete(`/uploaded-files/${encodeURIComponent(file.server_name)}`);
      
      // Удаляем файл из состояния
      setFiles((prev) => prev.filter((f) => f.display_name !== displayName));
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
    fetchUploadedFiles(false);
  }, [fetchUploadedFiles]);

  return { 
    files, 
    loading: loading || isRefetching, 
    error, 
    refetch: () => fetchUploadedFiles(true), 
    deleteFile 
  };
};

const transformApiData = (apiData: any): UploadedFileInfo[] => {
  const files: UploadedFileInfo[] = [];
  const seenDisplayNames = new Set<string>();
  
  // Проверяем, есть ли поле "files" в объекте
  let dataToProcess = apiData;
  
  if (apiData && typeof apiData === 'object' && 'files' in apiData && Array.isArray(apiData.files)) {
    console.log('Обнаружено поле "files" в ответе');
    dataToProcess = apiData.files;
  }
  
  // Если это массив
  if (Array.isArray(dataToProcess)) {
    console.log('Обрабатываем массив файлов:', dataToProcess);
    dataToProcess.forEach((item: any, index: number) => {
      let serverFileName = '';
      let displayFileName = '';
      let fileId = '';
      let fileStatus = "Загружен";
      let uploadedAt = new Date().toISOString();
      
      if (typeof item === 'string') {
        // Если это просто строка, используем её как серверное имя
        serverFileName = item;
        displayFileName = item;
        fileId = `${index}_${item}`;
      } else if (item && typeof item === 'object') {
        // Серверное имя (с .docx после конвертации)
        serverFileName = item.name || item.filename || item.server_name || `file_${index}`;
        
        // Имя для отображения - оригинальное или сконвертированное
        displayFileName = item.original_name || item.display_name || item.original_filename || serverFileName;
        
        // Если серверное имя .docx, а для отображения .doc - оставляем как есть
        // Если оба .docx - проверяем, не было ли исходного .doc
        if (serverFileName.toLowerCase().endsWith('.docx') && 
            displayFileName.toLowerCase().endsWith('.docx') &&
            item.original_name) {
          displayFileName = item.original_name;
        }
        
        fileId = item.id || item.file_id || `${index}_${serverFileName}`;
        fileStatus = item.status || item.state || "Загружен";
        uploadedAt = item.uploaded_at || item.created_at || item.upload_date || new Date().toISOString();
      }
      
      // Проверяем дубликаты по отображаемому имени
      if (displayFileName && !seenDisplayNames.has(displayFileName)) {
        seenDisplayNames.add(displayFileName);
        files.push({
          id: fileId,
          server_name: serverFileName,
          display_name: displayFileName,
          original_name: item?.original_name,
          status: fileStatus as any,
          uploaded_at: uploadedAt,
          size: item?.size,
          download_url: item?.download_url || item?.url,
        });
        console.log('Добавлен файл:', {
          display: displayFileName,
          server: serverFileName,
          original: item?.original_name
        });
      } else if (displayFileName) {
        console.log('Пропускаем дубликат файла (по display_name):', displayFileName);
      }
    });
  } 
  // Если это объект с ключами (старый формат)
  else if (typeof dataToProcess === 'object' && dataToProcess !== null) {
    console.log('Обрабатываем объект с ключами:', dataToProcess);
    Object.keys(dataToProcess).forEach((key) => {
      const fileArray = dataToProcess[key];
      if (Array.isArray(fileArray)) {
        fileArray.forEach((fileData: any, fileIndex: number) => {
          let serverFileName = '';
          let displayFileName = '';
          let fileId = '';
          let fileStatus = "Загружен";
          let uploadedAt = new Date().toISOString();
          
          if (typeof fileData === 'string') {
            serverFileName = fileData;
            displayFileName = fileData;
            fileId = `${key}_${fileIndex}_${fileData}`;
          } else if (fileData && typeof fileData === 'object') {
            serverFileName = fileData.name || fileData.filename || fileData.server_name || `file_${fileIndex}`;
            displayFileName = fileData.original_name || fileData.display_name || fileData.original_filename || serverFileName;
            
            if (serverFileName.toLowerCase().endsWith('.docx') && 
                displayFileName.toLowerCase().endsWith('.docx') &&
                fileData.original_name) {
              displayFileName = fileData.original_name;
            }
            
            fileId = fileData.id || fileData.file_id || `${key}_${fileIndex}_${serverFileName}`;
            fileStatus = fileData.status || fileData.state || "Загружен";
            uploadedAt = fileData.uploaded_at || fileData.created_at || fileData.upload_date || new Date().toISOString();
          }
          
          // Проверяем дубликаты по отображаемому имени
          if (displayFileName && !seenDisplayNames.has(displayFileName)) {
            seenDisplayNames.add(displayFileName);
            files.push({
              id: fileId,
              server_name: serverFileName,
              display_name: displayFileName,
              original_name: fileData?.original_name,
              status: fileStatus as any,
              uploaded_at: uploadedAt,
              size: fileData?.size,
              download_url: fileData?.download_url || fileData?.url,
            });
          } else if (displayFileName) {
            console.log('Пропускаем дубликат файла (по display_name):', displayFileName);
          }
        });
      }
    });
  }
  
  console.log('Итоговый список файлов (уникальные):', files.map(f => ({
    display: f.display_name,
    server: f.server_name,
    original: f.original_name
  })));
  return files;
};