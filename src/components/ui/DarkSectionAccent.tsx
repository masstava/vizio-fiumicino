// Accenti decorativi per le sezioni scure: un bagliore caldo (brace)
// negli angoli e un filo di separazione in alto. Solo gradienti CSS,
// nessuna immagine e nessuna richiesta di rete — costo di rendering
// trascurabile, nessun impatto sul target di caricamento.
//
// Sta dietro al contenuto (-z-0 sotto un contenitore relative) ed è
// a opacità molto bassa: il fondo effettivo resta a tutti gli effetti
// bg-dark, quindi i rapporti di contrasto già verificati per
// cream-text / muted-dark / gold restano validi.
export function DarkSectionAccent() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Filo di separazione superiore, sfumato ai lati */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      {/* Bagliore di brace: due aloni molto tenui agli angoli opposti */}
      <div
        className="absolute -left-24 -top-16 h-72 w-72 rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, var(--color-bordeaux) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full opacity-[0.06]"
        style={{
          background:
            "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
