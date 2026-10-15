# Client logic — bank-choice

Source: https://www.sparebank1.no/nb/bank/privat.html · mount `.bank-choice-wrap` · 2026-10-15T14:30:49.271Z

**Compute locus: client.** 1 controls, 27 output mutations, 0 first-party XHR/fetch during the interaction (0 third-party ignored).

## First-party network during the interaction

- none

## Outputs that changed

- `div.bank-choice__myposition`: "" → ""
- `div.bank-choice-wrap__search`: "" → "Ditt postnummerSpareBank 1 GudbrandsdalSkaper verdier for kunder og lokalsamfunn.SpareBank 1 Hallingdal ValdresFjellstøtt gjennom livet.SpareBank 1 Lom og SkjåkLokalbanken din – der du er.SpareBank 1 "
- `ol.bank-choice__all-list`: "" → "SpareBank 1 HelgelandEn drivkraft for vekst på Helgeland.SpareBank 1 NordmøreNær deg. Hele veien.SpareBank 1 Ringerike HadelandStolt støttespiller til lokalsamfunnet."
- `strong`: "Gudbrandsdal" → "Helgeland"
- `span.ffe-micro-text`: "Skaper verdier for kunder og lokalsamfunn." → "En drivkraft for vekst på Helgeland."
- `strong`: "Hallingdal Valdres" → "Nordmøre"
- `span.ffe-micro-text`: "Fjellstøtt gjennom livet." → "Nær deg. Hele veien."
- `strong`: "Helgeland" → "Ringerike Hadeland"
- `span.ffe-micro-text`: "En drivkraft for vekst på Helgeland." → "Stolt støttespiller til lokalsamfunnet."
- `div.bank-choice__result`: "" → "SpareBank 1 GudbrandsdalSkaper verdier for kunder og lokalsamfunn.SpareBank 1 Hallingdal ValdresFjellstøtt gjennom livet.SpareBank 1 Lom og SkjåkLokalbanken din – der du er.SpareBank 1 Nord-NorgeFor N"
- `span.ffe-inline-button__label`: "Se alle banker" → "Se resten av bankene"
- `div.bank-choice__myposition`: "" → "PinBruk min posisjon"
- `div.bank-choice-wrap__search`: "" → "Ditt postnummerPinBruk min posisjonSe alle bankerSpareBank 1 GudbrandsdalSkaper verdier for kunder og lokalsamfunn.SpareBank 1 Hallingdal ValdresFjellstøtt gjennom livet.SpareBank 1 HelgelandEn drivkr"
- `ol.bank-choice__all-list`: "" → "SpareBank 1 GudbrandsdalSkaper verdier for kunder og lokalsamfunn.SpareBank 1 Hallingdal ValdresFjellstøtt gjennom livet.SpareBank 1 HelgelandEn drivkraft for vekst på Helgeland.SpareBank 1 Lom og Skj"
- `div.bank-choice-wrap__search`: "" → "Ditt postnummerSpareBank 1 Nord-NorgeFor Nord-Norge.SpareBank 1 NordmøreNær deg. Hele veien.SpareBank 1 SMNSammen får vi ting til å skje.SpareBank 1 Sogn og FjordaneVi er med heile vegen.SpareBank 1 Ø"
- `strong`: "" → "Sør-Norge"
- `span.ffe-micro-text`: "" → "Hjelper driftige folk og bedrifter dit de vil."
- `strong`: "" → "Østfold Akershus"
- `span.ffe-micro-text`: "" → "Sammen får vi ting til å skje."
- `div.bank-choice__result`: "" → "SpareBank 1 Nord-NorgeFor Nord-Norge.SpareBank 1 NordmøreNær deg. Hele veien.SpareBank 1 SMNSammen får vi ting til å skje.SpareBank 1 Sogn og FjordaneVi er med heile vegen.SpareBank 1 ØstlandetBanken "

