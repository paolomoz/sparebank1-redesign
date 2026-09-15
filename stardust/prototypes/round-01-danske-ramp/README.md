# Round 01 — home page prototype: Danske Bank structure × Ramp typography, SpareBank 1 brand

**Open:** `home.html` (A) · `home-b.html` (B) · `home-c.html` (C) (self-contained; fonts from `../fonts/`, images from the live CDN).
**Build:** `python3 build.py` → `home.html`; `python3 build.py --variant b` → `home-b.html` (same fragments and stylesheet; variant rules are scoped to `body.variant-b`).
**Brief (Paolo, 2026-09-15):** from https://danskebank.dk/privat take card design, bento design, margin between cards, border corners,
header and footer layout; from https://ramp.com take typography (not fonts), page width, button styling; keep SpareBank 1 fonts,
colours and full content IA fidelity.

## What was measured (Playwright, 1440 + 390) → `refs/`
- `refs/danske/SPEC.md` — header 32 px settings bar + 80 px main bar, sticky hide-on-down / reveal-main-bar-on-up; cards = fill only,
  2 px radius, no border, no shadow, 6 px visible gutters (3 px insets), images bleed 16:9, content padding 48/36; rows 4+8, 2+4+2+4,
  3×4, offset-1+10; dark footer padding 64, grid 230 px logo column + 5 × 196 columns gap 20, legal text 12/16 in the same grid.
- `refs/ramp/SPEC.md` — container 1440 with 64 px gutters (1312 content; 16 at 390); one weight; 64/48/40/28/24 headings,
  18 lead, 16/14/13 body, 10 px uppercase eyebrow; display leading 1.0–1.05, body 1.375; two-tone headlines (ink + 60 % hushed);
  buttons radius 6, no border, padding-driven height (nav 14 px/34 h, standard 16 px/43 h, large 16 px/51 h), darken on hover, 300 ms.

## Mapping (source order preserved, every text / href / image verbatim)
| SB1 section | composition |
|---|---|
| header | Danske two-tier: Sand-70 settings bar with audience tabs (active = white block) · white 80 px bar: logo, 9 market links 14 px, tools (Bli kunde text, Søk icon, Logg inn Skog nav button). ≤1140: 68 px bar, Logg inn, "Meny" toggle → fixed panel (search row, uppercase audience strip, 45 px rows with chevrons, Bli kunde). Sticky hides on scroll-down, reveals main bar only on scroll-up. |
| bank-router + campaign | hero bento 4 + 8: dark Fjell router tile (two-tone headline, postcode form, "Se alle banker" details, landscape illustration at the foot) + split card (photo left half bleeding, Syrin-30 text half with 48 px headline and Skog large button). |
| products (6) | 3 × 2 Sand-70 text-teaser cards: illustration 72 px, 24 px title, arrow links. |
| membership (2) | Danske 2+4+2+4 row: Frost-30 illustration tile + teaser, Syrin-30 LO logo tile + teaser; Frost-30 secondary buttons. |
| news (4) | centred 48 px heading + 4 image-top cards (16:9 bleed). |
| index + compare | 4+4+4: OM OSS, SNARVEIER (arrow lists), Sammenlign priser on Frost-30. |
| contact | Danske pre-footer band (Sand-70): heading + Vann button right; 5 white channel cards (details) with Frost-30 icon circles. |
| footer | Fjell, padding 64, 230 px logo column + 3 of 5 columns (16 px headings, 14 px links, 28 px pitch), legal row 12 px in the same grid. |

Card gutter 6 px everywhere; card radius 2 px; button radius 6 px; page ground white; card fills Sand-70 / Frost-30 / Syrin-30 / Fjell / white.

## Hover system (added 2026-09-15, second pass)
Danske has no card hover; Paolo asked for distinctive ones. Rules, all hover + focus-within, all off under reduced motion:
- **Fill deepens one brand tint step**: Sand-70 → Sand on product / promo / news / index cards, Syrin-30 → Syrin-70 on the campaign, Frost-30 → deeper Frost on the compare card.
- **Title underline draws in** left-to-right (1 px, 400 ms) and the title turns Vann; the arrow chevron slides on its own link.
- **Illustrations spring**: product spot illustrations lift 6 px and tilt −3° with an overshoot curve; the membership art tile reacts to its sibling teaser (`:has(+ .promo:hover)`) by scaling 6 % and deepening its fill.
- **Photos breathe**: news and campaign photos scale 3–4 % over 700 ms inside the clipped card.
- **Landscape drifts**: hovering the router tile slides the alliance landscape 12 px left and brings it to full opacity.
- **Channel cards**: the icon circle inverts to Vann with a white icon and scales 8 %, the chevron nudges, the name turns Vann.
- **Cover links**: product titles, news titles, promo buttons and the campaign button cover their whole card (`.cover-link::after`), so hovering anywhere on the card lights the action; secondary links sit above the cover.
- Hero seam: the row is `align-items: stretch`; it only releases to `start` while the bank list is open (`:has(#alle-banker[open])`).

