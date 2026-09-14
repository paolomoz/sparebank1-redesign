<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Worker C, hands-off)
  writtenAt:        2026-09-14T23:05:00Z
  page:             nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html
  pageUrl:          https://www.sparebank1.no/nb/bank/om-oss/nyheter/bankkort-laget-av-resirkulert-plast.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html.json
    - stardust/current/pages/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html.png
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/ARCHETYPE-BRIEF.md
    - stardust/prototypes/nb-bank-privat-html-improvements.md (#3, #4, #5, #6)
    - stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
  conceptSeed:      surface roll key adc00a6a (mode read) — dealt 4, 5, 7 of the ordered structure list; 4 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — `main > header.header` (nettsider-frontend clientlib renders the chrome inside <main>); om-oss variant (market nav Om SpareBank 1 · Presse · Investor · Jobb og karriere · Samfunnsansvar · Nyheter); injected by the builder from headerData(doc)
    - article-header — `main > div.sb1-article > div.sb1-article__header`: `.sb1-article__header-image figure` (hero photo Betaling_med_bankkort + figcaption), `.tag__item` "Bærekraft", `h1.ffe-h1`, `.author-text__date` "9. februar 2022", `.some` share buttons ×3 (aria-labels + inline SVG glyphs)
    - article-body — `div.sb1-article__content`: `.sb1-article__content-teaser .text-content p` (lead), `.text .text-content` ×3 (h2 + p prose), `.sb1-article__content--right-adjust.image figure` (inline portrait + figcaption), `.infoBox .infoBox__content.sb1-bgcolor__sand-70 .text-content` (h2 "KORT OM KORT:" + ul ×4)
    - related — `div.sb1-article__aside`: `.related-list h2` "Relaterte artikler" + `article.related-list__item a` ×5 (img + text); `.tags h2` "Relaterte tema" + `a` ×2 (#Bærekraft, two distinct hrefs)
    - footer — `main > footer.footer` (nettsider-frontend): `.footer-columns__top .footer-columns__column` ×3 (Snarveier 5 · Logg inn 4 · Sosiale medier 2 icon links titled Linkedin / YouTube), `.footer-columns__bottom li a` ×5, `.footer-info` address. Built locally in the page module in the footerData() shape (tabs: []) and returned as `footer:`.
  antiTemplatePass:
    - { pattern: "article hero (text over photo with gradient scrim)", defaultReflex: "full-bleed photo, white H1 over a gradient", alternatives: ["photo full-width above the headline (magazine cover)", "7/5 split: headline + meta + lead left, photo as captioned content right", "headline only, photo demoted into the body"], picked: "7/5 split, photo right as captioned content", rationale: "improvements #5 / DESIGN No-Overlay Rule — type never sits on a photograph; the captioned photo IS the story's content (MANNA), so it stays in the first viewport beside the headline rather than above it (which would push the H1 below the fold on 390) or below it (which would demote it)", reference: "refero 3e14bbe4 MANNA" }
    - { pattern: "kicker 'BÆREKRAFT' pill above the H1", defaultReflex: "eyebrow badge above the heading", alternatives: ["eyebrow pill (captured)", "meta line under the H1: category · date", "category only in the tema badges"], picked: "meta line under the H1 (category · date)", rationale: "craft-floor ban on eyebrows; DESIGN Label rule — category labels go under the title; the date joins it so the byline row carries both facts in one line" }
    - { pattern: "body prose + right rail 'Relaterte artikler'", defaultReflex: "cards with shadow in a sidebar", alternatives: ["horizontal 5-card rail at the end of the article", "flat vertical rail beside the prose: 3:2 thumb + title, whole item is the link", "text-only list of links"], picked: "flat vertical rail beside the prose (sticky on ≥1024, stacks below on smaller widths)", rationale: "improvements #4 one card language, flat on white like the canon news rail; thumbnails keep native 3:2 (#6); the rail stays reachable during a long read" }
    - { pattern: "sand info box 'KORT OM KORT:'", defaultReflex: "bordered call-out with icon", alternatives: ["callout with bulb icon (canon .callout)", "Sand-30 paper factbox with heading + bulleted list, no icon, no border", "inline prose"], picked: "Sand-30 factbox", rationale: "captured sb1-bgcolor__sand-70 is the brand's own warm paper; a tips icon would mislabel a fact list; DESIGN card tokens (Sand-30, 16 px, 24 px padding)" }
    - { pattern: "share buttons (Facebook · LinkedIn · Twitter)", defaultReflex: "brand-coloured social buttons", alternatives: ["captured 32 px glyph row", "44 px Vann icon buttons with hairline ring, captured glyphs recoloured to currentColor", "text links 'Del på …'"], picked: "44 px icon buttons, captured glyphs lifted verbatim, aria-labels verbatim", rationale: "the glyphs are captured content (inline SVG paths); one colour (Vann) keeps the palette rule; 44 px targets" }
  substrateTransitions:
    default: Hvit
    exceptions: []
    note: "the factbox is a Sand-30 element inside the Hvit body movement, not a movement of its own; the page is one continuous reading surface"
  voiceClassification:
    - { section: header, classification: captured-verbatim, source: header links; "Meny" = direction-authorized chrome }
    - { section: article-header, classification: captured-verbatim, source: h1, tag, date, figcaption, share aria-labels }
    - { section: article-body, classification: captured-verbatim, source: text-content innerHTML lifted (h2/p/ul/li), figcaption }
    - { section: related, classification: captured-verbatim, source: related-list items + tags }
    - { section: footer, classification: captured-verbatim, source: footer columns / small links / address; social link names from the captured title attributes (Linkedin, YouTube) }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "96px photo mask (785 occurrences)", mechanism: "one-corner-pair mask 96px on the hero photo, 48px on the inline portrait, 24px on the 120px rail thumbnails (cited deviation)", fallback: "square photo" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html
url: https://www.sparebank1.no/nb/bank/om-oss/nyheter/bankkort-laget-av-resirkulert-plast.html
register: brand
mode: read
surprise: low
dominantDimension: composition/reading-room-spread
---

# Page shape: nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html (news-article archetype)

Structure list (ordered by resonance) for the surface roll (key adc00a6a, read): 1 magazine cover (photo full-width above the headline) · 2 ledger (headline only, photo demoted into the body, related as an end rail) · 3 canon mirror (photo left 7 / text right 5, single-column body) · **4 reading-room spread (dealt lead — built)**: headline + meta + lead left, captioned photo right; 68ch prose with a flat related rail beside it · 5 photo-below (headline block across 68ch, photo below at content width) · 6 two-page spread (sticky headline column) · 7 single column, related as a 5-card grid at the end. Dealt alternates 5 and 7 are recorded, not built.

## Sections (in render order)

1. **header** (system role `header`, canon; om-oss variant) — injected by the builder from the captured in-main header: audience Privat · Bedrift · Om oss (Om oss current), market nav Om SpareBank 1 · Presse · Investor · Jobb og karriere · Samfunnsansvar · Nyheter (Nyheter current), Søk, Logg inn. No router (no `.bank-choice` captured — the om-oss tree never carries it).
2. **article-header** (module `article-header`) — Hvit; 7/5 split on ≥ 1024: left column H1 "Ditt neste bankkort er laget av resirkulert plast" (headline scale, ≤ 22ch), meta line under it (`Bærekraft · 9. februar 2022` — the captured kicker demoted to a meta line, improvements #5 / craft-floor eyebrow ban), lead (the captured teaser paragraph, 20/30), share row (3 × 44 px icon buttons, captured glyphs, aria-labels "Del på Facebook / LinkedIn / Twitter", `type="button"` — dynamics interim, no share URL is captured). Right column (equal halves, photo ≈ 617 px at 1440): the hero photo `Betaling_med_bankkort` as a `<figure>` at content scale (3:2, 96 px one-corner mask, `loading="eager" fetchpriority="high"` — the LCP) with its figcaption "SpareBank 1 går for mer klimavennlige bankkort." in Small. Order ≤ 1023: H1 + meta → photo (max-width 600 px between 641 and 1023, full width below) → lead + share.
3. **article-body** (module `article-body`) — Hvit; two columns on ≥ 1024: prose (68ch) + related rail. Prose: `.text-content` blocks lifted as HTML (3 paragraphs, h2 "Like trygt med like lang holdbarhet" + 4 p, h2 "Retur av gamle kort" + 4 p); the inline portrait (Kristian Woll) as a full-measure figure in flow between paragraph 3 and the first h2 (3:2, 48 px mask, object-position 50% 25%, lazy) with its figcaption; the captured Sand-70 info box as a Sand-30 factbox (h2 "KORT OM KORT:", 4 bullets, clear both). Headings 32 above / 16 below.
4. **related** (module `card-rail`, inside the body grid as `<aside>`) — h2 "Relaterte artikler" + 5 flat items (120 px 3:2 thumbnail with 48 px mask · title in the medium face; the whole item is the link); h2 "Relaterte tema" + 2 `#Bærekraft` pill badges (both captured hrefs kept — they differ). Sticky at `top: 24px` on ≥ 1024; stacks under the prose below (2-up thumbnails at 768, 1-up at 390).
5. **footer** (system role `footer`, canon) — built from `main > footer.footer`: Fjell columns Snarveier (5) · Logg inn (4) · Sosiale medier (Linkedin, YouTube with the captured white icons) · Natt legal row (5 small links + "SpareBank 1 Gruppen, Hammersborggata 11, 0179 Oslo"). No contact row (none captured on frontend-clientlib pages).

## Layout strategy

- Density balanced: `--section-padding` 64 / 48 / 32; container 1280.
- Article header `1fr 1fr` ≥ 1024 (photo ≥ 560 px, DESIGN § Signature), stacked below with the H1 first (a reader on a phone meets the headline before the photograph; the photo still lands in the first viewport at 390).
- Body `minmax(0,68ch) minmax(0,1fr)` with a 96 px gutter ≥ 1024; single column below; rail thumbnails 120 px.
- No `<hr>`, no card chrome; the only tinted element is the Sand-30 factbox.
- Mobile-first: authored at 390 first.

## Key states

- Share buttons: static `type="button"` (dynamics interim — captured buttons are JS share handlers with no href). Hover ring → Frost-30 fill.
- Rail item hover/focus-within: title underline; no shadow (flat items on white).

## Interaction model

- Burger: canon CSS checkbox + a11y script.
- Every href verbatim (both `#Bærekraft` tema hrefs kept).

## Data attributes

- `header[data-section="header"]…[data-canon]` (canon)
- `section[data-section="article-header"][data-intent="headline, meta, lead; the photo as content"][data-layout="split-media"][data-media="image"][data-module="article-header"]`
- `section[data-section="article-body"][data-intent="read the story"][data-layout="prose-aside"][data-module="article-body"][data-items="6"]` containing `aside[data-section="related"][data-intent="cross-link: related articles and themes"][data-layout="rail"][data-module="card-rail"][data-items="5"][data-media="image"]`
- `footer[data-section="footer"]…[data-canon]`
- `body[data-template="article"]`

## Unsourced content (placeholder list)

(none) — every literal is captured-verbatim; "Meny" is direction-authorized chrome.

## Unsourced / Excluded

- Hidden `glossary-modal` / `glossary-backdrop` nodes (empty, `display:none`) — UI state, not content.
- Header "Bli kunde" button: captured as a JS `<button>` with no href (`.bank-buttons button.ffe-button--action`), so `headerData()` yields `bliKunde: null` and the canon header renders without it. Not invented; flagged to the lead (see § Open questions).
- Captured `hr.footer-columns__divider` — decoration (direction: no dividers).

## Open questions for craft (resolved in render)

- The header "Bli kunde" (button without href on frontend-clientlib pages) — the lead may wire it in `data.mjs` with the canonical `/nb/bank/privat/kundeservice/bestill/bli-kunde.html` href once agreed; not done here (shared file).
- Canon lacks `.badge` (DESIGN.md § Badges) — solved locally with `data-deviation`; requested in `stardust/prototypes/canon-requests.md`.
- Inline editorial figure: first drafted with a native-ratio override; withdrawn after review — the canon 3:2 + 48 px mask applies, with `object-position:50% 25%` for the portrait crop.

## Review

`impeccable:impeccable-finish-reviewer`, one round (packet: request, constraints incl. offline Frost plates, artifact, 3 screenshots, this brief, direction.md, DESIGN.md, PRODUCT.md, improvements list, captured screenshot, detect.json, report.json, craft-floor). Round 1 disposition **fix-then-ship** (scores 4·4·4·4·3). Material fixes applied in one batch:

1. Hero photo under the 560 px floor (5fr ≈ 513 px) → `.art-head-grid` `minmax(0,1fr) minmax(0,1fr)` (≈ 617 px at 1440).
2. Inline portrait floated inside the 68ch measure and `aspect-ratio:auto` against the 3:2 rule → figure in flow at full measure, canon 3:2 + 48 px mask, `object-position:50% 25%` (portrait crop keeps the face). Canon request for a native-ratio figure withdrawn.
3. Byline Label/Koksgrå → Small 14 regular, Mørkgrå (DESIGN § Neutral: secondary text on Hvit); H1↔meta gap 8 px.
4. Rail thumb mask 24 px cited (`data-deviation` on `.rail-list`).
5. 641–1023 header stacked title → photo (max-width 600) → lead; full width ≤ 640.
6. Dismissed: "factbox padding 32 vs 24" — canon `--spacing-lg` is 24 px (reviewer withdrew).
7. Verified: captured hero `alt=""` (role=presentation) — kept verbatim.

Verdict pass: **ship** — brand-fit 5 · hierarchy 4 · calm-vs-generic 4 · mobile composition 4 · contract compliance 5; remaining: clear.

## Validation

- Harness: `nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html: PASS — 0 P0/P1, 0 P2/P3; externalFulfilled 9/9/9; heights 5522/4372/3402` (390 / 768 / 1440). 360 nav audit: over 0, minFont 14, hamburger; burger opens, aria-expanded syncs, Escape closes.
- Content check: `checked text 76, hrefs 59, imgs 13; missing text 0, hrefs 0, imgs 2` — the 2 "missing" images are `logo-sparebank1.svg` (header + in-main header copy): the canon chrome renders the logo inline as SVG, and the checker's exclusion regex knows only `logo.svg` (canon page). Checker not weakened; lead: extend the regex to `logo[a-z0-9-]*\.svg`. Everything else PASS.
- Detect: 3 hits, all `cramped-padding` on chrome (`.hdr-utility`, `.footer-main`, `.footer-legal`) — known static-CSS misreads of `padding-block: var(--section-padding)`, dismissed. Nothing on the page's own modules.
- Viewport heights: 1440 → 3402 px · 768 → 4372 px · 390 → 5522 px.
- `data-deviation` elements: `a.badge` ×2 (canon lacks `.badge`, DESIGN.md § Badges — local pill on Frost-30/Fjell) · `ul.rail-list` (24 px photo mask on 120 px thumbnails).
- Footer: built locally from `main > footer.footer` (`frontendFooter()` in the page module) → columns Snarveier 5 · Logg inn 4 · Sosiale medier 2 (Linkedin / YouTube, captured white icons) · 5 legal links · address; tabs `[]`.
- Dynamics interim: share buttons `type="button"` (captured JS share handlers, no href).
