# Client logic — loan-calculator

Source: https://www.sparebank1.no/nb/bank/privat/lan/lanekalkulator.html · mount `#boliglan-kalkulator` · 2026-10-15T14:28:44.697Z

**Compute locus: client (with calls).** 0 controls, 0 output mutations, 7 first-party XHR/fetch during the interaction (0 third-party ignored).

## First-party network during the interaction

- `POST https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/economy` → 200 application/vnd.sparebank1.v1+json · body `{"calculationDataset":"Loke","adults":[{"age":35,"gender":"Male","grossSalary":6500000,"employmentStatus":"Employed"}],"numberOfPetrolCars":0,"numberOfElectricCars":0,"existingMortgage":200000,"intere`
- `POST https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/annuity-loan` → 200 application/vnd.sparebank1.v1+json · body `{"loanRaisingYear":2026,"loanRaisingMonth":10,"purchasePrice":32300000,"equity":0,"interestRate":5.33,"feeEstablishment":1500,"feeMonthly":50,"taxDeductionRate":0.22,"loanTermYears":25,"interestOnlyYe`
- `POST https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/economy` → 200 application/vnd.sparebank1.v1+json · body `{"calculationDataset":"Loke","adults":[{"age":35,"gender":"Male","grossSalary":3250000,"employmentStatus":"Employed"},{"age":35,"gender":"Female","grossSalary":3250000,"employmentStatus":"Employed"}],`
- `POST https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/annuity-loan` → 200 application/vnd.sparebank1.v1+json · body `{"loanRaisingYear":2026,"loanRaisingMonth":10,"purchasePrice":32300000,"equity":0,"interestRate":5.33,"feeEstablishment":1500,"feeMonthly":50,"taxDeductionRate":0.22,"loanTermYears":25,"interestOnlyYe`
- `POST https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/economy` → 200 application/vnd.sparebank1.v1+json · body `{"calculationDataset":"Loke","adults":[{"age":35,"gender":"Male","grossSalary":3250000,"employmentStatus":"Employed"},{"age":35,"gender":"Female","grossSalary":3250000,"employmentStatus":"Employed"}],`
- `POST https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/annuity-loan` → 200 application/vnd.sparebank1.v1+json · body `{"loanRaisingYear":2026,"loanRaisingMonth":10,"purchasePrice":31500000,"equity":0,"interestRate":5.33,"feeEstablishment":1500,"feeMonthly":50,"taxDeductionRate":0.22,"loanTermYears":25,"interestOnlyYe`
- `POST https://www.sparebank1.no/api/personal/banking/boliglan-kalkulator/annuity-loan` → 200 application/vnd.sparebank1.v1+json · body `{"loanRaisingYear":2026,"loanRaisingMonth":10,"purchasePrice":3000000,"equity":300000,"interestRate":5.33,"feeEstablishment":2900,"feeMonthly":50,"taxDeductionRate":0.22,"loanTermYears":25,"interestOn`

## Outputs that changed


## Source maps

- none shipped

## Logic candidates (ran on interaction, first-party, framework excluded, ranked)

### 1. `oneLine` — scripts/028-inline.js:8428

calls 2 · 85 B · math ops 4

```js
function oneLine(s) {
  return s.replace(/\n/g, "\u21B5").replace(/\t/g, "\u21C6");
}

```

### 2. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 52 · 27 B · math ops 0

```js
e=>{
  this.keyCode=e.keyCode
}

```

### 3. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 52 · 27 B · math ops 0

```js
e=>{
  this.keyCode=e.keyCode
}

```

### 4. `(anonymous)` — scripts/028-inline.js:8002

calls 24 · 29 B · math ops 0

```js
(a, b) => a.length - b.length

```

### 5. `Ed` — scripts/025-opt-in-js.js:2

calls 14 · 34 B · math ops 0

```js
function Ed(e){
  return xd(e=At(e))
}

```

### 6. `(anonymous)` — scripts/026-inline.js:384

calls 8 · 37 B · math ops 0

```js
(value2) => ({
  fallThrough: value2
})

```

### 7. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 8 · 38 B · math ops 0

```js
e=>i.default.trigger("window:click",e)

```

### 8. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 1 · 38 B · math ops 0

```js
()=>{
  (0,i.default)(this,this.$el,700)
}

```

### 9. `n` — scripts/021-clientlib-base-1156934419-js.js:1

calls 20 · 68 B · math ops 0

```js
e=>{
  "Escape"===e.key&&(a(!1),window.removeEventListener("keyup",n))
}

```

### 10. `a` — scripts/021-clientlib-base-1156934419-js.js:1

calls 1 · 147 B · math ops 1

```js
function(){
  $("[class*='scroll-reveal']").each(function(t,a){
    e.scrollTop()+e.height()>$(a).offset().top&&$(a).removeClass("scroll-reveal-hidden")
  })
}

```

### 11. `trimStringWithEllipsis` — scripts/028-inline.js:498

calls 2 · 90 B · math ops 0

```js
function trimStringWithEllipsis(input, cap) {
  return trimString(input, cap, "\u2026");
}

```

### 12. `toggleVisibilityLanguage` — scripts/021-clientlib-base-1156934419-js.js:1

calls 8 · 94 B · math ops 0

```js
function(e){
  "true"===this.$("#js-language-btn").attr("aria-expanded")&&this.languageToggle(e)
}

```
