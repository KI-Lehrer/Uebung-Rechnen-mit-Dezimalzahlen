---
name: arbeitsblatt-generator-core
description: "Erstellt druckfertige DIN A4 Arbeitsblätter (HTML) für Lehrkräfte — direkt aus dem Prompt, ohne Rückfragen. Für allgemeinbildende Schulen (Sek I/II). Für Klasse 1–4 → SKILL-Grundschule. Für Berufsschulen → SKILL-BBS."
---

# Arbeitsblatt-Generator 2.0

**Keine Punktevergaben** auf dem Arbeitsblatt.

## Schritt 1: Kontext-Scan & Eingaben

Bevor du fragst, scanne das aktuelle Arbeitsverzeichnis und den Projektordner proaktiv nach bereits vorhandenen Dokumenten.

### 1a. Bildungsplan / Kompetenzdokument suchen

Suche mit Glob und Grep nach Dateien, die auf einen Bildungsplan oder Lehrplan hindeuten:
- Dateinamen mit: `bildungsplan`, `lehrplan`, `curriculum`, `kompetenz`, `rahmenlehrplan`, `kerncurriculum`, `fachanforderung`
- Dateitypen: `.md`, `.txt`, `.pdf`, `.docx`, `.html`
- Auch Unterordner einbeziehen

Wird eine passende Datei gefunden: Lese sie, nutze sie als Grundlage und informiere die Lehrkraft kurz:
> „Ich habe im Projektordner einen Bildungsplan gefunden und verwende ihn als Grundlage: [Dateiname]"

Wird keine Datei gefunden und kein Anhang übergeben, fordere ihn an:
> „Bitte hänge einen Bildungsplan, Lehrplan oder ein anderes Dokument an, aus dem die Kompetenzen und Lernziele für dieses Fach und diese Klassenstufe hervorgehen."

### 1b. Klassenkontext-Datei suchen

Suche parallel nach einer Klassenkontextdatei:
- Dateinamen mit: `klassenkontext`, `klasse`, `lerngruppe`, `schüler`, `schuelerprofil`, `klassenprofil`
- Auch Unterordner einbeziehen

Wird eine passende Datei gefunden: Lese sie, nutze sie und informiere kurz:
> „Ich habe im Projektordner eine Klassenkontextdatei gefunden: [Dateiname]"

Wird keine gefunden: Klassenkontext ist **kein Blocker** — fahre ohne ihn fort.

### 1c. Differenzierungscheck

Sobald der Klassenkontext vorliegt, analysiere ihn auf Heterogenitätssignale:

**Trigger-Signale — automatische Differenzierung wenn:**
- Leistungsniveaus erwähnt: `schwach`, `stark`, `mittel`, `gemischt`, `heterogen`
- DaZ-Anteil beschrieben: `DaZ`, `Deutsch als Zweitsprache`, `Sprachförderung`
- Förderbedarf genannt: `Förderbedarf`, `LRS`, `inklusiv`

**Entscheidungsregel:**

| Klassenkontext | Ausgabe |
|----------------|---------|
| Homogen / ein Niveau | 1 Arbeitsblatt |
| Heterogen / 2+ Niveaus oder DaZ/Förderbedarf | Automatisch differenzierte Versionen |

**Niveaustufen (max. 3):**

| Stufe | Label | Für wen |
|-------|-------|---------|
| Basis | `_basis` | Leistungsschwach, DaZ, Förderbedarf |
| Standard | `_standard` | Mittleres Niveau |
| Erweiterung | `_erweiterung` | Leistungsstark |

Erstelle nur die Stufen, die der Klassenkontext hergibt. Informiere die Lehrkraft kurz vor der Generierung.

## Schritt 2: Validierung & Generierung

Prüfe anhand des Bildungsplans und Klassenkontexts:
- Liegen die Aufgaben im vorgesehenen Kompetenzbereich?
- Ist Sprache und Komplexität dem Niveau angemessen?
- Passen die gewählten Komponenten zum Schultyp und Fach?
- Ist die Aufgabenmenge auf einer A4-Seite realistisch bearbeitbar?

Generiere das Arbeitsblatt, sobald du zu **95 % sicher** bist. Passe Aufgaben aktiv an wenn nötig — frage nicht nach. Schreibe direkt den vollständigen, druckfertigen HTML-Code.

---

## Kreativität & Hybride Elemente

