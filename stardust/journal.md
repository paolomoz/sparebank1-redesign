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
## 2026-09-14T23:45:00Z — prototype --prep: canon author approved (market landing), canon written; 12 archetypes fanned out; assets + dynamics gate

**Prompt:** (continuation, hands-off) — render the canon-author archetype through the full loop, approve, extract canon, fan out the remaining 12, run prepare-migration Phases 4 / 4.5.

**Decisions:**
- Rendering is generator-driven for verbatim fidelity: `stardust/scripts/proto/{data,chrome,build}.mjs` lift header / router / footer / body content from the captured rendered DOM with linkedom selectors; the design (composition, CSS, tokens, chrome) is authored in `chrome.mjs` (= canon source) and per-page modules `pages/<slug>.mjs`. impeccable new-work was followed as the craft procedure: `impeccable context` ran, the surface concept-seed roll (key 3169e2f5, dealt 4/5/3 → structure 4 "router-led landing" built) is recorded in the shape brief, craft-floor applied; the interactive decision page and comp round are hands-off gates replaced by the shape brief (stardust prototype § Phase 1 hands-off compliance).
- Header resolved as two calm tiers (108 px) rather than the improvements-list "one 72 px row": 9 market links + 3 audience links + 3 actions cannot sit in one 1280 px row verbatim. Hamburger collapse below 1024 (reviewer fix 2). Recorded in the shape brief § Open questions.
- Router treatment (A8): compact band, landscape illustration committed at band height on desktop (reviewer fix 1), cropped slice on tablet/mobile.
- Offline validation: the harness fulfils www.sparebank1.no image requests with same-aspect tinted plates (no live hits); one live probe (1/5) afterwards to verify CDN images fill their boxes (reviewer hand-off caveat).
- Quality cascade per archetype: `validate-prototype.mjs` (3 viewports + 360 nav audit) → `content-check.mjs` (verbatim gate) → `impeccable detect` → lead vision gate → fresh-context `impeccable-finish-reviewer` → fixes → verdict pass. Approval only after all pass (`approve.mjs` refuses otherwise).
- Canon extracted from the approved render (`extract-canon.mjs --author`): header, footer, bank-router, skip-links, nav-a11y script, canon.css (:root contract + compound language), 7 module renderings; 14 pinned tokens; 7 compositional moves; `DESIGN.json.extensions.canon` written.
- Fan-out: three fresh general-purpose workers (A product/hub/campaign/theme · B kundeservice/tool/utility/faq · C news/listing/om-oss/markedsnytt) under `stardust/prototypes/ARCHETYPE-BRIEF.md`; each owns its slugs' files; the lead merges state and extends canon.
- Phase 4 assets: favicon variants from the captured 144 px favicon.png (rasterised at 512/192/180 — upscaled; a vector mark from the customer would be better), fonts + logo staged in `stardust/migrated/assets/`. Phase 4.5: Flow A dynamics triage reused (A7), gate PASS 20/20, Flow B rendering deltas appended to `dynamic-features.md`.

