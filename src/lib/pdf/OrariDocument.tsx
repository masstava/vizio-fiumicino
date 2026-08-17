import fs from "fs";
import path from "path";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

// Fraunces auto-ospitato per il PDF: i file .woff sono committati in
// questa cartella così la generazione non dipende da una fetch di rete
// a runtime (niente fragilità su URL Google Fonts o proxy indisponibili).
const FONT_DIR = path.join(process.cwd(), "src", "lib", "pdf", "fonts");

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  fontsRegistered = true;

  try {
    Font.register({
      family: "Fraunces",
      fonts: [
        { src: path.join(FONT_DIR, "Fraunces-Regular.woff"), fontWeight: 400 },
        { src: path.join(FONT_DIR, "Fraunces-Medium.woff"), fontWeight: 500 },
        { src: path.join(FONT_DIR, "Fraunces-SemiBold.woff"), fontWeight: 600 },
      ],
    });

    // Se i file non esistono (ambiente senza i .woff), fallisce
    // silenziosamente più avanti nel render: verifichiamo qui a monte
    // e ripieghiamo su un serif di sistema, senza bloccare il PDF.
    for (const file of ["Fraunces-Regular.woff", "Fraunces-Medium.woff", "Fraunces-SemiBold.woff"]) {
      if (!fs.existsSync(path.join(FONT_DIR, file))) {
        throw new Error(`Font file mancante: ${file}`);
      }
    }
  } catch {
    Font.register({ family: "Fraunces", fonts: [] });
  }
}

registerFonts();

// Fasce header/footer: immagini reali fornite dal cliente. Se i file
// non sono ancora presenti in public/pdf/, si ripiega su una fascia a
// tinta piena con il wordmark testuale, così il PDF resta generabile
// anche prima che le immagini vengano caricate nel progetto.
const HEADER_IMAGE_PATH = path.join(process.cwd(), "public", "pdf", "orari-header.png");
const FOOTER_IMAGE_PATH = path.join(process.cwd(), "public", "pdf", "orari-footer.png");

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

const COLORS = {
  ink: "#1A1A1A",
  cream: "#F7F2E9",
  dark: "#0A0705",
  bordeaux: "#8B1A1A",
  creamText: "#F5EFE4",
  muted: "#5F5E5A",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.cream,
  },
  headerImage: {
    width: "100%",
  },
  footerImage: {
    width: "100%",
  },
  darkBandFallback: {
    backgroundColor: COLORS.dark,
    paddingVertical: 32,
    alignItems: "center",
  },
  wordmarkFallback: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 42,
    letterSpacing: 6,
    color: COLORS.creamText,
  },
  footerBandFallback: {
    backgroundColor: COLORS.dark,
    paddingVertical: 26,
    alignItems: "center",
  },
  addressFallback: {
    fontFamily: "Fraunces",
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.creamText,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 64,
    paddingTop: 56,
  },
  titleBlock: {
    alignItems: "center",
    marginBottom: 56,
  },
  title: {
    fontFamily: "Fraunces",
    fontWeight: 500,
    fontSize: 40,
    letterSpacing: 3,
    color: COLORS.bordeaux,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Fraunces",
    fontWeight: 400,
    fontSize: 24,
    letterSpacing: 1,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  dayName: {
    fontFamily: "Fraunces",
    fontWeight: 400,
    fontSize: 17,
    color: COLORS.ink,
  },
  dottedLine: {
    flexGrow: 1,
    marginHorizontal: 8,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
    borderBottomColor: COLORS.muted,
  },
  time: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 17,
    color: COLORS.bordeaux,
  },
});

export interface OrarioFascia {
  apertura: string | null;
  chiusura: string | null;
}

export interface OrarioGiorno {
  nome: string;
  chiuso: boolean;
  fasce: OrarioFascia[];
}

interface OrariDocumentProps {
  giorni: OrarioGiorno[];
  titolo?: string;
  sottotitolo?: string;
}

function formatFascia(fascia: OrarioFascia): string {
  if (!fascia.apertura || !fascia.chiusura) return "CHIUSO";
  return `${fascia.apertura} – ${fascia.chiusura}`;
}

// Tutte le fasce di un giorno stanno sulla stessa riga (separate da
// "/"), non una sotto l'altra: con più giorni a doppia fascia, righe
// impilate spingerebbero il footer fuori dalla singola pagina A4.
function formatGiorno(giorno: OrarioGiorno): string {
  if (giorno.chiuso || giorno.fasce.length === 0) return "CHIUSO";
  return giorno.fasce.map(formatFascia).join(" / ");
}

export function OrariDocument({
  giorni,
  titolo = "ORARI APERTURA",
  sottotitolo,
}: OrariDocumentProps) {
  const hasHeaderImage = fileExists(HEADER_IMAGE_PATH);
  const hasFooterImage = fileExists(FOOTER_IMAGE_PATH);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {hasHeaderImage ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- Image di @react-pdf/renderer (PDF), non next/image: non ha prop "alt"
          <Image src={HEADER_IMAGE_PATH} style={styles.headerImage} />
        ) : (
          <View style={styles.darkBandFallback}>
            <Text style={styles.wordmarkFallback}>VIZIO</Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{titolo}</Text>
            {sottotitolo ? (
              <Text style={styles.subtitle}>{sottotitolo}</Text>
            ) : null}
          </View>

          {giorni.map((giorno) => (
            <View key={giorno.nome} style={styles.row}>
              <Text style={styles.dayName}>{giorno.nome.toUpperCase()}</Text>
              <View style={styles.dottedLine} />
              <Text style={styles.time}>{formatGiorno(giorno)}</Text>
            </View>
          ))}
        </View>

        {hasFooterImage ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- Image di @react-pdf/renderer (PDF), non next/image: non ha prop "alt"
          <Image src={FOOTER_IMAGE_PATH} style={styles.footerImage} />
        ) : (
          <View style={styles.footerBandFallback}>
            <Text style={styles.addressFallback}>
              VIA DELLE OMBRINE 25, FIUMICINO
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
