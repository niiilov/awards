// features/commission/hooks/useCommissionRoles.ts
import { useState, useEffect } from "react";

export interface CommissionRole {
  id: string;
  member_id: string;
  full_name: string;
  position: string;
  role: string;
  created_at: string;
}

interface CommissionRolesResponse {
  roles: CommissionRole[];
}

interface AddRoleRequest {
  role: string;
  member_id: string;
  created_at?: string;
  id?: string;
}

export const useCommissionRoles = () => {
  const [roles, setRoles] = useState<CommissionRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { api } = await import("@shared/api/axios");
      const response = await api.get<CommissionRolesResponse>("/commission-roles");
      
      console.log('=== Ответ от API /commission-roles ===', response.data);
      
      let rolesData: CommissionRole[] = [];
      
      if (response.data && Array.isArray(response.data.roles)) {
        rolesData = response.data.roles;
      } else if (Array.isArray(response.data)) {
        // На случай если API вернет массив напрямую
        rolesData = response.data;
      } else {
        console.error('Неверный формат ответа от API:', response.data);
        rolesData = [];
      }
      
      console.log('Извлеченные роли комиссии:', rolesData);
      setRoles(rolesData);
      
    } catch (err: any) {
      console.error("Ошибка загрузки ролей комиссии:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось загрузить список ролей комиссии. Пожалуйста, попробуйте позже."
      );
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      const { api } = await import("@shared/api/axios");
      await api.delete(`/commission-roles/${roleId}`);
      
      // Обновляем локальное состояние
      setRoles(prev => prev.filter(role => role.id !== roleId));
      return true;
    } catch (err: any) {
      console.error("Ошибка при удалении роли комиссии:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось удалить роль комиссии. Пожалуйста, попробуйте позже."
      );
      return false;
    }
  };

  const addRole = async (roleData: AddRoleRequest) => {
    try {
      const { api } = await import("@shared/api/axios");
      
      // Отправляем только необходимые поля согласно API
      const requestData: AddRoleRequest = {
        role: roleData.role,
        member_id: roleData.member_id,
      };
      
      console.log('Отправка данных для создания роли:', requestData);
      
      const response = await api.post<CommissionRole>("/commission-roles", requestData);
      
      // Добавляем новую роль в локальное состояние
      setRoles(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      console.error("Ошибка при добавлении роли комиссии:", err);
      setError(
        err.response?.data?.message || 
        "Не удалось добавить роль комиссии. Пожалуйста, попробуйте позже."
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
    deleteRole,
    addRole,
  };
};