# Round 01 re-craft — category-hub, kundeservice-hub, tool, utility

Date 2026-09-15. Scope: the page modules of four archetypes re-composed in the round-01 card language (Danske structure × Ramp type/buttons on the SB1 brand) so they read as the same system as the home and boliglån exemplars. Content extraction and order untouched (verbatim gate PASS on all four); chrome untouched.

Files changed
- `stardust/scripts/proto/pages/nb-bank-privat-lan-html.mjs` — the shared component library (generic `H` handlers + `HUB_CSS`, now the round-01 card CSS every family below imports) and the category-hub archetype.
- `stardust/scripts/proto/pages/nb-bank-privat-kundeservice-html.mjs`, `…-verktoy-sperre-kort-html.mjs`, `…-kundeservice-kontakt-html.mjs` — family overrides re-written; each now emits `HUB_CSS + <own CSS> (+ SIBLING_CSS for siblings)`.
- Not touched: `chrome.mjs`, home and boliglån modules, `DESIGN.*`, `state.json` (sibling checks ran with `--no-state`), `canon/**`.

Shared rules applied everywhere (library level)
- No `paper-*` section tints (`assignTints` max defaults to 0); the fill belongs to the cards.
- Every repeated unit is `<ul class="bento … grid-N" data-slot="cards">` with one `<li class="card card--tint …">` per unit (`.card-image` first, then `.card-body`), per the coordinator's encoder rule. `gridCls(n)`: 1 → 12, 2 → 6+6, 3/6/9 → 3-up, else 4-up; tablet halves via cssBase, mobile stacks.
- Single-action cards → `.is-link` + `cover-link` on the title or the one button (`coverCta`); multi-link cards → `.link-list` of `.arrow` links.
- Heroes → `.bento.hero-bento`: text card (`.hero-card`, Frost by default) 5 cols + media card 7 cols (`mediaCard`: a photo fills the figure card with `object-fit:cover`, absolutely positioned so the grid alone sizes it; an SVG/illustration sits centred on a Sand tile). Text-only hero → one card across 12, H1 left. Mobile: media above text, full-width large buttons.
- Splits → media card 5 + text card 7; promos → one li per promo with the spot illustration on the tint beside the teaser; FAQ → `.h2-l.section-title` centred, questions in the container ≤ 52rem; steps → one Frost card; compare → Frost card, half width; section titles → `.h2-l.section-title`.

## 1. `nb-bank-privat-lan-html` (category-hub)

Composition: the text-only hero is one Frost card across 12 (H1 left, lead), and the eight visual-nav doors follow 6 px below as one bento — four photo doors (`.card-image` 16:9 + title/cover-link + text) then four icon doors (48 px material icon on the tint) — so hero + doors read as one bento composition like the home hero. Shortcuts become one Syrin card with the seven arrow links in four columns; the LO cobranding `<details>` sits in one Sand card (panel hairline dropped); the two help columns (Snakk med rådgiver / Hvor mye kan jeg låne?) are two photo cards 6+6 with the button as cover link; the "bytte bank" banner is one promo card (illustration on the tint, span 12); the twelve popular loans are a 4-up bento of icon cards (horizontal icon+title rows on mobile); the Altinn callout stays a Sand sheet ≤ 68ch in the container; feedback strip unchanged; compare is a Frost card at 6 cols. No full-bleed rows on this page (0 of 10 sections).

Gates
```
nb-bank-privat-lan-html: content-check PASS — checked text 87, hrefs 212, imgs 23; missing text 0, hrefs 0, imgs 0
nb-bank-privat-lan-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 26/26/26; heights 8280/5577/4652
```
(P2: arrow links / labels < 40 px tall at 390 — pre-existing advisory class.)

Shots: `shots/rc-lan-1440.png` (+ `-p1…p4`), `shots/rc-lan-1024.png`, `shots/rc-lan-390.png` (+ `-p1…p6`); before: `shots/rc-lan-before-1440.png`.

