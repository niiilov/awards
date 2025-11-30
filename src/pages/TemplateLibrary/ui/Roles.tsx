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
import { useCommissionRoles } from "@features/template-library/hooks/useCommissionRoles";

interface Member {
  id: string;
  full_name: string;
  position: string;
  // Add other member properties as needed
}

interface MembersState {
  members: Member[];
}

export const Roles = ({ membersState }: { membersState: MembersState }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface Role {
    id: string;
    role: string;
    full_name: string;
    position: string;
  }

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { roles, loading, deleteRole, refresh } = useCommissionRoles();

  const handleOpenModal = (role: Role | null = null) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (confirm("Вы уверены, что хотите удалить эту роль?")) {
      await deleteRole(roleId);
      refresh();
    }
  };

  const handleRoleAdded = () => {
    refresh();
  };

  if (loading) return <div>Загрузка ролей...</div>;

  return (
    <Card className="border-none w-full p-0 shadow-none">
      <CardHeader className="w-full p-0">
        <CardTitle className="text-xl font-bold">Роли</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E]">Роль</TableHead>
              <TableHead className="text-center text-[#6C6C6E]">ФИО</TableHead>
              <TableHead className="text-[#6C6C6E]">Должность</TableHead>
              <TableHead className="text-[#6C6C6E]">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Роли не найдены
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="text-center">{role.role}</TableCell>
                  <TableCell className="text-center">
                    {role.full_name}
                  </TableCell>
                  <TableCell>{role.position}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
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

        <Button
          className="w-full mt-4"
          variant="ghost"
          onClick={() => handleOpenModal()}
        >
          Добавить
        </Button>
      </CardContent>

      <RolesModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={
          selectedRole
            ? { role: selectedRole.role, member_id: selectedRole.id }
            : null
        }
        onRoleAdded={handleRoleAdded}
        members={membersState.members} // ← передаём актуальный список
      />
    </Card>
  );
};
