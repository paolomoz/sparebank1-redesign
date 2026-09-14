# EDS conversion log — sparebank1-redesign (Flow B)

Running history of "why does this look the way it does" (stardust:deploy § When you finish). Site: `https://main--sparebank1-redesign--paolomoz.aem.live` · repo `paolomoz/sparebank1-redesign` · DA `paolomoz/sparebank1-redesign`.

## Block inventory (17)

| block | kind | Block Collection name reused | authoring shape | variants |
|---|---|---|---|---|
| `header` | chrome | yes (stock block, template-slotted) | `/nav*` docs: brand · audience ul · market ul · tools (Søk, em Bli kunde, em+strong Logg inn) | 5 documents (privat / bedrift / om-oss / minimal / minimal-om-oss) |
| `footer` | chrome | yes | `/footer*` docs: contact + 5 contact-panel sections · columns · small · address | 8 documents |
| `fragment` | chrome | yes | link to `/fragments/bank-router(-bedrift\|-om-oss)` | — |
| `bank-router` | bespoke widget | no | heading · lede · [label\|placeholder] · position · all · 12 × [bank link\|tagline] | 3 fragments |
| `hero` | pattern | yes | 1 row [photo][h1/h2, lead, note, CTAs] | product · campaign · article · listing · portrait · ask · video · om-oss · intro · spot · usp |
| `cards` | pattern | yes | 1 row per card [media?][title link, text, em meta, links] | choices · tips · news · price · tiles · doors · small · popular · topics · tools · articles · advisers · rail · featured · listing · sheets/papers · photo-tiles · usp · quick-links · link-cards · cols-N · spot · bios · guide · steps |
| `columns` | pattern | yes | 1 row [media][text] (or text-first) | split · promo(-2) · sheets · index · help · steps · reopen · slides · expert · text · om-oss · cobrand · illustration |
| `accordion` | pattern | yes | 1 row per Q/A [h3 question][answer]; `more` = first row is the disclosure label | faq · more · wide · rate · disclose |
| `table` | pattern | yes | authored `<table>` | directory · row-headers · compare · disclose |
| `breadcrumbs` | pattern | yes | `<p><a>parent</a></p>` | — |
| `video` | pattern | yes (auto-blocked from an mp4 link) | plain link paragraph | hero video · film |
| `embed` | pattern | yes (auto-blocked from a YouTube/Vimeo link) | plain link paragraph → click-to-load frame | — |
| `feedback` | bespoke widget | no | 1 row [question][Ja][Nei] | labels · inline |
| `callout` | bespoke | no | 1 row [prose] | tip · info · frost · fact · quote · step · rich · cta · offer |
| `calculator` | bespoke widget (dynamics #7 interim) | no | rows: tabs · pill groups · fields · result · CTAs · notes (all authored text, no exemptions) | — |
| `cobranding` | bespoke (LOfavør disclosure) | no | logo · h2 · prose · CTAs · side illustration + note | 3 captured layouts |
| `converter` | bespoke widget (dynamics #9 interim) | no | captured currencies/rates, disabled controls | — |

Default-content section `style` set (closed): paper-sand · paper-frost · paper-syrin · flush-top · flush-bottom · tight-top · tight-bottom · hairline-top · feedback-band · intro · compare · prose-narrow · lead-first · router, plus the group tokens (theme: claim, intro-backlink · hub: shortcuts, faq-aside, tool-intro, directory, quick, address, figure · story: question, article(-no-rail), article-head, featured, listing, more-link, video-hero, chapter, film · omoss: contacts, hairline-none, head-xl, video-row, fineprint, tabs, prose-run · product: price-terms, shortcut-pills, topic-list, video-split, prose-start).

## Decisions locked
- One pattern = one block + variants (D9); prose = default content (D1); FAQ questions authored as `<h3>` (canon rank, role parity); CTAs by emphasis (strong → Vann pill, em → outline, em+strong → Skog action; inline tertiary links stay plain `<a>` and are styled by the owning block).
- Chrome variants follow the approved prototypes' captured header states (E2); regional-bank links in chrome normalised to the bank's market landing (E1); tracking `?icid=` stripped; `?search=` → live search page (dynamics #20 interim).
- Images stay on the public DAM (Mode A image-reuse); SVG > 40 KB → DA-media PNG (`rasterise-svg.mjs`), the router landscape as a fixed `/img` asset; the pipeline's `<picture>` gets `display:block; width:100%` in every media slot.
- Edge-NBSP authoring debris is stripped at the source (assemble.mjs) — the pipeline trims it anyway; whitespace-only, content-check-neutral.
- Unresolved AEM link templates / authoring-placeholder hrefs are kept in `data-unresolved-href` (bundle) and bounce to the source page; internal links outside the roster stay absolute to the source origin (a bounce beats a 404).
- Per-family-group CSS files (`blocks/<b>/<b>-<group>.css`, `styles/styles-<group>.css`, @imported) so parallel workers never edit one stylesheet; @import order means group rules need one extra class for equal-specificity overrides (learnings L11).
- Editability (EW1–EW10) is a gate: every block moves authored nodes; `@ew-exempt` only for the fragment reference and the router's control labels.

## Anti-patterns met and avoided this run
`illu` variant colliding with the `.illu` compound (renamed `spot`); value-slotting (none — all node moves, EW probe 0 dead on every archetype); `p + p` rhythm lost in wrappers (re-created on wrappers); `letter-spacing` drift flipping wraps at 360; absolute-origin assets in block code (none — `/img/bankchoice_bg.png` root-relative); `head.html` untouched except the favicon link and the sitewide Organization JSON-LD.

## Site-specific notes for the next person
- Fonts are the bank's proprietary faces (self-hosted, `fonts/LICENSING.md`) — licence before production.
- Owner decision batch (dynamics): bank lookup, calculator API, rates, feedback endpoint, boost.ai chat, Launch/CMP, search, regional/nynorsk trees.
- `helix-query.yaml` publishes two indexes (news, markedsnytt); listing blocks are authored cards in iteration 1.
- Gates: `stardust/scripts/eds/gate.mjs <slug> --eds <origin>` (prototype ↔ EDS pixel/Δh/chrome/content-diff); probes `_probe-sections.mjs`, `_probe-boxes.mjs`; rebuild pipeline `_rebuild-all.sh`.
