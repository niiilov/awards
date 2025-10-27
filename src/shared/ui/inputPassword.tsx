import React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { EyeOff } from "lucide-react";
import { cn } from "@shared/lib/utils";

type InputWithPasswordProps = {
  id?: string;
  label: string;
  className?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean; // необязательный проп
};

export const InputWithPassword = ({
  id,
  label,
  className,
  onChange,
  required,
  value,
}: InputWithPasswordProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("space-y-1 relative w-full", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder="Введите ваш пароль"
        onChange={onChange}
        value={value}
        required={required} // вот здесь передаём опциональный required
        className="border pr-10 w-full"
      />
      <EyeOff
        className="w-5 h-5 absolute right-3 top-7 text-gray-400 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
};
