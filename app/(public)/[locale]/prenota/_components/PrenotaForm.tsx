"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import type { GiornoOrario } from "@/src/lib/dominio";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import type { ContestoEvento, RispostaExtra } from "@/src/lib/prenotazioni/evento-contesto";
import {
  formatDataLeggibile,
  orariSelezionabili,
  unisciCapienza,
  type EsitoFascia,
} from "@/src/lib/prenotazioni/disponibilita";
import { creaPrenotazione, leggiCapienzaGiorno } from "../_actions";
import { iscrivitiNewsletter } from "@/src/lib/newsletter/actions";

const inputClass =
  "w-full min-h-11 md:min-h-0 bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink placeholder:text-muted/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 focus-visible:border-bordeaux/50";

const labelClass = "block mb-1.5 font-sans text-xs font-medium text-ink";

// Massimo 90 giorni nel calendario: un tetto di comodo per il campo
// data, non un vincolo del locale. Facile da alzare in un solo punto
// se serve prenotare più in anticipo.
const GIORNI_MASSIMI_AVANTI = 90;

function aggiungiGiorni(dataISO: string, giorni: number): string {
  const [y, m, d] = dataISO.split("-").map(Number);
  const data = new Date(Date.UTC(y, m - 1, d));
  data.setUTCDate(data.getUTCDate() + giorni);
  return data.toISOString().slice(0, 10);
}

interface Riepilogo {
  nome: string;
  email: string;
  data: string;
  fascia: string;
  coperti: number;
}

