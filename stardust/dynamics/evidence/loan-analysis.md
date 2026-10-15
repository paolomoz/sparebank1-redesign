# SpareBank 1 boliglånskalkulator (`#boliglan-kalkulator`): reverse-engineering notes

Captured 2026-10-15 from https://www.sparebank1.no/nb/bank/privat/lan/boliglan.html (bank context `bank`).
Bundle: `/bank/nettbank-privat/boliglan-kalkulator/static/sb1-lanekalkulator.js` (React 19, Vite) plus `sb1-lanekalkulator.css`, which is injected into an **open shadow root** on the mount.
Evidence: `/tmp/spike-b-work/loan-vectors.json` (43 deduplicated request/response pairs, 13 UI steps with displayed text), raw captures in `/tmp/spike-b-work/loan-caps/`, scripts and fit in `/tmp/spike-b-work/loan-scripts/` (`fit.py` reproduces every number below).
Calls to the live calculator API: 49 in total (47 POSTs from the widget or page-context fetch, 1 cookieless curl POST, 1 OPTIONS). All were sequential with 1.5 s pauses.

## TL;DR verdicts

| Tab | Endpoint(s) | Reproducible client-side? | Fit across samples |
|---|---|---|---|
| "Hvor mye koster lånet?" | `annuity-loan` | **Yes, exactly.** Standard monthly annuity, fees, and an IRR effective rate. | max abs deviation: monthlyPayment 0, monthlyNetPayment 0, totalInterest 1.3e-5 kr, totalAmountPaid 4e-8 kr, totalFees 0, totalTaxDeduction 3e-6 kr, effectiveAnnualRate 3e-10 pp, every amortization row < 1e-7 (20 samples) |
| "Hvor mye kan jeg låne?" | `economy`, then `annuity-loan` (for the price example) | **Yes for every input the UI can produce.** Closed formula: 2024 Norwegian tax rules, a 12-cell SIFO table plus car add-ons, a 4-value housing-cost table, and maxLoan from an annuity at the nominal rate capped at 5× income. | displayed "Vi tror du kan låne" **23/23 exact**. tax ≤ 0.72 kr, maxLoanAmount ≤ 9.9 kr, adjustedMaxLoanAmount ≤ 7.4 kr. sifo, property and existing-mortgage expenses are exact. |

The constants come from tables (tax year, SIFO "Loke" dataset). The server can update them without notice, for example on a new tax year or SIFO revision. That is the maintenance risk of a client-side port.

## Mount, config, and whether the widget is on each page