Nutze deine HTML/CSS-Fähigkeiten voll aus — nicht nur starre Vorlagen befüllen:

- **Kreativ-Wildcard:** Baue pro Arbeitsblatt mindestens eine innovative oder unkonventionelle Komponente ein, wenn das Thema es hergibt (z.B. Fake-Zeitungsartikel, simulierter Chat-Verlauf, Steckbrief im Quartett-Design, interaktives Terminal-Prompt).
- **QR-Codes:** Binde dynamische QR-Codes ein (z.B. `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=URL`) für gestufte Hilfen, multimediale Links oder Lösungsblätter.
- **On-the-Fly SVG:** Programmiere native `<svg>`-Grafiken direkt im HTML (Diagramme, Koordinatensysteme, Stromkreise, Zeitstrahlen) — ohne externe Bilddateien.

---

## Differenzierungsmatrix

Differenzierung bedeutet: **gleicher Inhalt, gleiches Lernziel — unterschiedliche Zugänglichkeit.** Das Aufgabenformat folgt dem Fach — nicht der Stufe.

### Dimension 1: Kognitive Anforderung

| Stufe | Denkniveau | Leitfrage |
|-------|-----------|-----------|
| Basis (★) | Erinnern, Verstehen | „Was ist ...?", „Benenne ...", „Ordne zu ...", „Erkläre mit eigenen Worten ..." |
| Standard (★★) | Anwenden, Analysieren | „Wende an ...", „Vergleiche ...", „Erkläre den Zusammenhang ...", „Berechne ..." |
| Erweiterung (★★★) | Bewerten, Gestalten, Transfer | „Beurteile ...", „Entwickle ...", „Was wäre wenn ...", „Begründe deine Position ..." |

### Dimension 2: Sprachliche Komplexität

| Stufe | Prinzip |
|-------|---------|
| Basis (★) | Kurze, eindeutige Sätze. Aktiv statt Passiv. Fachbegriffe immer erklärt oder in einer Glossar-Box. |
| Standard (★★) | Fachsprache eingeführt, aber nicht vorausgesetzt. Fachbegriffe im Kontext verständlich. |
| Erweiterung (★★★) | Vollständige Fachsprache. Fachbegriffe werden vorausgesetzt. |

Bei hohem DaZ-Anteil: Basis-Version erhält zusätzlich eine zweisprachige Schlüsselwortliste oder Bildunterstützung.

### Dimension 3: Scaffolding

| Stufe | Prinzip |
|-------|---------|
| Basis (★) | Klare Schritte vorgegeben. Hilfestellungen direkt in der Aufgabe (Hinweissatz, Formelgerüst, Teilschritte). |
| Standard (★★) | Strukturierung reduziert. Einzelne Hinweise vorhanden, aber nicht durchgängig. |
| Erweiterung (★★★) | Kein Scaffolding. Offene Aufgabenstellung. SuS wählen Vorgehen selbst. |

### Dimension 4: Offenheit & Produkttyp

| Stufe | Prinzip |
|-------|---------|
| Basis (★) | Klares, erwartbares Ergebnis. Enger Lösungsraum. |
| Standard (★★) | Begründungen oder eigene Beispiele gefordert. |
| Erweiterung (★★★) | Offenes Produkt: eigene Meinung, Transfer auf neue Kontexte, Metareflexion. |

### Dimension 5: Umfang & Tiefe

| Stufe | Prinzip |
|-------|---------|
| Basis (★) | 3–4 Aufgaben, Fokus auf Kerninhalt. |
| Standard (★★) | 4–5 Aufgaben, Kerninhalt plus eine Vertiefungsaufgabe. |
| Erweiterung (★★★) | 4–5 Aufgaben, letzte gehen deutlich in Tiefe oder Breite. Bonusaufgabe möglich. |

**Kennzeichnung (beim Drucken unsichtbar):**
```html
<span class="niveau-badge">★☆☆</span>  <!-- Basis -->
<span class="niveau-badge">★★☆</span>  <!-- Standard -->
<span class="niveau-badge">★★★</span>  <!-- Erweiterung -->
```
```css
.niveau-badge { color: #bbb; font-size: 8pt; }
@media print { .niveau-badge { display: none; } }
```

---

## Pflichtstruktur