export function PrenotaForm({
  locale,
  settimana,
  dataOdierna,
  oraAttuale,
  contestoEvento,
}: {
  locale: Locale;
  settimana: GiornoOrario[];
  /** "YYYY-MM-DD", calcolata dal server al caricamento della pagina. */
  dataOdierna: string;
  /** "HH:MM", stessa provenienza di dataOdierna. */
  oraAttuale: string;
  contestoEvento: ContestoEvento | null;
}) {
  const t = getDizionario(locale);

  const [nome, setNome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [fascia, setFascia] = useState("");
  const [coperti, setCoperti] = useState(2);
  const [note, setNote] = useState("");
  const [extra, setExtra] = useState<Record<string, string>>({});
  // Honeypot: un utente reale non lo vede né lo raggiunge da tastiera
  // (nascosto fuori schermo, aria-hidden, escluso dal tab order — vedi
  // il campo più sotto), quindi resta sempre vuoto per chi compila il
  // form normalmente. Un bot che compila ogni input che trova nel DOM
  // lo riempie senza saperlo.
  const [sitoWeb, setSitoWeb] = useState("");

  const [capienza, setCapienza] = useState<
    { fascia: string; limiteCoperti: number | null; occupati: number }[]
  >([]);
  const [caricandoCapienza, setCaricandoCapienza] = useState(false);

  const [inviando, setInviando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [confermata, setConfermata] = useState<
    { id: string; riepilogo: Riepilogo } | null
  >(null);

  // Invito post-prenotazione a iscriversi alla newsletter — §5:
  // email/nome precompilati da quanto appena inserito nel form sopra,
  // ma serve un click deliberato su "Iscrivimi" (mai automatico, mai
  // una casella pre-spuntata). Stato indipendente da "confermata": la
  // prenotazione è già conclusa a questo punto, l'iscrizione è
  // un'azione facoltativa separata.
  const [nlNome, setNlNome] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [nlSitoWeb, setNlSitoWeb] = useState("");
  const [nlStato, setNlStato] = useState<"idle" | "inviando" | "fatto" | "errore">("idle");
  const [nlCodice, setNlCodice] = useState<string | null>(null);
  const [nlErrore, setNlErrore] = useState<string | null>(null);

  const orariGiorno = useMemo(
    () => (data ? orariSelezionabili(settimana, data, dataOdierna, oraAttuale) : []),
    [data, settimana, dataOdierna, oraAttuale],
  );

  const esitiFasce: EsitoFascia[] = useMemo(
    () => unisciCapienza(orariGiorno, capienza),
    [orariGiorno, capienza],
  );

  const giornoChiuso = data.length > 0 && orariGiorno.length === 0;
  const tuttoPieno =
    esitiFasce.length > 0 && esitiFasce.every((e) => !e.disponibile);

  // Al cambio di data si rilegge la capienza; scelta di fascia
  // precedente azzerata perché potrebbe non valere più per la nuova
  // data (una fascia disponibile martedì può non esistere mercoledì).
  useEffect(() => {
    setFascia("");
    if (!data || giornoSettimanaChiuso(data)) {
      setCapienza([]);
      return;
    }
    let annullata = false;
    setCaricandoCapienza(true);
    leggiCapienzaGiorno(data)
      .then((righe) => {
        if (!annullata) setCapienza(righe);
      })
      .catch(() => {
        if (!annullata) setCapienza([]);
      })
      .finally(() => {
        if (!annullata) setCaricandoCapienza(false);
      });
    return () => {
      annullata = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function giornoSettimanaChiuso(dataISO: string): boolean {
    return orariSelezionabili(settimana, dataISO, dataOdierna, oraAttuale).length === 0;
  }

  const campiExtra = contestoEvento?.campiExtra ?? [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrore(null);

    if (!nome.trim() || !telefono.trim() || !data || !fascia || coperti < 1) {
      setErrore(t.paginaPrenota.erroreGenerico);
      return;
    }

    setInviando(true);
    try {
      const risposteExtra: RispostaExtra[] | null =
        campiExtra.length > 0
          ? campiExtra
              .map((c) => ({ etichetta: c.etichetta, valore: (extra[c.id] ?? "").trim() }))
              .filter((r) => r.valore.length > 0)
          : null;

      const esito = await creaPrenotazione({
        locale,
        nome: nome.trim(),
        telefono: telefono.trim(),
        email: email.trim() || null,
        data,
        fascia,
        coperti,
        note: note.trim() || null,
        eventoId: contestoEvento?.id ?? null,
        eventoTitolo: contestoEvento?.titolo ?? null,
        risposteExtra: risposteExtra && risposteExtra.length > 0 ? risposteExtra : null,
        honeypot: sitoWeb,
      });

      if (esito.ok) {
        setConfermata({
          id: esito.id,
          riepilogo: { nome: nome.trim(), email: email.trim(), data, fascia, coperti },
        });
        setNlNome(nome.trim());
        setNlEmail(email.trim());
        return;
      }

      if (esito.capienzaEsaurita) {
        setErrore(t.paginaPrenota.erroreCapienza);
        // La fascia appena scelta non è più disponibile: si rilegge
        // la capienza per riflettere lo stato vero, invece di lasciare
        // a schermo un numero di posti residui che non è più corretto.
        leggiCapienzaGiorno(data).then(setCapienza).catch(() => {});
      } else if (esito.messaggio === "RATE_LIMITED") {
        setErrore(t.paginaPrenota.erroreLimiteRichieste);
      } else {
        setErrore(t.paginaPrenota.erroreGenerico);
      }
    } catch {
      setErrore(t.paginaPrenota.erroreGenerico);
    } finally {
      setInviando(false);
    }
  }

  function nuovaPrenotazione() {
    setConfermata(null);
    setNome("");
    setTelefono("");
    setEmail("");
    setData("");
    setFascia("");
    setCoperti(2);
    setNote("");
    setExtra({});
    setSitoWeb("");
    setErrore(null);
    setNlNome("");
    setNlEmail("");
    setNlSitoWeb("");
    setNlStato("idle");
    setNlCodice(null);
    setNlErrore(null);
  }

  async function handleIscrizioneNewsletter() {
    if (!nlEmail.trim() || nlStato === "inviando") return;
    setNlStato("inviando");
    setNlErrore(null);
    try {
      const esito = await iscrivitiNewsletter({
        email: nlEmail.trim(),
        nome: nlNome.trim() || null,
        locale,
        honeypot: nlSitoWeb,
      });

      if (esito.ok) {
        setNlCodice(esito.codice);
        setNlStato("fatto");
      } else if (esito.motivo === "RATE_LIMITED") {
        setNlErrore(t.newsletter.erroreLimite);
        setNlStato("errore");
      } else {
        setNlErrore(t.newsletter.erroreGenerico);
        setNlStato("errore");
      }
    } catch {
      setNlErrore(t.newsletter.erroreGenerico);
      setNlStato("errore");
    }
  }

  if (confermata) {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
          {t.paginaPrenota.confermaTitolo}
        </h2>
        <p className="mt-3 font-sans text-base leading-relaxed text-muted">
          {t.paginaPrenota.confermaTesto}
        </p>

        <div className="mt-6 rounded-[2px] border border-ink/15 p-5">
          <p className="font-sans text-[10px] uppercase tracking-widest text-muted">
            {t.paginaPrenota.confermaRiferimento}
          </p>
          <p className="mt-1 font-mono text-sm text-ink">
            {confermata.id.slice(0, 8).toUpperCase()}
          </p>

          <p className="mt-4 font-sans text-[10px] uppercase tracking-widest text-muted">
            {t.paginaPrenota.confermaRiepilogoTitolo}
          </p>
          <dl className="mt-1 space-y-1">
            <div className="flex justify-between gap-4">
              <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoNome}</dt>
              <dd className="font-sans text-sm text-ink">{confermata.riepilogo.nome}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoData}</dt>
              <dd className="font-sans text-sm text-ink">
                {formatDataLeggibile(confermata.riepilogo.data, locale)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoFascia}</dt>
              <dd className="font-sans text-sm text-ink">{confermata.riepilogo.fascia}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoCoperti}</dt>
              <dd className="font-sans text-sm text-ink">{confermata.riepilogo.coperti}</dd>
            </div>
          </dl>
        </div>

        {nlStato === "fatto" ? (
          <div className="mt-6 rounded-[2px] border border-ink/15 p-5">
            <p className="font-sans text-base text-ink">{t.newsletter.fattoTitolo}</p>
            <p className="mt-3 font-sans text-[10px] uppercase tracking-widest text-muted">
              {t.newsletter.codiceEtichetta}
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-bordeaux">{nlCodice}</p>
            <p className="mt-3 font-sans text-sm text-muted">{t.newsletter.comeUsarlo}</p>
          </div>
        ) : (
          <div className="mt-6 rounded-[2px] border border-ink/15 p-5">
            <p className="font-sans text-base text-ink">
              {t.paginaPrenota.iscrizioneNewsletterTitolo}
            </p>
            <p className="mt-1 font-sans text-sm text-muted">
              {t.paginaPrenota.iscrizioneNewsletterTesto}
            </p>

            {/* Honeypot: stesso pattern del form sopra — invisibile e
                fuori dall'ordine di tabulazione per un utente reale. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
              <label htmlFor="pr-nl-sito-web">Sito web</label>
              <input
                id="pr-nl-sito-web"
                name="sito-web"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={nlSitoWeb}
                onChange={(e) => setNlSitoWeb(e.target.value)}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="pr-nl-nome" className={labelClass}>
                  {t.paginaPrenota.campoNome}
                </label>
                <input
                  id="pr-nl-nome"
                  type="text"
                  value={nlNome}
                  onChange={(e) => setNlNome(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="pr-nl-email" className={labelClass}>
                  {t.paginaPrenota.campoEmail}
                </label>
                <input
                  id="pr-nl-email"
                  type="email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {nlErrore && <p className="mt-2 font-sans text-sm text-bordeaux">{nlErrore}</p>}

            <Button
              type="button"
              variant="primary"
              className="mt-4"
              disabled={nlStato === "inviando" || !nlEmail.trim()}
              onClick={handleIscrizioneNewsletter}
            >
              {nlStato === "inviando" ? t.newsletter.invio : t.cta.iscriviti}
            </Button>
          </div>
        )}

        <button
          type="button"
          onClick={nuovaPrenotazione}
          className="mt-6 inline-flex min-h-11 items-center font-sans text-sm text-bordeaux underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux md:min-h-0"
        >
          {t.paginaPrenota.nuovaPrenotazione}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {/* Honeypot anti-spam: fuori schermo (non display:none, che
          alcuni bot riconoscono e ignorano) e fuori dall'albero di
          accessibilità (aria-hidden, tabIndex=-1) — un utente reale,
          anche da tastiera o lettore di schermo, non lo incontra mai.
          autoComplete="off" evita che il browser lo compili da solo
          per un utente reale con l'autofill. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="pr-sito-web">Sito web</label>
        <input
          id="pr-sito-web"
          name="sito-web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={sitoWeb}
          onChange={(e) => setSitoWeb(e.target.value)}
        />
      </div>

      {contestoEvento && (
        <p className="rounded-[2px] border border-gold bg-gold/25 px-3 py-2 font-sans text-sm text-dark">
          {t.paginaPrenota.perEvento(contestoEvento.titolo)}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pr-nome" className={labelClass}>
            {t.paginaPrenota.campoNome}
          </label>
          <input
            id="pr-nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="pr-telefono" className={labelClass}>
            {t.paginaPrenota.campoTelefono}
          </label>
          <input
            id="pr-telefono"
            type="tel"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="pr-email" className={labelClass}>
          {t.paginaPrenota.campoEmail}
        </label>
        <input
          id="pr-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <p className="mt-1 font-sans text-xs text-muted">{t.paginaPrenota.campoEmailNota}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pr-data" className={labelClass}>
            {t.paginaPrenota.campoData}
          </label>
          <input
            id="pr-data"
            type="date"
            required
            min={dataOdierna}
            max={aggiungiGiorni(dataOdierna, GIORNI_MASSIMI_AVANTI)}
            value={data}
            onChange={(e) => setData(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="pr-fascia" className={labelClass}>
            {t.paginaPrenota.campoFascia}
          </label>
          <select
            id="pr-fascia"
            required
            disabled={!data || giornoChiuso || orariGiorno.length === 0}
            value={fascia}
            onChange={(e) => setFascia(e.target.value)}
            className={inputClass}
          >
            <option value="">
              {!data
                ? t.paginaPrenota.fasciaScegliData
                : giornoChiuso
                  ? t.paginaPrenota.fasciaChiuso
                  : caricandoCapienza
                    ? t.paginaPrenota.fasciaCaricamento
                    : orariGiorno.length === 0
                      ? t.paginaPrenota.fasciaNessunOrario
                      : ""}
            </option>
            {esitiFasce.map((e) => (
              <option key={e.ora} value={e.ora} disabled={!e.disponibile}>
                {e.ora}
                {!e.disponibile
                  ? ` — ${t.paginaPrenota.fasciaPiena}`
                  : e.postiResidui != null
                    ? ` — ${t.paginaPrenota.fasciaPostiResidui(e.postiResidui)}`
                    : ""}
              </option>
            ))}
          </select>
          {data && !giornoChiuso && tuttoPieno && (
            <p className="mt-1 font-sans text-xs text-bordeaux">
              {t.paginaPrenota.fasciaTuttoPieno}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="pr-coperti" className={labelClass}>
          {t.paginaPrenota.campoCoperti}
        </label>
        <input
          id="pr-coperti"
          type="number"
          min={1}
          required
          value={coperti}
          onChange={(e) => setCoperti(Math.max(1, Number(e.target.value) || 1))}
          className={`${inputClass} sm:w-32`}
        />
      </div>

      <div>
        <label htmlFor="pr-note" className={labelClass}>
          {t.paginaPrenota.campoNote}
        </label>
        <textarea
          id="pr-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.paginaPrenota.campoNotePlaceholder}
          className={inputClass}
        />
      </div>

      {campiExtra.map((campo) => (
        <div key={campo.id}>
          <label htmlFor={`pr-extra-${campo.id}`} className={labelClass}>
            {campo.etichetta}
          </label>
          <input
            id={`pr-extra-${campo.id}`}
            type="text"
            value={extra[campo.id] ?? ""}
            onChange={(e) => setExtra((prev) => ({ ...prev, [campo.id]: e.target.value }))}
            className={inputClass}
          />
        </div>
      ))}

      {errore && <p className="font-sans text-sm text-bordeaux">{errore}</p>}

      <Button type="submit" variant="primary" disabled={inviando}>
        {inviando ? t.paginaPrenota.inviando : t.paginaPrenota.invia}
      </Button>
    </form>
  );
}
