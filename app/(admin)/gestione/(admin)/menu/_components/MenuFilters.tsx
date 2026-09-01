"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { slugify } from "./slugify";
import type { MacroGroup } from "./types";

interface MenuFiltersProps {
  groups: MacroGroup[];
}

const fieldClass =
  "min-h-11 md:min-h-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

export function MenuFilters({ groups }: MenuFiltersProps) {
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
          className="font-sans text-[10px] tracking-widest uppercase text-admin-text-2 block mb-1.5"
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
          className="font-sans text-[10px] tracking-widest uppercase text-admin-text-2 block mb-1.5"
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
    </div>
  );
}
