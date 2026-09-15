# Round 01 re-craft — faq · news-article · news-listing · campaign-landing

Four archetype page modules re-composed in the round-01 language (Danske card/bento structure × Ramp type/buttons on the SpareBank 1
brand). Chrome untouched; content extraction and order untouched (the verbatim gate passes on all four); only wrapper classes, card
structure, `data-layout` values and each module's `css` string changed. Every repeated unit is a `<ul class="bento …" data-slot="cards">`
of `<li class="card card--tint …">` (`.card-image` first, then `.card-body`); hero / split cells are `div` / `figure` cards.

Screenshots: `shots/rc-<short>-1440.png` and `shots/rc-<short>-390.png` (taken with `shot.mjs`). Gates: `validate-prototype.mjs` (PASS, 0 P0/P1)
and `content-check.mjs` (PASS) on every archetype; siblings re-migrated with `migrate.mjs --force` and read at 1440.

---

## 1. faq — `nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html`

**Composition.** The question is now a hero card: one `.card.card--frost` (kundeservice = Frost paper) spanning 12 columns, 24 px under the
router band, carrying the "Kundeservice" arrow back-link and the H1 at `.h2-l`; the capture has no lead photo, so the text card spans the row.
The answer stays prose in the container at ≤ 68ch on white (lead size), the captured divider stays dropped, and the feedback strip becomes the
Sand-70 `.feedback-row` sheet with the question as a Title heading and two Frost secondary buttons (full-width pair on mobile). Section
`data-layout` moved to `bento-cells` / `prose` / `bento-cell`. Sibling answer steps (`.answer-step.paper-*`, the captured tinted step blocks)
stay as in-prose sheets — they are callouts inside the reading column, not section tints — with 36 px padding, 6 px between steps, and the
1 px border on answer screenshots removed (2 px corners only). No related-question rail exists in this capture, so none was rendered.

**Gates.**
```
nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 3/3/3; heights 3149/2315/2292
nb-bank-bedrift-kundeservice-bm-lan-finansiering-fast-flytende-rente-bedriftslan-html: content-check PASS — checked text 50, hrefs 179, imgs 3; missing text 0, hrefs 0, imgs 0
```
(P2: chrome elements < 40 px — logo, hidden field label, footer icon links.)

**Screenshots.** `shots/rc-faq-1440.png`, `shots/rc-faq-390.png`.

**Sibling spot-check.** `nb-bank-bedrift-kundeservice-bm-nettbank-bedrift-hvordan-sende-efaktura-html` → `stardust/migrated/nb/bank/bedrift/kundeservice/bm-nettbank-bedrift/hvordan-sende-efaktura.html`
(migrate: 1 migrated · 0 content-fail). Renders the same hero card + prose + Skog "Bestill eFaktura" CTA + Sand-70 feedback sheet; siblings render through this module's `render()` directly.

---

## 2. news-article — `nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html`

**Composition.** The article header is a hero bento: Sand-70 text card 5 cols (H1 at `.h2-l`, meta line, lead, share buttons as 48 px white
icon circles that invert to Vann on hover) beside the lead photo as a 7-col figure card whose image fills the cell (`object-fit: cover`) with the
caption on a Sand-70 strip under the photo inside the card; without a photo the text card spans 12; a story-layout hero video fills the same
photo cell. The body is prose in the container at ≤ 68ch — no more sticky side rail; body figures keep 2 px corners; the factbox / text-and-image
sheets are Sand-70, the pull-quote Frost-30, all 36 px padded, borderless. "Relaterte artikler" moves below the story as a centred `.h2-l.section-title`
over a `ul.bento.news-rail` of `.card.card--tint.news-card.is-link` (16:9 bleeding photo + title cover-link); spans come from `railSpans(n)`
(≤ 4 share a row, multiples of 4 run 4-up, otherwise rows of 3 with the remainder as `.news-card--wide` photo-left cards — this capture's 5 items
read as 4+4+4 over 6+6). "Relaterte tema" follows as `.h2-s` + `.badge` chips (base 6 px badge; the local pill override and its `data-deviation`
are gone). Tablet: photo cell first at 16:9, cards 2-up; mobile: everything stacks.

**Gates.**
```
nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 9/9/9; heights 5942/4729/4155
nb-bank-om-oss-nyheter-bankkort-laget-av-resirkulert-plast-html: content-check PASS — checked text 76, hrefs 59, imgs 11; missing text 0, hrefs 0, imgs 0
```
(P2: 28 px badges and chrome logos < 40 px at 390 — badges are 28 px by DESIGN.md § Badges.)

**Screenshots.** `shots/rc-article-1440.png`, `shots/rc-article-390.png`.

**Sibling spot-check.** Two siblings (both layouts): `nb-bank-om-oss-nyheter-bamses-historie-traktorulykken-html` (`.sb1-story__body` story layout, H1 inside
the first block) → `stardust/migrated/nb/bank/om-oss/nyheter/bamses-historie-traktorulykken.html`, and `nb-bank-privat-pensjon-hva-far-jeg-i-pensjon-html`
(`.sb1-article` with text-and-image sheet, CTA, 5 related + tags) → `stardust/migrated/nb/bank/privat/pensjon/hva-far-jeg-i-pensjon.html`. Both
1 migrated · 0 content-fail; hero bento, prose column, Sand-70 sheet and the 3 + 2-wide related bento all render as on the archetype.

---