`nb_bank_privat_lan_boliglan.html`:
```html
<div id="boliglan-kalkulator" data-process="boliglan-kalkulator"></div>
<script type="module" src="/bank/nettbank-privat/boliglan-kalkulator/static/sb1-lanekalkulator.js"></script>
<script>
    var sparebank1Config = {
        bankAffiliate: "bank", bankName: "SpareBank 1 Bank",
        apiBaseUrl: "/api/personal/banking/boliglan-kalkulator",
        authenticationUrl: "/nb/bank/privat/innlogging/identifisering.html",
        authorizationPMUrl: "/nb/bank/privat/innlogging/logg-inn.html?goto=https://www.sparebank1.no/bank/nettbank-privat/avtale/velg-avtale",
        basename: "/nb/bank/privat/lan/boliglan/ny-lanekalkulator.html",
        lang: "nb",
        text: { priceExample: "Nominell rente 5,33 %. Effektiv rente 5,52 %. Låner du 2 millioner over 25 år koster lånet 1.644.115 og du betaler totalt 3.644.115 kroner.",
                loanContact: "Kontakt meg om lån", loanApply: "Søk lån" },
        initialTabIndex: "0",
        costOfLoan: { url: { applyForLoan: "https://www.sparebank1.no/bank/nettbank-privat/boliglan-soknad/start",
                             contactLoan: "https://www.sparebank1.no/nb/bank/privat/kundeservice/bestill/kontakt-meg-om-lan.html" },
            number: { annualNominalInterestRate: Number("5.33"), establishmentFee: Number("2900"), paymentFee: Number("50"),
                      housingPrice: Number("3000000"), equity: Number("300000"), repaymentPeriod: Number("25"),
                      fixedInterestRate: Number("2.8"), fixedInterestRateBindingPeriod: Number("5") } },
        howMuchLoan: { url: { /* same two URLs */ },
            number: { arrangementFee: Number("1500"), grossAnnualIncome: Number("400000"), existingLoan: Number("200000"),
                      annualNominalInterestRate: Number("5.33"), paymentFee: Number("50"), repaymentPeriod: Number("25") } }
    };
</script>
```
- The only mount attribute is `data-process="boliglan-kalkulator"`; no other data-* attributes are on it. Everything is configured through the global `window.sparebank1Config`, which AEM authors per bank page.
- Unused keys (never read by the bundle): `text.priceExample`, `fixedInterestRate`, `fixedInterestRateBindingPeriod`, `bankAffiliate`, `bankName`, `authenticationUrl`, `authorizationPMUrl`, `basename`. `trackerEnv` is read but absent from the config, so the widget's own tracker is `null` (see "Other network calls").
- The authored `priceExample` text ("koster lånet 1.644.115") does **not** match what the API returns for the same 2 MNOK / 25 years / 5.33 % / 2900 / 50 example (`totalInterest+totalFees` = 1 641 761, total 3 641 761, eff 5.52 %). It is stale static copy rendered by a separate AEM text component above the widget.
- **lanekalkulator.html**: the widget **is present and functional**. Mount `<div id="boliglan-kalkulator" data-process="boliglan-kalkulator" data-overlay="true">`, identical `sparebank1Config`, `initialTabIndex: "0"`, and it rendered "Vi tror du kan låne 1 096 100 kr" with the same 2 API calls on load. The page is also a hub: `<title>` is "Lånekalkulator | Hvor mye koster lånet? | SpareBank 1", the H1 is "Lånekalkulatorer", and it links to `/nb/bank/privat/lan/lanekalkulator/{boliglanskalkulator,lofavor,hvor-mye-kan-jeg-lane,hva-koster-lanet}.html`, to forbrukslån and refinansiering calculators, and to 12 regional-bank variants. `data-overlay` is not read by the bundle.

Bundle bootstrap (verbatim, minified):
```js
jn=`boliglan-kalkulator`;function Mn(){return document.getElementById(jn).attachShadow({mode:`open`,delegatesFocus:!0})}
...async function Pn(e){let t=document.createElement(`link`);t.rel=`stylesheet`,t.href=new URL(`./sb1-lanekalkulator.css`,``+import.meta.url).href,e.appendChild(t)}
async function Fn(){document.body.style.margin=`0`;let e=Nn();await Pn(e),ie.createRoot(e).render(...)}
En=()=>window.sparebank1Config?.initialTabIndex===`1`?`lanekostnad`:`laneevne`
```

### Per-bank variation (bank pages fetched as HTML, no API calls)
The API request carries no bank ID; the API is bank-agnostic. Rate and fees come from each bank page's authored `sparebank1Config`:

| bank | rate % | establishmentFee (koster-tab) | arrangementFee (kan-låne tab) | paymentFee | koster-tab defaults price/equity/years |
|---|---|---|---|---|---|
| bank | 5.33 | 2900 | 1500 | 50 | 3 000 000 / 300 000 / 25 |
| smn | 5.09 | 3850 | 1500 | 65 | 3M / 500k / 25 |
| nord-norge | 5.24 | 4000 | 1500 | 65 | 3M / 300k / 25 |
| sor-norge | 5.49 | 1000 | 1500 | 60 | 4M / 400k / 30 |
| ostlandet | 5.24 | 2300 | 1500 | 60 | 5M / 500k / 25 |
| ostfold-akershus | 5.46 | 3000 | 1500 | 60 | 3M / 500k / 25 |
| helgeland | 5.59 | 3000 | 1500 | 65 | 3M / 500k / 25 |
| gudbrandsdal | 5.20 | 2000 | 1500 | 50 | 3M / 300k / 25 |
| hallingdal | 5.15 | 3000 | 1500 | 75 | 3M / 500k / **`${kalkulatorer.boliglan-for-unge.nedbetalingstid}`** (unresolved placeholder, becomes NaN) |
| lom-skjaak | 5.40 | 2500 | 1500 | 40 | 3M / 300k / 25 |
| nordmore | 5.64 | 3000 | 1500 | 75 | price, equity and years are **unresolved `${…}` placeholders**, so NaN |
| ringerike-hadeland | 5.19 | 2000 | 1500 | 50 | 3M / 500k / 30 |
| sogn-fjordane (nn) | 5.69 | 3500 | 1500 | 65 | 3M / 500k / 25 |

