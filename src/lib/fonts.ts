import localFont from "next/font/local";

// =============================================================
// Font del sito — file ospitati nel repository (src/fonts/)
// =============================================================
// Prima: next/font/google, che scarica i file da Google a ogni build.
// Un build su Vercel è fallito una volta proprio lì (Fraunces,
// "TypeError reading '1'"): il cutover richiede un redeploy, e il build
// non deve dipendere da un servizio esterno.
//
// I file sono ESATTAMENTE quelli che Google serviva (stessi byte: vedi
// src/fonts/README.md), quindi l'aspetto non cambia: font variabili con
// il solo asse wght; per Fraunces Google ha già fissato opsz=14,
// SOFT=0, WONK=0, i valori predefiniti del suo registro degli assi.
//
// Come faceva Google, ogni font è diviso per intervallo Unicode:
// latin si precarica, gli altri sottoinsiemi si scaricano solo se una
// pagina contiene quei caratteri. Per riunirli in UNA famiglia ogni
// chiamata dichiara la stessa font-family (declarations) con il
// proprio unicode-range. Solo la chiamata latin ha la variabile CSS
// "vera" (--font-fraunces, --font-inter) e il font di ripiego con le
// metriche allineate; le altre hanno una variabile propria solo per
// essere incluse nella pagina (vedi fontVariables) e nessun ripiego.
//
// Ripiego (font di sistema mostrato finché il file non è arrivato,
// display: swap): adjustFontFallback calcolerebbe le metriche dal file,
// e questi file hanno come istanza predefinita il peso 900 — il
// ripiego verrebbe tarato sul Fraunces Black (size-adjust 127% invece
// di 115%) e il testo salterebbe al cambio di font. Le facce
// "Fraunces Fallback" e "Inter Fallback" sono quindi dichiarate in
// globals.css con gli STESSI valori che next/font/google ricavava
// dalle sue metriche precalcolate.
//
// next/font accetta nelle chiamate solo valori letterali: per questo
// gli intervalli sono ripetuti per esteso invece che in costanti.
// Condivisi tra i due layout radice (sito pubblico e dashboard).

export const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces/Fraunces-Italic-latin.woff2", weight: "400", style: "italic" },
    { path: "../fonts/fraunces/Fraunces-Italic-latin.woff2", weight: "500", style: "italic" },
    { path: "../fonts/fraunces/Fraunces-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/fraunces/Fraunces-latin.woff2", weight: "500", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Fraunces'" },
    { prop: "unicode-range", value: "u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  // Ripiego con metriche allineate: vedi "Fraunces Fallback" in globals.css.
  adjustFontFallback: false,
  fallback: ["Fraunces Fallback"],
});

