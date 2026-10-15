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
| 1 | bank-choice | "Vi er flere banker i hele Norge" bank selector: postcode → regional bank(s), "Bruk min posisjon" (geolocation), "Se alle banker" expandable list of 12 banks (links to the same path under `/nb/<bank>/`) | F | 70/100 | rebuild-native | self (postcode lookup — the source filters its server-rendered `bankPickerlist.postalRange` client-side, no API) · needs-backend (geolocation: lat/long → postcode, `/openapi/nettsider/ressurser/bank/postnummer/geolocation/*`, host-bound) | done (postcode) · scaffolded-awaiting-owner (geolocation) | search-control + collapse; data-fed snapshot (`data/bank-choice/banks.json`, `sync-bank-choice.mjs`) | **owner: SB1 — serve the geolocation endpoint same-origin on the production host, then flip `bankChoiceGeolocation` in `scripts/site-config.js`.** Until then "Bruk min posisjon" is not rendered (no dead permission prompt). Postcode lookup, "Se resten av bankene", no-match list and validation copy match the source; bank links = the current page under the chosen bank | 2026-10-15 live probe of the source widget (7 postcodes, 0 API calls) — `stardust/dynamics/evidence/bank-probe.json`; `clientlib_base` modules 1010/3004 (`filteredBankList`); parity checks 7/7 |
| 2 | overlay-btn bank-choice modal | Product CTAs ("Søk boliglån", "Bli kunde", "Søk finansieringsbevis", `href="#"` / `.overlay-btn`) open a bank-choice dialog before redirecting to the chosen bank's flow | M | 66/100 | rebuild-native | self | pending → Phase 5 (rollout D2) | modal-loader | none — the dialog is the same 12-bank list as #1; CTA keeps its href (application app URL) as the no-JS path | rows 22, 23, 24; `.bank-choice-overlay[role=dialog]` per button |
| 3 | login modal | "Logg inn" header button opens a login-choice dialog (nettbank privat / bedrift / forsikring) | M+X | 100/100 | rebuild-native | self | pending → Phase 5 | modal-loader | none — links to the existing authenticated apps (`/bank/nettbank-privat/*`, kundeforsikring) which stay on the source host (decided-out below) | row 25 (`loginModal`, reach 16/100 explicit), `#login-choices` DOM |
| 4 | FAQ accordion | `.ffe-accordion` items expand/collapse (`aria-expanded`), "Se flere spørsmål og svar" toggles 8→15 items | M | 27/100 | rebuild-native | self | pending → Phase 3 (prototype) | accordion | none | row 8 (`js-faq-toggle`), row 18 |
| 5 | page feedback | "Hva synes du om denne siden?" / "Var dette nyttig?" thumbs → POST to `/LogServlet` | F | 74/100 | rebuild-native (interim) | needs-backend | scaffolded-awaiting-owner | feedback-control | **owner: SB1 — analytics endpoint on the new host.** Interim: thumbs render, click shows the live site's "Takk for tilbakemeldingen" state locally, no network | `feedback--layout1/faq` on 58+39 pages; `LogServlet` in `SB1.config.urlList` |
| 6 | contact tabs | "Kontakt oss" 5 channels: Ring oss (bank picker by postcode → phone numbers), Avtal møte, Skriv til oss, Finn kontor, Chat (boost.ai) | M+F+T | 100/100 | rebuild-native (tabs + static panels) / embed-passthrough (chat) | self (tabs, panels with the 12 banks' phone numbers — captured verbatim) · needs-business-decision (chat vendor on new host) | interim | tabs + static-snapshot | **owner: SB1 — boost.ai chat on the new host.** Interim: chat tab links to the live chat page | `#contact-us` DOM: 5 tabs, 5 hidden panels incl. per-bank phone list |
| 7 | loan calculator (`#boliglan-kalkulator`) | React widget, two tabs: "Hvor mye kan jeg låne?" → POST `/api/personal/banking/boliglan-kalkulator/economy` (+ annuity-loan for its price example); "Hvor mye koster lånet?" → POST `…/annuity-loan`. Rate, fees and defaults are authored per bank page (`window.sparebank1Config`), not returned by the API | CR+A | 2/100 (boliglan, lanekalkulator) | client-only (cost tab) · data-fed, scaffolded (economy tab) | self (cost tab: statutory annuity + IRR effective rate over the authored rate/fees — equals the API to 1.3e-5 kr) · needs-business-decision (economy tab: SB1's lending model — tax tables, SIFO budgets, 5× cap — behind a host-bound API) | done (cost tab) · scaffolded-awaiting-owner (economy tab) | calculator (tabs; `loan-math.js`; authored sentences, numbers substituted) | **owner: SB1 — (a) route `/api/personal/banking/boliglan-kalkulator/*` same-origin on the production host and flip `loanCalculator.enabled` (wired and replayed against recorded responses), or (b) approve a client-side port of the reconstructed lending model (23/23 displayed values, ±100 kr near rounding boundaries; not shipped without approval).** Interim: economy tab = the captured example, controls inert | `stardust/dynamics/evidence/loan-analysis.md` + `loan-vectors.json` (43 recorded pairs); preflight 401, no ACAO; `test-calculators.mjs` PASS; parity checks 6/6 |
| 8 | savings calculator (`sparekalkulator.js`) | React widget on sparekalkulator: "Spar hver måned" / "Sett et sparemål" — sliders → expected amount / required monthly saving, recommended fund, risk comparison. Results come from `/openapi/personal/banking/savingscalculator/{expected-performance,required-savings,suggested-savings-product}` (host-bound), which are a closed formula over a configured (risk × horizon) product/rate table | CR+A | 1/100 (spare-i-fond carries no mount on the source today) | client-only over a data-fed snapshot | self (the table is observed from the public API — rate and product are response fields; formula exact to 1.5e-10 kr) | done | calculator → new `savings-calculator` block; `savings-math.js` + `data/savings-calculator/model.json` (`sync-savings-model.mjs`) | none to ship. Notes: re-run the sync when SB1 changes its expected-return table (`data-snapshot` on the block); fund-detail sheet (fund API, host-bound) not rebuilt — fund name as text + fondsoversikt link; goal-tab CTA sends the required monthly amount (source sends the monthly tab's — source defect, not copied) | `stardust/dynamics/evidence/savings-analysis.md` + `savings-vectors.json` (36 API pairs, 25 displayed values); parity checks 5/5 |
| 9 | currency converter | valutakalkulator: from/to currency, amount, swap, rate line; rates from `/openapi/nettsider/ressurser/<bank>/valutakurser` (host-bound, no CORS) | CR+A | 1/100 | client-only over the authored rate table (static-snapshot of the feed) | self (conversion: the source formula, transfer rates unit-normalised) · needs-backend (live rates) | interim | calculator + static-snapshot | **owner: SB1 — rate feed: route `valutakurser` same-origin on the production host and flip `currencyRates.enabled`, or keep the "Valutakursliste" table authored/synced.** Interim: the converter computes from the page's own rate table; the `/spike-b/` copy carries rates fetched 2026-10-15 and says so | `clientlib_base` modules 1373/9366; source widget vs branch on identical rates: 9.33 / 985.72 / 60.04 equal; parity checks 4/4 |
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

- **Backend / APIs (same-origin routing or proxy on the EDS host):** geolocation → postcode for "Bruk min posisjon" (#1 — the postcode lookup itself ships), loan-calculator `/economy` (#7 — or approve the reconstructed client model; the cost tab ships), currency rate feed (#9 — conversion ships on the authored rates), page-feedback logging (#5).
- **Vendors on the new host:** boost.ai chat (#6), Adobe Launch / Web SDK + consent (CMP) (#15).
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

## spike-b — dynamics Phases 1–5 on #1, #7, #8, #9 (2026-10-15)

<!-- _provenance: writtenBy stardust:dynamics (Phases 1–5, rows 1/7/8/9 only, hands-off); branch spike-b; origin https://spike-b--sparebank1-redesign--paolomoz.aem.page; other rows unchanged -->

**Phase 1–2 (detect, classify).** Scoped re-detection on the four source pages (`stardust/dynamics/spike-b/_dynamics.json`, 14 findings) plus a read of
the widget bundles and live-widget probes (`stardust/dynamics/evidence/`). Target probe on the branch origin: `boliglan-kalkulator/{economy,annuity-loan}`
and `savingscalculator/*` host-bound (404); every source endpoint answers without CORS headers (loan preflight 401). Re-classifications against the
September triage:

| # | was | evidence now | consequence |
|---|---|---|---|
| 1 | postcode lookup needs the `/openapi/…/bank/*` service | the inline chooser filters the server-rendered `window.bankPickerlist` (12 banks × postal ranges) in the browser — 0 API calls for 7 probed postcodes | `self`: snapshot the ranges, filter client-side; only geolocation stays host-bound |
| 7 | one API, one owner decision | the cost tab is the statutory annuity over **authored** rate/fees (exact to 1.3e-5 kr over 20 recorded responses); the economy tab is SB1's lending model (tax + SIFO tables) | split: cost tab `self` and shipped; economy tab keeps the owner decision, API path wired behind the flag |
| 8 | "pure client compute" | every result comes from the savingscalculator API — but the API returns its own rate and product, and is a closed formula (1.5e-10 kr) | `self` via an observed snapshot + sync script (data-fed), not via an assumed formula |
| 9 | static captured rates, controls disabled | conversion is a pure formula over the rate list the page already authors | conversion ships; only the live feed stays owner-bound |

**Phase 4 (implement).** `bank-router` (lookup), `converter` (live), `calculator` (two live tabs, economy scaffolded), new `savings-calculator`;
`scripts/site-config.js` (owner flags, all disabled); `data/bank-choice/`, `data/savings-calculator/` (+ `_provenance.json`, sync scripts in
`stardust/scripts/dynamics/`); `test-calculators.mjs` replays the recorded API responses. Each block honours its own GET field names
(`?postnummer=`, `?fra=&til=&belop=`, `?kjopesum=…&nominell-rente=`, `?maanedsbelop=…&risiko=`) so flows are linkable and replayable.
Content copies (no existing document modified): `/spike-b/nb/bank/privat/lan/boliglan` and `/spike-b/nb/bank/privat/lan/lanekalkulator` (cost-tab rows
added to the calculator block), `/spike-b/nb/bank/privat/kundeservice/verktoy/sparekalkulator` (savings-calculator section after the hero),
`/spike-b/nb/bank/privat/kundeservice/verktoy/valutakalkulator` (rate table refreshed from the feed 2026-10-15 + a dated note — interim copy written by
this run, not source copy). #1 needs no content change: the shared `/fragments/bank-router` already carries the authored bank rows.

**Phase 5 (verify).** `stardust/dynamics/parity.json` rows 1/7/8/9 → `dynamics-check.mjs` on the branch origin: **22/22 PASS**
(`stardust/qa/dynamics-report.md`, gitignored — committed copy `stardust/dynamics/spike-b/dynamics-report.md`); interactive suites at 1440 and 360 on the same origin equal the source widget's values, 0 page errors.

| # | disposition | reproducibility | status | try it |
|---|---|---|---|---|
| 1 | rebuild-native | self · needs-backend (geolocation) | done · geolocation scaffolded-awaiting-owner | any page with the router, e.g. `/nb/bank/privat/lan/boliglan?postnummer=7010` |
| 7 | client-only (cost) · data-fed scaffolded (economy) | self · needs-business-decision | done (cost) · scaffolded-awaiting-owner (economy) | `/spike-b/nb/bank/privat/lan/boliglan`, `/spike-b/nb/bank/privat/lan/lanekalkulator` |
| 8 | client-only over a data-fed snapshot | self | done | `/spike-b/nb/bank/privat/kundeservice/verktoy/sparekalkulator` |
| 9 | client-only over the authored rate table | self · needs-backend (live rates) | interim | `/spike-b/nb/bank/privat/kundeservice/verktoy/valutakalkulator` |
