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

export const UploadedTable = ({}) => {
  return (
    <Card className="border-none w-full p-0 shadow-none">
      <CardHeader className="w-full p-0">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-bold">Загруженные файлы</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead className="text-center text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition">
                <div className="flex items-center justify-center gap-1">
                  Имя файла
                </div>
              </TableHead>
              <TableHead className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition">
                <div className="flex items-center gap-1">Статус</div>
              </TableHead>
              <TableHead className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition">
                <div className="flex items-center gap-1">Действия</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center">nagradnoy_list.docx</TableCell>
              <TableCell>Загружен</TableCell>
              <TableCell className="text-red-500">Удалить</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Link
          to="/order-log"
          className="text-center text-gray-500 py-2 cursor-pointer hover:underline block"
        >
          Показать больше...
        </Link>
      </CardContent>
    </Card>
  );
};