1. **Header:** Vollständiges Kopfzeilen-Design (siehe unten)
2. **Instruktions-Block:** Klarer Arbeitsauftrag (kursiv)
3. **Aufgaben** mit Titeln und Schreibfeldern
4. **Footer:** OER-Lizenz (CC BY-SA 4.0), außer anders angegeben
5. **Druckknopf:** Immer einbauen — wird beim Drucken ausgeblendet

---

## CSS-Pflichtregeln

```css
@page { size: A4; margin: 15mm 20mm 28mm 20mm; }
/* Unterer Rand 28mm: erhöhter Druckpuffer — verhindert Überfließen auf Folgeseite */

@media print { .print-btn { display: none; } }
body { font-family: Arial, sans-serif; font-size: 11pt; }

/* Aufgaben nie mitten im Druck zerreißen */
.aufgabe, .box, .ausschneid-grid, .ich-kann { page-break-inside: avoid; }

/* Seiten-Wrapper für mehrseitige Arbeitsblätter */
.seite { page-break-after: always; }
.seite:last-child { page-break-after: auto; }

/* Screen-only: visueller Seiten-Trennstrich als Planungshilfe */
@media screen {
  .seite { border-bottom: 2.5px dashed #ddd; padding-bottom: 8mm; margin-bottom: 12mm; }
}
```

Druckknopf:
```html
<button onclick="window.print()" class="print-btn">Drucken / Als PDF speichern</button>
```

---

## Seitenplanung & Drucksicherheit

### Nutzbare Druckfläche pro Seite

| Maß | Wert |
|-----|------|
| A4-Höhe | 297 mm |
| Rand oben | 15 mm |
| Rand unten | 28 mm |
| Verfügbarer Inhaltsbereich | ~254 mm |
| Sicherheitsabzug (Browserabweichungen) | −15 mm |
| **Sicher nutzbares Limit** | **~239 mm** |

### Referenz-Höhen der Komponenten

| Komponente | Höhe |
|------------|------|
| Header (Kopfzeile) | ~30 mm |
| Aufgaben-Kopf + 4 Schreiblinien | ~30 mm |
| Aufgaben-Kopf + 6 Schreiblinien | ~38 mm |
| Box (Tipp / Merk / Info / Achtung) | ~14 mm |
| Tabelle (3–4 Zeilen) | ~22 mm |
| T-Chart | ~38 mm |
| Venn-Diagramm | ~55 mm |
| Ablaufkette (3 Schritte) | ~35 mm |
| Ausschneidegitter (2 Zeilen) | ~45 mm |
| Ich-kann-Leiste | ~14 mm |
| Footer | ~8 mm |

### Regeln für drucksichere Arbeitsblätter

1. **80%-Regel:** Fülle nie mehr als ~190 mm pro Seite. Lieber eine Aufgabe auf die nächste Seite als ein abgeschnittenes Ende.
2. **Seiten-Wrapper:** Jede Druckseite in `<div class="seite">` einschließen.
3. **Mehrseiter:** Berechne vor dem Schreiben, wie viele Seiten benötigt werden. Schätze Höhen anhand der Tabelle oben.
4. **Nie raten:** Bei vielen Schreiblinien oder großen Grafiken lieber eine Seite früher wechseln.

```html
<!-- Beispiel: zweiseitiges Arbeitsblatt -->
<div class="seite">
  <!-- Seite 1: Header + Aufgaben 1–3 -->
</div>
<div class="seite">
  <!-- Seite 2: Aufgaben 4–5 + Ich-kann-Leiste + Footer -->
</div>
```

---

## Kopfzeilen-Design

Jedes Arbeitsblatt bekommt diesen strukturierten Header. Er ist das einzige feste visuelle Element — alles andere folgt dem Fach und Thema.

### HTML
```html
<header class="ab-header">
  <div class="ab-header-top">
    <div class="ab-header-left">
      <div class="ab-icon">🌿</div>  <!-- Fach-Icon: siehe Tabelle unten -->
      <div class="ab-meta">
        <span class="ab-fach-label">BIOLOGIE · KLASSE 8</span>
        <h1 class="ab-titel">Photosynthese</h1>
        <p class="ab-untertitel">Wie stellen Pflanzen ihre eigene Nahrung her?</p>
        <!-- ab-untertitel nur wenn Leitfrage / Themeneinordnung vorhanden -->
      </div>
    </div>
    <div class="ab-niveau">★ Basis-Version</div>
    <!-- ab-niveau nur bei differenzierten Versionen; beim Drucken ausgeblendet -->
  </div>
  <hr class="ab-linie">
  <div class="ab-felder">
    <span>Name: <span class="ab-feld"></span></span>
    <span>Klasse: <span class="ab-feld"></span></span>
    <span>Datum: <span class="ab-feld"></span></span>
  </div>
</header>
```

