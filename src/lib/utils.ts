import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Unisce classi condizionali e risolve i conflitti Tailwind: fra due
// utility che agiscono sulla stessa proprietà vince l'ultima passata.
//
// Prima era una semplice concatenazione, e questo era un problema
// reale: una classe di base messa dentro un componente (per esempio
// "h-4") competeva con quella passata da fuori ("h-64") a parità di
// specificità, e a decidere finiva l'ordine nel CSS generato invece
// dell'intento di chi scriveva. Con twMerge l'ultima vince sempre.
//
// È anche la firma che si aspettano i componenti shadcn/ui.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
