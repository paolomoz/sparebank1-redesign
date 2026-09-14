#!/usr/bin/env node
// Assemble stardust/prototypes/<slug>-proposed.html from the shared chrome (canon) + the page module.
// Usage: node stardust/scripts/proto/build.mjs <slug>
import fs from 'node:fs';
import { assemble, loadModule } from './assemble.mjs';
const slug = process.argv[2]; if (!slug) { console.error('slug required'); process.exit(1); }
const mod = await loadModule(slug);
const { html } = assemble(slug, mod);
const out = `stardust/prototypes/${slug}-proposed.html`; fs.writeFileSync(out, html);
console.log(`${out} — ${(html.length / 1024).toFixed(0)} KB`);
