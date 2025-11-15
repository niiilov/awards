import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { RolesModal } from "./RolesModal";

export const Roles = () => {
  // --- Модалка ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const handleOpenModal = (data: any = null) => {
    setSelectedProtocol(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProtocol(null);
  };

  return (
    <Card className="border-none w-full p-0 shadow-none">
      <CardHeader className="w-full p-0">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-bold">Роли</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition">
                <div className="flex items-center justify-center gap-1">
                  Роли
                </div>
              </TableHead>
              <TableHead className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition">
                <div className="flex items-center gap-1">ФИО</div>
              </TableHead>
              <TableHead className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition">
                <div className="flex items-center gap-1">Должность</div>
              </TableHead>
              <TableHead className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition">
                <div className="flex items-center gap-1">Действия</div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow>
              <TableCell className="text-center">
                Председатель комиссии
              </TableCell>
              <TableCell className="text-center">
                Иванов Иван Иванович
              </TableCell>
              <TableCell>Заместитель главы администрации района</TableCell>
              <TableCell className="text-red-500 cursor-pointer">
                Удалить
              </TableCell>
            </TableRow>

            {/* Дубли можно позже заменить на рендер массива */}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-2 mt-4">
          <Button
            className="w-full"
            variant="ghost"
            onClick={() => handleOpenModal()}
          >
            Добавить
          </Button>

          <Button variant="ghost" className="w-full bg-neutral-300 text-black">
            Раскрыть список
          </Button>
        </div>
      </CardContent>

      {/* --- Модалка --- */}
      <RolesModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedProtocol}
      />
    </Card>
  );
};