**Artifacts touched:** stardust/scripts/proto/* (data, chrome, build, extract-canon, approve), stardust/scripts/{page-content,validate-prototype,content-check,contact-panels}.mjs — created · stardust/prototypes/nb-bank-privat-html-{shape.md,proposed.html}, ARCHETYPE-BRIEF.md, fonts/ — created · stardust/canon/** — created · DESIGN.json (extensions.canon, module renderings) — updated · stardust/validation/nb-bank-privat-html/** — created · stardust/migrated/assets/** — created · stardust/dynamic-features.md — appended · stardust/state.json (market landing approved) · stardust/status.jsonl — appended.

**Findings worth flagging:**
- Presentational `width`/`height` attributes on `<img>` override CSS `aspect-ratio` unless `height:auto` is set — every photo slot stretched on the first render.
- Chromium's sequential-focus start point is not reset by `blur()`; a keyboard-walk check must focus a known first element before tabbing.
- `impeccable detect` reports `cramped-padding` on every container whose padding comes from a CSS custom property — static-CSS misread; worth an upstream note.
- The finish-reviewer caught what the harness cannot: an offline SVG plate served at the wrong aspect grew an unconstrained img box (router band 340 px instead of 159) — always pin `aspect-ratio` on externally loaded images.
- Hand-authored provenance timestamps in direction.md / DESIGN* / brief are local time (CEST) written with a `Z` suffix; machine-written ones (state.json, canon files) are true UTC — ~2 h apart. Not rewritten (append-only); noted for reviewers.

**Open questions:** fonts A5 (unchanged); favicon vector source from the customer; live-CDN image rehosting is a rollout decision.

**Next:** merge workers A/B/C (approve each after gates, extend canon in diff mode), then the final prep summary; hand off to `migrate`.

---
## 2026-09-15T00:40:00Z — prototype --prep complete: 13/13 archetypes approved, canon extended; prepare-migration complete

**Prompt:** (continuation, hands-off) — merge the three workers' archetypes, resolve canon requests, approve, extend canon, close prepare-migration.

**Decisions:**
- All 12 worker archetypes re-gated by the lead against the updated canon before approval (validation loop, content-check, detect); every one `approved` with `approvedBy: "hands-off"` and its reviewer disposition in `gatesPassed`.
- Canon requests resolved in `chrome.mjs`/`data.mjs`/`build.mjs` (lead-owned): router art `loading="eager" fetchpriority="high"` (LCP on hero-less pages; the FAQ page's router-in-main workaround reverted); `.title`; disabled-control vocabulary; `.callout.info` + `icons.info`; `.badge`; `.video-frame` + `icons.play`; `id="kontakt"` on the contact section; router open-state spans the band at ≤1023; footer top-block `tel:` links kept; duplicate "Melde skade" panel heading fixed; frontend-clientlib footer builder + `Bli kunde` href fallback (sourced from the same page's footer link); lazy footer icons + `title` fallback. Harness: YouTube embeds fulfilled offline; details smoke scoped to `section/article`. Checker: any `logo*.svg` excluded; authenticated-state header UI excluded (A9).
- One door language (A's open question): photo-led items are never boxed (boliglån choices aligned to the hub/news treatment); text-only items may sit on a Hvit hairline paper on tinted movements. Recorded in DESIGN.md § Cards and `extensions.componentStyle.cards`.
- Accepted: kontakt directory `tel:` hrefs (A10); boliglån calculator strings from the captured screenshot (A11 — migrate must re-capture the settled widget); two-tint cap kept on story pages (A12); markedsnytt YouTube embeds as linked frames (2 of 3 have runtime-injected src).
- DESIGN.md spacing frontmatter reconciled with the `:root` contract; video mask rule, Disabled Rule, badge/callout/video/feedback component entries added (direction refinement, no axis moved).
- Canon extended in diff mode per approval: 15 module renderings (bank-router, campaign-carousel, content-columns, card-rail, feedback, contact-row, callout, promo-band, cta-band, price-cards, calculator, button-row, article-header, article-body, faq-question); no conflicts logged as deviations at canon level — page-level `data-deviation` markers are recorded in `state.json.pages[].canonDeviations` (hjemme 4:5 portraits, article badge/rail mask, borettslag Frost callout, markedsnytt video frames).
- Phase 4 assets and 4.5 dynamics were closed earlier this session; prepare-migration is complete.

**Artifacts touched:** stardust/scripts/proto/{chrome,data,build,extract-canon}.mjs — updated · stardust/scripts/{content-check,validate-prototype}.mjs — updated · 12 × stardust/scripts/proto/pages/<slug>.mjs, stardust/prototypes/<slug>-{shape.md,proposed.html}, stardust/validation/<slug>/** — created by workers (boliglån doors patched by the lead) · stardust/prototypes/canon-requests.md — created by workers · stardust/canon/** — rewritten (canon-update) + modules/ extended · DESIGN.md, DESIGN.json — updated · stardust/direction.md — refinement appended · stardust/state.json — 13 approved / 87 directed · stardust/status.jsonl, journal — appended.

**Findings worth flagging:**
- `_modules.json`-style candidate scans and `footerData()` both miss `data-lazy-src`-only images; the live site's lazy loader leaves `<img>` without `src` — every extractor must read `src || data-lazy-src`.
- The `nettsider-frontend` clientlib renders header/footer inside `<main>`; chrome extractors need that second shape.
- Screenshot-transcribed strings are a real provenance class the sourcing hierarchy does not name (captured artifact, not the DOM) — marked with `data-source="captured-screenshot"`; worth adding to proposed-file-shell.md.
- Reviewers tripped twice on a DESIGN.md/`:root` spacing mismatch — keep the frontmatter and the token contract literally identical.

**Open questions:** fonts A5; favicon vector source; live-CDN image rehosting; calculator settled re-capture (A11); owner decision batch (dynamics) unchanged.

**Next:** `$stardust migrate` (the orchestrator continues: fork the 13 approved archetypes onto the 87 directed siblings using stardust/canon + DESIGN.json.extensions.canon).

---
## 2026-09-15T00:30:00Z — migrate: 100/100 pages, platform-agnostic bundle; EDS site bootstrapped and the product archetype published

**Prompt:** (continuation, hands-off) — `$stardust migrate` all 100 pages from the canon + the 13 approved archetypes, then `deploy`/`rollout` to a NEW EDS repo + DA site `paolomoz/sparebank1-redesign`.

**Decisions:**
- Path A = the 13 approved prototypes verbatim; Path A′ = each family's page module turned into a family renderer (component walker over the captured `<main>` in order → the archetype's module vocabulary; unmapped components → verbatim `rich-text` movements; ≤ 2 tinted movements, never adjacent; exactly one `<h1>`). Three migrate workers (A product/theme/market-landing · B hub/kundeservice/tool/utility · C faq/news/om-oss/listings/campaign) hardened the renderers; every archetype build stayed byte-identical to its approved prototype.
- Driver `stardust/scripts/migrate/migrate.mjs`: page map (URL-literal output path · lowercase extensionless delivered path), depth-aware relative roster links, non-roster site links absolute to the source origin (`data-broken-link`, a bounce beats a 404), unresolved AEM link templates / authoring placeholders kept in `data-unresolved-href` and bounced to the current source page, `?icid=` tracking stripped, `?search=` → the live search page (dynamics #20 interim), head metadata (canonical to the live origin — `deployUrl` unset for the bundle, og/twitter, Organization + Article/FAQPage JSON-LD), `_meta.json` sidecars, robots + sitemap, bundle entry `index.html` → Privat landing.
- Gates per page: mobile-adapt audit, one h1, placeholder gate, **content-verbatim** (`content-check.mjs --file`, every captured heading/paragraph/link+href/image present) = the content-count acceptance. Validation loop (1440/768/390 + 360 nav) on the 13 archetypes' migrated copies and on one sampled sibling per family (13 samples, all 0 P0/P1).
- Media: photos/illustrations stay on the public DAM (Mode A image-reuse); SVGs > 40 KB (site scan `svg-sizes.json`) are rasterised to DA media PNGs at rollout (`rasterise-svg.mjs --from-migrated`, response validated as SVG).
- EDS site: repo `paolomoz/sparebank1-redesign` from `adobe/aem-boilerplate` (template history merged into this project — root = EDS project, `.hlxignore` hides `stardust/`, `scope/`, DESIGN/PRODUCT), fstab → `content.da.live/paolomoz/sparebank1-redesign`, Code Sync (installation 27711897) 204, config auto-created. Foundation = canon tokens + metric-matched fallbacks (Flow A calibration, same woff2) + the canon compounds; sections = movements (`padding-block: var(--section-padding)`, canon container), a closed `style` set for prose sections; buttons via the emphasis convention (strong → Vann pill, em → outline, em+strong → Skog action).
- Chrome: template-slotted `header`/`footer` blocks over `/nav*` (5 variants) and `/footer*` (8 variants) documents generated from the captured chrome data; the alliance router is a `bank-router` block in `/fragments/bank-router(-bedrift|-om-oss)` included per page through the `fragment` block (70 pages). E1–E3 recorded in `stardust/rollout/progress.json`.
- Conversion (`stardust/scripts/eds/{lib,convert,encoders}.mjs`): migrated module → DA section(s); David's Model (prose = default content, one block per repeating unit, ≤ 4 columns, emphasis CTAs, headings keep the canon rank — FAQ questions authored as `<h3>`); blocks reused from the Block Collection vocabulary (hero, cards, columns, accordion, breadcrumbs, table, video/embed, fragment, header, footer) + bespoke (bank-router, feedback, callout, calculator, cobranding). EW1–EW10 throughout (node moving, wrapper classes, `@ew-exempt` for config text).
- Foundation-first gate on the PUBLISHED origin (product archetype vs its approved prototype): 1440 pixel 0.73 % / Δh −1 / header 99.96 % / footer 99.9 %; 360 pixel 1.46 % / Δh −1 / header 99.66 % / footer 100 %; content-diff 0 unexplained 🔴; 14 blocks loaded, grids compute `grid`, 0 pageerrors, 0 broken images; EW 191/192 editable + 1 declared exemption; CLS 0.011 / 0.05. Redirects sheet (108 rows: `/` → `/nb/bank/privat`, every `.html` and original-case path → its delivered path) live; `helix-query.yaml` (news + markedsnytt indexes); Organization JSON-LD in `head.html`.
- Parallel conversion of the other 12 archetypes + siblings runs in five family groups with per-group CSS files (`blocks/<b>/<b>-<group>.css`, `styles/styles-<group>.css`, @imported) so no two workers edit one stylesheet.

**Artifacts touched:** stardust/migrated/** (100 pages + sidecars, robots, sitemap, index) · stardust/state.json (100 migrated, migrate block, pageMap) · stardust/scripts/{migrate,eds,deploy,rollout,replica,diff}/** · stardust/scripts/proto/{assemble,build}.mjs + 13 family renderers · blocks/**, styles/**, scripts/{scripts,sb1}.js, head.html, fonts/**, img/**, helix-query.yaml, fstab.yaml, .hlxignore · content/** (chrome docs, fragments, redirects.json, boliglan) · stardust/rollout/{progress.json,chrome-map.json,coverage/**,plan.json,gates/**,EDS-BRIEF.md,svg-sizes.json,raster-ledger.json,deploy-ledger.json} · stardust/prototypes/SIBLING-BRIEF.md, canon-requests.md (worker appends) · stardust/status.jsonl.

**Findings worth flagging:**
- zsh does not word-split an unquoted `$VAR` — a 70-slug list reached migrate as ONE argument ("0 pages in scope"); use `${=VAR}`.
- Stale local servers from a sibling project were listening on the default ports (3010/8812): the emulation curl returned 200 from the WRONG project. Always `lsof` the port before trusting a local gate.
- A bare `curl`/`fetch` of a wrong DAM path returns an HTML page with status 200; the rasteriser rendered three "SVGs" that were HTML documents (identical 76 KB PNGs) — validate `<svg` before rasterising, and take the exact URLs from the pages.
- The migrate `pagemap-audit` / `file-protocol-audit` fixtures import Playwright relative to the plugin dir (unresolvable there) and treat `?query` links and `<meta http-equiv=refresh>` entry pages as failures — copy them into the project and give the bundle a plain-link entry page.
- `p + p` 16 px margins silently vanish when EDS wraps each authored paragraph in its own layout div (canon rhythm lost by 16–24 px per movement); `h3` tracking −0.005em vs the canon summary's normal tracking flipped a line break at 360 (−30 px); h2 line-height 1.15 vs title 1.25 cost 2 px per footer column. The section probe + box probe (`_probe-sections.mjs`, `_probe-boxes.mjs`) turned each Δh into a one-line CSS fix.
- Worker stalls happened twice (watchdog 600 s, one API server error); resuming the same agent with "continue from disk" recovered both without rework.

**Open questions:** fonts A5 (licence before production); favicon vector source; live-CDN image rehosting (kept as public DAM URLs); calculator/converter/feedback/search/chat/bank-lookup backends (owner batch, interim tiers shipped); the four nettsider-frontend pages' minimal nav (E2).

**Next:** finish the 12 remaining archetype conversions + siblings (workers), publish in waves, published-origin gate per archetype, verify, report.

---
