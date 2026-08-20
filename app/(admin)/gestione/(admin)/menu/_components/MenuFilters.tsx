"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { slugify } from "./slugify";
import type { MacroGroup } from "./types";

interface MenuFiltersProps {
  groups: MacroGroup[];
  search: string;
  onSearchChange: (value: string) => void;
}

const fieldClass =
  "bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink focus:outline-none focus:border-bordeaux/50 transition-colors";

export function MenuFilters({ groups, search, onSearchChange }: MenuFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const macroSlug = searchParams.get("macro") ?? "all";
  const categoriaSlug = searchParams.get("categoria") ?? "all";

  const macroOptions = groups.map((m) => ({ nome: m.nome, slug: slugify(m.nome) }));

  const categoriaOptions =
    macroSlug === "all"
      ? groups.flatMap((m) =>
          m.categorie.map((c) => ({ nome: c.nome, slug: slugify(c.nome) })),
        )
      : (groups.find((m) => slugify(m.nome) === macroSlug)?.categorie ?? []).map(
          (c) => ({ nome: c.nome, slug: slugify(c.nome) }),
        );

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    });
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-end gap-4 mb-8">
      <div>
        <label
          htmlFor="menu-filter-macro"
          className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5"
        >
          Macro-categoria
        </label>
        <select
          id="menu-filter-macro"
          className={fieldClass}
          value={macroSlug}
          onChange={(e) =>
            updateParams({ macro: e.target.value, categoria: null })
          }
        >
          <option value="all">Tutte</option>
          {macroOptions.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="menu-filter-categoria"
          className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5"
        >
          Categoria
        </label>
        <select
          id="menu-filter-categoria"
          className={fieldClass}
          value={categoriaSlug}
          onChange={(e) => updateParams({ categoria: e.target.value })}
        >
          <option value="all">Tutte</option>
          {categoriaOptions.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[220px]">
        <label
          htmlFor="menu-filter-search"
          className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5"
        >
          Cerca piatto
        </label>
        <input
          id="menu-filter-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cerca per nome…"
          className={`${fieldClass} w-full`}
        />
      </div>
    </div>
  );
}
