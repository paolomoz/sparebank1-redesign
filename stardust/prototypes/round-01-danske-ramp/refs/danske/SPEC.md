# Danske Bank — danskebank.dk/privat — structural reference spec

Captured 2026-09-15 with Playwright/Chromium (DPR 1), viewports 1440x900 and 390x844 (mobile UA, touch).
URL loaded directly (no country chooser). Cookie banner: clicked `#button-accept-all`, then removed `.cookie-consent-banner-modal` and `.spinner`.
All values are px from `getBoundingClientRect()` / `getComputedStyle()`. Raw data: `measurements.json` (keys `v1440`, `v390`; `header`, `footer`, `sections`, `grids`, `cardTypes`, `radiusCensus`, `buttons`, `sticky*`, `hover*`, `mobileMenuOpen`).

Scope: structure only (layout, spacing, radii, header/footer, cards, grids). Colours are reported as roles with the measured rgb for identification only; fonts are not to be borrowed.

Colour roles seen (for identification): dark = rgb(0,35,70); tinted = rgb(235,235,230); white = rgb(255,255,255); accent (buttons/links) = rgb(10,94,240); accent-hover = rgb(1,91,215); off-white = rgb(250,250,249).

Document height: 6215 (1440), 10581 (390). Body text 16/24.

---

## 1. Header

Selectors: `header.nav` > `.menus` > `.section.settings-bar` + `.section.menu-main-bar` > `.section-inner` > `.main-bar` > `nav.primary-nav` (`a.logo`, `.main-menu > ul.main-menu__list`) + `.tools` (`.language`, `.search-site > button.toggle-search`, `.login > .login-dropdown > button.button.cta`) + `.mobile-menu-toggle-wrapper > button.menu-mobile-toggle`.

### 1.1 At 1440

| item | value |
|---|---|
| total header height | 112 (= 32 settings bar + 80 main bar) |
| `header.nav` | position: sticky; top: 0; background transparent; z-index via `.menus` |
| top utility bar `.settings-bar` | yes. h 32, full-bleed, background tinted rgb(235,235,230). Contains audience switch |
| settings inner container | `.section-inner` max-width 1440, padding 0; list starts at x 40 |
| settings items (13px, padding 0 20px, h 32, no radius) | `Privat` (active: white background block, x 40, w 74.88) · `Erhverv` (x 118.27, w 85.13) · `Private Banking` (x 206.78, w 131.16) · `LC&I` (x 341.33, w 65.66) · dropdown `Andre sites` + chevron (x 410.38, w 130.47, 14px, padding 0 24px) |
| gap between settings items | 3.39 (item boxes nearly touch; padding carries the spacing) |
| main bar `.menu-main-bar` | h 80, background white, border-bottom 0, box-shadow none |
| main bar inner `.section-inner` | max-width 1440, padding 0 40px → `.main-bar` x 40, w 1360 (content edges 40 / 1400) |
| `.main-bar` | display flex, align-items flex-start, padding 0 0 16px 17px (computed; effective left edge of logo is x 40) |
| logo `a.logo` | x 40, y 59, w 170.92, h 24; inner `img` 157.53 x 16 at y 63.88 (optically centred in the 80px bar: bar centre 72, img centre 71.9) |
| logo → first nav item | 48 (logo right edge 210.92 → `.main-menu` x 258.92) |
| nav `.main-menu__list` | x 258.92, y 62, w 666.78, h 20; items 14px / line-height 20, weight 400, no padding, no underline |
| nav items, verbatim order | `Bolig` (w 31.11) · `Investering` (70.27) · `Pension og forsikring` (131.80) · `Lån` (22.80) · `Daglig økonomi` (97.02) · `Kontakt og hjælp` (105.13) · `Bliv kunde` (64.67) |
| spacing between nav items | 24 (measured 24, 24, 23.99, 24, 24, 23.99) |
| right utilities `.tools` | x 1175.66, y 54, w 224.34, h 35.59, display flex, align-items center; children left→right: `.language` (text `English`, 16px, w 45.91) → `.search-site` (w 50; button 20x24 with 20x20 svg, aria-label `Søg`, no border/background) → `.login` (w 128.44; button starts 15 in, i.e. 15px gap after search box) |
| login button `button.button.cta.show-for-medium` | text `Log på` + lock svg 16x16; x 1286.56, y 54, w 113.44, h 35.59; padding 8px 24px; border-radius 50px (pill); border 1px solid, same colour as fill (accent); 16px / lh 17.6; text→icon gap 6.4; right edge 1400 (= 1440 − 40) |
| hover on login/CTA buttons | background accent → accent-hover (rgb(10,94,240) → rgb(1,91,215)), border follows; no transform, no shadow |
| nav item hover | see 1.4 |
| hidden at 1440 | `.mobile-menu-toggle-wrapper` (display none), `button.button.cta.xsmall.hide-for-medium` |

