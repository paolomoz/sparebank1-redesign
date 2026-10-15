# SpareBank 1 Sparekalkulator: reverse-engineering analysis

Page: https://www.sparebank1.no/nb/bank/privat/kundeservice/verktoy/sparekalkulator.html
Bundle: `/bank/nettsider-privat/fond/static/sparekalkulator.js` (+ `/bank/nettsider-privat/fond/static/sparekalkulator.css`), saved at /tmp/spike-b-src/sparekalkulator.js
Captured: 2026-10-15 using Playwright (chromium headless, Chrome 129 UA, locale nb-NO, cookie consent "Kun nødvendige"), plus direct anonymous GETs from Node.

## TL;DR
- **Every result number comes from the server.** Nothing is computed locally except trivial sums like "Du har spart" and the differences derived from it. Each input change (debounced 500 ms) calls `GET /openapi/personal/banking/savingscalculator/expected-performance` (monthly tab) or `.../required-savings` (goal tab). A change to years or risk also calls `.../suggested-savings-product`.
- **The server's output is a closed formula and is fully reproducible.** It uses annual-effective rate r, monthly deposits made at the *start* of each month, and annual compounding of the lump sum. r is a constant for each product package, and the package is picked from a (risk × horizon-bucket) table. Across 36 unique API responses, the max deviation from the formula is **1.5e-10 NOK** (floating-point noise). All **25/25** values shown in the widget match to the krone.
- **Nothing is personal.** The APIs work with no cookies or auth (verified with Node `fetch`). They send no CORS headers and `Cache-Control: no-store`. The calculator bundle never calls `/user`. Only the page shell calls `/openapi/nettsider/ressurser/bank/user`, which returns `{"authenticated":false,"realms":[],"bank":"bank"}`.

## Mount / embedding
```html
<div id="sparekalkulator" data-editmode="false" data-process="sparekalkulator" data-lang="nb" data-bank="bank"
  data-bankname="SpareBank 1 Bank" data-authenticationUrl="/nb/bank/privat/innlogging/identifisering.html" ...
  data-basename="/nb/bank/privat/kundeservice/verktoy/sparekalkulator.html" data-labels="{}"
  data-config="{&#34;contactUrl&#34;:&#34;/content/sites/sb1/nb/bank/privat/kundeservice/bestill/kontakt-meg-om-sparing.html&#34;}"
  data-overlayLinks="{&#34;key&#34;:&#34;sparekalkulator-kjop&#34;,&#34;value&#34;:&#34;${links.nettbank.fond_sparekalkulator}&#34;},{&#34;key&#34;:&#34;sparekalkulator-kontakt&#34;,...}">
<script type="module" src="/bank/nettsider-privat/fond/static/sparekalkulator.js">
```
- The wrapper is `<div class="fullwidth has-bankpicker" data-appid="sparekalkulator">`.
- The bundle reads **only `data-config`**, which it parses as JSON with keys `contactUrl`, `headingLevel` and `headingSize` (heading level/size default to 2). It renders into an **open shadow root**, adds a `<link>` to `sparekalkulator.css`, and inlines a Tailwind/FFE style string:
  `tZ=document.getElementById("sparekalkulator") ... nZ=tZ.getAttribute("data-config"),rZ=nZ?JSON.parse(nZ):null; createRoot($X(tZ))` where `$X=e=>{let t=e.attachShadow({mode:"open"}) ...}`.
- It depends on the page global `window.SB1.config.bank` for `bankShortName`, `financialInstitutionId` (`fid-ostlandet` on /nb/bank/) and `bankSemanticUrl`, plus `window.SB1.config.user.language`.
- spare-i-fond.html: the current server HTML has **no** `#sparekalkulator` mount (checked with curl on 2026-10-15). The calculator appears only on the verktøy page.

## Endpoint map (all same-origin; no ACAO header; `cache-control: no-cache, no-store, max-age=0, must-revalidate`)
Header on calculator calls: `Accept`/`Content-Type: application/vnd.sparebank1.v1+json; charset=utf-8`. The fetch wrapper `Le` adds `credentials:"include"` + `X-CUSTOMER-SSN` only when a third argument is passed. These calls never pass one.

