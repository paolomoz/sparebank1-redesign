<!-- stardust:provenance
  writtenBy: stardust:direct (via stardust master intent-reasoning, hands-off; then direct --prep overlays)
  writtenAt: 2026-09-14T21:10:00Z
  againstInput: "Modernise the SpareBank 1 site — it looks old. A contemporary, confident, calm Nordic bank: generous whitespace, stronger typographic hierarchy, editorial photography treated as content not decoration, cards and rails simplified, one clear action per module. Keep the brand (Fjell #002776, Vann #005aa4, action green #00754e, Sand/Frost tints, SpareBank1 faces — fallbacks in the extraction), keep every page's content and every CTA/href; mobile-first; accessible (WCAG AA)."
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/_ffe-tokens.json
    - stardust/current/PRODUCT.md, DESIGN.md, DESIGN.json (descriptive current state)
    - stardust/current/brand-review.html § Tensions
    - stardust/current/_page-types.json, _modules.json, _prep-inventory.json
    - stardust/prototypes/nb-bank-privat-html-improvements.md
    - refero styles d8a01033 (Fruitful), f72e18d0 (Open Collective), 3e14bbe4 (MANNA), 530fc441 (Munro Partners)
  synthesizedInputs: []
  stardustVersion: 0.20.0
-->
---
title: "Modernise the SpareBank 1 site — a contemporary, confident, calm Nordic bank"
resolvedAt: 2026-09-14T21:10:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

# Hands-off mode — activated 2026-09-14T20:50:00Z

