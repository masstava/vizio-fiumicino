import { cn } from "@/src/lib/utils";

type BadgeVariant = "light" | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "light",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5",
        "font-sans text-[10px] font-medium tracking-widest uppercase",
        "rounded-[2px]",
        variant === "light" &&
          "border border-bordeaux text-bordeaux",
        variant === "dark" &&
          "border border-gold text-gold",
        className,
      )}
      style={{ borderWidth: "0.5px" }}
    >
      {children}
    </span>
  );
}
