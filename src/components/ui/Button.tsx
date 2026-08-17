import { ButtonHTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-2.5",
        "font-sans text-sm font-medium tracking-wide",
        "rounded-[2px] transition-opacity duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variant === "primary" &&
          "bg-bordeaux text-cream-text hover:opacity-90 focus-visible:ring-bordeaux",
        variant === "outline" &&
          "border border-cream-text text-cream-text bg-transparent hover:bg-cream-text/10 focus-visible:ring-cream-text",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
