"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import { StatusBadge } from "@/src/components/admin/StatusBadge";
import { TopbarSlot } from "@/src/components/admin/TopbarSlot";
import {
  creaCategoria,
  creaMacro,
  eliminaCategoria,
  eliminaMacro,
  riordinaCategorie,
  riordinaMacro,
  rinominaCategoria,
  rinominaMacro,
  spostaCategoria,
} from "../_actions";
import { pulisciNomi, type Esito, type NomiInput } from "../_lib/nomi";
import type { MacroEditor, SottoCategoriaEditor } from "../_lib/tipi";

const fieldClass =
  "min-h-11 md:pointer-fine:min-h-0 w-full bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50 disabled:opacity-40";

const linkClass =
  "inline-flex min-h-11 items-center font-sans text-sm text-admin-brick hover:opacity-70 transition-opacity disabled:opacity-40 md:pointer-fine:min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60";

const linkSecondarioClass =
  "inline-flex min-h-11 items-center font-sans text-sm text-admin-text-2 hover:text-admin-brick transition-colors disabled:opacity-40 md:pointer-fine:min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60";

const secondarioClass =
  "inline-flex min-h-11 items-center rounded-[2px] border border-admin-line bg-admin-surface px-4 font-sans text-sm text-admin-text hover:bg-admin-canvas transition-colors disabled:opacity-40 md:pointer-fine:min-h-0 md:pointer-fine:py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60";

const ETICHETTA_RUOLO = { cucina: "Cucina", bar: "Bar" } as const;

// Quale modulo è aperto: uno solo alla volta, così non restano mezzi
// compilati in giro per la pagina.
type Modulo =
  | { tipo: "nuova-macro" }
  | { tipo: "rinomina-macro"; id: string }
  | { tipo: "nuova-categoria"; macroId: string }
  | { tipo: "rinomina-categoria"; id: string };

