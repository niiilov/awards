import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/utils";

import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select"; // ← shadcn/ui базовые блоки

// Варианты оформления
const selectVariants = cva(
  "flex h-9 w-full min-w-0 rounded-xl bg-transparent px-3 py-5 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[14px]",
  {
    variants: {
      variant: {
        default:
          "bg-[#E6E8EB] text-gray-800 focus:ring-2 focus:ring-blue-500 cursor-pointer aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        cube: "rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CustomSelectProps
  extends React.ComponentPropsWithoutRef<typeof RadixSelect>,
    VariantProps<typeof selectVariants> {
  placeholder?: string;
  items: { label: string; value: string }[];
}

const Select = React.forwardRef<HTMLButtonElement, CustomSelectProps>(
  ({ variant, placeholder, items, ...props }, ref) => {
    return (
      <RadixSelect {...props}>
        <SelectTrigger ref={ref} className={cn(selectVariants({ variant }))}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </RadixSelect>
    );
  }
);

Select.displayName = "Select";

export { Select, selectVariants };
