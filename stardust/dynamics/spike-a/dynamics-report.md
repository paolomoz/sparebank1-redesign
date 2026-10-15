# Dynamics parity check — https://spike-a--sparebank1-redesign--paolomoz.aem.page — 2026-10-15T15:35:47.539Z

Replayed 16 checks over 24 features · pass 16 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| bank-choice router — postcode → bank | F+D | done | fetch-json | PASS | 200 · 5 rows · keys snapshotAt,source,rule,banks,pages |  |
| bank-choice router — postcode → bank | F+D | done | dom-count | PASS | 13 × .bank-router[data-snapshot] .bank-list li (min 12) |  |
| bank-choice router — postcode → bank | F+D | done | dom-count | PASS | 1 × .bank-router a[href='https://www.sparebank1.no/nb/gudbrandsdal/privat/lan/boliglan.html'] (min 1) |  |
| bank-choice router — postcode → bank | F+D | done | dom-count | PASS | 1 × .bank-router a[href='https://www.sparebank1.no/nb/hallingdal/privat.html'] (min 1) |  |
| bank-choice router — postcode → bank | F+D | done | no-page-errors | PASS | none on 3 page(s) |  |
| loan calculator — 'Hvor mye koster lånet?', price example, payment plan | F | done | dom-count | PASS | 2 × .calculator .calc-tab[role=tab] (min 2) |  |
| loan calculator — 'Hvor mye koster lånet?', price example, payment plan | F | done | dom-count | PASS | 1 × .calculator .calc-panel .field--rente input[type=range] (min 1) |  |
| loan calculator — 'Hvor mye koster lånet?', price example, payment plan | F | done | no-page-errors | PASS | none on 3 page(s) |  |
| loan calculator — 'Hvor mye kan jeg låne?' (lending capacity) | A | scaffolded-awaiting-owner | dom-count | PASS | 1 × .calculator[data-economy] (min 1) |  |
| savings calculator (sparekalkulator) | CR+A | done | fetch-json | PASS | 200 · 6 rows · keys snapshotAt,source,years,expectedReturn,product,products |  |
| savings calculator (sparekalkulator) | CR+A | done | dom-count | PASS | 4 × .savings-calculator[data-snapshot] .sc-compare-row (min 4) |  |
| savings calculator (sparekalkulator) | CR+A | done | no-page-errors | PASS | none on 1 page(s) |  |
| currency converter + rate list (valutakalkulator) | CR+A | interim | fetch-json | PASS | 200 · 4 rows · keys snapshotAt,ratesUpdatedAt,source,rates |  |
| currency converter + rate list (valutakalkulator) | CR+A | interim | dom-count | PASS | 31 × .converter[data-snapshot] #conv-from option (min 31) |  |
| currency converter + rate list (valutakalkulator) | CR+A | interim | dom-count | PASS | 30 × .table.rates[data-snapshot] tbody tr (min 30) |  |
| currency converter + rate list (valutakalkulator) | CR+A | interim | no-page-errors | PASS | none on 2 page(s) |  |

## Features without checks

- bank-choice — 'Bruk min posisjon' (coordinates → postcode) (A) — scaffolded-awaiting-owner · owner: SB1: expose the geolocation → postnummer service cross-origin or same-origin for the EDS host (a third-party reverse-geocoder would send visitors' coordinates to another party — a privacy decision, not taken by this run)
- bank-choice — last visited bank (prefilled state) (F+T) — interim · owner: SB1: functional cookies + CMP on the new host (tied to #15)
- overlay-btn bank-choice dialog (M) — interim · owner: none — iteration 2
- login dialog (M+X) — interim · owner: none
- FAQ accordion (M) — delivered · owner: none
- page feedback (F) — interim · owner: SB1: LogServlet endpoint on the new host
- contact tabs (M+F+T) — interim · owner: SB1: boost.ai chat on the new host
- savings calculator — fund factsheet pop-up (A) — interim · owner: SB1: fund data feed for the new host (or keep the factsheet on the source fund pages)
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
