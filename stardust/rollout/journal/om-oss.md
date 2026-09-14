# om-oss — EDS journal (E3)

## Archetype: presse (nb-bank-om-oss-presse-html) — PASS
- Blocks: hero `om-oss` (photo left 7/5, display h1 — no tight-top: the presse movement keeps the full 64px), cards `advisers` (portrait | h3 name, role, phone, mail — one block per rail, two rails), columns `promo lokale` (200px spot illustration beside prose), columns `split text-first presserom` (text 5 / photo 7 on Sand), feedback `labels` (+ section style `hairline-none` under the Sand paper).
- Section styles added (styles-omoss.css): `contacts` (h2 + lead phone line + small muted note, 32px p+p), `hairline-none`.
- Rhythm traps met: canon `p + p` 16px inside the adviser card (role → phone → mail) and between the lead and the note; the presse hero keeps DOM order at ≤1023 (photo above text) unlike the product hero; the presserom split must stack at ≤1023 (my 5fr/7fr desktop rule out-specified the core stacking rule).
- Gate: 1440 2.14 % / Δh 0 · 360 0.33 % / Δh 0 · header 99.96/99.66 · footer 99.8/100 · content-diff 0 🔴 · EW 35/35 editable, dead 0.

## Siblings (component-walker vocabulary → blocks)
- `.cols` two-up with a figure → columns `om-oss` (+`spot` for a 320px illustration, +`text-first`, +`panel`/`plain` when the second column is a paper); `.cols` of single-card lists → one cards `om-oss cols-3` block; `.faq` → accordion `faq`; `.tabs` → jump list of badges (style `tabs`) + one section per panel (dynamics #11 interim); `.table-wrap` → table `row-headers` (caption authored as a bold paragraph above); `p.back` → breadcrumbs; `text` movements → default content with style `prose-run` (heading rhythm).
- `contact-row` is the footer's contact section (chrome) → skipped, not duplicated.
- Investor answers: the captured RTE lists several PDF links in one paragraph separated by `<br>` (and strays: empty anchors, `<strong>` wrapping its own `<br>`, a link swallowing the next label) → `tidyAnswer()` normalises and splits one link per paragraph (delivery-lint P1 one-cta-per-p 44 → 0).
- Side-by-side FAQ columns (personvern) are stacked accordions (two blocks) — a layout simplification, no content change.
- Sampled sibling content-diff (personvern): 25 🔴 all `ROLE SWAP` = FAQ questions (walker `<summary>` body → accordion `<h3>`), justified in `justified/nb-bank-om-oss-personvern-html.json`; 0 other reds.
- Open: the jobb-og-karriere raster with `%20` in its name renders only on DA, not in the emulation (eds-requests).
