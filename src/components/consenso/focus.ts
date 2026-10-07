// Dove mettere il focus quando il banner cookie o il modale delle
// preferenze spariscono. Senza, il pulsante appena premuto viene
// smontato e il focus ricade su <body>: chi naviga da tastiera
// ricomincia dall'inizio della pagina, e il lettore di schermo non
// annuncia nulla.

/** id del pulsante "Personalizza" del banner: il modale ci torna sopra se si chiude senza salvare. */
export const ID_PERSONALIZZA = "consenso-personalizza";

/**
 * Porta il focus sul contenuto della pagina (<main>), senza farla
 * scorrere. tabindex=-1 lo rende focalizzabile da script ma non lo
 * aggiunge al giro del Tab; il bordo di focus su <main> è tolto in
 * app/globals.css.
 */
export function focusSulContenuto(): void {
  const main = document.querySelector("main");
  if (!main) return;
  if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
}