Every bank uses `arrangementFee` 1500 on the kan-låne tab and the same `apiBaseUrl`. The nominal rate is **hard-coded per bank page by authors, not returned by the API**. The API echoes nothing about the rate except `stressTestInterestRate` (rate + 3).

## Endpoint map

Base: `window.sparebank1Config?.apiBaseUrl ?? '/kalkulator-api'`, which is `/api/personal/banking/boliglan-kalkulator`.
```js
he=window.sparebank1Config?.apiBaseUrl??`/kalkulator-api`;function ge(){return document.querySelector(`meta[name="_csrf"]`)?.content||window.SB1?.config?.server?.xcsrftoken}
async function _e(e,t){let n=ge(),r={"Content-Type":`application/json`,Accept:`application/vnd.sparebank1.v1+json`};n&&(r[`X-CSRFToken`]=n);
 let i=await fetch(`${he}${e}`,{method:`POST`,credentials:`same-origin`,headers:r,body:JSON.stringify(t)});if(!i.ok)throw Error(`API error: ${i.status} ${i.statusText}`);return i.json()}
function ve(e){return _e(`/annuity-loan`,e)}function ye(e){return _e(`/economy`,e)}
```
- The page has no `_csrf` meta and no `SB1.config.server.xcsrftoken`, so no CSRF header is sent. None is required.
- Debounce: `be(fn, 500, deps)` is a 500 ms setTimeout. A request-sequence ref discards stale responses.
- Response headers on both endpoints: `content-type: application/vnd.sparebank1.v1+json;charset=utf-8`, `cache-control: no-cache, no-store, max-age=0, must-revalidate`, `x-frame-options: DENY`, `server: CloudFront`, `x-envoy-upstream-service-time`. **No `access-control-*` header on any captured response.**
- CORS check: an `OPTIONS` preflight with `Origin: https://main--sb1--adobe.aem.page` returns **401** with no ACAO. A cookieless curl `POST` with that Origin returns **200** with a valid JSON body and no ACAO. Server-to-server calls (a proxy) work; direct browser calls from another origin are blocked.

| UI event | Calls |
|---|---|
| Page load (tab "kan jeg låne" default) | `economy`, then, if `displayedAdjustedMaxLoanAmount > 0`, `annuity-loan` |
| Any change on the kan-låne tab (borrowers, children, cars, income, debt) | same pair; no call if income ≤ 0 |
| First open of the "koster lånet" tab (lazy mount) | `annuity-loan` |
| Any change on the koster tab (price, equity, loan, rate, years) | `annuity-loan`; no call (result cleared) if loan < 10 000 or price ≤ 0 |

