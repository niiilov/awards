import { Link } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { RefreshCcwDot } from "lucide-react";
import { File } from "lucide-react";
import { CircleCheck, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Home = () => {
  const [isMoreDetailsVisible, setIsMoreDetailsVisible] = useState(false);

  const toggleMoreDetails = () => {
    setIsMoreDetailsVisible(!isMoreDetailsVisible);
  };

  return (
    <section className="mt-16 w-full items-center sm:mt-0 flex bg-gradient-to-br from-[#F9FAFB] to-[rgba(194,216,255,0.25)] flex-col text-center px-4">
      <div className="max-w-[1440px] w-full flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Заголовок */}
        <h1 className="text-[20px] font-bold md:text-[36px]">
          Добро пожаловать в систему наградной работы
        </h1>

        {/* Подзаголовок */}
        <p className="mt-4 text-[14px] text-[#AAAAAA] md:text-[20px] max-w-[1163px] w-full px-4">
          Платформа для автоматизации процесса подготовки документов по
          награждению почётной грамотой администрации Краснинского района.
          Загрузите наградные листы, позвольте системе проанализировать
          кандидатов, сформируйте протокол и грамоты — всё в одном месте.
        </p>

        {/* Кнопка */}
        <div className="mt-8 flex gap-3 items-center justify-center">
          <Link to="/application">
            <Button
              className="text-base rounded-[8px]"
              variant="default"
              size="home"
              color="default"
            >
              Войти в систему
            </Button>
          </Link>
          <Button
            className="text-base bg-[#CADDFF] hover:bg-[#c0d7ff] hover:text-black border-none text-black rounded-[8px]"
            variant="default"
            size="home"
            color="default"
            onClick={toggleMoreDetails}
          >
            Как это работает?{" "}
          </Button>
        </div>
        {isMoreDetailsVisible && (
          <div className="flex w-full justify-center">
            <div className="flex flex-col gap-8">
              <div className="flex sm:flex-row mt-12 flex-col gap-8 sm:items-start">
                <div className="max-h-180 text-start sm:min-h-[240px] h-full px-6 py-8 flex flex-col border items-start justify-start bg-white rounded-[16px] w-full sm:max-w-[360px] ">
                  <h3 className="font-medium text-base md:text-xl">
                    Автопроверка кандидатов
                  </h3>
                  <span className="text-sm md:text-base text-[#AAAAAA]">
                    Система извлекает ключевые поля из наградного листа и
                    проверяет критерии: стаж, наличие судимостей (если данные
                    есть), предыдущие награды.
                  </span>
                </div>
                <div className="max-h-180 text-start sm:min-h-[240px] h-full px-6 py-8 flex flex-col border items-start justify-start bg-white rounded-[16px] w-full sm:max-w-[360px] ">
                  <h3 className="font-medium text-base md:text-xl">
                    Генерация протоколов
                  </h3>
                  <span className="text-sm md:text-base text-[#AAAAAA]">
                    Создавайте протоколы заседаний комиссии на основе выбранных
                    кандидатов и списка присутствующих членов комиссии.
                  </span>
                </div>
                <div className="max-h-180 text-start sm:min-h-[240px] h-full px-6 py-8 flex flex-col border items-start justify-start bg-white rounded-[16px] w-full sm:max-w-[360px] ">
                  <h3 className="font-medium text-base md:text-xl">
                    Именные грамоты
                  </h3>
                  <span className="text-sm md:text-base text-[#AAAAAA]">
                    Автогенерация именных макетов грамот и благодарностей — с
                    выбором заслуги и подписанта.
                  </span>
                </div>
              </div>
              <div className="flex items-start flex-col">
                <h2 className="sm:text-xl font-bold">Как начать</h2>
                <ol className="list-decimal list-inside text-sm text-[#AAAAAA] sm:text-base text-start">
                  <li>Загрузите наградные листы (PDF/DOCX).</li>
                  <li>Запустите автоматическую проверку кандидатов.</li>
                  <li>
                    Проверьте список кандидатов, при необходимости внесите
                    правки.
                  </li>
                  <li>Сформируйте протокол заседания и именные грамоты.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
