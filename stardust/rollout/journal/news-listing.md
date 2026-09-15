# news-listing — EDS conversion journal (Worker C, story group)

- 2026-09-15 · `article-header` → h1 as default content + `cards (featured)` [photo][h2 link, meta]; `card-rail` (family override) → `cards (listing)`; `button-row` → plain link paragraph, style `flush-top, more-link` (CSS paints the canon chevron).
- cards.js additive: `featured`/`listing` variants in the GRID/ITEM maps; a meta paragraph may hold several <em> (tag · date). Group CSS is @imported before the block rules, so overrides of equal specificity must carry the block class (`.cards.listing …`).
- Body identical to the prototype at 1440 and 360 (Δh exactly the −252 px footer). Gate FAILS only on the lead's frontend footer — eds-requests story #1.
- Lint 0 🔴/0 🟡, delivery 0 P0-P1 (1 P2 cross-origin img). EW 64/64 editable. No siblings.

## Round 01 (2026-09-15, story group)
- `article-header` → h1 + `hero (featured)` (Sand-70 link card 5 with the h2-m title as cover link + meta, photo card 7), style `featured` (24 px top); `card-rail` → `cards (news grid-3)` (the grid-N token from the prototype's ul); `button-row` → `<em>` secondary button, style `more-link` (24 px top, centred, 17/20 padding). No cards.js/hero.js change needed.
- Gate: 1440 0.02 % / Δh 0 · 360 2.58 % / Δh −13 — the 360 delta is entirely `/footer-frontend-om-oss-2` (778 px in the prototype, 790 px on EDS; footer y 11273/11274, body identical) → footer crop 97.67 %. Filed in eds-requests.md § story — news-listing · campaign-landing. Lint 0 🔴 / 0 🟡, delivery 0 P0/P1 (28 P2 cross-origin img), EW 64/64. No siblings.
