// features/commission/hooks/useCommissionMembers.ts
import { useState, useEffect, useCallback } from "react";

export interface CommissionMember {
  id: string;
  full_name: string;
  position: string;
  created_at: string;
}

interface CommissionMembersResponse {
  members: CommissionMember[];
}

interface AddMemberRequest {
  full_name: string;
  position: string;
}

export const useCommissionMembers = () => {
  const [members, setMembers] = useState<CommissionMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { api } = await import("@shared/api/axios");
      const response = await api.get<CommissionMembersResponse>("/commission-members");
      
      console.log('=== Ответ от API /commission-members ===', response.data);
      
      let membersData: CommissionMember[] = [];
      
      if (response.data && Array.isArray(response.data.members)) {
        membersData = response.data.members;
      } else if (Array.isArray(response.data)) {
        // На случай если API вернет массив напрямую
        membersData = response.data;
      } else {
        console.error('Неверный формат ответа от API:', response.data);
        membersData = [];
      }
      
      console.log('Извлеченные члены комиссии:', membersData);
      setMembers(membersData);
      
    } catch (err: any) {
      console.error("Ошибка загрузки членов комиссии:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось загрузить список членов комиссии. Пожалуйста, попробуйте позже."
      );
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMember = async (memberId: string) => {
    try {
      const { api } = await import("@shared/api/axios");
      await api.delete(`/commission-members/${memberId}`);
      
      // Обновляем локальное состояние
      setMembers(prev => prev.filter(member => member.id !== memberId));
      return true;
    } catch (err: any) {
      console.error("Ошибка при удалении члена комиссии:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось удалить члена комиссии. Пожалуйста, попробуйте позже."
      );
      return false;
    }
  };

  const addMember = async (memberData: AddMemberRequest) => {
    try {
      const { api } = await import("@shared/api/axios");
      
      const requestData: AddMemberRequest = {
        full_name: memberData.full_name,
        position: memberData.position,
      };
      
      console.log('Отправка данных для создания члена комиссии:', requestData);
      
      const response = await api.post<CommissionMember>("/commission-members", requestData);
      
      console.log('Ответ от сервера при добавлении члена комиссии:', response);
      
      // Добавляем нового члена комиссии в локальное состояние
      setMembers(prev => [...prev, response.data]);
      
      return response.data;
    } catch (err: any) {
      console.error("Ошибка при добавлении члена комиссии:", err);
      console.error("Детали ошибки:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          "Не удалось добавить члена комиссии. Пожалуйста, попробуйте позже.";
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, refreshTrigger]);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    deleteMember,
    addMember,
    refresh,
  };
};