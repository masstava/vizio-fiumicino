import { cn } from "@/src/lib/utils";

interface SectionProps {
  tone: "dark" | "light";
  children: React.ReactNode;
  className?: string;
}

export function Section({ tone, children, className }: SectionProps) {
  return (
    <section
      className={cn(
        "px-6 py-12 md:px-12 lg:px-16",
        tone === "dark" && "bg-dark text-cream-text",
        tone === "light" && "bg-cream text-ink",
        className,
      )}
    >
      {children}
    </section>
  );
}
