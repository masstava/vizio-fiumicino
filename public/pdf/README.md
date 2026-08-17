# Immagini per il PDF orari

Questa cartella deve contenere due file, con questi nomi esatti:

- `orari-header.png` — fascia superiore (con marchio)
- `orari-footer.png` — fascia inferiore (contatto e QR)

Se questi file non sono presenti, `src/lib/pdf/OrariDocument.tsx` ripiega
automaticamente su una fascia a tinta piena con il wordmark testuale
"VIZIO" — nessun errore, ma il risultato non userà le immagini reali.

Per aggiungerli da GitHub: apri questa cartella nell'interfaccia web del
repository → "Add file" → "Upload files", trascina i due PNG con questi
nomi esatti, poi committa.