| Endpoint | Params | Response | Drives |
|---|---|---|---|
| `GET /openapi/personal/banking/savingscalculator/expected-performance` | `initialValue, periodicInvestment, years, risk` | `{"expectedPerformanceBeforeTax":{"nominell":42107.69167503309},"nominalExpectedAnnualReturn":5.33}` | Monthly tab: "Forventet beløp:" and "Avkastning før skatt". Expanded "Se avkastning med ulik risiko" (4 parallel calls, one per risk): bar % + "Forventet beløp: X kr". Goal tab expanded: 4 calls with `periodicInvestment=requiredSavingsSum`, used only for the bar % |
| `GET .../savingscalculator/required-savings` | `savingsGoal, initialInvestment, years, risk` | `{"requiredSavingsSum":2535.33…,"futureValueOfInitialAmount":25929.27…,"futureValueOfRequiredSavings":174070.72…}` | Goal tab: "Hver måned må du spare:" (and the derived rows). Expanded: 4 calls, "Hver måned må du spare: X kr" |
| `GET .../savingscalculator/suggested-savings-product` | `years, risk` | `{"recommendedProductPackages":[{"id":6,"name":"Alt-i-ett 50","description":"Kombinasjonsfond med ca. 50 % aksjer og 50 % renter. Passer for deg som ønsker middels risiko."}]}` | Intro "Mange kunder … har valgt **X**", the CTA ISIN, and the risk-bar labels when expanded (4 calls) |
| `GET /openapi/personal/banking/fund/products/available?fid=<financialInstitutionId>` (v3) | — | fund list | Maps package ISIN to display name ("SpareBank 1 Alt-i-ett 50 N") and makes the name a clickable dialog button. Called once on load |
| `GET .../fund/products/details/{isin}` (v2), `.../times-series-growth/isin/{isin}?frequency=MONTHLY&start-value=100&start-date=1900-01-01` and `?frequency=DAILY…`, `/openapi/nettsider/{bank}/bankcatalog/products.fond.prisoversikt` | — | fund detail | Only when the user clicks a fund name, which opens the fund sheet (`<dialog class="sparing-sheet">`) |
| `/fund/products/calculate-fee`, `/fund/costanalysis` | — | — | In the bundle (shared fund component library) but **not called** by the calculator flow |

Package to ISIN map in the bundle (`Sa`): `[[0,null],["Sparekonto",null],[9,"NO0010841000"],["Alt-i-ett 20",…],[6,"NO0010841042"],["Alt-i-ett 50",…],[7,"NO0010841075"],["Alt-i-ett 80",…],[10,"NO0012619024"],["Alt-i-ett 100",…]]`.

Bundle snippets:
```js
Oa=async({years:e,risk:t,start:n,monthlyAmount:r})=>Le(`${Ze(`/openapi/personal/banking/savingscalculator/expected-performance`)}${ze({initialValue:n,periodicInvestment:r,years:e,risk:t})}`,{headers:{Accept:qe.sb1v1json,"Content-Type":qe.sb1v1json}})
Aa=async({savingsGoal:e,risk:t,start:n,years:r})=>Le(`${Ze(`/openapi/personal/banking/savingscalculator/required-savings`)}${ze({savingsGoal:e,initialInvestment:n,years:r,risk:t})}`, ...)
wa=async({years:e,risk:t})=>{let[n]=(await Le(`${Ze(`/openapi/personal/banking/savingscalculator/suggested-savings-product`)}${ze({years:e,risk:t})}`,...)).recommendedProductPackages; ... n.isin=(Sa.get(n.name)||Sa.get(n.id))??null,n}
Ea=(e,t=500)=>... // 500 ms debounce wrapper for every fetch hook
// Monthly result (PX):
i=n.data?.expectedPerformanceBeforeTax.nominell??NaN, a=12*e.monthlyAmount*e.time+e.oneTimeInvestment.monthly, o=i-a
// Goal result (KX):
r=Math.max(Math.round(n.data?.requiredSavingsSum??0),0), i=n.data?12*e.time*r+e.oneTimeInvestment.savingGoal:null, a=i?e.savingsGoal-i:null
// Number format Na: numberOfDecimals 0 => Math.floor, Intl nb => "42 107 kr"
```

## Formula (fitted to the API, exact)
Inputs: P = start amount ("Jeg har allerede spart"), m = monthly amount, n = years, G = goal, risk ∈ {none, low, medium, high}.

1. Horizon bucket: `b = n<=1 ? 0 : n<=4 ? 1 : n<=9 ? 2 : 3`
2. Package and rate r (annual effective, %):