### `POST …/economy` request (built by `sn()`; constants are hard-coded in the bundle)
```js
tn=35,nn=[9,9,9,9,9],rn=`Loke`
on=(e,t)=>({age:e,gender:t%2==0?`Female`:`Male`,kindergarden:e>=1&&e<=5,afterSchoolCareFullTime:!1,afterSchoolCarePartTime:e>=6&&e<=9})
sn=(e,t,n,r,i,a)=>{let o=r/e,s=[{age:tn,gender:`Male`,grossSalary:o,employmentStatus:`Employed`}];e===2&&s.push({age:tn,gender:`Female`,grossSalary:o,employmentStatus:`Employed`});
 let c=[];for(let e=0;e<t&&e<5;e++)c.push(on(nn[e],e));let l={calculationDataset:rn,adults:s,children:c.length>0?c:void 0,numberOfPetrolCars:n,numberOfElectricCars:0,existingMortgage:i};
 return a.annualNominalInterestRate!=null&&(l.interestRate=a.annualNominalInterestRate),a.paymentFee!=null&&(l.feeMonthly=a.paymentFee),a.repaymentPeriod!=null&&(l.loanTermYears=a.repaymentPeriod),a.arrangementFee!=null&&(l.feeEstablishment=a.arrangementFee),l}
```
| request field | UI control / source |
|---|---|
| `adults[]` (1 or 2; age 35; Male, then Female; `grossSalary` = income ÷ borrowers; `employmentStatus: "Employed"`) | "Antall låntakere" + "Samlet inntekt før skatt" |
| `children[]` (0–5, all age 9, gender F, M, F, M, F; `kindergarden:false, afterSchoolCareFullTime:false, afterSchoolCarePartTime:true`) | "Antall barn under 18 år" (5+ means 5) |
| `numberOfPetrolCars` (0–2), `numberOfElectricCars: 0` | "Antall biler" |
| `existingMortgage` | "Samlet lån og gjeld" |
| `calculationDataset: "Loke"` | constant |
| `interestRate`, `feeMonthly`, `loanTermYears`, `feeEstablishment` | `howMuchLoan.number.{annualNominalInterestRate, paymentFee, repaymentPeriod, arrangementFee}` |

Response, verbatim keys (sample: 1 borrower, 400 000 income, 200 000 debt):
```json
{"calculationDataset":"Loke","grossSalary":400000,"tax":80192.0908665818,"netSalary":319807.90913341823,"assets":0,"sifoExpenses":143484,
 "propertyExpenses":81183.95999999999,"existingMortgageExpenses":15095.44251931117,"totalExpenses":239763.40251931117,"stressTestInterestRate":8.33,
 "stressTestRiskAmount":0,"disposableSalary":80044.50661410706,"liquidity":1.8351540692594952,"loanToValueRatio":100,"debtRatio":0.5,
 "maxDebtRatioAmount":2000000,"maxLoanAmount":1096130.821922397,"adjustedMaxLoanAmount":1096130.821922397,"displayedAdjustedMaxLoanAmount":1096100}
```
The UI displays only `displayedAdjustedMaxLoanAmount`.

### `POST …/annuity-loan` request
Koster tab:
```js
ve({loanRaisingYear:t.getFullYear(),loanRaisingMonth:t.getMonth()+1,purchasePrice:i,equity:o,interestRate:u,feeEstablishment:r.establishmentFee,feeMonthly:r.paymentFee,taxDeductionRate:.22,loanTermYears:f,interestOnlyYears:0})
```
Kan-låne tab (price example):
```js
ve({loanRaisingYear:...,loanRaisingMonth:...,purchasePrice:e.displayedAdjustedMaxLoanAmount,equity:0,interestRate:r.annualNominalInterestRate??5,feeEstablishment:r.arrangementFee??0,feeMonthly:r.paymentFee??60,taxDeductionRate:.22,loanTermYears:r.repaymentPeriod??25,interestOnlyYears:0})
```
| field | koster-tab control |
|---|---|
| `purchasePrice` | Kjøpesum |
| `equity` | Egenkapital (Ønsket lånebeløp = price − equity is not sent) |
| `interestRate` | Nominell rente slider/input |
| `loanTermYears` | Nedbetalingstid slider/input |
| `feeEstablishment`, `feeMonthly` | `costOfLoan.number.establishmentFee` / `paymentFee` (no UI) |
| `loanRaisingYear/Month` | current date (only labels the schedule) |
| `taxDeductionRate: 0.22`, `interestOnlyYears: 0` | constants |

