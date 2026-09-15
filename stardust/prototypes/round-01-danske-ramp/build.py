#!/usr/bin/env python3
"""Round 01 (Danske Bank structure x Ramp typography/buttons) home-page prototype.
Content is injected verbatim from _fragments.json (extracted from the approved prototype, itself content-checked
against the capture). Run: python3 build.py -> home.html
"""
import json, html, pathlib, datetime, sys
VARIANT = sys.argv[sys.argv.index('--variant') + 1] if '--variant' in sys.argv else 'a'
HERE = pathlib.Path(__file__).parent
F = json.load(open(HERE / '_fragments.json', encoding='utf8'))
e = html.escape

def two_tone(text, split_after):
    """Ramp two-tone headline: first part ink, remainder hushed. textContent stays verbatim."""
    a, b = text[:split_after].rstrip(), text[split_after:].strip()
    return f'{e(a)} <span class="hushed">{e(b)}</span>'

# ---------- header ----------
audience = ''.join(f'<li><a href="{e(h)}"{" class=\"is-active\"" if t == "Privat" else ""}>{e(t)}</a></li>' for t, h in F['audience'])
market = ''.join(f'<li><a href="{e(h)}">{e(t)}</a></li>' for t, h in F['market_nav'])
header = f'''
<header class="site-header" data-section="header" data-intent="site navigation, audience switch, one action" data-layout="contained" data-nav-collapse="hamburger">
  <div class="settings-bar">
    <div class="container"><nav class="audience" aria-label="Målgruppe"><ul>{audience}</ul></nav></div>
  </div>
  <div class="main-bar">
    <div class="container main-row">
      <a class="logo" href="/nb/bank/privat.html">{F['logo_svg']}</a>
      <nav id="main-menu" class="primary" aria-label="Hovedmeny">
        <div class="panel-top">
          <a class="panel-search" href="?search=">{F['search_svg']}<span>Søk</span></a>
        </div>
        <ul class="audience-m" aria-label="Målgruppe">{audience}</ul>
        <ul class="market">{market}</ul>
        <ul class="service"><li><a href="{e(F['bli_kunde_href'])}">Bli kunde</a></li></ul>
      </nav>
      <div class="tools">
        <a class="tool-text" href="{e(F['bli_kunde_href'])}">Bli kunde</a>
        <a class="tool-search" href="?search=" aria-label="Søk">{F['search_svg']}<span class="vh">Søk</span></a>
        <a class="btn btn-action btn-nav" href="{e(F['login_href'])}">Logg inn</a>
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-menu"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="menu-label">Meny</span></button>
    </div>
  </div>
</header>'''

# ---------- hero bento: router tile (dark) + campaign split card ----------
router = f'''
<article class="card card--dark router" data-section="bank-router" data-intent="route the visitor to a regional bank" data-module="bank-router">
  <div class="card-body">
    <h2 class="h2-m on-dark">{e(F['router']['h'])}</h2>
    <p class="lead on-dark-soft">{e(F['router']['lede'])}</p>
    <form class="router-form" action="#alle-banker" method="get">
      <label class="field-label" for="postnummer-input">Ditt postnummer</label>
      <div class="field-row">
        <input class="input" id="postnummer-input" name="postnummer" type="text" inputmode="numeric" pattern="[0-9]{{4}}" maxlength="4" autocomplete="postal-code" placeholder="Postnummer">
        <button class="btn btn-on-dark" type="submit">{F['position_svg']}<span>Bruk min posisjon</span></button>
      </div>
    </form>
    <details class="router-all" id="alle-banker">
      <summary class="arrow arrow--on-dark">Se alle banker</summary>
      {F['bank_list']}
    </details>
  </div>
  <img class="router-art" src="{e(F['router_art_src'])}" alt="" aria-hidden="true" loading="eager" fetchpriority="high">
</article>'''

c = F['campaign']
# Live hero content as shown to Paolo on 2026-09-15 (personalised slide, not present in the server HTML / capture):
BEAVER = {'h': 'Noe som gnager litt? \U0001F9AB', 'lead': 'Sjekk om du bør refinansiere forbrukslån og kredittkortgjeld.',
          'small': c['small'], 'cta': c['cta'], 'href': c['href'], 'img': 'assets/campaign-beaver-from-screenshot.jpg'}
campaign = f'''
<article class="campaign" data-section="campaign" data-intent="one offer, one action" data-layout="split-media" data-media="image" data-module="campaign-carousel" data-items="1">
  <figure class="card hero-photo"><img src="{e(BEAVER['img'])}" alt="" loading="eager" fetchpriority="high"></figure>
  <div class="card card--frost campaign-text">
    <div class="card-body">
      <h2 class="h2-l">{e(BEAVER['h'])}</h2>
      <div class="campaign-copy">
        <p class="lead">{e(BEAVER['lead'])}</p>
        <p class="small muted num">{e(BEAVER['small'])}</p>
        <p class="actions"><a class="btn btn-action btn-lg cover-link" href="{e(BEAVER['href'])}">{e(BEAVER['cta'])}</a></p>
      </div>
    </div>
  </div>
</article>'''

