---
_provenance:
  writtenBy: stardust:direct (Phase 3 — target strategy; impeccable init.md used as the format spec, no interview: answers come from stardust/direction.md)
  writtenAt: 2026-09-14T21:12:00Z
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  readArtifacts:
    - stardust/current/PRODUCT.md (descriptive current state — product truth carried forward)
    - stardust/direction.md
    - stardust/prototypes/nb-bank-privat-html-improvements.md
  synthesizedInputs: []
  mode: target-state
---

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static, self-contained HTML prototypes (one file per archetype) rendered against DESIGN.md tokens, migrated by `stardust:migrate` to platform-agnostic static HTML and delivered to AEM Edge Delivery Services (blocks + DA documents) by `stardust:deploy` / `rollout`. No build step. Fonts self-hosted (customer pilot, see direction.md A5). _provenance: stardust flow decision (Flow B = redesign → prepare-migration → migrate → rollout)._

## Users

Norwegian retail customers (privat) and small/medium businesses (bedrift) of the SpareBank 1 alliance — choosing a mortgage, car loan or refinancing, opening accounts and cards, saving in funds or for children, sorting out pension, buying insurance (Fremtind), getting help (FAQ, block a card, report a claim, complain). A third audience reads about the alliance (press, investors, careers, sustainability, privacy). Scene: most often on a phone, mid-task, in bokmål; routed to one of 12 regional banks by postcode or location. _provenance: current/PRODUCT.md § Users (observed); scene inferred from mobile-first brief + task-led IA._

## Product Purpose

The shared site is the alliance's product and service catalogue: explain each product plainly, show prices and conditions once a bank is chosen, and hand off to the authenticated bank or an application flow. Success = a started application, a log-in, a booked adviser meeting, or a self-served answer. The redesign changes how this is presented — calmer, clearer, one action per module — not what is said: every heading, paragraph, CTA label, href, image and FAQ is preserved verbatim.

## Positioning

Not one bank but an alliance of independent local savings banks with one brand, one platform and shared products: "Vi er flere banker i hele Norge". Local advisers everywhere, national digital services, LOfavør member benefits. A neighbouring bank cannot truthfully claim the local-and-national pairing; the redesign makes that pairing the page's signature (the alliance router in every first viewport) instead of a chrome band. _provenance: observed (bank-choice band copy on 70/100 pages)._

## Operating Context

Every shared-site page carries the header (audience switch + 9 market sections + Søk / Bli kunde / Logg inn), the bank-choice router, a back-link, content modules, an FAQ accordion, the page-feedback strip, the "Kontakt oss" channel row and the Fjell footer. Bank-specific prices and rates load after a bank is chosen (host-bound services — see `stardust/dynamic-features.md`). Regulated financial copy (rate examples, IPIDs, vilkår, personvern) is not editorial and is preserved verbatim. Login and application flows live on `/bank/nettbank-privat/*` and `kundeforsikring.sparebank1.no` (linked, not migrated).

## Capabilities and Constraints

- Scope: 9,821 URLs across 13 properties; iteration 1 = 100 pages on `/nb/bank/` in 13 archetype families (`stardust/current/_page-types.json`); one design system for all properties.
- Interactive surfaces that are content: bank-choice (postcode/geolocation), FAQ accordions, page feedback, loan/savings/currency calculators (React, interim static shells), price cards fed by a rate service, YouTube embeds, glossary modals, article listings (`*.export.json` → query index), share links. Dispositions in `stardust/dynamic-features.md` (20 features; 13 self, one owner batch, 3 decided-out).
- Constraints (walls): brand-faithful (palette + faces pinned); legacy content preserved verbatim; WCAG 2.1 AA (forskrift om universell utforming av IKT); mobile-first (390 px first); IA-priority preservation — audience routing and the Logg inn / Bli kunde actions stay in the first viewport; signature preservation — the alliance landscape illustration, flat spot illustrations and the large-radius photo mask are carried, not flattened.
- Terminology: bokmål throughout; LOfavør, BSU, BankID, Vipps, eFaktura, AvtaleGiro, IPID, Fremtind, nettbank/mobilbank. Never translate or reword.
- Undecided (owner): CORS/proxy for bank lookup, loan-calculator API, rates, feedback logging; boost.ai chat; Adobe tags/CMP; site search; regional trees (later iterations).

## Brand Commitments

Name "SpareBank 1" with the red "1" mark (`stardust/current/assets/logo.svg`); the proprietary SpareBank1 type family (Title-Medium for display/headline, Medium for titles, Regular for body; `arial, sans-serif` fallback); the FFE nature-named palette — Fjell `#002776`, Vann `#005aa4`, Skog (action green) `#00754e`, Natt `#001032`, Frost `#7eb5d2`, Sand `#f8e9dd`, Syrin, Multe, Lyng, Bær, Nordlys, Sol; white page ground; pill buttons; the large-radius photo mask; flat four-colour spot illustrations; the "Vi er flere banker i hele Norge" router. Voice: second-person bokmål, sentence case, short imperative CTAs — inherited verbatim.

## Evidence on Hand

- 100 live Playwright renders: `stardust/current/pages/<slug>.json` + `.html` (settled DOM), full-page screenshots in `stardust/current/assets/screenshots/`.
- Fonts (3 woff2) in `stardust/current/assets/fonts/`; logo + favicon; clientlib CSS/JS; `_ffe-tokens.json` (185 tokens); `_brand-extraction.json`; `_modules.json`; `_page-types.json`; `_dynamics.json`.
- Reference research (refero): Fruitful, Open Collective, MANNA, Munro Partners — cited in `stardust/direction.md § Anchor references` and `DESIGN.json.extensions.divergence.references_used[]`.
- Absent (never fabricate): bank-specific prices/rates beyond the captured rate examples, calculator internals, testimonials beyond published kundehistorier, statistics, awards.

## Product Principles

1. **One brand, many banks** — the route to a regional bank is one step away on every page, in the first viewport, and it is the brand's signature rather than a chrome band.
2. **Say it once, plainly** — one headline, one lead, one action per module; hierarchy through a real type scale, not through more boxes.
3. **Photography is content** — real people at real size, uncropped, beside the words they belong to; never a thumbnail in a card corner.
4. **Self-service before contact** — tools, FAQ answers and guides come before the contact row, which is always present.
5. **Preserve regulated copy verbatim** — terms, rate examples, IPIDs and privacy text are not editorial and are never reflowed into placeholders.

## Accessibility & Inclusion

WCAG 2.1 AA is a legal requirement for this site (forskrift om universell utforming av IKT). Targets: body text ≥ 4.5:1 on every ground including tints; visible 2 px Sol `#dc8000` or Vann focus ring on every interactive element; 44 × 44 px touch targets; skip links ("Til hovedmeny", "Til hovedinnhold") kept; sentence-case headings in strict order (one H1); accordions with `aria-expanded`; decorative illustrations `aria-hidden`; `prefers-reduced-motion` respected; no text over photographs without a measured ≥ 4.5:1 scrim (direction bans the pattern outright).
