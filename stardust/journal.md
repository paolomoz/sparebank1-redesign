# Journal — sparebank1.no redesign (Flow B)

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-09-14T20:50:00Z — Flow B seeded from Flow A's extraction; hands-off activated

**Prompt:** Build the second customer deliverable — a redesigned www.sparebank1.no ("the site looks old") — with the stardust redesign flow in this new sibling project, hands-off, stopping before `migrate`. Reuse Flow A's Phase-1 extraction (never re-crawl).

**Decisions:**
- Project `/Users/paolo/stardust/2026-08/sparebank1-redesign` created (`git init -b main`); `.gitignore` covers `.env`, `.env.*`, `qa/`, `node_modules/`, screenshots and validation PNGs BEFORE the first commit (token hygiene per master SKILL.md § Hands-off mode).
- Seeded `stardust/current/` (100 pages `.json`+`.html`, assets incl. fonts/logo/favicon/clientlib CSS, `_page-types.json` 13 families, `_modules.json` 45 candidates, `_prep-inventory.json`, `_dynamics.json`, `_ffe-tokens.json`, `_brand-extraction.json`, descriptive PRODUCT/DESIGN/DESIGN.json, brand-review.html), `scope/` (sitemaps + census; HTML snapshots ignored), `stardust/dynamic-features.md` + `-plan.md` + `stardust/dynamics/`, and the extract/prep/dynamics/diff scripts under `stardust/scripts/`. Replica-only scripts (`replica/`, `eds/`, `deploy/`) were NOT copied — Flow A and Flow B never mix.
- `stardust/state.json` reset: every page `status: "extracted"` with one history entry; `handsOff: true`; `direction.mode: redesign`; `_provenance.seed` records the reuse. Root `PRODUCT.md` / `DESIGN.md` / `DESIGN.json` deliberately NOT copied — `direct` authors the target state.
- impeccable 4.3.1 is installed; its launcher (`scripts/impeccable context|detect`) runs. `load-context.mjs` (master SKILL.md § Setup step 2) does not exist in 4.3.1 — noted, skipped; `impeccable context` used instead. `impeccable-version-check.mjs` skipped (advisory only).
- Local Playwright deps installed (`playwright pixelmatch pngjs linkedom image-size`); chromium 153 launches.

**Artifacts touched:**
- .gitignore — created
- stardust/state.json — created (reset from Flow A)
- stardust/current/**, scope/**, stardust/dynamic-features*.md, stardust/dynamics/**, stardust/scripts/** — copied from Flow A
- stardust/journal.md, stardust/status.jsonl — created
- package.json, package-lock.json — created

**Findings worth flagging:**
- The provenance validator's `waitMode` regex (`^(fast|medium|spec|networkidle|domcontentloaded)(\(fallback\))?$`) does not admit `slow`, which Flow A's crawl used on the 100 pages (`_provenance.waitMode: "slow"`). Treated as a regex omission, not missing live-render evidence: `renderedBy: playwright`, `httpStatus: 200`, `waitMs > 0`, `fetchedAt` valid on every page. Recorded here as a named assumption (A0) and flagged for the plugin maintainers.

**Open questions:** none (fonts remain flagged as in Flow A — proprietary SpareBank1 faces self-hosted for the customer pilot).

**Next:** `direct` — intent reasoning on the modernise phrase, one canonical direction, then `direct --prep`.

---
## 2026-09-14T21:20:00Z — direct (+ --prep): one canonical direction, target PRODUCT/DESIGN/DESIGN.json

**Prompt:** Resolve the "Modernise the SpareBank 1 site — it looks old …" phrase into one canonical direction, hands-off, then run the direct --prep overlays.

**Decisions:**
- Mode A brand-faithful (signal-strong); palette + faces pinned; no A+ refinement (no captured face/colour named as a weakness). Expressive restrained → committed (1.25 scale on the pinned title face); tone calm-confident; distinctiveness → distinctive; density balanced with the multi-audience floor accepted (A3: 64/48/32); ia-fidelity verbatim (A2) — verbatim spine, re-composed surface, surprise capped low.
- Research-first (refero, 3 searches / 4 retrievals): Fruitful (mood/density), MANNA (photography as content, register Museum didactic), Open Collective + Munro (hairline/flat discipline). Seed roll 1960s × Photogram × Real-estate listing × cream → research overrides decade/register; craft Photogram kept as a constraint; ground cream overridden brand-faithful (Mode C) → white, Sand-30 as alt paper.
- Improvements list (7): compact alliance router; one-row header; 1.25 scale; one card language; no type over photos + Koksgrå on tints; photography at content scale; 11 bands → 5 movements.
- Anti-toolbox: 1 hit (sticky nav, mobile-only, captured behaviour). Six brand-faithful inversions auto-emitted. Bær on white measured 4.07:1 → Bær is border/icon only, error text Svart.
- Prep overlays: 7-type catalog confirmed (13 archetype families as the per-site refinement); 45 module candidates → 34 confirmed (brand-native ids, typed slots, `bank-router` added) + 4 pruned; Skog/Bær/Sol reserved; metadata (themeColor Fjell, Organization JSON-LD, keyFacts = rate examples); wider re-evaluation surfaced the text-over-photo article hero → banned by direction, no re-direct.
- Canon author = `nb-bank-privat-html` (market landing).

**Artifacts touched:** stardust/direction.md — created · PRODUCT.md, DESIGN.md, DESIGN.json — created · stardust/prototypes/nb-bank-privat-html-improvements.md — created · stardust/scripts/validate-provenance.mjs — created · stardust/state.json — 100 pages directed · stardust/status.jsonl — appended.

**Findings worth flagging:**
- impeccable 4.3.1's launcher (`scripts/impeccable context|detect`) works from the project root; `load-context.mjs` no longer exists — master SKILL.md § Setup step 2 should point at the launcher.
- `_modules.json` scans `main > div.*` only, so `complementary` landmarks (the bank-choice router on 70 pages) never become module candidates — the most important brand module had to be added by hand.

**Open questions:** none blocking (fonts A5; owner decision batch unchanged).

**Next:** `prototype --prep --canon-from nb-bank-privat-html` — 13 archetypes, full validation loop, hands-off approval, canon.

---
