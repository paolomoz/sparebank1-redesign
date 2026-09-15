# Ramp — ramp.com — structural reference spec (typography, page width, buttons)

Captured 2026-09-15 with Playwright/Chromium, 1440x900 and 390x844. Values from getComputedStyle / getBoundingClientRect. Raw data: `measurements.json`. The study agent was interrupted before writing this file; this spec was compiled from its JSON by the orchestrating session.

Fonts are NOT borrowed (Lausanne, single weight 400). Colours are NOT borrowed. What we borrow: the scale, weights, leading, tracking, measure, alignment and hierarchy; container widths and paddings; button geometry and behaviour.

## 1. Typography (1440 → 390)

| role | 1440 size/lh (ratio) | 390 size/lh | tracking | case | max-width | align | margin-below |
|---|---|---|---|---|---|---|---|
| h1 hero (headline-xl) | 64/64 (1.00) | 40/42 | ≈0 (−0.0002em) | none | 1050 px | left | 0 (lead follows at 16–24) |
| lead / hero subcopy (body-l) | 18/24 (1.33) | 17/23 | 0 | none | 531 px (≈60ch) | left | 0 |
| eyebrow (hero) | 10/15 | 10/15 | +0.05em | UPPERCASE | — | left | — |
| h2 headline-l | 48/50 (1.04) | 34/38 | ≈0 | none | 960 px | centred (section heads) | 32 |
| h2 headline-m | 40/42 (1.05) | 28/32 | ≈0 | none | 755 px | left | 0 |
| h2 headline-s | 28/32 (1.14) | 22/26 | 0 | none | 656 px | left | 32 |
| h3 card headline-xs | 24/28 (1.17) | 20/24 | 0 | none | 300 px | left | 0 |
| stat number | 64/64 | 40/42 | ≈0 | — | — | left | — |
| body-xl | 20/26 (1.30) | 18/22 | 0 | | | | |
| body-m (primary / intro / quote) | 16/22 (1.38) | 15/21 | 0 | | 533–540 px | left (intro centred) | 24 |
| body-s (muted / dark) | 14/20 (1.43) | 14/20 | 0 | | | | |
| body-xs | 13/19 | 12/18 | 0 | | 768 | centred | |
| nav item / nav link | 14/14 | — | 0 | none | | | |
| footer link | 14/20 | 14/20 | | | | | 16 |
| text link with arrow | 16/24 | 16/24 | | | | | |

Hierarchy facts: one weight (400) everywhere; hierarchy is carried by size, leading and a two-tone colour split (primary ink vs "hushed" = primary at 60 % opacity) inside the same headline ("Join 70,000 … companies" primary, the rest hushed). h1 : body = 4 : 1. Display leading 1.0–1.05, body 1.38. Headlines left-aligned except centred section heads (headline-l). No letter-spacing games: tracking is effectively 0 at all sizes; the eyebrow is the only tracked/uppercase style.

## 2. Page width

| | 1440 | 390 |
|---|---|---|
| container max-width | 1440 (`max-w-screen-2xl`) | — |
| side padding | 64 (`xl:px-16`; 48 at lg, 32 at md, 16 at base) | 16 |
| content width | 1312 | 358 |
| header inner | same container; header fixed, 62 px bar (+40 px announcement banner) | 62 px bar (+70 banner) |
| hero | background full-bleed, content contained in 1312; media frame 1312 wide, aspect 1312/585, radius 12, 1px hairline | |
| two-column grids | 644 + 644, gap 24 | 1 col |
| footer grid | 6 × 198.7, column gap 24, row gap 48 | 1 col |
| section spacing | `spacer-l` 128 between major sections, `spacer-m` 64 inside | 80 / 40 |
| hero vertical padding | 64 / 64 | 32 |
| h2 → content | 32 | |
| paragraph → paragraph | 24 | |

## 3. Buttons

Shape: **6 px radius** (`rounded-md`), **no border** (0), no shadow, weight 400, tracking 0, text vertically centred with a *tight* line-height (10.4–10.8 px on 14–16 px type) so the box height comes from padding, not from line-height.

| variant | font | padding | height | fill role | text | hover |
|---|---|---|---|---|---|---|
| nav primary ("Get started") | 14 | 12 × 16 | 34.4 | ink (black) | reverse | fill lightens one step (black-800) |
| nav accent ("See a demo") | 14 | 12 × 16 | 34.4 | accent (solar) | ink | accent lighter |
| nav quiet ("Sign in") | 14 | 12 × 16 | 34.4 | transparent / 5 % | ink | fill → accent |
| nav menu item ("Products ▾") | 14 | 0 × 12, h 44 | 44 | none | ink | colour only |
| hero CTA ("Get started for free") | 16 | 0 × 20, fixed h | 51 (43 at 390) | accent | ink | accent lighter |
| standard accent ("Switch in days…") | 16 | 16 × 16 | 42.8 | accent | ink | accent lighter |
| standard secondary ("View Demo") | 16 | 16 × 16 | 42.8 | grayLight fill, no border | ink | grayMedium |
| large primary ("View Demo" dark) | 16 | 20 × 20 | 50.8 | ink | reverse | ink lighter |
| text link + arrow ("Read the report →") | 16/24 | 0 | 24 | none | hushed | ink; gap 8 to arrow icon |
| icon button (card corner) | — | 0 | 36 × 36 | white, 1px hairline, r 6 | ink | — |

Pairs: primary + secondary side by side, gap 16, same height, left-aligned with the text column (see `button-pair-1440.png`). Transition: `color/background 300ms cubic-bezier(.4,0,.2,1)`. Focus: 2 px ring (`ring-2`) or UA outline 1px offset 1; no transform on hover or active. At 390 the hero CTA goes full-width (358); other buttons keep intrinsic width, font drops to 15.

Cards (for reference only, not borrowed): platform cards 644 × 483, radius 12, 1px hairline, grayLight fill; stat tiles grid with 1 px gaps inside a 12 px-radius frame.

## 4. Files
`full-1440.png`, `full-390.png`, `hero-1440.png`, `hero-390.png`, `type-*.png` (hero h1+subcopy, section h2+intro, headline-l, headline-s, card title+body, eyebrow, stat tile, footer links; 1440 and 390), `button-*.png` (each variant at rest and hover; `button-pair-*.png`, `button-nav-group-*.png`, `button-focus-ring.png`), `measurements.json`.
