<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Flow B fan-out — Worker B, hands-off)
  writtenAt:        2026-09-14T23:55:00Z
  page:             nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html
  pageUrl:          https://www.sparebank1.no/nb/bank/bedrift/kundeservice/bm-lan-finansiering/fast-flytende-rente-bedriftslan.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html.json
    - stardust/current/pages/nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/prototypes/ARCHETYPE-BRIEF.md, nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/nb-bank-privat-html-improvements.md
    - impeccable reference/operate.md (Read notes), craft-floor.md
  conceptSeed:      surface roll key f4dcd196 (mode read) — dealt 6, 7, 2 of the ordered structure list; 6 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component, **bedrift variant** (market nav Daglig drift … Kundeservice; "Bli bedriftskunde" action; "Logg inn" → /nb/bank/bedrift/innlogging.html), injected by the builder from the captured page
    - bank-router — site-wide `.bank-choice--inline` landmark, captured on this page; rendered with canon `routerHtml()` by the page module (see § Open questions)
    - question — `main > div.question-page`: `div.to-parent > a` "Kundeservice" (back-link) · `h1` (the question) · `div.question-page__answer .text-wrapper` (3 p with `<b>` terms, `ul` × 2 li) · `div.faq__feedback-box` (label "Var dette nyttig?", buttons Ja / Nei)
    - footer — site-wide system-component, bedrift variant (Ring oss 7-18; footer column "Bedrift"), canon chrome
  antiTemplatePass:
    - { pattern: "question page (back-link + H1 + centered answer column)", defaultReflex: "centered 8/12 column", alternatives: ["centered as captured", "left-anchored single answer column: back-link → H1 (headline, 24ch) → answer at lead size 20/1.55, 68ch → feedback hairline row", "two-column with a related-questions rail"], picked: "left-anchored single answer column", rationale: "Read mode: the prose measure and the one question are the page; the captured page has no related questions — inventing a rail would be unsourced; left-anchored per the direction's hero rule" }
    - { pattern: "FAQ feedback (label + thumbs)", defaultReflex: "centered question + icon buttons", alternatives: ["captured inline label + icon-only thumbs", "hairline row bounded to the prose measure: question (medium, Fjell) + two secondary pills with icon + Ja / Nei", "omit"], picked: "hairline row at 68ch", rationale: "canon feedback vocabulary; labelled buttons instead of icon-only (a11y); dynamics #5 static" }
  substrateTransitions:
    default: Hvit
    exceptions: []
  voiceClassification:
    - { section: header, classification: captured-verbatim (bedrift variant); "Meny" = direction-authorized chrome }
    - { section: bank-router, classification: captured-verbatim }
    - { section: question, classification: captured-verbatim (b → strong; answer prose lifted as rich HTML) }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "bankchoice_bg.svg", mechanism: "canon router band; on this image-less page the landscape is the first-viewport image and loads eager (data-deviation)", fallback: "band without art" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html
url: https://www.sparebank1.no/nb/bank/bedrift/kundeservice/bm-lan-finansiering/fast-flytende-rente-bedriftslan.html
register: brand
mode: read
surprise: low
dominantDimension: composition/single-answer-column
---

# Page shape: nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html (faq — question page, bedrift)

Structure list (ordered by resonance) for the surface roll f4dcd196: 1 question + answer with a sticky "Var dette nyttig?" rail · 2 answer as a two-column comparison (fast vs flytende) · 3 centered reading column as captured · 4 question inside the kundeservice hub frame · 5 answer with a glossary sidebar · **6 single answer column — back-link, the question as headline, answer prose at lead size and 68ch, feedback hairline row (dealt lead — built)** · 7 answer first, question as caption. Dealt alternates 7 and 2 recorded, not built (2 would restructure verbatim prose into a table — IA fidelity verbatim).

## Sections (in render order)

