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

# Design System: SpareBank 1 — Rolig og tydelig

## Overview

**Creative North Star: "The Quiet Reading Room of a Local Bank"**

A page reads like a well-set brochure laid open on a white table: one headline in the bank's own title face, a photograph of real people at the size a photograph deserves, a short lead, and one thing to do. The palette is the alliance's own Nordic nature names — Fjell for words, Vann for links and the primary button, Skog for the one action that starts something, Sand and Frost as sheets of tinted paper that mark a change of subject. Nothing floats: no shadows at rest, no card chrome, no dividers; separation comes from tint changes and from space. The alliance's signature — "Vi er flere banker i hele Norge" — is compact, present in every first viewport, and carries its landscape illustration like a maker's mark.

Density is balanced by contract (multi-audience floor): sections breathe at 64 px, but the generosity is spent inside modules — a 68ch measure, 1.55 body line-height, gaps of 24–32 px between cards, one photograph per module, five movements where the captured page had eleven bands. Hierarchy is carried by a strict 1.25 scale on three single-weight faces, so the design never asks bold to do the work. Tone is calm and confident: warmth comes from people and from Sand, not from decoration.

Confirmed rejections (from the captured site and the direction): no card-as-container page scaffolds, no eyebrow labels above headings, no text over photographs, no gradients, no dark-mode reflex, no centered two-button hero.

**Key Characteristics:**
- White paper ground; Sand-30 / Frost-30 / Syrin-30 as alternating paper fields; Fjell as the only dark surface (footer).
- 1.25 modular type scale on SpareBank1 Title-Medium / Medium / Regular; sentence case; one weight.
- Photography at content scale, native 3:2, masked with the brand's large radius on one corner pair.
- One action per module; Skog reserved to the action that starts a relationship or a session.
- Flat: no shadow at rest, hairline (Lysgrå) only where a tint change cannot do the job.
- The alliance router as a compact first-viewport band with its landscape illustration.

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

**Character:** The bank's own humanist sans in three cuts, all weight 400 — hierarchy is size and cut, never bold. The title cut has enough presence at 49–61 px to carry a page on its own; the regular cut is quiet and very legible at 16/1.55.

### Hierarchy
- **Display** (title-medium, clamp 40–61 px, 1.1, −0.01em): one per page at most — the market-landing campaign headline, the campaign-landing H1.
- **Headline** (title-medium, clamp 34–49 px, 1.12): the page H1 on products, hubs, articles, tools.
- **Headline-sm** (title-medium, clamp 28–39 px, 1.15): section H2.
- **Title** (title-medium, clamp 24–31 px, 1.2): H3 / module headings.
- **Title-sm** (medium, 25 px, 1.25): card titles, H4.
- **Lead** (regular, 20 px, 1.5): the lede under an H1/H2; max 60ch.
- **Body** (regular, 16 px, 1.55): prose, max 68ch. FAQ answers, terms, rate examples.
- **Body-strong** (medium, 16 px): inline emphasis, definition terms — replaces `<b>`.
- **Small** (regular, 14 px, 1.45): captions, meta lines, footnotes.
- **Label** (medium, 13 px, 1.4, +0.01em, sentence case): meta lines under card titles (category), form labels, badges. Never above a heading.

### Named Rules
**The 1.25 Rule.** Every step is ×1.25 from 16: 13 · 16 · 20 · 25 · 31 · 39 · 49 · 61. Sizes outside the scale are not authored.
**The Sentence-Case Rule.** Headings, nav, buttons and labels are sentence case (captured: 99 % of headings). The captured all-caps top nav (PRIVAT / BEDRIFT / OM OSS) is rendered sentence case — the labels are the same words.
**The Single-Weight Rule.** No `font-weight` other than 400 is authored; emphasis switches cut (regular → medium → title-medium) or size.
**Numerals** are tabular (`font-variant-numeric: tabular-nums`) in prices, rate examples, tables and phone numbers.

## Layout

