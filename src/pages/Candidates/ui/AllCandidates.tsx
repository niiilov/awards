import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { useCandidates } from "@features/candidates/hooks/useCandidates";
import type { Candidate } from "@features/candidates/hooks/useCandidates";
import { CandidatesModal } from "./CandidatesModal";

export const AllCandidates = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { candidates, loading, error, updateCandidateStatus, refetch } = useCandidates();

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateCandidateStatus(id, newStatus);
    // Обновляем выбранного кандидата если он открыт в модалке
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }
  };

  const handleCandidateDelete = (candidateId: string) => {
    // После удаления перезагружаем список кандидатов
    refetch();
    // Закрываем модалку если удален текущий кандидат
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      handleCloseModal();
    }
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
      case "прошел":
      case "passed":
        return "text-green-600";
      case "не прошел":
      case "failed":
      case "отклонено":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Функция для нормализации статуса (только два варианта)
  const normalizeStatus = (status: string) => {
    if (!status) return "Не прошел";
    
    const statusLower = status.toLowerCase();
    if (statusLower === "прошел" || statusLower === "passed" || statusLower === "approved") {
      return "Прошел";
    }
    return "Не прошел";
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
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Кандидаты не найдены
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate) => (
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
                    {normalizeStatus(candidate.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {selectedCandidate && (
        <CandidatesModal
          open={modalOpen}
          onClose={handleCloseModal}
          data={selectedCandidate}
          onStatusChange={handleStatusChange}
          onCandidateDelete={handleCandidateDelete}
        />
      )}
    </Card>
  );
};