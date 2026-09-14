<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Flow B fan-out — Worker B, hands-off)
  writtenAt:        2026-09-14T23:35:00Z
  page:             nb-bank-privat-kundeservice-kontakt-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat/kundeservice/kontakt.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-privat-kundeservice-kontakt-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-privat-kundeservice-kontakt-html.json
    - stardust/current/pages/nb-bank-privat-kundeservice-kontakt-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/prototypes/ARCHETYPE-BRIEF.md, nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/nb-bank-privat-html-improvements.md
    - impeccable reference/operate.md, craft-floor.md
  conceptSeed:      surface roll key 1876b3a6 (mode operate) — dealt 7, 2, 1 of the ordered structure list; 7 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component (variant privat), canon chrome
    - bank-router — absent on the captured page (no `.bank-choice`); the builder injects none (`router:false`)
    - hero — `main > div.columns-grid` #1: `img` radgiver-sirkel-3.png (498×498, captured aria-hidden) · h1 "Kontakt oss" · 2 p (`span.lead-blue`) · `a.secondary-btn` "Kontakt for bedrifter"
    - directory — `main > div.background-container`: `table` (caption "Finn din bank" visually-hidden; thead 3 cells; 12 rows: bank kontakt page link · phone · mailto / contact link) + `div.text` "Andre selskaper vi samarbeider med" + 2 links (Fremtind, LOfavør); empty p dropped
    - quick-help — `main > div.tip .ffe-message-box--info`: h2 "Trenger du rask hjelp?" + p (hours)
    - utvikling — `main > div.columns-grid` #2: h3 "Kontakt SpareBank 1 Utvikling DA" + 3 p with `<b>` terms (Postadresse · Besøksadresse · Telefon / Organisasjonsnummer)
    - footer — site-wide system-component (contact row + columns + legal), canon chrome
  antiTemplatePass:
    - { pattern: "contact hero (centered portrait + title)", defaultReflex: "centered stack with a round avatar", alternatives: ["centered as captured", "4/8 split: circle portrait left, H1 + two leads + secondary right (left-anchored canon hero rule)", "type-only header"], picked: "4/8 split, portrait left", rationale: "the captured PNG is already a circle portrait — DESIGN: portraits are circles; kept at content scale (340 px) beside its words; the one action is the secondary route to bedrift" }
    - { pattern: "bank directory table", defaultReflex: "striped data table in a card", alternatives: ["captured 65 % bordered table", "3/9 split on the help paper: sticky 'Finn din bank' heading left, hairline table right, phone numbers tabular + tel: links, stacked rows at ≤ 640", "12 cards"], picked: "3/9 split hairline table", rationale: "Operate: a directory is a table; Frost-30 is the kundeservice paper; the captured visually-hidden caption becomes the visible movement heading (same string); tel: links serve the phone scene (A4)" }
    - { pattern: "info message box", defaultReflex: "centered bordered box", alternatives: ["captured centered box", "`.callout` (Sand-30, bulb) bounded at 68ch + icon column", "plain paragraph"], picked: "`.callout`", rationale: "canon tip vocabulary; Sand after Frost — never the same tint adjacent" }
    - { pattern: "address block (3 centered columns)", defaultReflex: "three centered text columns", alternatives: ["captured centered columns", "definition list: term (medium, Fjell) over lines, hairline-topped, 3 → 2 → 1 columns", "single paragraph"], picked: "definition list", rationale: "semantic dt/dd for address, phone, org number; tabular numerals; no card" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: directory, paper: Frost-30, purpose: "the kundeservice / help paper carries the alliance directory (captured beige ground → cool paper so the Sand callout below stays distinct)" }
      - { section: quick-help, paper: Sand-30 (callout only, not a band), purpose: "tip vocabulary" }
  voiceClassification:
    - { section: header, classification: captured-verbatim; "Meny" = direction-authorized chrome }
    - { section: hero, classification: captured-verbatim }
    - { section: directory, classification: captured-verbatim (caption "Finn din bank" shown as h2; header cells as th; phone strings verbatim with added tel: hrefs) }
    - { section: quick-help, classification: captured-verbatim }
    - { section: utvikling, classification: captured-verbatim (h3 → h2 for outline; b terms → dt) }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "circle portrait radgiver-sirkel-3.png", mechanism: "340 px circle beside the H1 (240 at 768, 38 % width beside the H1 at ≤ 640), eager/high", fallback: "text stands alone" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-privat-kundeservice-kontakt-html