### 1.2 Sticky behaviour (both viewports)

`header.nav` is `position: sticky; top: 0`. JS adds `transform: translateY(...)` on scroll (measured on `header.nav`):

| scrollY | 1440: header top..bottom | 390: header top..bottom |
|---|---|---|
| 0 | 0..112 | 0..68 |
| 50 (down) | −25..87 (translateY −25) | −25..43 |
| 150 (down) | −75..37 | −68..0 (fully hidden) |
| ≥300 (down) | −112..0 (fully hidden, translateY −112) | −68..0 |
| any scroll up (700–1100) | −32..80 → only the 80px main bar visible; settings bar stays hidden (translateY −32) | 0..68 (fully shown) |

While stuck: background stays white on the main bar, no box-shadow, no border-bottom added, no class toggled on `body`/`header`. `main` has no top padding (header is in-flow, not fixed).

### 1.3 At 390

| item | value |
|---|---|
| total header height | 68 (settings bar display none) |
| `.menu-main-bar` | h 68, background white; `.section-inner` padding 0; `.main-bar` padding-top 16 |
| logo `a.logo` | x 16, y 25, w 157.53, h 24; `img` 157.53 x 16 at y 29.88 |
| `.tools` | x 202.95, y 20.3, w 114.28, h 33.41; only `.login` is visible (`.language`, `.search-site` hidden — they move into the menu panel) |
| login button `button.button.cta.xsmall` | `Log på` + lock svg 14x14; x 217.95, y 20.3, w 99.28, h 33.41; padding 8px 24px; radius 50; border 1px; 14px / lh 15.4 |
| menu button `button.menu-mobile-toggle` | x 310, y 0, w 80, h 68 (flush right, full bar height, transparent, no border); icon `.icon` 19x19 at x 340.5, y 21.09 = three bars 19 x 2.11 at y 21.09 / 28.59 / 36.09 (7.5 pitch); label `span.title` "Menu" 14px below icon (y 37.09, h 21, centred under the bars) |
| login → menu button gap | 0 (login right edge 317.23 = toggle wrapper x 317.23) |
| gap logo → login | 44.42 (173.53 → 217.95) |

### 1.4 Menus

