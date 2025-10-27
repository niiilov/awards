import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "px-6 py-2 border-2 rounded-full transition",
        original: "bg-primary text-white shadow-xs hover:bg-primary/90",
        cube: "px-6 py-2 border-2 rounded-lg transition",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "text-[12px] h-9 px-4 py-2 has-[>svg]:px-3 md:text-[12px]",
        sm: "text-[12px] h-9 px-4 py-2 has-[>svg]:px-3 md:text-[12px]",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        home: "text-[12px] h-9 px-4 py-2 has-[>svg]:px-3 md:text-[16px]"
      },
      color: {
        default:
          "border-blue-600 bg-blue-600 text-white hover:bg-white hover:text-blue-600",
        outline:
          "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
        grey: "border-grey-600 text-grey-600 hover:border-blue-600 hover:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      color: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