- **Container** 1280 px (captured; holds up at 1440), centred, 80 px side margins at ≥ 1440 → 48 px at 1024 → 24 px at 768 → 20 px at 390. Prose columns cap at 68ch inside the container; a hero split is 7/5 (photo/text) on ≥ 1024, stacked photo-first below.
- **Grid** 12 columns, 24 px gutter (32 px at ≥ 1280). Cards: 3-up at ≥ 1024, 2-up at 768, 1-up at ≤ 640; card gap 24 / 24 / 16.
- **Breakpoints** 480 · 640 · 768 · 1024 · 1280 (captured 480/768/1024/1280 plus 640 for the nav collapse).
- **Rhythm** section padding 64 / 48 / 32 (desktop / tablet / mobile — balanced tier, multi-audience floor); inside a module 24–32 px between groups, 8–16 px inside a group; more space above a heading (32) than below it (16).
- **Movements** A page is composed as 3–6 movements, each on its own paper; a movement holds 1–3 modules. The captured `<hr>` dividers are not carried.
- **Page skeleton (every shared-site page)** header (72 px, one row; sticky on mobile only) → compact alliance router (≤ 96 px, Vann paper, first viewport) → back-link → H1 movement (headline + lead + one action; photo beside on ≥ 1024) → content movements → FAQ → feedback strip → "Kontakt oss" channel row → Fjell footer → Natt legal row.
- **Mobile-first** every module is authored at 390 first (single column, 44 px targets, photo above text) and gains columns upward.

## Elevation & Depth

Flat. Depth is tonal — paper changes (Hvit / Sand-30 / Frost-30 / Syrin-30) and the Fjell footer — never shadow at rest. A card is a tinted sheet with 16 px corners; a plain white card on white gets a 1 px Lysgrå hairline. The only shadow is a state response.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 8px 24px -12px rgba(0, 39, 118, 0.25)`): hover/focus-within on a linked card, Fjell-tinted, offset and soft. Removed under `prefers-reduced-motion`? No — shadows are not motion; the 160 ms transition is.
- **Dialog** (`box-shadow: 0 24px 48px -16px rgba(0, 16, 50, 0.35)`): the bank-choice and login dialogs only.

### Named Rules
**The Flat-At-Rest Rule.** Nothing casts a shadow until it is hovered or focused. Cards, bands, inputs and buttons are flat.

## Shapes

- **Photography** carries the brand's large radius on **one corner pair** (top-left + bottom-right at 96 px on heroes, 48 px on cards) — derived from the captured 96 px all-round mask (785 occurrences) and made deliberate. Portraits are circles.
- **Illustrations** (flat four-colour spot illustrations, the alliance landscape) sit directly on paper, unmasked, `aria-hidden`.
- **Buttons** are pills (6em). **Cards / papers** 16 px. **Inputs** 8 px. **Badges** pill. **Dialogs** 24 px.
- **Icons** thin-line FFE icons (captured SVG), 1.5 px stroke, Vann; the contact row keeps its Vann circles (56 px).
- No side stripes, no hard offset shadows, no geometric cut-outs.

## Components

### Buttons
- **Shape:** pill (`6em`), 44 px min height, 12 px 24 px padding, body 16 px in SpareBank1-regular, sentence case.
- **Primary:** Vann fill, Hvit text; hover Fjell; focus 2 px Sol ring at 2 px offset.
- **Action (reserved):** Skog fill, Hvit text; hover `#095139`. One per module. Used for Logg inn, Bli kunde, Søk boliglån, Bli bedriftskunde and every captured `ffe-button--action`.
- **Secondary:** Hvit fill, Vann text, 2 px Vann border; hover Frost-30 fill, Fjell text.
- **Inline / text pill:** transparent, Vann text, no border; hover underline. For "Se alle banker", "Se flere spørsmål og svar".
- **Icon button** (search, burger): 44 px, Vann glyph, visible label at ≥ 768.

### Links
Vann, underlined (2 px offset, 1 px thickness), hover Fjell, visited Lyng. Card links: the whole card is the link; the title carries the underline on hover.

### Cards / Papers
- **Corner Style:** 16 px.
- **Background:** Sand-30 (default, warm), Frost-30 (help / tools), Hvit + Lysgrå hairline (on tinted movements).
- **Shadow Strategy:** none at rest; Lift on hover/focus-within.
- **Content:** photo (3:2, 48 px one-corner-pair mask) or spot illustration → title (Title-sm) → one line (Body) → meta line (Label, e.g. the captured "Tips og råd" category, sentence case) → the card is the link; a chevron is not added.
- **Internal Padding:** 24 px (20 px at ≤ 640).