Mobile menu open (`header-390-menu-open.png`): toggle gets `.is-open`; the three bars rotate ±45° into an X (outer bars `rotate(45deg)`/`rotate(−45deg)`, middle bar opacity 0), label still reads `Menu`. Panel `nav#navigation-mobile > div.menu-mobile`: position fixed, x 0, y 68, w 390, h 776 (viewport minus header), background white, z-index 1000. Inside:
- `.top-area` h 147.19, background tinted: search `input#input-search-mob` pill x 24, y 98, w 263.23, h 48, radius 50, 1px border (tinted), white fill, padding-left 16, 16x16 search icon right-aligned inside; `ENGLISH` link 16px uppercase at x 303.23.
- Audience tabs row y 176, h 39.19: `PRIVAT` (active, white block, w 77.41) · `ERHVERV` · `PRIVATE BANKING` · `LC&I` · `FORENINGER` · `DANSKEBANK.COM` · `ASSET MANAGEMENT` · `DANSKE BANK GROWTH` · `KARRIERE` — 12px uppercase, padding 0 20px, horizontally overflowing (last item ends at x 1057 → scrollable strip).
- Main list from y 215.19: rows h 45 (44 link + 1px border-bottom rgba(0,35,70,0.1)), x 24, w 366 (24 left inset, 0 right), 14px weight 500, chevron svg 5.42 x 11.38 right-aligned at x 364.58. Items: `Forside`, `Bolig`, `Investering`, `Pension og forsikring`, `Lån`, `Daglig økonomi`, `Kontakt og hjælp`, `Bliv kunde` (Bolig…Bliv kunde carry 20x20 line icons at x 24 in the screenshot; text starts ≈ x 52).
- Service list `ul.menu-list.service-menu` y 574.19, h 136, background off-white rgb(250,250,249): `Kontakt & Hjælp`, `Find os`, `Book møde`, same 45px rows with 20x20 icon at x 24.

Desktop nav hover / text-link hover: nav item `a` colour dark → accent (rgb(0,35,70) → rgb(10,94,240)), no underline, no border, no background, and hovering does **not** open a panel (`.cover` stays opacity 0; menus open on click). Inactive settings tab hover: colour → accent-hover rgb(1,91,215), background unchanged. Footer link hover: no change. Secondary (white) button hover: fill rgb(255,255,255) → rgb(227,227,220).

Also present (not header, but fixed chrome): `aside.desktop-tools` — fixed bottom-right toolbar x 1180, y 820, w 260, h 70 (white, radius 4px 0 0 4px on first item) with `Kontakt & Hjælp` (w 100) / `Find os` (w 80) / `Book møde` (w 80), each 68 tall with icon over 12px label; hidden at 390. Chat FAB 60x60, radius 50, at x 1360, y 740 (390: x 310, y 684).

---

## 2. Footer

Selectors: `div.footer-cta` (pre-footer band) then `footer.footer` > two `div.footer-inner` > `.outer-grid-container` (`.outer-grid-item` x2) > `.inner-grid-container` > `.grid-item` > `details > summary + ul.link-list`; legal block `.text-content > .richtext`.

### 2.1 Pre-footer CTA band `.footer-cta` (1440)

- Full-bleed, background tinted (light role), h 206.41, padding 64 all sides → inner x 64, w 1312.
- Two equal columns (`large-6` / `large-6`, 656 each): left `h2` 32px "Bliv kunde i Danske Bank og få alle fordelene i dag." (w 644, h 73.59); right `.button-group` right-aligned: `Bliv ringet op` (secondary: white fill, 1px white border, 186.88 x 62.41) and `Bliv kunde` (accent fill, 165.16 x 62.41); both padding 19px 40px, radius 50, 18px; gap between buttons 16; right edge 1380 (`.button-group` overflows 4px past 1376).
- 390: padding 48 24 60; inner w 342; heading w 330 h 110.39; buttons stacked, centred, 16 gap; band h 403.2.

### 2.2 Footer `footer.footer` (1440)

