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
| 1 | bank-choice | "Vi er flere banker i hele Norge" bank selector: postcode → regional bank, "Bruk min posisjon" (geolocation), "Se alle banker" expandable list of 12 banks (links to the same path under `/nb/<bank>/`) | F+A | 70/100 | rebuild-native (client-only postcode filter) | self (postcode → bank) · needs-backend (Bruk min posisjon, host-bound) | done (postcode) · scaffolded-awaiting-owner (position) | client-compute | **owner: SB1 — CORS (or same-origin proxy) for `/openapi/nettsider/ressurser/bank/postnummer/geolocation/{lat}/{long}`** → `siteConfig.bankChoiceGeolocation.enabled`; the position button is not rendered until then. Postcode filter needs nothing: the ranges are authored per bank (3rd cell) in the bank-router fragment; spike-c copy `/spike-c/fragments/bank-router` (the shared `/fragments/bank-router` has no ranges → the block keeps the earlier interim: a valid postcode opens the full list) | client-logic: locus client · `filteredBankList` (clientlib_base, module 3004: bank matches when `from ≤ postcode ≤ to` over `window.bankPickerlist[].postalRange`, inline per page, identical on privat/bedrift/om-oss/boliglan) · messages from the page data-* (`Skriv inn et gyldig postnummer (4 siffer).`, `Se resten av bankene`, `Skjul bankene`, `Fortsett til`) · position → `getPostalCodeByCoords` GET `/openapi/nettsider/ressurser/bank/postnummer/geolocation/{lat}/{long}` (cors closed from spike-c) · vectors 35/35 exact (1440 tile + 360 band) · bank links = source bankPickerlist urls 12/12 on 4 pages · `stardust/dynamics/client-logic/bank-choice/` |
| 2 | overlay-btn bank-choice modal | Product CTAs ("Søk boliglån", "Bli kunde", "Søk finansieringsbevis", `href="#"` / `.overlay-btn`) open a bank-choice dialog before redirecting to the chosen bank's flow | M | 66/100 | rebuild-native | self | pending → Phase 5 (rollout D2) | modal-loader | none — the dialog is the same 12-bank list as #1; CTA keeps its href (application app URL) as the no-JS path | rows 22, 23, 24; `.bank-choice-overlay[role=dialog]` per button |
| 3 | login modal | "Logg inn" header button opens a login-choice dialog (nettbank privat / bedrift / forsikring) | M+X | 100/100 | rebuild-native | self | pending → Phase 5 | modal-loader | none — links to the existing authenticated apps (`/bank/nettbank-privat/*`, kundeforsikring) which stay on the source host (decided-out below) | row 25 (`loginModal`, reach 16/100 explicit), `#login-choices` DOM |
| 4 | FAQ accordion | `.ffe-accordion` items expand/collapse (`aria-expanded`), "Se flere spørsmål og svar" toggles 8→15 items | M | 27/100 | rebuild-native | self | pending → Phase 3 (prototype) | accordion | none | row 8 (`js-faq-toggle`), row 18 |
| 5 | page feedback | "Hva synes du om denne siden?" / "Var dette nyttig?" thumbs → POST to `/LogServlet` | F | 74/100 | rebuild-native (interim) | needs-backend | scaffolded-awaiting-owner | feedback-control | **owner: SB1 — analytics endpoint on the new host.** Interim: thumbs render, click shows the live site's "Takk for tilbakemeldingen" state locally, no network | `feedback--layout1/faq` on 58+39 pages; `LogServlet` in `SB1.config.urlList` |
| 6 | contact tabs | "Kontakt oss" 5 channels: Ring oss (bank picker by postcode → phone numbers), Avtal møte, Skriv til oss, Finn kontor, Chat (boost.ai) | M+F+T | 100/100 | rebuild-native (tabs + static panels) / embed-passthrough (chat) | self (tabs, panels with the 12 banks' phone numbers — captured verbatim) · needs-business-decision (chat vendor on new host) | interim | tabs + static-snapshot | **owner: SB1 — boost.ai chat on the new host.** Interim: chat tab links to the live chat page | `#contact-us` DOM: 5 tabs, 5 hidden panels incl. per-bank phone list |
| 7 | loan calculator (`#boliglan-kalkulator`) | React widget (shadow DOM): "Hvor mye kan jeg låne?" / "Hvor mye koster lånet?" → POST `/api/personal/banking/boliglan-kalkulator/{economy,annuity-loan}` | CR+A | 2/100 (boliglan, lanekalkulator) | client-only (interim: static shell) | needs-backend (host-bound, cors closed) | scaffolded-awaiting-owner | calculator | **owner: SB1 — CORS (or same-origin proxy) for `/api/personal/banking/boliglan-kalkulator/{economy,annuity-loan}`** (`siteConfig.loanCalculator`). The client-side-formula alternative is withdrawn: the client only builds the request — SIFO expenses, tax, stress test and the annuity are server-side, so there is no formula to approve. Interim (unchanged): the widget's static shell with the captured example values, controls disabled | client-logic: locus **server** (capture tool said "client (with calls)" — it cannot see shadow-DOM outputs; `displayedAdjustedMaxLoanAmount` 1096100 = the shown "1 096 100 kr") · request from `window.sparebank1Config.howMuchLoan` (rate 5.33, arrangement fee, monthly fee, term 25; adults age 35, children ages 9) in `sb1-lanekalkulator.js` · cors closed from spike-c (2026-10-15) · oracle: 22-row source table `stardust/dynamics/client-logic/loan-calculator/table.source.json` |
| 8 | savings calculator (`sparekalkulator.js`) | React widget (shadow DOM) on sparekalkulator: "Spar hver måned" / "Sett et sparemål" → expected amount, return before tax, recommended fund | CR+A | 2/100 | client-only (interim: static shell) | needs-backend (host-bound, cors closed) | scaffolded-awaiting-owner | calculator | **owner: SB1 — CORS (or same-origin proxy) for `/openapi/personal/banking/savingscalculator/{expected-performance,suggested-savings-product}`** (`siteConfig.savingsCalculator`); an alternative that needs an explicit owner approval: a dated snapshot of the expected-return table (years × risk) plus a client formula verified against the oracle. The earlier "self — formula lifted from captured outputs" is withdrawn (the formula is not in the client code). Interim: the widget's static shell with the captured defaults (new — the page rendered no widget before), controls disabled; spike-c copy `/spike-c/nb/bank/privat/kundeservice/verktoy/sparekalkulator` | client-logic: locus **server** — GET `expected-performance?initialValue&periodicInvestment&years&risk` → `nominell` 42107.69 = the shown "42 107 kr", `nominalExpectedAnnualReturn` 5.33 / 6.03 / 6.5 by years × risk · cors closed from spike-c (2026-10-15) · oracle: 22-row source table `stardust/dynamics/client-logic/savings-calculator/table.source.json` |
| 9 | currency converter | valutakalkulator: from/to currency, amount, swap → converted amount and "1 EUR = x NOK" at transfer rates | CR+A | 1/100 | client-only (compute) + static-snapshot (rates) | self (compute) · needs-backend (live rate feed, host-bound) | interim | calculator + off-origin-data tier 2 | **owner: SB1 — CORS (or same-origin proxy) for `/openapi/nettsider/ressurser/bank/valutakurser`** → `siteConfig.currencyRates.enabled`. Interim: the working converter on a dated code-bus snapshot (`data/currency-converter/valutakurser.json` + `_provenance.json`, 31 currencies, rates of 2026-10-15T13:47Z), "Kurs per <date>" line and `data-snapshot`; refresh with `node stardust/scripts/sync-currency-rates.mjs`; spike-c copy `/spike-c/nb/bank/privat/kundeservice/verktoy/valutakalkulator` (rate list refreshed from the same snapshot) | client-logic: compute locus client (clientlib_base `currency-converter`: amount × from.buyCurrencyChequeRate/unit ÷ to.sellCurrencyChequeRate/unit, `toFixed(2)`; cash rates off, `data-cash-disabled=true`) · rates GET once on load (406 on `Accept: application/json`, cors closed) · vectors 26/26 exact (1440 + 360) · `stardust/dynamics/client-logic/currency-converter/` |
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

- **Backend / APIs (CORS or proxy on the EDS host):** coordinates → postcode for "Bruk min posisjon" (#1 — the postcode → bank lookup itself shipped, it never needed a backend), loan-calculator API (#7), savings-calculator API (#8), currency rates (#9 — interim runs on a dated snapshot), page-feedback logging (#5).
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

## spike-c re-run (rows #1, #7, #8, #9 only) — 2026-10-15

<!-- _provenance: writtenBy stardust:dynamics Phases 1–5 (hands-off) on rows 1, 7, 8, 9; branch spike-c; origin https://spike-c--sparebank1-redesign--paolomoz.aem.page; content copies under /spike-c/; every other row unchanged -->

Read the source's code before deciding (client-logic recovery). The rows above were updated in place. What changed and why:

| # | before | after | why |
|---|---|---|---|
| 1 | needs-backend (postcode lookup assumed host-bound) · interim | **self** for the postcode → bank lookup · **done**; position stays needs-backend | the lookup is client-side: every source page inlines `bankPickerlist[].postalRange`, and `filteredBankList` filters it with no request. Only the coordinates → postcode call is server-side |
| 7 | needs-backend · owner asked for "CORS or approve a client formula" | needs-backend · scaffolded-awaiting-owner; the ask is CORS/proxy only | the numbers come from the API response, and the server computes SIFO, tax and stress test, so there is no client formula to approve |
| 8 | self ("formula lifted from captured outputs") · pending | **needs-backend** · scaffolded-awaiting-owner, static shell shipped | the expected amount comes from `expected-performance`, and return assumptions vary by years × risk. A formula fitted to outputs is a guess, which the triage rules forbid |
| 9 | needs-backend · interim static shell, disabled controls | self (compute) · needs-backend (live rates) · interim: **working converter on a dated snapshot** | the conversion is client code (recovered). Rates are live data, so frozen rates are a static-snapshot with a date and a sync step, never `self` |

Instrument note: `client-logic.mjs capture` reported locus "client (with calls)" for #7 and #8. Both widgets render into an open shadow root, so the tool saw no output mutations. The network evidence (`network.json`: the response values equal the shown values) decides the locus. Its `vectors` command could not drive the source either, because the consent dialog `#opt-in` intercepts the triple-click clear. `stardust/scripts/dyn-vectors.mjs` writes the same table format and `client-logic.mjs diff` compares the tables.