### Inputs / Fields
- **Style:** Hvit fill, 1 px Lysgrå border, 8 px radius, 12 px 16 px padding, Body 16 px; label above in Label 13 px medium, Svart.
- **Focus:** 2 px Vann border + 2 px Sol outer ring.
- **Error:** Bær border + Bær icon; helper text in Svart (Bær text fails AA at body size); **Disabled:** Grå text on Hvit.

### Badges
Pill, Frost-30 fill, Fjell text, Label 13 px. Used for categories in listings, "Nyhet", tema filters.

### Navigation
- **Header (system role):** one 72 px row on Hvit with a 1 px Lysgrå hairline: logo (180 × 50 captured SVG) · market nav (9 links, Body 16, Fjell, current page marked by a 2 px Vann underline) · right cluster: audience switch (Privat · Bedrift · Om oss as a quiet segmented control, Label 13 medium) · search icon-button · Bli kunde (secondary text pill) · Logg inn (action). Sticky on mobile only (captured behaviour). Collapses to the stock hamburger at ≤ 640 px (`data-nav-collapse="hamburger"`).
- **Alliance router (system role `bank-router`):** Vann paper band, ≤ 96 px on desktop: heading "Vi er flere banker i hele Norge" (Title-sm, Hvit) · lede (Small, Hvit) · postcode input + "Bruk min posisjon" (secondary, Hvit on Vann) + "Se alle banker" (inline, Hvit) · the captured landscape illustration at the right edge on ≥ 1024, hidden < 768 (as captured). Expands to the 12-bank list (CSS-only `<details>` in prototypes; dynamics #1 interim).
- **Back-link:** "‹ Låne" in Vann, Small, 24 px above the H1.
- **Footer (system role):** Fjell paper, Hvit text: "Kontakt oss" channel row (5 Vann-on-Hvit circles) sits above the footer on Hvit; footer columns (Privat / Bedrift · Logg inn · Sosiale medier) in Body 16 Hvit with underline on hover; Natt legal row in Small.

### FAQ accordion (signature module)
`<details>`/`<summary>` per question, question in Title-sm Fjell, chevron 20 px Vann rotating, answer Body 68ch, 1 px Lysgrå hairline between items, "Se flere spørsmål og svar" as inline pill. Open state keeps the question visible; `aria-expanded` via the native element.

### Signature: the Photograph
A photograph is a module's content, not its ornament: rendered at ≥ 560 px wide in heroes (7/5 split), native 3:2, `object-fit: cover` centred, one-corner-pair mask, `alt` verbatim from capture, `loading="eager" fetchpriority="high"` for the first, lazy below. One photograph per module.

## Do's and Don'ts

### Do:
- **Do** set every heading in SpareBank1-title-medium at a 1.25 step (61 / 49 / 39 / 31) with line-height ≤ 1.2; body in regular 16/1.55 at ≤ 68ch.
- **Do** change paper (Hvit → Sand-30 → Frost-30) to mark a movement; keep sections at 64 / 48 / 32 px.
- **Do** give every module exactly one action; Skog only for Logg inn / Bli kunde / apply flows, Vann for everything else.
- **Do** render photographs at content scale (hero ≥ 560 px wide, cards native 3:2) with the one-corner-pair mask; keep spot illustrations flat and `aria-hidden`.
- **Do** keep the alliance router in the first viewport on every page that carried it, compact, with its landscape.
- **Do** keep every captured word, link, image and FAQ; classify every literal as captured-verbatim.
- **Do** theme browser surfaces: `::selection` Frost-30/Fjell, focus rings Sol, tabular numerals in prices.

### Don't:
- **Don't** use shadows at rest, `<hr>` dividers, card chrome, or nested cards.
- **Don't** put an eyebrow or kicker above a heading; category labels go under the title as a meta line.
- **Don't** set type over a photograph, use gradients, gradient text, glass, or a dark page ground.
- **Don't** use any `font-weight` other than 400, uppercase (except captured acronyms like BSU, IPID), or letter-spacing beyond ±0.01em.
- **Don't** introduce colours outside the FFE palette or use Skog / Bær / Sol outside their reserved roles.
- **Don't** center-stack a hero with a two-button pair; heroes are left-anchored 7/5 splits.
