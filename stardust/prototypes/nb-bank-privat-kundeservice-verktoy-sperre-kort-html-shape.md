<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Flow B fan-out — Worker B, hands-off)
  writtenAt:        2026-09-14T23:05:00Z
  page:             nb-bank-privat-kundeservice-verktoy-sperre-kort-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat/kundeservice/verktoy/sperre-kort.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-privat-kundeservice-verktoy-sperre-kort-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-privat-kundeservice-verktoy-sperre-kort-html.json
    - stardust/current/pages/nb-bank-privat-kundeservice-verktoy-sperre-kort-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/prototypes/ARCHETYPE-BRIEF.md, nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/nb-bank-privat-html-improvements.md
    - impeccable reference/operate.md, craft-floor.md
  conceptSeed:      surface roll key d96f07e8 (mode operate) — dealt 6, 7, 1 of the ordered structure list; 6 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component (variant privat), canon chrome
    - bank-router — site-wide `.bank-choice--inline` landmark, canon chrome (present on the captured page)
    - intro — `main > div.to-parent > a` "Verktøy" (back-link) · `main > div.title h1` "Sperre kort" · `main > div.text p` (lead)
    - steps — `main > div.columns-grid` #1 (captured #D8E9F2 ground = Frost-30): h2 "Slik sperrer du bankkort og kredittkort", `ol` × 4, p (Bankkort for barn/ungdom), `a.action-btn` "Logg inn og sperr kortet" (captured `ffe-button--action`), p.subtle-text, `img` mobilbruker-dame illustration; `div.hr` × 2 around it dropped
    - misuse — `main > div.tip .ffe-message-box--info`: h2 "Er kortet ditt misbrukt?", 4 p (3 links), h3 "Er kontoen din misbrukt?", 2 p; empty h3 + 2 empty p dropped
    - reopen — `main > div.columns-grid` #2: `img` bankkort-kredittkort-lommebok photo, h2 "Funnet igjen et sperret kort?", 2 p (Bankkort: / Kredittkort:), `a.primary-btn` "Åpne sperret kort"; `div.hr` dropped
    - feedback — `main > div.feedback` layout1: h2 "Hva synes du om denne siden?", buttons Ja / Nei (svg titles); trailing `div.hr` dropped
    - footer — site-wide system-component, canon chrome
  antiTemplatePass:
    - { pattern: "task intro (back-link + centered H1 + lead)", defaultReflex: "centered title block", alternatives: ["centered as captured", "left-anchored back-link → H1 → lead on Hvit (canon skeleton)", "H1 inside the Frost steps band"], picked: "left-anchored intro on Hvit", rationale: "DESIGN page skeleton: back-link → H1 movement; keeps the task name readable before the procedure paper starts" }
    - { pattern: "numbered steps + illustration on a tinted band", defaultReflex: "text column + floating illustration", alternatives: ["captured 5/5 columns", "8/4 procedure sheet: numbered ledger (Vann circle numerals, hairline rows) left, illustration top-right, one Skog action under the list", "steps as cards"], picked: "8/4 procedure sheet", rationale: "Operate: the list is the task; numerals as controls-vocabulary, no card chrome (#4); Skog is legitimate here — the CTA logs in (captured ffe-button--action)" }
    - { pattern: "info message box", defaultReflex: "bordered blue box with icon on top", alternatives: ["captured centered box", "`.callout` on Sand-30 with the bulb icon, 68ch body, headings at title-sm/lead", "plain prose section with a hairline"], picked: "`.callout` rich", rationale: "canon tip vocabulary; Sand paper marks the 'if things went wrong' movement without a divider" }
    - { pattern: "photo + text CTA block", defaultReflex: "image card left, text right", alternatives: ["captured 5/7 with rounded photo", "5/7 split-media, photo 3:2 with the 96 px one-corner mask, h2 + prose + primary", "text only"], picked: "5/7 split-media", rationale: "#6 photo at content scale; the reopen action is primary (Vann) — not a log-in start, so not Skog" }
    - { pattern: "feedback strip", defaultReflex: "centered question + two pills", alternatives: ["centered", "`.feedback` row: question left, thumbs right, hairline top", "omit"], picked: "`.feedback` row", rationale: "canon feedback vocabulary; dynamics #5 static interim" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: steps, paper: Frost-30, purpose: "captured #D8E9F2 ground on the procedure — the help paper carries the task" }
      - { section: misuse, paper: Sand-30 (callout only, not a band), purpose: "the tip vocabulary — warm paper for the 'misused' branch; movement stays Hvit" }
  voiceClassification:
    - { section: header, classification: captured-verbatim; "Meny" = direction-authorized chrome }
    - { section: bank-router, classification: captured-verbatim }
    - { section: intro, classification: captured-verbatim }
    - { section: steps, classification: captured-verbatim (b→strong; nbsp normalised) }
    - { section: misuse, classification: captured-verbatim (empty blocks dropped) }
    - { section: reopen, classification: captured-verbatim }
    - { section: feedback, classification: captured-verbatim (Ja / Nei from the svg titles) }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "bankchoice_bg.svg", mechanism: "canon router band", fallback: "band without art" }
    - { kind: site-wide-motif, capturedSource: "flat spot illustration mobilbruker-dame-lys-bakgrunn-mobil.svg", mechanism: "320 px beside the steps heading, aria-hidden, eager (first-viewport image); 120 px beside the h2 at ≤ 640", fallback: "steps stand alone" }
    - { kind: site-wide-motif, capturedSource: "96px photo mask", mechanism: "one-corner-pair 96 px on the lommebok photo (48 px at ≤ 640)", fallback: "square photo" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-privat-kundeservice-verktoy-sperre-kort-html
url: https://www.sparebank1.no/nb/bank/privat/kundeservice/verktoy/sperre-kort.html
register: brand
mode: operate
surprise: low
dominantDimension: composition/procedure-sheet
---

# Page shape: nb-bank-privat-kundeservice-verktoy-sperre-kort-html (tool)

Structure list (ordered by resonance) for the surface roll d96f07e8: 1 task card (steps in a card, everything else below) · 2 action-first (Skog button in the intro, steps after) · 3 two-track (block vs. reopen side by side) · 4 single reading column · 5 checklist with progress · **6 procedure sheet — intro, numbered ledger on the help paper with one Skog action, the "misused" callout, the reopen split, feedback (dealt lead — built)** · 7 phone-first (contact numbers lead). Dealt alternates 7 and 1 recorded, not built.

## Sections (in render order)

1. **header** (canon) — privat variant.
2. **bank-router** (canon) — captured; injected.
3. **intro** (module `page-title`) — Hvit: `.backlink` "Verktøy" (icons.back) → H1 "Sperre kort" (headline) → lead (52ch).
4. **steps** (module `steps`, 4 items) — Frost-30; 8/4 named-area grid ("h2 media / text media"): h2 + ordered list as a ledger (36 px Vann circle numerals via CSS counter, hairline rows, `strong` for the captured bold UI words) + p (barn/ungdom) + **Skog action "Logg inn og sperr kortet"** (captured `ffe-button--action`, log-in type → the module's one action) + small note (Koksgrå); illustration 320 px in the media column aligned to the h2 row (eager/high — it is the first-viewport image on this page); 240 px at 768. ≤ 640: "h2 media / text text" — the 120 px spot sits beside the h2, the ledger opens in the first screen.
5. **misuse** (module `callout`) — Hvit movement, one `.callout` (Sand-30, bulb icon) carrying the captured info box verbatim: h2 (title-sm) + prose + h3 (lead) + prose, 68ch. Links verbatim.
6. **reopen** (module `split-media`) — Hvit; 5/7: photo (bankkort-kredittkort-lommebok, 3:2, 96 px mask, lazy) left, h2 + 2 p + primary "Åpne sperret kort" right. Stacks photo-first below 1024 (2:1 crop at 768, 3:2 at ≤ 640).
7. **feedback** (module `feedback`) — `.feedback` hairline strip: h2 question + Ja / Nei thumbs (`type="button"`, dynamics #5).
8. **footer** (canon) — the "Ring oss" panel carries the 12 banks' phone numbers as `tel:` links (chrome) — the page's "kontakte oss på telefon" resolves there.

## Layout strategy

- Density balanced; container 1280. Grids: steps `8fr 4fr` → `7fr 4fr` (768) → `1fr 120px` heading row + full-width ledger (≤ 640); reopen `5fr 7fr` → 1 col (≤ 1023).
- Papers: Hvit → Frost-30 → Hvit (callout Sand-30 inside) → Hvit → hairline feedback. Three captured `<hr>` dropped.
- Operate: fixed component vocabulary (canon pills, canon callout, native list), no decorative motion.

## Key states

- Buttons hover/focus (canon). Thumbs static. Photo plate offline in validation.

## Interaction model

- "Logg inn og sperr kortet" / "Åpne sperret kort" keep the captured nettbank hrefs (login dialog at rollout, dynamics #3).

## Data attributes

- `section[data-section="intro"][data-intent="name the task"][data-layout="contained"][data-module="page-title"]`
- `section[data-section="steps"][data-intent="do the task: block the card in the bank app, one action"][data-layout="split-media"][data-media="illustration"][data-module="steps"][data-items="4"]`
- `section[data-section="misuse"][data-intent="if the card or account was misused: what to do"][data-layout="contained"][data-module="callout"]`
- `section[data-section="reopen"][data-intent="found the card: lift the block"][data-layout="split-media"][data-media="image"][data-module="split-media"]`
- `section[data-section="feedback"][data-intent="page feedback"][data-layout="contained"][data-module="feedback"]`
- `body[data-template="form"]`

## Unsourced content (placeholder list)

(none).

## Unsourced / Excluded from the content gate

- Nothing excluded by the module. Captured empty `<h3>`/`<p>` (nbsp only) in the info box are dropped (no text). The info-box "i" glyph and the back-link chevron glyph are replaced by canon icons.

## Open questions for craft (resolved in render)

- The first-viewport image on this page is the steps illustration (no hero photo) → eager + fetchpriority high. The canon router art stays lazy (canon-requests.md: router art as LCP on hero-less pages).
- Step list items carry inline `<strong>`; wrapped in `span.step-text` so the numeral grid holds one cell per step.

## Validation (final clean pass)

- `validate-prototype.mjs`: PASS — 0 P0/P1 at 1440 / 768 / 390 (console clean, no network failures, no overflow, landmarks, alt/labels, 1 h1, 0 heading skips, 0 low-contrast nodes, LCP = steps illustration eager/high at all three widths, burger + Escape, Skog CTA reachable by keyboard); 360 nav audit clean. Heights 390: 4809 · 768: 3962 · 1440: 3367 (captured live page: 4176 at 1440). Remaining P2: three canon sub-40 px targets (router label, "Se alle banker" summary, office-search label) — advisory.
- `content-check.mjs`: PASS — 66 texts, 189 hrefs, 5 images verbatim; 0 missing. Excluded by rule only: `href="#/"`, chevron/decoration SVGs, `logo.svg`.
- `impeccable detect --json`: 6 × cramped-padding on `.movement` / `.feedback` / `.hdr-utility` / `.contact` / `.footer-*` — static-CSS misreads of `padding-block`; dismissed. Nothing else.
- Vision gate (Worker B, 3 viewports vs `stardust/current/assets/screenshots/nb-bank-privat-kundeservice-verktoy-sperre-kort-html.png`): pass — same brand, the task reads as a ledger with one green action; no card chrome; at 390 the ledger opens in the first screen.
- `data-deviation` elements: none.

## Review (impeccable finish reviewer, fresh context, code-led)

- Round 1 disposition **fix** — 6 items (2 material, 4 minor): (1) mobile fold — the 140 px illustration preceded the task at 390 (action 1.6 screens down); (2) `.callout-rich{max-width:none}` turned the Sand callout into a band; (3) steps band right column under-spent at 1440/768; (4) ledger hairline rhythm uneven (ol gap + li padding); (5) bulb icon labels a fraud branch as a "tip" — canon has no info variant; (6) "kontakte oss på telefon" resolves only in the footer panel — no anchor available. Fixes 1–4 applied in one batch: steps band as a named-area grid (h2 a direct child; ≤ 640 "h2 media / text text" with the spot at 120 px beside the heading — kept in the first screen because it is the page's only eager image), callout bounded at `calc(68ch + 84px)`, grid 8fr/4fr with the spot at 320 px aligned to the h2 row, `ol{gap:0}`. Items 5–6 filed in `canon-requests.md`.
- Verdict pass: **ship** — fixes 1–4 resolved, no material regressions. Two minor adaptations recorded: the mobile intro lead had been demoted to body size in the batch and was restored to lead size afterwards (ledger still opens at ~y 750 of 844); the steps h2 wraps to three lines beside the 120 px spot at 390 (a 96 px spot would drop below the router art's LCP area — canon gap).
- Kept per the reviewer: the numbered Vann ledger on Frost-30 with the single Skog log-in action directly beneath it.
