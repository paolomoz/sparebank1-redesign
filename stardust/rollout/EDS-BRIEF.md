# EDS conversion brief — stardust:rollout Phase C (Flow B redesign, hands-off)

You convert the MIGRATED redesign pages of your families into EDS blocks + DA documents and gate every archetype against its APPROVED
PROTOTYPE. The product archetype (boliglån) is the gated reference: read `stardust/scripts/eds/{lib,convert,encoders,gate}.mjs`,
`blocks/{hero,cards,columns,accordion,feedback,callout,calculator,breadcrumbs,header,footer,bank-router}/`, `styles/styles.css`,
`scripts/sb1.js`, `stardust/scripts/deploy/davids-model.md`, `stardust/rollout/gates/nb-bank-privat-lan-boliglan-html/gate.json`
(how the gate was closed: 1440 0.74 %/Δh −1, 360 1.49 %/Δh −1, chrome ≥ 99.6 %, content-diff 0 🔴) BEFORE writing anything.

## Inputs (per archetype)
- Migrated page (verbatim content, canon markup): `stardust/migrated/<url-path>.html` (path in `stardust/state.json → migrate.pageMap[].outputPath`).
- Approved prototype (the fidelity REFERENCE): `stardust/prototypes/<slug>-proposed.html`, served at `http://localhost:8820/<slug>-proposed.html`.
  Its `<style>` holds the module CSS you lift; the family renderer `stardust/scripts/proto/pages/<archetype>.mjs` shows the module vocabulary
  (incl. the sibling-only classes the migrate workers added — read its `css` string).
- Family → slugs: `node -e 'const s=require("./stardust/state.json");console.log(s.pages.filter(p=>p.archetypeFamily==="<family>").map(p=>p.slug).join("\n"))'`.

## Conversion
- `node stardust/scripts/eds/convert.mjs <slug…>` writes `content/<delivered-path>.html` + `stardust/rollout/eds-log/<slug>.json` (modules → blocks,
  notes, **gaps**). A gap = a `data-module` with no encoder (emitted as prose) — your job: gaps 0 and every module's content in the DA document.
- Encoders: add ONLY `stardust/scripts/eds/encoders/<family>.mjs` — `export default { '<data-module>': (root, ctx) => ({ html, blocks }) }`,
  keyed by the module root's `data-module` (fallback: `data-section` / a class). Import helpers from `../lib.mjs` (`q, qa, cls, txt, inline, prose,
  list, table, ctaHtml, ctas, imgHtml, pic, block, row, section, sectionMeta, styleOf, paperOf, href, esc`) and reuse `../encoders.mjs` exports
  (`cardRows, cardRail, splitMedia, promoBand, productHero, pageTitle, faq, feedback, callout, richText`). A family file applies only to pages of its
  family; NEW keys are shared. You MAY override a core key for your family only.
- David's Model (mandatory, `davids-model.md`): prose = default content (with a section `style` from the closed set in styles.css § sections:
  paper-sand/frost/syrin · flush-top/bottom · tight-top/bottom · hairline-top · feedback-band · intro · compare · prose-narrow · lead-first — add a
  token ONLY when a new prose composition needs it, appended to styles.css inside `/* ===== <family> ===== */` markers); one block per repeating-unit
  set / bespoke widget, one row per unit, ≤ 4 columns, no nested blocks, fully-qualified media URLs (`L.imgHtml/pic` — SVG > 40 KB → DA media PNG
  automatically), CTAs as emphasis links (`L.ctaHtml`: strong = primary Vann pill · em = secondary · em+strong = Skog action; inline/tertiary links
  stay plain `<a>`), name/value only for `metadata`/`section-metadata`, headings keep the canon rank. Lint every document:
  `node stardust/scripts/deploy/davids-model-lint.mjs content/<path>.html` → 0 🔴 (🟡 fixed or justified via `ctx.notes.push('lint D#: …')`);
  `node stardust/scripts/rollout/delivery-lint.mjs --file content/<path>.html --path /<delivered-path>` → 0 P0/P1.
- Blocks: prefer REUSING `hero · cards · columns · accordion · feedback · callout · calculator · breadcrumbs` with a NEW VARIANT (a class token on
  the block + rules in YOUR GROUP'S CSS FILE `blocks/<block>/<block>-<group>.css` — already created and @imported by the block CSS; groups:
  `theme` = theme + market-landing · `hub` = category-hub + kundeservice-hub + tool + utility · `story` = faq + news-article + news-listing +
  campaign-landing · `omoss` = om-oss + markedsnytt-listing; section-style tokens likewise in `styles/styles-<group>.css`. NEVER edit another
  group's file or the main block CSS/styles.css; JS changes to a shared block must be small, additive and re-verified with grep after the edit); a new block (`blocks/<name>/{<name>.js,<name>.css}`) only for a
  genuinely new repeating unit or widget (e.g. `table`, `cobranding`, `video`, `embed`). Shared blocks/styles are ADDITIVE ONLY: never change an
  existing rule or the decorate flow for existing variants — the product page must keep passing (`node stardust/scripts/eds/gate.mjs
  nb-bank-privat-lan-boliglan-html --widths 1440` ≤ 1 % / |Δh| ≤ 2 after your changes; if it moved, your change is not additive).
- Editability (EW1–EW10, deploy SKILL.md § 8): blocks MOVE authored nodes (`h*`/`p`/`ul`/`picture`) into wrappers that carry the classes; never
  `textContent =`/`innerHTML =` from authored text, never classes on authored elements (style them as wrapper descendants: `.card-title :is(h2,h3)`),
  CTAs move as their `<p>` (decorateButtons already classed the anchor), presentational clones `strip` instrumentation, `<button>/<summary>` never
  host authored text (see accordion.js), config text declared with `@ew-exempt` in the block JSDoc. Gate: `node stardust/scripts/deploy/
  ew-editability-probe.mjs http://localhost:3020/<delivered-path> --blocks-dir blocks --verbose` → dead 0 (exempt allowed), duplicated 0.
