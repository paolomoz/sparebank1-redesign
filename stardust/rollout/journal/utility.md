# utility — EDS conversion journal (worker E4, hub group)

## Decisions
- `hero-portrait` → `hero (portrait)`: 340 px circle portrait, h1 in its own grid child (phone: h1 beside the portrait, leads under), two leads (lead-wrap + note-wrap both lead size), secondary pill.
- `bank-table` → new block `table` (Block Collection): first row = header, variant `directory` = first column as `<th scope="row">`, phone numbers stay `tel:` links; the section style `directory` lays out h2 (sticky, 3/12) beside table + partners prose (9/12). The partners block is default content after the table (h3 + two links).
- `address-block` → DEFAULT CONTENT: one paragraph per pair `<strong>Term</strong><br>lines`, section style `address` (4-column ledger, 2 on tablet, 1 on phone). No key/value block for displayed copy (D14).
- `callout` quick → `callout (tip rich)` with the section style `quick` (48 px top, flush bottom).

## Findings
- Gate: 1440 0.26 % / Δh 0 · 360 0 % / Δh 0 · header 99.96/99.66 · footer 99.89/100 · content-diff 0 🔴 · EW dead 0 / dup 0 / exempt 0 · lint 0 🔴 · delivery 0 P0/P1.
- 1 sibling (prisliste) converted, gaps 0, lint clean, content-diff "content + roles match", eyeballed at 1440/360.
- Section-as-grid styles (`directory`, `faq-aside`) need `row-gap: 0` — the default `gap` stacked on the partners' 48 px margin (16 px twice).

## Open questions
- None.

## 2026-09-15 — round 01 (bento card language) EDS conversion — E4
- Approved round-01 prototype re-migrated (Path A) and converted through the hub encoders rewritten for bento markup: `ul.bento[data-slot] > li.card` → `cards (<variant> cols-N)` via `bentoRows`/`hubCards` (one row per card, authored order), `div.bento.hero-bento` → `hero (hub …)`, `li.card.promo` → `cards (promo [promo-2])`, `full-bleed` from `data-layout="full-bleed-grid"`; section tokens `stack` (6 px between blocks), `bento-top`, `head-centered`, `shortcuts`, `prose-hub`, `figure` (styles-hub.css). All group CSS is scoped to the template body classes (coordinator note) and imported before the base, hence the extra specificity.
- Round-0 group variants were reset; only what these archetypes needed was re-added (blocks/{cards,hero,columns,callout,feedback,accordion}/*-hub.css).
- Traps met: an empty first hero cell makes hero.js drop the text cell (author one cell when there is no media); `display: grid` on a list item splits its inline `<strong>` runs (counter is now an absolute ::before); variant tokens `title`/`small` collide with the canon `.title`/`.small` compounds (renamed `text-only` / `icons spot`); `aspect-ratio: auto` on an authored image discards the UA attribute ratio (`revert-layer`); the base fills hero/split photo cells absolutely at ≤ 767 only — hub heroes fill on desktop too (prototype `.media-photo`), tiles/portraits opt out at ≤ 1024.
- Results: see eds-progress/utility.json (1440 and 360 pixel/Δh pass; open chrome/gate-instrument items in eds-requests.md § hub — round 01).