| item | value |
|---|---|
| background role | dark (rgb(0,35,70)), text white |
| padding | 64 top, 64 right, 64 bottom, 64 left → inner x 64, w 1312 |
| total height | 926 (y 5288.19 → 6214.19) |
| row 1 `.footer-inner` | h 326 (link columns 286 + 40 space below) |
| outer grid | `display: grid; grid-template-columns: 230px 1062px; gap: 20px` → logo column 230, links column 1062 (starts x 314) |
| logo | `a.logo` in column 1, top-aligned: `img` 93.3 x 22 at x 64, y +1.87 (renders as an empty box in the capture — asset blocked; size is real) |
| inner grid | `display: grid; grid-template-columns: 196.39px 196.41px 196.39px 196.41px 196.39px 0px; gap: 20px` → 5 visible columns of 196.4, column gap 20 (measured 20, 20, 20, 19.99) |
| column count / headings (verbatim, `summary`, 16/24, weight 400, no marker at 1440, `details` open) | 1 `Kundeservice` (8 links) · 2 `Vores forretning` (4) · 3 `Om os` (5) · 4 `Nyt fra banken` (5) · 5 `Anden information` (5) |
| heading → list | list `margin-top` 22 → first link 42 below heading top (heading h 20) |
| link items | `li` 14/20, h 20, margin-bottom 8 (28 pitch); 2-line items wrap within 196 |
| column 1 links | Bliv kunde · Kontakt og hjælp · Solsikkelinjen · Sikkerhed · Ros og klager · Derfor stiller banken spørgsmål · Dine oplysninger · Upload dit ID |
| column 2 | Priser og vilkår · Kundeprogram · Partnerskaber · Valutakurser |
| column 3 | Karriere · Presse · Aktionær · Leverandør · Bæredygtighed |
| column 4 | Nyheder · Indsigter · Investeringsnyt · Danske Bank Research · Webinars |
| column 5 | Finanstilsynet m.m. · Danske Banks brugerpanel · Bekæmpelse af økonomisk kriminalitet · Whistleblowing · Tilgængelighedserklæring |
| row 2 `.footer-inner` (legal) | h 472; same 230/1062 grid so legal text is indented to x 314 (aligned with column 1), w 1062 |
| legal content | `div` disclaimer 12/16 (h 248, margin-bottom 20) + `button.read-more-toggle` "Læs mere »" 12px; then `p` address/registration 12/16 (h 144) with inline underlined links (`Kontakt os`, `danskebank.dk/klage`, GDPR, vilkår, cookies, rettigheder ved betalinger, tilgængelighedserklæring) |
| bottom legal row layout | not a separate bar: plain left-aligned text inside the same dark block, no background change, no separator line, followed by the 64 bottom padding |
| separators | none at 1440 (no `hr`, no borders) |
| social icons / app badges | none on this page |

### 2.3 Footer at 390

- padding 48 top, 24 sides, 60 bottom; inner w 342; total h 1225.
- Row 1: outer/inner grids become `display: block`. Logo `img` 93.3 x 22 at top; 40 below it the 5 column groups become closed accordions: each `details` h 49 = 14 padding-top + 20 summary + 14 padding-bottom + 1px `border-top` rgba(255,255,255,0.2) (the separator); `summary` 16/24 with a 24x24 chevron svg (`span.marker`) right-aligned at x 342; no border after the last one. Group block h 245 (5 x 49).
- Row 2 legal starts 24 below the accordions (y 9712.2 vs 9688.2), 12/16 text, w 342.
- Pre-footer CTA: see 2.1.

---

## 3. Cards

### 3.1 Common construction (all card types, both viewports)

```
div.columns.<grid-class>            (Foundation float column, padding 0)
  div.card[.card-blue-1|.card-primary-white|.card-brand-blue|.split|.vertical-align]
    div.card-back                   (absolute; top/right/bottom/left 3px; border-radius 2px; overflow hidden; z-index -1;
                                     carries background-color or background-image)
    div.card-content                (static; the card's padding positions it)
      [div.card-image.top.media-richtext > img]   (image variants only; sits at the top, flush with .card-back)
      span > h2|h3 (title), p (text), p > a.button | a.icon.arrow-right (CTA)
```