# ---------- products ----------
tiles = ''
for t in F['tiles']:
    links = ''.join(f'<li><a class="arrow" href="{e(h)}">{e(x)}</a></li>' for x, h in t['links'])
    tiles += f'''
<article class="card card--tint product">
  <div class="card-body">
    <img class="illu" src="{e(t['illu'])}" alt="" aria-hidden="true" loading="lazy">
    <h3 class="h3"><a class="cover-link" href="{e(t['href'])}">{e(t['title'])}</a></h3>
    <ul class="link-list">{links}</ul>
  </div>
</article>'''

# ---------- membership: image tile + text teaser, x2 (Danske 2+4+2+4 row) ----------
promos = ''
fills = ['card--frost', 'card--syrin']
for i, p in enumerate(F['promos']):
    promos += f'''
<div class="card {fills[i]} promo-art"><img src="{e(p['illu'])}" alt="" aria-hidden="true" loading="lazy"></div>
<article class="card card--tint promo">
  <div class="card-body">
    <h3 class="h3">{e(p['title'])}</h3>
    <p>{e(p['p'])}</p>
    <p class="actions"><a class="btn btn-secondary cover-link" href="{e(p['href'])}">{e(p['cta'])}</a></p>
  </div>
</article>'''

# ---------- news ----------
news = ''
for n in F['news']:
    meta = f'<span>{e(n["tag"])}</span>' + (f' <time class="num">{e(n["date"])}</time>' if n['date'] else '')
    news += f'''
<article class="card card--tint news-card">
  <img class="card-image" src="{e(n['img'])}" alt="" loading="lazy">
  <div class="card-body">
    <h3 class="h3"><a class="cover-link" href="{e(n['href'])}">{e(n['title'])}</a></h3>
    <p class="meta small muted">{meta}</p>
  </div>
</article>'''

# ---------- index + compare ----------
index = ''
for col in F['index']:
    links = ''.join(f'<li><a class="arrow" href="{e(h)}">{e(x)}</a></li>' for x, h in col['links'])
    index += f'''
<article class="card card--tint index-card">
  <div class="card-body"><h2 class="h2-s">{e(col['label'])}</h2><ul class="link-list">{links}</ul></div>
</article>'''
compare = f'''
<article class="card card--frost compare" data-section="compare" data-intent="regulatory: compare prices" data-module="cta-band">
  <div class="card-body"><h2 class="h2-s">Sammenlign priser</h2>{F['compare_p']}</div>
</article>'''

# ---------- contact (pre-footer band) ----------
channels = ''
for ch in F['channels']:
    sub = f'<span class="ch-sub small muted">{e(ch["sub"])}</span>' if ch['sub'] else ''
    channels += f'''
<li class="card card--white channel"><details>
  <summary><span class="icon-circle">{ch['icon_svg']}</span><span class="ch-text"><span class="ch-name">{e(ch["name"])}</span> {sub}</span><span class="chev" aria-hidden="true"></span></summary>
  {ch['panel']}
</details></li>'''
ch_head = F['contact_head']
contact = f'''
<section class="contact" id="kontakt" data-section="contact-row" data-module="contact-row" data-items="5">
  <div class="container">
    <div class="contact-head"><h2 class="h2-m">{e(ch_head['h'])}</h2><a class="btn btn-primary btn-lg" href="{e(ch_head['href'])}">{e(ch_head['a'])}</a></div>
    <ul class="channels">{channels}</ul>
  </div>
</section>'''

# ---------- footer ----------
cols = ''.join(f'<div class="footer-col"><h2>{e(col["h"])}</h2><ul>{"".join(col["items"])}</ul></div>' for col in F['footer_cols'])
legal = ''.join(F['legal_links'])
footer = f'''
<footer class="site-footer" data-section="footer" data-intent="contact and site map" data-layout="contained">
  <div class="container footer-grid">
    <a class="footer-logo" href="/nb/bank/privat.html" aria-label="SpareBank 1">{F['logo_svg'].replace('id="SpareBank_1"', 'id="SpareBank_1_footer"').replace('aria-label="Tilbake til forsiden for privat for - SpareBank 1"', 'aria-hidden="true"')}</a>
    <div class="footer-cols">{cols}</div>
    <div class="footer-legal">
      <ul class="legal-links">{legal}</ul>
      <p class="address">{e(F['address'])}</p>
    </div>
  </div>
</footer>'''

