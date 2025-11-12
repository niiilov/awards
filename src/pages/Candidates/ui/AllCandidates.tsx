import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { OrderModal } from "@shared/ui/orders";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";

export const AllCandidates = () => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const candidates = [
    {
      name: "Иванов Иван Иванович",
      position: "Главный специалист",
      experience: "12 лет",
      status: "Прошел",
    },
    {
      name: "Петров Петр Петрович",
      position: "Инженер",
      experience: "7 лет",
      status: "Не прошел",
    },
  ];

  const handleRowClick = (candidate) => {
    setSelectedRow(candidate);
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedRow(null);
  };

  const updateStatus = (newStatus) => {
    if (selectedRow) {
      setSelectedRow({ ...selectedRow, status: newStatus });
    }
  };

  const handleOpenUploadModal = () => {
    console.log("Открыть модалку загрузки файла");
  };

  return (
    <Card className="border-none w-full p-0 shadow-none">
      <CardHeader className="w-full p-0">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-bold">Все кандидаты</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E]">ФИО</TableHead>
              <TableHead className="text-[#6C6C6E]">Должность</TableHead>
              <TableHead className="text-[#6C6C6E]">Стаж</TableHead>
              <TableHead className="text-[#6C6C6E]">Статус</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {candidates.map((candidate, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(candidate)}
                className="cursor-pointer hover:bg-blue-100 transition"
              >
                <TableCell className="text-center">{candidate.name}</TableCell>
                <TableCell className="text-center">
                  {candidate.position}
                </TableCell>
                <TableCell className="text-center">
                  {candidate.experience}
                </TableCell>
                <TableCell
                  className={`text-center ${
                    candidate.status === "Не прошел"
                      ? "text-neutral-400"
                      : "text-green-600"
                  }`}
                >
                  {candidate.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {selectedRow && (
        <OrderModal
          open={orderModalOpen}
          onClose={handleCloseOrderModal}
          data={selectedRow}
          onStatusChange={updateStatus}
          onOpenUploadModal={handleOpenUploadModal}
        />
      )}
    </Card>
  );
};
