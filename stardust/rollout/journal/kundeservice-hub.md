# kundeservice-hub — EDS conversion journal (worker E4, hub group)

## Decisions
- `hero-ask` → `hero (ask)`: row 1 [photo][h1 · h2 · lead · line], row 2 [field label + note][button label] (two cells like row 1 — D3). hero.js (additive): `ask`/`portrait` move the h1 into its own `.hero-h1` grid child (phone: h1 beside the photo); `ask` builds the disabled chat form from row 2 (dynamics #6 interim). The textarea placeholder repeats the label (@ew-exempt, derived). The tool tiles follow as `cards (tools)` in the same section; a trailing link under the tiles (bedrift hub) is kept as default content.
- `faq` → `accordion (faq wide rate)` in a `faq-aside` section grid (sticky h2 4/12, list 8/12). `rate` = the per-answer "Var dette nyttig?" Ja/Nei row rendered by accordion.js as block chrome (@ew-exempt labels, dynamics #5 interim) before the trailing read-more link. `.cols` sub-columns are flattened to prose (D2). The "Se også" lines become a link list.
- `topic-tiles` → `cards (topics)` [icon][link] (own encoder: `cardRows` duplicated the icon for title-less items). Promo pair → `columns (promo promo-2 invites)`.

## Findings
- Gate: 1440 0.04 % / Δh 0 · 360 0.01 % / Δh 0 · header 99.96/99.66 · footer 99.89/100 · content-diff 0 🔴 · EW dead 0 / dup 0 / exempt 1 · lint 0 🔴 · delivery 0 P0/P1.
- 1 sibling (bedrift kundeservice) converted, gaps 0, lint clean, content-diff 0 structural 🔴; eyeballed at 1440/360 (hero, tools, figure, FAQ, callout, topics, promos all present; grids intact).
- `grid-area` followed by `grid-row: auto` resets the placement — cost one iteration (hero-hub.css).
- The lead → note gap is the canon `p + p` 16 on top of the hero-text grid gap (32 total): only visible at 360 where the text stack is taller than the photo.

## Open questions
- boost.ai chat (dynamics #6) and the per-answer rating (dynamics #5) stay static shells until the owner decides.