Activated by the autonomous presales mandate (Paolo relaying Bertrand's SpareBank 1 pilot; Flow B = the redesigned deliverable). `state.json.handsOff: true`. Every interactive gate auto-resolves per master SKILL.md § Hands-off mode; **quality gates run at full strength** (validation loop at 1440/768/390, critique + audit + adapt cascade, craft bar, provenance). Archetype approvals are recorded `approvedBy: "hands-off"` only after every gate passes.

## Named assumptions (hands-off)

- **A0 — provenance regex.** Flow A's live crawl used `waitMode: "slow"`; the spec regex omits `slow`. Admitted (all other live-render conditions hold on 100/100); flagged for plugin maintainers. Validator: `stardust/scripts/validate-provenance.mjs`.
- **A1 — one canonical direction.** No variant fan-out. The direction below is the single target.
- **A2 — ia-fidelity: verbatim.** The phrase does not auto-pin; the brief says "keep every page's content and every CTA/href" and asks to simplify modules ("cards and rails simplified, one clear action per module"), not to re-sequence pages; `migrate` will fork 13 archetypes onto 100 pages whose section sequences vary. Verbatim spine, re-composed surface. Surprise budget capped at `low` site-wide (low ≠ generic: brand-faithful + improvements 1–7 + signature preservation).
- **A3 — density: balanced (floor accepted).** "Generous whitespace" moves density toward airy, but the captured inventory fires the multi-audience hard floor (11 sections on the market landing; 3 audience tracks Privat · Bedrift · Om oss) → `sectionPadding.desktop` bounded at 64 px. Whitespace is spent inside modules (measure, line-height, card gaps, fewer bands per page) rather than as band padding.
- **A4 — audience.** Norwegian retail customers and SMBs of the alliance, plus om-oss readers (press, investors, candidates); scene: on a phone, often mid-task (block a card, check a rate, find the local bank); bokmål; WCAG 2.1 AA required by forskrift om universell utforming av IKT. Derived from `current/PRODUCT.md § Users` + nav taxonomy.
- **A5 — fonts.** SpareBank1 Title-Medium / Medium / Regular are the customer's proprietary web faces; self-hosted from the captured woff2 for the customer pilot (same as Flow A A5). Fallback stack `arial, sans-serif` as captured.
- **A6 — volume caps.** 100 pages overall, 20 per template (inherited roster, `stardust/current/_page-types.json`). 13 archetype families → 13 approved prototypes; the rest migrate by fork.
- **A7 — dynamics.** The dynamic surface triage is the same site's (20 features, 13 self, one owner batch, 3 decided-out) — reused from Flow A, re-recorded in Phase 4.5; decided-out items stay out.
- **A8 — bank-choice band treatment.** IA priority preserved (first viewport, audience routing) with a changed visual treatment (compact band) — allowed by § 8 rule 1; the landscape illustration is a site-wide signature motif (§ 8b) and is carried at reduced scale, not dropped.

---

# Active direction (2026-09-14T21:10:00Z)

## Phrase

> Modernise the SpareBank 1 site — it looks old. A contemporary, confident, calm Nordic bank: generous whitespace, stronger typographic hierarchy, editorial photography treated as content not decoration, cards and rails simplified, one clear action per module. Keep the brand (Fjell #002776, Vann #005aa4, action green #00754e, Sand/Frost tints, SpareBank1 faces — fallbacks in the extraction), keep every page's content and every CTA/href; mobile-first; accessible (WCAG AA).

## Restatement

A brand-register refresh of a multi-audience bank catalogue that keeps the brand's palette, faces, content and links, and changes the *execution*: the expressive axis moves from restrained to committed (a real display scale on the bank's own title face), tone stays serious-warm but calmer (less illustration-as-decoration, more real photography as content), density stays balanced by contract but every module gets one job and one action, and distinctiveness moves from familiar to distinctive by making the alliance's own signatures — the "flere banker" router, the large-radius photo mask, the Nordic nature palette — carry the page instead of card chrome. The spine of every page is verbatim; the surface is re-composed.

```
Reading the phrase:
  • register:        brand (inherited from current/PRODUCT.md; Persuade on landings/products, Read on FAQ/news, Operate on tools)
  • expressive axis: restrained → committed (moved: "stronger typographic hierarchy", "confident")
  • tone:            professional-warm → calm-confident (moved: "calm", "confident"; warmth kept through people photography)
  • density:         balanced (phrase moves toward airy; multi-audience floor holds — A3)
  • distinctiveness: familiar → distinctive (moved: "contemporary, confident"; must not collapse to the Generic-2026-SaaS silhouette)
  • audience:        A4 (captured)
  • constraints:     brand-faithful · legacy-content-preserved · a11y-first (WCAG AA) · mobile-first · IA-priority preservation (§ 8) · signature preservation (§ 8b)
```

## Movements

- **register** — `brand` (inherited)
- **expressive axis** — `restrained` → `committed` (moved by phrase) → type ratio 1.25
- **tone** — `professional-warm` → `calm-confident` (moved by phrase; serious side of neutral, never cold)
- **density** — `balanced` (hands-off default — multi-audience floor fired; A3). `sectionPadding` 64 / 48 / 32
- **distinctiveness** — `familiar` → `distinctive` (implied by "contemporary, confident")
- **audience** — A4
- **ia-fidelity** — `verbatim` (hands-off assumption A2; phrase did not auto-pin)
- **constraints** — brand-faithful (palette + faces pinned), legacy-content-preserved (every heading, paragraph, CTA label, href, image, FAQ verbatim), a11y-first, mobile-first, IA-priority preservation, signature preservation

## Gaps and questions (answered as named assumptions)

1. **Q (density):** airy (~96 px) vs balanced (64–72) vs packed? — **A: balanced, floor accepted (A3).**
2. **Q (ia-fidelity):** verbatim vs reimagined? — **A: verbatim (A2).**

Audience and register were inferable with high confidence from the captured surface; no question slot spent.

## Mode

**Brand-faithful mode active (Mode A)** — captured signal `signal-strong` (palette ≥ 3 distinct colours after clustering: Fjell, Vann, Skog, Sand, Frost, Multe, Lyng…; type families named: SpareBank1-title-medium / medium / regular). Palette and type pinned to the captured surface; image-reuse contract holds (captured images at the same semantic position; no synthesised placeholders); signature preservation holds. `--rebrand` not passed; the phrase contains no rebrand trigger ("modernise" is a migration-shaped ask). **Mode A+**: not activated — no improvements-list item names a captured face or colour as a weakness (the ad-hoc *scale* is a token change inside Mode A, not a face change).

## Anchor references (research-first, refero MCP tier 1 — 3 searches, 4 retrievals)

- **Fruitful** (`d8a01033`, https://fruitful.com) — primary anchor for mood + density: calm consumer finance, white canvas, one deep green for the primary action, candid human portraits in soft tinted containers, sections alternating white / tinted paper. Implies decade `2025-now`, ground `stark-white` with tinted alt-surfaces. Tag: **off-toolbox** (green-not-blue fintech, photography-as-guide rather than lifestyle hero).
- **Open Collective "Raise"** (`f72e18d0`, https://opencollective.com) — navy typography + single blue action on white, 1200 px container, hairline borders instead of shadows, illustration for warmth. Structurally closest to SB1's Fjell/Vann system. Tag: **in-toolbox** (centered hero + pill buttons is the fintech default) — borrowed only for the border/shadow discipline.
- **MANNA** (`3e14bbe4`, https://www.mannaarchitects.com) — out-of-category: photography as uncropped open image blocks with captions, not cards; sections delineated by ground-colour shifts; 0 shadows. Implies register `Museum didactic` (gallery presentation). Tag: **off-toolbox**. This is the anchor for "photography as content, not decoration".
- **Munro Partners** (`530fc441`, https://www.munropartners.com.au) — restrained financial institution: hairline dividers, flat cards, one accent for the CTA, imagery contained and functional below the hero. Tag: **off-toolbox** (warm-oat ground is NOT ported — brand ground is white; the band discipline is what is borrowed).
- Rejected from the search results: N26 (colour-block hero + centered headline = in-toolbox), Mercury / Revolut / Cosmos (dark-mode-by-reflex, not this brand's ground), Monzo (coral signature, another brand's identity).

Synthesis: Fruitful sets mood and density; MANNA sets the photo treatment; Open Collective / Munro set the border-and-shadow discipline. Palette and type are never borrowed (Mode A).

## Anti-references

- **Generic-2026-SaaS silhouette** (toolkit § 1): oversized centered sans hero + two-button CTA pair + sticky nav + serial footer — guardrailed explicitly because "modernise" is its most common trigger. Heroes here are left-anchored split compositions with the photo as content.
- **Cream-family page ground**: the seed rolled `cream`; the brand's ground is `#ffffff` (Mode C override `brand-faithful`). Sand tints are alt-section paper only.
- **Card-as-container** (craft-floor): same-size icon + heading + text cards as page structure — the captured site's main dating agent (improvements #4).
- **Kicker / eyebrow above headings** (craft-floor ban): captured "TIPS OG RÅD" labels become a meta line under the title.
- **Dark-mode-by-reflex, glassmorphism, gradient text, stat-callout bar**: none apply to this brand; none used.
- **Hero text on photograph without a scrim**: article heroes place type beside/below the photo instead (improvements #5).

## Divergence inputs

- **seed** — `SpareBank 1|2026-09-14` MD5 `21334f24d1387c6579ca902b6745c96d` → deterministic roll `1960s × Photogram × Real-estate listing × cream`. Research-first precedence: decade `2025-now` (`reasoned: Fruitful, Open Collective, MANNA`), register `Museum didactic` (`reasoned: MANNA — photography presented as captioned content blocks`), craft `Photogram` (`deterministic` — research implied no craft; used as a constraint: imagery and the flat spot illustrations sit directly on tinted paper fields with no card chrome or shadow, like objects on photographic paper), ground `stark-white` (`brand-faithful` override of the rolled cream, Mode C; the rolled cream informs the alt-section surface → Sand-30 `#fdf8f5`, which is brand-native).
- **font deck** — `brand-inherited` (`picked_by: user-constraint`): SpareBank1-title-medium (display/headline), SpareBank1-medium (title), SpareBank1-regular (body). All three are static single-weight (400) families → Discipline 7 static-only exemption documented in `DESIGN.json.extensions.divergence.font_deck.notes`.
- **palette** — inherited from `_brand-extraction.json` + `_ffe-tokens.json` (`picked_by: user-constraint`); role names are the brand's own Norwegian nature names (Fjell, Vann, Skog, Natt, Frost, Sand, Syrin, Multe, Lyng, Bær, Nordlys, Sol; Svart / Koksgrå / Mørkgrå / Lysgrå / Hvit) — toolkit § 4 satisfied without renaming. Every text-on-ground pair used by the system is validated ≥ 4.5:1 (see DESIGN.md § Colors § Named rules).
- **anti-toolbox audit** — 1 hit: *Sticky top navigation* — scoped to **mobile only**, justified by the captured behaviour (the live header morphs to fixed on scroll: `.header__wrap.scroll/.show`, clientlib module 2741 — a brand behaviour, not an agent reflex). Desktop header is static as captured. Off-toolbox moves: (1) compact router band carrying the alliance landscape at reduced scale (brand-specific: the 12-bank alliance is the brand's actual structure); (2) single-corner-pair large-radius photo mask derived from the captured 96 px motif (785 occurrences — it could not exist for another brand).
- **brand-faithful inversions** (auto-emitted, Mode A):
  - *pure-white retention* — `#ffffff` retained as page ground (6,418 captured white backgrounds; `#fff` is canonical for SpareBank 1, `--ffe-farge-hvit`). The impeccable "no pure white" rule is inverted per brand-faithful direction.
  - *hex format retention* — colour tokens retained in hex (matches `_ffe-tokens.json` and the Stitch frontmatter convention). OKLCH applies to new authoring; this is inheritance.
  - *saturated colour retention* — saturated Vann `#005aa4` (HSL S 100 %) retained as the primary action/link colour and Fjell `#002776` as the heading colour (the brand's canonical voice); the tinted-neutral reflex is inverted.
  - *reserved colour* — Skog `#00754e` reserved to action CTAs (Logg inn, Bli kunde, Søk lån/Bli kunde flows) and success states only (392 captured occurrences, all `ffe-button--action`); the "spread the accent" reflex is inverted. Recorded in `extensions.colorReservations[]`.
  - *photo treatment retention* — natural, warm real-people photography kept untreated (no B&W, no overlay); the change is scale and cropping, not treatment.
  - *pill button retention* — 6em pill buttons kept (`--ffe-v-buttons-border-radius`); the 8–12 px "modern" radius reflex is inverted for buttons only.
- **house standards opted in** (toolkit § 7, not counted): 7.1 banned marketing adjectives (applies to any direction-authorised chrome copy — content itself is verbatim); 7.2 no added exclamation points (captured "Se hva du kan spare!" stays — verbatim content).

## Command sequence (proposed)

1. `$stardust direct` (this command) — write direction + PRODUCT.md / DESIGN.md / DESIGN.json; then the `--prep` overlays (type catalog, module catalog, colour reservations, wider re-evaluation, metadata).
2. `$impeccable detect --json stardust/current/pages/<archetype>.html` — deterministic baseline of the captured archetypes (gathering; the launcher works in 4.3.1, `load-context.mjs` does not exist).
3. `$stardust prototype --prep --canon-from nb-bank-privat-html` — per archetype: shape brief → craft (typeset + layout + distill folded into the render against DESIGN.md: "running `distill` to remove card chrome and dividers; `typeset` to move the expressive axis to committed on the pinned faces; `layout` to land the 64 px rhythm") → critique + audit + adapt → validation loop → hands-off approval → canon.
4. `$impeccable polish` — final pass on each approved archetype before approval (folded into the validation loop).
5. prepare-migration Phase 4 (assets) and 4.5 (dynamics gate, reuse A7).

## User confirmation

> hands-off (plan recorded here instead of awaiting confirmation; master SKILL.md § Hands-off mode)

## Pages in scope

All 100 extracted pages (`stardust/state.json`), 13 archetype families → 13 archetype prototypes (canon author: `nb-bank-privat-html`, market-landing — the most-trafficked landing, the densest chrome, the router's home):

| family | type | pages | archetype |
|---|---|---|---|
| market-landing | landing | 3 | nb-bank-privat-html |
| product | program | 30 | nb-bank-privat-lan-boliglan-html |
| category-hub | landing | 20 | nb-bank-privat-lan-html |
| kundeservice-hub | landing | 2 | nb-bank-privat-kundeservice-html |
| faq | article | 12 | nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html |
| news-article | article | 10 | nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html |
| news-listing | listing | 1 | nb-bank-om-oss-nyheter-html |
| campaign-landing | landing | 1 | nb-bank-om-oss-hjemme-html |
| om-oss | static | 8 | nb-bank-om-oss-presse-html |
| tool | form | 6 | nb-bank-privat-kundeservice-verktoy-sperre-kort-html |
| utility | static | 2 | nb-bank-privat-kundeservice-kontakt-html |
| theme | program | 4 | nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html |
| markedsnytt-listing | listing | 1 | nb-bank-privat-sparing-markedsnytt-html |

Pages that will be marked stale: none (no prior prototypes).

## Prep overlays (direct --prep, same turn)

- **Type catalog confirmed** — the 7-value stardust catalog stands (`landing 26 · program 34 · article 22 · static 10 · form 6 · listing 2`); `archetypeFamily` (13) is the per-site refinement used for archetype selection and migrate forking. No page is `unique`.
- **Module catalog finalised** — 45 candidates → 33 confirmed brand modules (renamed to brand-native ids, slots typed), 7 pruned as CSS utilities / duplicates (`color-fillable`, `visually-hidden`, `header--disable-bottom-links`, `footer` inside `<main>` on frontend-clientlib pages, `header` inside `<main>` merged into `article-header`, `question-page__question-container` → `faq-question`, `sb1-story__body` merged into `article-body`), and the `bank-choice` router (a `complementary` landmark on 70 pages, missed by the main-child scan) added. See `DESIGN.json.extensions.modules[]`.
- **Colour reservations** — Skog `#00754e` → `module:button-row[action]`, header action, success states; Bær `#e44244` → error states only; Sol `#dc8000` → focus ring + tips icon only.
- **Wider re-evaluation** — the 100-page inventory confirms the brand register (Persuade landings/products, Read FAQ/news, Operate tools); the `nettsider-frontend` clientlib pages (12/100: news, campaign, stories) are the same brand with a client-rendered `<main>` — same direction applies. New tension surfaced: the om-oss / news family carries a text-over-photo hero (improvements #5) — direction bans it (anti-reference). No re-direct needed.
- **Brand metadata** — `siteName` SpareBank 1, locale `nb-NO`, `themeColor` `#002776` (Fjell — the redesign's chrome colour; captured `#ffffff` was the default), default OG image = captured logo thumb, Organization JSON-LD (name, url, logo), `keyFacts`: rate examples ("Priseksempel: Nominell rente … Effektiv rente …") must stay server-rendered verbatim.

### Refinement (2026-09-15T00:40:00Z) — prototype --prep system additions (canon-driven, no direction change)

Approving 13 archetypes surfaced system-level gaps that DESIGN.md now carries (no axis moved; verbatim IA; fold-back is a no-op under `ia-fidelity: verbatim`): one door language (photo-led items flat on paper, text-only items on a Hvit hairline paper on tinted movements); the Disabled Rule; `.badge`, `.callout.info`, `.video-frame`, feedback-strip markup; video mask = top-left corner only; spacing frontmatter reconciled with the `:root` contract (xs 4 · sm 8 · md 16 · lg 24 · gutter 32 · xl 48 · 2xl 64 · 3xl 96). Named assumptions added: **A9** — authenticated-state header affordances (`Til nettbank`, `Til forsikring`, `Logg ut`, shown by the live site only after log-in) are not rendered for anonymous visitors and are excluded from the verbatim gate; the Logg inn action links to the captured login URL. **A10** — 12 `tel:` hrefs added on the kontakt directory's captured phone text (text verbatim; usability). **A11** — the boliglån calculator shell's visible strings come from the captured screenshot (`data-source="captured-screenshot"`; the DOM mount was empty at capture) — migrate must re-capture the settled widget or take owner copy before shipping. **A12** — the two-tinted-movement cap holds on story pages (hjemme keeps a long Hvit run rather than a third tint).
