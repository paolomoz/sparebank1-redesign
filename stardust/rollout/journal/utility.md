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
