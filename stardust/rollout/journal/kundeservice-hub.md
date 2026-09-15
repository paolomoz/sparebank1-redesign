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

## 2026-09-15 — round 01 (bento card language) EDS conversion — E4
- Approved round-01 prototype re-migrated (Path A) and converted through the hub encoders rewritten for bento markup: `ul.bento[data-slot] > li.card` → `cards (<variant> cols-N)` via `bentoRows`/`hubCards` (one row per card, authored order), `div.bento.hero-bento` → `hero (hub …)`, `li.card.promo` → `cards (promo [promo-2])`, `full-bleed` from `data-layout="full-bleed-grid"`; section tokens `stack` (6 px between blocks), `bento-top`, `head-centered`, `shortcuts`, `prose-hub`, `figure` (styles-hub.css). All group CSS is scoped to the template body classes (coordinator note) and imported before the base, hence the extra specificity.
- Round-0 group variants were reset; only what these archetypes needed was re-added (blocks/{cards,hero,columns,callout,feedback,accordion}/*-hub.css).
- Traps met: an empty first hero cell makes hero.js drop the text cell (author one cell when there is no media); `display: grid` on a list item splits its inline `<strong>` runs (counter is now an absolute ::before); variant tokens `title`/`small` collide with the canon `.title`/`.small` compounds (renamed `text-only` / `icons spot`); `aspect-ratio: auto` on an authored image discards the UA attribute ratio (`revert-layer`); the base fills hero/split photo cells absolutely at ≤ 767 only — hub heroes fill on desktop too (prototype `.media-photo`), tiles/portraits opt out at ≤ 1024.
- Results: see eds-progress/kundeservice-hub.json (1440 and 360 pixel/Δh pass; open chrome/gate-instrument items in eds-requests.md § hub — round 01).
