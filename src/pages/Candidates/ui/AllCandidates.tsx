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
import { useCandidates } from "@features/candidates/hooks/useCandidates";
import type { Candidate } from "@features/candidates/api/types";

export const AllCandidates = () => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { candidates, loading, error, updateCandidateStatus } = useCandidates();

  // Гарантируем, что candidatesToRender всегда массив
  const candidatesToRender = Array.isArray(candidates) ? candidates : [];

  console.log('candidates в компоненте:', candidates);
  console.log('candidatesToRender:', candidatesToRender);
  console.log('Is Array?', Array.isArray(candidates));

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleStatusChange = (id: string | number, newStatus: string) => {
    if (selectedCandidate) {
      updateCandidateStatus(id.toString(), newStatus);
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }
  };

  const handleOpenUploadModal = () => {
    console.log("Открыть модалку загрузки файла");
  };

  // Функция для преобразования Candidate в TableRowData
  const convertCandidateToTableRowData = (candidate: Candidate) => {
    return {
      number: candidate.id,
      applicant: candidate.full_name,
      urgency: "Стандартная",
      date: candidate.created_at || new Date().toISOString(),
      ...candidate
    };
  };

  // Функция для форматирования стажа
  const formatExperience = (years: number) => {
    if (!years && years !== 0) return "Не указан";
    if (years === 0) return "Менее года";
    if (years === 1) return "1 год";
    if (years >= 2 && years <= 4) return `${years} года`;
    return `${years} лет`;
  };

  // Функция для определения цвета статуса
  const getStatusColor = (status: string) => {
    if (!status) return "text-gray-600";
    
    switch (status.toLowerCase()) {
      case "approved":
      case "одобрено":
      case "прошел":
        return "text-green-600";
      case "rejected":
      case "отклонено":
      case "не прошел":
        return "text-red-600";
      case "pending":
      case "рассмотрение":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  // Функция для перевода статуса
  const translateStatus = (status: string) => {
    if (!status) return "Не указан";
    
    switch (status.toLowerCase()) {
      case "approved":
        return "Одобрено";
      case "rejected":
        return "Отклонено";
      case "pending":
        return "На рассмотрении";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-bold">Все кандидаты</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-center items-center py-8">
            Загрузка кандидатов...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-bold">Все кандидаты</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-center items-center py-8 text-red-600">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <TableHead className="text-center text-[#6C6C6E]">Должность</TableHead>
              <TableHead className="text-center text-[#6C6C6E]">Общий стаж</TableHead>
              <TableHead className="text-center text-[#6C6C6E]">Статус</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {candidatesToRender.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Кандидаты не найдены
                </TableCell>
              </TableRow>
            ) : (
              candidatesToRender.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  onClick={() => handleRowClick(candidate)}
                  className="cursor-pointer hover:bg-blue-100 transition"
                >
                  <TableCell className="text-center">
                    {candidate.full_name || "Не указано"}
                  </TableCell>
                  <TableCell className="text-center">
                    {candidate.position || "Не указана"}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatExperience(candidate.experience_total)}
                  </TableCell>
                  <TableCell className={`text-center ${getStatusColor(candidate.status)}`}>
                    {translateStatus(candidate.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {selectedCandidate && (
        <OrderModal
          open={orderModalOpen}
          onClose={handleCloseOrderModal}
          data={convertCandidateToTableRowData(selectedCandidate)}
          onStatusChange={handleStatusChange}
          onOpenUploadModal={handleOpenUploadModal}
        />
      )}
    </Card>
  );
};