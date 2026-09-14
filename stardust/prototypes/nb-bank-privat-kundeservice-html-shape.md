<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, Flow B fan-out — Worker B, hands-off)
  writtenAt:        2026-09-14T22:40:00Z
  page:             nb-bank-privat-kundeservice-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat/kundeservice.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-privat-kundeservice-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-privat-kundeservice-html.json
    - stardust/current/pages/nb-bank-privat-kundeservice-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs --hidden)
    - stardust/prototypes/ARCHETYPE-BRIEF.md, nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/prototypes/nb-bank-privat-html-improvements.md
    - impeccable reference/operate.md, craft-floor.md
  conceptSeed:      surface roll key 6acf5792 (mode operate) — dealt 7, 2, 4 of the ordered structure list; 7 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component (variant privat), canon chrome
    - bank-router — site-wide `.bank-choice--inline` landmark, canon chrome (present on the captured page)
    - hero — `main > div.background-container`: `div.text > h1` "Kundeservice" · `div.image img` (surfeidyll photo, captured aria-hidden) · `div.columns-grid` #1 (h2 "Hva kan vi hjelpe deg med?", 2 p, `div.chat-field` label + textarea + button "Send melding") · `div.hr` dropped
    - tools — same `background-container`: `div.columns-grid` #2 + #3 → 4 `.card` (title link + one line): Hjelp med BankID · Sperre bankkort · Bestill produkter og tjenester · Signere dokumenter
    - faq — `main > div.faq`: h2 "Akkurat nå lurer noen på..." + `.ffe-accordion` × 3 items (bodies captured `hidden`: rich text, nested `columns-grid` with two illustrations, per-item "Var dette nyttig?" Ja/Nei, `a.faq-link` to the question page)
    - topics — `main > div.related-products`: h2 "Hjelp til andre ting" + 9 icon cards (BankID … Sparing og pensjon)
    - invites — `main > div.banner-small` ("Har du blitt svindlet?", bg-color7, primary "Meld svindel her!") + `main > div.columns-grid` ("Skal du i banken?", captured #F2F2F9 ground, primary/overlay "Velg kontor og avtal møte", samtale-2 illustration); trailing `div.hr` dropped
    - footer — site-wide system-component (contact-section + columns + legal row), canon chrome
  antiTemplatePass:
    - { pattern: "kundeservice hero (centered H1 + photo card + chat)", defaultReflex: "centered stack, photo in a rounded card, search-style input", alternatives: ["centered stack as captured", "7/5 split: photo left as content, H1 + ask + chat field right (canon hero rule)", "type-only header with the chat field as the hero"], picked: "7/5 split, photo left", rationale: "the captured photo is the page's one photograph — content scale (#6), one-corner mask (§ 8b); the ask block is the page's one action (chat) and sits beside it, left-anchored (direction anti-reference: centered hero)" }
    - { pattern: "tool shortcut cards", defaultReflex: "white cards with shadow + chevron", alternatives: ["shadowed cards", "hairline tiles: title link + one line, no chrome (canon product tiles)", "inline link list"], picked: "hairline tiles 4-up", rationale: "#4 one card language; the chevron is not carried — the title is the link" }
    - { pattern: "FAQ accordion", defaultReflex: "rounded white pills with chevron", alternatives: ["pill cards as captured", "`.faq` details/summary on Frost-30 with sticky section title in a 4/8 split", "single column list"], picked: "`.faq` on Frost-30, 4/8 split", rationale: "Frost-30 is the help paper; the 4/8 split keeps the section title in view while the long answers open; every hidden body renders (closed details)" }
    - { pattern: "topic icon cards", defaultReflex: "3×3 white cards with icon + chevron", alternatives: ["cards as captured", "hairline tiles 3-up: 48 px icon + title link", "plain link list"], picked: "hairline tiles 3-up", rationale: "#4; the flat spot icons are a signature (§ 8b) and sit directly on white" }
    - { pattern: "two promo bands", defaultReflex: "two stacked full-width banners", alternatives: ["stacked bands", "two invitations side by side on one Sand-30 movement (canon membership pattern)", "merge into one"], picked: "side by side on Sand-30", rationale: "one movement, two invitations, one action each; #7 fewer bands" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: faq, paper: Frost-30, purpose: "help paper — the captured FAQ sits on a light-blue band; cool paper marks the answer movement" }
      - { section: invites, paper: Sand-30, purpose: "warm paper for the two invitations (fraud report · book a meeting); captured banner-small bg-color7 + #F2F2F9 grounds merged into one Sand movement" }
  voiceClassification:
    - { section: header, classification: captured-verbatim; "Meny" = direction-authorized chrome }
    - { section: bank-router, classification: captured-verbatim }
    - { section: hero, classification: captured-verbatim (label "Skriv det du lurer på her", button "Send melding", placeholder — chat-field strings) }
    - { section: tools, classification: captured-verbatim }
    - { section: faq, classification: captured-verbatim (answers lifted as rich HTML; inner headings demoted two levels to sit under the h3 question; empty p/h3 dropped) }
    - { section: topics, classification: captured-verbatim }
    - { section: invites, classification: captured-verbatim }
    - { section: footer, classification: captured-verbatim }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "bankchoice_bg.svg", mechanism: "canon router band", fallback: "band without art" }
    - { kind: site-wide-motif, capturedSource: "flat spot illustrations /content/dam/SB1/ikoner/*.svg, illustrasjoner/*", mechanism: "48 px topic icons, 112 px FAQ illustrations, 150 px invitation illustrations, all aria-hidden on paper", fallback: "text stands alone" }
    - { kind: site-wide-motif, capturedSource: "96px photo mask", mechanism: "one-corner-pair 96 px on the hero photo (48 px at ≤ 640)", fallback: "square photo" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-privat-kundeservice-html
url: https://www.sparebank1.no/nb/bank/privat/kundeservice.html
register: brand
mode: operate
surprise: low
dominantDimension: composition/counter-and-shelves
---

# Page shape: nb-bank-privat-kundeservice-html (kundeservice hub)

Structure list (ordered by resonance) for the surface roll 6acf5792: 1 help-desk spread (H1 + chat, tools row, FAQ, topics) · 2 tools-first task strip · 3 question ledger (FAQ leads) · 4 topic index first · 5 split-screen ask / browse · 6 single reading column · **7 counter and shelves — the ask counter (photo + H1 + chat) first, then shelves of shortcuts, answers on the help paper, topics, invitations (dealt lead — built)**. Dealt alternates 2 and 4 recorded, not built.

## Sections (in render order)

1. **header** (canon) — privat variant, injected by the builder.
2. **bank-router** (canon) — captured on this page; injected.
3. **hero** (module `hero-ask`) — Hvit; 7/5 split: photo left (`surfeidyll-mann-skriver-pa-pc-dame-ser-pa`, 3:2, 96 px one-corner mask, eager + fetchpriority high — the LCP), right: H1 "Kundeservice" (headline), h2 "Hva kan vi hjelpe deg med?" (title 31 px), lead + body paragraphs verbatim, the chat field as a form: visible label (Label 13), textarea (captured placeholder, maxlength 110), primary "Send melding" — the module's one action. **Dynamics #6 interim:** boost.ai chat is an owner decision; textarea + button render verbatim and `disabled`. Under the split: the 4 tool shortcuts as hairline tiles (title-sm link + one line in Koksgrå), 4 → 2 → 1 columns.
4. **faq** (module `faq`, 3 items) — Frost-30; 4/8 grid: section h2 "Akkurat nå lurer noen på..." sticky left, `.faq` right with `<details>`/`<summary>` (question as h3 inside the summary, `icons.down`). Every captured hidden body renders: rich text (b→strong, spans unwrapped, empties dropped, inner h2/h3/h4 → h4/h5/h6), the nested two-column block (BankID-app / kodebrikke illustrations at 112 px), the per-item "Var dette nyttig?" Ja/Nei thumbs (`type="button"`, dynamics #5 static) and the question-page link (`a.faq-link` text made visible: the question, chevron).
5. **topics** (module `topic-tiles`, 9) — Hvit; h2 "Hjelp til andre ting"; 3 → 2 → 1 hairline tiles: 48 px flat icon + title link (lead size, Fjell).
6. **invites** (module `promo-band` × 2) — Sand-30; two invitations side by side with one hairline between: banditt illustration + "Har du blitt svindlet?" + p + primary "Meld svindel her!"; samtale-2 illustration + "Skal du i banken?" + p + primary "Velg kontor og avtal møte" (captured `overlay-btn` → dynamics #2 dialog at rollout; href kept). One action each.
7. **footer** (canon) — contact row + Fjell columns + Natt legal row.

## Layout strategy

- Density balanced: `--section-padding` 64 / 48 / 32; container 1280.
- Grids: hero `7fr 5fr` ≥ 1024 → `5fr 7fr` at 768 (photo smaller so the H1 stays in the first screen) → stacked at ≤ 640 with the photo cropped 16:9 (48 px mask); tools 4 → 2 → 1; FAQ 4/8 → 1; topics 3 → 2 → 1; invites 2 → 1 (≤ 1023).
- Papers: Hvit → Frost-30 → Hvit → Sand-30 (two tinted movements, never adjacent). No `<hr>` (three captured dividers dropped).
- Operate mode: familiar controls (native details, standard textarea + pill button), no decorative motion; hover = underline on tile titles.

## Key states

- FAQ details open/closed (native); chat field disabled (interim); thumbs static.
- Reduced motion: transitions off (canon).

## Interaction model

- Burger: canon script. Disclosures native. Every href verbatim (icid strings kept where present).

## Data attributes

- `section[data-section="hero"][data-intent="ask for help: chat first, then shortcuts"][data-layout="split-media"][data-media="image"][data-module="hero-ask"][data-items="4"]`
- `section[data-section="faq"][data-intent="answer what people ask right now"][data-layout="contained"][data-module="faq"][data-items="3"]`
- `section[data-section="topics"][data-intent="route to a help topic"][data-layout="grid"][data-module="topic-tiles"][data-items="9"]`
- `section[data-section="invites"][data-intent="urgent: report fraud · plan: book a meeting"][data-layout="grid"][data-module="promo-band"][data-items="2"]`
- `body[data-template="landing"]`

## Unsourced content (placeholder list)

(none) — every literal is captured-verbatim; "Meny" is direction-authorized chrome.

## Unsourced / Excluded from the content gate

- Nothing excluded by the page module. The checker skips captured `hidden` FAQ bodies by rule; they are rendered anyway (closed details) — 3 bodies, 22 links, 2 illustrations.
- Decorative chevron SVGs (`arrow-right`, `faq__new-window`, accordion chevrons) are not carried — the title/summary is the control.

## Open questions for craft (resolved in render)

- Chat field disabled vs. posting to site search: disabled (no invented behaviour; owner decision #6).
- FAQ question-page link: the captured link had only a visually-hidden name; rendered as a visible link with the question text (verbatim string) so the answer has a findable "full answer" path.
- Inner answer headings: captured h2/h3/h4 inside an h3 question → demoted two levels (h4/h5/h6) to keep the outline valid; text verbatim.

## Validation (final clean pass)

- `validate-prototype.mjs`: PASS — 0 P0/P1 at 1440 / 768 / 390 (console clean, no network failures, no horizontal overflow, landmarks present, alt/labels ok, 1 h1, 0 heading skips, 0 low-contrast nodes, LCP = hero photo eager/high at all three widths, burger opens/closes + Escape, first FAQ details opens, primary CTA reachable by keyboard, tile hover); 360 nav audit clean (`data-nav-collapse="hamburger"`). Heights 390: 4935 · 768: 3692 · 1440: 3013 (captured live page: 4100 at 1440). Remaining P2: six sub-40 px targets (canon router label + "Se alle banker" summary, the chat-field label, two `.link-more` question links at 25 px, canon office-search label) — advisory.
- `content-check.mjs`: PASS — 62 texts, 194 hrefs, 15 images verbatim; 0 missing. The checker skips the captured `hidden` FAQ bodies by rule; they render regardless (closed details, 3 bodies / 22 links / 2 illustrations). Excluded by rule only: chevron/decoration SVGs.
- `impeccable detect --json`: 6 × cramped-padding on `.movement` / `.hdr-utility` / `.contact` / `.footer-*` — static-CSS misreads of `padding-block: var(--section-padding)` (same set as canon). Dismissed; nothing else flagged.
- Vision gate (Worker B, 3 viewports vs `stardust/current/assets/screenshots/nb-bank-privat-kundeservice-html.png`): pass — hub reads as the same brand, calmer: photo at content scale, hairline shelves instead of 13 shadowed cards, FAQ on the help paper, two invitations on Sand; H1 and the ask land in the first screen at 390.
- `data-deviation` elements: none (no canon deviations; disabled-control styling is page-local CSS on `.ask-input:disabled` / `.ask .btn:disabled` — canon request filed in `canon-requests.md`).

## Review (impeccable finish reviewer, fresh context, code-led)

- Round 1 disposition **fix** — 8 items (5 material, 3 minor): (1) mobile order — photo before the ask block pushed the module's action and "Sperre bankkort" below the fold; (2) tile hit area limited to the title glyphs; (3) disabled chat controls rendered as enabled; (4) dangling `aria-describedby="ask-note"`; (5) inner FAQ answer headings at the same 31 px step as the question; (6) sticky photo at 768 left a void; (7) tool description baselines misaligned at 1440; (8) `.faq-more` link not underlined. All applied in one batch — fix 4 uses the captured chat-field string `data-chat-error` ("Chatten er dessverre ikke tilgjengelig, prøv igjen senere.") as the visible note; fix 3 uses Mørkgrå (5.7:1) instead of DESIGN's Grå because Grå text on Hvit is 2.3:1.
- Verdict pass 1: 7 resolved, fix 1 partial (the photo landed between the form and the tool shelf). Redo: hero as one named-area grid; at ≤ 640 the H1 sits beside a 3:2 photo at 44 % width, then ask block, then tools — keeps the page's one eager image in the first screen (dropping it below the fold made the harness flag the lazy canon router art as LCP).
- Verdict pass 2: **ship** — fix 1 resolved, no regressions; one minor polish (tools shelf 24 px under the photo at 1440) applied afterwards (`.tools{margin-top:var(--spacing-lg)}` at ≥ 1024) and re-validated.
- Kept per the reviewer: four-movement paper rhythm (Hvit → Frost-30 → Hvit → Sand-30), hairline tiles without card chrome, one Vann action per module.
