import React from "react";
import { Button } from "@shared/ui/button";
import { FileText } from "lucide-react";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  data?: {
    id: string;
    number: string;
    applicant: string;
    urgency: string;
    date: string;
    status: string;
  } | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  open,
  onClose,
  data,
}) => {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-full max-w-[450px] shadow-lg relative animate-in fade-in zoom-in">
        <button
          className="absolute text-4xl cursor-pointer top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4">Протокол №{data.number}</h2>

        <div className="space-y-2 mb-6 h-[400px] overflow-y-auto">
          {Array(15)
            .fill("Кузнецов Алексей Сергеевич")
            .map((name, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-800">{name}</span>
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            Применить
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};
