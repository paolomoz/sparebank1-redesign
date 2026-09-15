# tool — EDS conversion journal (worker E4, hub group)

## Decisions
- `steps` → `columns (split steps)`: one row [h2 + ol + paragraph + action pill + small note][illustration]. columns.js (additive): in `steps` the CTA keeps its authored place (`cta-row` wrapper in place) instead of collecting at the end. The `<li>` is a padded box with an absolutely positioned counter badge — a grid `<li>` split the inline runs (`<strong>`) into separate grid items.
- `page-title` → default content with `intro, tool-intro` (48 px under the lead, 20ch h1 / 52ch lead); intro-media siblings use the shared `hero (intro)`.
- `callout` → `callout (tip rich)` (28 px glyph grid, h3 sub-heading rhythm); `split-media` reopen → core `columns (split reopen)` + hub rules (body-size copy, 96 px photo radius, CTA on the 16 px gap).
- `calculator` on sparekalkulator is an empty React mount (dynamics #8) → module omitted with a note (no authored content). `currency-converter` → new block `converter` (blocks/converter: [label][value] rows + rate + note, controls disabled, dynamics #9) + `table (disclose)` for the rate list (row 1 = toggle label, row 2 = heading, then header + rows). `disclosure` tables (iban) use the same `table (disclose)`.

## Findings
- Gate: 1440 1.07 % / Δh 1 · 360 2.15 % / Δh 1 · header 99.96/99.66 · footer 99.89/100 · content-diff 0 🔴 · EW dead 0 / dup 0 / exempt 1 · lint 0 🔴 · delivery 0 P0/P1.
- 5 siblings converted, gaps 0, lint clean. Sampled valutakalkulator: content-diff 0 structural 🔴, eyeballed at 1440/360 (intro hero with illustration, converter, disclose pill, FAQ, feedback).
- The two approved prototypes disagree on the rich callout at 360: sperre-kort compacts it (24 px glyph, 16 px padding), kontakt keeps the desktop padding — scoped via `main .section.quick` for the kontakt case.

## Open questions
- Sparekalkulator has no captured content at all; the page ships without the widget until the owner supplies the shell (dynamics #8).

## 2026-09-15 — round 01 (bento card language) EDS conversion — E4
- Approved round-01 prototype re-migrated (Path A) and converted through the hub encoders rewritten for bento markup: `ul.bento[data-slot] > li.card` → `cards (<variant> cols-N)` via `bentoRows`/`hubCards` (one row per card, authored order), `div.bento.hero-bento` → `hero (hub …)`, `li.card.promo` → `cards (promo [promo-2])`, `full-bleed` from `data-layout="full-bleed-grid"`; section tokens `stack` (6 px between blocks), `bento-top`, `head-centered`, `shortcuts`, `prose-hub`, `figure` (styles-hub.css). All group CSS is scoped to the template body classes (coordinator note) and imported before the base, hence the extra specificity.
- Round-0 group variants were reset; only what these archetypes needed was re-added (blocks/{cards,hero,columns,callout,feedback,accordion}/*-hub.css).
- Traps met: an empty first hero cell makes hero.js drop the text cell (author one cell when there is no media); `display: grid` on a list item splits its inline `<strong>` runs (counter is now an absolute ::before); variant tokens `title`/`small` collide with the canon `.title`/`.small` compounds (renamed `text-only` / `icons spot`); `aspect-ratio: auto` on an authored image discards the UA attribute ratio (`revert-layer`); the base fills hero/split photo cells absolutely at ≤ 767 only — hub heroes fill on desktop too (prototype `.media-photo`), tiles/portraits opt out at ≤ 1024.
- Results: see eds-progress/tool.json (1440 and 360 pixel/Δh pass; open chrome/gate-instrument items in eds-requests.md § hub — round 01).
