import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { BannerConsenso } from "@/src/components/consenso/BannerConsenso";
import { ConsensoProvider } from "@/src/components/consenso/ConsensoContext";
import { ModalePreferenze } from "@/src/components/consenso/ModalePreferenze";
import { ScriptConsentMode } from "@/src/components/consenso/ScriptConsentMode";
import { WhatsAppFab } from "@/src/components/home/WhatsAppFab";
import { MotionProvider } from "@/src/components/motion/MotionProvider";
import { OverlayProvider } from "@/src/components/overlay/OverlayContext";
import { fontVariables } from "@/src/lib/fonts";
import { LOCALES, isLocale, type Locale } from "@/src/lib/i18n/config";
import { SITE_URL } from "@/src/lib/site-url";

// Genera in anticipo i due alberi di rotte: /it (servito su "/" grazie
// alla riscrittura nel middleware) e /en.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const DESCRIZIONE: Record<Locale, string> = {
  it: "Carne alla griglia, cocktail d'autore e aperitivo fino a notte fonda, a Fiumicino. Via delle Ombrine 25.",
  en: "Grilled meat, signature cocktails and aperitivo until late, in Fiumicino. Via delle Ombrine 25.",
};

const TITOLO: Record<Locale, string> = {
  it: "Vizio Bistrot — Fiumicino",
  en: "Vizio Bistrot — Fiumicino",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";

  // Niente canonical/hreflang qui: valgono per pagina, non per
  // sottoalbero. Ogni pagina li dichiara con alternatesPerPagina()
  // passando il proprio percorso (vedi src/lib/i18n/metadata.ts).
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: TITOLO[locale],
      template: "%s · Vizio Bistrot",
    },
    description: DESCRIZIONE[locale],
    openGraph: {
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_GB",
      alternateLocale: locale === "it" ? "en_GB" : "it_IT",
      siteName: "Vizio Bistrot",
      title: TITOLO[locale],
      description: DESCRIZIONE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: TITOLO[locale],
      description: DESCRIZIONE[locale],
    },
  };
}

// Layout radice del sito pubblico. L'attributo lang segue la lingua
// della pagina: senza, i browser non propongono la traduzione
// automatica verso le lingue diverse da IT ed EN — che è il modo in
// cui il progetto copre tutte le altre lingue, invece di mantenerle
// a mano.
export default async function PublicRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        {/* PRIMO in <head>, prima di qualunque altro tag: Consent Mode
            deve avere lo stato di default dichiarato prima che un
            eventuale tag Google si carichi. */}
        <ScriptConsentMode />

        {/* Le sezioni in comparsa partono a opacità 0 e vengono
            mostrate da Motion. Senza JavaScript resterebbero
            invisibili: questa regola le riporta a vista. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-cream text-ink font-sans antialiased">
        {/* Provider e bottone stanno nel layout e non nelle singole
            pagine: il contatto rapido deve essere disponibile ovunque,
            e il registro degli overlay deve sopravvivere alla
            navigazione fra pagine. */}
        <OverlayProvider>
          {/* Il provider del consenso avvolge il contenuto perché il
              pulsante "Gestisci cookie" nel footer deve poter riaprire
              il modale, e il modale vive qui fuori. */}
          <ConsensoProvider>
            <MotionProvider>{children}</MotionProvider>
            <WhatsAppFab locale={locale} />
            <BannerConsenso locale={locale} />
            <ModalePreferenze locale={locale} />
          </ConsensoProvider>
        </OverlayProvider>
      </body>
    </html>
  );
}