| property | 1440 | 390 |
|---|---|---|
| card cell `.card` padding | 51px 39px | 51px 21px |
| `.card-back` inset from cell | 3 on all four sides | 3 |
| visible padding (content to visible card edge) | 48 top/bottom, 36 left/right | 48 / 18 |
| visible gap between two adjacent cards | 6 (3 + 3), horizontally and vertically | 6 (stacked) |
| border | none (0) on `.card`, `.card-back` and `.card-content` | none |
| border-radius | `.card` 0; `.card-back` 2 (all corners) | same |
| box-shadow | none | none |
| background | on `.card-back` only; `.card` itself transparent | same |
| height | explicit px per row (equal-height, e.g. 266, 262, 651, 596, 400) | content height, no equalisation |
| cursor on card | `auto` — the card as a whole is not a link; only the inner `a` is clickable | |
| hover | **none** on `.card`, `.card-back`, image, title (computed styles identical before/after; `card-1.png` and `card-hover.png` are byte-identical). Button hover only: fill accent → accent-hover. | n/a |
| transitions | `.card`/`.card-back` `transition: all`; `img` `opacity 0.25s` (lazy-load fade) | |

Images: `div.card-image.top.media-richtext` is inside `.card-content` but starts at the `.card-back` edge (x +3, y +3, w = card-back width) → the image **bleeds to the visible card edge** on top/left/right; corners take the 2px card radius via `overflow: hidden` on `.card-back`; the `img` itself has radius 0 and `object-fit: fill`. Aspect ratio 16:9 (472 x 265.5 at 1440 from 800x450 source; 378 x 212.63 at 390).

CTA presentation, two kinds:
- `a.button` pill: display inline-block, padding 15px 32px, min-height 48 → h 49.59, radius 50, 1px border same as fill, 16px / lh 17.6, `margin-top` 8. Hover: fill rgb(10,94,240) → rgb(1,91,215), no transform/shadow.
- `a.icon.arrow-right` text link: inline, 16px / lh 24, accent colour, no underline, followed by a chevron via `::after` (inline-block 6 x 13, inline SVG data-URI, `margin-left` 0; `::before` reserves 11x11 inline-block). Hover: text and chevron colour darken one step (measured on the hero link: rgb(133,175,248) → rgb(93,148,245); on light cards the accent darkens similarly), and the chevron `::after` slides right: `translateX(8px)` → `translateX(12.8px)` (+4.8). No underline, no background. See `card-arrow-link-hover.png`.

Title sizes: `h2` 32 / 40 (in text teasers the `h2` wraps a `span.h3` rendered 24 / 28, so the visible title is 24px while the block is 40 tall); `h3` 24 / 28. Title margin-bottom 9.6 (h2) / 7.2 (h3). Body `p` 16 / 24, margin-bottom 16.

### 3.2 Card types on the page (1440 numbers; 390 in brackets)

**A. Promo tile, dark** — `div.card.card-brand-blue.vertical-align` in `div.columns.text-center.large-4` (hero left). Cell 478 x 400 [384 x 312.39]; visible 472 x 394; dark fill; `display: table` + `table-cell` content → vertically centred, text-centred. Stack: `h1` 36px (h 44) → `p` 16/24 → `a.button` pill 247.67 x 49.59 → `a.icon.arrow-right` 16px (chevron 6x13). Content inset 51 / 39 [51 / 21]. Count 1.

**B. Image tile (no text)** — `div.card.vertical-align` in `div.columns.large-8.end.show-for-medium` (hero right). Cell 956 x 400; visible 950 x 394; `.card-back` `background-image` (cover), radius 2. No content. Count 1. [390: replaced by a `hide-for-medium` duplicate 384 x 200 placed *above* the promo tile.]

**C. Image spacer tile** — `div.card` (no modifier) in `div.columns.medium-2.show-for-large`. Cell 239 x 266; visible 233 x 260; `background-image` on `.card-back`. Count 2. Hidden at 390.

**D. Text teaser, tinted** — `div.card.card-blue-1` (no image) in `div.columns.medium-6.large-4`. Cell 478 x 266 [384 x 265.59 / 279.59]; fill tinted rgb(235,235,230). Content x +39 (visible +36), y +51: `h2` (40 tall, `span.h3` 24px inside) → 9.6 → `p` 16/24 → the arrow link sits in the same paragraph one line (24) below the text (`p` h 98 incl. link at +76). Content bottom inset 51 → link bottom to visible edge 19.4. Count 2. Selectors to inspect: `.card.card-blue-1 .card-content > span > h2 > span.h3`, `a.icon.arrow-right`.

