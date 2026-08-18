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

const A4_HEIGHT_PT = 841.89;

// Fraunces (titoli) + Inter (corpo/badge) auto-ospitati: nessuna fetch
// di rete a runtime, stesso approccio già validato per OrariDocument.
const FONT_DIR = path.join(process.cwd(), "src", "lib", "pdf", "fonts");

let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;
  fontsRegistered = true;

  const required = [
    "Fraunces-Regular.woff",
    "Fraunces-Medium.woff",
    "Fraunces-SemiBold.woff",
    "Inter-Regular.woff",
    "Inter-Italic.woff",
    "Inter-Medium.woff",
    "Inter-SemiBold.woff",
  ];

  try {
    for (const file of required) {
      if (!fs.existsSync(path.join(FONT_DIR, file))) {
        throw new Error(`Font file mancante: ${file}`);
      }
    }

    Font.register({
      family: "Fraunces",
      fonts: [
        { src: path.join(FONT_DIR, "Fraunces-Regular.woff"), fontWeight: 400 },
        { src: path.join(FONT_DIR, "Fraunces-Medium.woff"), fontWeight: 500 },
        { src: path.join(FONT_DIR, "Fraunces-SemiBold.woff"), fontWeight: 600 },
      ],
    });

    Font.register({
      family: "Inter",
      fonts: [
        { src: path.join(FONT_DIR, "Inter-Regular.woff"), fontWeight: 400 },
        {
          src: path.join(FONT_DIR, "Inter-Italic.woff"),
          fontWeight: 400,
          fontStyle: "italic",
        },
        { src: path.join(FONT_DIR, "Inter-Medium.woff"), fontWeight: 500 },
        { src: path.join(FONT_DIR, "Inter-SemiBold.woff"), fontWeight: 600 },
      ],
    });
  } catch {
    // Nessun font locale disponibile: fallback ai serif/sans di sistema,
    // il PDF resta comunque generabile.
    Font.register({ family: "Fraunces", fonts: [] });
    Font.register({ family: "Inter", fonts: [] });
  }
}

registerFonts();

// --- Colonna decorativa a piena altezza: larghezza letta dal PNG reale
// (chunk IHDR) così la proporzione non è mai forzata né stirata, e si
// aggiorna da sola quando il file viene sostituito. Fallback prudente
// se l'asset non è ancora presente.
const COLUMN_IMAGE_PATH = path.join(process.cwd(), "public", "pdf", "menu-colonna.png");
const FALLBACK_COLUMN_WIDTH = 170;

function readPngDimensions(filePath: string): { width: number; height: number } | null {
  try {
    const buffer = fs.readFileSync(filePath);
    const isPng =
      buffer.length >= 24 && buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG";
    if (!isPng) return null;
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  } catch {
    return null;
  }
}

const columnImageExists = fs.existsSync(COLUMN_IMAGE_PATH);
const columnDimensions = readPngDimensions(COLUMN_IMAGE_PATH);
const COLUMN_WIDTH = columnDimensions
  ? A4_HEIGHT_PT * (columnDimensions.width / columnDimensions.height)
  : FALLBACK_COLUMN_WIDTH;

const CONTENT_GUTTER = 30;
const CONTENT_LEFT = COLUMN_WIDTH + CONTENT_GUTTER;
const CONTENT_RIGHT_MARGIN = 40;

// Titolo categoria + circa 2 piatti: se non c'è questo spazio residuo
// in pagina, l'intero blocco (titolo compreso) passa alla successiva.
const CATEGORY_ORPHAN_GUARD = 160;

// Margine di sicurezza verticale (~1,4cm): nessun testo deve mai cadere
// in questa fascia, in alto o in basso, su nessuna pagina. Impostato a
// livello di <Page> (non su una View di contenuto) perché è l'unico modo
// per cui il motore di paginazione lo ripete su OGNI pagina fisica
// generata automaticamente per overflow, non solo sulla prima e
// sull'ultima del flusso. La colonna decorativa (position: absolute,
// dimensioni esplicite) non ne è influenzata: un elemento absolute è
// posizionato rispetto al riquadro esterno della pagina, non rispetto
// al suo padding — verificato empiricamente con un rendering di prova.
const CONTENT_VERTICAL_SAFE_MARGIN = 40;

const QR_SIZE = 96;

