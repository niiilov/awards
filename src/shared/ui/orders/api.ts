// shared/ui/orders/ui/api.ts

import { api } from "@shared/api/axios";
import type {
  ChangeStatusRequest,
  UploadActRequest,
  UploadResponse,
} from "./types";

export const changeRequestStatus = async (
  request: ChangeStatusRequest
): Promise<void> => {
  const response = await api.post("/requests/change-status", request);
  return response.data;
};

// Функция для получения акта НА отлов (документ для работы)
export const getCatchActDocument = async (
  requestNumber: string,
  requestYear: string
): Promise<string> => {
  const response = await api.get("/requests/download_request", {
    params: {
      number: requestNumber,
      year: requestYear,
    },
    validateStatus: (status) => status < 500,
  });

  if (response.status === 200 && response.data.url) {
    return response.data.url;
  } else if (response.status === 404) {
    throw new Error("Документ не найден");
  } else {
    throw new Error(`Сервер вернул статус: ${response.status}`);
  }
};

// Функция для получения готового акта отлова (выполненная работа)
export const getCompletedActDocument = async (
  requestNumber: string,
  requestYear: string
): Promise<string> => {
  const response = await api.get("/requests/download_act", {
    params: {
      number: requestNumber,
      year: requestYear,
    },
    validateStatus: (status) => status < 500,
  });

  if (response.status === 200 && response.data.url) {
    return response.data.url;
  } else if (response.status === 404) {
    throw new Error("Документ не найден");
  } else {
    throw new Error(`Сервер вернул статус: ${response.status}`);
  }
};

export const uploadAct = async (
  request: UploadActRequest
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("number", request.number);
  formData.append("id", request.id);
  formData.append("status", request.status);
  formData.append("file", request.file);

  const response = await api.post("/requests/upload-act", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const completeRequest = async (requestId: string): Promise<void> => {
  try {
    console.log("Изменение статуса заявки на 'Выполнена':", requestId);

    const response = await changeRequestStatus({
      id: requestId,
      status: "Выполнена",
    });

    console.log("Статус успешно изменен:", response);
  } catch (error: any) {
    console.error("Ошибка при изменении статуса:", error);
    throw new Error("Не удалось изменить статус заявки на 'Выполнена'");
  }
};
