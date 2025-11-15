import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@shared/ui/sheet";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { useState } from "react";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from "@features/auth/hooks/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, user, logout } = useAuth();

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // обработчики выхода
  const handleLogoutClick = () => setShowLogoutConfirmation(true);
  const handleCancelLogout = () => setShowLogoutConfirmation(false);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirmation(false);
    navigate("/sign-in");
  };

  const AuthMenu = () => (
    <nav className="flex mt-6 flex-col gap-2 text-base">
      <Link
        to="/dashboard"
        className={`rounded-md px-4 py-2 transition ${
          location.pathname === "/dashboard"
            ? "bg-blue-100 hover:bg-blue-200 font-medium"
            : "hover:bg-gray-100"
        }`}
      >
        Главная
      </Link>
      <Link
        to="/upload-awards"
        className={`rounded-md px-4 py-2 transition ${
          location.pathname === "/upload-awards"
            ? "bg-blue-100 hover:bg-blue-200 font-medium"
            : "hover:bg-gray-100"
        }`}
      >
        Загрузка наградных листов
      </Link>
      <Link
        to="/candidates"
        className={`rounded-md px-4 py-2 transition ${
          location.pathname === "/candidates"
            ? "bg-blue-100 hover:bg-blue-200 font-medium"
            : "hover:bg-gray-100"
        }`}
      >
        Кандидаты
      </Link>
      <Link
        to="/certificates"
        className={`rounded-md px-4 py-2 transition ${
          location.pathname === "/certificates"
            ? "bg-blue-100 hover:bg-blue-200 font-medium"
            : "hover:bg-gray-100"
        }`}
      >
        Грамоты и благодарности
      </Link>
      <Link
        to="/template-library"
        className={`rounded-md px-4 py-2 transition ${
          location.pathname === "/template-library"
            ? "bg-blue-100 hover:bg-blue-200 font-medium"
            : "hover:bg-gray-100"
        }`}
      >
        Библиотека шаблонов
      </Link>
    </nav>
  );

  return (
    <div className="border-b bg-white w-full flex justify-center px-6 py-4">
      <div className="max-w-[1440px] items-center justify-between flex w-full">
        {/* Логотип */}
        <Link
          to={isAuth ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-5">
            <div className="bg-[#115BFE] text-white w-9 flex justify-center items-center text-sm font-bold h-9 rounded-[8px]">
              KR
            </div>
            <span className="sm:block hidden font-semibold font-base">
              Система наград Краснинского района
            </span>
          </div>
        </Link>

        {/* Правый блок */}
        {!isAuth ? (
          <div className="flex items-center gap-1 sm:gap-3">
            <Link to="/sign-in">
              <Button
                variant="default"
                className="py-1 px-3 rounded-[8px] text-sm sm:py-2 sm:px-4"
                size="default"
                color="outline"
              >
                Войти
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                variant="default"
                className="py-1 px-3 rounded-[8px] text-sm sm:py-2 sm:px-4"
                size="default"
              >
                Регистрация
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Гамбургер для мобилок */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="max-w-sm w-full p-4 lg:hidden"
              >
                <AuthMenu />
                <UserDropdown onLogout={handleLogoutClick}>
                  {user?.username || "Пользователь"}
                </UserDropdown>
              </SheetContent>
            </Sheet>

            {/* Меню для десктопа */}
            <div className="hidden lg:flex items-center gap-4">
              <UserDropdown onLogout={handleLogoutClick}>
                {user?.username || "Пользователь"}
              </UserDropdown>
            </div>
          </>
        )}

        {/* Диалог подтверждения выхода */}
        <Dialog
          open={showLogoutConfirmation}
          onOpenChange={setShowLogoutConfirmation}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Подтверждение выхода
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">Вы уверены, что хотите выйти?</p>
            </div>
            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button
                className="w-full"
                variant="outline"
                color="grey"
                onClick={handleCancelLogout}
              >
                Отмена
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                color="default"
                onClick={handleConfirmLogout}
              >
                Выйти
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};