const COLORS = {
  ink: "#1A1A1A",
  cream: "#F7F2E9",
  dark: "#0A0705",
  bordeaux: "#8B1A1A",
  muted: "#5F5E5A",
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: COLORS.cream,
  },
  // Usato dalle pagine con testo in flusso normale (contenuto e chiusura):
  // il padding verticale è sulla Page stessa, non su una View interna,
  // così si ripete identico su ogni pagina fisica generata per overflow.
  pageContent: {
    padding: 0,
    paddingTop: CONTENT_VERTICAL_SAFE_MARGIN,
    paddingBottom: CONTENT_VERTICAL_SAFE_MARGIN,
    backgroundColor: COLORS.cream,
  },
  columnImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: COLUMN_WIDTH,
    height: A4_HEIGHT_PT,
  },
  columnFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    width: COLUMN_WIDTH,
    height: A4_HEIGHT_PT,
    backgroundColor: COLORS.dark,
  },
  coverTop: {
    position: "absolute",
    top: 54,
    left: CONTENT_LEFT,
    right: 0,
    alignItems: "center",
  },
  coverBrand: {
    fontFamily: "Inter",
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.ink,
  },
  coverCenter: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: CONTENT_LEFT,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  coverTitle: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 60,
    letterSpacing: 4,
    color: COLORS.bordeaux,
  },
  coverBottom: {
    position: "absolute",
    bottom: 44,
    left: CONTENT_LEFT,
    right: 0,
    alignItems: "center",
  },
  coverAddress: {
    fontFamily: "Inter",
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  contentWrapper: {
    marginLeft: CONTENT_LEFT,
    marginRight: CONTENT_RIGHT_MARGIN,
  },
  categoryTitle: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 15,
    color: COLORS.bordeaux,
    textTransform: "uppercase",
    textDecoration: "underline",
    textDecorationColor: COLORS.bordeaux,
    letterSpacing: 1.5,
    marginTop: 24,
    marginBottom: 12,
  },
  dishBlock: {
    marginBottom: 12,
  },
  dishRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dishName: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 12,
    color: COLORS.ink,
    flex: 1,
    paddingRight: 8,
  },
  dishPrice: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 12,
    color: COLORS.bordeaux,
    flexShrink: 0,
  },
  dishDescription: {
    fontFamily: "Inter",
    fontStyle: "italic",
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
    lineHeight: 1.3,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    alignItems: "center",
  },
  badge: {
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 6.5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: COLORS.bordeaux,
    borderWidth: 0.5,
    borderColor: COLORS.bordeaux,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginRight: 4,
    marginBottom: 4,
  },
  allergenCodes: {
    fontFamily: "Inter",
    fontSize: 7,
    color: COLORS.muted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  legendTitle: {
    fontFamily: "Fraunces",
    fontWeight: 600,
    fontSize: 17,
    color: COLORS.bordeaux,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 18,
  },
  allergenGrid: {
    flexDirection: "row",
  },
  allergenColumn: {
    flex: 1,
  },
  allergenItem: {
    fontFamily: "Inter",
    fontSize: 10,
    color: COLORS.ink,
    marginBottom: 9,
  },
  allergenNumber: {
    fontFamily: "Inter",
    fontWeight: 600,
    color: COLORS.bordeaux,
  },
  thankYouBlock: {
    marginTop: 44,
    paddingHorizontal: 10,
  },
  thankYouText: {
    fontFamily: "Inter",
    fontSize: 11,
    color: COLORS.ink,
    lineHeight: 1.5,
    textAlign: "center",
  },
  qrBlock: {
    marginTop: 36,
    alignItems: "center",
  },
  qrImage: {
    width: QR_SIZE,
    height: QR_SIZE,
  },
  qrCaption: {
    fontFamily: "Inter",
    fontSize: 9,
    color: COLORS.muted,
    letterSpacing: 0.5,
    marginTop: 8,
  },
});

export interface MenuPiatto {
  id: string;
  nome: string;
  descrizione: string | null;
  prezzo: number | null;
  prezzo_variabile: boolean;
  badges: string[];
  allergeni: number[];
}

export interface MenuCategoria {
  id: string;
  nome: string;
  piatti: MenuPiatto[];
}

export interface MenuAllergene {
  id: number;
  nome: string;
}

interface MenuDocumentProps {
  categorie: MenuCategoria[];
  allergeni: MenuAllergene[];
  lang: "it" | "en";
  qrCodeDataUrl: string;
}

function formatPrezzo(prezzo: number, variabile: boolean): string {
  const formatted = prezzo.toFixed(2).replace(".", ",");
  return `${formatted}€${variabile ? " / hg" : ""}`;
}

function Column() {
  return columnImageExists ? (
    // eslint-disable-next-line jsx-a11y/alt-text -- Image di @react-pdf/renderer (PDF), non next/image: non ha prop "alt"
    <Image src={COLUMN_IMAGE_PATH} fixed style={styles.columnImage} />
  ) : (
    <View fixed style={styles.columnFallback} />
  );
}

