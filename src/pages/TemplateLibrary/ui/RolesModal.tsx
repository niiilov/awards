import { useState, useEffect } from "react";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";
import { useCommissionRoles } from "@features/template-library/hooks/useCommissionRoles";

interface RolesModalProps {
  open: boolean;
  onClose: () => void;
  data?: { role: string; member_id: string } | null;
  onRoleAdded?: () => void;
  members: Array<{ id: string; full_name: string; position: string }>;
}

export const RolesModal = ({
  open,
  onClose,
  data,
  onRoleAdded,
  members,
}: RolesModalProps) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const { addRole, loading } = useCommissionRoles();

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

    await addRole({
      role: selectedRole.trim(),
      member_id: selectedMemberId,
    });

    onRoleAdded?.();
    onClose();
  };

  if (!open) return null;

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative">
        <button className="absolute text-4xl top-2 right-2" onClick={onClose}>
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          {data ? "Редактировать роль" : "Добавить роль"}
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <Label>Роль *</Label>
            <Input
              type="text"
              placeholder="Введите роль"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label>Член комиссии *</Label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              disabled={loading}
            >
              <option value="">Выберите</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} — {member.position}
                </option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p>
                <strong>ФИО:</strong> {selectedMember.full_name}
              </p>
              <p>
                <strong>Должность:</strong> {selectedMember.position}
              </p>
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </div>
  );
};
