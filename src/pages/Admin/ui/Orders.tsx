import React, { useState } from "react";
import { Button } from "@shared/ui/button";

const users = [
  {
    id: 1,
    name: "Doe John Ivanovich",
    login: "jdoe",
    email: "jdoe@example.com",
    confirmed: true,
  },
  {
    id: 2,
    name: "Синюков Данила Юрьевич",
    login: "pupok",
    email: "rakal@mail.ru",
    confirmed: true,
  },
];

const moList = [
  { id: 1, name: "МО №1" },
  { id: 2, name: "МО №2" },
  { id: 3, name: "МО №3" },
];

export const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedMO, setSelectedMO] = useState("");

  const openModal = (userId: number) => {
    setSelectedUser(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedMO("");
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!selectedMO) {
      alert("Выберите МО");
      return;
    }

    console.log("Назначаем роль:", {
      userId: selectedUser,
      mo: selectedMO,
    });

    closeModal();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Внешние пользователи:</h2>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="text-base font-semibold text-gray-900">
                  {user.name}
                </div>
                <div className="text-sm text-gray-600">Логин: {user.login}</div>
                <div className="text-sm text-gray-600">Email: {user.email}</div>

                {user.confirmed && (
                  <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md mt-1">
                    Подтвержден
                  </span>
                )}
              </div>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4"
              onClick={() => openModal(user.id)}
            >
              Назначить роль
            </Button>
          </div>
        ))}
      </div>

      {/* МОДАЛКА */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4">Назначить МО</h3>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-gray-600">МО</label>

              <select
                value={selectedMO}
                onChange={(e) => setSelectedMO(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-[42px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите МО</option>
                {moList.map((mo) => (
                  <option key={mo.id} value={mo.name}>
                    {mo.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="cube" color="grey" onClick={closeModal}>
                Отмена
              </Button>
              <Button
                variant="cube"
                className="bg-blue-600 text-white"
                onClick={handleSave}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