### CSS
```css
:root { --fach: #2a6e2a; }  /* Farbe aus Tabelle unten wählen */

.ab-header { margin-bottom: 6mm; }
.ab-header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3mm; }
.ab-header-left { display: flex; align-items: center; gap: 4mm; }
.ab-icon { width: 13mm; height: 13mm; border-radius: 50%; flex-shrink: 0; background: color-mix(in srgb, var(--fach) 12%, white); display: flex; align-items: center; justify-content: center; font-size: 17pt; }
.ab-fach-label { display: block; font-size: 7.5pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--fach); margin-bottom: 1mm; }
.ab-titel { font-size: 20pt; font-weight: 900; color: var(--fach); margin: 0; line-height: 1.1; }
.ab-untertitel { font-size: 9.5pt; color: #555; font-style: italic; margin: 1.5mm 0 0 0; }
.ab-niveau { font-size: 8pt; color: #aaa; font-style: italic; text-align: right; white-space: nowrap; padding-top: 1mm; }
@media print { .ab-niveau { display: none; } }
.ab-linie { border: none; border-top: 2.5px solid var(--fach); margin: 3mm 0; }
.ab-felder { display: flex; gap: 10mm; font-size: 9.5pt; color: #444; }
.ab-feld { display: inline-block; width: 35mm; border-bottom: 1px solid #999; margin-left: 1.5mm; }
```

### Fachfarben & Icons

| Fach | `--fach` | Icon |
|------|----------|------|
| Biologie | `#2a6e2a` | 🌿 |
| Deutsch | `#c0392b` | ✏️ |
| Mathematik | `#1a5fa8` | 📐 |
| Physik | `#1a3a6e` | ⚡ |
| Chemie | `#6c3483` | 🧪 |
| Geschichte | `#7d5a2e` | 📜 |
| Englisch | `#1a7a6e` | 🌍 |
| Geographie | `#2e7d32` | 🗺️ |
| Kunst | `#8e44ad` | 🎨 |
| Musik | `#b7770d` | 🎵 |
| Sport | `#c0392b` | ⚽ |
| Informatik | `#2c3e50` | 💻 |
| Wirtschaft / BWL | `#1e6b35` | 📊 |
| Ethik / Religion | `#5d4037` | 🕊️ |
| Sonstige | `#37474f` | 📄 |

Kein passendes Fach? Wähle eine thematisch naheliegende Farbe. Nie Grau — immer farbig.

---

## Komponenten

### Aufgabennummer

Jede Aufgabe bekommt eine nummerierte Badge-Zeile. Farbe erbt aus `--fach`.

```html
<div class="aufgabe">
  <div class="aufg-kopf">
    <span class="aufg-nr">1</span>
    <span class="aufg-typ">✏️</span>  <!-- Aufgabentyp-Badge: siehe Tabelle unten -->
    <span class="aufg-titel">Lies den Text und beantworte die Fragen.</span>
  </div>
  <!-- Aufgabeninhalt hier -->
</div>
```
```css
.aufgabe { margin: 5mm 0; }
.aufg-kopf { display: flex; align-items: center; gap: 2.5mm; margin-bottom: 2mm; }
.aufg-nr { width: 7mm; height: 7mm; border-radius: 50%; flex-shrink: 0; background: var(--fach); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10pt; line-height: 1; }
.aufg-typ { font-size: 11pt; line-height: 1; }
.aufg-titel { font-style: italic; font-size: 10pt; color: #333; }
```

**Aufgabentyp-Icons:**

| Icon | Aufgabentyp |
|------|-------------|
| ✏️ | Schreiben / Ausfüllen |
| 📖 | Lesen / Analysieren |
| 🧠 | Nachdenken / Beurteilen |
| 🤝 | Partnerarbeit |
| 👥 | Gruppenarbeit |
| 🔢 | Rechnen / Berechnen |
| 🎨 | Zeichnen / Gestalten |
| 🔬 | Beobachten / Experimentieren |
| 💬 | Diskutieren / Sprechen |
| ✂️ | Ausschneiden / Basteln |

Badge weglassen wenn kein eindeutiger Typ — lieber kein Icon als ein falsches.

