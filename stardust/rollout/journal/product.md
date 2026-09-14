# product — journal (worker E5, Phase C siblings)

## 2026-09-15 — 29 siblings converted (gaps 0, DM 0 🔴, delivery 0 P0/P1)
- Family encoder `stardust/scripts/eds/encoders/product.mjs`. Every override delegates to the core encoder unless a walker-only shape is present,
  and `prep`/`tidy` are bypassed for the archetype slug — boliglan re-converts byte-identical to the core path (the committed doc differs only
  by HTML entity encoding, which the core path also shows). The lead's `content/nb/bank/privat/lan/boliglan.html` was restored and is untouched.
- Module → block decisions (David's Model):
  - price-terms, shortcuts, topic-list head, rich-text → DEFAULT CONTENT with product tokens `price-terms`, `shortcut-pills`, `topic-list`, `prose-start`.
  - `.cols` editorial columns → `columns (cols cols-N [spot])`; a callout / disclosure inside a column follows the block as its own block (D2);
    a single remaining column is prose (D1); the walker's one-card columns (lånekalkulator) are one `cards (choices cols-4)`.
  - split-media with a YouTube link → NO block: text + plain link as default content, auto-blocked `embed`, `video-split` section grid (D1 red otherwise).
  - `media-right` → `columns (split text-first)` with cells in visual order (the walker flips visually via CSS `order`).
  - disclosures (`<details class="disclosure">`) → `accordion (disclosure)` one row [label][body] — collapsed like the canon, EW7-safe.
  - cobranding (product) is the always-open band → `columns (cobrand)`, not the hub `cobranding` disclosure block.
  - people-cards → `cards (bios cols-4)`; guide-list → `cards (guide)`; steps → `cards (steps)` (title self-anchor dropped, CSS counter).
  - comparison table → `table (compare row-headers)`: the canon expandable detail rows are folded into the cover's row-header cell (no colspan).
- Pre-clean of walker residue: phone-only duplicate CTAs (`.only-phone`, app deep links), login dialogs, carousel chrome, glossary `<button>`s
  (word kept inline). The canon per-question article link (`a.faq-link`, visually-hidden label) is KEPT as the answer's closing link paragraph —
  identical to what the core `faq` encoder does on the LIVE archetype (open question below).
- Bug found and fixed: naming a block variant `illu` collides with the canon compound `.illu { width: 72px; height: 72px }` in styles.css —
  the whole block collapsed to 72 px (hero-grid measured 72 px wide, cards ul columns 8 px). Renamed to `spot`. The same collision is live in
  four other families' documents (see eds-requests.md).
- Verification: content-diff migrated ↔ emulation 0 🔴 on lanekalkulator, vare-eksperter, bankid; eyeballed all three at 1440 + 360;
  archetype gate 1440: 0.74 % / Δh −1 / header 99.96 / footer 99.9 (unchanged). 33 oversize SVGs rasterised to DA media (raster mirror complete).

### Open questions
- `a.faq-link` (hidden in the canon) renders as a visible link paragraph whose text is the question, on the archetype and on every sibling.
  Intentional? If not, the fix belongs in the core `faq` encoder (drop or relabel), not per family.
- `prose-narrow` centres the 68ch wrapper (section `> div` has `margin-inline: auto`); product uses `prose-start` (wrapper full width, children ≤ 68ch).
  If the centring is unintended the core token should change and `prose-start` can retire.
- The `.compare` band ("Sammenlign priser") is centred on every product page for the same reason; the archetype gate passes, so left as is.
