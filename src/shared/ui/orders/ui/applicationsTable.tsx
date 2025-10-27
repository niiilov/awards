// shared/ui/orders/ui/ApplicationsTable.tsx

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@shared/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import FilterDropdown from "@shared/ui/filter";
import { authStore } from "@features/auth";
import { OrderModal } from "./orderModal";
// import { UploadDocumentModal } from "./uploadActModal";
import type {
  TableRowData,
  ApplicationsTableProps,
  SortField,
  SortDirection,
} from "./types";
import { extractNumberFromString, transformFilteredData } from "./utils";

export const ApplicationsTable = ({
  title,
  data,
  showMoreButton = false,
  maxVisibleRows,
}: ApplicationsTableProps) => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(
    null
  );
  const [selectedRequestData, setSelectedRequestData] =
    useState<TableRowData | null>(null);
  const [sortField, setSortField] = useState<SortField>("sortableNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [tableData, setTableData] = useState<TableRowData[]>(data);
  const [filteredData, setFilteredData] = useState<TableRowData[]>(data);
  const [isFilterActive, setIsFilterActive] = useState(false);

  useEffect(() => {
    setTableData(data);
    setFilteredData(data);
    setIsFilterActive(false);
  }, [data]);

  const handleFilteredData = (filteredRequests: any) => {
    const transformedData = transformFilteredData(filteredRequests);
    console.log("Преобразованные данные:", transformedData);
    setFilteredData(transformedData);
    setIsFilterActive(true);
  };

  const handleFilterLoading = (loading: boolean) => {
    console.log("Filter loading:", loading);
  };

  const handleFilterError = (error: string | null) => {
    if (error) {
      console.error("Filter error:", error);
    }
  };

  const dataToProcess = isFilterActive ? filteredData : tableData;

  const processedData = useMemo(() => {
    return dataToProcess.map((item) => ({
      ...item,
      sortableNumber: extractNumberFromString(item.number),
    }));
  }, [dataToProcess]);

  const sortedData = useMemo(() => {
    const sorted = [...processedData].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue.split(".").reverse().join("-")).getTime();
        bValue = new Date(bValue.split(".").reverse().join("-")).getTime();
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return maxVisibleRows ? sorted.slice(0, maxVisibleRows) : sorted;
  }, [processedData, sortField, sortDirection, maxVisibleRows]);

  const handleRowClick = (row: TableRowData) => {
    setSelectedRowId(row.id);
    setSelectedRequestData(row);
    setOrderModalOpen(true);
  };

  const handleOpenUploadModal = (requestData: TableRowData) => {
    console.log("handleOpenUploadModal вызван с данными:", requestData);
    setSelectedRequestData(requestData);
    setOrderModalOpen(false); // Сначала закрываем модальное окно заявки
    // Используем setTimeout чтобы дать время на закрытие первого модального окна
    setTimeout(() => {
      setUploadModalOpen(true);
    }, 100);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedRowId(null);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedRequestData(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={16} />;
    return sortDirection === "asc" ? (
      <span className="text-sm">↑</span>
    ) : (
      <span className="text-sm">↓</span>
    );
  };

  const updateStatus = (id: string | number, newStatus: string) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    if (isFilterActive) {
      setFilteredData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  const handleUploadSuccess = () => {
    console.log("Акт успешно загружен");
    // Можно обновить данные таблицы или показать уведомление
    if (selectedRequestData) {
      updateStatus(selectedRequestData.id, "Выполнена");
    }
  };

  const selectedRow = selectedRowId
    ? dataToProcess.find((item) => item.id === selectedRowId)
    : undefined;

  const { user } = authStore;

  // Функция для определения класса строки в зависимости от статуса
  const getRowClassName = (status?: string) => {
    const baseClass = "cursor-pointer transition";

    switch (status) {
      case "Выполнена":
        return `${baseClass} bg-green-100 hover:bg-green-200`;
      case "Отменена":
        return `${baseClass} bg-gray-100 hover:bg-gray-200`;
      case "Просрочена":
        return `${baseClass} bg-red-100 hover:bg-red-200`;
      case "Новая":
      case "В работе":
      default:
        return `${baseClass} bg-white hover:bg-blue-50`;
    }
  };

  return (
    <Card className="border-none w-full shadow-none">
      <CardHeader className="w-full">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {((!showMoreButton && user?.login === "ryaon_comm") ||
            (!showMoreButton && user?.login === "podryadchik")) && (
            <FilterDropdown
              onFilteredData={handleFilteredData}
              onLoading={handleFilterLoading}
              onError={handleFilterError}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#CADDFF]">
              <TableHead
                className="text-center text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("sortableNumber")}
              >
                <div className="flex items-center justify-center gap-1">
                  ФИО {getSortIcon("sortableNumber")}
                </div>
              </TableHead>
              <TableHead
                className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("applicant")}
              >
                <div className="flex items-center gap-1">
                  Должность {getSortIcon("applicant")}
                </div>
              </TableHead>
              <TableHead
                className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("urgency")}
              >
                <div className="flex items-center gap-1">
                  Стаж {getSortIcon("urgency")}
                </div>
              </TableHead>
              <TableHead
                className="text-[#6C6C6E] cursor-pointer hover:bg-blue-200 transition"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Статус {getSortIcon("date")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <TableRow
                  key={row.id}
                  className={getRowClassName(row.status)}
                  onClick={() => handleRowClick(row)}
                >
                  <TableCell className="text-center">{row.number}</TableCell>
                  <TableCell>{row.applicant}</TableCell>
                  <TableCell>{row.urgency}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  {isFilterActive
                    ? "Нет данных по выбранному фильтру"
                    : "Нет данных"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showMoreButton && (
          <Link
            to="/order-log"
            className="text-center text-gray-500 py-2 cursor-pointer hover:underline block"
          >
            Показать больше...
          </Link>
        )}
      </CardContent>

      <OrderModal
        open={orderModalOpen}
        onClose={handleCloseOrderModal}
        data={selectedRow}
        onStatusChange={updateStatus}
        onOpenUploadModal={handleOpenUploadModal}
      />
    </Card>
  );
};