## Source maps

- none shipped

## Logic candidates (ran on interaction, first-party, framework excluded, ranked)

### 1. `g` — scripts/021-clientlib-base-1156934419-js.js:1

calls 5 · 3496 B · math ops 20

```js
e=>{
  const t=(0,h.useMediaQuery)({
    query:"(min-device-width: 768px)"
  }),a=(0,l.useRef)(null),n=window.bankPickerlist,[i,g]=(0,l.useState)("bank-choice--inline"),[b,C]=(0,l.useState)([]),[v,_]=(0,l.useState)(!1),[k,y]=(0,l.useState)(!1),[E,w]=(0,l.useState)(!1),[T,S]=(0,l.useState)({
    zipCode:"",zipResults:0
  }),[N,x]=(0,l.useState)(!0);
  (0,l.useEffect)(()=>{
    const e=localStorage.getItem(p.default.sb1defaultBank);
    m.default&&e?(y(e),(0,u.trackComponentViewed)("bankvelger-pageload_her-var-du-sist")):(0,u.trackComponentViewed)("bankvelger-pageload_postnummer")
  },[]);
  const O={
    defaultBank:k,bankList:n,result:T,setResult:S,noBanks:v
  };
  return l.default.createElement(l.default.Fragment,null,l.default.createElement(l.default.Fragment,null,l.default.createElement("div",{
    className:`${i}`
  },l.default.createElement("div",{
    className:"bank-choice--inline-wrap",ref:a
  },l.default.createElement("div",{
    className:"bank-choice__container "+("no_bg"===e.layout?"bank-choice__container--transparent":"")
  },t&&"default"===e.layout&&l.default.createElement("img",{
    className:"bank-choice__background--desktop",alt:"",src:"/etc.clientlibs/settings/wcm/designs/sb1/nettsider/clientlib_base/resources/images/bankchoice_bg.svg","aria-hidden":"true",fetchpriority:"high"
  }),!t&&"default"===e.layout&&l.default.createElement("div",{
    className:"bank-choice__background-wrap"
  },l.default.createElement("img",{
    className:"bank-choice__background--mobile",alt:"",src:"/etc.clientlibs/settings/wcm/designs/sb1/nettsider/clientlib_base/resources/images/bankchoice_bg_mobile.svg","aria-hidden":"true",fetchpriority:"high"
  })),l.default.createElement("div",{
    className:"bank-choice-wrap"
  },!k&&l.default.createElement(l.default.Fragment,null,l.default.createElement("p",{
    className:"ffe-h2 bank-choice__header"
  },e.header),l.default.createElement("div",{
    className:"bank-choice__sublead"
  },e.sublead)),k&&l.default.createElement(l.default.Fragment,null,l.default.createElement("p",{
    className:"ffe-h2 bank-choice__header"
  },e.headerPrefilled||e.header),l.default.createElement("div",{
    className:"bank-choice__sublead"
  },e.subleadPrefilled||e.sublead)),l.default.createElement("div",{
    role:"search",className:"bank-choice-wrap__search"
  },k&&l.default.createElement(l.default.Fragment,null,l.default.createElement(s.default,(0,r.default)({
  },O,{
    prefilledBankText:e.prefilledBankDesc||e.prefilledBankText,fortsettText:e.fortsett,noProduct:e.prefilledNoproduct
  }))),!k&&l.default.createElement(l.default.Fragment,null,l.default.createElement(o.default,(0,r.default)({
  },O,{
    inputText:e.inputText,setNoBanks:_,setHideList:x,setBankListFiltered:C,placeholder:e.placeholder,placeholderPosition:e.placeholderPosition,positionAccessError:e.positionAccess,positionApiFail:e.positionApiFail,positionBtn:e.positionBtn
  })),l.default.createElement(c.default,(0,r.default)({
  },O,{
    hideNoBanksText:e.hideNoBanksText,noBanksFoundText:e.noBanksFound,bankListFiltered:b,setShowOptinInfoModal:w,fortsettText:e.fortsett
  }))),l.default.createElement(d.default,(0,r.default)({
  },O,{
    bankListFiltered:b,hideList:N,setHideList:x,setShowOptinInfoModal:w,moreChoicesText:e.moreChoicesText,hideChoicesText:e.hideChoicesText,filteredListText:e.filteredList
  })))))),l.default.createElement("div",{
    "data-nosnippet":!0,className:"aem-optin-wrapper",role:"dialog","aria-hidden":!E,"aria-live":"polite",style:{
      display:E?"block":"none"
    }
  },E&&l.default.createElement(f.OptinFunkModal,{
    header:e.optinfunkHeader,sublead:e.optinfunkSublead,accept:e.optinfunkAccept,reject:e.optinfunkReject,result:T
  })))))
}

```

