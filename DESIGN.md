---
name: SpareBank 1 — Rolig og tydelig (target)
description: "A calm, confident Nordic bank: white paper, Fjell headlines on a 1.25 scale, Vann for every link, Skog for the one action, Sand/Frost paper fields, photography at content scale, the alliance router as signature."
colors:
  fjell: "#002776"
  fjell-70: "#4d689f"
  fjell-30: "#b3bed6"
  vann: "#005aa4"
  vann-30: "#b3cee4"
  natt: "#001032"
  skog: "#00754e"
  skog-hover: "#095139"
  frost: "#7eb5d2"
  frost-30: "#d8e9f2"
  sand: "#f8e9dd"
  sand-70: "#faf0e7"
  sand-30: "#fdf8f5"
  syrin-30: "#f2f2f9"
  multe: "#f8b181"
  lyng: "#873953"
  baer: "#e44244"
  nordlys: "#33af85"
  sol: "#dc8000"
  svart: "#020a0a"
  koksgraa: "#323232"
  moerkgraa: "#676767"
  graa: "#adadad"
  lysgraa: "#d8d8d8"
  hvit: "#ffffff"
typography:
  display:
    fontFamily: "SpareBank1-title-medium, arial, sans-serif"
    fontSize: "clamp(2.5rem, 1.6rem + 2.4vw, 3.8125rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "SpareBank1-title-medium, arial, sans-serif"
    fontSize: "clamp(2.125rem, 1.5rem + 1.7vw, 3.0625rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  headline-sm:
    fontFamily: "SpareBank1-title-medium, arial, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1vw, 2.4375rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "normal"
  title:
    fontFamily: "SpareBank1-title-medium, arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 0.6vw, 1.9375rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  title-sm:
    fontFamily: "SpareBank1-medium, arial, sans-serif"
    fontSize: "1.5625rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  lead:
    fontFamily: "SpareBank1-regular, arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "SpareBank1-regular, arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  body-strong:
    fontFamily: "SpareBank1-medium, arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  small:
    fontFamily: "SpareBank1-regular, arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "SpareBank1-medium, arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  image-sm: "48px"
  image: "96px"
  pill: "6em"
  circle: "50%"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  2xl: "64px"
  3xl: "96px"
  section: "64px"
  section-tablet: "48px"
  section-mobile: "32px"
components:
  button-primary:
    backgroundColor: "{colors.vann}"
    textColor: "{colors.hvit}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.fjell}"
    textColor: "{colors.hvit}"
  button-secondary:
    backgroundColor: "{colors.hvit}"
    textColor: "{colors.vann}"
    rounded: "{rounded.pill}"
    padding: "10px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.frost-30}"
    textColor: "{colors.fjell}"
  button-action:
    backgroundColor: "{colors.skog}"
    textColor: "{colors.hvit}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-action-hover:
    backgroundColor: "{colors.skog-hover}"
    textColor: "{colors.hvit}"
  button-inline:
    backgroundColor: "transparent"
    textColor: "{colors.vann}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  link:
    backgroundColor: "transparent"
    textColor: "{colors.vann}"
  card:
    backgroundColor: "{colors.sand-30}"
    textColor: "{colors.svart}"
    rounded: "{rounded.md}"
    padding: "24px"
  card-cool:
    backgroundColor: "{colors.frost-30}"
    textColor: "{colors.svart}"
    rounded: "{rounded.md}"
    padding: "24px"
  card-plain:
    backgroundColor: "{colors.hvit}"
    textColor: "{colors.svart}"
    rounded: "{rounded.md}"
    padding: "24px"
  input:
    backgroundColor: "{colors.hvit}"
    textColor: "{colors.svart}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  badge:
    backgroundColor: "{colors.frost-30}"
    textColor: "{colors.fjell}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  band-sand:
    backgroundColor: "{colors.sand-30}"
    textColor: "{colors.svart}"
  band-frost:
    backgroundColor: "{colors.frost-30}"
    textColor: "{colors.svart}"
  band-brand:
    backgroundColor: "{colors.fjell}"
    textColor: "{colors.hvit}"
  band-router:
    backgroundColor: "{colors.vann}"
    textColor: "{colors.hvit}"
---

