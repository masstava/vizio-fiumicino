import Image from "next/image";
import { cn } from "@/src/lib/utils";

// Marchio ufficiale, versione principale (lettering oro + fiamma).
//
// SOLO SU FONDI SCURI: l'oro del lettering (#dfc98a) su crema
// (#f7f2e9) dà 1,46:1 ed è illeggibile; su fondo scuro dà 12,3:1.
// Se serve un richiamo di brand su una sezione chiara si usa
// FlameAccent con tone="light", non questo componente.
//
// Servito come <Image> e non inline: gli SVG del marchio dichiarano
// le classi .cls-1/.cls-2 dentro un tag <style>, che inline andrebbero
// in conflitto tra loghi diversi sulla stessa pagina.
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo-completo.svg"
      alt="Vizio Bistrot"
      width={1920}
      height={920}
      priority={priority}
      // Solo w-auto: l'altezza la decide chi lo usa. Mettere anche
      // h-auto qui creerebbe un conflitto con la classe di altezza
      // passata da fuori (stessa specificità), e a vincere sarebbe
      // l'ordine nel CSS generato, non quello nell'attributo.
      className={cn("w-auto", className)}
    />
  );
}
