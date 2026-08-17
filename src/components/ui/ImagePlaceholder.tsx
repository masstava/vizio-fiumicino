import { cn } from "@/src/lib/utils";

const GRADIENTS: [string, string][] = [
  ["#8b1a1a", "#d9a05b"],
  ["#0a0705", "#8b1a1a"],
  ["#1a1a1a", "#5f5e5a"],
  ["#d9a05b", "#8b1a1a"],
  ["#5f5e5a", "#0a0705"],
  ["#0a0705", "#d9a05b"],
  ["#8b1a1a", "#1a1a1a"],
  ["#d9a05b", "#5f5e5a"],
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

interface ImagePlaceholderProps {
  seed: string;
  aspectRatio?: string;
  className?: string;
}

export function ImagePlaceholder({
  seed,
  aspectRatio = "1 / 1",
  className,
}: ImagePlaceholderProps) {
  const [from, to] = GRADIENTS[hashSeed(seed) % GRADIENTS.length];

  return (
    <div
      className={cn("w-full flex-shrink-0", className)}
      style={{
        aspectRatio,
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
      aria-hidden="true"
    />
  );
}
