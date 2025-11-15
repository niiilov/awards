import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button } from "@shared/ui/button";
import { InputWithLabel } from "@shared/ui/inputLabel";
import { Alert, AlertTitle, AlertDescription } from "@shared/ui/alert";

import { useSignIn } from "@features/auth/hooks/useSignIn";
import clsx from "clsx";

import Logo from "./assets/logo.svg";
import object1 from "./assets/object1.svg";
import object2 from "./assets/object2.svg";

export const SignInForm = () => {
  const {
    login,
    setLogin,
    password,
    setPassword,
    error,
    generalError,
    loading,
    onSubmit,
    clearErrors,
  } = useSignIn();

  useEffect(() => {
    if (error || generalError) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, generalError, clearErrors]);

  return (
    <>
      {/* ===== ВСПЛЫВАЮЩИЙ БЛОК С ОШИБКОЙ ===== */}
      {(error || generalError) && (
        <div
          className={clsx(
            "fixed top-4 left-1/2 z-50 transform -translate-x-1/2 transition-all duration-300",
            "w-[90%] max-w-md"
          )}
        >
          <Alert variant="destructive">
            <AlertTitle>
              {generalError ? "Что-то пошло не так" : "Ошибка входа"}
            </AlertTitle>
            <AlertDescription>{generalError || error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* ===== ФОРМА ВХОДА ===== */}
      <div className="flex overflow-hidden relative justify-center px-5 items-center w-screen h-screen bg-gradient-to-t from-[#E6EEFF] to-[#F2F6FC] overflow-x-hidden">
        <form
          className="flex-col flex gap-3 w-full max-w-[400px] items-center justify-center z-50 backdrop-blur-[20px] border border-white/20 rounded-xl p-6 shadow-md"
          onSubmit={onSubmit}
        >
          <div className="w-full flex flex-col items-center">
            <img src={Logo} alt="logo" />
            <hr className="border-[#9FB8FD] border-[0.5px] w-full" />
          </div>
          <h2>Вход</h2>
          
          <InputWithLabel
            label="Логин"
            type="text"
            placeholder="Введите логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          
          <InputWithLabel
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button 
            className="w-full rounded-[8px]" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Вход..." : "Вход"}
          </Button>
          
          <span>
            Еще нет аккаунта?{" "}
            <Link to="/sign-up" className="text-blue-600 underline">
              Регистрация
            </Link>
          </span>
        </form>
        <img
          src={object1}
          className="absolute left-2/12 hidden sm:block"
          alt=""
        />
        <img
          src={object2}
          className="absolute bottom-0 left-0 max-w-[900px] w-full hidden sm:block"
          alt=""
        />
      </div>
    </>
  );
};