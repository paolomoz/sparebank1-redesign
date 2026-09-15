# Round 01 re-craft — theme · om-oss · markedsnytt-listing (2026-09-15)

Three archetypes re-composed in the round-01 card language (Danske card/bento structure × Ramp type/buttons on the SpareBank 1 brand). Content extraction and order untouched — only wrappers, card structure, `data-layout` values and each module's `css` string changed. No `paper-*` movement tints remain on any of the three pages; no `<hr>`, no borders, no shadows; no full-bleed rows (0 % of sections). Every repeated unit is a `<ul class="bento …">` of `<li class="card card--tint …">` (`.card-image` first, then `.card-body`); hero / split cells are `div`/`figure` cards.

## 1. Theme — `nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html`

**Composition.** The text-only hero (back link · H1 at `.h2-l` · lead) is one Frost card spanning 12, left-aligned. The two comparison sheets ("Med / Uten felles bygningsforsikring") are a `ul.bento.sheets` of two `li.card.card--tint` (6 + 6) — illustration on the fill, `.h2-m` heading (captured `<u>` kept), prose, then a `.link-list` of `.arrow` links with the captured descriptions beneath (multi-link → no cover); the "Hva er forskjellen…" link became a `.arrow` under the bento. The tip callout and the claim row are now *band cards* spanning 12 (`.band-card`: Sol bulb / captured icon · text · one action, `.is-link` with `.cover-link` on the button) — Sand-70 for the tip, Frost-30 for the claim. "Hva med meg som beboer?" is text card 7 + Syrin illustration tile 5 (two secondary buttons → no cover; the illustration springs on card hover). "Skadeforebygging…" is text card 5 + bleeding photo card 7 (`.is-link`, cover on the button, photo breathes on hover). "Anbefalt for boligselskap" is a 3-up `ul.bento` of `.news-card` (`.card-image` 16:9 + `.card-body`, cover on the title); `.section-title` → `.h2-l.section-title`. `data-layout`: hero `bento-cell`, compare `grid`, tip `bento-cell`, resident `bento-cells`, claim `bento-cell`, prevention `bento-cells`, recommended `grid`.

**360 px overflow fixed.** Cause: the `white-space:nowrap` action button "Få tilbud på boligbyggforsikring" (287 px) inside the old callout padding. The band card stacks at ≤ 767 and its button gets `width:100%; white-space:normal`; `.cta-row .btn,.actions .btn` wrap and go full-width at mobile. `360 nav: {"over":0,…}` now.

**Gates.**
```
nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 8/10/10; heights 7577/5149/4562
nb-bank-bedrift-bedriftsforsikring-bransjer-borettslag-sameie-html: content-check PASS — checked text 69, hrefs 185, imgs 10; missing text 0, hrefs 0, imgs 0
```
(P2: six sub-40 px interactives — logo, one `.arrow`, footer icons — all chrome or the standalone compare arrow.)

**Screenshots.** `stardust/prototypes/round-01-danske-ramp/shots/rc-theme-1440.png` (+ `-p1..p4`), `rc-theme-390.png` (+ `-p1..p5`); baseline before: `rc-theme-before-1440.png`.

**Sibling spot-check.** `node stardust/scripts/migrate/migrate.mjs nb-bank-bedrift-bedriftsforsikring-html --force` → migrated (A′, 0 content-fail). `shots/rc-theme-sib-bedriftsforsikring-1440.png` (+ `-p1..p5`): renders through the shared `renderSibling` walker (boliglån module, not edited) — tinted 2 px cards, bleeding images, Ramp scale. Observation for the shared walker's owner: the bransje card rail still sits on a `paper-sand` movement, so Sand-70 cards on Sand-70 read as borderless photos+titles (see p2); the shared walker also still emits `.faq` hairlines (canon) and centred `.section-title` on the FAQ.

## 2. Om oss — `nb-bank-om-oss-presse-html`

**Composition (archetype, `renderPresse`).** Hero: photo card 7 (bleeding, `object-fit:cover`) + Frost text card 5 (H1 at `.h2-l`, lead) in one bento. "Pressekontakter for nasjonale medier": heading/lead/small stay as prose in the container (≤ 68ch), then the two captured adviser lists become two `ul.bento.advisers` — three cards at span 4, then two at span 6 — each `li.card.card--tint.adviser.is-link` laid out horizontally: 112 px round portrait, name `.h3`, role, phone, "e-post" as the `.cover-link` (single action). "Pressekontakter for lokale medier": Syrin illustration tile 3 + Sand teaser card 9 (`.is-link`, cover on "Velg bank", illustration springs). "Presserom": Sand text card 5 (two CTAs → no cover) + photo card 7. `data-layout`: hero `bento-cells`, nasjonale `grid`, lokale `bento-cells`, presserom `bento-cells`. Both `paper-frost` / `paper-sand` movements removed.

**Family walker (`renderGeneric`, same module — the om-oss siblings render through it).** `cardHtml` → `li.card.card--tint(.is-link)` with `.card-image` (photos) or `.illu` in the body, `.h3` title with `.cover-link`, CTAs as `.ctas.actions` (kept above the cover). `.cards` → `ul.bento.cards[data-items]` with spans by count (2 → 6, 3 → 4, 4/8 → 3; single card in a column → full column width). Campaign → `bento.hero-bento` (photo 7 + Frost card 5; text-only → card spanning 12). `.adviser-list` → adviser cards as above. Tinted `background-container` → one `.card.<fill>.panel-card` spanning 12 (only when it does not itself contain cards — no nesting; otherwise a plain `.panel`); movement-level tinting removed entirely. Data tables → `.table-wrap.card.card--tint` (padding, `overflow-x:auto`, hairline rows `rgba(0,39,118,.12)`). `data-layout`: campaign `bento-cells`, card panels `bento-cell`, cards/advisers `grid`.