Sibling spot-check: `nb-bank-privat-sparing-html` → `stardust/migrated/nb/bank/privat/sparing.html` (migrate PASS, content-check clean), `shots/rc-sib-privat-sparing-1440.png`. Hero card → 3 photo doors + 4 icon doors → illustration tile 5 + text card 7 ("Usikker på hva du skal velge?") → calculator title/lead (empty React mount, pre-existing) → 4 photo tip cards → feedback → compare. Reads as the system; 0 px overflow at 390.

## 2. `nb-bank-privat-kundeservice-html` (kundeservice-hub)

Composition: the hero is a bento — ask card on Frost 5 cols (H1, "Hva kan vi hjelpe deg med?" at `.h3`, lead, second paragraph, the chat form as white input + button inside the Frost card, note) beside the photo card 7 cols — and the four tool cards are the bento's second row 6 px below (`ul.bento.tools.grid-4`, title cover-link + text), replacing the hairline tiles. "Akkurat nå lurer noen på…" loses the Frost paper and the sticky 4/8 grid: centred `.h2-l` title, questions in the container ≤ 52rem. "Hjelp til andre ting" is a 3×3 bento of icon cards (icon + title in a row). The two invitations (svindel / avtal møte) are one full-bleed promo row (`ul.bento.promo-grid.grid-2`, illustration on the tint, button as cover link) — the page's one full-width section (1 of 4).

Gates
```
nb-bank-privat-kundeservice-html: content-check PASS — checked text 62, hrefs 193, imgs 15; missing text 0, hrefs 0, imgs 0
nb-bank-privat-kundeservice-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 15/15/15; heights 5301/3821/2936
```

Shots: `shots/rc-ks-1440.png` (+ `-p1…p2`), `shots/rc-ks-390.png` (+ `-p1…p4`); before: `shots/rc-ks-before-1440.png`.

Sibling spot-check: `nb-bank-bedrift-kundeservice-html` → `stardust/migrated/nb/bank/bedrift/kundeservice.html` (migrate PASS), `shots/rc-sib-bedrift-kundeservice-1440.png`. Hero ask card + photo + 4 tool cards + "Se priser…" link, FAQ, callout, 10 topic cards (4-up, two on the last row), full-bleed invites. Note: the second invite carries a photo rather than an SVG; it renders as a 180 px picture on the tint (acceptable, flagged below). 0 px overflow at 390.

## 3. `nb-bank-privat-kundeservice-verktoy-sperre-kort-html` (tool)

Composition: the text-only intro is one Sand card across 12 (back link, H1, lead). The procedure is a bento: the numbered steps, the barn/ungdom note, the Skog action and the phone note inside one Frost card at 7 cols, the mobilbruker illustration centred on a Sand tile at 5 cols (illustration above the steps on mobile). The misuse callout stays a Sand sheet ≤ 68ch in the container. "Funnet igjen et sperret kort?" is a split bento: photo card 5 (bleeding) + Frost text card 7 with the button as cover link. Feedback strip with the captured Ja/Nei labels unchanged. No full-bleed rows.

Gates
```
nb-bank-privat-kundeservice-verktoy-sperre-kort-html: content-check PASS — checked text 66, hrefs 188, imgs 5; missing text 0, hrefs 0, imgs 0
nb-bank-privat-kundeservice-verktoy-sperre-kort-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 5/5/5; heights 4777/3832/3248
```

Shots: `shots/rc-sperre-1440.png` (+ `-p1…p3`), `shots/rc-sperre-390.png` (+ `-p1…p4`); before: `shots/rc-sperre-before-1440.png`.

Sibling spot-check: `nb-bank-privat-kundeservice-verktoy-iban-og-swift-html` → `stardust/migrated/nb/bank/privat/kundeservice/verktoy/iban-og-swift.html` (migrate PASS), `shots/rc-sib-privat-kundeservice-verktoy-iban-og-swift-1440.png`. Sand hero card with the Skog action, prose and two disclosure buttons in the container, "Se også" as two cards 6+6, feedback. The country tables inside the disclosures scroll in `.table-wrap` (no page overflow at 390).