## 3. news-listing — `nb-bank-om-oss-nyheter-html`

**Composition.** "Nyheter" stays the page H1 (`.h2-l`) above a featured hero bento: Sand-70 `.is-link` text card 5 cols (featured title at `.h2-m`
as the cover-link, meta) beside the featured photo as a 7-col figure card (eager / high, breathes when the text card is hovered). The 30 remaining
stories are one `ul.bento.news-grid.grid-3` of `.card.card--tint.news-card.is-link` (16:9 `.card-image`, `.h3` title cover-link, tag · date meta in
Koksgrå); the three photo-less items are plain text cards in the same grid. "Se flere artikler" becomes one centred `.btn.btn-secondary.btn-lg`
(6 px, no chevron). 3-up was chosen because 30 % 4 ≠ 0 (the module picks `grid-3` unless the count is a multiple of 4). Tablet 2-up, mobile stacked
with the featured photo first.

**Gates.**
```
nb-bank-om-oss-nyheter-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 10/16/22; heights 12164/7097/5409
nb-bank-om-oss-nyheter-html: content-check PASS — checked text 84, hrefs 84, imgs 28; missing text 0, hrefs 0, imgs 0
```
(P2: chrome logos < 40 px.)

**Screenshots.** `shots/rc-listing-1440.png`, `shots/rc-listing-390.png`.

**Sibling spot-check.** Family has no siblings (archetype only).

---

## 4. campaign-landing — `nb-bank-om-oss-hjemme-html`

**Composition.** Every row is a bento; the Sand and Frost section tints and the closing `border-top` are gone. Hero: Frost-30 statement card 5 cols
(H1 at `.h1` display) + the campaign video filling a 7-col card (`object-fit: cover`; one photographic cell per row, so no dark tile here).
Chapter 1: Fjell `.card--dark` title tile 5 + Sand-70 prose card 7. The three offers: `ul.bento.slide-list.grid-3` of Sand-70 cards with the
portrait photo bleeding on top at 1:1 (`.card-image--tall`, `data-deviation` noted — the 1280×2276 sources would lose the people at 16:9), `.h3`
title, text, one Vann primary button and the second captured button as an `.arrow` link (multi-action card → no cover link); `#kontakt` /
`#blikunde` ids stay on the cards. Chapter 2 mirrors chapter 1 (Sand-70 prose card 7 with the CTA, Frost-30 title tile 5). Film: `figure.bento`
with the video card 8 + Syrin-30 `figcaption` card 4 (play glyph + title). Closing: portrait photo card 5 + Fjell statement tile 7 at `.h2-l`.
No full-bleed row (0 of 6). Tablet stacks each row (media first); mobile stacks with full-width buttons.

**Gates.**
```
nb-bank-om-oss-hjemme-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 7/7/7; heights 5885/4931/4004
nb-bank-om-oss-hjemme-html: content-check PASS — checked text 56, hrefs 45, imgs 2; missing text 0, hrefs 0, imgs 0
```
(P2: chrome logos < 40 px.)

**Screenshots.** `shots/rc-campaign-1440.png`, `shots/rc-campaign-390.png`.

**Sibling spot-check.** Family has no siblings (archetype only).

---

## Requests for chrome (rules currently duplicated in module `css` strings)

1. **Hero text card defaults** — `.hero-movement{padding-top:24px}`, `.card-body{justify-content:center;padding:56px 48px}` (40/32 tablet, 36/20
   mobile) and a `.hero-photo`-style figure card (`img{width:100%;height:100%;object-fit:cover}`, Frost-30 ground, tablet `order:-1` + 16:9) are
   now written in boliglån, faq, article, listing and campaign. A shared `.hero-card` / `.photo-cell` pair in `cssBase()` would remove five copies.
2. **`.news-card` body padding** `32px 28px 40px` + `.meta{margin-top:12px}` — same in home, boliglån tips, article rail, listing.
3. **`.news-card--wide`** (photo-left variant: `flex-direction:row`, image 46 % at 16:9, body centred; column again ≤ 1024) — used for remainder
   rows in the related bento; candidate for the base card family.
4. **`.card-image--tall`** (1:1 frame, `object-position:50% 25%`) for portrait sources in card bentos.
5. **Meta separator** — `.meta span+time::before{content:"·"}` and `.card .meta{font-size:var(--body-sm)}` are repeated; the base `.card .meta` could
   own the dot.
6. **Video in a card** — `.card video{width:100%;height:100%;object-fit:cover;background:var(--frost-30)}` (hero and film cells).
7. **Feedback section rhythm** — base `.feedback{padding-block:var(--spacing-xl)}` was overridden to `var(--section-padding) 0` so the sheet sits on
   the 64 px rhythm before the contact band; consider making that the default.
8. **Share icon buttons** — `.share-btn` is a 48 px white circle (Vann glyph, inverts on hover); it could reuse `.icon-circle` with a `--white` fill.

## Notes

- `shot.mjs` occasionally aborts with "Execution context was destroyed" when several instances run in parallel; run it sequentially.
- The sibling spot-checks ran `migrate.mjs --force` as instructed; migrate also re-emits the two approved archetypes (Path A) and stamps
  `stardust/state.json` (`writtenAt`, `lastRunAt`, a "migrated" status entry on home and boliglån, `migrate.summary`). No other state was touched.
- Not run: `approve.mjs`, `extract-canon.mjs`. Nothing committed.
