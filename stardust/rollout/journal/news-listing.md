# news-listing — EDS conversion journal (Worker C, story group)

- 2026-09-15 · `article-header` → h1 as default content + `cards (featured)` [photo][h2 link, meta]; `card-rail` (family override) → `cards (listing)`; `button-row` → plain link paragraph, style `flush-top, more-link` (CSS paints the canon chevron).
- cards.js additive: `featured`/`listing` variants in the GRID/ITEM maps; a meta paragraph may hold several <em> (tag · date). Group CSS is @imported before the block rules, so overrides of equal specificity must carry the block class (`.cards.listing …`).
- Body identical to the prototype at 1440 and 360 (Δh exactly the −252 px footer). Gate FAILS only on the lead's frontend footer — eds-requests story #1.
- Lint 0 🔴/0 🟡, delivery 0 P0-P1 (1 P2 cross-origin img). EW 64/64 editable. No siblings.