---

### Boxen-System

Vier Box-Typen für unterschiedliche Funktionen.

```html
<!-- Tipp-Box: Strategie- oder Lösungshinweis -->
<div class="box box-tipp">
  <span class="box-icon">💡</span>
  <div class="box-inhalt"><strong>Tipp:</strong> Schau dir zuerst die Überschriften an.</div>
</div>

<!-- Merksatz-Box: Regel, Definition, Formel -->
<div class="box box-merk">
  <span class="box-icon">📌</span>
  <div class="box-inhalt"><strong>Merke:</strong> Nomen schreibt man groß.</div>
</div>

<!-- Info-Box: Hintergrundwissen, Quellenhinweis -->
<div class="box box-info">
  <span class="box-icon">ℹ️</span>
  <div class="box-inhalt">Die Photosynthese findet in den Chloroplasten statt.</div>
</div>

<!-- Achtung-Box: häufige Fehler, wichtige Ausnahmen -->
<div class="box box-achtung">
  <span class="box-icon">⚠️</span>
  <div class="box-inhalt"><strong>Achtung:</strong> Nicht mit der Mitose verwechseln!</div>
</div>
```
```css
.box { display: flex; align-items: flex-start; gap: 3mm; border-radius: 5px; padding: 3mm 4mm; margin: 3mm 0; font-size: 10pt; }
.box-icon { font-size: 12pt; line-height: 1.4; flex-shrink: 0; }
.box-inhalt { flex: 1; line-height: 1.5; }
.box-tipp    { background: #fffbe6; border-left: 3px solid #f0b429; }
.box-merk    { background: color-mix(in srgb, var(--fach) 8%, white); border-left: 3px solid var(--fach); }
.box-info    { background: #e8f4fd; border-left: 3px solid #2980b9; }
.box-achtung { background: #fef0f0; border-left: 3px solid #e74c3c; }
```

---

### Wort-Chips

Einzelne Wörter als visuelle Karten — zum Sortieren, Zuordnen oder als Wortpool.

```html
<div class="wort-chips">
  <span class="chip">der Hund</span>
  <span class="chip chip-falsch">schön ✗</span>
  <span class="chip chip-richtig">das Buch ✓</span>
  <span class="chip chip-fach">Photosynthese</span>
</div>
```
```css
.wort-chips { display: flex; flex-wrap: wrap; gap: 2mm; margin: 3mm 0; }
.chip { border: 1.5px solid #ccc; border-radius: 4px; padding: 1mm 3mm; font-size: 9.5pt; background: white; white-space: nowrap; }
.chip-falsch  { border-color: #e74c3c; color: #e74c3c; }
.chip-richtig { border-color: #27ae60; color: #27ae60; }
.chip-fach    { background: color-mix(in srgb, var(--fach) 10%, white); border-color: var(--fach); color: var(--fach); font-weight: 700; }
```

---

### Ausschneidekarten

Karten zum Ausschneiden — für Zuordnungen, Vokabeln, Dominos.

```html
<p class="schneid-hinweis">✂️ Schneide die Karten aus.</p>
<div class="ausschneid-grid">
  <div class="ausschneid-karte">Begriff A</div>
  <div class="ausschneid-karte">Begriff B</div>
  <div class="ausschneid-karte">Begriff C</div>
  <div class="ausschneid-karte">Begriff D</div>
</div>
```
```css
.schneid-hinweis { font-size: 8.5pt; color: #888; margin-bottom: 2mm; }
.ausschneid-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
.ausschneid-karte { border: 1.5px dashed #bbb; padding: 5mm 4mm; min-height: 18mm; font-size: 10pt; text-align: center; display: flex; align-items: center; justify-content: center; }
```
2 Spalten für größere Karten, 4 Spalten für Vokabel-Sets. Karten können Text, Formeln oder kleine SVG-Grafiken enthalten.

---

### Ich-kann-Leiste

Selbsteinschätzung am Ende des Arbeitsblatts.

