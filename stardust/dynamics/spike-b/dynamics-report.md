# Dynamics parity check — https://spike-b--sparebank1-redesign--paolomoz.aem.page — 2026-10-15T14:58:53.840Z

Replayed 22 checks over 20 features · pass 22 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| bank-choice router | F | done (postcode) · scaffolded-awaiting-owner (geolocation) | search-query | PASS | 5 results (source 5) · first: sparebank 1 nord-norge · matches the source |  |
| bank-choice router | F | done (postcode) · scaffolded-awaiting-owner (geolocation) | search-query | PASS | 2 results (source 2) · first: sparebank 1 helgeland · matches the source |  |
| bank-choice router | F | done (postcode) · scaffolded-awaiting-owner (geolocation) | search-query | PASS | 9 results (source 9) · first: sparebank 1 gudbrandsdal · matches the source |  |
| bank-choice router | F | done (postcode) · scaffolded-awaiting-owner (geolocation) | dom-count | PASS | 12 × .bank-router details.router-all[open] .bank-list li (min 12) |  |
| bank-choice router | F | done (postcode) · scaffolded-awaiting-owner (geolocation) | dom-count | PASS | 1 × .bank-router .router-error:not([hidden]) (min 1) |  |
| bank-choice router | F | done (postcode) · scaffolded-awaiting-owner (geolocation) | fetch-json | PASS | 200 · 12 rows · keys total,data |  |
| bank-choice router | F | done (postcode) · scaffolded-awaiting-owner (geolocation) | no-page-errors | PASS | none on 3 page(s) |  |
| loan calculator (#boliglan-kalkulator) | CR+A | done (cost tab) · scaffolded-awaiting-owner (economy tab) | search-query | PASS | 2 results (source 2) · first: 12 717 kr · matches the source |  |
| loan calculator (#boliglan-kalkulator) | CR+A | done (cost tab) · scaffolded-awaiting-owner (economy tab) | search-query | PASS | 1 results (source 1) · first: priseksempel: nominell rente 4,50 %. effektiv rente 4,64 %.  · matches the source |  |
| loan calculator (#boliglan-kalkulator) | CR+A | done (cost tab) · scaffolded-awaiting-owner (economy tab) | search-query | PASS | 2 results (source 2) · first: kostnad etter skattefradrag 13 723 kr · matches the source |  |
| loan calculator (#boliglan-kalkulator) | CR+A | done (cost tab) · scaffolded-awaiting-owner (economy tab) | dom-count | PASS | 1 × .calc-panel--economy[data-state="captured-example"] (min 1) |  |
| loan calculator (#boliglan-kalkulator) | CR+A | done (cost tab) · scaffolded-awaiting-owner (economy tab) | dom-count | PASS | 1 × .calculator .calc-panel--economy (min 1) |  |
| loan calculator (#boliglan-kalkulator) | CR+A | done (cost tab) · scaffolded-awaiting-owner (economy tab) | no-page-errors | PASS | none on 3 page(s) |  |
| savings calculator (sparekalkulator.js) | CR+A | done | search-query | PASS | 3 results (source 3) · first: 1 140 481 kr * · matches the source |  |
| savings calculator (sparekalkulator.js) | CR+A | done | search-query | PASS | 4 results (source 4) · first: 14 187 kr * · matches the source |  |
| savings calculator (sparekalkulator.js) | CR+A | done | search-query | PASS | 1 results (source 1) · first: sparebank 1 alt-i-ett 50 n · matches the source |  |
| savings calculator (sparekalkulator.js) | CR+A | done | fetch-json | PASS | 200 · 3 rows · keys buckets,ladder,packages |  |
| savings calculator (sparekalkulator.js) | CR+A | done | no-page-errors | PASS | none on 1 page(s) |  |
| currency converter | CR+A | interim | search-query | PASS | 1 results (source 1) · first: 985.72 · matches the source |  |
| currency converter | CR+A | interim | search-query | PASS | 2 results (source 2) · first: 60.04 · matches the source |  |
| currency converter | CR+A | interim | dom-count | PASS | 31 × .converter[data-rates="document"][data-currencies="31"] select#conv-from option (min 31) |  |
| currency converter | CR+A | interim | no-page-errors | PASS | none on 2 page(s) |  |

## Features without checks

- overlay-btn bank-choice dialog (M) — interim · owner: none — iteration 2
- login dialog (M+X) — interim · owner: none
- FAQ accordion (M) — delivered · owner: none
- page feedback (F) — interim · owner: SB1: LogServlet endpoint on the new host
- contact tabs (M+F+T) — interim · owner: SB1: boost.ai chat on the new host
- price cards / rate examples (D) — delivered-by-capture · owner: none
- news / markedsnytt listings (D+L) — interim (authored cards) + index published · owner: none — listing block switches to the index in iteration 2
- footer JSON (A) — delivered-by-capture · owner: none
- digitalData / SB1.config (A) — delivered · owner: none
- client-rendered main (frontend clientlib) (CR) — delivered-by-capture · owner: none
- Adobe Analytics / Target / consent (T) — decided (none on pilot) · owner: SB1/Adobe: Launch/Web SDK property + CMP
- YouTube / mp4 media (V) — delivered · owner: none (one runtime-injected podcast src stays a linked frame)
- glossary modal (M) — interim · owner: none — iteration 2 (modal-loader)
- locale / regional trees (I18N) — decided out (iteration 1) · owner: later iterations
- sign-in / account links (X) — decided-out · owner: none
- site search (S) — interim · owner: decide index-backed EDS search vs Solr passthrough
