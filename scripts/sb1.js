/**
 * scripts/sb1.js — shared helpers for the sparebank1-redesign blocks (node-slotting, never value-slotting: EW1–EW3).
 * Icons are the canon strokes from stardust/scripts/proto/chrome.mjs (fixed chrome, never authored text).
 */

/** Create an element with attributes and children (strings become text nodes). */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === null || v === undefined || v === false) return;
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  children.flat().forEach((c) => { if (c !== null && c !== undefined && c !== false) node.append(c); });
  return node;
}

/** Wrap an AUTHORED node in a layout wrapper (the node keeps its tag, attributes and prose index). */
export function wrapNode(node, cls, tag = 'div') {
  if (!node) return null;
  const w = el(tag, { class: cls });
  node.replaceWith(w);
  w.append(node);
  return w;
}

const ICONS = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/>',
  pin: '<path d="M12 21s-6-5.4-6-11a6 6 0 1 1 12 0c0 5.6-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  phone: '<path d="M6.5 3.5h3l1.6 4-2 1.4a10 10 0 0 0 5.9 5.9l1.4-2 4 1.6v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
  office: '<path d="M4 20.5V8.5l8-4.5 8 4.5v12M4 20.5h16M9.5 20.5v-5h5v5"/>',
  chat: '<path d="M4 5.5h16v10H9l-4.5 3.5v-3.5H4z"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  back: '<path d="m15 6-6 6 6 6"/>',
  bulb: '<path d="M9 18h6M10 21h4M8.5 13.5a5 5 0 1 1 7 0c-.9.9-1.5 1.7-1.5 2.5h-4c0-.8-.6-1.6-1.5-2.5z"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  'thumb-up': '<path d="M7 11v9H4v-9h3zm0 0 4-7.5a2 2 0 0 1 2 2V10h5.5a1.5 1.5 0 0 1 1.5 1.7l-1.2 6.6A2 2 0 0 1 16.8 20H7"/>',
  'thumb-down': '<path d="M17 13V4h3v9h-3zm0 0-4 7.5a2 2 0 0 1-2-2V14H5.5A1.5 1.5 0 0 1 4 12.3l1.2-6.6A2 2 0 0 1 7.2 4H17"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.5"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
};

/** Inline canon stroke icon (24×24 viewBox, currentColor stroke). Fixed chrome, never authored text. */
export function icon(name, cls = '') {
  const tpl = document.createElement('template');
  tpl.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"${cls ? ` class="${cls}"` : ''}>${ICONS[name] || ICONS.chevron}</svg>`;
  return tpl.content.firstElementChild;
}

/** Replace the runtime's `<span class="icon icon-name">` placeholders with the canon inline SVG (authored :name: tokens). */
export function inlineIcons(root) {
  root.querySelectorAll('span.icon').forEach((span) => {
    const name = [...span.classList].find((c) => c.startsWith('icon-'))?.slice(5);
    if (!name || !ICONS[name] || span.querySelector('svg')) return;
    span.replaceChildren(icon(name));
  });
}

/** Read-only text of a node (for DECISIONS, never for displayed text — EW1). */
export const text = (node) => (node ? node.textContent.replace(/\s+/g, ' ').trim() : '');

/** Section-level children of a fragment (the .section divs). */
export function sectionsOf(fragment) {
  return [...fragment.children].filter((s) => s.classList.contains('section'));
}

/** Move a CTA as its paragraph (the editor index lives on the <p> — EW3). */
export function ctaPara(a) { return a ? (a.closest('p') || a) : null; }

/** Unwrap the pipeline's <p> around a list item's single link (#98) — returns the anchor. */
export function unwrapItem(li) {
  const p = li.querySelector(':scope > p');
  if (p && p.children.length === 1 && p.firstElementChild.tagName === 'A' && p.textContent.trim() === p.firstElementChild.textContent.trim()) p.replaceWith(...p.childNodes);
  return li.querySelector('a');
}

/** The captured page path for "is this link the current page" decisions. */
export function isCurrent(href) {
  try {
    const here = window.location.pathname.replace(/\/$/, '') || '/';
    const there = new URL(href, window.location.href).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/';
    return here === there;
  } catch { return false; }
}