```html
<div class="ich-kann">
  <span class="ich-kann-label">Das kann ich:</span>
  <div class="ich-kann-kreise">
    <span class="ik-kreis"></span>
    <span class="ik-kreis"></span>
    <span class="ik-kreis"></span>
  </div>
  <span class="ich-kann-skala">
    <span>noch nicht</span>
    <span>mit Hilfe</span>
    <span>selbstständig</span>
  </span>
</div>
```
```css
.ich-kann { display: flex; align-items: center; gap: 4mm; margin-top: 6mm; padding-top: 3mm; border-top: 1px dashed #ccc; font-size: 9pt; color: #555; }
.ich-kann-label { font-weight: 700; white-space: nowrap; }
.ich-kann-kreise { display: flex; gap: 3mm; }
.ik-kreis { width: 6mm; height: 6mm; border-radius: 50%; border: 1.5px solid var(--fach); display: inline-block; }
.ich-kann-skala { display: flex; gap: 6mm; font-size: 8pt; color: #aaa; font-style: italic; }
```
Immer am Ende des Arbeitsblatts, direkt vor dem Footer. Nicht bei Leistungsüberprüfungen verwenden.

---

### Lückentext
```html
<p>Caesar war ein berühmter <span class="luecke"></span>.</p>
```
```css
.luecke { border-bottom: 1.5px solid #333; display: inline-block; width: 3cm; }
```

### Schreiblinien
```html
<span class="schreiblinie"></span>
```
```css
.schreiblinie { display: block; border-bottom: 1px solid #aaa; height: 8mm; margin-bottom: 1mm; width: 100%; }
```

### Quellentext mit Zeilennummern
```html
<div class="quellentext">
  <p>Erster Absatz des Quellentexts.</p>
  <p>Zweiter Absatz.</p>
</div>
```
```css
.quellentext { border-left: 3px solid #888; padding-left: 6mm; counter-reset: zeile; }
.quellentext p { counter-increment: zeile; position: relative; padding-left: 8mm; }
.quellentext p::before { content: counter(zeile); position: absolute; left: -10mm; color: #888; font-size: 8.5pt; }
```

### Kästchenpapier
```html
<div class="kaestchen"></div>
```
```css
.kaestchen { width: 100%; min-height: 40mm; background-image: repeating-linear-gradient(#ccc 0 1px, transparent 1px 5mm), repeating-linear-gradient(90deg, #ccc 0 1px, transparent 1px 5mm); background-size: 5mm 5mm; }
```

### Bilder / Grafiken
```html
<div class="bild-container">
  <img src="URL" alt="Beschreibung" style="max-width:100%;">
  <div class="bild-beschriftung">Abbildung 1: Kurzbeschreibung</div>
</div>
```

### Formeln (KaTeX)
KaTeX per CDN einbinden. `$e=mc^2$` inline, `$$\frac{a}{b}$$` als Block.

---

## Graphic Organizers

### T-Chart
```html
<div class="t-chart">
  <div class="t-col">
    <div class="t-header">Spalte A</div>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
  </div>
  <div class="t-divider"></div>
  <div class="t-col">
    <div class="t-header">Spalte B</div>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
  </div>
</div>
```
```css
.t-chart { display: flex; border: 1.5px solid #ccc; border-radius: 4px; overflow: hidden; }
.t-col { flex: 1; padding: 3mm 4mm; }
.t-header { font-weight: 700; font-size: 10pt; border-bottom: 2px solid var(--fach); color: var(--fach); padding-bottom: 2mm; margin-bottom: 3mm; }
.t-divider { width: 2px; background: #ccc; flex-shrink: 0; }
```

### Venn-Diagramm
```html
<div class="venn-wrap">
  <svg width="100%" height="55mm" viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg">
    <circle cx="145" cy="65" r="60" fill="rgba(30,58,95,0.08)" stroke="#1e3a5f" stroke-width="1.5"/>
    <circle cx="255" cy="65" r="60" fill="rgba(192,57,43,0.08)" stroke="#c0392b" stroke-width="1.5"/>
    <text x="100" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="#1e3a5f">Begriff A</text>
    <text x="300" y="20" text-anchor="middle" font-size="10" font-weight="bold" fill="#c0392b">Begriff B</text>
    <text x="200" y="110" text-anchor="middle" font-size="9" fill="#666">Gemeinsamkeiten</text>
    <line x1="75" y1="55" x2="135" y2="55" stroke="#aaa" stroke-width="1"/>
    <line x1="70" y1="68" x2="132" y2="68" stroke="#aaa" stroke-width="1"/>
    <line x1="75" y1="81" x2="135" y2="81" stroke="#aaa" stroke-width="1"/>
    <line x1="162" y1="55" x2="238" y2="55" stroke="#aaa" stroke-width="1"/>
    <line x1="160" y1="68" x2="240" y2="68" stroke="#aaa" stroke-width="1"/>
    <line x1="162" y1="81" x2="238" y2="81" stroke="#aaa" stroke-width="1"/>
    <line x1="265" y1="55" x2="325" y2="55" stroke="#aaa" stroke-width="1"/>
    <line x1="268" y1="68" x2="330" y2="68" stroke="#aaa" stroke-width="1"/>
    <line x1="265" y1="81" x2="325" y2="81" stroke="#aaa" stroke-width="1"/>
  </svg>
</div>
```
*Die zwei Kreisfarben sind bewusst fest — für visuelle Unterscheidung der beiden Seiten.*

