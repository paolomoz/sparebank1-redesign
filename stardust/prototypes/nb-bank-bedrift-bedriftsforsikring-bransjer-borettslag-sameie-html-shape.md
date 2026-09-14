<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, archetype worker A — theme family)
  writtenAt:        2026-09-14T23:55:00Z
  page:             nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html
  pageUrl:          https://www.sparebank1.no/nb/bank/bedrift/bedriftsforsikring/bransjer/borettslag-sameie.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html.json
    - stardust/current/pages/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html.html (rendered DOM; outline via page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html.png
    - stardust/prototypes/ARCHETYPE-BRIEF.md, stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/dynamic-features.md (#5)
    - stardust/prototypes/nb-bank-privat-html-improvements.md
  conceptSeed:      surface roll key bedee1c8 (mode read) — dealt 4, 7, 5 of the ordered structure list; 4 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component, bedrift variant (BEDRIFT active; 8 market links; "Bli bedriftskunde" secondary; Logg inn), canon chrome
    - bank-router — absent (no `.bank-choice`); none rendered
    - backlink — `main > div.to-parent > a` "Forsikring"
    - hero — `main > div.aem-main-container > div.title > h1` "Forsikringer for boligselskap og beboere" + `main > div.text p` lead (captured centred, max-width)
    - compare — `main > div.background-container` (bg #FDF8F5): 2 featured `.card` (illustration 360×200 with descriptive alt · `div.checked-list`: h2 + 2 p + ul of 3 li [span.h5 a + span.subtle-text]) · `div.text p a` "Hva er forskjellen på borettslag og sameie?"
    - tip — `main > div.tip` (ffe-message-box--tips: h2 "Totaltilbud for boligselskap" + p + action "Få tilbud på boligbyggforsikring")
    - resident — `main > div.referance:nth-of-type(1)` (columns 7/4, bg #FDF8F5): h2 "Hva med meg som beboer?" + 2 p (inline links) + primary "Hva skjer ved skade?" + secondary "Forsikring for deg i leilighet" · illustration pappa-triller-barnevogn (descriptive alt)
    - claim — `main > div.image` (flamme-2.svg aria-hidden) + `main > div.text p` "Har du hatt uhell eller skade?" + `main > div.button a` action "Få veiledning og meld skade"
    - prevention — `main > div.referance:nth-of-type(2)` (bg #FDF8F5): h2 "Skadeforebygging og vedlikehold i boligsameier" + p + primary "Se skadeforebyggende råd" · photo waterguard-vannstopper (aria-hidden, 1211×903)
    - recommended — `main > div.columns-grid`: h2 "Anbefalt for boligselskap" + 3 `.card` (photo aria-hidden · title link · p)
    - feedback — `main > div.feedback` h2 "Hva synes du om denne siden?"
    - footer — canon chrome (5 contact tabs, Bedrift columns); `<hr>` ×3 dropped
  antiTemplatePass:
    - { pattern: "page title (centred H1 + centred lead)", defaultReflex: "centred stack", alternatives: ["centred stack (captured)", "left-anchored H1 + 60ch lead under a back-link", "H1 beside an illustration"], picked: "left-anchored H1 + lead", rationale: "direction bans the centred hero; no hero photo captured; the page's images belong to its modules" }
    - { pattern: "two featured cards (illustration + heading + checked list)", defaultReflex: "two white shadowed cards with check icons", alternatives: ["white cards (captured)", "two sheets side by side on one Sand-30 movement, no card chrome: illustration → h2 → prose → link list with description lines", "one long prose column"], picked: "two sheets on Sand-30, no chrome", rationale: "the with/without comparison is the page's spine (theme: read); side-by-side keeps the comparison legible, the paper carries the grouping instead of card chrome (#4); check glyphs dropped — the list is links with one-line descriptions, rendered as a definition-style list" }
    - { pattern: "tips message box (centred, icon on top)", defaultReflex: "centred info box", alternatives: ["centred box (captured)", "`.callout` left-anchored at 68ch with the bulb icon, h2 title-sm, p, the captured Skog action", "plain paragraph + button"], picked: ".callout", rationale: "canon tip module; 'Få tilbud på boligbyggforsikring' is a quote/apply flow → the captured Skog stays (One Action Rule)" }
    - { pattern: "text + illustration columns (Hva med meg som beboer?)", defaultReflex: "text left, illustration right, two equal buttons", alternatives: ["7/4 as captured on Sand", "7/5 split on Hvit: prose 68ch + primary/secondary pair, illustration as content on the right (descriptive alt kept)", "illustration first"], picked: "7/5 on Hvit", rationale: "captured Sand would be adjacent to the compare Sand (same tint adjacent, banned); the illustration has a real alt → content, not decoration" }
    - { pattern: "claim strip (icon + line + action)", defaultReflex: "centred icon over centred text over centred button", alternatives: ["centred stack (captured)", "left-anchored row: icon 56 px · title-sm line · one button, hairline top/bottom", "fold into the callout"], picked: "left-anchored row", rationale: "one axis per page (reviewer rule from the product archetype); 'meld skade' is a claim flow, not apply → Vann primary" }
    - { pattern: "prevention text + photo", defaultReflex: "text card left, thumbnail right", alternatives: ["Sand columns (captured)", "Frost-30 movement, 6/6 split: prose + primary · photo 3:2 with 48 px mask", "photo above text"], picked: "Frost-30 6/6", rationale: "advice/help paper (DESIGN.md Frost); the photo is the module's content at content scale (#6)" }
    - { pattern: "recommended cards ×3", defaultReflex: "white cards + chevron", alternatives: ["white cards (captured)", "three Sand-30 papers: photo 3:2 48 px mask, title-sm link, one line; whole card is the link", "text list"], picked: "Sand-30 papers", rationale: "canon card language; chevrons dropped" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: compare, paper: Sand-30, purpose: "captured #FDF8F5 ground of the with/without comparison — the page's core reading moment" }
      - { section: prevention, paper: Frost-30, purpose: "advice paper (help/tools); captured Sand would be the third warm tint" }
    note: "captured resident ground (#FDF8F5) NOT carried — adjacent to the compare Sand; rendered on Hvit"
  voiceClassification:
    - { section: header, classification: captured-verbatim }
    - { section: backlink, classification: captured-verbatim }
    - { section: hero, classification: captured-verbatim }
    - { section: compare, classification: captured-verbatim (h2 "Uten felles bygningsforsikring" keeps its captured <u> emphasis) }
    - { section: tip, classification: captured-verbatim }
    - { section: resident, classification: captured-verbatim }
    - { section: claim, classification: captured-verbatim }
    - { section: prevention, classification: captured-verbatim }
    - { section: recommended, classification: captured-verbatim }
    - { section: feedback, classification: captured-verbatim ("Ja"/"Nei" visually-hidden) }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "flat spot illustrations bygg-tilpasset / rekkehus-tilpasset / pappa-triller-barnevogn", mechanism: "unmasked on paper at 320–420 px; descriptive alts kept (they are content on this page)", fallback: "text stands alone" }
    - { kind: site-wide-motif, capturedSource: "96px photo mask", mechanism: "48 px one-corner-pair mask on the prevention photo and the three recommended photos", fallback: "square photo" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html
url: https://www.sparebank1.no/nb/bank/bedrift/bedriftsforsikring/bransjer/borettslag-sameie.html
register: brand
mode: read
surprise: low
dominantDimension: composition/two-sheet-comparison
template: program
---

# Page shape: borettslag-sameie (theme archetype — bedrift header, no router; 4 theme pages fork from it)

Structure list (ordered by resonance) for the surface roll `bedee1c8` (read): 1 reading-room spread · 2 single column · 3 dossier · **4 two-sheet comparison, then an advice ladder (dealt lead — built)** · 5 checklist first · 6 photo essay · 7 FAQ-led. Dealt alternates 7 and 5 recorded, not built.

## Sections (in render order)

1. **header** (canon, bedrift variant) — "Forsikring" current; "Bli bedriftskunde" secondary; Logg inn.
2. **hero** (module `page-title`) — Hvit; back-link "‹ Forsikring" above; left-anchored h1 (headline) + lead (60ch).
3. **compare** (module `content-columns` ×2) — Sand-30; two sheets side by side (2 → 1): illustration (≈ 360×200, captured descriptive alt kept) → h2 (headline-sm; "Uten" keeps its `<u>`) → two body paragraphs (`.prose`) → link list: each item = title link (title cut) + one description line (Koksgrå). Under the sheets: the inline link "Hva er forskjellen på borettslag og sameie?" as `.btn-inline` with chevron.
4. **tip** (module `callout`) — Hvit; `.callout` (`icons.bulb`): h2 title-sm "Totaltilbud for boligselskap" + p + `.btn-action` "Få tilbud på boligbyggforsikring" (captured action, quote flow — the page's one Skog).
5. **resident** (module `split-media`) — Hvit; 7/5: h2 + prose (2 p with inline links) + primary "Hva skjer ved skade?" + secondary "Forsikring for deg i leilighet" · illustration pappa-barnevogn right (descriptive alt).
6. **claim** (module `cta-row`) — Hvit, hairline top + bottom: flamme icon (`aria-hidden`, captured) · p title-sm "Har du hatt uhell eller skade?" · `.btn-primary` "Få veiledning og meld skade" (captured action; claim flow ≠ apply → Vann).
7. **prevention** (module `split-media`) — Frost-30; 6/6: h2 + prose + primary "Se skadeforebyggende råd" · photo waterguard 3:2 48 px mask (captured `aria-hidden`, empty alt).
8. **recommended** (module `card-rail` ×3) — Hvit; h2 "Anbefalt for boligselskap"; three Sand-30 `.card`s 3 → 1: photo 3:2 48 px mask (aria-hidden as captured) · title-sm link · one line.
9. **feedback** (dynamics #5 static) — as canon.
10. **footer** (canon).

## Layout strategy

- Grids: compare `1fr 1fr` ≥ 768 → 1; resident `7fr 5fr`; prevention `1fr 1fr`; recommended 3 → 1. Prose 68ch everywhere.
- Papers: Hvit → Sand-30 → Hvit (tip, resident, claim) → Frost-30 → Hvit. Two tints, non-adjacent. Three captured `<hr>` dropped.
- One axis: everything left-anchored at the gutter (captured centred title / tip / claim re-anchored).
- One action per module: tip Skog; resident primary + secondary (captured pair); claim primary; prevention primary.

## Data attributes

- `section[data-section="hero"][data-intent="name the theme"][data-layout="contained"][data-module="page-title"]`
- `section[data-section="compare"][data-intent="with vs without shared building insurance"][data-layout="grid"][data-items="2"][data-module="content-columns"][data-media="image"]`
- `section[data-section="tip"][data-intent="offer: adviser review"][data-layout="contained"][data-module="callout"]`
- `section[data-section="resident"][data-intent="advice for residents"][data-layout="split-media"][data-media="image"][data-module="split-media"]`
- `section[data-section="claim"][data-intent="report a claim"][data-layout="contained"][data-module="cta-row"]`
- `section[data-section="prevention"][data-intent="advice: damage prevention"][data-layout="split-media"][data-media="image"][data-module="split-media"]`
- `section[data-section="recommended"][data-intent="related products"][data-layout="grid"][data-items="3"][data-module="card-rail"][data-media="image"]`
- `section[data-section="feedback"]…`, `body[data-template="program"]`

## Unsourced / excluded (for the lead)

- Captured `<p style="font-family: tahoma…">` inline styles and `.checked-list` check glyphs (CSS) — dropped; the list is links + description lines.
- `<hr>` ×3 — dropped (space + paper mark the changes).
- Illustration alts kept where descriptive (bygg, rekkehus, pappa-barnevogn); `flamme-2.svg` and the photos keep their captured `aria-hidden` / empty alt.
- No calculator, FAQ or router on this page.

## Review

Round 1 (impeccable:impeccable-finish-reviewer, same packet shape as canon): **fix-then-ship** — brand-fit 5 · hierarchy 4 · calm-vs-generic 4 · mobile 4 (768 rail) · craft floor 5. Material fixes, applied in one batch:
1. Recommended rail stayed 3-up at 768 (≈ 213 px cards) → 641–1023 renders one-column media rows (photo 3:2 at 40 % left, title + line right); 3-up only ≥ 1024; stacked ≤ 640.
2. Sand-30 callout sat same-tint 64 px under the Sand compare band → callout re-tinted Frost-30 (`.callout-frost`, `data-deviation` declared; canon `.callout` is Sand-only) and given equal air above/below.
3. Consecutive Hvit movements doubled the band padding (≈ 128 px) → `.resident{padding-top:0}`, `.claim{padding-top:0}`: one 64 px beat from the Sand band to the Frost band (reviewer measured 67 / 65 / 63 / 62).
4. The two comparison sheets did not align row-wise → `.sheets` four explicit rows + `.sheet{grid-row:span 4; grid-template-rows:subgrid}` with the link list lifted out of `.prose`; hairlines and first links share a line (y≈682 / 712 at 1440); subgrid released ≤ 767.
5. Resident primary and claim-row primary shared one href 300 px apart → resident pair rendered as two secondaries; the claim row owns the single Vann primary to meld-skade.
6. Duplicate `h3.panel-title` "Melde skade …" in the Ring oss panel → confirmed canon `footerHtml()` chrome (present on the canon page); canon request #6, not page-fixed.

Verdict pass: **ship** — brand-fit 5 · hierarchy 4 · calm-vs-generic 4 · mobile 5 · craft floor 5. No regressions found.

## Validation

- Harness: `nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 4/8/10; heights 8130/5599/4664` (P2 = canon office-search label 25 px). 360 nav `{"over":0,"minFont":14,"minGap":0,"collapse":"hamburger"}`. Smoke: burger open/aria/Esc, primary CTA (Skog quote action) keyboard-reachable; no `<details>` in main.
- Content gate: `content-check FAIL — checked text 69, hrefs 187, imgs 11; missing text 0, hrefs 2, imgs 1` — all three misses are **canon chrome** on the bedrift variant: header `https://kundeforsikring.sparebank1.no` "Til forsikring" (login-cluster link with no `headerData()` slot — canon request #4), footer `tel:+4791502300` "Ring fra utland" (top-block sub-number read as plain text by `footerData()` — canon request #5), header `logo-sparebank1.svg` (logo rendered as inline SVG by canon — canon request #3). Main region: 0 text / 0 hrefs / 0 imgs missing.
- Detect: 8 × `cramped-padding` (warning) — static-CSS misreads of `padding-block: var(...)` on `.movement`/`.hdr-utility`/`.footer-*`/`.feedback`/`.contact`/`.claim-row` — dismissed; nothing else.
- Reviewer disposition: ship (see § Review).
- Viewport heights: 1440 → 4664 · 768 → 5599 · 390 → 8130.
- `data-deviation` elements: 1 × `.callout.callout-frost` — `"callout on Frost-30: Sand-30 callout would sit same-tint under the Sand-30 compare movement"`.
- Local (non-canon) CSS: `.sheet`/`.sheets` subgrid, `.link-list`, `.claim-row`, `.res-*`, `.prev-*`, media-row cards ≤ 1023.
- Canon requests: #1 (footer lazy-src, `patchData`), #3, #4, #5, #6. Excluded from the gate: see § Unsourced / excluded.
