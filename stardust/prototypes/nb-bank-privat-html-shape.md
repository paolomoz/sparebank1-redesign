<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, canon author)
  writtenAt:        2026-09-14T21:40:00Z
  page:             nb-bank-privat-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-privat-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-privat-html.json
    - stardust/current/pages/nb-bank-privat-html.html (rendered DOM; outline via stardust/scripts/page-content.mjs)
    - stardust/current/_brand-extraction.json
    - DESIGN.md, DESIGN.json, stardust/direction.md
    - stardust/prototypes/nb-bank-privat-html-improvements.md
  conceptSeed:      surface roll key 3169e2f5 (mode persuade) — dealt 4, 5, 3 of the ordered structure list; 4 leads and is built (hands-off: the decision page is an interactive gate; the brief is the record)
  capturedSourceLineage:
    - header — site-wide system-component (`_brand-extraction.json#systemComponents[kind=header]`, variant privat)
    - bank-router — site-wide complementary landmark `.bank-choice` (70/100 pages); signature § 8b
    - h1 — `main > h1.visually-hidden` "Privat" (captured hidden; kept hidden, verbatim)
    - campaign — `main > div.campaign-carousel` (1 slide captured; bg #F2F2F9 = Syrin-30)
    - products — `main > div.background-container > div.columns-grid` ×2 (6 columns: Boliglån · Daglig Bruk · Spare / Forsikring · Billån · Kundeservice), `<hr>` ×2 dropped (direction: dividers → space)
    - membership — `main > div.banner-small` ×2 (Bytte bank til oss? · Er du medlem i et LO-forbund?) — captured `bg-color4` beige stripe = Sand-30
    - news — `main > div.related-topics` "Nytt og nyttig" (4 newsfeed cards)
    - index — `main > div.columns-grid` (OM OSS · SNARVEIER)
    - compare — `main > div.text` "Sammenlign priser"
    - footer — site-wide system-component (contact-section + footer columns + legal row)
  antiTemplatePass:
    - { pattern: "campaign hero", defaultReflex: "centered stack over photo with two buttons", alternatives: ["centered stack", "7/5 split, photo left as content (MANNA / Fruitful)", "type-only inversion"], picked: "7/5 split, photo left", rationale: "photo is the campaign's content; left-anchored split is the direction's hero rule; the type-only inversion would drop the captured photograph", reference: "refero 3e14bbe4 MANNA, d8a01033 Fruitful" }
    - { pattern: "product columns", defaultReflex: "5-up image-card grid", alternatives: ["card grid with shadows", "3×2 illustration + heading + links tiles, no card chrome", "typographic ledger"], picked: "3×2 tiles without chrome", rationale: "the captured column shape IS the alliance's catalogue; tiles keep the spot illustrations (signature) and drop the shadowed card; a ledger would flatten the illustrations" }
    - { pattern: "news rail", defaultReflex: "white cards + shadow + chevron", alternatives: ["shadowed cards", "flat tinted papers, photo 3:2 with one-corner mask, meta under title", "text list"], picked: "flat tinted papers", rationale: "improvements #4 — one card language; photo kept at native ratio (#6)" }
    - { pattern: "promo banners", defaultReflex: "two full-width banners stacked", alternatives: ["stacked bands", "two papers side by side on one Sand movement", "merge into one"], picked: "side by side on Sand-30", rationale: "one movement, two offers, one action each; captured beige stripe = Sand" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: campaign, paper: Syrin-30, purpose: "captured campaign ground (#F2F2F9); the page's one offer moment" }
      - { section: membership, paper: Sand-30, purpose: "captured beige stripe (icid sb1u_beigestripe); warm paper for the two invitations" }
  voiceClassification:
    - { section: header, classification: captured-verbatim, source: header links/CTAs; "Meny" = direction-authorized chrome (burger label, friction #3) }
    - { section: bank-router, classification: captured-verbatim }
    - { section: campaign, classification: captured-verbatim }
    - { section: products, classification: captured-verbatim }
    - { section: membership, classification: captured-verbatim }
    - { section: news, classification: captured-verbatim }
    - { section: index, classification: captured-verbatim (labels "OM OSS" / "SNARVEIER" kept as captured uppercase strings) }
    - { section: compare, classification: captured-verbatim }
    - { section: footer, classification: captured-verbatim; "Søk etter et kontor" form = captured label; office search posts to the captured site-search URL (dynamics #6/#20 interim) }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "bankchoice_bg.svg", mechanism: "router band, reduced-scale illustration at the right edge ≥1024; hidden <1024 (captured hides <768)", fallback: "band renders without art" }
    - { kind: site-wide-motif, capturedSource: "flat spot illustrations /content/dam/SB1/illustrasjoner/*", mechanism: "72px tiles on white, aria-hidden", fallback: "heading + links stand alone" }
    - { kind: site-wide-motif, capturedSource: "96px photo mask (785 occurrences)", mechanism: "one-corner-pair mask 96px on the campaign photo, 48px on news photos", fallback: "square photo" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-privat-html
url: https://www.sparebank1.no/nb/bank/privat.html
register: brand
mode: persuade
surprise: low
dominantDimension: register/museum-didactic
---

# Page shape: nb-bank-privat-html (market landing, canon author)

Structure list (ordered by resonance) for the surface roll: 1 reading-room spread · 2 offer-then-ledger · 3 movements on paper · **4 router-led landing (dealt lead — built)** · 5 newspaper front · 6 single column · 7 task strip first. Dealt alternates 5 and 3 are recorded, not built (single canonical direction, hands-off).

## Sections (in render order)

1. **header** (system role `header`, canon) — two calm tiers on Hvit: utility 44 px (audience switch Privat · Bedrift · Om oss as a pill tab set, Søk icon-button, Bli kunde secondary, Logg inn action) + main 64 px (logo 140 px, 9 market links with a 2 px Vann underline on hover/current). ≤ 640: one 60 px row (logo, Logg inn, burger "Meny"); panel carries market links, audience links, Søk, Bli kunde. *Resolution of improvements #2:* one 72 px row cannot hold 9 market links + 3 audience links + 3 actions verbatim inside 1280 px; two tiers (108 px, one hairline) is the honest one-header answer.
2. **bank-router** (system role `bank-router`, module `bank-router`, canon) — Vann band ≤ 96 px: heading (title-sm, Hvit) + lede (small) · postcode label + input + "Bruk min posisjon" (secondary on Vann) · "Se alle banker" as a `<details>` that opens the 12-bank list (name + tagline, verbatim) full-width below · landscape illustration at the right edge (84 px tall) on ≥ 1024. Position: first viewport, directly under the header (IA priority § 8, treatment changed — A8).
3. **h1** "Privat" — kept `visually-hidden` as captured (one H1, verbatim).
4. **campaign** (module `campaign-carousel`, 1 slide) — Syrin-30 paper; 7/5 split: photo left (`Refinansiering_Hand_med_skjerm`, 3:2, 96 px one-corner mask, eager + fetchpriority high — the LCP), text right: display "Se hva du kan spare!", lead "Refinansier forbrukslån og kredittkortgjeld.", small tabular "Priseks.: …", action "Se hva du kan spare" (Skog — the page's one starting action; captured `ffe-button--action`). The captured photo was also a link with no accessible name; the photo is now a figure and the CTA carries the href (same URL) — no href lost.
5. **products** (module `content-columns` ×2 → one 3×2 tile grid on Hvit) — each tile: spot illustration 72 px · h2 (title 31 px, linked as captured: `<h2><a>`) · 3 links (Body). Order verbatim: Boliglån · Daglig Bruk · Spare · Forsikring · Billån · Kundeservice.
6. **membership** (module `promo-band` ×2) — Sand-30 paper; two papers side by side (Hvit + hairline): "Bytte bank til oss?" with the jubelkor illustration + p + secondary "Les mer om bankbytte"; "Er du medlem i et LO-forbund?" + p + secondary "Sjekk dine medlemsfordeler".
7. **news** (module `card-rail`) — Hvit; h2 "Nytt og nyttig"; 4 flat cards (Sand-30) 4-up → 2-up → 1-up: photo 3:2 48 px mask · title (link, whole card clickable) · meta line: tag ("Nyheter" / "Tips og råd") + date where captured. Chevron glyphs from the source are not carried (the card is the link).
8. **index** (module `content-columns`) — Hvit with a hairline top; two columns: "OM OSS" (5 links) and "SNARVEIER" (5 links) at lead size; labels rendered as captured strings in Label style.
9. **compare** (module `cta-band`) — h2 "Sammenlign priser" + p with the Finansportalen.no link (external icon).
10. **footer** (system role `footer` + `contact-row`, canon) — Hvit contact section: h2 "Kontakt oss" + "Gå til kundeservice"; 5 channels as `<details>` disclosures (Vann icon circle + name + sub-info) whose panels carry the captured content verbatim (Ring oss: Melde skade number + 12 banks with Privat/Bedrift numbers, hours, abroad; Avtal møte / Skriv til oss / Chat: 12 bank links; Finn kontor: the captured search label posting to the site search — interim per dynamics #6/#20). Fjell footer columns (Privat 7 · Logg inn 4 · Sosiale medier 2) · Natt legal row (5 small links + address).

## Layout strategy

- Density balanced: `--section-padding` 64 / 48 / 32; container 1280 with gutters 80 / 48 / 24 / 20.
- Grids: campaign `7fr 5fr` ≥ 1024 (stack photo-first below); products 3 → 2 → 1 columns; membership 2 → 1; news 4 → 2 → 1; index 2 → 1; footer columns 3 → 2 → 1; channels 5 → 3 → 2 → 1.
- No `<hr>`; movements separated by paper change (Syrin → Hvit → Sand → Hvit) and by one hairline before the index.
- Mobile-first: authored at 390 first; Logg inn stays visible in the header row at every width (IA priority).

## Key states

- Router `<details>` open/closed; office-search form (no backend, interim).
- Card hover/focus-within: Lift shadow + title underline. Reduced motion: transitions off.

## Interaction model

- Burger: CSS checkbox + ≤ 10-line a11y script (aria-expanded, Escape).
- All disclosures native `<details>`/`<summary>` (router bank list, contact panels).
- Every href verbatim from the capture (icid query strings kept).

## Data attributes

- `header[data-section="header"][data-intent="site navigation, audience switch, one action"][data-layout="contained"][data-canon][data-nav-collapse="hamburger"]`
- `aside[data-section="bank-router"][data-intent="route the visitor to a regional bank"][data-layout="contained"][data-module="bank-router"][data-canon]`
- `section[data-section="campaign"][data-intent="one offer, one action"][data-layout="split-media"][data-media="image"][data-module="campaign-carousel"][data-items="1"]`
- `section[data-section="products"][data-intent="route to product areas"][data-layout="grid"][data-items="6"][data-module="content-columns"]`
- `section[data-section="membership"][data-intent="invite: switch bank, LO membership"][data-layout="grid"][data-items="2"][data-module="promo-band"]`
- `section[data-section="news"][data-intent="cross-link: news and advice"][data-layout="grid"][data-items="4"][data-module="card-rail"][data-media="image"]`
- `section[data-section="index"][data-intent="secondary navigation: about and shortcuts"][data-layout="grid"][data-items="2"][data-module="content-columns"]`
- `section[data-section="compare"][data-intent="regulatory: compare prices"][data-layout="contained"][data-module="cta-band"]`
- `footer[data-section="footer"][data-intent="contact and site map"][data-layout="contained"][data-canon]` containing `section[data-section="contact-row"][data-module="contact-row"][data-items="5"]`
- `body[data-template="landing"]`

## Unsourced content (placeholder list)

(none) — every literal is captured-verbatim; "Meny" (burger label) is direction-authorized chrome per friction #3.

## Open questions for craft (resolved in render)

- Header: two tiers (108 px) rather than one 72 px row — see section 1.
- Campaign photo link with empty accessible name dropped in favour of the CTA (same href) — a11y fix, no CTA lost.
- Router illustration hidden below 1024 (captured hides below 768) so the compact band stays ≤ 96 px on tablets.

## Validation (final clean pass)

- `validate-prototype.mjs`: PASS — 0 P0/P1 at 1440 / 768 / 390 (console clean, no network failures, no horizontal overflow, landmarks present, alt/labels ok, 1 h1, 0 low-contrast nodes, LCP eager/high, burger opens/closes + Escape, CTA reachable by keyboard, card hover); 360 nav audit clean (`data-nav-collapse="hamburger"`). Heights 3770 / 5058 / 6992. Remaining P2: three sub-40px targets (two form labels, one inline link) — advisory.
- `content-check.mjs`: PASS — 98 texts, 223 hrefs, 15 images verbatim; 0 missing. Excluded by rule: `href="#/"` tab anchors, chevron/decoration imgs, dynamic bank-picker UI strings inside the contact panels (postcode filter label, error/empty states — dynamics #6 interim renders the full bank list instead).
- `impeccable detect --json`: 7 × cramped-padding on `.movement` / `.hdr-utility` / `.footer-*` — static-CSS misreads of `padding-block: var(--section-padding)`; confirmed as no real cramped edge by the finish reviewer. Dismissed.
- Vision gate (lead, 3 viewports vs `stardust/current/assets/screenshots/nb-bank-privat-html.png`): pass — brand-fit "that's us, refreshed" (Fjell/Vann/Skog, brand faces, alliance router, spot illustrations, one-corner photo mask), hierarchy lands on the campaign headline, calm not generic.

## Review (impeccable finish reviewer, fresh context, code-led)

- Round 1 disposition **fix** — 8 material fixes: (1) router landscape under-committed → art at band height, 38 % of the band, cropped slice below 1024; (2) market nav wrapped at 768 → hamburger below 1024, utility tier kept to 641; (3) contact channels had no disclosure affordance → inline chevron + hover underline; (4) OM OSS / SNARVEIER as `<p class="label">` → `<h2 class="title-sm">`; (5) mobile router 320 px → 228 px, campaign photo top inside the first screen; (6) six stacked product tiles ~2100 px → illustration inline-left, ~1140 px; (7) membership white bordered cards → invitations directly on Sand-30 with one hairline; (8) news photo inset in tinted paper → photo + title + meta on white.
- Verdict pass 1: 7 resolved, fix 1 partial (harness served the SVG plate at 1200×800; img had no aspect constraint) + 2 regressions from it. Fix: `aspect-ratio: 1250/368; max-height: 150px` on the router art; harness now serves SVGs at intrinsic aspect.
- Verdict pass 2: **ship** — all 8 resolved, both regressions resolved, chevron craft note resolved. Reviewer hand-off caveat: verify live CDN images fill the router landscape box and the 3:2 photo slots without letterboxing (offline plates were judged for composition/scale only).
- Kept untouched per the reviewer: the campaign composition (7/5 split, 96 px one-corner mask on Syrin-30, display headline, one Skog action) — the page's "that's us, refreshed" moment.

## Approval

`approved` at 2026-09-14 (hands-off, `approvedBy: "hands-off"`) after every gate passed; canon-author. Canon written to `stardust/canon/` and `DESIGN.json.extensions.canon` per canon-extraction.md.
