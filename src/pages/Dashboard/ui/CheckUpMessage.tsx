import CheckIcon from "../assets/CheckIcon.svg";

// Компонент карточки уведомления
export const CheckUpMessage = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <div
      className={`absolute bottom-6 right-6 flex gap-4 px-6 py-2 bg-white rounded-[12px] border shadow-lg transition-all duration-500 
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      <img src={CheckIcon} alt="success" />
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">Автопроверка</h3>
        <span className="text-sm text-[#AAAAAA]">
          Автопроверка кандидатов успешно выполнена.
        </span>
      </div>
    </div>
  );
};