### 2. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 19 · 684 B · math ops 0 · mentions "postnummer-input"

```js
()=>r.default.createElement(r.default.Fragment,null,r.default.createElement(u.Label,{
  htmlFor:"postnummer-input",className:"ffe-form-label"
},e.inputText),r.default.createElement(u.Input,{
  ref:x,id:`postnummer-input${e.buttonId||""}`,autoComplete:"off",type:"tel",role:"searchbox",maxLength:4,className:"bank-choice__input-field",placeholder:T,value:t,onChange:e=>a(e.target.value),onKeyDown:e=>(e=>{
    "Enter"===e.key&&t.length>0&&t.length<4&&y(!0)
  })(e),onFocus:()=>{
    T!==e.placeholder&&""===t&&(S(e.placeholder),e.setBankListFiltered([]),w(!0),e.setResult({
      zipCode:"",zipResults:0
    }),e.setHideList(!0))
  },"aria-describedby":k?`bank-choice_error-alert${e.buttonId||""}`:"","aria-invalid":k
}))

```

### 3. `oneLine` — scripts/027-inline.js:8428

calls 3 · 85 B · math ops 4

```js
function oneLine(s) {
  return s.replace(/\n/g, "\u21B5").replace(/\t/g, "\u21C6");
}

```

### 4. `t` — scripts/021-clientlib-base-1156934419-js.js:1

calls 626 · 5 B · math ops 0

```js
()=>e

```

### 5. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 14 · 10 B · math ops 0

```js
()=>{
  A(t)
}

```

### 6. `t.default` — scripts/021-clientlib-base-1156934419-js.js:1

calls 25 · 3420 B · math ops 0 · mentions "postnummer-input"