export function MenuDocument({
  categorie,
  allergeni,
  lang,
  qrCodeDataUrl,
}: MenuDocumentProps) {
  const allergeniLeft = allergeni.slice(0, 7);
  const allergeniRight = allergeni.slice(7);

  const thankYouText =
    lang === "en"
      ? "Thank you for choosing Vizio. Sign up for our newsletter to stay updated on events and surprises reserved for our followers."
      : "Grazie per aver scelto Vizio. Iscriviti alla newsletter per non perdere eventi e sorprese riservate a chi ci segue.";

  return (
    <Document>
      {/* Copertina — tre livelli distinti: marchio in alto, titolo al
          centro, indirizzo in fondo pagina. */}
      <Page size="A4" style={styles.page}>
        <Column />

        <View style={styles.coverTop}>
          <Text style={styles.coverBrand}>Vizio Bistrot</Text>
        </View>

        <View style={styles.coverCenter}>
          <Text style={styles.coverTitle}>MENU</Text>
        </View>

        <View style={styles.coverBottom}>
          <Text style={styles.coverAddress}>Via delle Ombrine 25, Fiumicino</Text>
        </View>
      </Page>

      {/* Contenuto: un unico Page che si pagina da solo per overflow;
          la colonna, marcata fixed, si ripete su ogni pagina generata.
          style.pageContent applica il margine di sicurezza verticale a
          ogni pagina fisica generata dall'overflow, non solo alla prima
          e all'ultima del flusso. */}
      <Page size="A4" style={styles.pageContent}>
        <Column />

        <View style={styles.contentWrapper}>
          {/* Titolo e piatti sono fratelli diretti (niente View per
              categoria che li avvolga): il motore di paginazione di
              react-pdf valuta l'orphan-guard (minPresenceAhead) contro
              i "fratelli precedenti nello stesso livello" — annidare il
              titolo dentro un wrapper lo rende artificialmente il primo
              figlio di quel wrapper, azzerando la protezione ogni volta
              che il wrapper stesso viene spezzato a fine pagina. Bug
              verificato empiricamente in fase di test: senza questo
              appiattimento, i titoli di categoria restavano orfani in
              fondo pagina esattamente nei casi che minPresenceAhead
              dovrebbe prevenire. */}
          {categorie.flatMap((cat) => [
            <Text
              key={`${cat.id}-title`}
              style={styles.categoryTitle}
              minPresenceAhead={CATEGORY_ORPHAN_GUARD}
            >
              {cat.nome}
            </Text>,
            ...cat.piatti.map((piatto) => {
              const hasMeta = piatto.badges.length > 0 || piatto.allergeni.length > 0;
              const allergeniOrdinati = [...piatto.allergeni].sort((a, b) => a - b);

              return (
                <View key={piatto.id} wrap={false} style={styles.dishBlock}>
                  <View style={styles.dishRow}>
                    <Text style={styles.dishName}>{piatto.nome}</Text>
                    {piatto.prezzo != null && (
                      <Text style={styles.dishPrice}>
                        {formatPrezzo(piatto.prezzo, piatto.prezzo_variabile)}
                      </Text>
                    )}
                  </View>

                  {piatto.descrizione && (
                    <Text style={styles.dishDescription}>{piatto.descrizione}</Text>
                  )}

                  {hasMeta && (
                    <View style={styles.metaRow}>
                      {piatto.badges.map((badge, index) => (
                        <Text key={index} style={styles.badge}>
                          {badge}
                        </Text>
                      ))}
                      {allergeniOrdinati.length > 0 && (
                        <Text style={styles.allergenCodes}>
                          {allergeniOrdinati.join(" ")}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            }),
          ])}
        </View>
      </Page>

      {/* Pagina di chiusura: componente Page a sé stante, non una
          sezione in coda al flusso — è sempre l'unico contenuto della
          sua pagina, indipendentemente da quanto spazio resta dopo
          l'ultima categoria. */}
      <Page size="A4" style={styles.pageContent}>
        <Column />

        <View style={styles.contentWrapper}>
          <Text style={styles.legendTitle}>
            {lang === "en" ? "Allergens" : "Allergeni"}
          </Text>
          <View style={styles.allergenGrid}>
            <View style={styles.allergenColumn}>
              {allergeniLeft.map((a) => (
                <Text key={a.id} style={styles.allergenItem}>
                  <Text style={styles.allergenNumber}>{a.id} </Text>
                  {a.nome}
                </Text>
              ))}
            </View>
            <View style={styles.allergenColumn}>
              {allergeniRight.map((a) => (
                <Text key={a.id} style={styles.allergenItem}>
                  <Text style={styles.allergenNumber}>{a.id} </Text>
                  {a.nome}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.thankYouBlock}>
            <Text style={styles.thankYouText}>{thankYouText}</Text>
          </View>

          <View style={styles.qrBlock}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- Image di @react-pdf/renderer (PDF), non next/image: non ha prop "alt" */}
            <Image src={qrCodeDataUrl} style={styles.qrImage} />
            <Text style={styles.qrCaption}>
              {lang === "en" ? "Scan to subscribe" : "Inquadra per iscriverti"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
