import { el, icon } from '../../scripts/sb1.js';

/**
 * embed — the canon `.video-frame`: a 16:9 paper with the play glyph and the video title; the iframe loads on click
 * (dynamics #16 interim — nothing from youtube.com is fetched until the reader asks for it).
 * Auto-blocked by scripts.js buildMediaAutoBlocks() from a default-content paragraph holding only a fully-qualified
 * YouTube / Vimeo link (D1: URL-based content is never authored as a block). Block Collection name (D11).
 * The authored `<p><a>title</a></p>` is MOVED into the frame's title slot (EW1–EW3): the link text is the visible title,
 * the whole frame is its click surface (the anchor's ::after overlay). On click the frame swaps to the player.
 */
function playerSrc(href) {
  try {
    const u = new URL(href);
    const h = u.hostname.replace(/^www\./, '');
    let id = null; let host = 'https://www.youtube-nocookie.com/embed/';
    if (h === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (/youtube(-nocookie)?\.com$/.test(h)) id = u.pathname.startsWith('/embed/') ? u.pathname.split('/')[2] : u.searchParams.get('v');
    else if (/vimeo\.com$/.test(h)) { id = (u.pathname.match(/\/(\d+)/) || [])[1]; host = 'https://player.vimeo.com/video/'; }
    if (!id) return href;
    return `${host}${id}?${host.includes('vimeo') ? 'autoplay=1' : 'autoplay=1&rel=0'}`;
  } catch { return href; }
}

export default function decorate(block) {
  const a = block.querySelector('a[href]'); if (!a) return;
  const p = a.closest('p') || a;
  const title = el('div', { class: 'video-title' }, p);
  const link = el('div', { class: 'video-link' }, icon('play'), title);
  const frame = el('div', { class: 'video-frame' }, link);
  const load = (e) => {
    e.preventDefault();
    const iframe = el('iframe', { src: playerSrc(a.href), title: 'Video', allow: 'autoplay; encrypted-media; picture-in-picture', allowfullscreen: true, loading: 'lazy' });
    frame.replaceChildren(iframe); frame.classList.add('is-playing');
  };
  a.addEventListener('click', load);
  block.replaceChildren(frame);
}
