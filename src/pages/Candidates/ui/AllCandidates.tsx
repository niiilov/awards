import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { Link } from "react-router-dom";
import { useCandidates } from "@features/candidates/hooks/useCandidates";
import { useUpdateCandidateConviction } from "@features/candidates/hooks/useUpdateCandidateConviction";
import type { Candidate } from "@features/candidates/hooks/useCandidates";
import { CandidatesModal } from "./CandidatesModal";

interface AllCandidatesProps {
  maxVisibleRows?: number;
  showMoreButton?: boolean;
  searchQuery?: string;
  statusFilter?: string;
}

export const AllCandidates = ({
  maxVisibleRows,
  showMoreButton = false,
  searchQuery = "",
  statusFilter = "",
}: AllCandidatesProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  // Хук для кандидатов
  const { candidates, loading, error, updateCandidateStatus, refetch } =
    useCandidates();

  // Отдельный хук для судимости
  const {
    updateCandidateConviction,
    error: convictionError,
    clearError: clearConvictionError,
  } = useUpdateCandidateConviction();

  // Фильтрация кандидатов
  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    // Фильтр по поиску ФИО
    if (searchQuery) {
      filtered = filtered.filter((candidate) =>
        candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Фильтр по статусу
    if (statusFilter) {
      filtered = filtered.filter(
        (candidate) => candidate.status === statusFilter,
      );
    }

    return filtered;
  }, [candidates, searchQuery, statusFilter]);

  const displayedCandidates = maxVisibleRows
    ? filteredCandidates.slice(0, maxVisibleRows)
    : filteredCandidates;

  const handleRowClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
    clearConvictionError();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateCandidateStatus(id, newStatus);
      if (selectedCandidate && selectedCandidate.id === id) {
        setSelectedCandidate({ ...selectedCandidate, status: newStatus });
      }
    } catch (err) {
      console.error("Ошибка при обновлении статуса:", err);
    }
  };

  // Функция для обработки изменения судимости
  const handleConvictionChange = async (id: string, hasConviction: boolean) => {
    try {
      await updateCandidateConviction(id, hasConviction);

      // 1. Обновляем selectedCandidate, если он открыт
      if (selectedCandidate && selectedCandidate.id === id) {
        setSelectedCandidate({
          ...selectedCandidate,
          has_conviction: hasConviction,
        });
      }

      // 2. Перезагружаем список кандидатов, чтобы обновились все данные
      await refetch();
    } catch (err) {
      console.error("Ошибка при обновлении судимости:", err);
    }
  };

  const handleCandidateDelete = async (candidateId: string) => {
    try {
      await refetch();
      if (selectedCandidate && selectedCandidate.id === candidateId) {
        handleCloseModal();
      }
    } catch (err) {
      console.error("Ошибка при обновлении списка после удаления:", err);
    }
  };

  const formatExperience = (years: number) => {
    if (years === null || years === undefined) return "Не указан";
    if (years === 0) return "Менее года";
    if (years === 1) return "1 год";
    if (years >= 2 && years <= 4) return `${years} года`;
    return `${years} лет`;
  };

  const getStatusColor = (status: string) => {
    if (!status) return "text-gray-600";

    const normalizedStatus = normalizeStatus(status);
    return normalizedStatus === "Прошел" ? "text-green-600" : "text-red-600";
  };

  const normalizeStatus = (status: string) => {
    if (!status) return "Не прошел";

    const statusLower = status.toLowerCase().trim();
    if (
      statusLower === "прошел" ||
      statusLower === "прошёл" ||
      statusLower === "passed" ||
      statusLower === "approved" ||
      statusLower === "одобрено"
    ) {
      return "Прошел";
    }
    return "Не прошел";
  };

  const formatFullName = (fullName: string) => {
    if (!fullName) return "Не указано";
    return fullName.replace(/\s+/g, " ").trim();
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
          <CardTitle className="text-xl font-bold">
            Все кандидаты{" "}
            {filteredCandidates.length > 0 && `(${filteredCandidates.length})`}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {convictionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">
              Ошибка при обновлении судимости: {convictionError}
            </div>
            <button
              onClick={clearConvictionError}
              className="text-red-600 hover:text-red-800 text-xs mt-1"
            >
              Скрыть
            </button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E]">ФИО</TableHead>
              <TableHead className="text-center text-[#6C6C6E]">
                Должность
              </TableHead>
              <TableHead className="text-center text-[#6C6C6E]">
                Общий стаж
              </TableHead>
              <TableHead className="text-center text-[#6C6C6E]">
                Статус
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayedCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {searchQuery || statusFilter
                    ? "Кандидаты не найдены по заданным фильтрам"
                    : "Кандидаты не найдены"}
                </TableCell>
              </TableRow>
            ) : (
              displayedCandidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  onClick={() => handleRowClick(candidate)}
                  className="cursor-pointer hover:bg-blue-100 transition"
                >
                  <TableCell className="text-center">
                    {formatFullName(candidate.full_name)}
                  </TableCell>
                  <TableCell className="text-center">
                    {candidate.position || "Не указана"}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatExperience(candidate.experience_total)}
                  </TableCell>
                  <TableCell
                    className={`text-center ${getStatusColor(candidate.status)}`}
                  >
                    {normalizeStatus(candidate.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {showMoreButton &&
          filteredCandidates.length > (maxVisibleRows || 0) && (
            <div className="text-center py-4">
              <Link
                to="/candidates"
                className="text-gray-500 hover:underline cursor-pointer"
              >
                Показать больше...
              </Link>
            </div>
          )}
      </CardContent>

      {selectedCandidate && (
        <CandidatesModal
          open={modalOpen}
          onClose={handleCloseModal}
          data={selectedCandidate}
          onStatusChange={handleStatusChange}
          onConvictionChange={handleConvictionChange}
          onCandidateDelete={handleCandidateDelete}
        />
      )}
    </Card>
  );
};
