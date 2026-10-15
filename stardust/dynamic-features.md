<!-- _provenance: writtenBy stardust:dynamics (Phase 3 triage, curated under hands-off — replica Phase 2 gate); writtenAt 2026-09-14T16:05:00Z; againstInput stardust/current/_dynamics.json (13 archetypes + reach from 100 crawled pages), stardust/dynamics/dynamic-features.generated-plan.md (29 drafted rows); targetOrigin https://main--sparebank1--paolomoz.aem.page -->

# Dynamic features — sparebank1.no (/nb/bank/, iteration 1)

## Listings contract

Content types that feed listing blocks. Every migrated page emits these `<meta name>` fields so the
query index (`helix-query.yaml`, written at rollout) can drive the listing blocks:

| content type | pages | meta fields | index | consumers |
|---|---|---|---|---|
| news-article (`/nb/bank/om-oss/nyheter/*`) | 6 in roster (560 on site) | `title`, `description`, `image`, `published-time` (from `article:published_time`), `category` (kicker, e.g. SVINDEL), `template: news-article` | `/nb/bank/om-oss/nyheter/query-index.json` | news-listing (`nyheter.html`, 32 cards), "Nyheter fra SpareBank 1" rail on om-oss, "Relaterte artikler" rail on articles |
| markedsnytt article (`/privat/sparing/markedsnytt/artikler/*`) | 2 in roster | same + `tema` (temaFilter) | `/nb/bank/privat/sparing/markedsnytt/query-index.json` | markedsnytt-listing, "Markedsnytt" rail on privat / sparing / pensjon hubs |
| FAQ (`Spørsmål`, `/kundeservice/**`) | 12 in roster (~1,300 on site) | `title`, `description`, `category` (kundeservice section), `template: faq` | `/nb/bank/query-index.json` | "Hva lurer andre på?" accordions are **editorially curated** (each product page picks its questions) → authored rows, not index-driven; "Se flere spørsmål og svar" links to the kundeservice hub |
| product / hub cards (visual-nav, static-cards, related-products, prices) | — | none | none | **editorially curated** on the live site (AEM authors pick cards) → authored block rows, verbatim |

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | bank-choice | "Vi er flere banker i hele Norge" bank selector: 4-digit postcode → the banks whose postal ranges contain it (one → "Fortsett til <bank>" with logo; several → matches first + "Se resten av bankene"; none → all), "Se alle banker" ⇄ "Skjul bankene", invalid-input message; every bank links to the current page under that bank | F+D | 70/100 | rebuild-native + data-fed (snapshot) | self | done | search-control + collapse + off-origin-data Tier 2 | none for the flow — the source filters **client-side** over `window.bankPickerlist` (no service; the earlier "postcode→bank service" reading was wrong). SB1 owns the postal-range table: refresh with `sync-snapshots.mjs bank` | spike-a detect + flow probe 2026-10-15: no XHR on postcode input; 12 banks × `postalRange`, identical on all 70 picker pages; 5 pages with per-bank link fallbacks. `data/bank-choice/banks.json`. Published 1440+360: 34/34 identical steps × 4 pages |
| 1a | bank-choice — "Bruk min posisjon" | browser geolocation → postcode → same filter | A | 70/100 | data-fed (endpoint indirection, disabled) | needs-backend | scaffolded-awaiting-owner | off-origin-data Tier 1 | **owner: SB1 — expose `GET /openapi/nettsider/ressurser/bank/postnummer/geolocation/{lat}/{lon}` cross-origin (or same-origin) for the EDS host**, then flip `bankChoiceGeolocation.enabled` in `scripts/site-config.js`. A third-party reverse geocoder would send visitors' coordinates elsewhere — a privacy decision this run does not take. Interim: button not rendered | host-bound (no CORS headers; preflight 401) |
| 1b | bank-choice — last visited bank | "Gå videre til banken din / Sist besøkte du" prefilled state from a functional cookie behind consent | F+T | 70/100 | rebuild-native (deferred) | needs-business-decision | interim | consent-gated | **owner: SB1 — functional cookies + CMP on the new host (with #15).** Interim: first-visit state on every visit | `data-header-prefilled`, `data-optinfunk-*` on `.bank-choice` |
| 2 | overlay-btn bank-choice modal | Product CTAs ("Søk boliglån", "Bli kunde", "Søk finansieringsbevis", `href="#"` / `.overlay-btn`) open a bank-choice dialog before redirecting to the chosen bank's flow | M | 66/100 | rebuild-native | self | pending → Phase 5 (rollout D2) | modal-loader | none — the dialog is the same 12-bank list as #1; CTA keeps its href (application app URL) as the no-JS path | rows 22, 23, 24; `.bank-choice-overlay[role=dialog]` per button |
| 3 | login modal | "Logg inn" header button opens a login-choice dialog (nettbank privat / bedrift / forsikring) | M+X | 100/100 | rebuild-native | self | pending → Phase 5 | modal-loader | none — links to the existing authenticated apps (`/bank/nettbank-privat/*`, kundeforsikring) which stay on the source host (decided-out below) | row 25 (`loginModal`, reach 16/100 explicit), `#login-choices` DOM |
| 4 | FAQ accordion | `.ffe-accordion` items expand/collapse (`aria-expanded`), "Se flere spørsmål og svar" toggles 8→15 items | M | 27/100 | rebuild-native | self | pending → Phase 3 (prototype) | accordion | none | row 8 (`js-faq-toggle`), row 18 |
| 5 | page feedback | "Hva synes du om denne siden?" / "Var dette nyttig?" thumbs → POST to `/LogServlet` | F | 74/100 | rebuild-native (interim) | needs-backend | scaffolded-awaiting-owner | feedback-control | **owner: SB1 — analytics endpoint on the new host.** Interim: thumbs render, click shows the live site's "Takk for tilbakemeldingen" state locally, no network | `feedback--layout1/faq` on 58+39 pages; `LogServlet` in `SB1.config.urlList` |
| 6 | contact tabs | "Kontakt oss" 5 channels: Ring oss (bank picker by postcode → phone numbers), Avtal møte, Skriv til oss, Finn kontor, Chat (boost.ai) | M+F+T | 100/100 | rebuild-native (tabs + static panels) / embed-passthrough (chat) | self (tabs, panels with the 12 banks' phone numbers — captured verbatim) · needs-business-decision (chat vendor on new host) | interim | tabs + static-snapshot | **owner: SB1 — boost.ai chat on the new host.** Interim: chat tab links to the live chat page | `#contact-us` DOM: 5 tabs, 5 hidden panels incl. per-bank phone list |
| 7 | loan calculator (`#boliglan-kalkulator`) — "Hvor mye koster lånet?" | kjøpesum / egenkapital / ønsket lånebeløp / rente (0,01–10 %) / nedbetalingstid (1–30 år) → månedlig beløp, effektiv rente, kostnad etter skattefradrag, egenkapital %, nedbetalingsplan (år → måned), priseksempel (both tabs) | F | 2/100 (boliglan, lanekalkulator) | client-only | self | done | client-compute | none — annuity + fees + 22 % tax deduction + IRR lifted from `POST …/annuity-loan` (`scripts/calc-math.js`); product numbers from `window.sparebank1Config` (authored rows in the copy; captured defaults otherwise) | math vs service 90/90; published 1440+360: 6/6 input sets identical on 2 pages, plan 28/28 rows |
| 7a | loan calculator — "Hvor mye kan jeg låne?" | antall låntakere / barn / biler, inntekt, gjeld → lending capacity | A | 2/100 | data-fed (endpoint indirection, disabled) | needs-backend | scaffolded-awaiting-owner | off-origin-data Tier 1 | **owner: SB1 — expose `POST /api/personal/banking/boliglan-kalkulator/economy` cross-origin or same-origin**, then flip `loanEconomy.enabled`. The service is a credit model (SIFO "Loke" budgets, tax, stress test) — not lifted client-side (that would fabricate figures). Interim: live controls; the authored answer for the authored inputs; otherwise "Beregningen av lånebeløp er ikke koblet til på denne siden ennå." + link to the source calculator (run-owned interim copy) | host-bound; owner-enabled replay: byte-identical request, identical result (2 484 500 kr) |
| 8 | savings calculator (`sparekalkulator.js`) | "Spar hver måned" / "Sett et sparemål": amounts + years + risk → expected amount / required monthly saving, risk profile, recommended product, start-saving link, "Se avkastning med ulik risiko" | CR+A | 1/100 (sparekalkulator; spare-i-fond no longer mounts it) | client-only + data-fed (assumption snapshot) | self | done | client-compute + off-origin-data Tier 2 | none for the flow — formulas lifted from `GET …/savingscalculator/{expected-performance,required-savings}` (the widget was API-backed, not pure client compute); expected return + product per (risk × 0–50 years) = the service's own table, `sync-snapshots.mjs savings`. **Content:** the original DA page has no calculator; the new `savings-calculator` section lives in the `/spike-a` copy — adopt at rollout | math vs service 14/14; published 1440+360: 12/12 input sets identical |
| 8a | savings calculator — fund factsheet | product name → factsheet pop-up (NAV, returns, allocation, fees, documents) | A | 1/100 | data-fed (deferred) | needs-backend | interim | off-origin-data | **owner: SB1 — fund data feed (`fund/products/available` + Morningstar) for the new host, or keep factsheets on the source.** Interim: name as text, "fondsoversikten" link kept | daily market data |
| 9 | currency converter | valutakalkulator: any of 31 currencies ⇄ any, amount → result + "1 X = y Z", rate list ("Se valutakursliste") | CR+A | 1/100 | data-fed (dated rate snapshot) + client-only conversion | needs-backend | interim | off-origin-data Tier 2 + client-compute | **owner: SB1 — rate feed: expose `GET /openapi/nettsider/ressurser/bank/valutakurser` cross-origin (then flip `currencyRates.enabled`) or schedule `sync-snapshots.mjs currency`.** Interim: snapshot with "Kurs per <date>" (Oslo time); the rate list (`table` variant `rates`) reads the same snapshot | conversion = buy→NOK→sell, rate line buy(to)/sell(from); published 1440+360: 10/10 identical on identical rates; rates moved intraday during the run |
| 10 | price cards / rate examples | "Finn boliglånet som passer deg" cards + "Priseksempel: Nominell rente 5,33 %…" | D | 10+ | static-snapshot | self | delivered-by-capture | snapshot | none — rates are authored copy on the live page (change with bank choice via #1) | prices component; row 17 |
| 11 | news / markedsnytt listings | `nyheter.export.json`, `artikler.export.json`, `hjemme.export.json` feed card rails (limit/offset/temaFilter) | D+L | 12/100 | index-backed | self | pending → Phase 5 (rollout, query-index) | listing-index-backed | none — listings contract above; the 6+2 roster articles seed the index, the remaining 554 news articles are content-pending (later iteration) | rows 9–12 (dead on target = expected: replaced by query-index), 20, 21 |
| 12 | footer JSON | `/bin/sb1/components/footer?bank,lang,market` (frontend-clientlib pages fetch the footer) | A | 12/100 | static-snapshot | self | delivered-by-capture | snapshot | none — footer is authored once as the shared `/footer` fragment (captured verbatim) | row 2 |
| 13 | `digitalData` / `SB1.config` | CMS settings object (bank, market, pageType, ids) | A | 100/100 | static-snapshot → page metadata | self | pending → Phase 5 | read-settings | none — `market`, `pageType`, `bank` become page `<meta>` (template, market) | row 1 |
| 14 | client-rendered main (news / campaign / nyheter listing) | `nettsider-frontend` pages render `<main>` client-side (0 → 2,400–4,400 chars) | CR | 12/100 | static-snapshot | self (settled DOM captured on all 12 — none blank) | delivered-by-capture | settled-dom-snapshot | none — the 12 captured settled DOMs are complete; **no human-capture batch needed** (verified text lengths 2,401 / 2,798 / 4,359) | rows 5, 6, 7 |
| 15 | Adobe Analytics / Target / Edge (`adobedc.demdex.net`, `edge.adobedc.net`), consent dialog (`optin`) | T | 100/100 | embed-passthrough (deferred) | needs-business-decision | decided (interim: none) | consent-gated-tags | **owner: SB1/Adobe — Launch/Web SDK property + CMP for the pilot host.** Interim: no tags, no consent dialog (pilot); documented in the register | row 26 |
| 16 | YouTube embeds | iframes (4 pages) + runtime-injected podcast/video embed on markedsnytt | V | 8/100 | embed-passthrough | self (public ids) · needs-human-capture for the src-less iframe | pending → Phase 5 | media-as-url | resolve the runtime src from the settled DOM at deploy; else link | rows 27, 28 |
| 17 | glossary modal | `glossary-modal` term pop-ups (81 instances) | M | ~20/100 | rebuild-native | self | pending → Phase 5 | modal-loader | none | `_modules.json` |
| 18 | locale trees | nynorsk `/nn/sogn-fjordane/*` alternates on 9/13 archetypes; 12 regional-bank alternates in the bank list | I18N | 100/100 | rebuild-native (later iteration) | needs-business-decision | decided: **out of iteration 1** | locale-tree | scope: iteration 1 = `/nb/bank/` only (A1); alternates link to the live regional pages | rows 13, 14 |
| 19 | sign-in / account links | Logg inn → `/bank/nettbank-privat/*`, `kundeforsikring.sparebank1.no` | X | 100/100 | decided-out | needs-backend | decided-out | — | authenticated apps stay on the source host; every link preserved | row 29 |
| 20 | search (`Søk` header button → `?search=`) | Site search results page | S | 100/100 | rebuild-native (later) | needs-business-decision | decided: **interim link** to live search | search + results | **owner: decide index-backed EDS search vs. Solr passthrough.** Interim: the Søk button links to `https://www.sparebank1.no/nb/bank/privat/kundeservice.html?search=` | header DOM `search-toggle`; robots `Disallow: /*?search*` |

## Decision batch (one message to the owner — SpareBank 1 / Bertrand)

Everything below ships in an **interim tier** now and is upgraded when the decision lands:

- **Backend / APIs (CORS or proxy on the EDS host):** geolocation → postnummer for "Bruk min posisjon" (#1a), boliglån economy API for "Hvor mye kan jeg låne?" (#7a), currency rate feed (#9), fund data feed for the savings factsheet (#8a), page-feedback logging (#5). The postcode → bank lookup (#1), the loan cost tab (#7) and the savings calculator (#8) need nothing — they ship.
- **Vendors on the new host:** boost.ai chat (#6), Adobe Launch / Web SDK + consent (CMP) (#15).
- **Consent:** functional cookies on the new host for the remembered bank (#1b, with #15).
- **Product decisions:** site search — EDS index-backed vs. Solr passthrough (#20); locale/regional-bank trees — later iterations (#18).
- **Content:** runtime-injected podcast embed src on markedsnytt (#16) — one human capture, or link.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| Nettbank / mobilbank / forsikring log-in and application flows (`/bank/nettbank-privat/*`, `kundeforsikring.sparebank1.no`) | authenticated first-party apps, session-bound | Links preserved verbatim to the current host; not part of the public-site migration. |
| Adobe Analytics / Target / consent dialog (pilot) | tag property and CMP are owner-configured; a pilot host must not fire production tags | No tracking on the pilot origin. Re-add via Launch/Web SDK at go-live (owner decision). |
| Regional-bank and nynorsk trees | out of iteration-1 scope (A1) | Alternates link to the live regional pages until those properties migrate. |

---

## Flow B re-record (redesign, prepare-migration Phase 4.5) — 2026-09-14T23:20:00Z

<!-- _provenance: writtenBy stardust:dynamics (Phase 4.5 gate, Flow B hands-off); reuse of the Flow A triage above — same site, same 100-page roster, same 13 archetypes, same 29 detector findings → 20 features; no re-detection (A7 in stardust/direction.md) -->

Gate result: **20/20 rows carry a disposition** (13 `self`, 1 owner decision batch, 3 decided-out) — PASS. Decided-out items stay out (authenticated apps, pilot tags/CMP, regional + nynorsk trees). Listings contract unchanged (`helix-query.yaml` written at rollout; two indexes).

Redesign-specific deltas in how the interim tiers render inside the Flow B prototypes (behaviour unchanged, markup re-composed):

| # | feature | Flow B prototype rendering |
|---|---|---|
| 1 | bank-choice router | compact Vann band under the header; postcode `<form action="#alle-banker">` (4-digit pattern), "Bruk min posisjon" submit; the 12-bank list (name, tagline, href) is a native `<details>` — no JS; geolocation/lookup still owner-bound |
| 2 | overlay-btn CTAs (`href="#"`) | kept as `#` action buttons (Skog) — dialog at rollout D2 |
| 3 | login | "Logg inn" links to the captured `data-login-url` (https://login.sparebank1.no/); login-choice dialog at rollout D2 |
| 4 | FAQ accordion | native `<details>/<summary>` (`.faq`), all items rendered incl. the "Se flere" overflow — no JS |
| 5 | page feedback | static thumbs (`type="button"`), no network |
| 6 | contact tabs | five `<details>` disclosures in the footer contact row carrying the captured panels verbatim (12 banks × Privat/Bedrift numbers, hours, abroad numbers; bank link lists for møte/melding/chat); office search posts to the captured site-search URL (interim) — the postcode bank-picker inside each panel is not rendered (host-bound lookup; the full list replaces it) |
| 7/8/9 | calculators | static shells of the captured widget text with controls `disabled`; no invented copy |
| 11 | listings | captured cards rendered; index-backed at rollout |
| 16 | YouTube | captured iframe src with `loading="lazy"` + `title`, or a link when the src is runtime-injected |
| 17 | glossary modal | term kept as text; dialog at rollout D2 |
| 20 | search | header "Søk" links to the captured `?search=` URL |

The only JavaScript in any prototype is the ≤10-line mobile-nav a11y script (proposed-file-shell § Hard requirements #1).

---

## spike-a dynamics run (Phases 1–5) — rows #1, #7, #8, #9 — 2026-10-15

<!-- _provenance: writtenBy stardust:dynamics (Phases 1–5, hands-off, scoped to rows 1/7/8/9); branch spike-a; preview https://spike-a--sparebank1-redesign--paolomoz.aem.page; every other row unchanged -->

**Phase 1 — detect.** `dynamics-detect.mjs` on the six source pages carrying the four features (`stardust/dynamics/spike-a/detect/`) plus flow probes of each widget (inputs driven, XHR bodies + responses recorded). What changed in the reading:
- #1: the postcode filter makes **no request** — `window.bankPickerlist` (12 banks × postal ranges) is in every page; only "Bruk min posisjon" calls a service (`…/bank/postnummer/geolocation/{lat}/{lon}`). Bank links go to the **same page under each bank** (65/70 pages; 5 fall back to an ancestor) — the migrated list linked every bank to `/privat.html`.
- #7: two services — `annuity-loan` (deterministic, liftable) and `economy` (SIFO/tax/stress-test credit model, not liftable). Fees differ per tab (1 500 vs 2 900, `window.sparebank1Config`).
- #8: **API-backed**, not pure client compute — `expected-performance`, `required-savings`, `suggested-savings-product`, `fund/products/available`. The detector filed `suggested-savings-product` as class S (it matched "suggest") — it is A.
- #9: `GET …/valutakurser` (31 entries incl. NOK itself); cash tab disabled and swap hidden on the source.
- No service sends CORS headers (preflight 401) → all host-bound on the EDS origin (`dynamics-plan.mjs --target-origin`: 3/3 recorded paths dead, 404).

**Phase 2–3 — classify, triage.** Rows split so every axis is honest: 1 / 1a / 1b, 7 / 7a, 8 / 8a, 9 (table above). Owner decisions recorded by name in the decision batch; none written as decided-out.

**Phase 4 — implement** (commits on `spike-a`): `scripts/calc-math.js` (pure, replayed against the services by `stardust/scripts/dynamics/verify-calc-math.mjs`: annuity 90/90, expected-performance 8/8, required-savings 6/6), `scripts/site-config.js` (owner switches, all disabled), `data/{bank-choice,currency,savings-calculator}/` snapshots + `_provenance.json` (`stardust/scripts/dynamics/sync-snapshots.mjs`), blocks `bank-router`, `calculator`, `converter`, `table` (`rates`), new `savings-calculator`. Content copies (DA, previewed on `spike-a`, `robots: noindex`): `/spike-a/nb/bank/privat/lan/lanekalkulator` and `/spike-a/nb/bank/privat/lan/boliglan` (tab-2 + fee rows), `/spike-a/nb/bank/privat/kundeservice/verktoy/sparekalkulator` (savings-calculator section), `/spike-a/nb/bank/privat/kundeservice/verktoy/valutakalkulator` (`table disclose rates`). No existing DA document modified or published.

**Phase 5 — verify.** Flow harnesses (`stardust/scripts/dynamics/parity/`, source widget ↔ migrated block, same inputs) on the published preview at 1440 and 360 — results in `stardust/dynamics/spike-a/published/`: router 34/34 × 4 pages · loan tab 2 6/6 × 2 pages, tab 1 default identical, plan 28/28, not-connected state shown, owner-enabled economy byte-identical · savings 12/12 · currency 10/10. `dynamics-check.mjs` replay of `stardust/dynamics/parity.json`: **16/16 PASS** (`stardust/qa/dynamics-report.md`). Defects the replay found and fixed: rate-line rule (buy/sell), payment-plan total label, economy body key order, projected amounts truncate (not round), NOK listed twice.