const frauncesLatinExt = localFont({
  src: [
    { path: "../fonts/fraunces/Fraunces-Italic-latin-ext.woff2", weight: "400", style: "italic" },
    { path: "../fonts/fraunces/Fraunces-Italic-latin-ext.woff2", weight: "500", style: "italic" },
    { path: "../fonts/fraunces/Fraunces-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "../fonts/fraunces/Fraunces-latin-ext.woff2", weight: "500", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Fraunces'" },
    { prop: "unicode-range", value: "u+0100-02ba,u+02bd-02c5,u+02c7-02cc,u+02ce-02d7,u+02dd-02ff,u+0304,u+0308,u+0329,u+1d00-1dbf,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c0,u+2113,u+2c60-2c7f,u+a720-a7ff" },
  ],
  variable: "--font-fraunces-latin-ext",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

const frauncesVietnamese = localFont({
  src: [
    { path: "../fonts/fraunces/Fraunces-Italic-vietnamese.woff2", weight: "400", style: "italic" },
    { path: "../fonts/fraunces/Fraunces-Italic-vietnamese.woff2", weight: "500", style: "italic" },
    { path: "../fonts/fraunces/Fraunces-vietnamese.woff2", weight: "400", style: "normal" },
    { path: "../fonts/fraunces/Fraunces-vietnamese.woff2", weight: "500", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Fraunces'" },
    { prop: "unicode-range", value: "u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab" },
  ],
  variable: "--font-fraunces-vietnamese",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

export const inter = localFont({
  src: [
    { path: "../fonts/inter/Inter-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/Inter-latin.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/Inter-latin.woff2", weight: "600", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Inter'" },
    { prop: "unicode-range", value: "u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd" },
  ],
  variable: "--font-inter",
  display: "swap",
  // Ripiego con metriche allineate: vedi "Inter Fallback" in globals.css.
  adjustFontFallback: false,
  fallback: ["Inter Fallback"],
});

const interLatinExt = localFont({
  src: [
    { path: "../fonts/inter/Inter-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/Inter-latin-ext.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/Inter-latin-ext.woff2", weight: "600", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Inter'" },
    { prop: "unicode-range", value: "u+0100-02ba,u+02bd-02c5,u+02c7-02cc,u+02ce-02d7,u+02dd-02ff,u+0304,u+0308,u+0329,u+1d00-1dbf,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c0,u+2113,u+2c60-2c7f,u+a720-a7ff" },
  ],
  variable: "--font-inter-latin-ext",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

const interVietnamese = localFont({
  src: [
    { path: "../fonts/inter/Inter-vietnamese.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/Inter-vietnamese.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/Inter-vietnamese.woff2", weight: "600", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Inter'" },
    { prop: "unicode-range", value: "u+0102-0103,u+0110-0111,u+0128-0129,u+0168-0169,u+01a0-01a1,u+01af-01b0,u+0300-0301,u+0303-0304,u+0308-0309,u+0323,u+0329,u+1ea0-1ef9,u+20ab" },
  ],
  variable: "--font-inter-vietnamese",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

const interGreek = localFont({
  src: [
    { path: "../fonts/inter/Inter-greek.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/Inter-greek.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/Inter-greek.woff2", weight: "600", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Inter'" },
    { prop: "unicode-range", value: "u+0370-0377,u+037a-037f,u+0384-038a,u+038c,u+038e-03a1,u+03a3-03ff" },
  ],
  variable: "--font-inter-greek",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

const interGreekExt = localFont({
  src: [
    { path: "../fonts/inter/Inter-greek-ext.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/Inter-greek-ext.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/Inter-greek-ext.woff2", weight: "600", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Inter'" },
    { prop: "unicode-range", value: "u+1f??" },
  ],
  variable: "--font-inter-greek-ext",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

const interCyrillic = localFont({
  src: [
    { path: "../fonts/inter/Inter-cyrillic.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/Inter-cyrillic.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/Inter-cyrillic.woff2", weight: "600", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Inter'" },
    { prop: "unicode-range", value: "u+0301,u+0400-045f,u+0490-0491,u+04b0-04b1,u+2116" },
  ],
  variable: "--font-inter-cyrillic",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

const interCyrillicExt = localFont({
  src: [
    { path: "../fonts/inter/Inter-cyrillic-ext.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter/Inter-cyrillic-ext.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter/Inter-cyrillic-ext.woff2", weight: "600", style: "normal" },
  ],
  declarations: [
    { prop: "font-family", value: "'Inter'" },
    { prop: "unicode-range", value: "u+0460-052f,u+1c80-1c8a,u+20b4,u+2de0-2dff,u+a640-a69f,u+fe2e-fe2f" },
  ],
  variable: "--font-inter-cyrillic-ext",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

export const fontVariables = [
  fraunces.variable,
  frauncesLatinExt.variable,
  frauncesVietnamese.variable,
  inter.variable,
  interLatinExt.variable,
  interVietnamese.variable,
  interGreek.variable,
  interGreekExt.variable,
  interCyrillic.variable,
  interCyrillicExt.variable,
].join(" ");
