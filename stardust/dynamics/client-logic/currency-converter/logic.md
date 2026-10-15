# Client logic — currency-converter

Source: https://www.sparebank1.no/nb/bank/privat/kundeservice/verktoy/valutakalkulator.html · mount `.currency-converter` · 2026-10-15T14:26:48.128Z

**Compute locus: client.** 1 controls, 3 output mutations, 0 first-party XHR/fetch during the interaction (0 third-party ignored).

## First-party network during the interaction

- none

## Outputs that changed

- `span.to-exchanged-amount`: "9.33" → "0.09"
- `span.to-exchanged-amount`: "9.33" → "0.93"
- `span.to-exchanged-amount`: "9.33" → "9.42"

## Source maps

- none shipped

## Logic candidates (ran on interaction, first-party, framework excluded, ranked)

### 1. `C` — scripts/020-clientlib-base-1156934419-js.js:1

calls 7 · 8317 B · math ops 57 · mentions "exchange-amount"

```js
e=>{
  const[t,a]=(0,l.useState)("true"===e.wcmmodeEdit?[{
    currencyCode:"NOK",currencyName:"Norske kroner",buyCashRate:1,sellCashRate:1,buyCurrencyChequeRate:1,sellCurrencyChequeRate:1,unitNumber:1,lastUpdatedDateAndTime:1673020859
  }
  ]:[]),[n,r]=(0,l.useState)(t.length>=1?t.find(e=>"NOK"===e.currencyCode):""),[i,C]=(0,l.useState)(t.length>=1?t.find(t=>t.currencyCode===e.wcmmodeEdit==="true"?"NOK":"EUR"):""),[v,_]=(0,l.useState)(!1),[k,y]=(0,l.useState)(!1),[E,w]=(0,l.useState)(!1),[T,S]=(0,l.useState)(!0),[N,x]=(0,l.useState)(100),[O,L]=(0,l.useState)(t?(0,h.default)(100,!0,i,n).toFixed(2):0),[A,B]=(0,l.useState)(!1),P=(0,l.useRef)(),$=(0,p.default)();
  (0,l.useEffect)(()=>{
    !async function(e){
      try{
        const t=await fetch(e),n=await t.json();
        n.length>1?(a(n),r(n.find(e=>"NOK"===e.currencyCode)),C(n.find(e=>"EUR"===e.currencyCode))):B(!0)
      }
      catch(e){
        console.error("Kunne ikke hente valuta"),B(!0)
      }
    }
    (`/openapi/nettsider/ressurser/${(0,f.default)("bank").bankSemanticUrl}/valutakurser`)
  },[]),(0,l.useEffect)(()=>{
    L((0,h.default)(N,!0,i,n).toFixed(2))
  },[N,i,n]);
  const I=E?l.default.createElement(c.TaskButton,{
    innerRef:P,icon:l.default.createElement(d.default,null),onClick:()=>w(!E),className:"currency-rates-wrapper__toggler"
  }):l.default.createElement(c.SecondaryButton,{
    innerRef:P,onClick:()=>w(!E)
  },e.currencyListBtn);
  (0,l.useEffect)(()=>{
    $||P.current?.focus()
  },[E,P]);
  const M=(0,m.useMediaQuery)({
    query:"(min-device-width: 768px)"
  }),D=t?t.map(e=>l.default.createElement("option",{
    className:"currency-select__option",value:e.currencyCode,key:e.currencyCode,defaultValue:"NOK"===e.currencyCode
  },e.currencyCode,"   -   ",e.currencyName)):[];
  return l.default.createElement(l.default.Fragment,null,A&&"true"!==e.wcmmodeEdit?l.default.createElement("div",{
    className:"currency-converter__error"
  },l.default.createElement(g.ErrorMessage,{
    title:"Det har skjedd noe galt",alert:!1,className:"currency-converter__error-box"
  },l.default.createElement(b.Paragraph,null,e.currencyConverterError))):l.default.createElement("div",{
    className:"aem-component-container"
  },"true"===e.wcmmodeEdit&&l.default.createElement("div",{
    className:"currency-converter-text-wrapper"
  },l.default.createElement("div",null,e.componentHelpText)),l.default.createElement("div",{
    className:"currency-converter-wrapper"
  },l.default.createElement("div",{
    className:"currency-head-wrapper"
  },l.default.createElement("div",{
    className:"currency-header"
  },l.default.createElement("div",{
    className:"top-from-currency"
  },l.default.createElement("div",{
    className:"left-align"
  },l.default.createElement("div",{
    className:"on-top"
  },e.currencyCalculatorFrom),l.default.createElement("div",{
    className:"on-bottom"
  },M?l.default.createElement("button",{
    className:"toggle-currency-list "+(v?"open":""),onClick:()=>_(!v)
  },l.default.createElement("span",{
    className:"from-currency-code"
  },n.currencyCode),l.default.createElement("img",{
    src:"/etc.clientlibs/settings/wcm/designs/sb1/nettsider/clientlib_base/resources/images/material-icons/hvit/chevron.svg",className:"arrow-down","aria-hidden":"true"
```

### 2. `t.default` — scripts/020-clientlib-base-1156934419-js.js:1

calls 11 · 253 B · math ops 11

```js
function(e,t,a,n){
  let r=e;
  isNaN(r)&&(r=Number(r.replace(/,/g,".").replace(/[^\d.,-]/g,"")));
  const l=n.buyCashRate/n.unitNumber/(a.sellCashRate/a.unitNumber),i=n.buyCurrencyChequeRate/n.unitNumber/(a.sellCurrencyChequeRate/a.unitNumber);
  return t?i*r:l*r
}

```

### 3. `oneLine` — scripts/026-inline.js:8428

calls 1 · 85 B · math ops 4

```js
function oneLine(s) {
  return s.replace(/\n/g, "\u21B5").replace(/\t/g, "\u21C6");
}

```

### 4. `t` — scripts/020-clientlib-base-1156934419-js.js:1

calls 112 · 5 B · math ops 0

```js
()=>e

```

### 5. `onChange` — scripts/020-clientlib-base-1156934419-js.js:1

calls 4 · 20 B · math ops 0

```js
e=>x(e.target.value)

```

### 6. `snap` — scripts/029-inline.js:3

calls 7 · 91 B · math ops 2

```js
(n) => (n.nodeType === 3 ? n.textContent : n.textContent || '').replace(/\s+/g, ' ').trim()

```

### 7. `(anonymous)` — scripts/020-clientlib-base-1156934419-js.js:1

calls 168 · 25 B · math ops 0

```js
e=>"NOK"===e.currencyCode

```

### 8. `(anonymous)` — scripts/020-clientlib-base-1156934419-js.js:1

calls 217 · 25 B · math ops 0

```js
e=>"NOK"!==e.currencyCode

```

### 9. `(anonymous)` — scripts/020-clientlib-base-1156934419-js.js:1

calls 17 · 27 B · math ops 0

```js
e=>{
  this.keyCode=e.keyCode
}

```

### 10. `(anonymous)` — scripts/020-clientlib-base-1156934419-js.js:1

calls 17 · 27 B · math ops 0

```js
e=>{
  this.keyCode=e.keyCode
}

```

### 11. `(anonymous)` — scripts/026-inline.js:8002

calls 8 · 29 B · math ops 0

```js
(a, b) => a.length - b.length

```

### 12. `Ed` — scripts/023-opt-in-js.js:2

calls 4 · 34 B · math ops 0

```js
function Ed(e){
  return xd(e=At(e))
}

```
