import React, { useState, useEffect } from "react";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";
import { useCommissionMembers } from "@features/template-library/hooks/useCommissionMembers";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  data?: any;
  onMemberAdded?: () => void;
}

export const ComMembersModal: React.FC<OrderModalProps> = ({
  open,
  onClose,
  data,
  onMemberAdded,
}) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [position, setPosition] = useState("");
  const { addMember, loading, error } = useCommissionMembers();

  useEffect(() => {
    if (data) {
      // Если переданы данные для редактирования
      // Разбиваем ФИО на части если нужно
      const nameParts = data.full_name?.split(' ') || [];
      setLastName(nameParts[0] || "");
      setFirstName(nameParts[1] || "");
      setMiddleName(nameParts[2] || "");
      setPosition(data.position || "");
    } else {
      // Сброс полей при открытии модалки для добавления
      setLastName("");
      setFirstName("");
      setMiddleName("");
      setPosition("");
    }
  }, [data, open]);

  const handleSubmit = async () => {
    // Формируем полное ФИО
    const fullName = `${lastName} ${firstName} ${middleName}`.trim();
    
    if (!lastName.trim() || !firstName.trim() || !position.trim()) {
      alert("Пожалуйста, заполните обязательные поля: Фамилия, Имя и Должность");
      return;
    }

    try {
      console.log("Отправка данных члена комиссии:", {
        full_name: fullName,
        position: position.trim()
      });

      // Отправляем только full_name и position согласно API
      await addMember({
        full_name: fullName,
        position: position.trim()
      });

      console.log("Член комиссии успешно добавлен");

      // Вызываем колбэк для обновления списка
      onMemberAdded?.();
      
      // Закрываем модалку
      onClose();
    } catch (err) {
      console.error("Ошибка при добавлении члена комиссии:", err);
      // Ошибка уже обработана в хуке, можно показать alert
      alert("Не удалось добавить члена комиссии. Пожалуйста, попробуйте позже.");
    }
  };

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
          {data ? "Редактировать члена комиссии" : "Добавить члена комиссии"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        <div className="space-y-2 mb-6 overflow-y-auto">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Фамилия *</Label>
            <Input 
              type="text" 
              placeholder="Введите фамилию" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Имя *</Label>
            <Input 
              type="text" 
              placeholder="Введите имя" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Отчество</Label>
            <Input 
              type="text" 
              placeholder="Введите отчество" 
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Должность *</Label>
            <Input 
              type="text" 
              placeholder="Введите должность" 
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={handleSubmit}
            disabled={loading || !lastName || !firstName || !position}
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