**Gates.**
```
nb-bank-om-oss-presse-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 10/10/10; heights 3847/3210/2885
nb-bank-om-oss-presse-html: content-check PASS — checked text 39, hrefs 36, imgs 10; missing text 0, hrefs 0, imgs 0
```
(P2: the five "e-post" cover links are 23 px tall as text; the whole card is the hit area.)

**Screenshots.** `shots/rc-omoss-1440.png` (+ `-p1..p2`), `rc-omoss-390.png` (+ `-p1..p3`); before: `rc-omoss-before-1440.png`.

**Sibling spot-check.** `migrate.mjs nb-bank-om-oss-samfunnsansvar-html --force` and `nb-bank-om-oss-selskaper-html --force` → both migrated, 0 content-fail. `shots/rc-omoss-sib-samfunnsansvar-1440.png` (+ `-p1..p2`): hero bento (photo 7 + Frost 5), 3 icon cards 4+4+4 with cover links, text/illustration columns, feedback. `shots/rc-omoss-sib-selskaper-1440.png` (+ `-p1..p2`): back link, illustration + title columns, six company cards as full-width tinted cards inside the three columns (first pass had them at half width — a specificity slip, fixed).

## 3. Markedsnytt listing — `nb-bank-privat-sparing-markedsnytt-html`

**Composition.** Hero: Frost text card 5 (back link · H1 `.h2-l` · lead) + bleeding photo card 7; the three featured articles follow 6 px below as a `ul.bento.art-grid` of `.news-card` (16:9 `.card-image`, `h2.h3` title, "Les saken her" as `.link-more.cover-link`) so hero and rail read as one bento; the "Les flere artikler" button sits under the rail. Each webinar / "What the fond?!" row is a bento: Sand text card 5 + Frost video card 7 (`.video-frame` fills the card, play glyph + captured title, linked to the captured URL — offline interim unchanged). "Les mer om pensjon" is a 3-up `ul.bento.news-grid` of `.news-card` with `.meta.small`. Expert comment and the two report rows are Syrin portrait/illustration tile 3 (round portrait + caption) + Sand text card 9. The regulatory block keeps its `.h2-s` heading left and puts the two captured text columns in `ul.bento.reg-grid` of two `.reg-card` (6 + 6). `.section-title` → `.h2-l.section-title`; `paper-frost` / `paper-sand` and the two `border-top` dividers removed. `data-layout`: hero/webinars/ekspert/rapporter/wtf `bento-cells`; articles/pensjon/regulatory `grid`.

**Gates.**
```
nb-bank-privat-sparing-markedsnytt-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 10/11/11; heights 10052/7888/6304
nb-bank-privat-sparing-markedsnytt-html: content-check PASS — checked text 91, hrefs 197, imgs 13; missing text 0, hrefs 0, imgs 0
```
(P2: three "Les saken her" cover links at 21 px text height; whole card is the hit area.)

**Screenshots.** `shots/rc-mnytt-1440.png` (+ `-p1..p5`), `rc-mnytt-390.png` (+ `-p1..p7`); before: `rc-mnytt-before-1440.png`. Note: at 390 the lazy portraits sometimes appear as Frost placeholders in the full-page shot — probed with Playwright, all three load (`naturalWidth` 1160 / 500 / 259); it is `shot.mjs` timing, not layout.

**Siblings.** None (single-page family).

## Requests for chrome (`cssBase()`)

1. **`.arrow` and `.cover-link` cannot share an element** — both draw `::after`; the combined pseudo becomes a stray chevron in the card corner. Either give `.cover-link` a `::before` cover, or document "cover on a plain link, arrows only in `.link-list`". Worked around locally (plain `.cover-link` for "e-post", `.link-more.cover-link` for "Les saken her").
2. **Mobile button wrapping**: `.btn{white-space:nowrap}` overflows 360 px for long captured labels (the theme's 287 px action). Suggest a chrome rule `@media (max-width:640px){.actions .btn,.cta-row .btn,.ctas .btn{width:100%;white-space:normal;text-align:center}}` — currently repeated in all three module css strings.
3. **Bento stacking specificity**: chrome's `@media (max-width:767px){.bento>.card{grid-column:1/-1}}` is beaten by any module rule like `.rec-grid .news-card{grid-column:span 4}` written for tablet. Suggest `.bento>.card,.bento>li.card{grid-column:1/-1!important}` (or a higher-specificity selector) in the 767 block so modules do not have to re-stack.
4. **Band card pattern** (`.band-card`: icon · text · action in one row, spanning 12) is used twice on the theme page and would fit callouts/claim rows elsewhere; worth a chrome class if it recurs.
5. **Adviser card** (round portrait + name/role/phone/mail, horizontal) is defined identically in the presse archetype and the om-oss walker; a chrome `.adviser` block would de-duplicate it and give people-lists in other families the same look.
6. **`li.card` legacy padding** `li.card:not(.channel):not(:has(>.card-body)){padding:var(--spacing-lg)}` is fine, but `.card .card-title a::after{inset:0}` still covers every `.card-title a` even without `.cover-link`; harmless here (all card titles are covers) but worth noting.
7. **Feedback strip** (`.feedback-row`, Sand-70) sits directly above the Sand-70 contact band on every page — two same-tint sheets with 64 px white between; consider Frost-30 or `.card--white` for the strip.
