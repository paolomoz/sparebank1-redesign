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