**E. Icon card, white** — `div.card.card-primary-white` in `div.columns.medium-4`. Cell 478 x 262 [384 x 262.19]; white fill; text-centred. Stack: `p > img` icon 111 x 67 (natural, inset from top 51) → 16 → `h3` 24/28 → 7.2 + 4 → `a.icon.arrow-right` "Beregn nu" (link top 11.19 below title bottom). Count 3.

**F. Image teaser, tinted** — `div.card.card-blue-1` with `div.card-image.top.media-richtext`. Cell 478 x 651 (news row) / 478 x 596 (contact row) [384 x 582–630 / 543–567]; tinted fill. Stack from top: image 472 x 265.5 flush (radius follows 2px card corners) → **48** → `h2` (news; 32/40, 2 lines = 80) or `h3` (contact; 24/28) → 9.6 / 7.2 → `p` 16/24 → **24** → `a.button` pill (h 49.59) → bottom inset to visible edge 72.3 (news, equal-height slack) / 51 (content-driven). Left/right inset 39 from cell (36 visible) [21 / 18]. Count 3 + 3.

**G. Split card, dark** — `div.split.card.card-brand-blue` in `div.columns.medium-10.medium-offset-1`. Cell 1195 x 400 at x 122.5 [384 x 409.19 stacked]; visible 1189 x 394; dark fill; left half `div` 595 x 394 image with radius `2px 0 0 2px`; right half content starts x 759 (36 after the image), vertically centred: `h2` 32/40 white → 9.6 → `p` 16/24 (w 519.5) → 24 → `a.button`. Count 1.

**H. Empty white band** — `div.card.card-primary-white` in `div.columns.medium-12`, cell 1434 x 102 [384 x 102], empty content; acts as a 102px white spacer between the last section and the pre-footer band. Count 1.

Login dropdown / "Andre sites" dropdown panels (`#platform-detector.dropdown-panel`, `#dropsites.dropdown-pane`) also use radius 2.

---

## 4. Bento / grid sections

Grid mechanics (all card sections): `section.section.cards > div.section-inner > div.row > div.columns.*`. `.section-inner` max-width 1440, margin 0 3px → x 3, w 1434 at 1440 [x 3, w 384 at 390]. `.row` is `display: block` (Foundation float grid): **no CSS grid, no flex, no gap property**. Column widths are 12ths of 1434; the visible 6px gutter comes entirely from each card's 3px `.card-back` inset. `.columns` have 0 padding and 0 margin-bottom. Consecutive card sections touch (0 section padding, 0 gap), so vertical gutters are also 6. Section backgrounds are transparent (page white); the cards carry all colour.

Column widths at 1440: `large-4` / `medium-4` = 478 (33.3%), `large-8` = 956, `medium-2` = 239, `medium-10` = 1195 (offset-1 → x 122.5), `medium-12` = 1434.

| # | section (y, h at 1440) | template (of 12) | items | spans | card h (1440) | 390 collapse |
|---|---|---|---|---|---|---|
| G0 hero `section.cards.block` (112, 400) | 4 + 8 | 2 visible (3 in DOM) | image tile spans 8 cols (956) | 400 fixed | 1 col; image 384x200 above promo 384x312.39; 6 gap |
| G1 `section.cards` (512, 266) | 2 + 4 + 2 + 4 | 4 | none; alternating image spacer / text teaser | 266 fixed | 1 col; spacers hidden; 2 teasers 265.59 + 279.59 |
| G2 icon cards (937.59, 262) | 4 + 4 + 4 | 3 | none | 262 fixed | 1 col; 262.19 / 262.19 / 290.19 |
| G3 news (1269.59, 700.59) | heading row (h 50) + 4 + 4 + 4 | 3 | none | 651 fixed | 1 col; 597.81 / 629.81 / 581.81 |
| G4 contact (3800.19, 709.59) | heading row (h 114: h2 + intro p) + 4 + 4 + 4 | 3 | none | 596 fixed | 1 col; 567.41 / 543.41 / 543.41 |
| G5 split (4579.78, 400) | offset-1 + 10 | 1 | one card spans 10 cols, internally 50/50 image/text | 400 fixed | 1 col 384 x 409.19; image half stacks above text |
| G6 white band (4979.78, 102) | 12 | 1 | — | 102 | 384 x 102 |

