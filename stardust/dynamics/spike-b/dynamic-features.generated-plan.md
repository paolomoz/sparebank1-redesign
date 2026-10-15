<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-15T14:36:12.183Z · input stardust/dynamics/spike-b/_dynamics.json (4 pages, 14 findings) · target probe https://spike-b--sparebank1-redesign--paolomoz.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-digitaldata | A | CMS / app settings object digitalData | 4/4 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-first-party-api-post-api-personal-banking-boliglan-kalkula | A | first-party API POST /api/personal/banking/boliglan-kalkulator/economy | 1/4 | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 3 | a-first-party-api-post-api-personal-banking-boliglan-kalkula | A | first-party API POST /api/personal/banking/boliglan-kalkulator/annuity-loan | 1/4 | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 4 | cr-client-rendered-slot-main-js-productpage-productpage | CR | client-rendered slot main js-productpage productpage | 1/4 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 5 | cr-client-rendered-slot-js-faq-toggle-faq-button-more-ffe-bu | CR | client-rendered slot js-faq-toggle faq-button--more ffe-button | 1/4 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 6 | cr-client-rendered-slot-tab-js-tab-content-default | CR | client-rendered slot tab js-tab-content default | 1/4 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 7 | d-first-party-data-file-get-nb-bank-privat-sparing-markedsny | D | first-party data file GET /nb/bank/privat/sparing/markedsnytt/artikler.export.json | 1/4 | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 8 | i18n-locale-variants-nn-nn-nn-nn-nn | I18N | locale variants nn,nn,nn,nn,nn | 4/4 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 9 | l-listing-candidate-card-list-card-list-price-10-cards | L | listing candidate card-list card-list__price (10 cards) | 1/4 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 10 | l-listing-candidate-ffe-accordion-15-cards | L | listing candidate ffe-accordion (15 cards) | 1/4 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 11 | m-modal-trigger-overlay-btn-chrome-only-target-outside-dom-a | M | modal trigger overlay-btn (chrome only) → target outside DOM at capture | 3/4 | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 12 | m-modal-trigger-overlay-btn-target-outside-dom-at-capture | M | modal trigger overlay-btn → target outside DOM at capture | 1/4 | rebuild-native | self | pending | modal-loader | none |  |
| 13 | s-first-party-api-get-openapi-personal-banking-savingscalcul | S | first-party API GET /openapi/personal/banking/savingscalculator/suggested-savings-product | 1/4 | data-fed | needs-business-decision | pending | off-origin-data | datasource ownership / same-origin routing on production | **dead on target (404)** |
| 14 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 2/4 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 7 row(s) — read-settings, settled-dom-snapshot, sheet-sync, chrome-interaction, modal-loader.
- **One owner decision batch:** 7 row(s) — which tier for the target host; consumer on the migrated pages? · scope of the locale trees · index-driven or editorially curated? · datasource ownership / same-origin routing on production · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 4 of 3 probed API paths — the off-origin data work.

## Phases

- **off-origin data** — 3
- **capture** — 3
- **listings** — 2
- **interactive** — 2
- **detect** — 1
- **data** — 1
- **locale wave** — 1
- **tags** — 1
