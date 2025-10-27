import { useState } from "react";
import { api } from "@shared/api/axios";

interface ApplicationData {
    applicant: {
        id: string;
    };
    source: {
        id: string;
    };
    address: string;
    dogs_count: number;
    behavior: string;
    urgency: string;
    contact_person: string;
}

export const useHandleSubmit = (initialFormData: ApplicationData) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<ApplicationData>(initialFormData);

  // Обработчик для текстовых полей
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Обработчик для селектов
const handleSelectChange = (field: string) => (selectedValue: string) => {
  console.log(`handleSelectChange: ${field} = ${selectedValue}`);
  
  if (field === "applicant") {
    setFormData((prev) => ({
      ...prev,
      applicant: {
        id: selectedValue,
      },
    }));
  } else if (field === "source") {
    // ИСПРАВЛЕНО: для source тоже создаем объект с id
    setFormData((prev) => ({
      ...prev,
      source: {
        id: selectedValue,
      },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [field]: selectedValue,
    }));
  }
};

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Формируем финальный JSON (убираем поля, которые сервер генерирует сам)
      const submissionData = {
        applicant: {
          id: formData.applicant.id,
        },
        source: {
          id: formData.source.id,
        },
        address: formData.address,
        dogs_count: Number(formData.dogs_count),
        behavior: formData.behavior,
        urgency: formData.urgency,
        contact_person: formData.contact_person,
      };

      console.log("Отправка данных на /requests:", submissionData);

      // Отправка на API через ваш axios instance
      const response = await api.post("/requests", submissionData);

      console.log("Успешный ответ от сервера:", response.data);

      setSubmitSuccess(true);
      handleClear();

      // Автоматически скрываем сообщение об успехе через 5 секунд
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      console.error("Ошибка при отправке заявки:", error);

      // Обработка ошибок через ваш interceptor
      if (error.response?.data) {
        // Пытаемся получить сообщение об ошибке от сервера
        const serverError = error.response.data;

        if (typeof serverError === "object") {
          // Если ошибка в формате { field: ["error message"] }
          const errorMessages = Object.values(serverError).flat();
          setSubmitError(
            errorMessages.join(", ") || "Ошибка при отправке заявки"
          );
        } else if (typeof serverError === "string") {
          setSubmitError(serverError);
        } else {
          setSubmitError("Ошибка при отправке заявки. Попробуйте позже.");
        }
      } else {
        setSubmitError(
          error.message ||
            "Произошла ошибка при отправке заявки. Попробуйте позже."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
  };

  return {
    loading,
    submitError,
    submitSuccess,
    formData,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClear,
    setFormData,
  };
};