Response:
```json
{"purchasePrice","equity","debtRatio"(=loan/price*100),"loanAmount","monthlyPayment","monthlyNetPayment","totalInterest","totalPrincipal","totalFees",
 "totalTaxDeduction","totalAmountPaid","effectiveAnnualRate"(percent),
 "amortizationSchedule":[{"index","year","month","interest","principal","fee","taxDeduction","payment","netPayment","balance"} x 12*years]}
```

## Tab 1: "Hvor mye kan jeg låne?" (`laneevne`)

### Controls
| Label (verbatim) | Type | Options / limits | Default |
|---|---|---|---|
| Antall låntakere | toggle-button group (`role=group`, `aria-pressed`) | 1, 2 | 1 |
| Antall barn under 18 år | toggle group | 0, 1, 2, 3, 4, 5+ (value 5) | 0 |
| Antall biler | toggle group | 0, 1, 2 | 0 |
| Samlet inntekt før skatt | `input type=text inputmode=numeric`, id `samlet-inntekt-før-skatt`, suffix "kr", nb thousands formatting (NBSP), digits only, max 999 999 999 (maxLength 11) | | 400 000 (`howMuchLoan.number.grossAnnualIncome`, bundle fallback 600 000) |
| Samlet lån og gjeld | same, id `samlet-lån-og-gjeld` | | 200 000 (`existingLoan`, fallback 0) |

### Visible strings (nb, verbatim)
- Tabs: "Hvor mye kan jeg låne?" / "Hvor mye koster lånet?" (tablist aria-label "Velg kalkulator")
- Result label: "Vi tror du kan låne". Value: "`{displayedAdjustedMaxLoanAmount formatted}` kr" (h2), or "0 kr" when there is no result or it is 0.
- CTAs: "Søk lån" (primary; bundle default "Få tilbud på lån" is overridden by `text.loanApply`) → `https://www.sparebank1.no/bank/nettbank-privat/boliglan-soknad/start?numberOfBorrowers=1&numberOfChildren=0&numberOfCars=0&grossAnnualIncome=400000&existingLoan=200000&source=kalkulator`. "Kontakt meg om lån" (secondary) → `https://www.sparebank1.no/nb/bank/privat/kundeservice/bestill/kontakt-meg-om-lan.html?` with the same query. Anchors carry `data-bank-chooser-trigger="apply-for-loan"` / `"contact-for-loan"`.
- Disclaimer: "Ved å søke kan vi gi deg et tilbud med svar på nøyaktig hvor mye du kan låne, og hva det vil koste. Det er helt uforpliktende å søke lån hos oss."
- Price example (shown only if the second annuity call succeeded): template `Priseksempel: Nominell rente {nominalRate} %. Effektiv rente {effectiveRate} %. Låner du {loanAmount} over {years} år koster lånet {loanCost} og du betaler totalt {totalAmount} kroner.`
  - nominalRate is the config rate formatted `toFixed(2)` with a comma. effectiveRate is `toFixed(2)` with a comma. loanAmount, loanCost (= round(totalInterest + totalFees)) and totalAmount (= round(totalAmountPaid)) use nb integer formatting. years = config repaymentPeriod.
  - Example (default): "Priseksempel: Nominell rente 5,33 %. Effektiv rente 5,56 %. Låner du 1 096 100 over 25 år koster lånet 906 457 og du betaler totalt 2 002 557 kroner."

### Captured UI steps (displayed result, from `loan-vectors.json` → `uiSteps`)
| borrowers / kids / cars / income / debt | Vi tror du kan låne | Price example eff. rate, cost, total |
|---|---|---|
| 1/0/0/400 000/200 000 (default) | 1 096 100 kr | 5,56 % / 906 457 / 2 002 557 |
| 1/0/0/600 000/200 000 | 2 800 000 kr (5× cap − debt) | shown |
| 1/0/0/600 000/0 | 3 000 000 kr (5× cap) | shown |
| 2/0/0/600 000/0 | 2 310 200 kr | shown |
| 2/2/0/600 000/0 | 446 000 kr | shown |
| 2/2/1/600 000/0 | 0 kr (budget negative; no annuity call, no price example) | hidden |
| 2/2/1/1 200 000/0 | 5 400 700 kr | 5,48 % / 4 401 492 / 9 802 192 |

