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

export const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const { roles, loading, error, deleteRole, refresh } = useCommissionRoles();

  const handleOpenModal = (role: any = null) => {
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
      // После удаления обновляем список
      refresh();
    }
  };

  // Функция для обновления списка после добавления роли
  const handleRoleAdded = () => {
    refresh(); // Обновляем список ролей
  };

  if (loading) {
    return (
      <Card className="border-none w-full p-0 shadow-none">
        <CardHeader className="w-full p-0">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xl font-bold">Роли</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-center items-center py-8">
            Загрузка ролей...
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
            <CardTitle className="text-xl font-bold">Роли</CardTitle>
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
          <CardTitle className="text-xl font-bold">Роли</CardTitle>
        </div>
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
                  <TableCell className="text-center">
                    {role.role}
                  </TableCell>
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

      <RolesModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedRole}
        onRoleAdded={handleRoleAdded}
      />
    </Card>
  );
};