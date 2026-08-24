import { notFound } from "next/navigation";

// Rotta di raccolta per tutti i percorsi pubblici che non
// corrispondono a nessuna pagina.
//
// Serve perché not-found.tsx dentro un segmento dinamico scatta solo
// quando è il codice a chiamare notFound(): un URL che non combacia
// con nessuna rotta cercherebbe invece il 404 globale in
// app/not-found.tsx, che qui non può esistere. Il sito pubblico e la
// dashboard hanno due layout radice separati (serve a dare a <html>
// l'attributo lang giusto per lingua), e un app/layout.tsx li
// trasformerebbe in layout annidati, con due <html> uno dentro
// l'altro.
//
// Chiamando notFound() da dentro il segmento [locale], il 404 vestito
// viene reso con il suo layout: lingua corretta, font, bottone
// WhatsApp. Le rotte reali restano prioritarie su questa: Next
// preferisce sempre la corrispondenza più specifica.
export default function PercorsoNonTrovato() {
  notFound();
}
