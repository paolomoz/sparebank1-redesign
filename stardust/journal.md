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
