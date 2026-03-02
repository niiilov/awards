import React, { useState } from "react";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";

interface AreaListModalProps {
  open: boolean;
  onClose: () => void;
  onMemberAdded?: (name: string) => void;
}

export const AreaListModal: React.FC<AreaListModalProps> = ({
  open,
  onClose,
  onMemberAdded,
}) => {
  const [name, setName] = useState("");

  if (!open) return null;

  const handleAdd = () => {
    if (!name.trim()) return;

    onMemberAdded?.(name);
    setName("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative animate-in fade-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute text-3xl cursor-pointer top-2 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4">Добавление нового МО</h2>

        <div className="space-y-4 mb-6">
          <div className="grid w-full items-center gap-2">
            <Label>название МО</Label>
            <Input
              type="text"
              placeholder="Введите название МО"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="cube" color="grey" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="cube" onClick={handleAdd}>
            Добавить
          </Button>
        </div>
      </div>
    </div>
  );
};
