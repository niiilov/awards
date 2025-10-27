// shared/ui/orders/ui/utils.ts

import type { TableRowData } from "./types";

export const extractNumberFromString = (str: string): number => {
  if (!str) return 0;
  const numbers = str.replace(/[^\d]/g, "");
  return numbers ? parseInt(numbers, 10) : 0;
};

export const transformFilteredData = (filteredRequests: any): TableRowData[] => {
  console.log("Данные от фильтра: ", filteredRequests);
  
  let requestsArray: any[] = [];
  
  if (filteredRequests && Array.isArray(filteredRequests)) {
    requestsArray = filteredRequests;
  } else if (filteredRequests && filteredRequests.data && Array.isArray(filteredRequests.data)) {
    requestsArray = filteredRequests.data;
  } else {
    console.warn("Неизвестный формат данных:", filteredRequests);
    requestsArray = [];
  }
  
  console.log("Обработанный массив:", requestsArray);
  
  if (requestsArray.length === 0) {
    return [];
  }

  return requestsArray.map((request, index) => ({
    id: request.id,
    number: request.number || `${index + 1}`,
    applicant: request.applicant?.name || "Не указан",
    urgency: request.urgency || "Не указана",
    date: request.created_at
      ? new Date(request.created_at).toLocaleDateString("ru-RU")
      : "Не указана",
    address: request.address || "Не указан",
    dogsCount: request.dogs_count || 0,
    behavior: request.behavior || "Не указано",
    applicantName: request.applicant?.name || "Не указано",
    contactPerson: request.contact_person || "Не указано",
    status: request.status || "Не указан",
    source: request.source || { id: "", name: "" },
  }));
};