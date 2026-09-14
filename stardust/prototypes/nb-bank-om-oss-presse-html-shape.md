<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Worker C, hands-off)
  writtenAt:        2026-09-14T23:50:00Z
  page:             nb-bank-om-oss-presse-html
  pageUrl:          https://www.sparebank1.no/nb/bank/om-oss/presse.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-om-oss-presse-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-om-oss-presse-html.json
    - stardust/current/pages/nb-bank-om-oss-presse-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-om-oss-presse-html.png
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/ARCHETYPE-BRIEF.md
    - stardust/prototypes/nb-bank-privat-html-improvements.md (#3, #4, #6, #7)
    - stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
  conceptSeed:      surface roll key cb42046c (mode read) — dealt 6, 2, 1 of the ordered structure list; 6 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system component, om-oss variant (standard clientlib: header outside <main>, Bli kunde present, Presse current); injected by the builder
    - hero — `main > div.campaign` (photo kolleger-i-mote-2 1280, `h1` "Presse", `p.lead-blue`)
    - nasjonale — `main > div.background-container` (captured wrap `background-color:#D8E9F2` = Frost-30): `.columns-grid .text-wrapper` (h2 + lead p with `<b>21 02 59 90.</b>` + subtle p) and `.adviser-list` ×2 (empty `h2` headers; `.adviser` ×3 + ×2: circle portrait, name, role, phone, `a.adviser-email` mailto)
    - lokale — `main > div.columns-grid` #1: `.image` illustration voksen-dame-med-mobil.svg + `.text-wrapper` (h2 "Pressekontakter for lokale medier", p) + `a.primary-btn` "Velg bank" → /nb/bank/om-oss/presse.html
    - presserom — `main > div.columns-grid` #2: `.text-wrapper` (captured `h1` "Presserom" → rendered h2, one H1 per page; p) + `.button-list-container` (primary "Gå til presserom" → mynewsdesk, secondary "Velg bank") + `.image` photo kontormiljo-kaffekopp 1280
    - feedback — `main > div.feedback` (h2 "Hva synes du om denne siden?", buttons Ja / Nei with thumb SVGs)
    - footer — site-wide system component (Privat 5 · Logg inn 4 · Sosiale medier 2; legal row; no contact tabs captured on om-oss); injected by the builder
  antiTemplatePass:
    - { pattern: "campaign hero (full-bleed photo right, text left)", defaultReflex: "centered stack over a photo", alternatives: ["photo full-width above the H1", "7/5 split: photo left as content, H1 + lead right (canon campaign)", "text-only H1 band"], picked: "7/5 split, photo left", rationale: "canon campaign grid; DESIGN hero rule (left-anchored split, photo ≥ 560 px, one-corner mask); the text-only band would drop the captured photograph", reference: "canon nb-bank-privat-html campaign" }
    - { pattern: "adviser list (circle portraits, centered stacks)", defaultReflex: "profile cards with shadow", alternatives: ["shadowed profile cards", "flat centered stacks with circle portraits on the Frost paper (captured shape, chrome removed)", "table of names and numbers"], picked: "flat stacks with circle portraits", rationale: "DESIGN § Shapes — portraits are circles; the tinted paper is the container (Photogram constraint), so no card; a table would drop the portraits" }
    - { pattern: "illustration + text + one button", defaultReflex: "icon card", alternatives: ["icon card", "split row: spot illustration left (aria-hidden), h2 + p + one primary right", "text only"], picked: "split row on Hvit", rationale: "canon promo-band shape; the captured spot illustration is a brand motif (§ 8b), kept unmasked on paper" }
    - { pattern: "'Presserom' second H1 with two buttons and a photo", defaultReflex: "centered two-button hero", alternatives: ["second H1 (captured)", "h2 movement on Sand-30: text + primary + secondary left, photo right", "merge into the lokale row"], picked: "h2 movement on Sand-30, split", rationale: "one H1 per page (a11y); the captured module is a distinct movement (press room) → its own paper; two captured buttons keep their captured roles (primary external, secondary bank picker)" }
    - { pattern: "feedback thumbs", defaultReflex: "emoji / floating widget", alternatives: ["floating widget", "canon .feedback strip: h2 + two secondary pills with thumb icons and the captured labels Ja / Nei", "hidden"], picked: "canon .feedback strip", rationale: "ARCHETYPE-BRIEF rule 4; dynamics #5 interim (static type=button)" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: nasjonale, paper: Frost-30, purpose: "captured background-container #D8E9F2; the help/contact paper of the system (DESIGN: Frost for help and tools)" }
      - { section: presserom, paper: Sand-30, purpose: "the press-room offer is a separate movement; warm paper, never the same tint as the adjacent Frost movement (captured used Frost twice)" }
  voiceClassification:
    - { section: header, classification: captured-verbatim }
    - { section: hero, classification: captured-verbatim }
    - { section: nasjonale, classification: captured-verbatim, source: text-wrapper innerHTML (b → strong), adviser names/roles/phones/mailto labels }
    - { section: lokale, classification: captured-verbatim }
    - { section: presserom, classification: captured-verbatim (heading level h1 → h2, text unchanged) }
    - { section: feedback, classification: captured-verbatim, source: h2 + svg <title>Ja / Nei</title> }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "96px photo mask (785 occurrences)", mechanism: "one-corner-pair mask 96px on the hero and press-room photos; circles on portraits", fallback: "square photo" }
    - { kind: site-wide-motif, capturedSource: "flat spot illustrations /content/dam/SB1/illustrasjoner/*", mechanism: "voksen-dame-med-mobil.svg at 200px on Hvit, aria-hidden", fallback: "heading + text stand alone" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-om-oss-presse-html
url: https://www.sparebank1.no/nb/bank/om-oss/presse.html
register: brand
mode: read
surprise: low
dominantDimension: composition/paper-movements
---

# Page shape: nb-bank-om-oss-presse-html (om-oss archetype)

Structure list (ordered by resonance) for the surface roll (key cb42046c, read): 1 single-column brochure · 2 portrait wall first (advisers as the opening gallery) · 3 two-column ledger (headings left, content right) · 4 contact card grid · 5 alternating split rows throughout · **6 paper movements (dealt lead — built)**: split hero on Hvit → Frost contact movement with the adviser circles → Hvit local-press row → Sand press-room movement → feedback · 7 directory table. Dealt alternates 2 and 1 are recorded, not built.

## Sections (in render order)

1. **header** (system role `header`, canon; om-oss variant, Presse current). No router (none captured).
2. **hero** (module `campaign`) — Hvit; 7/5 split: photo left (`kolleger-i-mote-2`, 3:2, 96 px mask, eager + fetchpriority high — the LCP), right: H1 "Presse" (display 61 px — the captured module is the campaign hero, like the canon campaign headline) + lead "Vi hjelper journalister og medier …". Stacked photo-first below 1024.
3. **nasjonale** (module `content-columns` + `adviser-list` ×2) — Frost-30; h2 "Pressekontakter for nasjonale medier", lead p with the number in the medium cut + tabular numerals, the subtle p as Small Koksgrå (68ch); then the five press contacts as flat centred stacks: 128 px circle portrait (aria-hidden as captured), name (title-sm), role, phone (`.num`), "e-post" mailto link. Two rows as captured (3 + 2; the pair row centred on the same column pitch); 3-up → 2-up (the odd third stack centred) → 1-up rows with a 96 px portrait left.
4. **lokale** (module `promo-band`) — Hvit; spot illustration (200 px, aria-hidden) left, right: h2 "Pressekontakter for lokale medier", p, "Velg bank" primary (href verbatim — the captured overlay bank picker, dynamics interim: plain link).
5. **presserom** (module `campaign` variant) — Sand-30; split: text left (h2 "Presserom" — captured as a second H1, demoted for one-H1 —, p, one pill "Gå til presserom" (primary, external icon) + "Velg bank" as an inline link — one action per module; the captured secondary role is recorded, label and href verbatim), photo right (`kontormiljo-kaffekopp`, 3:2, 96 px mask, lazy). Stacked photo-first below 1024.
6. **feedback** (module `feedback`) — Hvit hairline-top strip: h2 "Hva synes du om denne siden?" + two secondary pills (thumb icons + "Ja" / "Nei"), `type="button"` (dynamics #5 interim).
7. **footer** (system role `footer`, canon).

## Layout strategy

- Density balanced: `--section-padding` 64 / 48 / 32; container 1280.
- Hero and press-room `7fr 5fr` ≥ 1024 (photo ≈ 720 px), stacked below (hero photo max-width 600 px between 641 and 1023); advisers `repeat(3, minmax(0,1fr))` (pair row 2 columns, 40rem) → 2 → 1; lokale `200px minmax(0,68ch)`, left-anchored on the container edge.
- Paper sequence Hvit → Frost → Hvit → Sand → Hvit; no `<hr>`, no card chrome.

## Key states

- Buttons: hover per canon; feedback thumbs static (interim).
- "Velg bank" ×2: the captured overlay bank picker is a dynamics item; both render as plain links to the captured href.

## Data attributes

- `section[data-section="hero"][data-intent="who this page is for"][data-layout="split-media"][data-media="image"][data-module="campaign"]`
- `section[data-section="nasjonale"][data-intent="reach the national press contacts"][data-layout="stack"][data-module="adviser-list"][data-items="5"][data-media="image"]`
- `section[data-section="lokale"][data-intent="route to a local bank's press contact"][data-layout="split-media"][data-module="promo-band"][data-media="illustration"]`
- `section[data-section="presserom"][data-intent="go to the press room"][data-layout="split-media"][data-media="image"][data-module="campaign"]`
- `section[data-section="feedback"][data-intent="rate the page"][data-layout="contained"][data-module="feedback"]`
- `body[data-template="static"]`

## Unsourced content (placeholder list)

(none).

## Unsourced / Excluded

- The two empty `adviser-list__header h2` elements (no text) — nothing to render.
- Portrait `<picture>` sources for ≤ 768 (`thumb.768.768`) — the 1280 src is used at every width (one src per image; the checker keys on `src`).
- Phone numbers are rendered as text (no `tel:` hrefs captured) — an easy rollout improvement, flagged, not invented here.

## Review

`impeccable:impeccable-finish-reviewer`, one round (same packet shape as the canon). Round 1 disposition **fix-then-ship** (scores 4·3·4·4·4). Material fixes applied in one batch:

1. Adviser gallery: pair row rendered as 2 columns on the same pitch (≥ 1024); odd third stack centred at 641–1023.
2. Lokale row: container no longer shrunk; `200px minmax(0,68ch)`, `justify-content:start` (a first pass with an `auto` track left a 430 px void — closed in the same round).
3. H1 "Presse" at display scale (61 px).
4. Press room: one pill ("Gå til presserom"), "Velg bank" inline (label + href verbatim) — one action per module.
5. No hairline on the feedback strip after the Sand movement (`.paper-sand + .feedback{border-top:0}`).
6. `.adviser-name{min-height:2.5em}` scoped to the 3-person row so role / phone / e-post align.
7. Hero photo max-width 600 px at 641–1023.

Verdict pass: **ship** — brand-fit 4 · hierarchy 4 · calm-vs-generic 4 · mobile composition 4 · contract compliance 5; remaining: clear. Reviewer note: real photographs and the illustration remain to be seen in place of the Frost plates before canon lock.

## Validation

- Harness: `nb-bank-om-oss-presse-html: PASS — 0 P0/P1, 0 P2/P3; externalFulfilled 10/10/10; heights 3898/3924/3270` (390 / 768 / 1440). 360 nav audit: over 0, minFont 14, hamburger; burger opens, aria-expanded syncs, Escape closes; primary CTA reachable by keyboard.
- Content check: `checked text 39, hrefs 37, imgs 11; missing text 0, hrefs 0, imgs 1` — the 1 image is the header `logo-sparebank1.svg` (rendered inline by the canon chrome; checker regex knows only `logo.svg`). Everything else PASS.
- Detect: 6 hits, all `cramped-padding` on `.hdr-utility`, `.movement` ×2, `.feedback`, `.footer-main`, `.footer-legal` — known static-CSS misreads of `padding-block: var(--section-padding)`, dismissed.
- Viewport heights: 1440 → 3270 px · 768 → 3924 px · 390 → 3898 px.
- `data-deviation` elements: none.
- Heading levels: captured second `h1` "Presserom" rendered as `h2` (text verbatim; one H1 per page).
- Dynamics interim: feedback thumbs static (`type="button"`, labels from the captured `<svg><title>`); "Velg bank" overlay bank picker → plain links to the captured href.