| risk \ years | 0–1 | 2–4 | 5–9 | 10+ |
|---|---|---|---|---|
| none (Ingen) | Sparekonto 3,00 | Sparekonto 3,00 | Sparekonto 3,00 | Sparekonto 3,00 |
| low (Lav) | Sparekonto 3,00 | Sparekonto 3,00 | Alt-i-ett 20 4,62 | Alt-i-ett 50 5,33 |
| medium (Moderat) | Sparekonto 3,00 | Alt-i-ett 20 4,62 | Alt-i-ett 50 5,33 | Alt-i-ett 80 6,03 |
| high (Høy) | Sparekonto 3,00 | Alt-i-ett 50 5,33 | Alt-i-ett 80 6,03 | Alt-i-ett 100 6,50 |

   Package constants: Sparekonto id 0 = 3.00 %; Alt-i-ett 20 id 9 = 4.62 %; Alt-i-ett 50 id 6 = 5.33 %; Alt-i-ett 80 id 7 = 6.03 %; Alt-i-ett 100 id 10 = 6.50 %. The pattern is a ladder: package index = clamp(riskLevel + bucketOffset). Bucket boundaries confirmed at 1|2 (high), 4|5 (high), 9|10 (medium). Cells low@2/4/6–9 and high@6–9 are inferred from the bucket structure, not observed directly. The fund rates are roughly linear in equity share (≈ 4.17 + 0.0233 × equity %), but they are a lookup table, not a formula.
3. Monthly rate `i = (1+r)^(1/12) − 1`, `N = 12n`, annuity-due factor `A = ((1+i)^N − 1)/i × (1+i)` (A = 0 when n = 0)
4. `expected-performance.nominell = P·(1+r)^n + m·A`, and `nominalExpectedAnnualReturn = r` in %
5. `required-savings.requiredSavingsSum = (G − P·(1+r)^n) / A`, `futureValueOfInitialAmount = P·(1+r)^n`, `futureValueOfRequiredSavings = G − P·(1+r)^n`
6. `suggested-savings-product` = the package from the table

Fit error: max |formula − API| = **1.46e-10 NOK** (expected-performance, 20 unique samples), **3.6e-12 NOK** (requiredSavingsSum, 9 samples), **9.4e-10 NOK** (futureValueOfInitialAmount). Rate field: 0 mismatches. Suggested product: 0/7 mismatches. Widget display: **25/25 exact**. Rejected alternatives (max deviation on the same samples): annuity-immediate with i=(1+r)^(1/12)−1 gave 5 234 NOK; due with i=r/12 gave 16 264 NOK; immediate with i=r/12 gave 10 789 NOK; yearly deposits with mid-year simple interest gave 327 NOK.
Edge cases: `years=0` returns `nominell = P` and rate 3. `required-savings` with years=0 was not tested (A = 0, so division by zero). If P·(1+r)^n ≥ G, requiredSavingsSum is ≤ 0 and the widget shows 0.

**Time dependence:** the requests carry no date. Rates are round configured constants and do not match any `returns` field in `products/available`, for example Alt-i-ett 20 `lastFiveYears 4.47`, `lastTenYears 4.91` vs 4.62; Alt-i-ett 50 10-year cumulative +100,02 % ≈ 7.2 %/yr vs 5.33. Expected-performance and required-savings therefore do **not** depend on live fund data. They depend on a server-side assumption table that SpareBank 1 can change at any time. The disclaimer says "Avkastning for sparekonto er basert på historisk rente", so the 3 % Sparekonto rate in particular is likely updated now and then. Put these constants in config or a sheet in the EDS port. Live fund data (`products/available`) is used only for display names and the fund dialog.

## Display rules
- Monthly tab: "Forventet beløp:" = floor(FV) + " kr *"; "Avkastning før skatt" = floor(FV − (12·m·n + P)); "Du har spart" = 12·m·n + P.
- Goal tab: "Hver måned må du spare:" = max(round(req), 0) + " kr *"; "Totalt beløp" = G; "Du har spart" = 12·n·req_rounded + P; "Avkastning før skatt" = G − spart (empty if spart = 0).
- Format: `Intl.NumberFormat('nb')` with 0 decimals and floor, NBSP + "kr" (e.g. "1 140 481 kr"). Rate labels use 2 decimals with comma + " %" ("6,03 %").
- Expanded bars: width = rate / max(4 rates) × 100 %. Labels "Ingen risiko: Sparekonto", "Lav risiko: <fund>", "Medium risiko: <fund>", "Høy risiko: <fund>". Detail line is "Forventet beløp: X kr" (monthly) or "Hver måned må du spare: X kr" (goal).
- Loading: shimmer placeholders (`sparing-shimmer`). Errors: "Det har oppstått en teknisk feil. Prøv igjen senere." (card) and "Klarte ikke å vise sparekalkulator" (app error boundary).

