"use client";

import { useEffect } from "react";
import type { Locale } from "@/src/lib/i18n/config";

// Imposta lang sull'elemento <html> dal client.
//
// Serve SOLO alla pagina 404. Ovunque altro l'attributo lo mette il
// layout radice, che è la via corretta; qui non si può: quando Next
// rende una not-found genera un guscio proprio
// (<html id="__next_error__">) e il layout non partecipa all'HTML del
// server. Da dentro <body> non si raggiungono gli attributi di <html>.
//
// L'HTML iniziale resta quindi senza lang. Lo scopo dell'attributo —
// far proporre al browser la traduzione verso le lingue diverse da IT
// ed EN, e dare la pronuncia giusta ai lettori di schermo — si esercita
// però sul DOM dopo il caricamento, che è esattamente ciò che questo
// componente sistema.
//
// L'alternativa sarebbe rendere il 404 come pagina normale per far
// intervenire il layout, ma risponderebbe 200: un soft 404 danneggia
// l'indicizzazione molto più di un attributo assente nell'HTML
// iniziale di una pagina d'errore.
export function ImpostaLingua({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
