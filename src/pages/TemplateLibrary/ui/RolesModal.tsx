import React, { useState, useEffect } from "react";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";
import { useCommissionRoles } from "@features/template-library/hooks/useCommissionRoles";
import { useCommissionMembers } from "@features/template-library/hooks/useCommissionMembers";

interface RolesModalProps {
  open: boolean;
  onClose: () => void;
  data?: any;
  onRoleAdded?: () => void; // Добавляем колбэк
}

export const RolesModal: React.FC<RolesModalProps> = ({
  open,
  onClose,
  data,
  onRoleAdded,
}) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const { addRole, loading } = useCommissionRoles();
  const { members } = useCommissionMembers();

  useEffect(() => {
    if (data) {
      setSelectedRole(data.role || "");
      setSelectedMemberId(data.member_id || "");
    } else {
      setSelectedRole("");
      setSelectedMemberId("");
    }
  }, [data, open]);

  const handleSubmit = async () => {
    if (!selectedRole.trim() || !selectedMemberId) {
      alert("Пожалуйста, выберите роль и члена комиссии");
      return;
    }

    try {
      await addRole({
        role: selectedRole.trim(),
        member_id: selectedMemberId,
      });

      // Вызываем колбэк после успешного добавления
      onRoleAdded?.();
      
      onClose();
      setSelectedRole("");
      setSelectedMemberId("");
    } catch (err) {
      console.error("Ошибка при добавлении роли:", err);
    }
  };

  const selectedMember = members.find(member => member.id === selectedMemberId);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative animate-in fade-in zoom-in">
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {data ? "Редактировать роль" : "Добавить роль"}
        </h2>

        <div className="space-y-4 mb-6 overflow-y-auto">
          <div className="grid w-full items-center gap-3">
            <Label>Роль в комиссии *</Label>
            <Input 
              type="text" 
              placeholder="Введите роль в комиссии" 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label>Выберите члена комиссии *</Label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              disabled={loading}
            >
              <option value="">Выберите члена комиссии</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} - {member.position}
                </option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Информация о выбранном члене комиссии:</h4>
              <p><strong>ФИО:</strong> {selectedMember.full_name}</p>
              <p><strong>Должность:</strong> {selectedMember.position}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={handleSubmit}
            disabled={loading || !selectedRole || !selectedMemberId}
          >
            {loading ? "Сохранение..." : (data ? "Сохранить" : "Добавить")}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={loading}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};