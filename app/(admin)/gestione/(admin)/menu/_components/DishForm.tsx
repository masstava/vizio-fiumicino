"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@/src/components/ui/Button";
import { Switch } from "@/src/components/ui/Switch";
import { DishRow } from "@/src/components/ui/DishRow";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { savePiatto } from "../_actions";
import type {
  AllergeneOption,
  BadgeInput,
  CategoriaGroupOption,
} from "./types";

interface DishFormInitialData {
  categoria_id: string;
  nome: string;
  nome_en: string;
  descrizione: string;
  descrizione_en: string;
  prezzo: string;
  prezzo_variabile: boolean;
  disponibile: boolean;
  foto_url: string | null;
  allergeni: number[];
  badges: BadgeInput[];
  in_evidenza: boolean;
  in_evidenza_ordine: number;
  anteprima_home: boolean;
  anteprima_home_ordine: number;
}

interface DishFormProps {
  mode: "create" | "edit";
  piattoId?: string;
  categorieGrouped: CategoriaGroupOption[];
  allergeniList: AllergeneOption[];
  otherEvidenzaCount: number;
  /** Quanti ALTRI piatti sono già selezionati per l'anteprima home. */
  otherAnteprimaCount: number;
  initialData?: DishFormInitialData;
}

const DARK_MACRO_NAMES = new Set(["Bar & Cocktail", "Experience"]);

const inputClass =
  "w-full bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-bordeaux/50 transition-colors";

