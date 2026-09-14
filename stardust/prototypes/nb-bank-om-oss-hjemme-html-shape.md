<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape (--prep, archetype worker A — campaign-landing family)
  writtenAt:        2026-09-14T23:30:00Z
  page:             nb-bank-om-oss-hjemme-html
  pageUrl:          https://www.sparebank1.no/nb/bank/om-oss/hjemme.html
  againstDirection: stardust/direction.md (Active 2026-09-14T21:10:00Z)
  consumedBy:       impeccable new-work (craft) via stardust/scripts/proto/pages/nb-bank-om-oss-hjemme-html.mjs
  readArtifacts:
    - stardust/current/pages/nb-bank-om-oss-hjemme-html.json
    - stardust/current/pages/nb-bank-om-oss-hjemme-html.html (nettsider-frontend clientlib; settled DOM — header and footer INSIDE <main>; outline via page-content.mjs --hidden)
    - stardust/current/assets/screenshots/nb-bank-om-oss-hjemme-html.png
    - stardust/prototypes/ARCHETYPE-BRIEF.md, stardust/prototypes/nb-bank-privat-html-shape.md (canon model)
    - DESIGN.md, DESIGN.json, stardust/direction.md, stardust/dynamic-features.md (#2, #14, #16, #17)
    - stardust/prototypes/nb-bank-privat-html-improvements.md (#5 text-over-photo ban applies here)
  conceptSeed:      surface roll key d445fcf7 (mode persuade) — dealt 7, 6, 2 of the ordered structure list; 7 leads and is built (hands-off: the brief is the record)
  capturedSourceLineage:
    - header — `main > header.header--disable-bottom-links.sb1-story__header` (om-oss variant: audience Privat · Bedrift · Om oss (active), Søk, Bli kunde (button, no href), Logg inn; no market nav) → canon chrome via headerData() (market [] → empty market row)
    - bank-router — absent on this page (no `.bank-choice`); none rendered
    - hero — `.sb1-story__body > div.block--full` #0: video Barna-loop.mp4 (title "Video topp", autoplay loop, placeholder img video-ikon.svg) with H1 "Uansett hvor og hvordan du lever, er vi der du føler deg hjemme!" centred OVER the video
    - chapter-1 — `.sb1-story__body > div.text` #1: H1 "Det kan være godt å snakke med noen som forstår deg." (second H1 in capture) + p span.h5 (lead) + 3 p
    - slides — `.sb1-story__body > div.slidescontainer` #3 (anchor hr#kontakt before it): 3 `.block--full` each with a portrait CSS background photo (bedriftsloftet_sveiser · bedriftsloftet-familie-pa-arbeidsplass · bedriftsloftet_alpakka, all .thumb.1280.2276) + centred white card: h2 + p + buttons (2 × action / 1 × secondary / 2 × secondary)
    - chapter-2 — anchors hr#blikunde, hr#samfunn; `div.image--center` (empty lazyload placeholder, no src); `div.text` H1 "Vi støtter idrett og kultur…" (third H1) + `div.text` 2 p + `div.button` action "Se hva vi gjør der du bor" href="#"
    - closing-video — `div.slidescontainer` #11: video teater.mp4 (title "Der du føler deg hjemme")
    - closing — `div.slidescontainer` #12: portrait bg photo bedriftsloftet-gutt-orsta + h2 "Uansett hvor og hvordan du lever, kan du føle deg hjemme hos oss."; `div.factbox` empty
    - footer — `main > footer.footer`: columns Snarveier (5) · Logg inn (4) · Sosiale medier (2 links with title attr, empty text, lazyload placeholders — no icon src captured) · bottom row 5 links · `.footer-info` address; no contact tabs → built as `footer:` data in footerData() shape
  antiTemplatePass:
    - { pattern: "video hero with headline over the frame", defaultReflex: "full-bleed autoplay video, centred white H1 on top", alternatives: ["full-bleed video + scrim + centred H1 (captured)", "7/5 split: video as content left, display H1 beside it right; H1 first below 1024", "H1 only, video demoted"], picked: "7/5 split, display H1 beside the video", rationale: "direction bans type over photographs/video (improvements #5, No-Overlay Rule); the video is the campaign's content and stays at content scale; a display H1 is the archetype's one display moment", reference: "refero 3e14bbe4 MANNA (captioned media blocks); canon campaign split" }
    - { pattern: "story chapters (three captured H1s)", defaultReflex: "keep three H1s", alternatives: ["three H1s (captured)", "one H1 + chapter titles as h2 at headline size (49 px) on their own paper", "all chapter titles at h2 headline-sm"], picked: "one H1 + h2 chapters at headline size", rationale: "one H1 per page (a11y); the chapters are the story's structure and deserve the headline step, the display step stays unique to the hero" }
    - { pattern: "slides (photo background + centred white card)", defaultReflex: "Vann full-bleed bands with floating white cards", alternatives: ["photo bands with cards (captured)", "three split-media rows on one Frost-30 movement, portrait photo beside text, sides alternating", "text-only rows"], picked: "split-media rows on Frost-30", rationale: "photo as content, not backdrop (#6); cards-as-container dropped (#4); Frost-30 is the help/contact paper — the three slides are the contact/onboarding offers; portrait sources kept portrait (4:5) rather than cropped to 3:2" }
    - { pattern: "button pairs (two captured ffe-button--action)", defaultReflex: "two Skog buttons", alternatives: ["two Skog (captured)", "primary + secondary pair (Vann) — booking a meeting is not log-in / become-customer / apply", "one primary, second as inline"], picked: "primary + secondary", rationale: "One Action Rule + Skog reservation (DESIGN.md): meeting booking is not an application flow; the captured hierarchy (both equal) is kept as a Vann pair" }
    - { pattern: "closing statement over photo", defaultReflex: "white card over blue band", alternatives: ["card over band (captured)", "portrait photo beside the closing h2 (5/7)", "type-only closing"], picked: "photo beside h2", rationale: "no type over media; the closing photo is content" }
  substrateTransitions:
    default: Hvit
    exceptions:
      - { section: chapter-1, paper: Sand-30, purpose: "captured #FDF8F5 story-text ground; the warm reading paper for the first chapter" }
      - { section: slides, paper: Frost-30, purpose: "help/contact paper for the three offers; replaces the captured Vann bands (dark surface) — keeps the page at two tints" }
    note: "captured chapter-2 ground (#FDF8F5) NOT carried — would be a third tint; chapter 2 reads on Hvit"
  voiceClassification:
    - { section: header, classification: captured-verbatim }
    - { section: hero, classification: captured-verbatim (video title attr "Video topp" as figcaption; fallback text "Your browser does not support the video" captured) }
    - { section: chapter-1, classification: captured-verbatim }
    - { section: slides, classification: captured-verbatim }
    - { section: chapter-2, classification: captured-verbatim }
    - { section: closing-video, classification: captured-verbatim }
    - { section: closing, classification: captured-verbatim }
    - { section: footer, classification: captured-verbatim (social link labels "Linkedin" / "YouTube" from the captured title attributes — the captured link text is empty and the icon srcs never loaded) }
  signatureElements:
    - { kind: site-wide-motif, capturedSource: "96px photo mask", mechanism: "one-corner-pair mask 96 px on the hero video frame and 48 px on the four portrait photos", fallback: "square media" }
    - { kind: page-motif, capturedSource: "campaign videos Barna-loop.mp4 / teater.mp4", mechanism: "<video controls preload=none> at content scale with captured title as caption", fallback: "caption + link" }
  unsourcedContent: []
  stardustVersion:  0.20.0
-->
---
slug: nb-bank-om-oss-hjemme-html
url: https://www.sparebank1.no/nb/bank/om-oss/hjemme.html
register: brand
mode: persuade
surprise: low
dominantDimension: composition/split-media-story
template: landing
---

# Page shape: nb-bank-om-oss-hjemme-html (campaign landing — "Der du føler deg hjemme")

Structure list (ordered by resonance) for the surface roll `d445fcf7`: 1 reading-room spread · 2 video-led scroll story · 3 chapters on paper · 4 single column · 5 poster sequence · 6 offer-then-ledger · **7 split-media story — video beside display H1, chapters as alternating photo/text splits (dealt lead — built)**. Dealt alternates 6 and 2 recorded, not built.

## Sections (in render order)

1. **header** (canon chrome from the in-main header) — audience switch with "Om oss" current; no market links (captured `header--disable-bottom-links`), Søk, Logg inn. The captured "Bli kunde" is a `<button>` without href on this clientlib → not renderable as a link; omitted (see § Unsourced / excluded).
2. **hero** (module `video-hero`) — Hvit; 7/5 split ≥ 1024: video left (`Barna-loop.mp4`, `controls playsinline muted loop preload="none"`, 3:2 frame, 96 px one-corner-pair mask; figcaption = captured title "Video topp" with the captured `video-ikon.svg` placeholder as an `aria-hidden` glyph), **display H1** right, text first in DOM (H1 first below 1024). No autoplay (calm; a11y).
3. **chapter-1** (module `story-text`) — Sand-30; h2 `.chapter-title` (headline 49 px) "Det kan være godt å snakke med noen som forstår deg." + lead (captured `span.h5`) + 3 prose paragraphs at 68ch.
4. **slides** (module `split-media` ×3, `id="kontakt"` from the captured anchor) — Frost-30; three rows, photo side alternating (photo 4:5 portrait `.photo-portrait`, 48 px mask, `alt=""` — none captured): "Snakk med en lokal rådgiver 💙" + p + **primary** "Avtal møte med en rådgiver" + **secondary** "Avtal møte med en bedriftsrådgiver" · "Få hjelp til å lykkes med egen bedrift!" + p + secondary · "Bytte bank til oss? ✨" (`id="blikunde"`) + p + secondary ×2.
5. **chapter-2** (module `story-text`, `id="samfunn"`) — Hvit; h2 `.chapter-title` "Vi støtter idrett og kultur, så alle har et sted de føler seg hjemme." + 2 prose paragraphs + `.btn-primary` "Se hva vi gjør der du bor" (`href="#"`, dynamics #2).
6. **closing-video** (module `video`) — Hvit; the `teater.mp4` video at 7 columns, figcaption "Der du føler deg hjemme".
7. **closing** (module `split-media`) — Hvit, hairline top; portrait photo (gutt-orsta) left 5 + h2 "Uansett hvor og hvordan du lever, kan du føle deg hjemme hos oss." right at headline size.
8. **footer** (canon `footerHtml` fed with page-built data) — Fjell columns Snarveier · Logg inn · Sosiale medier (Linkedin, YouTube) · Natt legal row (5 links + address). No contact row (none captured on this clientlib).

## Layout strategy

- Hero `7fr 5fr` (video/text) ≥ 1024; below, H1 → video (16:9 cap). Slides `5fr 7fr` with `direction` alternation via grid placement; stacked photo-after-text below 1024 (text first — the reviewer's rule from the product archetype). Closing `5fr 7fr`.
- Papers: Hvit → Sand-30 → Frost-30 → Hvit → Hvit. Two tints, non-adjacent. Captured `<hr>` anchors become section ids.
- One action per module: slide rows one primary (or captured secondaries); chapter 2 one primary.
- Display step used once (hero H1); chapter titles at the headline step; closing h2 at headline-sm.

## Key states / Interaction model

- Videos: native controls, `preload="none"` (no network until play), muted + loop as captured; no autoplay. Fallback text verbatim.
- All hrefs verbatim (`target="_blank"` on the captured booking links dropped — same-tab navigation is the calmer default; hrefs unchanged).

## Data attributes

- `section[data-section="hero"][data-intent="campaign statement, video as content"][data-layout="split-media"][data-media="video"][data-module="video-hero"]`
- `section[data-section="chapter-1"][data-intent="story: local advisers"][data-layout="contained"][data-module="story-text"]`
- `section[data-section="slides"][data-intent="offers: adviser, business, switch"][data-layout="grid"][data-items="3"][data-module="split-media"][data-media="image"]`
- `section[data-section="chapter-2"][data-intent="story: sport and culture sponsorship"][data-layout="contained"][data-module="story-text"]`
- `section[data-section="closing-video"][data-intent="campaign film"][data-layout="contained"][data-media="video"][data-module="video"]`
- `section[data-section="closing"][data-intent="closing statement"][data-layout="split-media"][data-media="image"][data-module="split-media"]`
- `body[data-template="landing"]`

## Unsourced / excluded (for the lead)

- **Header "Bli kunde"** on this clientlib is a `<button class="ffe-button--action">` with no href (JS handler) → `headerData().bliKunde` is null and nothing is rendered; the canon header keeps Logg inn. Not a content loss the gate can measure (buttons are not checked) but worth a canon decision: map the button to the site-wide Bli kunde URL (`/nb/bank/privat/kundeservice/bestill/bli-kunde.html`, present in this page's own footer) — logged in canon-requests.md #2.
- **Captured logo `<img src=…/logo-sparebank1.svg>`** in the in-main header: the canon header renders the logo as inline SVG; the gate's img exclusion regex (`logo\.svg`) does not match this filename → expected to flag one header img. Legitimate exclusion (chrome logo). Logged as canon request #3 (checker regex).
- **Social icons** in the footer never loaded (lazyload placeholders, no src) — links rendered with the captured `title` labels.
- **Empty `div.image--center`** (lazyload placeholder, no src) and **empty `div.factbox`** — nothing to render.
- **Three captured H1s** → one H1 + two h2 chapter titles (a11y).
- Slide photos are CSS `background-image` in the capture (not gate-checked) → rendered as `<img alt="">` with the captured URLs; `data-deviation="portrait source 1280×2276 — 4:5 instead of the canon 3:2"` on each.
- Videos: `autoplay` dropped (calm / WCAG 2.2.2); `controls` kept; `preload="none"`.

## Review

Round 1 (impeccable:impeccable-finish-reviewer, same packet shape as canon): **fix-then-ship** — brand-fit 4 · hierarchy 3 · calm-vs-generic 3 · mobile 3 · craft floor 4. Eight material fixes; seven applied in one batch, one declined:
1. Slide CTAs → exactly one `btn-primary` per row (first captured button), rest `btn-secondary` (Skog withheld: captured classes were not `ffe-button--action` apply/log-in flows).
2. Video mask clipped native controls → top-left corner only on `<video controls>` (`96px 0 0 0` hero, `48px 0 0 0` film); photos keep the corner pair. Note for DESIGN.md / migrate: **`<video controls>`: top-left only**.
3. Alternating rows lopsided → rows anchored to the portrait: `26rem minmax(0,1fr)` / reversed; `.slide-rev .slide-text{justify-self:end}` (added in the verdict pass) so text sits 48 px from the photo on both alternations (measured 1440: text right 896, photo left 944).
4. Frost hairline between slides removed.
5. Hero figcaption "Video topp" (CMS asset title) removed — kept as the video's `title`; the captured `video-ikon.svg` glyph stays only in the closing film caption (gate content).
6. **Declined** — chapter-2 on Sand-30: ARCHETYPE-BRIEF § Contract 4 caps tinted movements at two (Sand chapter-1, Frost slides already spent). Reviewer accepted the decline; open question for the lead: whether story pages may repeat an already-used tint (chapter-2 → film → closing is ≈ 1,700 px of Hvit with one hairline).
7. Tablet 641–1023: slides keep a `20rem minmax(0,1fr)` split; closing row likewise (verdict-pass regression fix); stacking only ≤ 640.
8. Hero display H1 measure 14ch → 17ch (four balanced lines).

Verdict pass: **fix** on two one-line CSS items (3 partial: reversed-row gap; regression: closing row stacked at 768) — both applied and measured; the reviewer's disposition on everything else: resolved. Scores at verdict: brand-fit 4 · hierarchy 4 · calm-vs-generic 4 · mobile 4 · craft floor 4. Two rounds = contract cap; closed on the gates.

## Validation

- Harness: `nb-bank-om-oss-hjemme-html: PASS — 0 P0/P1, 0 P2/P3; externalFulfilled 7/7/7; heights 5879/4767/5097`. 360 nav `{"over":0,"minFont":14,"minGap":0,"collapse":"hamburger"}`. Smoke: burger open/aria/Esc, primary CTA keyboard-reachable; no `<details>` on this page.
- Content gate: `content-check FAIL — checked text 56, hrefs 45, imgs 4; missing text 0, hrefs 0, imgs 2` — the two misses are the same captured element (`<img src=…/logo-sparebank1.svg>` in the in-main header, counted in both `header` and `main` regions): the canon chrome renders the logo as inline SVG. **Legitimate chrome exclusion** (canon request #3: checker regex `logo(-sparebank1)?\.svg`). Main content: 0 text / 0 hrefs / 0 other imgs missing.
- Detect: 6 × `cramped-padding` (warning) — static-CSS misreads of `padding-block: var(...)` on `.movement`/`.hdr-utility`/`.footer-*` — dismissed; nothing else.
- Reviewer disposition: fix-then-ship → (verdict pass) fix on two CSS lines, applied; see § Review.
- Viewport heights: 1440 → 5097 · 768 → 4767 · 390 → 5879.
- `data-deviation` elements: 4 × `img.photo-portrait` — `"portrait source 1280x2276 — 4:5 frame instead of canon 3:2"` (three slide photos + closing photo).
- Canon requests: #2 header "Bli kunde" button without href on clientlib pages; #3 checker logo regex. Footer built page-side from `main > footer` (`footerFromMain()`) — Worker C's canon request #2 (clientlib footer builder) would supersede it.
- Excluded from the gate: see § Unsourced / excluded (logo img; empty lazyload image and factbox; three captured H1s → one; autoplay dropped; `target="_blank"` dropped).
