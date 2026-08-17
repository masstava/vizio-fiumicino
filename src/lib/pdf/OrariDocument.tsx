import fs from "fs";
import path from "path";
import { Document, Page, View, Text, Font, StyleSheet } from "@react-pdf/renderer";

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
  darkBand: {
    backgroundColor: COLORS.dark,
    paddingVertical: 32,
    alignItems: "center",
  },
  wordmark: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 42,
    letterSpacing: 6,
    color: COLORS.creamText,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 64,
    paddingTop: 56,
  },
  title: {
    fontFamily: "Fraunces",
    fontWeight: 500,
    fontSize: 20,
    letterSpacing: 3,
    color: COLORS.bordeaux,
    textAlign: "center",
    marginBottom: 48,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  dayName: {
    fontFamily: "Fraunces",
    fontWeight: 400,
    fontSize: 14,
    color: COLORS.ink,
  },
  dottedLine: {
    flexGrow: 1,
    marginHorizontal: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
    borderBottomColor: COLORS.muted,
  },
  time: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 14,
    color: COLORS.bordeaux,
  },
  footerBand: {
    backgroundColor: COLORS.dark,
    paddingVertical: 26,
    alignItems: "center",
  },
  address: {
    fontFamily: "Fraunces",
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.creamText,
  },
});

export interface OrarioGiorno {
  nome: string;
  chiuso: boolean;
  apertura: string | null;
  chiusura: string | null;
}

interface OrariDocumentProps {
  giorni: OrarioGiorno[];
}

function formatOrario(giorno: OrarioGiorno): string {
  if (giorno.chiuso || !giorno.apertura || !giorno.chiusura) return "CHIUSO";
  return `${giorno.apertura} – ${giorno.chiusura}`;
}

export function OrariDocument({ giorni }: OrariDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.darkBand}>
          <Text style={styles.wordmark}>VIZIO</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>ORARI APERTURA</Text>

          {giorni.map((giorno) => (
            <View key={giorno.nome} style={styles.row}>
              <Text style={styles.dayName}>{giorno.nome.toUpperCase()}</Text>
              <View style={styles.dottedLine} />
              <Text style={styles.time}>{formatOrario(giorno)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerBand}>
          <Text style={styles.address}>VIA DELLE OMBRINE 25, FIUMICINO</Text>
        </View>
      </Page>
    </Document>
  );
}
