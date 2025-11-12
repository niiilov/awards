// shared/ui/orders/ui/types.ts

export interface TableRowData {
  id: number | string;
  number: string;
  applicant: string;
  urgency: string;
  date: string;
  address?: string;
  dogsCount?: number;
  quantity?: number;
  behavior?: string;
  applicantName?: string;
  applicantInfo?: string;
  contactPerson?: string;
  status?: string;
  source?: {
    id: string;
    name: string;
  };
  sortableNumber?: number;
  created_at?: string;
  dogs_count?: number;
}

export interface ApplicationsTableProps {
  title: string;
  data: TableRowData[];
  showMoreButton?: boolean;
  maxVisibleRows?: number;
}

export interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  data?: TableRowData;
  onStatusChange?: (id: string | number, newStatus: string) => void;
  onOpenUploadModal?: (requestData: TableRowData) => void;
}

export interface UploadDocumentModalProps {
  open: boolean;
  onClose: () => void;
  requestData?: TableRowData;
  onUploadSuccess?: () => void;
}

export type SortField = "sortableNumber" | "applicant" | "urgency" | "date";
export type SortDirection = "asc" | "desc";

export interface ChangeStatusRequest {
  id: string;
  status: string;
}

export interface UploadActRequest {
  number: string;
  id: string;
  status: string;
  file: File;
}

export interface UploadResponse {
  message: string;
  status: string;
}
