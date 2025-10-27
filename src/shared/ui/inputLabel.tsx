import { cn } from "@shared/lib/utils";
import { Input } from "./input";
import { Label } from "./label";
import type { ReactNode } from "react";

interface InputWithLabelProps {
  icon?: ReactNode;
  label: string;
  type: string;
  id?: string;
  placeholder?: string;
  className?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean; // добавили required
}

export function InputWithLabel({
  icon,
  label,
  type,
  id,
  placeholder,
  className,
  onChange,
  value,
  required, // получили required
}: InputWithLabelProps) {
  return (
    <div className={cn("grid w-full items-center gap-3", className)}>
       <Label htmlFor={id}>
        <span className="flex items-center gap-1">
          {icon && <span className="text-gray-500">{icon}</span>}
          {label}
        </span>
      </Label>
      <Input
        type={type}
        onChange={onChange}
        value={value}
        id={id}
        placeholder={placeholder}
        required={required} // передали required в Input
      />
    </div>
  );
}
