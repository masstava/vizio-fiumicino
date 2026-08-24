# Definition of Done — checklist UI

Prima di considerare chiuso qualsiasi lavoro su UI (pubblico o dashboard):

- [ ] Responsive verificato a 380px, nessuno scroll orizzontale
- [ ] Target di tap ≥ 44×44px su tutti gli elementi interattivi
- [ ] Stati di focus visibili (navigazione da tastiera)
- [ ] Contrasto testo/sfondo ≥ 4.5:1 (testo normale) / 3:1 (testo grande)
- [ ] TypeScript strict, nessun `any`
- [ ] Se pagina pubblica: lang corretto, stringhe dal dizionario IT/EN, fallback funzionante
- [ ] Build e tsc puliti — verificati, non assunti
- [ ] Desktop invariato se non era in scope

Questo si applica per default a ogni nuovo componente o pagina, non solo quando esplicitamente richiesto nel prompt.