## UI: tabs and controls
Tabs (buttons with aria-selected): **"Spar hver måned"** (default, `monthly`) | **"Sett et sparemål"** (`savingsGoal`).
State is a single object `{time:5, savingsGoal:2e5, risk:"medium", oneTimeInvestment:{monthly:6e3, savingGoal:2e4}, monthlyAmount:500}`. **years, risk, monthlyAmount and savingsGoal are shared across tabs; the start amount is separate per tab.** (Observed: after editing years/risk on the goal tab, the monthly tab showed 15 years / Lav.)

| Tab | Label (nb) | Control | Slider min/max/step | Input clamp | Default | Postfix |
|---|---|---|---|---|---|---|
| monthly | Beløpet jeg kan spare i måneden: | slider + text input (inputmode numeric, digits only) | 0 / 20 000 / 100 | 0 … 2 147 483 646 | 500 | Kr |
| goal | Mitt sparemål: | slider + text input | 1 000 / 5 000 000 / 1 000 | 1 000 … 2 147 483 646 | 200 000 | Kr |
| both | Jeg har allerede spart: | slider + text input | 0 / 1 000 000 / 1 000 | 0 … 2 147 483 646 | 6 000 (monthly) / 20 000 (goal) | Kr |
| both | Antall år jeg vil spare: | slider + text input | 0 / 50 / 1 | 0 … 50 | 5 | År |
| both | Hvor stor risiko jeg vil ta: | 4-dot slider + `<select>` | 0..3 index | options Ingen / Lav / Moderat / Høy (values none/low/medium/high), disabled placeholder "Velg risiko" | Moderat | — |

- Below 1024 px viewport width, sliders are not rendered (`Ur()<=Lr.MEDIUM` → input/select only). The 360 px capture confirmed 0 sliders.
- Input behaviour: non-digit beforeinput is blocked. The value is clamped on change, shown as "6 000" (nb grouping) on blur and without spaces on focus.
- An info box under the inputs depends on risk (heading h3 + text):
  - Ingen: "Du ønsker ikke å ta noe risiko med sparepengene dine. Du prioriterer forutsigbarhet, og vil at sparepengene er tilgjengelig på konto når du trenger dem."
  - Forsiktig profil: "Passer for deg som ønsker høy grad av trygghet. Sparingen er satt sammen for å unngå tap i løpet av sparetiden. Til gjengjeld er det begrenset hvor høy avkastning du kan forvente."
  - Moderat profil: "Passer for deg som ønsker å ta noe risiko for å oppnå en noe høyere forventet avkastning. Risikoen for moderat tap er til stede i sparetiden."
  - Offensiv profil: "Passer for deg som er villig til å ta høyere risiko for å få mulighet til høyere avkastning. Risikoen for tap over sparetiden er til stede, men muligheten for høyere avkastning er også tilsvarende stor."