<!-- stardust:provenance
  writtenBy: stardust:direct (Phase 4 — target visual system, site-level only; impeccable document.md used as the format spec)
  writtenAt: 2026-09-14T21:15:00Z
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  readArtifacts:
    - stardust/current/DESIGN.md, DESIGN.json, _ffe-tokens.json, _brand-extraction.json
    - stardust/direction.md, stardust/prototypes/nb-bank-privat-html-improvements.md
    - refero styles d8a01033, f72e18d0, 3e14bbe4, 530fc441 (strategy only; no palette or type ported)
  synthesizedInputs: []
  stardustVersion: 0.20.0
-->

# Design System: SpareBank 1 — Rolig og tydelig (round 01: cards, bentos, Ramp type)

## Overview

**Creative North Star: "A Nordic bank set like a modern product site"**

The page is a grid of quiet cards: tinted sheets with 2 px corners, no borders and no shadows, separated by 6 px gutters and composed in 12-column bento rows with asymmetric spans. Photographs bleed to the card edge at 16:9; spot illustrations sit on the tint. Type is one weight on the bank's own three faces at a product-site scale — 64 / 48 / 40 / 28 / 24 — with tight display leading and hierarchy carried by size and a two-tone ink/hushed split. Buttons are small, borderless 6 px rectangles whose height comes from padding. Colour is the alliance's own: Fjell and Vann do the talking, Skog acts once per module, Sand-70 / Frost-30 / Syrin-30 fill the cards, Fjell holds the footer and Vann holds the router card. The header is a two-tier Danske-style bar that hides on scroll-down and comes back on scroll-up.

Density is balanced: 64 px between movements, 6 px between cards, 48/36 padding inside a card. The content column is 1312 px inside a 1440 px container; at most 30 % of a page's sections may run full width, and only minor rows (promo bands), never the main content. Hover is the distinctive layer — fills deepen one tint step, title underlines draw in, illustrations spring, photos breathe — and every effect is reduced-motion safe.

References (measured 2026-09-15): Danske Bank for card, bento, gutter, corner, header and footer structure; Ramp for type scale, page width and button geometry. Neither brand's colours, fonts or copy are borrowed. Direction: `stardust/direction.md` § Active direction (2026-09-15).

**Key Characteristics:**
- White page; cards on Sand-70 (default), Frost-30 (cool / tools), Syrin-30 (quiet), Fjell or Vann (dark); 2 px corners, 6 px gutters, no border, no shadow.
- 12-column bento rows with asymmetric spans (hero 12 then 5/7; 2+4+2+4; 3×4; 4-up); photos bleed 16:9.
- Ramp type scale on SpareBank1 Title-Medium / Medium / Regular; one weight; display leading 1.0–1.05, body 1.375; two-tone headlines.
- 6 px borderless buttons; Skog reserved to the one relationship-starting action.
- Sticky two-tier header (32 + 80 px) with hide/reveal; router as a Vann card; Sand-70 contact band; Fjell footer grid.
- Hover system: fill step, underline draw-in, spring, breathe, drift; focus-within mirrors hover.

## Colors

The alliance's own nature-named palette, used more quietly: two blues do the talking, one green acts, warm and cool papers mark the movements.

### Primary
- **Fjell** (`#002776`): display and headline text, footer ground, link hover. The brand's mountain blue — the voice of every headline. 12.9:1 on Hvit, 10.6:1 on Frost-30, 12.1:1 on Sand-30.
- **Vann** (`#005aa4`): every link, the primary button fill, the router band ground, icon circles, focus ring alternative. 7.0:1 on Hvit, 6.6:1 on Sand-30, 5.7:1 on Frost-30. Hover → Fjell.
- **Natt** (`#001032`): footer bottom row, the deepest surface. Never used as body text on tints.

### Secondary
- **Skog** (`#00754e`) — *reserved*: the action button (Logg inn, Bli kunde, Søk lån / apply flows) and success states only. 5.9:1 Hvit-on-Skog. Hover `#095139`. Never a decorative accent, never a link colour.
- **Frost** (`#7eb5d2`) / **Frost-30** (`#d8e9f2`): cool paper for help, tools and kundeservice modules; the sky in the alliance illustration.
- **Sand** (`#f8e9dd`) / **Sand-70** (`#faf0e7`) / **Sand-30** (`#fdf8f5`): warm paper for offers, tips and membership modules; the default card ground.
- **Syrin-30** (`#f2f2f9`): the campaign carousel ground (captured on the market landing) — one campaign per page.

