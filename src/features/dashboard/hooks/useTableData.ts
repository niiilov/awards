import type { Request } from "@features/request/hooks/useRequestsLog";

export interface TableRowData {
  id: string;
  number: string;
  applicant: string;
  urgency: string;
  date: string;
  address?: string;
  dogsCount?: number;
  behavior?: string;
  contactPerson?: string;
  status?: string;
  source?: {
    id: string;
    name: string;
  };
}

export const useTableData = (requests: Request[]) => {
  const tableData = requests.slice(0, 5).map((request) => ({
    id: request.id,
    number: request.number,
    applicant: request.applicant?.name || "Не указан",
    urgency: request.urgency || "Не указана",
    date: request.created_at
      ? new Date(request.created_at).toLocaleDateString("ru-RU")
      : "Не указана",
    address: request.address || "Не указан",
    dogsCount: request.dogs_count || 0,
    behavior: request.behavior || "Не указано",
    contactPerson: request.contact_person || "Не указано",
    status: request.status || "Не указан",
    source: request.source || { id: "", name: "" },
  }));

  return tableData;
};