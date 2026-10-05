import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// =============================================================
// Anteprime social (Open Graph / Twitter) per pagina — fonte unica
// =============================================================
// Stesso impianto dell'anteprima generica che c'era prima (file PNG
// statico in app/(public)/[locale]): fondo scuro, marchio oro, titolo
// in Fraunces. Ora il titolo e la riga sotto sono quelli della pagina
// e della sua lingua — prima ogni pagina, anche in inglese, mostrava
// la stessa frase in italiano.
//
// Peso: le anteprime di WhatsApp ignorano le immagini troppo pesanti.
// Fondo a tinta unita (niente sfumature ampie, che in PNG pesano
// molto) e marchio vettoriale: l'immagine resta intorno a poche decine
// di KB invece dei ~245 KB di quella di prima.
//
// Generata alla build (le rotte opengraph-image ereditano i due
// valori di [locale] da generateStaticParams del layout): nessun costo
// a ogni richiesta.
//
// Niente dati che invecchiano (voto e numero di recensioni c'erano
// nell'immagine di prima): un'anteprima resta in cache sui social per
// mesi, e mostrerebbe numeri superati.

export const DIMENSIONI = { width: 1200, height: 630 };
export const TIPO = "image/png";

const DIR_FONT = join(process.cwd(), "src/lib/pdf/fonts");
const DIR_MARCHIO = join(process.cwd(), "public/brand");

// Gli SVG del marchio colorano i tracciati con classi CSS interne:
// qui diventano attributi fill espliciti, per non dipendere da quanto
// CSS supporti il rasterizzatore di next/og.
async function svgComeDataUri(file: string): Promise<string> {
  const grezzo = await readFile(join(DIR_MARCHIO, file), "utf8");
  const pulito = grezzo
    .replace(/<\?xml[^>]*>/, "")
    .replace(/<defs>[\s\S]*?<\/defs>/, "")
    .replace(/class="cls-1"/g, 'fill="#910000"')
    .replace(/class="cls-2"/g, 'fill="#dfc98a"');
  return `data:image/svg+xml;base64,${Buffer.from(pulito).toString("base64")}`;
}

export async function anteprimaSocial({
  titolo,
  descrizione,
  luogo,
}: {
  titolo: string;
  descrizione: string;
  /** Riga in fondo, es. "Fiumicino · Via delle Ombrine 25". */
  luogo: string;
}): Promise<ImageResponse> {
  const [fraunces, inter, logo, fiamma] = await Promise.all([
    readFile(join(DIR_FONT, "Fraunces-Medium.woff")),
    readFile(join(DIR_FONT, "Inter-Regular.woff")),
    svgComeDataUri("logo-completo.svg"),
    svgComeDataUri("fiamma-oro.svg"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0705",
          padding: "72px 90px",
          borderTop: "4px solid #8b1a1a",
        }}
      >
        {/* Filigrana: la fiamma a bassa opacità sul lato destro. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og non usa next/image */}
        <img
          src={fiamma}
          alt=""
          width={330}
          height={542}
          style={{ position: "absolute", right: 70, top: 44, opacity: 0.09 }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 860 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- next/og non usa next/image */}
          <img src={logo} alt="" width={272} height={130} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Fraunces",
                // Un titolo lungo va su due righe: corpo un po' più
                // piccolo, per lasciare respiro sotto il marchio.
                fontSize: titolo.length > 20 ? 60 : 72,
                lineHeight: 1.05,
                color: "#f5efe4",
                marginBottom: 22,
              }}
            >
              {titolo}
            </div>
            <div
              style={{
                fontFamily: "Inter",
                fontSize: 30,
                lineHeight: 1.35,
                color: "#d8c7b0",
                // Al massimo tre righe: le descrizioni sono pensate
                // per i motori di ricerca, qui serve solo l'attacco.
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {descrizione}
            </div>
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 24, color: "#dfc98a" }}>{luogo}</div>
        </div>
      </div>
    ),
    {
      ...DIMENSIONI,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 500, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
      ],
    },
  );
}
