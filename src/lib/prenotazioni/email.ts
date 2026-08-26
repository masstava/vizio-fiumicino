import { clientResend, MITTENTE_PRENOTAZIONI } from "@/src/lib/email/resend";
import { TITOLARE } from "@/src/lib/legale";
import { SITE_URL } from "@/src/lib/site-url";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { formatDataLeggibile } from "@/src/lib/prenotazioni/disponibilita";
import type { RispostaExtra } from "@/src/lib/prenotazioni/evento-contesto";

// =============================================================
// Email di prenotazione — §21 passo 3
// =============================================================
// Inviate DOPO che crea_prenotazione ha già creato la riga: l'email è
// una notifica, non una condizione per la prenotazione. Ogni funzione
// qui sotto intercetta i propri errori e li logga — non li rilancia
// mai. Chi chiama (le _actions.ts del form) non deve avvolgere queste
// chiamate in un try/catch per stare tranquillo: il contratto è "non
// lancia", punto.

export interface DatiEmailPrenotazione {
  id: string;
  tokenGestione: string;
  locale: Locale;
  nome: string;
  telefono: string;
  email: string | null;
  /** "YYYY-MM-DD" */
  data: string;
  /** "HH:MM" */
  fascia: string;
  coperti: number;
  note: string | null;
  eventoTitolo: string | null;
  risposteExtra: RispostaExtra[] | null;
}

/**
 * Invia entrambe le email (cliente + staff) per una prenotazione già
 * creata. Le due chiamate sono indipendenti — partono insieme — e
 * nessuna delle due può far fallire questa funzione: un errore
 * nell'una non deve impedire il tentativo sull'altra.
 */
export async function inviaEmailPrenotazione(dati: DatiEmailPrenotazione): Promise<void> {
  await Promise.all([inviaEmailConfermaCliente(dati), inviaEmailNotificaStaff(dati)]);
}

// ---------------------------------------------------------------
// Cliente
// ---------------------------------------------------------------

async function inviaEmailConfermaCliente(dati: DatiEmailPrenotazione): Promise<void> {
  // L'email è facoltativa nel form: nessun indirizzo non è un errore.
  if (!dati.email) return;

  const resend = clientResend();
  if (!resend) {
    console.error(
      "[inviaEmailConfermaCliente] RESEND_API_KEY assente: email non inviata",
      { prenotazioneId: dati.id },
    );
    return;
  }

  const t = getDizionario(dati.locale).emailPrenotazione;
  const riferimento = dati.id.slice(0, 8).toUpperCase();
  const linkGestione = `${SITE_URL}${localizedPath("/gestisci-prenotazione", dati.locale)}?token=${dati.tokenGestione}`;

  try {
    const { error } = await resend.emails.send({
      from: MITTENTE_PRENOTAZIONI,
      to: dati.email,
      subject: t.oggetto(riferimento),
      html: htmlEmailCliente(dati, riferimento, linkGestione),
    });

    if (error) {
      console.error("[inviaEmailConfermaCliente] invio fallito:", error, {
        prenotazioneId: dati.id,
      });
    }
  } catch (err) {
    console.error("[inviaEmailConfermaCliente] eccezione durante l'invio:", err, {
      prenotazioneId: dati.id,
    });
  }
}