if VARIANT in ('b', 'c'):
    membership_section = f'''<section class="movement" data-section="membership" data-intent="invite: switch bank, LO membership" data-layout="full-bleed-grid" data-items="2" data-module="promo-band">
  <div class="full-bleed"><div class="bento membership">{promos}</div></div>
</section>'''
    news_section = f'''<section class="movement" data-section="news" data-intent="cross-link: news and advice" data-layout="grid" data-items="4" data-module="card-rail" data-media="image">
  <div class="container"><h2 class="h2-l section-title">Nytt og nyttig</h2><div class="bento news">{news}</div></div>
</section>'''
else:
    membership_section = f'''<section class="movement" data-section="membership" data-intent="invite: switch bank, LO membership" data-layout="grid" data-items="2" data-module="promo-band">
  <div class="container"><div class="bento membership">{promos}</div></div>
</section>'''
    news_section = f'''<section class="movement news-movement" data-section="news" data-intent="cross-link: news and advice" data-layout="full-bleed-grid" data-items="4" data-module="card-rail" data-media="image">
  <div class="container"><h2 class="h2-l section-title">Nytt og nyttig</h2></div>
  <div class="full-bleed"><div class="bento news">{news}</div></div>
</section>'''
css = open(HERE / 'styles.css', encoding='utf8').read()
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
doc = f'''<!DOCTYPE html>
<html lang="nb">
<head>
<!-- stardust:provenance
  writtenBy:        round-01 prototype (manual composition, Paolo + Claude; NOT the stardust:prototype pipeline)
  writtenAt:        {now}
  page:             nb-bank-privat-html
  pageUrl:          https://www.sparebank1.no/nb/bank/privat.html
  variant:          {VARIANT} (a = hero 7/5 two-row bento, news full-bleed · b = router band full width, campaign 5/7 on one row, membership full-bleed · c = as b but hero bento contained in 1312)
  brief:            "from danskebank.dk/privat take card design, bento design, margin between cards, border corners, header and footer layout; from ramp.com take typography (not fonts), page width, button styling; keep SpareBank 1 fonts, colours, full content IA fidelity"
  references:
    - refs/danske/SPEC.md (measured 2026-09-15)
    - refs/ramp/SPEC.md (measured 2026-09-15)
  contentSource:    stardust/prototypes/nb-bank-privat-html-proposed.html via _fragments.json (verbatim text/hrefs/images)
  iaFidelity:       verbatim (section order unchanged: header, bank-router, campaign, products, membership, news, index, compare, contact, footer)
  fontDeck:         brand-inherited (SpareBank1-title-medium / medium / regular)
  paletteSource:    _ffe-tokens.json (Fjell, Vann, Skog, Sand, Frost, Syrin, Natt)
  build:            build.py + styles.css
-->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privat | SpareBank 1</title>
<meta name="description" content="Prøv Norges beste og mest personlige mobilbank. Du er også velkommen til å chatte eller ringe og få hjelp av flinke folk hos oss når du trenger det.">
<meta name="template" content="landing">
<meta name="theme-color" content="#002776">
<style>
{css}
</style>
</head>
<body data-template="landing" class="variant-{VARIANT}">
<nav class="skip" aria-label="Snarveier"><a href="#main-menu">Til hovedmeny</a><a href="#main-content">Til hovedinnhold</a></nav>
{header}
<main id="main-content" tabindex="-1">
<h1 class="vh">Privat</h1>
<section class="hero-movement {'container hero-contained' if VARIANT == 'c' else 'full-bleed'}" data-section="hero-bento" data-intent="route to a regional bank, one offer" data-layout="{'grid' if VARIANT == 'c' else 'full-bleed-grid'}">
  <div class="bento hero">{router}{campaign}</div>
</section>
<section class="movement" data-section="products" data-intent="route to product areas" data-layout="grid" data-items="6" data-module="content-columns">
  <div class="container"><div class="bento products">{tiles}</div></div>
</section>
{membership_section}
{news_section}
<section class="movement" data-section="index" data-intent="secondary navigation: about and shortcuts" data-layout="grid" data-items="2" data-module="content-columns">
  <div class="container"><div class="bento index">{index}{compare}</div></div>
</section>
</main>
{contact}
{footer}
<script>
(() => {{
  const hdr = document.querySelector('.site-header');
  const btn = hdr.querySelector('.menu-toggle');
  const nav = document.getElementById('main-menu');
  const setOpen = (o) => {{ hdr.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', String(o)); document.documentElement.classList.toggle('no-scroll', o); }};
  btn.addEventListener('click', () => setOpen(!hdr.classList.contains('is-open')));
  addEventListener('keydown', (ev) => {{ if (ev.key === 'Escape' && hdr.classList.contains('is-open')) {{ setOpen(false); btn.focus(); }} }});
  nav.addEventListener('click', (ev) => {{ if (ev.target.closest('a') && hdr.classList.contains('is-open')) setOpen(false); }});
  // Danske-style sticky: hide on scroll down, reveal only the main bar on scroll up.
  let last = scrollY; const settings = () => hdr.querySelector('.settings-bar').getBoundingClientRect().height;
  const onScroll = () => {{
    const y = scrollY; if (hdr.classList.contains('is-open')) return;
    if (y <= 0) hdr.style.transform = '';
    else if (y > last && y > hdr.offsetHeight) hdr.style.transform = 'translateY(-100%)';
    else if (y < last) hdr.style.transform = `translateY(-${{settings()}}px)`;
    last = y;
  }};
  addEventListener('scroll', onScroll, {{ passive: true }});
}})();
</script>
</body>
</html>
'''
outname = 'home.html' if VARIANT == 'a' else f'home-{VARIANT}.html'
(HERE / outname).write_text(doc, encoding='utf8')
print('wrote', HERE / outname, len(doc), 'bytes')
