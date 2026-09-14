#!/usr/bin/env node
/**
 * publish.mjs — publish non-HTML content (the redirects sheet) and force Code Sync.
 *   node stardust/scripts/eds/publish.mjs --redirects        PUT content/redirects.json (application/json) → preview → live
 *   node stardust/scripts/eds/publish.mjs --code             POST admin.hlx.page/code/<org>/<repo>/main/*  (after a scripted git push)
 * Needs DA_TOKEN (never printed). Exits 2 on 401 (token expired — hard stop).
 */
import fs from 'node:fs';
import { ORG, REPO } from './lib.mjs';
const TOKEN = process.env.DA_TOKEN; if (!TOKEN) { console.error('DA_TOKEN missing'); process.exit(1); }
const H = { Authorization: `Bearer ${TOKEN}` };
const check = (r, what) => { if (r.status === 401) { console.error(`401 on ${what} — DA_TOKEN expired; re-login at https://da.live and refresh .env`); process.exit(2); } return r; };
if (process.argv.includes('--redirects')) {
  const buf = fs.readFileSync('content/redirects.json');
  const fd = new FormData(); fd.append('data', new Blob([buf], { type: 'application/json' }), 'redirects.json');
  const put = check(await fetch(`https://admin.da.live/source/${ORG}/${REPO}/redirects.json`, { method: 'PUT', headers: H, body: fd }), 'PUT redirects.json');
  const prev = check(await fetch(`https://admin.hlx.page/preview/${ORG}/${REPO}/main/redirects.json`, { method: 'POST', headers: H }), 'preview redirects');
  const live = check(await fetch(`https://admin.hlx.page/live/${ORG}/${REPO}/main/redirects.json`, { method: 'POST', headers: H }), 'live redirects');
  console.log(`redirects.json: PUT ${put.status} preview ${prev.status} live ${live.status}`);
}
if (process.argv.includes('--code')) {
  const r = check(await fetch(`https://admin.hlx.page/code/${ORG}/${REPO}/main/*`, { method: 'POST', headers: H }), 'code sync');
  console.log(`code sync: ${r.status}`);
}
