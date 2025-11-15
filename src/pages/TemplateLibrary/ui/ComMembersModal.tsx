import React from "react";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  data?: any; // можно оставить, если нужно позже
}

export const ComMembersModal: React.FC<OrderModalProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null; // <-- главная фиксация

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative animate-in fade-in zoom-in">
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">Добавить члена комиссии</h2>

        <div className="space-y-2 mb-6 overflow-y-auto">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Фамилия</Label>
            <Input type="text" placeholder="Введите фамилию" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Имя</Label>
            <Input type="text" placeholder="Введите имя" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Отчество</Label>
            <Input type="text" placeholder="Введите отчество" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Должность</Label>
            <Input type="text" placeholder="Введите должность" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline">Добавить</Button>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};