function htmlEmailCliente(
  dati: DatiEmailPrenotazione,
  riferimento: string,
  linkGestione: string,
): string {
  const t = getDizionario(dati.locale).emailPrenotazione;
  const dataLeggibile = formatDataLeggibile(dati.data, dati.locale);

  const righeRiepilogo = [
    [t.labelData, dataLeggibile],
    [t.labelFascia, dati.fascia],
    [t.labelCoperti, String(dati.coperti)],
    ...(dati.eventoTitolo ? [[t.labelEvento, dati.eventoTitolo]] : []),
  ];

  const righeHtml = righeRiepilogo
    .map(
      ([etichetta, valore]) => `
        <tr>
          <td style="padding:6px 0;color:#6b6b6b;font-size:14px;">${escapeHtml(etichetta)}</td>
          <td style="padding:6px 0;color:#1a1a1a;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(valore)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="background:#f7f2e9;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:2px;overflow:hidden;">
        <div style="background:#1a1a1a;padding:24px 28px;">
          <p style="margin:0;color:#f5efe4;font-size:20px;letter-spacing:0.02em;">Vizio Bistrot</p>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 4px;color:#1a1a1a;font-size:16px;">${escapeHtml(t.saluto(dati.nome))}</p>
          <p style="margin:0 0 20px;color:#1a1a1a;font-size:15px;line-height:1.5;">${escapeHtml(t.corpoIntro)}</p>

          <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5ddcf;border-bottom:1px solid #e5ddcf;">
            ${righeHtml}
          </table>

          <p style="margin:20px 0 0;color:#6b6b6b;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(t.labelRiferimento)}</p>
          <p style="margin:2px 0 24px;color:#8b1a1a;font-size:16px;font-family:monospace;">${escapeHtml(riferimento)}</p>

          <p style="margin:0 0 8px;color:#1a1a1a;font-size:14px;">${escapeHtml(t.gestisciTesto)}</p>
          <a href="${linkGestione}" style="display:inline-block;background:#8b1a1a;color:#f5efe4;padding:10px 20px;border-radius:2px;text-decoration:none;font-size:14px;">${escapeHtml(t.gestisciLink)}</a>

          <p style="margin:28px 0 0;color:#1a1a1a;font-size:14px;">${escapeHtml(t.firma)}<br>Vizio Bistrot</p>
        </div>
      </div>
    </div>`;
}

// ---------------------------------------------------------------
// Staff
// ---------------------------------------------------------------
// Avviso operativo, non un'email al pubblico: sempre in italiano
// (indipendentemente dalla lingua scelta dal cliente) e senza la cura
// editoriale della email cliente, come da richiesta.

async function inviaEmailNotificaStaff(dati: DatiEmailPrenotazione): Promise<void> {
  const resend = clientResend();
  if (!resend) {
    console.error(
      "[inviaEmailNotificaStaff] RESEND_API_KEY assente: notifica non inviata",
      { prenotazioneId: dati.id },
    );
    return;
  }

  const dataLeggibile = formatDataLeggibile(dati.data, "it");
  const riferimento = dati.id.slice(0, 8).toUpperCase();

  const righe = [
    `Rif. ${riferimento}`,
    `Nome: ${dati.nome}`,
    `Telefono: ${dati.telefono}`,
    dati.email ? `Email: ${dati.email}` : null,
    `Data: ${dataLeggibile}`,
    `Orario: ${dati.fascia}`,
    `Coperti: ${dati.coperti}`,
    dati.eventoTitolo ? `Evento: ${dati.eventoTitolo}` : null,
    dati.note ? `Note/allergie: ${dati.note}` : null,
    ...(dati.risposteExtra ?? []).map((r) => `${r.etichetta}: ${r.valore}`),
  ].filter((riga): riga is string => riga !== null);

  try {
    const { error } = await resend.emails.send({
      from: MITTENTE_PRENOTAZIONI,
      to: TITOLARE.email,
      subject: `Nuova prenotazione — ${dati.nome}, ${dataLeggibile}, ${dati.fascia}, ${dati.coperti} coperti`,
      text: righe.join("\n"),
    });

    if (error) {
      console.error("[inviaEmailNotificaStaff] invio fallito:", error, {
        prenotazioneId: dati.id,
      });
    }
  } catch (err) {
    console.error("[inviaEmailNotificaStaff] eccezione durante l'invio:", err, {
      prenotazioneId: dati.id,
    });
  }
}

function escapeHtml(testo: string): string {
  return testo
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