```js
e=>{
  const[t,a]=(0,r.useState)(""),[n,g]=(0,r.useState)(!1),[b,C]=(0,r.useState)(!1),[v,_]=(0,r.useState)(null),[k,y]=(0,r.useState)(!1),[E,w]=(0,r.useState)(!0),[T,S]=(0,r.useState)(e.placeholder),N=(0,r.useRef)(null),x=(0,r.useRef)(null),O=(0,p.useMediaQuery)({
    query:"(min-device-width: 768px)"
  });
  (0,r.useEffect)(()=>{
    e.isOverlay&&x.current?.focus()
  },[]);
  const L=t=>{
    e.setNoBanks(t)
  },A=t=>{
    g(!1),y(!1),L(!1),(0,h.default)(t)?((async t=>{
      let a=[];
      var n,r;
      a=e.isOverlay?await(0,i.filteredBankListOverlay)(e.bankList,[t]):(0,i.filteredBankList)(e.bankList,[t]),0===a.length&&L(!0),e.setBankListFiltered(a),O||window.scrollTo({
        left:0,top:N.current.offsetTop+90,behavior:"smooth"
      }),n=t,r=a.length,e.setResult({
        zipCode:n,zipResults:r
      }),(0,s.updateAnalyticsZipCodeSearch)({
        zipCode:n,zipResults:r
      },e.isOverlay)
    })(t),w(!1),e.setHideList(!0)):(0===t.length&&(w(!0),e.setBankListFiltered([]),e.setResult({
      zipCode:"",zipResults:0
    }),e.isOverlay&&e.setModalClosed(!1)),isNaN(t)&&t.length>1&&y(!0))
  };
  (0,r.useEffect)(()=>{
    A(t)
  },[t]),(0,r.useEffect)(()=>{
    e.modalClosed&&(A(""),a(""))
  },[e.modalClosed]);
  return r.default.createElement("div",{
    className:"bank-choice__input",ref:N
  },r.default.createElement(u.InputGroup,{
    extraMargin:!1,fieldMessage:k?r.default.createElement("div",{
      id:`bank-choice_error-alert${e.buttonId||""}`,role:"alert",className:"bank-choice--error"
    },r.default.createElement(f.ContextErrorMessage,{
      compact:!0
    },c.default.getText("POSTAL_CODE_ERROR"))):void 0
  },()=>r.default.createElement(r.default.Fragment,null,r.default.createElement(u.Label,{
    htmlFor:"postnummer-input",className:"ffe-form-label"
  },e.inputText),r.default.createElement(u.Input,{
    ref:x,id:`postnummer-input${e.buttonId||""}`,autoComplete:"off",type:"tel",role:"searchbox",maxLength:4,className:"bank-choice__input-field",placeholder:T,value:t,onChange:e=>a(e.target.value),onKeyDown:e=>(e=>{
      "Enter"===e.key&&t.length>0&&t.length<4&&y(!0)
    })(e),onFocus:()=>{
      T!==e.placeholder&&""===t&&(S(e.placeholder),e.setBankListFiltered([]),w(!0),e.setResult({
        zipCode:"",zipResults:0
      }),e.setHideList(!0))
    },"aria-describedby":k?`bank-choice_error-alert${e.buttonId||""}`:"","aria-invalid":k
  }))),r.default.createElement("div",{
    className:"bank-choice__myposition"
  },n&&r.default.createElement("div",{
    role:"alert",id:`bank-choice_error-position-alert${e.buttonId||""}`,className:"bank-choice__myposition--error"
  },v&&r.default.createElement(f.ContextTipsMessage,{
    compact:!0
  },v),!v&&r.default.createElement(f.ContextInfoMessage,{
    compact:!0
  },e.positionApiFail)),E&&r.default.createElement(d.SecondaryButton,{
    leftIcon:r.default.createElement(m.Pin,null),isLoading:b,"aria-invalid":n,"aria-describedby":n?`bank-choice_error-position-alert${e.buttonId||""}`:"",ariaLoadingMessage:e.findingPos,onClick:()=>(async()=>{
      const t=e.isOverlay?"btn":"pageload";
      try{
        C(!0),L(!1),a("");
```

### 7. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 3 · 18 B · math ops 0

```js
()=>{
  a(!1),e=null
}

```

### 8. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 5 · 19 B · math ops 0

```js
()=>clearTimeout(e)

```

### 9. `L` — scripts/021-clientlib-base-1156934419-js.js:1

calls 14 · 20 B · math ops 0

```js
t=>{
  e.setNoBanks(t)
}

```

### 10. `onChange` — scripts/021-clientlib-base-1156934419-js.js:1

calls 14 · 20 B · math ops 0

```js
e=>a(e.target.value)

```

### 11. `snap` — scripts/030-inline.js:3

calls 99 · 91 B · math ops 2

```js
(n) => (n.nodeType === 3 ? n.textContent : n.textContent || '').replace(/\s+/g, ' ').trim()

```

### 12. `(anonymous)` — scripts/021-clientlib-base-1156934419-js.js:1

calls 60 · 27 B · math ops 0

```js
e=>{
  this.keyCode=e.keyCode
}

```