### Tertiary
- **Multe** (`#f8b181`), **Lyng** (`#873953`, visited links), **Nordlys** (`#33af85`, success icon), **Bær** (`#e44244`, errors only — border and icon; Bær is never body text on Hvit, 4.07:1), **Sol** (`#dc8000`, focus ring + tips icon only). Illustration and status colours; never surfaces.

### Neutral
- **Svart** (`#020a0a`): body text. **Koksgrå** (`#323232`): secondary text on tinted papers (≥ 9:1). **Mørkgrå** (`#676767`): secondary text on Hvit only (5.7:1), captions, disabled labels. **Grå** (`#adadad`): disabled fills. **Lysgrå** (`#d8d8d8`): hairlines, input borders. **Hvit** (`#ffffff`): the page.

### Named Rules
**The One Action Rule.** Skog appears at most once per module and only on the action that starts something (log in, become a customer, apply). Everything else that is clickable is Vann.
**The Paper Rule.** A change of subject is a change of paper (Hvit → Sand-30 → Frost-30), never a divider and never two tinted papers of the same hue adjacent. Body text on any paper is Svart; secondary text on tinted paper is Koksgrå, never Mørkgrå.
**The No-Overlay Rule.** Type never sits on a photograph. Photographs sit beside or below their words.

## Typography

**Display Font:** SpareBank1-title-medium (with arial, sans-serif)
**Body Font:** SpareBank1-regular (with arial, sans-serif)
**Title/Label Font:** SpareBank1-medium (with arial, sans-serif)

**Character:** The bank's humanist sans in three cuts, all weight 400, set on the Ramp scale: big, tight display sizes and a compact body. Hierarchy is size, leading, cut and the two-tone split (ink + 60 % hushed span inside one headline) — never bold, never uppercase.

### Hierarchy (desktop → mobile)
- **Display** (title-medium, 64 → 40 px, 1.0): the hero object on landings — a headline or a number.
- **Headline-L** (title-medium, 48 → 34 px, 1.04): page H1, centred section titles ("Nytt og nyttig"), campaign headline.
- **Headline-M** (title-medium, 40 → 28 px, 1.05): router tile heading, contact band heading, section H2.
- **Headline-S** (medium, 28 → 22 px, 1.14): card group titles (OM OSS, Sammenlign priser).
- **Title** (medium, 24 → 20 px, 1.17): card titles, H3.
- **Lead** (regular, 18 → 17 px, 1.33): the line under a headline; max 60ch.
- **Body** (regular, 16 → 15 px, 1.375): prose, max 68ch.
- **Small** (regular, 14 px, 1.43): meta lines, price examples, footer links.
- **Label** (medium, 13 px, 1.4): form labels, badges. **Eyebrow** (medium, 10 px, 1.5, +0.05em, UPPERCASE): the only tracked style; optional, above a display number.
- **Nav** (regular, 14 px, 1.0): market links; **settings tabs** (medium, 13 px).

### Named Rules
**The Ramp-Scale Rule.** Heading sizes are 64 / 48 / 40 / 28 / 24; body 18 / 16 / 14 / 13; nothing in between is authored. Clamps interpolate to 40 / 34 / 28 / 22 / 20 at 390.
**The Two-Tone Rule.** A long headline may split into ink + hushed (60 % opacity) spans; the text stays one verbatim string.
**The Single-Weight Rule.** No `font-weight` other than 400; emphasis switches cut or size. **Letter-spacing** is 0 everywhere except the eyebrow.
**The Sentence-Case Rule.** Headings, nav, buttons sentence case; captured uppercase strings (OM OSS, SNARVEIER, BSU) stay as captured.
**Numerals** are tabular in prices, rate examples, tables and phone numbers.

## Layout

- **Container** 1440 px max with 64 px gutters → 1312 px content (32 px gutters ≤ 1320, 16 px ≤ 767). Prose caps at 68ch.
- **Grid** 12 columns, **6 px gutters between cards** (the only card spacing). Bento spans: hero = router 12 over campaign 5 + photo 7; products 3×4; membership 2+4+2+4; news 4×3; index 4+4+4; channels 5-up. Tablet (≤ 1024) halves spans; mobile (≤ 767) stacks.
- **Full-width budget** ≤ 30 % of a page's sections, minor rows only (`.full-bleed`, 6 px from the viewport edge). Home: the membership row (1 of 8).
- **Breakpoints** 640 · 767 · 1024 · 1140 (nav collapse) · 1320 (gutter step).
- **Rhythm** 64 px between movements (48 on tablet and mobile); 24 px between the header and the hero; inside a card 48/36 padding (40/28, 36/20), 10 px between stacked elements, 16 between paragraphs, 24 above an action.
- **Page skeleton** sticky header (32 + 80 px) → router (home: hero tile; elsewhere: contained Vann band under the header) → H1 movement → content movements as bento rows → Sand-70 contact band with five channel cards → Fjell footer grid.
- **Mobile-first** every card is authored at 390 first (single column, photo above text, full-width large buttons) and gains spans upward.