## Visible strings (nb, verbatim)
- H2 monthly: "Hvor mye blir det totalt hvis jeg sparer fast hver måned?"
- H2 goal: "Jeg vil spare til noe bestemt. Hvor mye må jeg spare hver måned for å nå målet?"
- Result card intro: "Mange kunder som har valgt den samme sparetiden og risikotoleransen har valgt **SpareBank 1 Alt-i-ett 50 N**. Oversikt over alle fond vi tilbyr finner du i [fondsoversikten](/nb/{bank}/privat/sparing/spare-i-fond/fondsoversikt.html)." For Sparekonto the second sentence is "Oversikt over alle våre sparekontoer finner du [her](/nb/{bank}/privat/sparing/spare-pa-konto.html)."
- Monthly result rows: "Forventet beløp:" / "Avkastning før skatt" / "Du har spart"
- Goal result rows: "Hver måned må du spare:" / "Totalt beløp" / "Du har spart" / "Avkastning før skatt"
- CTA primary: "Jeg vil starte sparingen", href `https://www.sparebank1.no/{bank}/nettbank-privat/fond/sparemetoder?isin={ISIN}&maanedsbelop={monthlyAmount}&startbelop={start of current tab}`. For Sparekonto (isin null) the href is `…/{bank}/nettbank-privat/min-sparing/kontosparing/fast-sparing`.
- CTA secondary: "Kontakt meg om sparing", href = data-config contactUrl (`/content/sites/sb1/nb/bank/privat/kundeservice/bestill/kontakt-meg-om-sparing.html`). Fallback is `/nb/{bank}/privat/kundeservice/bestill/kontakt-meg-om-sparing.html`. Group aria-label: "Start sparing muligheter".
- On the generic bank (`bankShortName==="bank"`) both CTAs `preventDefault()` and dispatch `CustomEvent("sparekalkulator-kjop" | "sparekalkulator-kontakt", {detail:{params:"isin=…&maanedsbelop=…&startbelop=…"}})`. The page bank-picker overlay (data-overlayLinks) handles them.
- Toggle: "Se avkastning med ulik risiko" (aria-expanded). Expanded footnote: "Fondene som vises, er kun et utvalg av fondene vi tilbyr. Alle fond finner du i fondsoversikten. Den forventede avkastningen er kun et estimat og er ingen garanti for fremtidig avkastning."
- Bar labels: "Ingen risiko:", "Lav risiko:", "Medium risiko:", "Høy risiko:"
- Disclaimer (both tabs): "* Historisk avkastning for fond er ingen garanti for fremtidig avkastning. Fremtidig avkastning avhenger blant annet av markedsutvikling, forvalters dyktighet, fondets risiko, samt kostnader ved tegning, forvaltning og innløsning. Avkastningen kan bli negativ som følge av kurstap. Avkastning for sparekonto er basert på historisk rente og kan variere sett mot dagens rente."
- Package descriptions (from the API, not shown in the main view): Sparekonto "Bankinnskudd med fast rente og innskuddsgaranti."; Alt-i-ett 20 "Kombinasjonsfond med ca. 20 % aksjer og 80 % renter. Passer for deg som ønsker lav risiko."; 50 "… ca. 50 % aksjer og 50 % renter. Passer for deg som ønsker middels risiko."; 80 "… ca. 80 % aksjer og 20 % renter. Passer for deg som ønsker høy risiko."; 100 "Aksjefond med ca. 100 % aksjer. Passer for deg som ønsker høyest mulig forventet avkastning og tåler svingninger."
- Fund dialog (click on the fund name): description, "avkastning siste år", NAV, chart, period returns, Oversikt/Fordeling/Om fondet, "Minste månedlige sparebeløp", "Minste sparebeløp ved engangskjøp", documents (Nøkkelinformasjon, Faktaark, Prospekt), "Generell ansvarsfraskrivelse". This is a full fund-detail component and probably out of scope for the port. Linking to the fund page is the simpler option.
- nn and en dictionaries also exist (language comes from `SB1.config.user.language` / `bank.defaultLanguage`).

## Observed quirks
- The goal tab's "Jeg vil starte sparingen" uses the **monthly tab's** `monthlyAmount` (500) as `maanedsbelop`, not the required saving. Captured href: `…sparemetoder?isin=NO0010841042&maanedsbelop=500&startbelop=0`. This looks like a bug.
- Analytics: `_sb1webbehaviortracker().calculatorInteraction({calculatorName:"Spar hver måned"|"Sett et sparemål"})` fires once per tab on the first edit. `trackButtonClick` fires for tabs/CTAs/links, and `trackCustomHumio("opne-fond-sparekalulator")` fires on the fund dialog.

## Personal / auth
- The calculator calls work with no cookies (Node fetch, 200 OK). No SSN header, no `credentials:"include"`.
- `/user`: the calculator bundle contains no `/user` call. The AEM page shell calls `GET /openapi/nettsider/ressurser/bank/user`, which returns `{"authenticated":false,"realms":[],"bank":"bank"}`. That call is not used by the calculator.
- `products/available?fid=` depends on the bank (`fid-ostlandet` for the generic /nb/bank/ page) but not on the user.

