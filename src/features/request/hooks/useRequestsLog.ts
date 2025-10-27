// shared/api/requests.ts
import { api } from '@shared/api/axios';

export interface Applicant {
  id: string;
  name: string;
}

export interface Source {
  id: string;
  name: string;
}

export interface Request {
  id: string;
  number: string;
  address: string;
  behavior: string;
  contact_person: string;
  created_at: string;
  dogs_count: number;
  status: string;
  urgency: string;
  applicant: Applicant;
  source: Source;
}

export interface ApiError {
  message: string;
  status: string;
}

// Опционально: функция для получения заявки по ID
export const getRequestById = async (id: string): Promise<Request> => {
  const response = await api.get<Request>(`/requests/${id}`);
  return response.data;
};

// features/request/hooks/useRequestsLog.ts
export const getRequests = async (): Promise<Request[]> => {
  try {
    const response = await api.get<any>('/requests');
    console.log('Полный ответ от API:', response.data);
    
    // Бэкенд возвращает { status: "ok", data: [...] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      // На случай если бэкенд изменится и будет возвращать просто массив
      return response.data;
    } else {
      console.warn('Неожиданная структура ответа:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Ошибка в getRequests:', error);
    throw error;
  }
};

export const debugGetRequests = async () => {
  try {
    const response = await api.get('/requests');
    console.log('=== DEBUG API RESPONSE ===');
    console.log('Полный ответ:', response);
    console.log('response.data:', response.data);
    console.log('response.data.data:', response.data?.data);
    console.log('Тип response.data.data:', typeof response.data?.data);
    console.log('Array.isArray:', Array.isArray(response.data?.data));
    
    return response.data;
  } catch (error) {
    console.error('DEBUG Error:', error);
    throw error;
  }
};