## Elevation & Depth

Flat, always. Depth is a fill: Sand-70 / Frost-30 / Syrin-30 cards on white, Fjell and Vann as dark cards, Sand-70 as the contact band, Fjell as the footer. No shadow at rest, no shadow on hover; the hover response is a fill change, not elevation.

### Named Rules
**The Fill Rule.** A card is a fill with 2 px corners; it never has a border, a shadow or an inner card. A white card exists only on a tinted band (channels on Sand-70).
**The Hover-Step Rule.** Hover/focus-within deepens the fill one brand step (Sand-70 → Sand, Frost-30 → deeper Frost, Syrin-30 → Syrin-70) over 350 ms; nothing lifts.
**The Disabled Rule.** A disabled control is Lysgrå ground with Koksgrå text (≥ 8:1); `cursor: not-allowed`, opacity untouched.

## Shapes

- **Cards / papers** 2 px corners (Danske). **Buttons and inputs** 6 px (Ramp). **Icon circles** round (48 px). **Badges** 6 px.
- **Photography** rectangular, bleeding to the card edge at 16:9 (news, campaign photo cell); a stand-alone `.photo` is 3:2 with 2 px corners. Type never sits on a photograph.
- **Illustrations** (flat spot illustrations, the alliance landscape) sit directly on the fill, unmasked, `aria-hidden`; the landscape sits behind the router content at full card width.
- **Icons** thin-line FFE icons, 1.8 px stroke, Vann on Frost-30 circles (invert to white on Vann on hover/open); chevrons are 1.5 px CSS borders that slide 4 px on hover.
- No pills, no large radii, no side stripes, no cut-outs.

## Components

### Buttons
- **Shape:** 6 px radius, no border, SpareBank1-medium 16 px, line-height 1, padding 14 × 16 (≈ 44 px); **large** 17 × 20 (≈ 50); **nav** 14 px, 10 × 16 (≈ 34). Text fits tight; the box grows from padding, never from a fixed height.
- **Primary:** Vann fill, Hvit text; hover Fjell. **Action (reserved):** Skog fill, Hvit; hover `#095139`; one per module. **Secondary:** Frost-30 fill, Fjell text, no outline; hover Frost-70. **On dark:** Hvit fill, Fjell text; hover Frost-30.
- **Arrow link:** Vann text, no underline, 7 px chevron that slides 4 px on hover; used for card link lists and "Se alle banker".
- Transitions 300 ms `cubic-bezier(.4,0,.2,1)`; focus ring 2 px Vann at 2 px offset; no transform on hover or active.

### Links
Vann, underlined 1 px at .14em, hover Fjell. Inside cards the title is the link and covers the whole card (`.cover-link`); secondary links inside the card sit above the cover.

### Cards
- **Construction:** `.card` = fill + 2 px radius + `overflow:hidden`; `.card-body` 48/36 padding; optional `.card-image` bleeding 16:9 on top. Fills: `--tint` Sand-70 (default), `--frost`, `--syrin`, `--dark` (Fjell), `--white` (only on tinted bands).
- **Content order:** image → illustration (72 px, left) → title (Title 24, link) → body / link list (arrow links, 8 px pitch) → meta (Small, Koksgrå) → action.
- **Hover:** fill steps one tint; title underline draws in (1 px, 400 ms) and turns Vann; illustration springs (−6 px, −3°, overshoot); image scales 1.04 over 700 ms. Whole card is the link when it carries one action.
- **Bento cells:** cards are grid items with explicit spans; equal heights per row; a dark tile (router) or a photo cell may span rows.

### Inputs / Fields
6 px radius, no border, 48 px tall, 16 px padding, Hvit fill (Sand-30 with a 1 px Lysgrå inset ring on tinted surfaces); label above in SpareBank1-medium 14 px. Focus 2 px Vann ring (Frost on Vann). Error: Bær ring + icon, helper text Svart.