## Test vectors (widget input → displayed; all match the formula)
| # | mode | P | m / G | years | risk | package (rate) | displayed |
|---|---|---|---|---|---|---|---|
| M0 | monthly | 6 000 | 500 | 5 | medium | AiE 50 (5,33) | 42 107 / 6 107 / 36 000 |
| M1 | monthly | 6 000 | 2 000 | 5 | medium | AiE 50 | 145 094 / 19 094 / 126 000 |
| M2 | monthly | 0 | 2 000 | 5 | medium | AiE 50 | 137 315 / 17 315 / 120 000 |
| M3 | monthly | 0 | 2 000 | 10 | medium | AiE 80 (6,03) | 327 039 / 87 039 / 240 000 |
| M4 | monthly | 0 | 2 000 | 10 | high | AiE 100 (6,50) | 335 159 / 95 159 / 240 000 |
| M5 | monthly | 0 | 2 000 | 10 | none | Sparekonto (3,00) | 279 583 / 39 583 / 240 000 |
| M6 | monthly | 0 | 2 000 | 10 | low | AiE 50 | 315 340 / 75 340 / 240 000 |
| M7 | monthly | 50 000 | 2 000 | 10 | low | AiE 50 | 399 381 / 109 381 / 290 000 |
| M8 | monthly | 50 000 | 2 000 | 20 | low | AiE 50 | 986 627 / 456 627 / 530 000 |
| M9 | monthly | 50 000 | 2 000 | 20 | high | AiE 100 | 1 140 481 / 610 481 / 530 000 |
| M10 | expanded | 50 000 | 2 000 | 20 | all | 3,00/5,33/6,03/6,50 % | 745 626 / 986 627 / 1 075 644 / 1 140 481 |
| M12 | monthly | 6 000 | 500 | 15 | low | AiE 50 | 149 610 / 53 610 / 96 000 |
| G0 | goal | 20 000 | 200 000 | 5 | medium | AiE 50 | 2 535 / 200 000 / 172 100 / 27 900 |
| G1 | goal | 20 000 | 200 000 | 10 | high | AiE 100 | 969 / 200 000 / 136 280 / 63 720 |
| G2 | goal | 20 000 | 1 000 000 | 5 | medium | AiE 50 | 14 187 / 1 000 000 / 871 220 / 128 780 |
| G3 | goal | 20 000 | 1 000 000 | 15 | medium | AiE 80 | 3 294 / 1 000 000 / 612 920 / 387 080 |
| G4 | goal | 20 000 | 1 000 000 | 15 | none | Sparekonto | 4 272 / 1 000 000 / 788 960 / 211 040 |
| G5 | goal | 0 | 1 000 000 | 15 | low | AiE 50 | 3 662 / 1 000 000 / 659 160 / 340 840 |
| G6 | expanded | 0 | 1 000 000 | 15 | all | 3,00/5,33/6,03/6,50 % | 4 409 / 3 662 / 3 460 / 3 330 |

Direct API grid (P=10 000, m=1 000) → rate: low 1y 3, 3y 3, 5y 4.62; medium 1y 3, 3y 4.62, 7y 5.33, 8y 5.33, 9y 5.33; high 0y 3 (nominell = 10 000), 1y 3, 2y 5.33, 3y 5.33, 4y 5.33, 5y 6.03. suggested(5, low) = Alt-i-ett 20 (id 9). Full pairs are in savings-vectors.json.

## Screenshots
- /tmp/spike-b-work/spare-1440-monthly.png: widget, default state
- /tmp/spike-b-work/spare-1440-monthly-page.png: full page at 1440
- /tmp/spike-b-work/spare-1440-monthly-expanded.png: monthly, 2 000/50 000/20 y/Høy, all-risk bars open
- /tmp/spike-b-work/spare-1440-goal.png, /tmp/spike-b-work/spare-1440-goal-expanded.png: goal tab
- /tmp/spike-b-work/spare-1440-product-dialog.png: fund sheet (Alt-i-ett 50 N)
- /tmp/spike-b-work/spare-360-monthly.png, /tmp/spike-b-work/spare-360-monthly-page.png, /tmp/spike-b-work/spare-360-goal.png: 360 px (inputs only, no sliders)

## Port recommendation (EDS)
Compute everything client-side. Put the 5-package rate table and the 4×4 bucket mapping in a config sheet, and use the closed formula above. That reproduces the API exactly and removes the CORS-blocked dependency. Fund display names/ISINs can be static, because the bundle's own `Sa` map is static too. Link fund names to the fund pages instead of rebuilding the fund-detail sheet.

## Budget used
About 42 API-triggering actions in total: 3 page loads, ~22 widget interactions including two "expand" clicks (8 calls each) and one fund dialog, and 15 sequential direct GETs spaced 1.5 s apart. One Playwright run aborted on a selector after 11 monthly steps. Its displayed values were kept, and its API pairs were re-derived through the verified formula plus the expanded-bar values.