export function EditorCategorie({ macro: iniziali }: { macro: MacroEditor[] }) {
  const router = useRouter();
  const [lista, setLista] = useState(iniziali);
  const [modulo, setModulo] = useState<Modulo | null>(null);
  // Errori di eliminazione/spostamento, per riga ("m:<id>" / "c:<id>").
  const [errori, setErrori] = useState<Record<string, string>>({});
  const [inCorso, setInCorso] = useState<string | null>(null);

  // Dopo ogni modifica le action rivalidano la pagina: i dati freschi
  // del server (conteggi compresi) sostituiscono lo stato locale.
  useEffect(() => setLista(iniziali), [iniziali]);

  // Stessi sensori della lista piatti (§ Tocco in
  // DASHBOARD_DESIGN_SYSTEM.md): MouseSensor e non PointerSensor, che
  // risponderebbe anche al dito scavalcando il delay del TouchSensor.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function impostaErrore(chiave: string, testo: string | null) {
    setErrori((prev) => {
      const next = { ...prev };
      if (testo) next[chiave] = testo;
      else delete next[chiave];
      return next;
    });
  }

  async function salvaModulo(azione: () => Promise<Esito>): Promise<Esito> {
    const esito = await azione();
    if (esito.ok) {
      setModulo(null);
      router.refresh();
    }
    return esito;
  }

  async function elimina(chiave: string, nome: string, inUso: boolean, azione: () => Promise<Esito>) {
    // In uso: niente conferma — il server risponde col blocco e il
    // conteggio aggiornato. Libera: conferma, poi il server ricontrolla.
    if (!inUso && !window.confirm(`Eliminare "${nome}"? L'operazione non è reversibile.`)) return;
    impostaErrore(chiave, null);
    setInCorso(chiave);
    try {
      const esito = await azione();
      if (esito.ok) router.refresh();
      else impostaErrore(chiave, esito.errore);
    } catch (err) {
      console.error(err);
      impostaErrore(chiave, "Errore durante l'eliminazione. Riprova.");
    } finally {
      setInCorso(null);
    }
  }

  async function sposta(categoria: SottoCategoriaEditor, macroId: string) {
    const chiave = `c:${categoria.id}`;
    impostaErrore(chiave, null);
    setInCorso(chiave);
    try {
      const esito = await spostaCategoria(categoria.id, macroId);
      if (esito.ok) router.refresh();
      else impostaErrore(chiave, esito.errore);
    } catch (err) {
      console.error(err);
      impostaErrore(chiave, "Errore durante lo spostamento. Riprova.");
    } finally {
      setInCorso(null);
    }
  }

  async function fineTrascinamentoMacro(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const da = lista.findIndex((m) => m.id === active.id);
    const a = lista.findIndex((m) => m.id === over.id);
    if (da === -1 || a === -1) return;

    const precedente = lista;
    const nuova = arrayMove(lista, da, a);
    setLista(nuova); // ottimistico
    try {
      await riordinaMacro(nuova.map((m) => m.id));
    } catch (err) {
      setLista(precedente);
      console.error(err);
      window.alert("Errore durante il riordino. Riprova.");
    }
  }

  async function fineTrascinamentoCategorie(macroId: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const macro = lista.find((m) => m.id === macroId);
    if (!macro) return;
    const da = macro.categorie.findIndex((c) => c.id === active.id);
    const a = macro.categorie.findIndex((c) => c.id === over.id);
    if (da === -1 || a === -1) return;

    const precedente = lista;
    const categorie = arrayMove(macro.categorie, da, a);
    setLista(lista.map((m) => (m.id === macroId ? { ...m, categorie } : m)));
    try {
      await riordinaCategorie(macroId, categorie.map((c) => c.id));
    } catch (err) {
      setLista(precedente);
      console.error(err);
      window.alert("Errore durante il riordino. Riprova.");
    }
  }

  return (
    <div>
      <TopbarSlot order={2}>
        <Button variant="primary" onClick={() => setModulo({ tipo: "nuova-macro" })}>
          + Nuova macro-categoria
        </Button>
      </TopbarSlot>

      <p className="mb-6 max-w-2xl font-sans text-sm text-admin-text-2">
        Le macro-categorie sono le schede del menu (Da mangiare, Bar…), le sotto-categorie i
        gruppi di piatti al loro interno. Trascina dalla maniglia per cambiare l&apos;ordine con
        cui appaiono sul sito. Le etichette <strong className="font-medium">Cucina</strong> e{" "}
        <strong className="font-medium">Bar</strong> indicano quali macro alimentano la home e la
        vetrina del bar: restano valide anche se le rinomini.
      </p>

      {modulo?.tipo === "nuova-macro" && (
        <div className="mb-6 rounded-[2px] border border-admin-line bg-admin-surface p-4">
          <h2 className="mb-3 font-sans text-sm font-medium text-admin-text">Nuova macro-categoria</h2>
          <FormNomi
            idBase="nuova-macro"
            iniziale={{ nome: "", nomeEn: "" }}
            etichettaSalva="Crea"
            onSalva={(nomi) => salvaModulo(() => creaMacro(nomi))}
            onAnnulla={() => setModulo(null)}
          />
        </div>
      )}

      {lista.length === 0 ? (
        <p className="font-sans text-sm text-admin-text-2">
          Nessuna macro-categoria. Usa &quot;+ Nuova macro-categoria&quot; per iniziare.
        </p>
      ) : (
        <DndContext
          // id deterministico: evita il mismatch di hydration
          // sull'aria-describedby (v. MenuListClient).
          id="categorie-macro-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={fineTrascinamentoMacro}
        >
          <SortableContext items={lista.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {lista.map((m) => {
                const chiave = `m:${m.id}`;
                const inRinomina = modulo?.tipo === "rinomina-macro" && modulo.id === m.id;
                return (
                  <Ordinabile
                    key={m.id}
                    id={m.id}
                    etichetta={m.nome}
                    className="rounded-[2px] border border-admin-line bg-admin-surface"
                  >
                    {(maniglia) => (
                      <>
                        <div className="flex items-stretch border-b border-admin-line">
                          {maniglia}
                          <div className="flex flex-1 min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 pr-4">
                            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 py-1">
                              <h2 className="font-serif text-xl font-medium text-admin-text">{m.nome}</h2>
                              {m.ruolo && <StatusBadge tono="grigio">{ETICHETTA_RUOLO[m.ruolo]}</StatusBadge>}
                              <NomeInglese nomeEn={m.nomeEn} />
                            </div>
                            {!inRinomina && (
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  className={linkClass}
                                  onClick={() => setModulo({ tipo: "rinomina-macro", id: m.id })}
                                >
                                  Rinomina
                                </button>
                                <button
                                  type="button"
                                  className={linkSecondarioClass}
                                  disabled={inCorso === chiave}
                                  onClick={() =>
                                    elimina(chiave, m.nome, m.ruolo !== null || m.categorie.length > 0, () =>
                                      eliminaMacro(m.id),
                                    )
                                  }
                                >
                                  Elimina
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {(errori[chiave] || inRinomina) && (
                          <div className="border-b border-admin-line px-4">
                            {errori[chiave] && <Avviso testo={errori[chiave]} />}
                            {inRinomina && (
                              <div className="py-4">
                                <FormNomi
                                  idBase={`rinomina-${m.id}`}
                                  iniziale={{ nome: m.nome, nomeEn: m.nomeEn ?? "" }}
                                  etichettaSalva="Salva"
                                  onSalva={(nomi) => salvaModulo(() => rinominaMacro(m.id, nomi))}
                                  onAnnulla={() => setModulo(null)}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        <div className="py-2 pr-4">
                          {m.categorie.length === 0 ? (
                            <p className="py-2 pl-4 font-sans text-sm text-admin-text-2">Nessuna sotto-categoria.</p>
                          ) : (
                            <DndContext
                              id={`categorie-dnd-${m.id}`}
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(e) => fineTrascinamentoCategorie(m.id, e)}
                            >
                              <SortableContext
                                items={m.categorie.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="divide-y divide-admin-line">
                                  {m.categorie.map((c) => (
                                    <RigaCategoria
                                      key={c.id}
                                      categoria={c}
                                      macroId={m.id}
                                      altreMacro={lista.filter((x) => x.id !== m.id)}
                                      inRinomina={modulo?.tipo === "rinomina-categoria" && modulo.id === c.id}
                                      inCorso={inCorso === `c:${c.id}`}
                                      errore={errori[`c:${c.id}`]}
                                      onRinomina={() => setModulo({ tipo: "rinomina-categoria", id: c.id })}
                                      onSalvaNomi={(nomi) => salvaModulo(() => rinominaCategoria(c.id, nomi))}
                                      onAnnulla={() => setModulo(null)}
                                      onSposta={(macroId) => sposta(c, macroId)}
                                      onElimina={() =>
                                        elimina(`c:${c.id}`, c.nome, c.piatti > 0, () => eliminaCategoria(c.id))
                                      }
                                    />
                                  ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          )}

                          {modulo?.tipo === "nuova-categoria" && modulo.macroId === m.id ? (
                            <div className="border-t border-admin-line py-4 pl-4">
                              <h3 className="mb-3 font-sans text-sm font-medium text-admin-text">
                                Nuova sotto-categoria in {m.nome}
                              </h3>
                              <FormNomi
                                idBase={`nuova-cat-${m.id}`}
                                iniziale={{ nome: "", nomeEn: "" }}
                                etichettaSalva="Crea"
                                onSalva={(nomi) => salvaModulo(() => creaCategoria(m.id, nomi))}
                                onAnnulla={() => setModulo(null)}
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              className={cn(linkClass, "mt-1 ml-4")}
                              onClick={() => setModulo({ tipo: "nuova-categoria", macroId: m.id })}
                            >
                              + Aggiungi sotto-categoria
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </Ordinabile>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function RigaCategoria({
  categoria: c,
  macroId,
  altreMacro,
  inRinomina,
  inCorso,
  errore,
  onRinomina,
  onSalvaNomi,
  onAnnulla,
  onSposta,
  onElimina,
}: {
  categoria: SottoCategoriaEditor;
  macroId: string;
  altreMacro: MacroEditor[];
  inRinomina: boolean;
  inCorso: boolean;
  errore: string | undefined;
  onRinomina: () => void;
  onSalvaNomi: (nomi: NomiInput) => Promise<Esito>;
  onAnnulla: () => void;
  onSposta: (macroId: string) => void;
  onElimina: () => void;
}) {
  const idSposta = `sposta-${c.id}`;
  return (
    <Ordinabile
      id={c.id}
      etichetta={c.nome}
      className="bg-admin-surface hover:bg-admin-canvas transition-colors"
    >
      {(maniglia) => (
        <>
          <div className="flex items-stretch">
            {maniglia}
            <div className="flex flex-1 min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5 py-1">
                <span className="font-sans text-sm font-medium text-admin-text">{c.nome}</span>
                <NomeInglese nomeEn={c.nomeEn} />
                <span className="font-sans text-xs text-admin-text-2">
                  {c.piatti === 1 ? "1 piatto" : `${c.piatti} piatti`}
                </span>
              </div>
              {!inRinomina && (
                // Sotto sm: selettore a tutta larghezza, poi Rinomina ed
                // Elimina affiancati sulla riga sotto (a 380px non ci
                // stanno tutti e tre in fila, ed Elimina finiva da solo).
                <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 sm:w-auto">
                  {altreMacro.length > 0 && (
                    <>
                      <label htmlFor={idSposta} className="sr-only">
                        Sposta {c.nome} in un&apos;altra macro-categoria
                      </label>
                      <select
                        id={idSposta}
                        value=""
                        disabled={inCorso}
                        onChange={(e) => e.target.value && e.target.value !== macroId && onSposta(e.target.value)}
                        className={cn(fieldClass, "py-1.5 sm:w-40")}
                      >
                        <option value="">Sposta in…</option>
                        {altreMacro.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nome}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                  <button type="button" className={linkClass} onClick={onRinomina}>
                    Rinomina
                  </button>
                  <button type="button" className={linkSecondarioClass} disabled={inCorso} onClick={onElimina}>
                    Elimina
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Sotto la riga, allineati al testo (larghezza della
              maniglia): la maniglia resta centrata sulla sola riga. */}
          {(errore || inRinomina) && (
            <div className="pb-3 pl-11 md:pointer-fine:pl-[38px]">
              {errore && <Avviso testo={errore} />}
              {inRinomina && (
                <div className="pt-1">
                  <FormNomi
                    idBase={`rinomina-${c.id}`}
                    iniziale={{ nome: c.nome, nomeEn: c.nomeEn ?? "" }}
                    etichettaSalva="Salva"
                    onSalva={onSalvaNomi}
                    onAnnulla={onAnnulla}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Ordinabile>
  );
}

function NomeInglese({ nomeEn }: { nomeEn: string | null }) {
  return (
    <span className="font-sans text-xs text-admin-text-2">
      EN: {nomeEn ?? <span className="italic">come in italiano</span>}
    </span>
  );
}

function Avviso({ testo }: { testo: string }) {
  return (
    <p role="alert" className="my-2 max-w-2xl rounded-[2px] border border-admin-brick/40 bg-admin-brick-wash px-3 py-2 font-sans text-sm text-admin-brick">
      {testo}
    </p>
  );
}

// Riga/pannello riordinabile con maniglia — stessa maniglia
// di SortableDishRow (44px di larghezza al dito, touch-manipulation:
// uno swipe rapido scorre la pagina, solo la pressione prolungata del
// TouchSensor avvia il riordino).
function Ordinabile({
  id,
  etichetta,
  className,
  children,
}: {
  id: string;
  etichetta: string;
  className?: string;
  /** Riceve la maniglia, da collocare dove serve (riga o intestazione). */
  children: (maniglia: React.ReactNode) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : undefined,
        position: "relative",
      }}
      className={className}
    >
      {children(
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Riordina ${etichetta}`}
          className={cn(
            "flex-shrink-0 flex items-center justify-center min-w-11 px-2 text-admin-text-2 hover:text-admin-text md:pointer-fine:min-w-0 md:pointer-fine:px-3",
            "cursor-grab active:cursor-grabbing touch-manipulation select-none",
            "focus-visible:outline-none focus-visible:text-admin-brick",
          )}
        >
          <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
            <circle cx="4" cy="4" r="1.6" fill="currentColor" />
            <circle cx="10" cy="4" r="1.6" fill="currentColor" />
            <circle cx="4" cy="11" r="1.6" fill="currentColor" />
            <circle cx="10" cy="11" r="1.6" fill="currentColor" />
            <circle cx="4" cy="18" r="1.6" fill="currentColor" />
            <circle cx="10" cy="18" r="1.6" fill="currentColor" />
          </svg>
        </button>,
      )}
    </div>
  );
}

// Modulo nome IT (obbligatorio) + EN (facoltativo). La validazione qui
// è solo per un riscontro immediato: quella che conta la ripete la
// server action.
function FormNomi({
  idBase,
  iniziale,
  etichettaSalva,
  onSalva,
  onAnnulla,
}: {
  idBase: string;
  iniziale: NomiInput;
  etichettaSalva: string;
  onSalva: (nomi: NomiInput) => Promise<Esito>;
  onAnnulla: () => void;
}) {
  const [nome, setNome] = useState(iniziale.nome);
  const [nomeEn, setNomeEn] = useState(iniziale.nomeEn);
  const [errore, setErrore] = useState<string | null>(null);
  const [salvataggio, setSalvataggio] = useState(false);

  async function invia(e: React.FormEvent) {
    e.preventDefault();
    const controllo = pulisciNomi({ nome, nomeEn });
    if ("errore" in controllo) {
      setErrore(controllo.errore);
      return;
    }
    setErrore(null);
    setSalvataggio(true);
    try {
      const esito = await onSalva({ nome, nomeEn });
      if (!esito.ok) setErrore(esito.errore);
    } catch (err) {
      console.error(err);
      setErrore("Errore durante il salvataggio. Riprova.");
    } finally {
      setSalvataggio(false);
    }
  }

  const idErrore = `${idBase}-errore`;

  return (
    <form
      onSubmit={invia}
      onKeyDown={(e) => {
        if (e.key === "Escape") onAnnulla();
      }}
      noValidate
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idBase}-it`} className="mb-1 block font-sans text-xs text-admin-text-2">
            Nome in italiano <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${idBase}-it`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            aria-required="true"
            aria-invalid={errore ? true : undefined}
            aria-describedby={errore ? idErrore : undefined}
            maxLength={80}
            autoFocus
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={`${idBase}-en`} className="mb-1 block font-sans text-xs text-admin-text-2">
            Nome in inglese (facoltativo)
          </label>
          <input
            id={`${idBase}-en`}
            value={nomeEn}
            onChange={(e) => setNomeEn(e.target.value)}
            maxLength={80}
            placeholder="Se vuoto, si usa il nome italiano"
            className={fieldClass}
          />
        </div>
      </div>
      {errore && (
        <p id={idErrore} role="alert" className="mt-2 font-sans text-sm text-admin-brick">
          {errore}
        </p>
      )}
      <div className="mt-3 flex items-center gap-4">
        <button type="submit" disabled={salvataggio} className={secondarioClass}>
          {salvataggio ? "Salvataggio…" : etichettaSalva}
        </button>
        <button type="button" onClick={onAnnulla} className={linkSecondarioClass}>
          Annulla
        </button>
      </div>
    </form>
  );
}
