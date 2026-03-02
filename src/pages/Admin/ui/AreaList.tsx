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
import { AreaListModal } from "./AreaListModal";

export const AreaList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //   if (loading) {
  //     return (
  //       <Card className="border-none w-full p-0 shadow-none">
  //         <CardHeader className="w-full p-0">
  //           <CardTitle className="text-xl font-bold">Муниципальные округа</CardTitle>
  //         </CardHeader>
  //         <CardContent className="p-0">
  //           <div className="flex justify-center items-center py-8">
  //             Загрузка муниципальных округов...
  //           </div>
  //         </CardContent>
  //       </Card>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <Card className="border-none w-full p-0 shadow-none">
  //         <CardHeader className="w-full p-0">
  //           <CardTitle className="text-xl font-bold">Муниципальные округа не загружены</CardTitle>
  //         </CardHeader>
  //         <CardContent className="p-0">
  //           <div className="flex justify-center items-center py-8 text-red-600">
  //             {error}
  //           </div>
  //         </CardContent>
  //       </Card>
  //     );
  //   }

  const members = [
    {
      id: 1,
      name: "Округ 1",
    },
    {
      id: 2,
      name: "Округ 2",
    },
    {
      id: 3,
      name: "Округ 3",
    },
    {
      id: 4,
      name: "Округ 4",
    },
    {
      id: 5,
      name: "Округ 5",
    },
  ];

  return (
    <Card className="border-none w-full p-0 shadow-none">
      <CardHeader className="w-full p-0">
        <CardTitle className="font-semibold">Муниципальные округа</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E]">
                Название МО
              </TableHead>
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
                  <TableCell className="text-center">{member.name}</TableCell>
                  <TableCell>
                    <button className="text-red-500 hover:text-red-700 cursor-pointer transition">
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
            onClick={() => {
              handleOpenModal();
            }}
          >
            Добавить
          </Button>
        </div>
      </CardContent>

      <AreaListModal open={isModalOpen} onClose={handleCloseModal} />
    </Card>
  );
};
