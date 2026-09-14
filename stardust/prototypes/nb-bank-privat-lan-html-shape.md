<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, archetype worker A — category-hub family)
  writtenAt:        2026-09-14T23:05:00Z
  page:             nb-bank-privat-lan-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat/lan.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-privat-lan-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-privat-lan-html.json
    - stardust/current/pages/nb-bank-privat-lan-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-privat-lan-html.png
    - stardust/prototypes/ARCHETYPE-BRIEF.md, stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/dynamic-features.md (#2, #5)
    - stardust/prototypes/nb-bank-privat-html-improvements.md
  conceptSeed:      surface roll key 0b575c01 (mode persuade) — dealt 4, 7, 5 of the ordered structure list; 4 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component (variant privat, "Låne" current), canon chrome
    - bank-router — `.bank-choice--inline` (present), canon chrome
    - hero — `main > div.aem-main-container` (h1.ffe-h1 "Låne" + p span.main-lead, captured centred, max-width 800)
    - doors — `main > div.visual-nav` ×8: 4 × data-type="medium" (photo as CSS background-image `.nav--med__background`, h3 + p.ffe-lead-paragraph, chevron img) + 4 × data-type="small" (40 px material icon img with captured alt, h3 + p, chevron img)
    - shortcuts — `main > div.shortcuts` (h2 "Snarveier", 7 `a.ffe-button--shortcut`; 2 carry href="#")
    - membership — `main > div.cobranding` (header div.ffe-h4 "Er du medlem i et LO-forbund?" + expand button "Se dine fordeler her"; content: LO logo img, h2 "LOfavør", 2 p, secondary "Kontakt meg om LOfavør" (rendered twice in capture: mobile + desktop, same href), tertiary "Se alle medlemsfordeler", illustration pensjon-kvinne-data, p "Våre rådgivere…"); captured bg #FDF8F5
    - help — `main > div.columns-grid` (2 columns: photo radgiver-pa-kontor + h2 "Snakk med rådgiver" + p + primary "Book møte med rådgiver" · photo ta-deg-sammen-par + h2 "Hvor mye kan jeg låne?" + p + primary "Prøv lånekalkulatoren"); captured bg #FDF8F5
    - switch — `main > div.banner-small` (illustration dame-gar-smiler, h2 "Vil du bytte bank til oss?", p, primary "Få hjelp til å bytte bank"); bg-color7
    - popular — `main > div.background-container > div.related-products` (h2 "Populære lån", 12 `.card` icon + title link); captured bg #FDF8F5
    - tip — `main > div.tip` (ffe-message-box--info: h3 "Samtykke Altinn", p, action "Logg inn i Altinn for å samtykke")
    - feedback — `main > div.feedback` h2 "Hva synes du om denne siden?"
    - compare — `main > div.referance` h2 "Sammenlign priser" + p
    - footer — canon chrome; `<hr>` ×2 dropped
  antiTemplatePass:
    - { pattern: "hub hero (H1 + lead, no photo)", defaultReflex: "centered oversized headline + lead", alternatives: ["centered stack (captured)", "left-anchored H1 + lead at 60ch, doors start immediately below", "H1 beside the first photo door"], picked: "left-anchored H1 + lead", rationale: "direction bans the centered hero silhouette; the hub's content is the doors, so the H1 movement is short and the doors carry the first viewport; no captured hero photo to borrow" }
    - { pattern: "visual nav (4 photo rows + 4 icon rows)", defaultReflex: "stacked full-width photo+card rows with chevrons", alternatives: ["stacked rows (captured)", "2×2 photo doors (3:2, 48 px mask, title-sm + line, whole card is the link) followed by a 4-up icon strip", "one 8-card uniform grid"], picked: "2×2 photo doors + 4-up icon strip", rationale: "photos as content at card scale (#6) instead of a CSS background thumb; the captured medium/small split is a real hierarchy (four main loan types vs four secondary) and is kept; a uniform 8-grid would flatten it (craft floor: same-size card scaffold)" }
    - { pattern: "shortcuts (7 outlined pills)", defaultReflex: "seven outlined pill buttons", alternatives: ["outlined pills (captured)", "inline link row with chevrons (`.btn-inline` + icons.chevron), wraps to a list on phones", "two-column text list"], picked: "inline link row", rationale: "seven equal pills compete with the doors; shortcuts are navigation, not actions — inline pills are the direction's mapping for inline buttons" }
    - { pattern: "cobranding expander", defaultReflex: "JS expand panel", alternatives: ["always-open panel", "`<details>` on Sand-30: summary carries the captured question + 'Se dine fordeler her', panel holds the LOfavør content", "drop to a link"], picked: "details on Sand-30", rationale: "captured behaviour is an expander (aria-expanded); CSS-only keeps it; Sand is the membership paper (canon)" }
    - { pattern: "popular loans (12 icon cards)", defaultReflex: "12 white cards with chevrons in a 3-col grid", alternatives: ["card grid (captured)", "hairline-topped tiles: icon 48 px + title-sm link, 4 → 2 → 1, no card chrome", "plain link list"], picked: "hairline tiles", rationale: "canon products tile language (no card chrome); icons are captured aria-hidden decoration and stay so" }
    - { pattern: "info tip (message box)", defaultReflex: "blue info box centred", alternatives: ["centred info box (captured)", "`.callout` (Sand-30, bulb icon) left-anchored at 68ch with h3 + p + the captured action button", "plain paragraph"], picked: ".callout", rationale: "canon tip module; the captured `ffe-button--action` (Altinn log-in) keeps Skog — it is a log-in action" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: membership, paper: Sand-30, purpose: "captured #FDF8F5 cobranding ground; membership paper (canon membership movement)" }
      - { section: popular, paper: Sand-30, purpose: "captured #FDF8F5 ground of 'Populære lån'; not adjacent to membership (help + switch on Hvit between)" }
    note: "captured help columns (#FDF8F5) NOT carried as a tint — it sat adjacent to the cobranding Sand (same tint adjacent, banned); help renders on Hvit"
  voiceClassification:
    - { section: header, classification: captured-verbatim }
    - { section: bank-router, classification: captured-verbatim }
    - { section: hero, classification: captured-verbatim }
    - { section: doors, classification: captured-verbatim (titles/lines from h3/p; photo alt from data-image-alt) }
    - { section: shortcuts, classification: captured-verbatim }
    - { section: membership, classification: captured-verbatim }
    - { section: help, classification: captured-verbatim }
    - { section: switch, classification: captured-verbatim }
    - { section: popular, classification: captured-verbatim }
    - { section: tip, classification: captured-verbatim }
    - { section: feedback, classification: captured-verbatim ("Ja"/"Nei" visually-hidden) }
    - { section: compare, classification: captured-verbatim }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "bankchoice_bg.svg", mechanism: "canon router band", fallback: "band without art" }
    - { kind: site-wide-motif, capturedSource: "96px photo mask", mechanism: "48 px one-corner-pair mask on the four door photos and the two help photos", fallback: "square photo" }
    - { kind: site-wide-motif, capturedSource: "flat spot illustrations (pensjon-kvinne-data, dame-gar-smiler) + material icons", mechanism: "unmasked on paper, aria-hidden", fallback: "text stands alone" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-privat-lan-html
url: https://www.sparebank1.no/nb/bank/privat/lan.html
register: brand
mode: persuade
surprise: low
dominantDimension: composition/catalogue-of-doors
template: landing
---

# Page shape: nb-bank-privat-lan-html (category hub — 20 hub pages fork from it)

Structure list (ordered by resonance) for the surface roll `0b575c01`: 1 reading-room spread · 2 offer-then-ledger · 3 task strip first · **4 catalogue of doors — short H1 movement, 2×2 photo doors + icon strip, shortcuts, membership, help, popular list (dealt lead — built)** · 5 single column · 6 newspaper front · 7 router-led. Dealt alternates 7 and 5 recorded, not built.

## Sections (in render order)

1. **header** (canon) — "Låne" current.
2. **bank-router** (canon).
3. **hero** (module `page-title`) — Hvit; left-anchored h1 "Låne" (headline) + lead (60ch). No photo (none captured); no back-link (none captured — hub is a top-level market page).
4. **doors** (module `visual-nav`, 8 items) — same movement as the hero, Hvit. Four photo doors 2×2 → 1: `.card.plain`? No — Sand-30 `.card` with photo 3:2 (`.photo-sm`, alt from `data-image-alt`), title-sm link (whole card is the link), one line. Below, a 4-up icon strip (→ 2 → 1): captured 40 px material icon (alt verbatim, e.g. "Blad, ikon"), title-sm link, one line, hairline-topped tiles. Hrefs verbatim (`/content/sites/sb1/...` as captured). Chevron imgs dropped.
5. **shortcuts** (module `shortcut-row`) — Hvit, hairline top; h2 "Snarveier" + 7 inline pills with `icons.chevron` (two keep `href="#"`, dynamics #2).
6. **membership** (module `cobranding`) — Sand-30; `<details>`: summary = title-sm "Er du medlem i et LO-forbund?" + inline "Se dine fordeler her" (`icons.down`); panel: LO logo (captured alt "LO logo", 120 px), h2 "LOfavør", two paragraphs, "Kontakt meg om LOfavør" `.btn-secondary` (once — captured twice for mobile/desktop, same href), "Se alle medlemsfordeler" `.btn-inline`; right column: illustration (`aria-hidden`) + p "Våre rådgivere…".
7. **help** (module `split-media` ×2) — Hvit; two equal columns, each photo 3:2 48 px mask (alt verbatim) → h2 → p → one `.btn-primary`.
8. **switch** (module `promo-band`) — Hvit, hairline top: illustration (`aria-hidden`) + title-sm "Vil du bytte bank til oss?" + p + `.btn-primary` "Få hjelp til å bytte bank".
9. **popular** (module `related-products`, 12) — Sand-30; h2 "Populære lån"; hairline tiles 4 → 2 → 1: icon 48 px (`aria-hidden`, captured) + title-sm link.
10. **tip** (module `callout`) — Hvit; `.callout` with `icons.bulb`: h3 "Samtykke Altinn" + p + `.btn-action` "Logg inn i Altinn for å samtykke" (captured action; a log-in).
11. **feedback** (dynamics #5 static) — as canon/boliglån.
12. **compare** — as canon.
13. **footer** (canon).

## Layout strategy

- Doors: `repeat(2, 1fr)` photo cards ≥ 1024 (each ≈ 600 px wide → photo ≈ 550 px), 1-up ≤ 640; icon strip 4 → 2 → 1.
- Papers: Hvit (hero+doors+shortcuts) → Sand-30 (membership) → Hvit (help, switch) → Sand-30 (popular) → Hvit (tip, feedback, compare). Two tints, non-adjacent.
- One action per module: help columns each one primary; switch one primary; tip one action; membership one secondary + one inline.
- Mobile-first at 390: doors stack photo-first; tiles become rows.

## Key states / Interaction model

- Membership `<details>` open/closed (captured expander, CSS-only). All hrefs verbatim incl. `#`. No page script.

## Data attributes

- `section[data-section="hero"][data-intent="name the category"][data-layout="contained"][data-module="page-title"]`
- `section[data-section="doors"][data-intent="route to loan products"][data-layout="grid"][data-items="8"][data-module="visual-nav"][data-media="image"]`
- `section[data-section="shortcuts"][data-intent="self-service shortcuts"][data-layout="contained"][data-items="7"][data-module="shortcut-row"]`
- `section[data-section="membership"][data-intent="LO membership benefits"][data-layout="contained"][data-module="cobranding"]`
- `section[data-section="help"][data-intent="adviser contact; calculator"][data-layout="grid"][data-items="2"][data-module="split-media"][data-media="image"]`
- `section[data-section="switch"][data-intent="invite: switch bank"][data-layout="contained"][data-module="promo-band"]`
- `section[data-section="popular"][data-intent="popular loan products"][data-layout="grid"][data-items="12"][data-module="related-products"]`
- `section[data-section="tip"][data-intent="Altinn consent notice"][data-layout="contained"][data-module="callout"]`
- `section[data-section="feedback"]…`, `section[data-section="compare"]…`, `body[data-template="landing"]`

## Unsourced / excluded (for the lead)

- Door photos are captured as CSS `background-image` (`.thumb.768.768.jpg`) — rendered as `<img>` with the captured URL and `data-image-alt`; the content gate does not check background images, so this is additive.
- Chevron imgs (`material-icons/fjell/chevron.svg`, excluded by the gate), `<hr>` ×2 — dropped.
- Illustration alts ("dame som står ved pc.illustrasjon", "dame-gar-smiler") → `alt="" aria-hidden` (spot-illustration rule); srcs verbatim. LO logo keeps its alt.
- "Kontakt meg om LOfavør" duplicated in the capture (mobile/desktop) — rendered once.
- "Er du medlem i et LO-forbund?" is a `div.ffe-h4` in the capture (not a heading) — rendered as the `<details>` summary text.

## Review

Round 1 (impeccable:impeccable-finish-reviewer, same packet shape as canon): **fix-then-ship** — brand-fit 4 · hierarchy 3 · calm-vs-generic 3 · mobile 4 · craft floor 4. Material fixes, applied in one batch:
1. Doors were photo-in-card (Sand-30 sheet, padding, lift) → photo-on-paper: 3:2 photo with 48 px mask directly on Hvit, title-sm + line beneath, whole item the link.
2. "LOfavør" (partner name inside the expander) rendered at headline-sm → demoted to `--t-title` 31 px (`.cobrand-name`); module h2s headline-sm, utility h2s title-sm.
3. Membership aside was a white hairline box on Sand → unboxed (illustration + sentence directly on paper).
4. Shortcut row orphaned "Innfri lånet" at 1440 → heading on its own row, links get the full width.
5. "Samtykke Altinn" h3 read as a sub-section of "Populære lån" → `h2.title-sm`.
6. Popular tiles: wrapped title broke the four-across top alignment → `align-items:start` + `text-wrap:balance`.

Verdict pass: **ship** — brand-fit 4 · hierarchy 4 · calm-vs-generic 4 · mobile 4 · craft floor 4. One optional craft note applied after the verdict: ≤ 640 `.door-grid` gap raised 16 → 24 px so each door reads as its own object. Reviewer's open system question (escalated to the lead, not this artifact): hub doors are photo-on-Hvit while the boliglån "Hva vil du gjøre?" doors are white hairline papers on Sand-30 — two door languages one click apart; decide before `migrate` forks 20 hubs + 30 products.

## Validation

- Harness: `nb-bank-privat-lan-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 26/28/28; heights 7811/5992/5119` (P2 = 4 sub-40 px targets, all canon chrome / inline link). 360 nav `{"over":0,"minFont":14,"minGap":0,"collapse":"hamburger"}`. Smoke: membership details opens, burger open/aria/Esc, primary CTA (Altinn action) keyboard-reachable.
- Content gate: `content-check PASS — checked text 87, hrefs 213, imgs 23; missing 0/0/0`.
- Detect: 7 × `cramped-padding` (warning) — static-CSS misreads of `padding-block: var(...)` on `.movement`/`.hdr-utility`/`.feedback`/`.contact` — dismissed; nothing else.
- Reviewer disposition: ship (see § Review).
- Viewport heights: 1440 → 7811 (membership details opened by the validator) · 768 → 5992 · 390 → 5119.
- `data-deviation` elements: none. Local CSS: `.door`, `.tile`/`.small-door`/`.pop-tile`, `.shortcut-row`, `.cobrand*`, `.help-*`, `.promo`.
- Canon requests: #1 (footer lazy-src, `patchData`). Excluded from the gate: see § Unsourced / excluded.
