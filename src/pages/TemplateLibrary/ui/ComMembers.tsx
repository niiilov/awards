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
import { ComMembersModal } from "./ComMembersModal";
import type { CommissionMember } from "@features/template-library/hooks/useCommissionMembers";

interface AddMemberRequest {
  full_name: string;
  position: string;
}

interface MembersState {
  members: CommissionMember[];
  loading: boolean;
  error: string | null;
  deleteMember: (memberId: string) => Promise<boolean>; // Изменено на Promise<boolean>
  addMember: (memberData: AddMemberRequest) => Promise<CommissionMember>;
  refresh: () => void;
}

interface ComMembersProps {
  membersState: MembersState;
}

export const ComMembers = ({ membersState }: ComMembersProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CommissionMember | null>(
    null,
  );

  const { members, loading, error, deleteMember, refresh } = membersState;

  const handleOpenModal = (member: CommissionMember | null = null) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (confirm("Вы уверены, что хотите удалить этого члена комиссии?")) {
      const success = await deleteMember(memberId);
      if (success) {
        refresh(); // Обновляем только если удаление успешно
      } else {
        alert("Не удалось удалить члена комиссии");
      }
    }
  };

  const handleMemberAdded = () => {
    refresh();
  };

  if (loading) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <CardTitle className="text-xl font-bold">Члены комиссии</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-center items-center py-8">
            Загрузка членов комиссии...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <CardTitle className="text-xl font-bold">Члены комиссии</CardTitle>
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
        <CardTitle className="text-xl font-bold">Члены комиссии</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E]">ФИО</TableHead>
              <TableHead className="text-[#6C6C6E]">Должность</TableHead>
              <TableHead className="text-[#6C6C6E]">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Члены комиссии не найдены
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="text-center">
                    {member.full_name}
                  </TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer transition"
                    >
                      Удалить
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
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
        </div>
      </CardContent>

      <ComMembersModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedMember}
        onMemberAdded={handleMemberAdded}
      />
    </Card>
  );
};
