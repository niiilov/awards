import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { ChevronDown, CircleUserRound } from "lucide-react";
import { useClickOutside } from "@shared/hooks/useClickOutside";

interface UserDropdownProps {
  children: string;
  onLogout: () => void;
}

export const UserDropdown = ({ children, onLogout }: UserDropdownProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const paths = [
    "/dashboard",
    "/upload-awards",
    "/candidates",
    "/protocol",
    "/certificates",
    "/template-library",
  ];

  const getProfile = paths.includes(currentPath);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setOpen(false));

  const handleLogout = () => {
    setOpen(false);
    onLogout(); // Вызываем переданную функцию выхода
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="gap-4 py-1 px-4 sm:w-fit w-full justify-center flex items-center rounded-[12px] cursor-pointer bg-neutral-100 hover:bg-neutral-200"
      >
        <div className="flex gap-2 items-center">
          <ChevronDown className="text-neutral-400 h-5 w-5" />
          <span className="font-semibold sm:font-normal sm:text-sm">
            {children}
          </span>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarImage src={undefined} alt="Avatar" />
          <AvatarFallback>
            <CircleUserRound className="h-7 w-7 text-neutral-500" />
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white flex flex-col gap-1 px-2 py-2 border rounded-xl shadow-md">
          {getProfile ? (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="font-semibold text-sm px-6 py-2 hover:bg-[#CADDFF] rounded-sm w-40"
            >
              Профиль
            </Link>
          ) : (
            <Link
              to="/dashboard" // Исправлена опечатка: было "/dashborard"
              onClick={() => setOpen(false)}
              className="font-semibold text-sm px-6 py-2 hover:bg-[#CADDFF] rounded-sm w-40"
            >
              Дашборд
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="font-semibold text-start cursor-pointer text-sm px-6 py-2 hover:bg-[#CADDFF] rounded-sm w-40"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};