1. **header** (canon, bedrift variant) — injected from the captured page: audience switch with Bedrift active, 8 bedrift market links, "Bli bedriftskunde" secondary, "Logg inn" action.
2. **bank-router** (canon markup via `routerHtml()`, rendered by the page module as the first child of `<main>`) — identical to canon except the landscape img is `loading="eager" fetchpriority="high"` (`data-deviation`), because this page has no other image and the lazy art is its LCP.
3. **question** (module `faq-question`) — Hvit, one movement: `.backlink` "Kundeservice" → H1 = the question (headline, ≤ 24ch) → answer prose at lead size (20/1.55, 68ch; `strong` for the captured bold terms flytende rente / fastrentelån / Overkurs / Underkurs / kombinere) → feedback row: "Var dette nyttig?" + Ja / Nei secondary pills with thumbs (`type="button"`, dynamics #5), hairline top, bounded to the measure.
4. **footer** (canon, bedrift variant).

## Layout strategy

- One movement on Hvit; padding 48 / 64 top/bottom (32 / 48 at ≤ 1023). No `<hr>` (captured page had none in main).
- Read mode: measure 68ch; answer at 20 px on ≥ 641, 16 px at ≤ 640; H1 headline step; no cards, no rails.

## Key states

- Thumbs static. Router `<details>` open/closed (canon).

## Interaction model

- Back-link href verbatim; every router bank link verbatim.

## Data attributes

- `article[data-section="question"][data-intent="answer one question plainly"][data-layout="contained"][data-module="faq-question"][data-items="5"]`
- `aside.router[data-section="bank-router"]…[data-canon][data-deviation]` (canon attributes + deviation note)
- `body[data-template="article"]`

## Unsourced content (placeholder list)

(none).

## Unsourced / Excluded from the content gate

- Main + bank-choice regions: PASS (0 missing). Full run flags three **bedrift chrome** items the page module cannot reach (reported in `canon-requests.md` for the lead): header "Til forsikring" → https://kundeforsikring.sparebank1.no (visible link in the bedrift login cluster; canon header renders "Logg inn" only), footer "Ring fra utland" `tel:+4791502300` (data.mjs keeps the text, drops the href), and the bedrift logo img `logo-sparebank1.svg` (checker exclusion matches `logo.svg` only; canon renders the inline SVG with the captured alt). The checker was not weakened.

## Open questions for craft (resolved in render)

- Router inside `<main>`: build.mjs offers no hook to change the router img attributes, so the page returns `router:false` and renders the canon `routerHtml()` string itself with the eager/high attributes patched in — markup otherwise identical, `data-deviation` on the aside and the img. The lead can drop this once canon makes the art eager (canon-requests.md).
- "Related questions": none captured → none rendered (no invented rail).

## Validation (final clean pass)

- `validate-prototype.mjs`: PASS — 0 P0/P1 at 1440 / 768 / 390 (console clean, no network failures, no overflow in the default state, landmarks, 1 h1, 0 heading skips, 0 low-contrast nodes, LCP = router landscape eager/high (page-rendered canon router, `data-deviation`), burger + Escape, router details opens; "no-primary-cta" expected on a Read page); 360 nav audit clean. Heights 390: 3519 · 768: 2686 · 1440: 2336 (captured live page: 2273 at 1440). Remaining P2: three canon sub-40 px targets — advisory. Note: the harness smoke clicks the first `main details` — here the router's — so `1440/768/390.png` show the bank list open; closed-state captures are `1440-closed.png / 768-closed.png / 390-closed.png` in the same folder (same heights).
- `content-check.mjs`: main + bank-choice regions PASS — 9 texts, 13 hrefs, 1 image; 0 missing. Full run FAIL on three **bedrift chrome** items outside the page module (header "Til forsikring" link, footer "Ring fra utland" `tel:` href, bedrift logo filename vs. the checker's `logo.svg` exclusion) — reported in `canon-requests.md`; checker not weakened.
- `impeccable detect --json`: 4 × cramped-padding on `.hdr-utility` / `.contact` / `.footer-*` — static-CSS misreads; dismissed. Nothing else.
- Vision gate (Worker B, closed-state captures vs `stardust/current/assets/screenshots/nb-bank-bedrift-…-bedriftslan-html.png`): pass — the question carries the page on two balanced lines, the answer reads at 20/1.55 in a 68ch column, one hairline, one feedback row; bedrift header variant injected correctly.
- `data-deviation` elements: `aside.router[data-deviation="router art loading=eager fetchpriority=high — no other first-viewport image on this page (canon-requests.md)"]` and `img.router-art[data-deviation="eager"]` — canon markup rendered by the page module (`routerHtml()`), one attribute pair changed. Remove once canon makes the art eager.

## Review (impeccable finish reviewer, fresh context, code-led)

- Round 1 disposition **fix** — 4 items (2 material, 2 minor): (1) evidence — the harness captures showed the router opened by the smoke; first viewport uninspected; (2) `h1{max-width:24ch}` broke a 7-word question into three ragged lines; (3) feedback hairline measured 68ch at 16 px, ending short of the 20 px prose; (4) canon router open state overflows at 768 (canon CSS). Applied: closed-state captures added (no harness change — smoke scoping filed in canon-requests.md), `max-width:30ch`, `width:min(100%,85ch)`, canon note filed.
- Verdict pass: **ship** — 3/3 page fixes resolved, item 4 recorded; no regressions. Process note from the reviewer: review captures for the 12 forked FAQ pages should be taken closed-state the same way until the smoke is re-scoped or the router art is eager in canon.
- Kept per the reviewer: the single left-anchored answer column at lead size on white with the hairline feedback row — no related-questions rail, no card, no centered column.