export function DishForm({
  mode,
  piattoId,
  categorieGrouped,
  allergeniList,
  otherEvidenzaCount,
  otherAnteprimaCount,
  initialData,
}: DishFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstCategoriaId = categorieGrouped[0]?.categorie[0]?.id ?? "";

  const [categoriaId, setCategoriaId] = useState(
    initialData?.categoria_id ?? firstCategoriaId,
  );
  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [nomeEn, setNomeEn] = useState(initialData?.nome_en ?? "");
  const [descrizione, setDescrizione] = useState(initialData?.descrizione ?? "");
  const [descrizioneEn, setDescrizioneEn] = useState(
    initialData?.descrizione_en ?? "",
  );
  const [prezzo, setPrezzo] = useState(initialData?.prezzo ?? "");
  const [prezzoVariabile, setPrezzoVariabile] = useState(
    initialData?.prezzo_variabile ?? false,
  );
  const [disponibile, setDisponibile] = useState(
    initialData?.disponibile ?? true,
  );
  const [fotoUrl, setFotoUrl] = useState<string | null>(
    initialData?.foto_url ?? null,
  );
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(null);
  const [allergeniSelected, setAllergeniSelected] = useState<Set<number>>(
    new Set(initialData?.allergeni ?? []),
  );
  const [badges, setBadges] = useState<BadgeInput[]>(
    initialData?.badges ?? [],
  );
  const [inEvidenza, setInEvidenza] = useState(
    initialData?.in_evidenza ?? false,
  );
  const [inEvidenzaOrdine, setInEvidenzaOrdine] = useState(
    initialData?.in_evidenza_ordine ?? 0,
  );
  const [anteprimaHome, setAnteprimaHome] = useState(
    initialData?.anteprima_home ?? false,
  );
  const [anteprimaHomeOrdine, setAnteprimaHomeOrdine] = useState(
    initialData?.anteprima_home_ordine ?? 0,
  );
  const [evidenzaBlockedMessage, setEvidenzaBlockedMessage] = useState<
    string | null
  >(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fotoFile) {
      setFotoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(fotoFile);
    setFotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoFile]);

  const selectedMacroNome = useMemo(() => {
    const group = categorieGrouped.find((g) =>
      g.categorie.some((c) => c.id === categoriaId),
    );
    return group?.macroNome ?? "";
  }, [categorieGrouped, categoriaId]);

  const previewTone: "light" | "dark" = DARK_MACRO_NAMES.has(selectedMacroNome)
    ? "dark"
    : "light";

  const previewDish = {
    id: piattoId ?? "anteprima",
    nome: nome || "Nome del piatto",
    descrizione: descrizione || null,
    prezzo: prezzo ? Number(prezzo) : null,
    prezzo_variabile: prezzoVariabile,
    foto_url: fotoPreviewUrl ?? fotoUrl,
    allergeni: Array.from(allergeniSelected),
    badges: badges.map((b) => b.testo).filter((t) => t.trim().length > 0),
  };

  const showEvidenzaWarning = inEvidenza && otherEvidenzaCount >= 3;

  // Oltre 8 l'anteprima smette di essere una selezione e ridiventa un
  // elenco — che è il problema che il flag serviva a risolvere.
  // Avviso soltanto: nessun blocco, la soglia non è una regola rigida.
  const totaleAnteprima = otherAnteprimaCount + (anteprimaHome ? 1 : 0);
  const showAnteprimaWarning = anteprimaHome && totaleAnteprima > 8;

  function handleToggleEvidenza(next: boolean) {
    if (next && otherEvidenzaCount >= 3) {
      setEvidenzaBlockedMessage(
        "Massimo 3 piatti in evidenza in home. Disattivane uno prima di aggiungerne un altro.",
      );
      return;
    }
    setEvidenzaBlockedMessage(null);
    setInEvidenza(next);
  }

  function toggleAllergene(id: number) {
    setAllergeniSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addBadge() {
    setBadges((prev) => [...prev, { testo: "", testo_en: "" }]);
  }

  function updateBadge(index: number, field: keyof BadgeInput, value: string) {
    setBadges((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    );
  }

  function removeBadge(index: number) {
    setBadges((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFotoFile(e.target.files?.[0] ?? null);
  }

  function removeFoto() {
    setFotoFile(null);
    setFotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!categoriaId) {
      setError("Seleziona una categoria.");
      return;
    }
    if (!nome.trim()) {
      setError("Il nome del piatto è obbligatorio.");
      return;
    }

    setSaving(true);
    try {
      let finalFotoUrl = fotoUrl;

      if (fotoFile) {
        setUploading(true);
        const supabase = createClient();
        const ext = fotoFile.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("piatti-foto")
          .upload(path, fotoFile, { upsert: true });
        if (uploadError) throw new Error(uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("piatti-foto")
          .getPublicUrl(path);
        finalFotoUrl = publicUrlData.publicUrl;
        setUploading(false);
      }

      await savePiatto({
        id: piattoId ?? null,
        categoria_id: categoriaId,
        nome: nome.trim(),
        nome_en: nomeEn.trim() || null,
        descrizione: descrizione.trim() || null,
        descrizione_en: descrizioneEn.trim() || null,
        prezzo: prezzo ? Number(prezzo) : null,
        prezzo_variabile: prezzoVariabile,
        disponibile,
        foto_url: finalFotoUrl,
        allergeni: Array.from(allergeniSelected),
        badges: badges
          .filter((b) => b.testo.trim().length > 0)
          .map((b) => ({ testo: b.testo.trim(), testo_en: b.testo_en.trim() })),
        in_evidenza: inEvidenza,
        in_evidenza_ordine: inEvidenza ? inEvidenzaOrdine : null,
        anteprima_home: anteprimaHome,
        anteprima_home_ordine: anteprimaHome ? anteprimaHomeOrdine : null,
      });

      router.push("/gestione/menu");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il salvataggio.",
      );
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={mode === "create" ? "Nuovo piatto" : "Modifica piatto"}
      className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start"
    >
      {/* Colonna form */}
      <div className="space-y-6 max-w-xl">
        {/* Nome IT/EN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome (IT)">
            <input
              className={inputClass}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </Field>
          <Field label="Nome (EN)">
            <input
              className={inputClass}
              value={nomeEn}
              onChange={(e) => setNomeEn(e.target.value)}
            />
          </Field>
        </div>

        {/* Descrizione IT/EN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Descrizione (IT)">
            <textarea
              className={inputClass}
              rows={3}
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
            />
          </Field>
          <Field label="Descrizione (EN)">
            <textarea
              className={inputClass}
              rows={3}
              value={descrizioneEn}
              onChange={(e) => setDescrizioneEn(e.target.value)}
            />
          </Field>
        </div>

        {/* Categoria */}
        <Field label="Categoria">
          <select
            className={inputClass}
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
          >
            {categorieGrouped.map((group) => (
              <optgroup key={group.macroId} label={group.macroNome}>
                {group.categorie.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>

        {/* Prezzo */}
        <div className="flex items-end gap-4">
          <Field label="Prezzo (€)" className="flex-1">
            <input
              className={inputClass}
              type="number"
              step="0.01"
              min="0"
              value={prezzo}
              onChange={(e) => setPrezzo(e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 pb-2.5 font-sans text-sm text-ink whitespace-nowrap">
            <input
              type="checkbox"
              checked={prezzoVariabile}
              onChange={(e) => setPrezzoVariabile(e.target.checked)}
              className="w-4 h-4 accent-bordeaux rounded-[2px]"
            />
            Prezzo al kg/hg
          </label>
        </div>

        {/* Foto */}
        <Field label="Foto">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-[2px]">
              {fotoPreviewUrl || fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fotoPreviewUrl ?? fotoUrl ?? ""}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlaceholder
                  seed={piattoId ?? "nuovo-piatto"}
                  className="h-full"
                />
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="font-sans text-xs text-muted"
              />
              {(fotoUrl || fotoFile) && (
                <button
                  type="button"
                  onClick={removeFoto}
                  className="font-sans text-xs text-bordeaux text-left hover:opacity-70"
                >
                  Rimuovi foto
                </button>
              )}
            </div>
          </div>
        </Field>

        {/* Allergeni */}
        <Field label="Allergeni">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 border border-ink/10 rounded-[2px] p-4">
            {allergeniList.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2 font-sans text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={allergeniSelected.has(a.id)}
                  onChange={() => toggleAllergene(a.id)}
                  className="w-4 h-4 accent-bordeaux rounded-[2px] flex-shrink-0"
                />
                <span>
                  {a.id} — {a.nome_it}
                </span>
              </label>
            ))}
          </div>
        </Field>

        {/* Badge */}
        <Field label="Badge">
          <div className="space-y-2">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className={inputClass}
                  placeholder="Testo (IT)"
                  value={badge.testo}
                  onChange={(e) => updateBadge(index, "testo", e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Testo (EN)"
                  value={badge.testo_en}
                  onChange={(e) =>
                    updateBadge(index, "testo_en", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeBadge(index)}
                  className="font-sans text-lg leading-none text-muted hover:text-bordeaux px-2 flex-shrink-0"
                  aria-label="Rimuovi badge"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBadge}
              className="font-sans text-sm text-bordeaux hover:opacity-70"
            >
              + Aggiungi badge
            </button>
          </div>
        </Field>

        {/* Disponibile */}
        <Field label="Stato">
          <Switch
            checked={disponibile}
            onChange={setDisponibile}
            label={disponibile ? "Disponibile" : "Esaurito"}
          />
        </Field>

        {/* In evidenza */}
        <Field label="Home">
          <div className="space-y-2">
            <Switch
              checked={inEvidenza}
              onChange={handleToggleEvidenza}
              label="In evidenza in home"
            />
            {evidenzaBlockedMessage && (
              <p className="font-sans text-xs text-cream-text bg-bordeaux border border-bordeaux inline-block px-2.5 py-1 rounded-[2px]">
                {evidenzaBlockedMessage}
              </p>
            )}
            {inEvidenza && (
              <div className="flex items-center gap-2 pl-1">
                <label className="font-sans text-xs text-muted">Ordine</label>
                <input
                  type="number"
                  min="0"
                  className={cn(inputClass, "w-20")}
                  value={inEvidenzaOrdine}
                  onChange={(e) => setInEvidenzaOrdine(Number(e.target.value))}
                />
              </div>
            )}
            {showEvidenzaWarning && (
              <p className="font-sans text-xs text-dark bg-gold/25 border border-gold inline-block px-2.5 py-1 rounded-[2px]">
                Attenzione: solo i primi 3 per ordine verranno mostrati nello
                slider.
              </p>
            )}

            <div className="pt-3 mt-1 border-t border-ink/10 space-y-2">
              <Switch
                checked={anteprimaHome}
                onChange={setAnteprimaHome}
                label="Mostra nell'anteprima home"
              />
              <p className="font-sans text-xs text-muted">
                Diverso da &quot;in evidenza&quot;: questo decide quali piatti
                compaiono nell&apos;anteprima del menu (o dei cocktail) in home.
              </p>
              {anteprimaHome && (
                <div className="flex items-center gap-2 pl-1">
                  <label className="font-sans text-xs text-muted">Ordine</label>
                  <input
                    type="number"
                    min="0"
                    className={cn(inputClass, "w-20")}
                    value={anteprimaHomeOrdine}
                    onChange={(e) =>
                      setAnteprimaHomeOrdine(Number(e.target.value))
                    }
                  />
                  <span className="font-sans text-xs text-muted">
                    il primo della lista è il piatto grande in cima
                  </span>
                </div>
              )}
              {showAnteprimaWarning && (
                <p className="font-sans text-xs text-dark bg-gold/25 border border-gold inline-block px-2.5 py-1 rounded-[2px]">
                  Sono {totaleAnteprima} i piatti selezionati per l&apos;anteprima
                  home: oltre gli 8 diventa una lista invece di una selezione.
                </p>
              )}
            </div>
          </div>
        </Field>

        {error && <p className="font-sans text-sm text-bordeaux">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {uploading
              ? "Caricamento foto…"
              : saving
                ? "Salvataggio…"
                : "Salva piatto"}
          </Button>
          <button
            type="button"
            onClick={() => router.push("/gestione/menu")}
            className="font-sans text-sm text-muted hover:text-ink transition-colors"
          >
            Annulla
          </button>
        </div>
      </div>

      {/* Colonna anteprima */}
      <div className="lg:sticky lg:top-8">
        <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
          Anteprima menu
        </p>
        <div
          className={cn(
            "rounded-[2px] p-6 border",
            previewTone === "dark"
              ? "bg-dark text-cream-text border-cream-text/10"
              : "bg-cream text-ink border-ink/10",
          )}
        >
          <DishRow dish={previewDish} tone={previewTone} className="border-b-0 py-0" />
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
