import { clientResend, MITTENTE_PRENOTAZIONI } from "@/src/lib/email/resend";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// Email di benvenuto newsletter
// =============================================================
// Stesso contratto delle email di prenotazione (src/lib/prenotazioni/
// email.ts): non lancia mai. Chi chiama (iscrivitiNewsletter) non deve
// avvolgere questa chiamata in un try/catch per stare tranquillo — il
// codice sconto è già stato generato e restituito all'utente prima di
// questa chiamata, l'email è solo un promemoria scritto, non una
// condizione dell'iscrizione.

export interface DatiEmailBenvenutoNewsletter {
  email: string;
  /** Solo per personalizzare il saluto — non persistito in coupon. */
  nome: string | null;
  codice: string;
  locale: Locale;
}

export async function inviaEmailBenvenutoNewsletter(
  dati: DatiEmailBenvenutoNewsletter,
): Promise<void> {
  const resend = clientResend();
  if (!resend) {
    console.error(
      "[inviaEmailBenvenutoNewsletter] RESEND_API_KEY assente: email non inviata",
      { email: dati.email },
    );
    return;
  }

  const t = getDizionario(dati.locale).emailNewsletter;

  try {
    const { error } = await resend.emails.send({
      from: MITTENTE_PRENOTAZIONI,
      to: dati.email,
      subject: t.oggetto,
      html: htmlEmailBenvenuto(dati, t),
    });

    if (error) {
      console.error("[inviaEmailBenvenutoNewsletter] invio fallito:", error, {
        email: dati.email,
      });
    }
  } catch (err) {
    console.error("[inviaEmailBenvenutoNewsletter] eccezione durante l'invio:", err, {
      email: dati.email,
    });
  }
}

function htmlEmailBenvenuto(
  dati: DatiEmailBenvenutoNewsletter,
  t: ReturnType<typeof getDizionario>["emailNewsletter"],
): string {
  return `
    <div style="background:#f7f2e9;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:2px;overflow:hidden;">
        <div style="background:#1a1a1a;padding:24px 28px;">
          <p style="margin:0;color:#f5efe4;font-size:20px;letter-spacing:0.02em;">Vizio Bistrot</p>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 4px;color:#1a1a1a;font-size:16px;">${escapeHtml(t.saluto(dati.nome))}</p>
          <p style="margin:0 0 20px;color:#1a1a1a;font-size:15px;line-height:1.5;">${escapeHtml(t.corpoIntro)}</p>

          <p style="margin:0;color:#6b6b6b;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(t.labelCodice)}</p>
          <p style="margin:2px 0 20px;color:#8b1a1a;font-size:24px;font-family:monospace;font-weight:bold;letter-spacing:0.05em;">${escapeHtml(dati.codice)}</p>

          <p style="margin:0 0 12px;color:#1a1a1a;font-size:14px;line-height:1.5;">${escapeHtml(t.comeUsarlo)}</p>
          <p style="margin:0;color:#6b6b6b;font-size:13px;line-height:1.5;">${escapeHtml(t.anteprimaSerate)}</p>

          <p style="margin:28px 0 0;color:#1a1a1a;font-size:14px;">${escapeHtml(t.firma)}<br>Vizio Bistrot</p>
        </div>
      </div>
    </div>`;
}

function escapeHtml(testo: string): string {
  return testo
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
