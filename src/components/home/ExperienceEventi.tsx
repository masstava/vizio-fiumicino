import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";

// Tema chiaro, volutamente minimale: solo un blocco di testo e un
// link di contatto — nessun elenco eventi, nessuna card, nessun
// flusso di prenotazione sala. Il pulsante "Contattaci" è un
// placeholder inerte come le altre CTA di contatto/prenotazione già
// in pagina, in attesa di un canale di contatto reale.
export function ExperienceEventi() {
  return (
    <Section tone="light">
      <p className="mb-3 font-sans text-[10px] tracking-widest uppercase text-muted">
        Experience &amp; Eventi
      </p>
      <div className="max-w-xl">
        <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
          Occasioni su misura
        </h2>
        <p className="mb-6 font-sans text-sm leading-relaxed text-muted">
          Menu degustazione, cene a tema, eventi privati: raccontaci cosa hai
          in mente e lo organizziamo insieme.
        </p>
        <Button type="button" variant="primary">
          Contattaci
        </Button>
      </div>
    </Section>
  );
}
