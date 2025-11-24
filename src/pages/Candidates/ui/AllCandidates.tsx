// AllCandidates.tsx
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
  statusFilter = ""
}: AllCandidatesProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { candidates, loading, error, updateCandidateStatus, refetch } = useCandidates();

  // Фильтрация кандидатов
  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    // Фильтр по поиску ФИО
    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по статусу
    if (statusFilter) {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
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
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateCandidateStatus(id, newStatus);
    if (selectedCandidate && selectedCandidate.id === id) {
      setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    }
  };

  const handleCandidateDelete = (candidateId: string) => {
    refetch();
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      handleCloseModal();
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
    return fullName.replace(/\s+/g, ' ').trim();
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
            Все кандидаты {filteredCandidates.length > 0 && `(${filteredCandidates.length})`}
          </CardTitle>
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
            {displayedCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {searchQuery || statusFilter ? "Кандидаты не найдены по заданным фильтрам" : "Кандидаты не найдены"}
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
                  <TableCell className={`text-center ${getStatusColor(candidate.status)}`}>
                    {normalizeStatus(candidate.status)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {showMoreButton && filteredCandidates.length > (maxVisibleRows || 0) && (
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
          onCandidateDelete={handleCandidateDelete}
        />
      )}
    </Card>
  );
};