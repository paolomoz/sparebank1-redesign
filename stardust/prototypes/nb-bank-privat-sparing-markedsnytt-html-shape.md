<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Worker C, hands-off)
  writtenAt:        2026-09-15T00:20:00Z
  page:             nb-bank-privat-sparing-markedsnytt-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat/sparing/markedsnytt.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-privat-sparing-markedsnytt-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-privat-sparing-markedsnytt-html.json
    - stardust/current/pages/nb-bank-privat-sparing-markedsnytt-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-privat-sparing-markedsnytt-html.png
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/ARCHETYPE-BRIEF.md, stardust/dynamic-features.md (#11 listings, #5 feedback, YouTube embeds)
    - stardust/prototypes/nb-bank-privat-html-improvements.md (#3, #4, #6, #7)
    - stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
  conceptSeed:      surface roll key 45675da5 (mode read) — dealt 7, 5, 6 of the ordered structure list; 7 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system component, privat variant (Spare current); injected by the builder
    - bank-router — `.bank-choice--inline` captured → canon compact router band, injected
    - backlink — `main > div.to-parent > a` "Spare" → /nb/bank/privat/sparing.html
    - hero — `main > div.columns-grid` #1: `.text-wrapper` (h1 "Markedsnytt" + `p.lead-blue` with `<br>`), `.image img` fondssparing-rentekutt-oppslagsbilde-mobildame (1280, fetchpriority high)
    - articles — `main > div.background-container` #1 (wrap #FFFFFF): `hr.aem-hr` (dropped), `.card__container--featured` ×3 (photo 1280, `p > span.h6` title, `a.primary-btn` "Les saken her"), `a.secondary-btn` "Les flere artikler fra Markedsnytt"
    - webinars — `main > div.background-container` #2 (wrap #D8E9F2 = Frost-30): h2 "Verdier og verdensbilder"; row 1 text (h3, p, ul ×3, p, primary "Meld deg på webinarserien her") + video iframe (title "Verdier og verdensbilder", `data-video-url` youtube -OO81onTJkA, src runtime-injected); row 2 text (h3 ×2, p ×3, shortcut "Se alle episodene på YouTube") + video iframe (title "Markedsutsikter med Anders Borg: …", src captured imoJK-Aw6wE); `hr.aem-hr` ×2 dropped
    - pensjon — `main > div.related-topics`: h2 "Les mer om pensjon:" + 3 newsfeed cards (img 768, `span.card__tag` "Nyheter", `a.card__title`, `span.card__date`; chevron.svg decoration dropped)
    - ekspert — `main > div.background-container` #3 (wrap #FDF8F5 = Sand-30): h2 "Ekspertkommentarer"; row: portrait (data-lazy-src Forvaltning_Alexander_Miller… 1280, aria-hidden) + `h4` caption (→ figcaption) | h3 + p + primary "Les kommentaren her"
    - rapporter — `main > div.background-container` #4 (wrap #FFFFFF): h2 "Rapporter fra SB1 Markets"; row 1 portrait (Forvaltning_Harald_Magnus_Andreassen, data-lazy-src) + h4 caption | h3 + p + primary (PDF); row 2 illustration dokument.svg (data-lazy-src) | h3 + p + primary (PDF) + secondary "Les flere rapporter og analyser i vår aksjehandelstjeneste"
    - wtf — `main > div.columns-grid` #2: h2 "What the fond?!"; row: text (h2 "Episode 1: Hvorfor sparer folk i fond?", p ×2, primary "Se alle episodene av serien her") + video iframe (title "What the fond?" – Episode 1", `data-video-url` hXR58z_GMrk, src runtime-injected)
    - feedback — `main > div.feedback` (h2 "Hva synes du om denne siden?", buttons Ja / Nei)
    - regulatory — `main > div.referance > .background-container` (wrap #FFFFFF): h2 "For deg som handler fond og verdipapirer" + 4 `p` blocks with `span.h5` run-in labels (Kort om avkastning · Siden inneholder markedsføring · Avtaler og retningslinjer · Bærekraftsmerking av fond) and 3 links
    - footer — site-wide system component with the 5-channel contact row; injected
  antiTemplatePass:
    - { pattern: "H1 hero (text left, rounded photo right)", defaultReflex: "centered stack", alternatives: ["photo left 7 / text right 5 (canon campaign)", "text left 5 / photo right 7 (captured order kept, photo at content scale)", "text-only H1 band"], picked: "text left 5 / photo right 7", rationale: "captured reading order kept (back-link → H1 → lead → photo); DESIGN split with the photo ≥ 560 px and the 96 px mask; the backlink sits above the H1 as DESIGN skeleton prescribes" }
    - { pattern: "3 featured article cards, each with a primary 'Les saken her' pill", defaultReflex: "3 shadowed cards with 3 blue buttons", alternatives: ["captured: 3 primary pills", "flat items on white (canon news-rail shape): photo 3:2 · title · the captured label as the card's single inline link (whole card clickable)", "text list"], picked: "flat items on white, label as inline link-more", rationale: "DESIGN § Cards — exactly one action per card, the whole card is the link; three identical primary pills in one row are three competing actions (improvements #4); label + href verbatim" }
    - { pattern: "webinar rows (text + YouTube iframe) on Frost", defaultReflex: "video hero", alternatives: ["autoplaying video hero", "6/6 rows: text 68ch left, 16:9 frame right; every embed as a static Hvit frame (play glyph + captured iframe title) linking the captured video URL", "text only with links"], picked: "6/6 rows with linked static frames", rationale: "ARCHETYPE-BRIEF rule 5 allows a link when the src is runtime-injected (2 of 3 here); the third has a captured src but the offline harness blocks youtube.com, so all three render the same linked frame (data-deviation; canon request 6) — Hvit frames keep Fjell as the footer's only dark surface" }
    - { pattern: "newsfeed rail 'Les mer om pensjon:'", defaultReflex: "white cards + shadow + chevron", alternatives: ["shadowed cards", "canon flat news cards (photo 3:2 48 px mask, title, meta tag · date)", "text list"], picked: "canon flat news cards", rationale: "one card language — identical to the canon 'Nytt og nyttig' rail" }
    - { pattern: "expert rows (circle portrait + caption | h3 + p + primary)", defaultReflex: "testimonial card", alternatives: ["testimonial card", "split row: 200 px circle portrait with the captured h4 as a figcaption, text 68ch + one primary right", "list"], picked: "split row with figcaption", rationale: "DESIGN portraits are circles; the captured h4 under an h2 skips a level and is a caption in role — rendered as figcaption (text verbatim), so the h3 keeps the outline honest" }
    - { pattern: "regulatory notes (p with run-in bold labels)", defaultReflex: "small grey legal footer", alternatives: ["grey legal block", "two-column prose on Hvit with the run-in labels in the medium cut, Body size", "accordion"], picked: "two-column prose", rationale: "rate/regulatory copy must stay server-rendered verbatim at body size (direction § Brand metadata keyFacts); columns as captured" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: webinars, paper: Frost-30, purpose: "captured background-container #D8E9F2; the page's learning movement" }
      - { section: ekspert, paper: Sand-30, purpose: "captured background-container #FDF8F5; warm paper for the expert voice; separated from Frost by the Hvit pensjon rail (never two tints adjacent)" }
    note: "captured also tinted 'What the fond?!' Frost — rendered Hvit to respect the two-tint cap; the paper sequence is Hvit → Frost → Hvit → Sand → Hvit → Hvit → Hvit"
  voiceClassification:
    - { section: header, classification: captured-verbatim }
    - { section: bank-router, classification: captured-verbatim }
    - { section: backlink, classification: captured-verbatim }
    - { section: hero, classification: captured-verbatim }
    - { section: articles, classification: captured-verbatim }
    - { section: webinars, classification: captured-verbatim, source: text-wrapper innerHTML; iframe titles and data-video-url }
    - { section: pensjon, classification: captured-verbatim }
    - { section: ekspert, classification: captured-verbatim (h4 → figcaption, text unchanged) }
    - { section: rapporter, classification: captured-verbatim (h4 → figcaption) }
    - { section: wtf, classification: captured-verbatim }
    - { section: feedback, classification: captured-verbatim }
    - { section: regulatory, classification: captured-verbatim (span.h5 run-in labels → strong) }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "bankchoice_bg.svg in the router band", mechanism: "canon router (injected)", fallback: "band without art" }
    - { kind: site-wide-motif, capturedSource: "96px photo mask (785 occurrences)", mechanism: "96px one-corner-pair mask on the hero photo, 48px on article and news cards; circles on portraits", fallback: "square photo" }
    - { kind: site-wide-motif, capturedSource: "flat spot illustration dokument.svg", mechanism: "160px illustration on Hvit, aria-hidden", fallback: "text stands alone" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-privat-sparing-markedsnytt-html
url: https://www.sparebank1.no/nb/bank/privat/sparing/markedsnytt.html
register: brand
mode: read
surprise: low
dominantDimension: composition/magazine-movements
---

# Page shape: nb-bank-privat-sparing-markedsnytt-html (markedsnytt-listing archetype)

Structure list (ordered by resonance) for the surface roll (key 45675da5, read): 1 single-column reading page · 2 featured story + article grid only (webinars/experts demoted to links — drops captured media, rejected) · 3 three-up card catalogue · 4 tabbed sections (Artikler · Webinar · Eksperter · Rapporter — tab labels not captured, rejected) · 5 sticky in-page index rail + movements · 6 two-column ledger (headings left, content right) · **7 magazine movements (dealt lead — built)**: H1 split → article papers → Frost webinar rows → pensjon rail → Sand expert row → report rows → What the fond?! → feedback → regulatory columns. Dealt alternates 5 and 6 are recorded, not built.

**Tema filters (dynamics #11):** the captured DOM carries no filter controls or tema labels (the only tags are the three `card__tag` "Nyheter" meta lines) — nothing to render statically; the index-backed listing lands at rollout. Recorded, not invented.

## Sections (in render order)

1. **header** (canon, privat variant, Spare current) → 2. **bank-router** (canon, injected — the page carried `.bank-choice`).
3. **backlink + hero** (module `campaign`) — Hvit; `.backlink` "Spare" (icons.back) 24 px above the H1; split `5fr 7fr`: H1 "Markedsnytt" + lead ("Forstå mer om markedet, og hvordan du kan investere pengene dine enda bedre." — captured `<br>` kept) left, photo right (3:2, 96 px mask, eager + fetchpriority high — LCP). Stacked ≤ 1023 with the H1 first.
4. **articles** (module `card-rail`) — Hvit; 3 flat items (canon news-rail shape) 3-up → 2-up → 1-up: photo 3:2 (48 px mask) · title (captured `p.h6` → h2 title-sm) · "Les saken her" as the card's inline link (link-more arrow, 44 px target; the whole item is the link); below: "Les flere artikler fra Markedsnytt" secondary pill.
5. **webinars** (module `content-columns` ×2) — Frost-30; h2 "Verdier og verdensbilder"; two `6/6` rows: text (h3 title, p, ul, p, one pill: primary "Meld deg på webinarserien her" / inline "Se alle episodene på YouTube" with external icon) + 16:9 video frame: a static Hvit frame (16 px radius; hairline only on Hvit movements) with a Vann play glyph and the captured iframe title, linking the captured `data-video-url` (all three embeds — see antiTemplatePass).
6. **pensjon** (module `card-rail`) — Hvit; h2 "Les mer om pensjon:" + 3 canon news cards.
7. **ekspert** (module `content-columns`) — Sand-30; h2 "Ekspertkommentarer"; row: 200 px circle portrait + figcaption (captured h4 text: name · role · owner note) left, h3 "I Heard It Through the Bond Market?" + p + primary "Les kommentaren her" right.
8. **rapporter** (module `content-columns`) — Hvit; h2 "Rapporter fra SB1 Markets"; row 1 portrait + figcaption | h3 + p + primary "Les siste rapport her (PDF)"; row 2 illustration dokument.svg | h3 + p + primary "Les rapporten her (PDF)" + secondary "Les flere rapporter og analyser i vår aksjehandelstjeneste".
9. **wtf** (module `content-columns`) — Hvit (captured Frost dropped — two-tint cap); h2 "What the fond?!"; row: text (h2 "Episode 1: Hvorfor sparer folk i fond?" kept at its captured level, p ×2) + primary "Se alle episodene av serien her" | linked video frame.
10. **feedback** (canon `.feedback`) — h2 + Ja / Nei secondary pills with thumbs, `type="button"`.
11. **regulatory** (module `content-columns`) — Hvit with hairline top; h2 (title-sm) "For deg som handler fond og verdipapirer"; 4 notes in two 60ch columns, run-in labels (captured `span.h5`) as block `strong` in Fjell, links Vann.
12. **footer** (canon, with the contact row).

## Layout strategy

- Density balanced: 64 / 48 / 32; container 1280; prose 68ch.
- Splits `5fr 7fr` (hero, top-aligned so the backlink → H1 → lead stack meets the photo top) and `1fr 1fr` (webinar / wtf rows), `260px 1fr` (portrait rows) ≥ 1024; 3-up rails hold at 641–1023 (gap 16); stacked below 640.
- Papers: Hvit → Frost → Hvit → Sand → Hvit ×3; no `<hr>` (4 captured `aem-hr` dropped); the "What the fond?!" and regulatory movements get one hairline top each (DESIGN: hairline where a tint change cannot do the job — the two-tint cap is spent on webinars and ekspert).

## Key states

- Video: linked static frames (hover Frost-30 / Sand-30 on Frost) — dynamics #16 interim; the lazy `<iframe>` returns at rollout when the harness allows youtube.com.
- Feedback static. Cards: whole paper is the link; hover → title underline + Lift.

## Data attributes

- `section[data-section="hero"][data-intent="what markedsnytt is"][data-layout="split-media"][data-media="image"][data-module="campaign"]`
- `section[data-section="articles"][data-intent="read the latest articles"][data-layout="grid"][data-module="card-rail"][data-items="3"][data-media="image"]`
- `section[data-section="webinars"][data-intent="watch the webinar series"][data-layout="split-media"][data-module="content-columns"][data-items="2"][data-media="video"]`
- `section[data-section="pensjon"][data-intent="cross-link: pension articles"][data-layout="grid"][data-module="card-rail"][data-items="3"][data-media="image"]`
- `section[data-section="ekspert"][data-intent="read the expert comment"][data-layout="split-media"][data-module="content-columns"][data-media="image"]`
- `section[data-section="rapporter"][data-intent="download the reports"][data-layout="split-media"][data-module="content-columns"][data-items="2"][data-media="image"]`
- `section[data-section="wtf"][data-intent="watch the fund series"][data-layout="split-media"][data-module="content-columns"][data-media="video"]`
- `section[data-section="feedback"]…[data-module="feedback"]`
- `section[data-section="regulatory"][data-intent="regulatory: returns, marketing, agreements, ESG"][data-layout="grid"][data-module="content-columns"][data-items="4"]`
- `body[data-template="listing"]`

## Unsourced content (placeholder list)

(none).

## Unsourced / Excluded

- `hr.aem-hr` ×4 and the `chevron.svg` card arrows — decoration.
- Video placeholder `<img src=".../nettsider/logo.svg" alt="Video placeholder image">` ×3 — editor-mode placeholder inside the video component, not content.
- `<picture>` sources for ≤ 768 and `data-lazy-smallsrc` variants — one src per image (the 1280 `data-lazy-src`/`src`).
- No tema filter controls captured (see above).

## Open questions for craft (resolved in render)

- "Episode 1: Hvorfor sparer folk i fond?" is a captured h2 under the movement h2 "What the fond?!" — kept h2 (verbatim level; two h2 in one movement is valid HTML outline, no skip).
- Captured h4 captions under h2 (portrait names) → `figcaption` to avoid h2→h4 skips; text verbatim.
- Articles: captured primary pills → inline link-more inside the card (one action per card; label/href verbatim). Recorded as a deliberate mapping departure from ARCHETYPE-BRIEF rule 4's default (primary → `.btn-primary`) in favour of DESIGN § Cards.

## Review

`impeccable:impeccable-finish-reviewer`, one round (same packet shape as the canon). Round 1 disposition **fix-then-ship** (scores 4·3·4·3·3). Twelve fixes applied in one batch:

1 + 6. Root cause: the RTE lifter's `<b[^>]*>` → `<strong>` regex also matched `<br>` — the hero lead gained an unclosed `<strong>` and the expert figcaption lost its line structure. Regex fixed (`<b(\s[^>]*)?>`, same inside headings); trailing `<br>` before a closing tag keeps a space; `.subtle-text` → `<small>`.
2. `.col-text h2` one step down (title 31 px) under the movement h2.
3. Hero grid top-aligned — backlink 24 px above the H1, H1 level with the photo top.
4. rapporter → wtf boundary: hairline top on `.wtf` (the two-tint cap is spent).
5. Report row 2: captured secondary → `.btn-inline` (one pill per module; label/href verbatim).
7. 641–1023: article and news rails 3-up (no orphan third card).
8. `.art-card{align-content:start}`. 9. ≤ 640 `.articles` padding-top 24. 10. `.col-text .btn-inline{padding-inline:0}`. 11. Frost-movement video hover → Hvit. 12. `.col-text h3+h3` −8 px.

Regression from fix 7 (768 news card overflow — `.card`'s implicit auto column let a long word widen the item over its neighbour) closed with `.news-card,.art-card{grid-template-columns:minmax(0,1fr);min-width:0;align-content:start}`, `.card-title{overflow-wrap:anywhere}`, and rail titles at 20 px on 641–1023.

Verdict pass: **ship** — brand-fit 4 · hierarchy 4 · calm-vs-generic 4 · mobile composition 4 · contract compliance 4; remaining: clear (polish note: `hyphens:auto` + `lang="nb"` could replace `overflow-wrap:anywhere` later; the 20 px tablet titles already avoid the break).

## Validation

- Harness: `nb-bank-privat-sparing-markedsnytt-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 6/11/11; heights 10235/8252/6704` (390 / 768 / 1440). The single P2 (390) lists chrome elements only — `label.router-label` (visually hidden, 1 px), `summary.btn-inline` "Se alle banker" 38 px, the footer office-search label — canon, out of this page's scope. 360 nav audit: over 0, minFont 14, hamburger; burger opens, aria-expanded syncs, Escape closes; primary CTA reachable by keyboard.
- Content check: `content-check PASS — checked text 91, hrefs 198, imgs 13; missing text 0, hrefs 0, imgs 0` (the lazy footer social icons pass through `patchData()`).
- Detect: 12 hits — 9 × `cramped-padding` on chrome / `.movement` / `.feedback` / `.contact` (static-CSS misreads of `padding-block: var(--section-padding)`) and 3 × `tight-leading` 1.25 on `.title-sm` card titles (canon leading) — all dismissed.
- Viewport heights: 1440 → 6704 px · 768 → 8252 px · 390 → 10235 px (13 captured modules; the captured page measured 7442 px at 1440 with 302 px thumbnails — the redesign spends the height on photos at content scale and 68ch prose).
- `data-deviation` elements: `a.video-frame.video-link` ×3 (YouTube embeds rendered as linked static frames — offline harness blocks youtube.com; two of the three have a runtime-injected src; dynamics #16 interim). Play glyph authored locally (canon lacks `icons.play`) — canon request 6.
- Heading levels: captured `h4` portrait captions → `figcaption` (text verbatim); captured `h2` "Episode 1 …" kept.
- Dynamics interim: #16 video (above); #5 feedback thumbs static; #11 tema filters — none captured, nothing rendered.
- Mapping departures recorded: "Les saken her" ×3 captured primary pills → inline `link-more` inside the card (one action per card, whole card is the link); "Se alle episodene på YouTube" captured shortcut → `.btn-inline` with external icon.