### Badges
6 px, Frost-30 fill, Fjell text, Label 13 px medium, 28 px tall; linked badges turn Vann / Hvit on hover.

### Callouts
Sand-70 sheet with the Sol bulb (`.callout`); Frost-30 with the Vann info glyph (`.callout.info`). 2 px radius, 68ch max.

### Video frame
16:9 Frost-30 frame (`.video-frame`), 2 px radius, Vann play glyph; iframe when a captured src exists.

### Navigation
- **Header (system role):** settings bar 32 px on Sand-70 with the audience tabs (active = white block, 13 px medium) → main bar 80 px white: logo (36 px tall), nine market links (14 px, 20 px gaps), tools right (Bli kunde text 14 px · search glyph · Logg inn Skog nav button). `position: sticky`; hides on scroll-down, reveals the main bar only on scroll-up. ≤ 1140: 68 px bar with logo, Logg inn and a "Meny" toggle (three bars + label) opening a fixed panel: Sand-70 top area with a search row, uppercase audience strip, 45 px market rows with chevrons, Bli kunde row on Sand-30.
- **Alliance router (system role `bank-router`):** a Vann card. Home: `router--tile`, full bento row, centred heading (Headline-M) · lede · label · 220 px input · white button · "Se alle banker" arrow → 12-bank list inside the tile; landscape illustration behind at full width. Elsewhere: `router--band`, contained under the header (6 px gap), heading + lede left, input + button middle, arrow link right, landscape at 55 % opacity right.
- **Back-link:** Vann arrow link, Small, above the H1.
- **Contact band + footer (system role):** Sand-70 band, 64 px padding: "Kontakt oss" (Headline-M) left, "Gå til kundeservice" primary large button right, five white channel cards (icon circle 48, name 18 medium, sub Small, chevron; details open in-card). Footer: Fjell, 64 px padding, grid 230 px logo column (white logo) + five-column link grid (headings 16 medium, links 14 with 28 px pitch, underline draws in) + legal row 12 px in the same grid. Mobile: stacked, 48/24/60 padding.

### Feedback strip
Sand-70 sheet, 2 px radius: "Hva synes du om denne siden?" (Title) + two secondary buttons with thumb glyphs.

### FAQ accordion
`<details>` per question, question in Title 24 Fjell, 24 px Vann chevron rotating, answer Body 68ch, hairline rows (`rgba(0,39,118,.12)`), "Se flere spørsmål og svar" as an arrow link.

### Signature: the Bento
The recognisable move is the row: asymmetric spans, 6 px gutters, one dark or photographic cell per row at most, the alliance landscape in the Vann cell. One photograph per row; photos never carry type.

## Do's and Don'ts

### Do:
- **Do** compose every content section as a bento row of cards with explicit spans and 6 px gutters; keep the 1312 px column; go full width only for minor rows and never for more than 30 % of the sections.
- **Do** set headings on the Ramp scale (64 / 48 / 40 / 28 / 24) in the title face at 1.0–1.14 leading; body 16/1.375 at ≤ 68ch; use the two-tone split for long headlines.
- **Do** give every card one fill (Sand-70 default), 2 px corners, no border, no shadow; bleed photos to the edge at 16:9; keep illustrations flat on the fill.
- **Do** give every module one action in a 6 px borderless button; Skog only for Logg inn / Bli kunde / apply flows; arrow links for lists.
- **Do** keep the router as a Vann card in the first viewport (tile on home, band elsewhere) with its landscape.
- **Do** make hover mean something: fill step, underline draw-in, spring, breathe, drift — and mirror it on focus-within, off under reduced motion.
- **Do** keep every captured word, link, image and FAQ verbatim.

### Don't:
- **Don't** use shadows, borders, `<hr>` dividers, pills or radii above 6 px; **don't** nest cards.
- **Don't** set type over a photograph, use gradients, glass, or a dark page ground; dark is a card, never the page.
- **Don't** use any `font-weight` other than 400, uppercase beyond the eyebrow and captured strings, or letter-spacing beyond the eyebrow.
- **Don't** introduce colours outside the FFE palette or use Skog / Bær / Sol outside their reserved roles.
- **Don't** let more than one cell per row be dark or photographic; **don't** put the main content in a full-width row.
- **Don't** transform buttons on hover; the fill darkens, nothing moves.
