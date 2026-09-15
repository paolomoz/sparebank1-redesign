# faq — EDS conversion journal (Worker C, story group)

- 2026-09-15 · `faq-question` → one section, style `question`: breadcrumbs block · h1 + answer as default content · captured `.answer-step` background-containers → `callout (step sand|syrin)` · CTAs as emphasis links · `feedback (inline labels)`.
- Gate closed at iteration 2: the prototype's feedback strip sits 64 px (not 48) below the prose. 1440 0.15 %/Δh 0, 360 0.12 %/Δh 0, chrome ≥ 99.66 %, content-diff 0 🔴. EW 9/10 editable, dead 0 (1 exempt = fragment).
- Lint 🟡 D1 on `fragment` (lead's router reference) and `breadcrumbs` (designed back link) — justified in the encoder notes. 11 siblings converted, gaps 0, lint 0 🔴/0 P0-P1; sampled `hva-er-bankaxept` content-diff 0 structural 🔴 (🟠 extras are the bank-router fragment's bank links).
- Open: none for the family. The `.referance` wrapper and `.answer-figure` screenshots flow through `prose()` unchanged.

## Round 01 (2026-09-15, story group)
- `faq-question` now emits THREE sections: [breadcrumbs + `hero (question)`] (the Frost-30 question card spanning 12; hero.js moves the back link into the card) · answer as default content, style `answer` (68ch column at lead size, left-aligned in the container like the prototype's `.question-grid`) · `feedback (labels question)` with `flush-bottom` (the prototype's footer carries the 64 px, not the movement).
- Traps: the breadcrumbs `<nav>` is itself a `.backlink-row`, so the base hero rule gave it a second 20 px margin (+30 with the h1's 10 px card-body margin) — neutralised for the question variant; `.h2-l` line-height is 1.12 at ≤ 767 (h1 default 1.04). All story CSS is scoped to `body.<template>` per the lead's note.
- Gate: 1440 0.13 % / Δh 0 · 360 0.15 % / Δh 0 · chrome ≥ 99.74 % · content-diff 0 🔴 (🟠 = router bank links). Lint 0 🔴 / 3 🟡 (fragment, breadcrumbs, single-cell hero — justified in notes), delivery clean, EW 9/9 editable, dead 0, exempt 1 (fragment). 11 siblings converted (gaps 0, lint 0 🔴); sampled `hvordan-sende-efaktura` content-diff 0 🔴, eyeballed 1440/360.