Measured card x positions at 1440: 3 / 481 / 959 (3-col rows); 3 / 242 / 720 / 959 (G1); card-back visible edges therefore 6 / 484 / 962 (left) and 478 / 956 / 1434 (right). Horizontal gap between `.card` cells 0; between visible `.card-back` faces 6.

No true mixed-row-span bento exists on this page: mixed sizes are achieved only horizontally (4/8, 2/4/2/4, offset-1/10) within single rows; no item spans two rows.

Heading rows inside card sections (`div.row > div.columns.end.vertical-align > h2`) are full-width (x 3, w 1434), h2 32/40, 50 tall (G3) or 114 tall with intro paragraph (G4), centred text.

Non-card "article" sections (`section.section-article`, `article.section-article.keys`): `.section-inner` max-width 83.333% = 1200 at x 120, padding 70 12 0 12 (headings) or 70 12 70 12 (article body); `.row` x 132, w 1176; radius `2px 2px 0 0` on `.section-inner`. At 390: padding 50 6 0 6, `.row` x 12, w 366. Two of these are empty 70px (390: 50px) spacers used as vertical rhythm between card sections.

Section container / side padding summary: card sections 3px each side (edge-to-edge grid); text sections 120px each side (1200 container); footer/CTA 64px each side (1312 container); header 40px each side (1360 container). At 390: cards 3, text 6+6, footer 24, header 16.

---

## 5. Section rhythm, top to bottom

### 1440 (y start, height)

| # | section | role / bg | container | vertical padding |
|---|---|---|---|---|
| 0 | `header.nav` (0, 112) | settings bar tinted 32 + main bar white 80 | 1440 / 1360 content | 0 |
| 1 | `section.cards.block` hero (112, 400) | dark promo tile 478 + image tile 956 | 1434 edge-to-edge | 0 (cards inset 3) |
| 2 | `section.cards` (512, 266) | image / tinted teaser / image / tinted teaser | 1434 | 0 |
| 3 | `section.section-article` heading "Prøv en af vores beregnere" (778, 159.59) | transparent, h2 32 + intro p | 1200 (x 120) | 70 top, 0 bottom |
| 4 | `section.cards` icon cards (937.59, 262) | 3 white cards | 1434 | 0 |
| 5 | `section.section-article` empty spacer (1199.59, 70) | transparent | 1200 | 70 top only |
| 6 | `section.cards` "Nyheder og aktuelt" (1269.59, 700.59) | heading row 50 + 3 tinted image teasers 651 | 1434 | 0 |
| 7 | `article.section-article.keys` (1970.19, 1830) | transparent rich text (h3 24, paragraphs, links) | 1200 | 70 top, 70 bottom |
| 8 | `section.cards` "Kontakt & hjælp" (3800.19, 709.59) | heading row 114 + 3 tinted image teasers 596 | 1434 | 0 |
| 9 | `section.section-article` empty spacer (4509.78, 70) | transparent | 1200 | 70 top only |
| 10 | `section.cards` split card (4579.78, 400) | dark split card 1195 centred | 1434 (card at x 122.5) | 0 |
| 11 | `section.cards` white band (4979.78, 102) | white empty card | 1434 | 0 |
| 12 | `div.footer-cta` (5081.78, 206.41) | tinted band, h2 + 2 pill buttons | 1312 (x 64) | 64 / 64 |
| 13 | `footer.footer` (5288.19, 926) | dark; logo + 5 link columns (326) + legal (472) | 1312 (x 64) | 64 / 64 |

