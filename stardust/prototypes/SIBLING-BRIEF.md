# Sibling brief — stardust:migrate Path A′ (Flow B, hands-off)

You harden ONE OR MORE family renderers so every sibling page of your families migrates with the content-verbatim gate PASSING.
Read first: `stardust/scripts/proto/assemble.mjs`, `stardust/scripts/proto/data.mjs`, `stardust/scripts/proto/chrome.mjs` (canon — read-only),
your archetype module(s) `stardust/scripts/proto/pages/<archetype>.mjs`, the archetype's shape brief `stardust/prototypes/<archetype>-shape.md`,
`stardust/scripts/migrate/migrate.mjs` (the driver), `stardust/scripts/content-check.mjs` (the gate), `stardust/prototypes/ARCHETYPE-BRIEF.md` (the design rules).

## What Path A′ means here
The archetype module IS the family renderer. `migrate.mjs` runs `render(data)` from `pages/<archetype>.mjs` against each SIBLING's captured DOM
(`stardust/current/pages/<slug>.html`, parsed with linkedom) and wraps it in the canon chrome. Today the modules assume the archetype's exact
component set and throw on siblings ("Cannot read properties of null"). Make them component-driven:

1. Walk the captured `<main>` children (and nested AEM containers) IN CAPTURED ORDER and map every captured component to the module's existing
   rendering (same `data-module` values, same classes, same CSS) — `.background-container`, `.columns-grid`, `.card`/`.related-topics`/`.related-products`,
   `.prices`, `.faq`, `.banner-small`, `.tip`, `.text`, `.visual-nav`, `.shortcuts`, `.cobranding`, `.feedback`, `.referance`, `.image` + `.button`,
   `.calculator-loan`, `.campaign`, `.adviser-list`, `table`, `.to-parent`, … Sections become OPTIONAL; counts become data-driven (`data-items`).
2. Anything you cannot map to a designed module → render it as a `rich-text` prose movement (`<section class="movement" data-section="…" data-intent="…"
   data-layout="contained" data-module="rich-text"><div class="container prose">…verbatim inline HTML…</div></section>`) using the module's `rich()`/`rte()`
   helper (strip editor spans/attrs, keep p/h/ul/ol/li/a/strong/em/img/table). Nothing is dropped, nothing is invented, no placeholder text ever.
3. Content rules (verbatim contract): every visible heading, paragraph, list item, link (text AND href), image (src||data-lazy-src, alt) of the captured
   page must appear; CTAs keep their hrefs; `href="#"` overlay CTAs stay `#`; images `asset(src)`; exactly ONE `<h1>` (if the captured page has none,
   promote the first heading; if several, keep the first as h1 and demote the rest); heading outline without skips where possible.
4. Design rules stay those of the archetype (ARCHETYPE-BRIEF.md): papers Hvit / Sand-30 / Frost-30 / Syrin-30 (≤ 2 tinted movements per page),
   one card language, photo mask classes `.photo` / `.photo-sm`, `.btn btn-primary|btn-secondary|btn-action|btn-inline` (Skog `btn-action` only for
   relationship-starting captured `ffe-button--action` CTAs), feedback thumbs `type="button"`, FAQ as `<details>`. Reuse the archetype CSS — add rules only
   for genuinely new shapes, in the module's `css` string.
5. Regression: the ARCHETYPE's own output must stay byte-identical (except `writtenAt`):
   `node stardust/scripts/proto/build.mjs <archetype>` → `diff <(grep -v writtenAt stardust/prototypes/<archetype>-proposed.html) <(grep -v writtenAt /tmp/x.html)` empty
   (copy the approved file aside BEFORE building, restore it with `git checkout stardust/prototypes/<archetype>-proposed.html` afterwards).

## Commands
- Render + gate your slugs (no state writes — the lead runs the full pass):
  `node stardust/scripts/migrate/migrate.mjs <slug> [<slug>…] --no-state --force`
  It prints `migrated` / `content-fail` (+ the missing items) / `FAILED` (+ the throw). Output: `stardust/migrated/<url-path>.html` + `._meta.json`.
- Content gate alone: `node stardust/scripts/content-check.mjs <slug> --file stardust/migrated/<url-path>.html --out stardust/validation/<slug>/migrate-content-check.json`
- Validation loop (3 viewports + 360 nav, offline harness) on ONE sampled sibling per family — the first non-archetype slug of the family unless it is
  atypical: `node stardust/scripts/validate-prototype.mjs <slug> --file stardust/migrated/<url-path>.html --out stardust/validation/<slug>` → 0 P0/P1
  (P2 allowed, note them). Fix renderer issues it reveals (overflow, contrast, missing alt/labels, LCP not eager) for the whole family.
- Captured outline helper: `node stardust/scripts/page-content.mjs <slug>` (add `--hidden` to see dialogs/hidden panels).

## Ownership (parallel workers share the tree — touch ONLY these)
- `stardust/scripts/proto/pages/<your archetypes>.mjs` · `stardust/migrated/**` for your slugs · `stardust/validation/<your slugs>/**`.
- NEVER edit: chrome.mjs, data.mjs, assemble.mjs, build.mjs, migrate.mjs, content-check.mjs, validate-prototype.mjs, state.json, journal, status.jsonl,
  DESIGN*, canon/, other workers' modules. No git commits, no deploys, no DA writes. If a canon/chrome/checker change is needed, append the request with
  evidence to `stardust/prototypes/canon-requests.md` under a "## Worker <X> — migrate" heading and work around it locally with `data-deviation`.
- A content-check miss you believe is not real page content (e.g. a hidden dialog string, an auth-only link) is NOT yours to waive: include it anyway
  (hidden = render it in a `visually-hidden`-free but legitimate place is NOT allowed either — render it where the design puts it). Only the lead can
  extend the checker's exclusions, via canon-requests.md with evidence.

## Report back (concise)
Per family: slugs migrated / content-fail / failed; the sampled sibling's validation verdict (P0/P1/P2 counts); captured components mapped → module;
count of `rich-text` fallbacks per page; `data-deviation`s introduced; canon requests filed; anything the EDS conversion must know (new classes/CSS).