url: https://www.sparebank1.no/nb/bank/privat/kundeservice/kontakt.html
register: brand
mode: operate
surprise: low
dominantDimension: composition/directory-page
---

# Page shape: nb-bank-privat-kundeservice-kontakt-html (utility — contact)

Structure list (ordered by resonance) for the surface roll 1876b3a6: 1 channel-first (the five contact channels lead) · 2 bank picker first (postcode → your bank) · 3 map-and-list · 4 single reading column · 5 two-track privat / bedrift · 6 accordion per bank · **7 directory page — portrait + H1, the alliance directory as a table on the help paper, hours callout, the shared company's address block (dealt lead — built)**. Dealt alternates 2 and 1 recorded, not built (2 would duplicate the canon router, absent on this page by capture).

## Sections (in render order)

1. **header** (canon) — privat variant. No router (captured page has none).
2. **hero** (module `hero-portrait`) — Hvit; 4/8: circle portrait (340 px, eager/high — the LCP) left; H1 "Kontakt oss" (headline) + two leads + secondary "Kontakt for bedrifter" right. ≤ 640: H1 beside the portrait (38 % width), leads and CTA below.
3. **directory** (module `bank-table`, 12 rows) — Frost-30; 3/9: h2 "Finn din bank" (captured caption string, sticky ≥ 1024) left; table right — header row in Label (Koksgrå), row header = bank link (Fjell, medium), phone as tabular `tel:` link (text verbatim), third column the captured mailto / contact link; hairline rows in Frost. ≤ 640: header row visually hidden, each row a 2-line block (bank · phone / contact). Below the table: h3 "Andre selskaper vi samarbeider med" + 2 links.
4. **quick-help** (module `callout`) — Hvit movement (48 px above), one Sand-30 `.callout` bounded at 68ch + icon column: h2 (title-sm) + p (hours).
5. **utvikling** (module `address-block`) — Hvit; h2 "Kontakt SpareBank 1 Utvikling DA" (title) + `<dl>` 3 → 2 → 1 columns: Postadresse · Besøksadresse · Telefon · Organisasjonsnummer (dt medium Fjell, dd tabular).
6. **footer** (canon) — the "Kontakt oss" contact row keeps its five channels (the page's own H1 "Kontakt oss" is the alliance directory; the row is the site-wide channel set — both stay, different modules).

## Layout strategy

- Container 1280; hero `4fr 8fr` → 4/8 (768, portrait 240) → "h1 media / text text" (≤ 640); directory `3fr 9fr` → 1 col (≤ 1023); dl 3 → 2 → 1.
- Papers: Hvit → Frost-30 → Hvit (Sand callout) → Hvit. No `<hr>`. Two tinted surfaces, never the same tint adjacent.
- Operate: a real `<table>` with `caption`, `th scope`; tabular numerals; standard links.

## Key states

- Table row hover: none (rows are not links; the bank name is). Portrait plate offline in validation.

## Interaction model

- Every captured href verbatim (bank kontakt pages, mailto:, contact anchors, Fremtind, LOfavør, bedrift kontakt). Added: `tel:` hrefs on the 12 phone cells (enhancement, text unchanged — see § Open questions).

## Data attributes

- `section[data-section="hero"][data-intent="who we are, where to find us; route businesses"][data-layout="split-media"][data-media="image"][data-module="hero-portrait"]`
- `section[data-section="directory"][data-intent="find your bank: office page, phone, contact channel"][data-layout="contained"][data-module="bank-table"][data-items="12"]`
- `section[data-section="quick-help"][data-intent="opening hours for a fast answer"][data-layout="contained"][data-module="callout"]`
- `section[data-section="utvikling"][data-intent="contact the alliance's shared company"][data-layout="contained"][data-module="address-block"][data-items="3"]`
- `body[data-template="static"]`

## Unsourced content (placeholder list)

(none).

## Unsourced / Excluded from the content gate

- Nothing excluded. The captured empty `<p>` before "Andre selskaper…" is dropped (no text). The info-box "i" glyph is replaced by the canon bulb.

## Open questions for craft (resolved in render)

- Phone numbers as `tel:` links: the captured cells are plain text; hrefs are added (12), text verbatim. Rationale: A4 scene (on a phone, mid-task) and PRODUCT.md "self-service before contact". The lead may strike this if "every href verbatim" is read as "no new hrefs".
- Captured `h3` "Kontakt SpareBank 1 Utvikling DA" rendered as `h2` (the page outline has no h2 between H1 and it); text verbatim.
- The captured table caption is visually hidden; rendered visibly as the movement heading (same string) and kept as a visually-hidden `<caption>` for the table.

## Validation (final clean pass)

- `validate-prototype.mjs`: PASS — 0 P0/P1 at 1440 / 768 / 390 (console clean, no network failures, no overflow, landmarks, alt/labels, 1 h1, 0 heading skips, 0 low-contrast nodes, LCP = circle portrait eager/high, burger + Escape; "no-primary-cta" is expected — the page's one action is the secondary route to bedrift); 360 nav audit clean. Heights 390: 4758 · 768: 3179 · 1440: 2910 (captured live page: 3472 at 1440). Remaining P2: one canon sub-40 px target (office-search label) — advisory.
- `content-check.mjs`: PASS — 55 texts, 195 hrefs, 3 images verbatim; 0 missing. Excluded by rule only: `href="#/"`, decoration SVGs. Added (not captured): 12 `tel:` hrefs on the directory phone cells, text verbatim — see § Open questions.
- `impeccable detect --json`: 5 × cramped-padding on `.movement` / `.hdr-utility` / `.contact` / `.footer-*` — static-CSS misreads of `padding-block`; dismissed. Nothing else.
- Vision gate (Worker B, 3 viewports vs `stardust/current/assets/screenshots/nb-bank-privat-kundeservice-kontakt-html.png`): pass — the directory reads as one calm table on the help paper; portrait at content scale beside its words; the page's "Kontakt oss" (alliance directory) and the footer's "Kontakt oss" (five channels) read as distinct modules.
- `data-deviation` elements: none. Page-local rules the canon lacks: `.title` (type class named in DESIGN.md, absent from `cssBase()`) — filed in `canon-requests.md`.

## Review (impeccable finish reviewer, fresh context, code-led)

- Round 1 disposition **fix** — 7 items (2 material, 5 minor): (1) bank-name and `tel:` links rendered as static text (no underline, Fjell/Svart — WCAG 1.4.1); (2) `h2.title` had no rule → rendered at headline-sm, same size as "Finn din bank"; (3) 4 address pairs in a 3-column dl orphaned the org number; (4) undefined `--fjell-30` token shipped an off-palette fallback; (5) mobile contact link shrunk to 14 px; (6) 4/8 hero grid left ~135 px between the 340 px circle and the text; (7) trailing nbsp inside the "Kontakt LOfavør" anchor. All applied in one batch (base link treatment on the table anchors; `.title` rule; `repeat(4)`; `var(--frost)`; 16 px + 4 px padding; `340px minmax(0,1fr)`; `rich()` trims anchor-edge whitespace — also applied to the other three Worker B modules).
- Verdict pass: **ship** — 7/7 resolved, no regressions. Reviewer note: the directory now carries 36 underlined links and reads as a link grid — the correct reading for an Operate contact directory; the Medium row header keeps the hierarchy.
- Kept per the reviewer: the Frost-30 3/9 directory as a real hairline table with the sticky "Finn din bank" heading, tabular numerals, and the Hvit → Frost → (Sand callout) → Hvit paper rhythm.