Gaps between consecutive sections: 0 everywhere (rhythm is produced by the 70px `section-article` spacers and the 3px card insets).

### 390 (y start, height)

0 header (0, 68) · 1 hero (68, 512.39) · 2 teasers (580.39, 545.19) · 3 heading (1125.58, 267.59; pad 50 top) · 4 icon cards (1393.17, 814.56) · 5 spacer (2207.73, 50) · 6 news (2257.73, 1859.03) · 7 article (4116.77, 2455.23; pad 50/50) · 8 contact (6572, 1815.81) · 9 spacer (8387.81, 50) · 10 split (8437.81, 409.19) · 11 white band (8847, 102) · 12 footer-cta (8952, 403.2; pad 48 24 60; 3px gap above) · 13 footer (9355.2, 1225; pad 48 24 60).

---

## 6. Corner-radius system (census of every visible element with a non-zero radius, cookie banner excluded)

### 1440

| radius | count | where |
|---|---|---|
| 2px (all corners) | 20 | 17 x `div.card-back` (every card face), `#dropsites.dropdown-pane` (200x288), `#platform-detector.dropdown-panel` + `table#loginPopup` (435x248) |
| 50px (pill) | 12 | all buttons: header `Log på` 113x36, 8 x `a.button` in cards (~150–250 x 50), footer-cta `Bliv ringet op` 187x62 and `Bliv kunde` 165x62, chat FAB 60x60 |
| 2px 2px 0 0 | 4 | `div.section-inner` of the 4 `section-article` blocks (1200 wide) |
| 2px 0 0 2px | 1 | image half of the split card (595x394) |
| 4px 0 0 4px | 1 | first `li` of the fixed `aside.desktop-tools` toolbar (100x70) |

No radius on: header bars, settings tabs (active tab is a square white block), nav items, logo, footer columns, images inside cards (they inherit the 2px only through `overflow: hidden` on `.card-back`), legal text, arrow links.

### 390

| radius | count | where |
|---|---|---|
| 2px | 17 | 15 x `div.card-back`, login dropdown panel + table |
| 50px | 12 | `Log på` xsmall 99x33, 8 card `a.button`, 2 footer-cta buttons, chat FAB; in the open menu also `input#input-search-mob` 263x48 |

Summary: the site uses exactly two radii for visible components — **2px** for every surface (cards, panels) and **50px (full pill)** for every button and the search input. No 8/12/16px radii anywhere.

---

## 7. Files

Screenshots (all PNG, DPR 1) in this folder: `full-1440.png`, `full-390.png`, `header-1440.png`, `header-390.png`, `header-390-menu-open.png`, `header-scrolled-800-1440.png` (header hidden after scroll-down), `header-scrolled-up-1440.png` (main bar only, revealed on scroll-up), `header-scrolled-800-390.png`, `header-scrolled-up-390.png`, `header-1440-nav-hover.png` (nav item hovered: colour change only, no panel), `footer-1440.png`, `footer-390.png`, `footer-cta-1440.png`, `footer-cta-390.png`, `bento-1.png` … `bento-7.png` (sections G0–G6 at 1440), `bento-1-390.png` … `bento-7-390.png`, `card-1.png` (image teaser F), `card-1-390.png`, `card-hover.png` (byte-identical to `card-1.png`: no card hover), `card-hover-link.png` (button hover), `card-2-text.png` (text teaser D), `card-arrow-link-hover.png` (hero promo tile with the arrow-link hovered). Raw data: `measurements.json`. Scripts used: `_recon.mjs`, `_recon2.mjs`, `_extract.mjs`, `_sticky.mjs`, `_mobile.mjs`, `_hover.mjs` (run with `node` from `sparebank1-redesign/`).

Note: 390 element screenshots (footer, bentos, card) were taken with `header.nav` set to `visibility: hidden` and the fixed `aside.desktop-tools` hidden so the sticky header would not overlay the crop. The footer logo renders as an empty box because the SVG asset was blocked; its box size (93.3 x 22) is real.
