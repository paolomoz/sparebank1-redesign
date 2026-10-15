<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-15T14:40:53.085Z · input /Users/paolo/stardust/spike-rea/sparebank1/a/stardust/dynamics/spike-a/detect/_dynamics.json (6 pages, 17 findings) · target probe https://main--sparebank1-redesign--paolomoz.aem.page · reconciled against /Users/paolo/stardust/spike-rea/sparebank1/a/stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-digitaldata | A | CMS / app settings object digitalData | 6/6 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-first-party-api-post-api-personal-banking-boliglan-kalkula | A | first-party API POST /api/personal/banking/boliglan-kalkulator/economy | 2/6 | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 3 | a-first-party-api-post-api-personal-banking-boliglan-kalkula | A | first-party API POST /api/personal/banking/boliglan-kalkulator/annuity-loan | 2/6 | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 4 | cr-client-rendered-slot-main-js-productpage-productpage | CR | client-rendered slot main js-productpage productpage | 1/6 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 5 | cr-client-rendered-slot-js-faq-toggle-faq-button-more-ffe-bu | CR | client-rendered slot js-faq-toggle faq-button--more ffe-button | 1/6 | static-snapshot | self | delivered-by-capture | settled-dom-snapshot | inspect the consumer | output already carries "Se flere spørsmål og svar" |
| 6 | cr-client-rendered-slot-tab-js-tab-content-default | CR | client-rendered slot tab js-tab-content default | 1/6 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 7 | d-first-party-data-file-get-nb-bank-privat-sparing-markedsny | D | first-party data file GET /nb/bank/privat/sparing/markedsnytt/artikler.export.json | 2/6 | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 8 | i18n-locale-variants-nn-nn-nn-nn-nn | I18N | locale variants nn,nn,nn,nn,nn | 6/6 | rebuild-native | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.sparebank1.no/nn/sogn-fjorda" |
| 9 | l-listing-candidate-card-list-card-list-price-10-cards | L | listing candidate card-list card-list__price (10 cards) | 1/6 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 10 | l-listing-candidate-ffe-accordion-15-cards | L | listing candidate ffe-accordion (15 cards) | 1/6 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 11 | l-listing-candidate-ffe-accordion-11-cards | L | listing candidate ffe-accordion (11 cards) | 1/6 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 12 | l-listing-candidate-text-wrapper-6-cards | L | listing candidate text-wrapper  (6 cards) | 1/6 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 13 | m-modal-trigger-overlay-btn-chrome-only-target-outside-dom-a | M | modal trigger overlay-btn (chrome only) → target outside DOM at capture | 3/6 | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 14 | m-modal-trigger-overlay-btn-target-outside-dom-at-capture | M | modal trigger overlay-btn → target outside DOM at capture | 3/6 | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "https://www.sparebank1.no/bank/nettbank-" |
| 15 | m-modal-trigger-loginmodal-target-outside-dom-at-capture | M | modal trigger loginModal → target outside DOM at capture | 1/6 | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "https://www.sparebank1.no/bank/nettbank-" |
| 16 | s-first-party-api-get-openapi-personal-banking-savingscalcul | S | first-party API GET /openapi/personal/banking/savingscalculator/suggested-savings-product | 1/6 | data-fed | needs-business-decision | pending | off-origin-data | datasource ownership / same-origin routing on production | **dead on target (404)** |
| 17 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 2/6 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 5 row(s) — read-settings, settled-dom-snapshot, sheet-sync, chrome-interaction.
- **One owner decision batch:** 8 row(s) — which tier for the target host; consumer on the migrated pages? · index-driven or editorially curated? · datasource ownership / same-origin routing on production · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 4 row(s) — no work.
- **Host-bound on the target:** 4 of 3 probed API paths — the off-origin data work.

## Phases

- **listings** — 4
- **off-origin data** — 3
- **capture** — 3
- **interactive** — 3
- **detect** — 1
- **data** — 1
- **locale wave** — 1
- **tags** — 1
