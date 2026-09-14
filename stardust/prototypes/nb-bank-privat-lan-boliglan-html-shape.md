<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, archetype worker A — product family)
  writtenAt:        2026-09-14T22:40:00Z
  page:             nb-bank-privat-lan-boliglan-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat/lan/boliglan.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-privat-lan-boliglan-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-privat-lan-boliglan-html.json
    - stardust/current/pages/nb-bank-privat-lan-boliglan-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-privat-lan-boliglan-html.png (calculator hydrated state — see § Unsourced / excluded)
    - stardust/prototypes/ARCHETYPE-BRIEF.md, stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/dynamic-features.md (#2, #4, #5, #7, #10)
    - stardust/prototypes/nb-bank-privat-html-improvements.md
  conceptSeed:      surface roll key 2386009b (mode persuade) — dealt 6, 3, 7 of the ordered structure list; 6 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component (variant privat), canon chrome
    - bank-router — `.bank-choice--inline` complementary landmark (present on this page), canon chrome
    - backlink — `main > div.to-parent > a.to-parent__link` "Låne"
    - hero — `main > div.background-container:nth-of-type(1)` (columns-grid 4/7: h1 "Boliglån" + p.lead-blue + button-list [action "Søk boliglån" → boliglan-soknad/start, tertiary "Flytt boliglånet til oss"] · image bortskjemt-hund-familie-i-sofa 1200×800, fetchpriority=high)
    - choices — `main > div.background-container:nth-of-type(2)` (bg #FDF8F5 = Sand-30): h2 "Hva vil du gjøre?" + 4 `.card` (photo, title link, one line) + `<hr>` (dropped) + `div.banner-small` "Klar for budrunden?" (illustration svg, p, primary "Søk finansieringsbevis" href="#")
    - questions — `main > div.columns-grid` (photo kontormiljo-dame-pa-jobb-kontor aria-hidden · h2 "Har du spørsmål om boliglån?" · p · primary "Avtal tid med rådgiver")
    - prices — `main > div.prices` (bg #FDF8F5): h2 "Finn boliglånet som passer deg" · 10 `.price.card` (title link + one line) · secondary "Se alle priser og betingelser" · p "Priseksempel: …"
    - calculator — `main > div.text > h2` "Hvor mye kan jeg låne?" + `main > div.calculator-loan` (empty `#boliglan-kalkulator` mount + inline `sparebank1Config` script: text.priceExample, text.loanContact, text.loanApply, howMuchLoan.url.*, howMuchLoan.number.*) — dynamics #7 interim static shell
    - faq — `main > div.faq` h2 "Hva lurer andre på?" · 15 `.faq-item` (7 shown, 8 `.non-highlighted` behind `button.faq-button--more` "Se flere spørsmål og svar") · bodies incl. nested columns (Annuitetslån / Serielån illustrations), nested h3s, primary buttons (some duplicated hide-phone / hide-desktop)
    - related — `main > div.related-topics` h2 "Tips og råd" · 4 newsfeed `.card` (photo aria-hidden, span.card__tag "Tips og råd", title link)
    - feedback — `main > div.feedback` h2 "Hva synes du om denne siden?" + Ja / Nei thumbs
    - compare — `main > div.referance` h2 "Sammenlign priser" + p (Finansportalen.no)
    - footer — site-wide system-component (contact-section + columns + legal), canon chrome
  antiTemplatePass:
    - { pattern: "product hero (H1 + lead + 2 buttons + photo)", defaultReflex: "centered stack, two equal pill buttons, photo as background", alternatives: ["centered stack over photo", "7/5 split — photo left as content, text column right with one Skog action + one inline link", "type-only hero, photo demoted to the choices row"], picked: "7/5 split, photo left", rationale: "the family photo is the product's content (improvements #6: 715 px → content scale); the captured button pair already has a captured hierarchy (action vs tertiary) — one action rule kept; type-only would drop the LCP photograph", reference: "refero 3e14bbe4 MANNA, d8a01033 Fruitful; canon campaign split" }
    - { pattern: "four choice cards", defaultReflex: "same-size icon+heading+text cards with chevrons and shadows", alternatives: ["shadowed cards with chevrons", "four white papers with hairline on Sand-30, photo 3:2 48 px mask, whole card is the link", "a vertical question list with thumbnails"], picked: "white papers on Sand-30", rationale: "the choices are a routing question ('Hva vil du gjøre?') — four equal doors is the honest shape; card chrome and chevrons dropped (improvements #4); the captured Sand ground is kept as the movement's paper" }
    - { pattern: "promo banner (Klar for budrunden?)", defaultReflex: "full-width coloured banner", alternatives: ["own tinted band", "a promo row inside the choices movement (illustration + title-sm + line + one primary)", "merge into the hero as a third button"], picked: "promo row inside the choices movement", rationale: "the captured banner sits in the same Sand container after an <hr>; one movement, one paper, the divider becomes space; merging into the hero would break the one-action rule" }
    - { pattern: "price cards ×10", defaultReflex: "white cards + shadow + chevron in a 4-col grid", alternatives: ["shadowed card grid", "flat Sand-30 papers 5×2 on Hvit, title + one line, whole card is the link", "a typographic rate ledger (two-column list)"], picked: "flat Sand-30 papers 5×2", rationale: "10 named loan variants read as a catalogue shelf; one card language (improvements #4); the ledger would lose the scannable grid the 30 sibling pages depend on; tabular numerals on the price example (`.num`)" }
    - { pattern: "loan calculator (React widget)", defaultReflex: "invented placeholder card 'kalkulator kommer'", alternatives: ["omit the module", "static shell on Frost-30 (tool paper) with the captured tabs / labels / example values / result / CTAs, controls disabled", "link-out button only"], picked: "static shell on Frost-30, disabled controls", rationale: "dynamics #7 interim: the widget's visible text is carried verbatim; no invented note; Frost-30 is DESIGN.md's tool paper (the captured Vann band would be the page's third tint and a dark surface)" }
    - { pattern: "FAQ accordion + 'Se flere'", defaultReflex: "JS accordion, overflow items dropped", alternatives: ["drop the 8 hidden items", "`.faq` <details> ×15 with the 8 overflow items inside a `<details class=faq-more>` whose summary is the captured 'Se flere spørsmål og svar'", "render all 15 open"], picked: "details ×15 + faq-more disclosure", rationale: "verbatim contract (hidden bodies rendered, never dropped); CSS-only disclosure = dynamics #4 interim; all-open would be 3,000 words of prose on a persuade page" }
    - { pattern: "Tips og råd rail", defaultReflex: "cards with eyebrow 'TIPS OG RÅD' above the title", alternatives: ["eyebrow cards", "flat Sand-30 papers, photo 3:2 48 px mask, tag as meta line under the title", "text list"], picked: "flat papers, tag under title", rationale: "eyebrow ban (craft floor); canon news-card language; photos kept at native ratio (#6)" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: choices, paper: Sand-30, purpose: "captured ground #FDF8F5 of the 'Hva vil du gjøre?' + 'Klar for budrunden?' container — the page's warm routing moment" }
      - { section: calculator, paper: Frost-30, purpose: "tool paper (DESIGN.md § Secondary): the calculator is a tool inside a persuade page; captured Vann band re-tinted to keep the page at two tints and no dark surface" }
    note: "captured prices ground (#FDF8F5) NOT carried — third tint; prices sit on Hvit with Sand-30 cards, which keeps the warm register without a third tinted movement"
  voiceClassification:
    - { section: header, classification: captured-verbatim; "Meny" = direction-authorized chrome }
    - { section: bank-router, classification: captured-verbatim }
    - { section: backlink, classification: captured-verbatim }
    - { section: hero, classification: captured-verbatim }
    - { section: choices, classification: captured-verbatim }
    - { section: questions, classification: captured-verbatim }
    - { section: prices, classification: captured-verbatim }
    - { section: calculator, classification: captured-verbatim (config-script strings lifted by selector; remaining visible strings transcribed from the captured screenshot — see § Unsourced / excluded) }
    - { section: faq, classification: captured-verbatim }
    - { section: related, classification: captured-verbatim }
    - { section: feedback, classification: captured-verbatim ("Ja" / "Nei" from the captured svg <title>s, rendered visually-hidden) }
    - { section: compare, classification: captured-verbatim }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "bankchoice_bg.svg", mechanism: "canon router band", fallback: "band without art" }
    - { kind: site-wide-motif, capturedSource: "96px photo mask (image--all-rounded-small on every photo of this page)", mechanism: "one-corner-pair mask 96 px on the hero photo, 48 px on choice / question / tips photos", fallback: "square photo" }
    - { kind: site-wide-motif, capturedSource: "flat spot illustration illustrasjon-usymmetrisk-samboer-dame-mann-high-five", mechanism: "unmasked on Sand-30 beside the 'Klar for budrunden?' text, aria-hidden", fallback: "text + button stand alone" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-privat-lan-boliglan-html
url: https://www.sparebank1.no/nb/bank/privat/lan/boliglan.html
register: brand
mode: persuade
surprise: low
dominantDimension: composition/guided-catalogue
template: program
---

# Page shape: nb-bank-privat-lan-boliglan-html (product archetype — 30 sibling pages fork from it)

Structure list (ordered by resonance) for the surface roll `2386009b`: 1 reading-room spread · 2 offer-then-ledger · 3 task-choice first (four doors above the H1) · 4 rate-ledger led · 5 calculator-led tool page · **6 guided catalogue — photo-split hero → four doors → help → shelf of ten → tool → questions (dealt lead — built)** · 7 single-column brochure. Dealt alternates 3 and 7 recorded, not built (single canonical direction, hands-off).

## Sections (in render order)

1. **header** (canon) — privat variant, "Låne" marked current.
2. **bank-router** (canon) — captured on this page; compact Vann band, first viewport.
3. **backlink** — "‹ Låne" (`.backlink`, `icons.back`), 24 px above the hero grid. Verbatim href `/nb/bank/privat/lan.html`.
4. **hero** (module `product-hero`) — Hvit; 7/5 split ≥ 1024: photo left (`bortskjemt-hund-familie-i-sofa`, 3:2, `.photo` 96 px one-corner-pair mask, `loading="eager" fetchpriority="high"` — the LCP), text right: h1 "Boliglån" (headline 49 px), lead (captured `span.lead-blue` → `.lead`), CTA row: **"Søk boliglån"** → `.btn-action` (captured `ffe-button--action`, apply flow; the page's one Skog action; `data-cta="primary"`) + "Flytt boliglånet til oss" → `.btn-inline` (captured tertiary inline button). Below 1024 stacked photo-first (as canon).
5. **choices** (module `card-rail` ×4 + `promo-band`) — Sand-30 paper (captured #FDF8F5). h2 "Hva vil du gjøre?"; four white papers with hairline (`.card.plain`) 4 → 2 → 1: photo 3:2 48 px mask (alt verbatim) · title-sm link (whole card is the link) · one line. Then the promo row "Klar for budrunden?": captured spot illustration (unmasked, `aria-hidden`) · title-sm · line · **"Søk finansieringsbevis"** `.btn-primary` `href="#"` (dynamics #2 keeps `#`). `<hr>` dropped — 48 px of space and the hairline-topped promo row mark the change.
6. **questions** (module `split-media`) — Hvit; 5/7 split: photo left (`kontormiljo-dame-pa-jobb-kontor`, captured `aria-hidden` + empty alt → kept decorative, 48 px mask) · h2 "Har du spørsmål om boliglån?" + p + "Avtal tid med rådgiver" `.btn-primary` (captured primary; bank-choice dialog at rollout, href kept).
7. **prices** (module `price-cards` ×10) — Hvit; h2 "Finn boliglånet som passer deg"; ten Sand-30 `.card`s 5 → 2 → 1 (title-sm link + one line; whole card is the link; chevrons dropped); footer row: "Se alle priser og betingelser" `.btn-secondary` + the regulatory price example verbatim in Body with `.num` (tabular numerals) — never reflowed.
8. **calculator** (module `calculator`, dynamics #7 interim) — Frost-30 paper; h2 "Hvor mye kan jeg låne?" (captured `main > div.text`); static shell of the hydrated widget: segmented tabs "Hvor mye kan jeg låne?" / "Hvor mye koster lånet?" (disabled buttons, first `aria-pressed`), three pill radio groups (Antall låntakere 1·2 / Antall barn under 18 år 0·1·2·3·4·5+ / Antall biler 0·1·2 — disabled, captured selections 1 / 0 / 0), two disabled inputs "Samlet inntekt før skatt" = 400 000 kr and "Samlet lån og gjeld" = 200 000 kr (values from `howMuchLoan.number.grossAnnualIncome` / `existingLoan`), result "Vi tror du kan låne" **1 096 100 kr** (`.num`, title-medium), CTAs **"Søk lån"** `.btn-action` (captured `text.loanApply`, apply URL from config; the module's one action) + "Kontakt meg om lån" `.btn-secondary` (captured `text.loanContact`, URL from config), then the two captured paragraphs (the "Ved å søke…" explainer and the computed "Priseksempel: … 5,56 % …"). No invented note; all controls `disabled`; recorded here as interim.
9. **faq** (module `faq`, 15 items) — Hvit; h2 "Hva lurer andre på?"; `.faq` `<details>`/`<summary>` per question (`icons.down`), answers as `.answer.prose` with the captured body HTML cleaned: AEM wrappers unwrapped, inline styles stripped, nested `h2`/`h3` → `h4`, captured primary buttons → `.btn-primary` (hide-phone / hide-desktop duplicates kept with the captured responsive split so both hrefs survive), Annuitetslån / Serielån illustrations as `aria-hidden` `.illu-wide` in a two-column row, per-item "Var dette nyttig?" micro-feedback omitted (dynamic UI, see § Unsourced / excluded). Items 8–15 (`.non-highlighted`) live inside `<details class="faq-more">` whose `<summary class="btn-inline">` is the captured "Se flere spørsmål og svar" (dynamics #4 interim, CSS-only).
10. **related** (module `card-rail` ×4) — Hvit; h2 "Tips og råd"; four flat Sand-30 papers 4 → 2 → 1: photo 3:2 48 px mask (captured `aria-hidden`, empty alt) · title-sm link · meta line "Tips og råd" (captured `span.card__tag`, under the title — never an eyebrow).
11. **feedback** (module `feedback`, dynamics #5 static) — `.feedback` hairline-topped strip: h2 "Hva synes du om denne siden?" + two `type="button"` secondary pills with `icons.thumbUp` / `icons.thumbDown` and visually-hidden "Ja" / "Nei".
12. **compare** (module `cta-band`) — h2 "Sammenlign priser" + p with the Finansportalen.no external link (as canon).
13. **footer** (canon).

## Layout strategy

- Density balanced: `--section-padding` 64 / 48 / 32; container 1280; gutters 80 / 48 / 24 / 20.
- Grids: hero `7fr 5fr` (photo/text) ≥ 1024, stacked photo-first below; choices 4 → 2 → 1; questions `5fr 7fr` ≥ 1024, stacked below; prices 5 → 2 → 1; tips 4 → 2 → 1; calculator centred column max 44rem.
- Papers: Hvit → Sand-30 (choices) → Hvit (questions, prices) → Frost-30 (calculator) → Hvit (faq, tips, feedback, compare). Two tinted movements, never adjacent, never the same hue adjacent. No `<hr>` (four captured dividers dropped).
- One action per module: Skog appears twice on the page but once per module (hero "Søk boliglån", calculator "Søk lån" — both captured apply flows).
- Mobile-first: authored at 390; all targets ≥ 44 px; the price-example paragraph stays Body 16.

## Key states

- FAQ `<details>` open/closed; `faq-more` disclosure open/closed (summary label static — dynamics #4 pending).
- Calculator controls disabled (interim #7); result and price example are the captured hydrated values, not computed.
- Card hover / focus-within: Lift + title underline; reduced motion: transitions off.

## Interaction model

- Every href verbatim (icid / query strings kept). "Søk finansieringsbevis" and "Søk om avdragsfrihet" (desktop variant) keep `href="#"` — bank-choice dialog at rollout (dynamics #2).
- Native `<details>` only; no page script beyond the canon nav a11y script.

## Data attributes

- `section[data-section="hero"][data-intent="name the product, one action"][data-layout="split-media"][data-media="image"][data-module="product-hero"]`
- `section[data-section="choices"][data-intent="route by task"][data-layout="grid"][data-items="4"][data-module="card-rail"][data-media="image"]`
- `section[data-section="questions"][data-intent="offer adviser contact"][data-layout="split-media"][data-media="image"][data-module="split-media"]`
- `section[data-section="prices"][data-intent="choose a loan variant; regulatory price example"][data-layout="grid"][data-items="10"][data-module="price-cards"]`
- `section[data-section="calculator"][data-intent="estimate borrowing capacity (interim static shell)"][data-layout="contained"][data-module="calculator"][data-dynamics="7"]`
- `section[data-section="faq"][data-intent="answer common questions"][data-layout="contained"][data-items="15"][data-module="faq"]`
- `section[data-section="related"][data-intent="cross-link: advice"][data-layout="grid"][data-items="4"][data-module="card-rail"][data-media="image"]`
- `section[data-section="feedback"][data-intent="page feedback (static)"][data-layout="contained"][data-module="feedback"]`
- `section[data-section="compare"][data-intent="regulatory: compare prices"][data-layout="contained"][data-module="cta-band"]`
- `body[data-template="program"]`

## Unsourced / excluded (for the lead)

- **Calculator strings not liftable by selector.** The captured DOM's `#boliglan-kalkulator` mount is empty (`_dynamics.summary.hydrated: false`; no declarative shadow root; the lanekalkulator capture is identical). Lifted by selector from the inline config script: "Søk lån", "Kontakt meg om lån", both URLs, the example values 400 000 / 200 000, the 5,33 % / 25-year price example. **Transcribed from the captured screenshot** (`stardust/current/assets/screenshots/nb-bank-privat-lan-boliglan-html.png`, y 3350–4050 @1440): tab labels "Hvor mye kan jeg låne?" / "Hvor mye koster lånet?", field labels "Antall låntakere", "Antall barn under 18 år", "Antall biler", "Samlet inntekt før skatt", "Samlet lån og gjeld", radio values, result "Vi tror du kan låne" + "1 096 100 kr", the explainer paragraph "Ved å søke kan vi gi deg et tilbud med svar på nøyaktig hvor mye du kan låne, og hva det vil koste. Det er helt uforpliktende å søke lån hos oss." and the computed price example "Priseksempel: Nominell rente 5,33 %. Effektiv rente 5,56 %. Låner du 1 096 100 over 25 år koster lånet 906 457 og du betaler totalt 2 002 557 kroner." These are captured, not invented — but they are not in the content gate's source DOM; a re-capture with the widget settled (or the owner's widget copy) should replace the transcription at migrate. Marked `data-source="captured-screenshot"` on the calculator shell.
- **Per-FAQ-item "Var dette nyttig?" Ja / Nei** (15 × hidden micro-feedback) — dynamic UI state (dynamics #5), not content; the page-level feedback strip carries the captured pattern once.
- **"Klar for budrunden?" illustration alt** is the captured filename (`illustrasjon-usymmetrisk-samboer-dame-mann-high-five-lys-bakgrunn`) — an a11y defect in the source; rendered `alt="" aria-hidden` (spot illustration rule). Src verbatim.
- **Card chevrons (`svg.arrow-right` ×18)** and the four `<hr>` — decoration, dropped by direction.
- **Duplicated FAQ buttons** ("Søk om avdragsfrihet" `#` / lenker.sparebank1.no; "Søk om refinansiering av boliglån" relative / lenker.sparebank1.no) — both kept with the captured hide-phone / hide-desktop split so every href is present.

## Review

Round 1 (impeccable:impeccable-finish-reviewer, packet: request · constraints incl. offline Frost plates · artifact · 3 screenshots · this brief · direction.md · DESIGN.md · PRODUCT.md · improvements list · captured screenshot · detect.json · report.json · craft-floor): **fix-then-ship** — scores brand-fit 5 · hierarchy 4 · calm-vs-generic 4 · mobile 3 · craft floor 4. Material fixes, all applied in one batch:
1. Price-shelf titles overflowed ~243 px cards at 1440 → titles at `--lead` 20 px, `overflow-wrap:anywhere; hyphens:auto`, grid gap 24, card padding 16/24 (5×2 shelf kept).
2. H1 + action below the fold on phone/tablet (photo-first stack) → `.hero-text` now first in DOM; photo placed in grid column 1 on ≥ 1024 (7/5 unchanged); stacked photo capped 16:9. 390: H1 at y≈375, "Søk boliglån" at y≈605.
3. Three alignment axes → calculator, FAQ column (52 rem) and prices footer left-anchored at the gutter.
4. Choice-card thumbnail mask on ≤ 640 → 24 px one-corner pair.
5. No disabled state on calculator controls → `.calc[aria-disabled=true]`: Grå borders / Mørkgrå text on off pills & tabs, Lysgrå fill + Koksgrå on the selected pill/tab and inputs; the two live CTAs keep Skog / Vann.

Verdict pass (SendMessage): **ship** — brand-fit 5 · hierarchy 5 · calm-vs-generic 4 (ceiling: eight ≤ 300 px thumbnails in doors + tips rails) · mobile 5 · craft floor 5. Reviewer keep-list for the 30 forks: never photo-first below 1024; never 25 px titles on the 5-up shelf; Skog twice = once per module; paper rhythm Hvit → Sand → Hvit → Frost → Hvit; FAQ details + faq-more; tabular price examples.

## Validation

- Harness: `nb-bank-privat-lan-boliglan-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 8/8/8; heights 9921/7699/5997` (P2 = 6 sub-40 px targets: canon router/office-search labels, "Se alle banker" 38 px, two calculator field labels, Finansportalen inline link — same set as canon plus form labels). 360 nav: `{"over":0,"minFont":14,"minGap":0,"collapse":"hamburger"}`. Smoke: details open, burger open/aria/Esc, primary CTA keyboard-reachable at all three widths.
- Content gate: `content-check PASS — checked text 85, hrefs 204, imgs 14; missing 0/0/0`.
- Detect: 8 × `cramped-padding` (warning) — all static-CSS misreads of `padding-block: var(--section-padding|--spacing-xl)` on `.movement` ×5, `.hdr-utility`, `.feedback`, `.contact`, plus `.faq-more` (`border:0`) — dismissed; nothing else.
- Reviewer disposition: ship (see § Review).
- Viewport heights: 1440 → 9921 px (validator opens FAQ item 1; closed ≈ 6500) · 768 → 7699 · 390 → 5997.
- `data-deviation` elements: none. Local (non-canon) CSS: calculator shell (`.calc*`, `.pill`, `.input`), `.only-phone/.only-desktop` (captured hide-phone/hide-desktop split), `.illu-wide`, `.faq-more`, `.faq-cols`.
- Canon requests: #1 `footerData()` lazy-src fallback (solved locally via `patchData`).
- Excluded from the gate: see § Unsourced / excluded (calculator strings transcribed from the captured screenshot; per-item FAQ micro-feedback; filename alt on the promo illustration; chevrons; `<hr>`).