## Hero v2 (2026-09-15, third pass)
- Hero is its own **full-bleed** bento (6 px from the viewport edge, Danske G0 style), separated from the product grid by the 64 px section rhythm.
  Router card 7 cols on Vann with the alliance landscape behind centred content (as on the live band); campaign photo 5 cols spanning both rows;
  campaign text card 7 cols on Frost-30 (two-column: headline · copy + action). Tablet: router full width, photo 4:3 + text side by side. Mobile: stacked.
- Campaign content is the **personalised slide Paolo saw live** ("Noe som gnager litt? 🦫", beaver photo) — it is not in the server HTML or the capture, so the
  photo is cropped from his screenshot (`assets/campaign-beaver-from-screenshot.jpg`, to be replaced by the DAM asset) and `content-check` now reports
  2 texts + 1 image as differing from the capture by design ("Se hva du kan spare!", "Refinansier …", `Refinansiering_Hand_med_skjerm.jpg`).
- **Full-width sections: 2 of 8** (hero, news) = 25 %, within the 30 % cap. Everything else stays in the 1312 px container.

## Variant B (2026-09-15, fourth pass)
- Hero: the Vann router band spans the **full width** (12 cols); below it, on one row, the campaign text card (5 cols, Frost-30) and the photo (7 cols) — asymmetric, photo landscape so piano, man and beaver all show.
- **Full-width sections: hero + membership** (the two minor promo blocks in a 2+4+2+4 row) = 2 of 8. News returns to the 1312 px container.
- Tablet and mobile share variant A's rules (router full width, photo + text; then stacked).

## Variant C (2026-09-15, fifth pass)
- As B, but the hero bento sits **inside the 1312 px container** (24 px below the header) instead of full width. Membership stays the only full-width section (1 of 8).

## Gates (2026-09-15)
- `content-check.mjs` — 98 texts, 222 hrefs, 15 images checked; the only 3 misses are the intentional live-slide swap above (`validation/content-check.json`).
- `validate-prototype.mjs` PASS — 0 P0/P1 at 1440/768/390; P2 advisory: arrow links 23 px tall at 390 (`validation/`).
- No horizontal overflow at 390; menu open/close + Escape; sticky header verified (−112 px on scroll-down, −32 px on scroll-up).

## Screenshots → `shots/`
`r1-1440.png`, `r1-390.png` (full page), `s-*.png` (hover, bank list open, channel open, menu open, header at 1280/1100/1024/768),
`baseline-proposed-1440.png` (previous prototype) and `original-live-top.png` (live site) for comparison.

## Known simplifications
- Footer columns do not collapse to accordions on mobile (Danske does); they stack.
- The open bank list and open contact panels grow their own card (row is `align-items: start`), not a full-width panel.
- Contact panel content (12 banks × numbers) is dense inside a 250 px card at 1440.

## Promotion into the stardust pipeline (2026-09-15)
Variant C is now the canon. Changed: `stardust/direction.md` (new active direction, reference→aspects), `DESIGN.md` + `DESIGN.json`,
`stardust/scripts/proto/chrome.mjs` (tokens, base CSS, header, router band/tile, contact band, footer, sticky script),
`pages/nb-bank-privat-html.mjs` (canon author, variant C from captured data), `pages/nb-bank-privat-lan-boliglan-html.mjs` (product
archetype + shared sibling card helpers), `extract-canon.mjs` (pinned/moves data, rendering refresh). Canon regenerated in
`stardust/canon/`. Build any page with `node stardust/scripts/proto/build.mjs <slug>`; gates: `validate-prototype.mjs`, `content-check.mjs`.
Backups of the round-0 home prototype and chrome: `_round0-home-proposed.html`, `_round0-chrome.mjs`.
Status: home + boliglån approved in the new language; the other 11 archetypes build and pass content-check on the new chrome but keep
their round-0 page CSS until re-crafted (borettslag has a 360 px overflow in that legacy CSS).