- Images stay on the public DAM (image-reuse contract); `L.imgHtml` handles oversize SVGs — after converting, run
  `set -a; source /Users/paolo/.claude/.env; set +a; node stardust/scripts/eds/rasterise-svg.mjs --from-migrated` ONCE if your pages reference new
  SVGs > 40 KB (it uploads to DA media and mirrors into `stardust/rollout/raster/` for the emulation; never print the token).
- Chrome is the lead's (header/footer/bank-router blocks, `content/nav*`, `content/footer*`, `content/fragments/*`, chrome-map.json). Cross-cutting
  needs (a shared-block rule you cannot express additively, a foundation token, a chrome fix) → append to `stardust/rollout/eds-requests.md`
  under "## <family> — <worker>" with measured evidence; work around locally.

## Gate (per archetype, 1440 then 360; the EDS render on the local emulation vs the approved prototype)
```
node stardust/scripts/eds/gate.mjs <slug> --widths 1440,360        # emulation http://localhost:3020 (already running) vs proto http://localhost:8820
```
Pass bar: pixel ≤ 10 % with every band ≥ 15 % explained · |Δh| ≤ 8 px · header & footer crops ≥ 98 % · content-diff prototype ↔ EDS 0 unexplained
structural 🔴 (a justified class goes in `stardust/rollout/justified/<slug>.json` `{ "patterns": ["regex", …] }` WITH the reason in your report —
e.g. the router's bank links are inside `<main>` on EDS but outside it in the prototype: pattern `EXTRA: EDS cta "SpareBank 1 `). Diagnose
top-down, one hot band at a time: `node stardust/scripts/eds/_probe-sections.mjs <url> <width>` (section tops/heights) and
`node stardust/scripts/eds/_probe-boxes.mjs <url> "<heading text>" <width>` (element boxes inside one movement) on BOTH urls; fix the FIRST
mismatching movement, re-run. Rhythm traps already met: `p + p` 16 px margins disappear when paragraphs land in separate wrappers (add them back on
the wrapper), the canon `.section-title` 24 px gap = the default-content → block gap, prose `max-width: 68ch` on trailing paragraphs, `text-wrap`
+ tracking flips line breaks at 360 (match `letter-spacing` exactly), h2 line-height 1.15 vs title 1.25.
- Then convert the family's SIBLINGS (`convert.mjs <slugs…>` → gaps 0, lint clean each). Siblings have no prototype: their reference is
  their MIGRATED page. Serve it once (`python3 -m http.server 8821 --directory stardust/migrated` — check the port is free first) and run
  `node stardust/scripts/diff/content-diff.mjs "http://localhost:8821/<outputPath>" "http://localhost:3020/<deliveredPath>" --width 1440 --profile eds`
  for ONE sampled sibling per family → 0 unexplained structural 🔴; eyeball that sibling on the emulation at 1440 and 360
  (`node stardust/scripts/replica/stitch-shot.mjs <url> /tmp/x.png --width 1440`, then Read the PNG) — no dropped module, no collapsed grid.

## Ownership (parallel workers share the tree — touch ONLY these)
- `stardust/scripts/eds/encoders/<your family>.mjs` · `blocks/<new-block>/**` · additive variant rules in shared block CSS/JS and styles.css inside your
  family markers · `content/<your pages>.html` · `stardust/rollout/eds-log/*` (automatic) · `stardust/rollout/gates/<your slugs>/**` ·
  `stardust/rollout/justified/<your slugs>.json` · `stardust/rollout/eds-progress/<family>.json` · `stardust/rollout/journal/<family>.md`.
- NEVER edit: lib.mjs, convert.mjs, core encoders.mjs (request instead), chrome blocks/documents, state.json, journal.md, status.jsonl, DESIGN*,
  stardust/migrated (read-only now), other workers' files. No git commits, no DA writes (except rasterise-svg), no deploys — the lead publishes.

## Outputs
- `stardust/rollout/eds-progress/<family>.json`: `{ archetype, document, blocks: { new: [], reused: [] }, iterations, breakpoints: { 1440: { pixelPct,
  heightDelta, header, footer, pass }, 360: {…} }, contentDiff: { red, justified: [{pattern, reason}] }, ew: { editable, dead, exempt }, lint,
  siblings: { converted: [], gaps: {}, lintRed: {}, contentDiffSampled: {slug, red} } }`.
- `stardust/rollout/journal/<family>.md`: decisions, findings, open questions (append-only).
- Report back per archetype: blocks used (new vs reused + variants), per breakpoint pixel % / Δh / chrome crops, content-diff reds (justified with
  reason), EW probe result, lint result, siblings converted with gaps, product regression number, requests filed.