### Ablaufkette
```html
<div class="ablauf-kette">
  <div class="ablauf-schritt">
    <div class="schritt-nr">1</div>
    <div class="schritt-feld"><span class="schreiblinie"></span></div>
  </div>
  <div class="ablauf-pfeil">▼</div>
  <div class="ablauf-schritt">
    <div class="schritt-nr">2</div>
    <div class="schritt-feld"><span class="schreiblinie"></span></div>
  </div>
  <div class="ablauf-pfeil">▼</div>
  <div class="ablauf-schritt">
    <div class="schritt-nr">3</div>
    <div class="schritt-feld"><span class="schreiblinie"></span></div>
  </div>
</div>
```
```css
.ablauf-kette { display: flex; flex-direction: column; gap: 1mm; }
.ablauf-schritt { display: flex; align-items: center; gap: 4mm; }
.schritt-nr { width: 8mm; height: 8mm; background: var(--fach); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 9pt; flex-shrink: 0; }
.schritt-feld { flex: 1; }
.ablauf-pfeil { padding-left: 4mm; color: #888; font-size: 12pt; line-height: 1; }
```

### Ursache-Wirkung
```html
<div class="uw-karte">
  <div class="uw-col">
    <div class="uw-label">Ursachen</div>
    <div class="uw-item"><span class="schreiblinie"></span></div>
    <div class="uw-item"><span class="schreiblinie"></span></div>
    <div class="uw-item"><span class="schreiblinie"></span></div>
  </div>
  <div class="uw-mitte">
    <div class="uw-ereignis">Ereignis</div>
    <div class="uw-pfeile">◀ ▶</div>
  </div>
  <div class="uw-col">
    <div class="uw-label">Wirkungen</div>
    <div class="uw-item"><span class="schreiblinie"></span></div>
    <div class="uw-item"><span class="schreiblinie"></span></div>
    <div class="uw-item"><span class="schreiblinie"></span></div>
  </div>
</div>
```
```css
.uw-karte { display: grid; grid-template-columns: 1fr auto 1fr; gap: 3mm; align-items: center; }
.uw-col { display: flex; flex-direction: column; gap: 2mm; }
.uw-label { font-weight: 700; font-size: 9.5pt; margin-bottom: 1mm; color: var(--fach); }
.uw-mitte { text-align: center; }
.uw-ereignis { border: 2px solid var(--fach); border-radius: 6px; padding: 3mm 5mm; font-weight: 700; font-size: 10pt; background: color-mix(in srgb, var(--fach) 5%, white); margin-bottom: 2mm; }
.uw-pfeile { font-size: 14pt; color: #aaa; }
```

### Frayer Model
```html
<div class="frayer">
  <div class="frayer-feld">
    <div class="frayer-label">Definition</div>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
  </div>
  <div class="frayer-feld">
    <div class="frayer-label">Eigenschaften</div>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
  </div>
  <div class="frayer-mitte">Begriff</div>
  <div class="frayer-feld">
    <div class="frayer-label">Beispiele</div>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
  </div>
  <div class="frayer-feld">
    <div class="frayer-label">Nicht-Beispiele</div>
    <span class="schreiblinie"></span>
    <span class="schreiblinie"></span>
  </div>
</div>
```
```css
.frayer { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr auto 1fr; border: 1.5px solid #ccc; border-radius: 6px; overflow: hidden; min-height: 65mm; }
.frayer-feld { padding: 3mm 4mm; border: 1px solid #e0e0e0; }
.frayer-label { font-weight: 700; font-size: 9pt; margin-bottom: 2mm; color: var(--fach); }
.frayer-mitte { grid-column: 1 / -1; text-align: center; font-weight: 900; font-size: 13pt; padding: 3mm; background: var(--fach); color: white; }
```
