# Dynamics parity check — https://spike-c--sparebank1-redesign--paolomoz.aem.page — 2026-10-15T14:56:34.333Z

Replayed 15 checks over 20 features · pass 15 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| bank-choice router | F+A | done (postcode) · scaffolded-awaiting-owner (position) | search-query | PASS | 5 results (source 5) · first: sparebank 1 nord-norge · matches the source |  |
| bank-choice router | F+A | done (postcode) · scaffolded-awaiting-owner (position) | search-query | PASS | 1 results (source 1) · first: fortsett til sparebank 1 østlandet · matches the source |  |
| bank-choice router | F+A | done (postcode) · scaffolded-awaiting-owner (position) | search-query | PASS | 9 results (source 9) · first: sparebank 1 gudbrandsdal · matches the source |  |
| bank-choice router | F+A | done (postcode) · scaffolded-awaiting-owner (position) | dom-count | PASS | 12 × .bank-router .bank-list li a[href*='sparebank1.no/n'] (min 12) |  |
| bank-choice router | F+A | done (postcode) · scaffolded-awaiting-owner (position) | no-page-errors | PASS | none on 2 page(s) |  |
| loan calculator | CR+A | scaffolded-awaiting-owner | dom-count | PASS | 2 × .calculator .calc[aria-disabled=true] .calc-tab (min 2) |  |
| loan calculator | CR+A | scaffolded-awaiting-owner | dom-count | PASS | 2 × .calculator .calc-ctas a (min 2) |  |
| loan calculator | CR+A | scaffolded-awaiting-owner | no-page-errors | PASS | none on 1 page(s) |  |
| savings calculator | CR+A | scaffolded-awaiting-owner | dom-count | PASS | 4 × .calculator .calc[aria-disabled=true] .calc-fields .field (min 4) |  |
| savings calculator | CR+A | scaffolded-awaiting-owner | dom-count | PASS | 2 × .calculator .calc-breakdown > div (min 2) |  |
| savings calculator | CR+A | scaffolded-awaiting-owner | no-page-errors | PASS | none on 1 page(s) |  |
| currency converter | CR+A | interim | fetch-json | PASS | 200 · 31 rows |  |
| currency converter | CR+A | interim | dom-count | PASS | 31 × .converter #conv-from option (min 31) |  |
| currency converter | CR+A | interim | dom-count | PASS | 1 × .converter .conv[data-snapshot] .conv-date (min 1) |  |
| currency converter | CR+A | interim | no-page-errors | PASS | none on 1 page(s) |  |

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