### Reproduction (closed formula; `fit.py` → `econ_model`)
Notation: A = borrowers (1–2), K = children (0–5), C = cars (0–2), G = gross income, D = existing debt. rate = 5.33, fee = 50, n = 300 (config). `ann(L) = L·r/(1−(1+r)^−n)`, with r = rate/1200.

1. **Tax per adult** (each adult has g = G/A). These are the 2024 Norwegian parameters:
   - minstefradrag = min(46 % · g, 104 450). personfradrag = 88 250.
   - alminnelig inntekt = max(0, g − minstefradrag − rentefradrag/A − foreldrefradrag/A − 88 250), taxed at 22 %.
   - trygdeavgift = 7.8 % · g.
   - trinnskatt = 1.7 % on 208 050–292 850, 4.0 % up to 670 000, 13.6 % up to 937 900, 16.6 % up to 1 350 000, 17.6 % above.
   - rentefradrag = 12 × (month-2 interest of the existing debt's annuity) = 12 · r · (D − (ann(D) − D·r)). The service uses the second schedule row as its "typical month".
   - foreldrefradrag = 0 if K = 0, else 25 000 + 15 000·(K−1). The children are 9 years old with SFO, hence childcare-eligible.
2. **netSalary** = G − Σtax + 12 648·K (barnetrygd 1 054 kr/month per child; tax-free).
3. **sifoExpenses** = SIFO[A,K] + CAR[C], with CAR = [0, 38 100, 57 600]. These are only valid for the fixed UI demographics (adults 35 M/F, children 9 years old alternating F/M):

   | K → | 0 | 1 | 2 | 3 | 4 | 5 |
   |---|---|---|---|---|---|---|
   | A=1 | 143 484 | 221 232 | 302 340 | 385 008 | 464 676 | 545 184* |
   | A=2 | 241 848 | 322 956 | 405 624 | 485 292 | 565 800 | 644 988 |
   *Derived from 1/5/2 = 602 784 − 57 600. Every other cell was observed directly. The table is not additive per person, because SIFO household-size scaling applies.
4. **propertyExpenses** = 81 183.96 (A=1, K=0), 84 086.88 (A=1, K≥1), 92 650.92 (A=2, K=0), 98 077.92 (A=2, K≥1). Independent of income, cars and debt.
5. **existingMortgageExpenses** = 12 · (ann(D) + fee) at the **nominal** rate over n months. This is exact: 15 095.4425 for 200 k, 22 343.1638 for 300 k, 36 838.6063 for 500 k.
6. **disposableSalary** = netSalary − sifo − property − existingMortgageExpenses.
7. **maxLoanAmount** = max(0, (disposable − 12·fee) / (12 · ann(1))), which is the annuity at the **nominal 5.33 %**, not at the stress rate.
8. **maxDebtRatioAmount** = 5·G. **adjustedMaxLoanAmount** = min(maxLoan, 5·G − D).
9. **displayedAdjustedMaxLoanAmount** = round(adjusted / 100) · 100.

Other response fields: `debtRatio` = D/G. `stressTestInterestRate` = rate + 3 (8.33), returned but **not used** in maxLoan for any sample. `stressTestRiskAmount` was 0 in all samples. `loanToValueRatio` was always 100. `assets` was 0. `liquidity` was not fitted (not displayed).

Fit over 23 economy samples (14 direct + 9 UI; full grid of A × K at 1.2 M, cars 0/1/2, incomes 200 k to 2 M, debt 0/200 k/300 k/500 k): sifo, property and existing-mortgage expenses and maxDebtRatioAmount match exactly. The tax residual is a constant +0.057 kr per adult for 292 850 < g ≤ 670 000, +0.359 kr at 1.0–1.2 M, +0.535 kr at 1.5 M, and 0 at 200 k; the source is likely a tiny constant difference in trinnskatt. That gives max 0.72 kr on tax and netSalary, max 9.9 kr on maxLoanAmount, max 7.4 kr on adjusted, and **0 on the displayed value (23/23)**. A residual of ε kr flips the displayed 100-kr rounding only when the true value lies within ε of a …50 boundary. With ε ≈ 0.8–1.6 kr (typical incomes) that is about 1–2 % of inputs; with ε ≈ 10 kr (2 M income plus debt) it is about 10 %. An off-by-100 kr display in those cases is the realistic worst case.

**Verdict: reproducible client-side** (honest caveat: ±100 kr display flips near rounding boundaries, and the tables and tax year can change server-side). The table covers every combination the UI can send. Ages and genders are hard-coded in the bundle, so no other SIFO cells are reachable.

## Tab 2: "Hvor mye koster lånet?" (`lanekostnad`)

### Controls
| Label (verbatim) | Type | Limits | Default |
|---|---|---|---|
| Kjøpesum | text/numeric currency input (`id=kjøpesum`), suffix "kr", max 999 999 999 | ≥ 0. Changing it keeps equity (clamped ≤ price) and sets loan = price − equity | 3 000 000 (`costOfLoan.housingPrice`, fallback 3e6) |
| Egenkapital | same (`id=egenkapital`) | clamped 0..price. Sets loan = price − equity | 300 000 (fallback 500 000) |
| Ønsket lånebeløp | same (`id=ønsket-lånebeløp`) | clamped 0..price. Sets equity = price − loan | 2 700 000 (derived) |
| Nominell rente | `input type=range` min 0.01 max 10 step 0.01 (aria-label "Nominell rente") plus a text input (aria-label "Nominell rente verdi", suffix "%", accepts `,` or `.`, max 4 digits, ≤ 2 decimals). Range labels "0,01 %" / "10,00 %". Tooltip button (aria-label "Vis hjelpetekst") | | 5.33 (`annualNominalInterestRate`, fallback 5.03) |
| (sub-label under the rate) | text | "Tilsvarer {rate} % effektiv rente" (from the response; hidden until there is a result) | "Tilsvarer 5,51 % effektiv rente" |
| Nedbetalingstid | range min 1 max 30 step 1 plus a text input (suffix "år"). Range labels "1 år" / "30 år" | | 25 (`repaymentPeriod`, fallback 25) |

Tooltip text: "Nominell rente er den løpende renten du får. Den effektive renten viser i tillegg alle gebyrer og andre utgifter i forbindelse med lånet."

### Results and strings (verbatim)
- "Månedlig beløp": `round(monthlyPayment)` kr (h2). Below it: "Kostnad etter skattefradrag {amount} kr", where amount = round(monthlyNetPayment). With no result: "0 kr" / "Kostnad etter skattefradrag 0 kr".
- "Egenkapital": `{equity/price·100, 2 decimals, comma}` % (h2). Below it: "Lånet er {(price−equity)/price·100} % av boligens verdi". Both show "0" when loan < 10 000.
- CTAs: "Søk lån" and "Kontakt meg om lån", same URLs, query `borrowingAmount, purchasePrice, repaymentTerm, effectiveInterestRate, monthlyPrice, source=kalkulator`. Example: `…/boliglan-soknad/start?borrowingAmount=2700000&purchasePrice=3000000&repaymentTerm=25&effectiveInterestRate=5.506441198403711&monthlyPrice=16357.372834225063&source=kalkulator`.
- Disclaimer: the same text as tab 1 ("Ved å søke kan vi gi deg et tilbud …").
- "Vis nedbetalingsplan" (expand button) shows a table with the headers "Dato | Å betale | Avdrag | Renter + Gebyrer | Restgjeld". Rows are grouped per year (expandable "›2026"); month rows are "2026-10" etc.; the last row is "Total … 0". Captured: `['›2026','41 051','9 913','31 138','2 490 087'], ['2026-10','15 617','3 292','12 325','2 496 708'], ['2026-11','12 717',…]`.
- Price example: same template. nominalRate = slider value, years = slider value. Default: "Priseksempel: Nominell rente 5,33 %. Effektiv rente 5,51 %. Låner du 2 700 000 over 25 år koster lånet 2 210 112 og du betaler totalt 4 910 112 kroner."

### Reproduction (`fit.py` → `ann_model`)
L = price − equity, n = 12·years, r = rate/1200, A = L·r / (1 − (1+r)^−n), est = establishmentFee, f = paymentFee.
- schedule row i: interest = bal·r, principal = A − interest, fee = f + (est if i = 1), payment = A + fee, taxDeduction = 0.22·interest, netPayment = payment − taxDeduction, balance −= principal.
- `monthlyPayment` = A + f (includes the monthly fee, excludes est).
- `monthlyNetPayment` = A + f − 0.22·interest₂, using **row 2's** interest.
- `totalInterest` = n·A − L. `totalPrincipal` = L. `totalFees` = est + n·f. `totalAmountPaid` = L + totalInterest + totalFees. `totalTaxDeduction` = 0.22·totalInterest.
- `effectiveAnnualRate` = ((1 + IRR_m)^12 − 1)·100, where the IRR solves 0 = L − Σ payment_i/(1+IRR_m)^i, with the establishment fee **paid together with instalment 1** (not deducted at t0; that variant deviates by up to 0.14 pp).
- Displayed derived values: loanCost = round(totalInterest + totalFees).

Fit over 20 samples (amounts 10 000 to 6 000 000; 1/5/10/15/20/25/30 years; rates 0.01/4.5/5.33/10 %; fees 2900/50, 1500/50, 0/0): max |Δ| monthlyPayment 0, monthlyNetPayment 0, totalInterest 1.3e-5, totalFees 0, totalAmountPaid 4e-8, totalTaxDeduction 3e-6, effectiveAnnualRate 3.2e-10 pp, schedule rows < 1e-7, schedule length exact.
The nominal rate is a **request input**: the page config default, then the slider. It is not returned. The API simply echoes back calculations for any rate.

**Verdict: fully reproducible client-side** (deterministic, no server data).

## Other network calls
- `/api/tracking/webbehavior` (POST, 201, empty body, `content-security-policy: default-src 'none'`). 3 calls on page load only, from the **site clientlib** (`clientlib_base…js`: `window._sb1webbehaviortracker`, `trackPage`), not from the widget. The widget's tracker (`kundefront-pm-boliglan-kalkulator`, events `calculatorInteraction`, `calculatorApplyForLoan`, `calculatorContactUs`, `buttonClicked`) is created only when `sparebank1Config.trackerEnv` is `test` or `prod`; it is unset, so the tracker is `null` and no tracking fires on interaction (confirmed: the 3 webbehavior calls all fired within about 2 s of load, and there were none during the 11 API-triggering interactions or the plan and tooltip clicks).
- No rate or bank-config API exists: rates and fees come from the inline `sparebank1Config`. The only static assets are `sb1-lanekalkulator.js` and `sb1-lanekalkulator.css`.
- Cookie consent: no consent banner was rendered in headless nb-NO (the site set an `sb1-optin-v3` cookie). The widget does not depend on consent.

## Screenshots
`/tmp/spike-b-work/lan-laneevne-1440.png`, `lan-laneevne-1440-modified.png`, `lan-lanekostnad-1440.png`, `lan-lanekostnad-1440-plan.png` (amortization plan open), `lan-laneevne-360.png`, `lan-lanekostnad-360.png`, `lan-page-1440.png` (viewport incl. page context), `lan-hubpage-widget-1440.png` (lanekalkulator.html).

## Migration implications
- Browser calls from an EDS origin to these endpoints fail (no CORS; preflight 401). Options: (a) port both models client-side (koster: exact; kan-låne: exact display except rare ±100 kr), or (b) proxy server-side (cookieless POST works) through a Worker or an edge function.
- Per-bank inputs (rate, establishmentFee, arrangementFee, paymentFee, defaults, CTA URLs, CTA labels) belong in block config or a sheet. Two banks currently ship broken `${…}` placeholders.
