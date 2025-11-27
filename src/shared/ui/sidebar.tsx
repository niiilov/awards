import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside className={clsx(className, " h-fit mr-4 p-4")}>
      <nav className="flex flex-col max-w-[300px] w-full gap-2 text-base border border-gray-200 rounded-xl p-2">
        <div className="flex flex-col ml-8 gap-1  mb-2 mt-2">
          <span className="font-semibold text-xl">Дашборд</span>
        </div>
        <Link
          to="/dashboard"
          className={`rounded-md font-medium px-8 py-2 transition ${
            location.pathname === "/dashboard"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100 text-[#AAAAAA]"
          }`}
        >
          Главная
        </Link>
        <Link
          to="/upload-awards"
          className={`rounded-md font-medium px-8 py-2 transition ${
            location.pathname === "/upload-awards"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100 text-[#AAAAAA]"
          }`}
        >
          Загрузка наградных листов
        </Link>
        <Link
          to="/candidates"
          className={`rounded-md font-medium px-8  py-2 transition ${
            location.pathname === "/candidates"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100 text-[#AAAAAA]"
          }`}
        >
          Кандидаты
        </Link>
        <Link
          to="/protocol"
          className={`rounded-md font-medium px-8  py-2 transition ${
            location.pathname === "/protocol"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100 text-[#AAAAAA]"
          }`}
        >
          Протокол
        </Link>
        <Link
          to="/certificates"
          className={`rounded-md font-medium px-8  py-2 transition ${
            location.pathname === "/certificates"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100 text-[#AAAAAA]"
          }`}
        >
          Грамоты и благодарности
        </Link>
        <Link
          to="/template-library"
          className={`rounded-md font-medium px-8  py-2 transition ${
            location.pathname === "/template-library"
              ? "bg-blue-100 hover:bg-blue-200 font-medium"
              : "hover:bg-gray-100 text-[#AAAAAA]"
          }`}
        >
          Библиотека шаблонов
        </Link>
      </nav>
    </aside>
  );
};