## 4. `nb-bank-privat-kundeservice-kontakt-html` (utility)

Composition: hero bento — Frost text card 5 cols (H1, two leads, "Kontakt for bedrifter" as a white secondary button) beside the captured circle portrait (`radgiver-sirkel-3.png`, a circular cutout) centred on a Sand tile 7 cols; on mobile the portrait sits above the text. "Finn din bank" drops the Frost paper and the table: centred `.h2-l` title, the first head cell as the lead ("Klikk for å se kontorer og åpningstider"), then a 4-up bento of twelve bank cards (bank name → office page; phone and contact channel as `.arrow` links with the "Telefon" / "Kontakt oss" head cells kept as visually-hidden prefixes — multi-link cards, no cover), closed by one Frost card with the partner links in a row. The hours callout stays a Sand sheet. "Kontakt SpareBank 1 Utvikling DA" is a 4-up bento of address cards (term as `.h3`, lines as tabular `<p>`), replacing the definition list. No router (captured page has none); no full-bleed rows.

Gates
```
nb-bank-privat-kundeservice-kontakt-html: content-check PASS — checked text 55, hrefs 194, imgs 3; missing text 0, hrefs 0, imgs 0
nb-bank-privat-kundeservice-kontakt-html: PASS — 0 P0/P1, 1 P2/P3; externalFulfilled 1/3/3; heights 5620/3734/2887
```

Shots: `shots/rc-kontakt-1440.png` (+ `-p1…p2`), `shots/rc-kontakt-390.png` (+ `-p1…p4`); before: `shots/rc-kontakt-before-1440.png`.

Sibling spot-check: `nb-bank-privat-kundeservice-bestill-prisliste-html` → `stardust/migrated/nb/bank/privat/kundeservice/bestill/prisliste.html` (migrate PASS), `shots/rc-sib-privat-kundeservice-bestill-prisliste-1440.png`. Frost hero card (H1, lead, bank-choice CTA) + the captured illustration as a figure. 0 px overflow at 390.

## Contract changes (data-* values)

- `data-layout`: heroes → `bento-cells` (text-only → `bento-cell`); doors/help/cards/topics/directory/addresses → `grid`; shortcuts, cobranding, compare, steps → `bento-cell`; the kundeservice invites → `full-bleed-grid`.
- `data-slot`: repeated-unit lists now all carry `data-slot="cards"` (was `tiles` on the kundeservice topics, `table` on the kontakt directory, `address` on the Utvikling block, `items` on usp). The small-door list keeps its existing `data-slot="cards-small"`; the kontakt partners card carries `data-slot="partners"`.
- All `data-section` / `data-intent` / `data-module` values unchanged.

## Requests for chrome

1. `.card--frost .btn-secondary` — the secondary button (Frost-30 fill) vanishes on a Frost card. Module CSS now sets a white fill (`#fff`, hover `--frost-70`) for that case; belongs in `cssBase()` next to `.btn-secondary`.
2. A bleeding-photo cell primitive — `.media-photo` (figure card, `position:relative`; `img` absolute inset 0, `object-fit:cover`, 700 ms scale on the sibling card's hover) — is defined in `HUB_CSS`. The home/boliglån modules do the same by hand (`.hero-photo`, `.q-photo`); one shared class in `cssBase()` would avoid the intrinsic-size overflow at 390 that the flex-item `height:100%` variant produced.
3. `.hero-bento:has(.hero-media)` for the 440 px hero row minimum (text-only heroes must not inherit it) — also a candidate for the shared CSS if heroes become a chrome primitive.
4. Promo teasers whose captured media is a photo (bedrift kundeservice "Trenger du noen å sparre med?") render the photo at illustration size on the tint; a `.card-image` variant of the promo card would let photos bleed there as well.
