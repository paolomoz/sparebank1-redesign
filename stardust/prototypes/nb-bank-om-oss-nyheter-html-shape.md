<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Worker C, hands-off)
  writtenAt:        2026-09-14T23:25:00Z
  page:             nb-bank-om-oss-nyheter-html
  pageUrl:          https://www.sparebank1.no/nb/bank/om-oss/nyheter.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-om-oss-nyheter-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-om-oss-nyheter-html.json
    - stardust/current/pages/nb-bank-om-oss-nyheter-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-om-oss-nyheter-html.png
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/ARCHETYPE-BRIEF.md
    - stardust/prototypes/nb-bank-privat-html-improvements.md (#3, #4, #5, #6)
    - stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
  conceptSeed:      surface roll key 5c11ed6c (mode read) — dealt 4, 1, 6 of the ordered structure list; 4 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — `main > header.header` (nettsider-frontend clientlib), om-oss variant, Nyheter current; injected by the builder
    - h1 — `main > div.sb1-articles__content > div.title > h1.ffe-h1` "Nyheter"
    - featured — `div.newscards > article.newscard__headline.newscard` (1 card: photo bm_startup_enk275 1280, tag "Svindel", h2 title, date "7/8/2026", whole-card link)
    - listing — `div.newscards > article.newscard` ×30 (photo 768 thumb — 3 cards carry no image —, `.tag__item` category, `h2.newscard__title`, `.newscard__date`, `a.newscard__click-area` href)
    - more — `div.newscards-footer a.ffe-button--shortcut` "Se flere artikler" → `?limit=31&offset=31` (chevron icon is a masked data-URI, decoration)
    - footer — `main > footer.footer` (nettsider-frontend): Snarveier 5 · Logg inn 4 · Sosiale medier 2 (Linkedin / YouTube icons) · 5 small links · address. Built locally in the footerData() shape (tabs: []).
  antiTemplatePass:
    - { pattern: "featured headline card (photo, kicker pill, centered H2 over a white card)", defaultReflex: "big centered card with an eyebrow", alternatives: ["full-width photo with the headline under it (newspaper front)", "7/5 split: photo left as content, title + meta right, left-anchored", "same size as the other cards (no featured)"], picked: "7/5 split, photo left", rationale: "the captured page singles out the newest story; DESIGN heroes are left-anchored 7/5 splits with the photo as content (No-Overlay Rule); the kicker becomes a meta line (craft-floor ban)", reference: "refero d8a01033 Fruitful, 3e14bbe4 MANNA" }
    - { pattern: "30 news cards: white, shadow, hairline top, kicker above the title", defaultReflex: "shadowed card grid", alternatives: ["shadowed white cards (captured)", "flat items on white: 3:2 photo with the 48 px mask, title, meta (category · date) under the title, whole item is the link", "text-only ledger with dates"], picked: "flat items on white", rationale: "improvements #4 one card language — same shape as the canon 'Nytt og nyttig' rail; photos keep 3:2 (#6); a ledger would drop 27 captured photographs" }
    - { pattern: "listing on a phone", defaultReflex: "1-up stacked cards with full-width photos (~10 000 px)", alternatives: ["1-up full-width photos", "thumbnail-left rows (120 px photo · title · meta) at ≤ 640", "2-up tiny cards"], picked: "thumbnail-left rows at ≤ 640", rationale: "mobile-first: 30 items must stay scannable; the canon article rail already uses the same row shape, so the site keeps one small-card language" }
    - { pattern: "'Se flere artikler' shortcut button with chevron", defaultReflex: "centered pill with icon", alternatives: ["primary pill", "inline text pill with the canon chevron (DESIGN: inline for 'Se flere …')", "load-more disabled control"], picked: "inline pill (.btn-inline + icons.chevron), left-anchored under the grid", rationale: "DESIGN § Buttons — inline for 'Se alle banker' / 'Se flere …'; the captured href (`?limit=31&offset=31`) is a real link, kept verbatim (dynamics #11 index-backed listing later)" }
  substrateTransitions:
    default: Hvit
    exceptions: []
    note: "a listing is one continuous surface; movements are separated by space (H1 → featured → grid → more) not by paper"
  voiceClassification:
    - { section: header, classification: captured-verbatim }
    - { section: h1, classification: captured-verbatim }
    - { section: featured, classification: captured-verbatim }
    - { section: listing, classification: captured-verbatim, source: titles, categories, dates (captured d/m/yyyy strings kept as-is), hrefs, image srcs }
    - { section: more, classification: captured-verbatim }
    - { section: footer, classification: captured-verbatim, source: footer columns / small links / address; social names from captured title attributes }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "96px photo mask (785 occurrences)", mechanism: "one-corner-pair mask 96px on the featured photo, 48px on listing photos, 24px on the 120px mobile thumbnails", fallback: "square photo" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-om-oss-nyheter-html
url: https://www.sparebank1.no/nb/bank/om-oss/nyheter.html
register: brand
mode: read
surprise: low
dominantDimension: composition/featured-spread-flat-grid
---

# Page shape: nb-bank-om-oss-nyheter-html (news-listing archetype)

Structure list (ordered by resonance) for the surface roll (key 5c11ed6c, read): 1 newspaper front (featured full-width photo + headline, dense 4-up grid) · 2 uniform 3-up grid, no featured story · 3 alternating photo-left / photo-right rows · **4 featured spread + flat 3-up grid (dealt lead — built)**: H1, newest story as a 7/5 split, 30 flat items 3-up → 2-up → thumbnail rows, "Se flere artikler" inline · 5 two-column feed with a right rail (no rail content captured — rejected) · 6 month-grouped ledger with hairline group headers (would add month labels not captured — recorded, not built) · 7 photo mosaic. Dealt alternates 1 and 6 are recorded, not built.

## Sections (in render order)

1. **header** (system role `header`, canon; om-oss variant, Nyheter current). No router (none captured on the om-oss tree).
2. **h1 + featured** (module `article-header` variant `featured`) — Hvit; H1 "Nyheter" (headline scale) with the newest story below it as a 7/5 split: photo left (`bm_startup_enk275`, 3:2, 96 px mask, eager + fetchpriority high — the LCP), right: title in Title (h2, 31 px), meta line "Svindel · 7/8/2026"; the whole block is the link (title link with an overlay). Order ≤ 1023: photo → title → meta.
3. **listing** (module `card-rail` as a grid) — Hvit; h2 hidden? No — the captured page has no list heading, so none is added; the grid follows directly. 30 flat items, 3-up ≥ 1024 (gap 32/48), 2-up 641–1023, thumbnail rows ≤ 640 (120 px photo · title · meta). Each item: photo 3:2 (48 px mask) when captured · title (h2 in the medium face at 20 px — 30 headings at 25 px would shout; 20 sits on the 1.25 scale) · meta (category · date, Label). Items without a captured photo render text-only, aligned to the same grid.
4. **more** — "Se flere artikler" as an inline pill with the canon chevron, href verbatim `?limit=31&offset=31`.
5. **footer** (system role `footer`, canon) — built from `main > footer.footer`; no contact row.

## Layout strategy

- Density balanced: `--section-padding` 64 / 48 / 32; container 1280.
- Featured `7fr 5fr` ≥ 1024, stacked photo-first below (a listing's featured photo is the page's only large image; it lands under the H1 in the first viewport at 390 too).
- Grid: `repeat(3, minmax(0,1fr))` gap 48 × 32 → 2-up → 1-up rows with a 120 px thumbnail column.
- No `<hr>`, no card chrome, no paper changes.

## Key states

- Item hover/focus-within: title underline, no shadow at rest (flat on white).
- "Se flere artikler" is a real link (page 2); dynamics #11 will make the listing index-backed.

## Interaction model

- Burger: canon CSS checkbox + a11y script. Every href verbatim.

## Data attributes

- `section[data-section="featured"][data-intent="the newest story"][data-layout="split-media"][data-media="image"][data-module="article-header"][data-items="1"]`
- `section[data-section="listing"][data-intent="browse all news"][data-layout="grid"][data-module="card-rail"][data-items="30"][data-media="image"]`
- `section[data-section="more"][data-intent="next page of the listing"][data-layout="contained"][data-module="button-row"]`
- `body[data-template="listing"]`

## Unsourced content (placeholder list)

(none).

## Unsourced / Excluded

- The chevron on "Se flere artikler" is a masked data-URI span (decoration) — replaced by the canon chevron icon.
- Header "Bli kunde": captured as a JS `<button>` without href on frontend-clientlib pages → `headerData()` yields null; flagged to the lead (shared data.mjs).
- Captured `hr.footer-columns__divider` — decoration.
- Header logo `logo-sparebank1.svg` — rendered inline by the canon chrome; the content checker's exclusion regex only knows `logo.svg` (lead: extend the regex).

## Review

`impeccable:impeccable-finish-reviewer`, one round (same packet shape as the canon: request, constraints incl. offline Frost plates, artifact, 3 screenshots, brief, direction.md, DESIGN.md, PRODUCT.md, improvements, captured screenshot, detect.json, report.json, craft-floor). Round 1 disposition **fix-then-ship** (scores 4·3·3·4·4). Material fixes applied in one batch:

1. Movement separation: featured → grid now 96 px (`.featured` padding-bottom 48 + `.listing` padding-top 48) against a 48 px row gap.
2. `.news-item.no-photo` hairline removed (a divider by another name); `align-self:end` ≥ 641; ≤ 640 the text stays in the 136 px scan column (`.news-text{grid-column:2}`).
3. "Se flere artikler" stands 48 px off the last row (`.listing` padding-bottom).
4. Grid gap 48 × 48 (brief said 48 × 32; 32 is not a canon token — `--spacing-lg` is 24 — so both axes use `--spacing-xl`).
5. `.meta` Mørkgrå on Hvit (DESIGN § Neutral), separator inherits.
6. ≤ 640 rows `align-items:start`.

Verdict pass: **ship** — brand-fit 4 · hierarchy 4 · calm-vs-generic 4 · mobile composition 4 · contract compliance 5; remaining: clear.

## Validation

- Harness: `nb-bank-om-oss-nyheter-html: PASS — 0 P0/P1, 0 P2/P3; externalFulfilled 28/16/25; heights 5136/7149/5286` (390 / 768 / 1440). 360 nav audit: over 0, minFont 14, hamburger; burger opens, aria-expanded syncs, Escape closes.
- Content check: `checked text 84, hrefs 84, imgs 30; missing text 0, hrefs 0, imgs 2` — the 2 images are `logo-sparebank1.svg` (header + in-main header copy; canon renders the logo inline, checker regex knows only `logo.svg`). Everything else PASS.
- Detect: 4 hits — 3 × `cramped-padding` on chrome (`.hdr-utility`, `.footer-main`, `.footer-legal`) and 1 × `tight-leading` 1.2 on `.feat-title` (heading leading per DESIGN Title 1.2) — all dismissed.
- Viewport heights: 1440 → 5286 px · 768 → 7149 px · 390 → 5136 px.
- `data-deviation` elements: none (24 px mask on the 120 px mobile thumbnails is recorded in the brief § signatureElements as a scale adaptation, not a canon contradiction).
- Footer: built locally from `main > footer.footer` (columns Snarveier 5 · Logg inn 4 · Sosiale medier 2 · 5 legal links · address; tabs `[]`).
- Dynamics interim: "Se flere artikler" kept as the captured page-2 link (#11 index-backed listing at rollout).
