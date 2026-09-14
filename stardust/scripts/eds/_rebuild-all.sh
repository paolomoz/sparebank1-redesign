#!/bin/bash
# _rebuild-all.sh — after a canon/assembler change: rebuild the 13 prototypes, re-gate them (content-check + validation loop), re-migrate,
# re-convert, rasterise, sanitise, publish everything, then the published-origin gate on the 12 non-product archetypes.
set -u; cd /Users/paolo/stardust/2026-08/sparebank1-redesign
NODE=$(command -v node); set -a; source /Users/paolo/.claude/.env; set +a
ARCH=$($NODE -e 'const s=require("./stardust/state.json");console.log(s.pages.filter(p=>p.fidelityTier==="archetype").map(p=>p.slug).join(" "))')
echo "== prototypes"; for s in $ARCH; do $NODE stardust/scripts/proto/build.mjs $s >/dev/null || echo "BUILD FAIL $s"; $NODE stardust/scripts/content-check.mjs $s --out stardust/validation/$s/content-check.json | tail -1; $NODE stardust/scripts/validate-prototype.mjs $s --no-shots >/dev/null 2>&1; $NODE -e "const r=require('./stardust/validation/$s/report.json');const p=r.issues.filter(i=>/P0|P1/.test(i.sev));console.log('$s validation', r.pass?'PASS':'FAIL', 'P0/P1', p.length, p.slice(0,2).map(i=>i.where+' '+i.msg.slice(0,80)).join(' | '))"; done
echo "== migrate"; $NODE stardust/scripts/migrate/migrate.mjs --all --force | tail -1
echo "== convert"; $NODE stardust/scripts/eds/convert.mjs --all | tail -1
echo "== rasterise"; $NODE stardust/scripts/eds/rasterise-svg.mjs --from-migrated | tail -1
echo "== sanitise"; for f in $(find content -name '*.html'); do $NODE stardust/scripts/deploy/sanitise.js "$f" >/dev/null 2>&1; done
echo "== publish"; $NODE stardust/scripts/eds/chrome.mjs >/dev/null 2>&1; $NODE stardust/scripts/deploy/deploy-batch.mjs --org paolomoz --repo sparebank1-redesign --branch main --content content --concurrency 3 --force --ledger stardust/rollout/deploy-ledger.json --log stardust/rollout/deploy.log 2>&1 | grep -E 'FAIL|done|pages,'
git add -A stardust/prototypes stardust/validation stardust/migrated stardust/state.json content stardust/rollout/eds-log stardust/rollout/raster-ledger.json stardust/rollout/deploy-ledger.json stardust/scripts >/dev/null 2>&1; git commit -q -m "edge-NBSP debris stripped in the assembler: prototypes rebuilt + re-gated, 100 pages re-migrated, re-converted, republished" && git push -q origin main
echo "== published gates"; for s in $ARCH; do [ "$s" = "nb-bank-privat-lan-boliglan-html" ] && continue; echo "-- $s"; $NODE stardust/scripts/eds/gate.mjs $s --widths 1440,360 --eds https://main--sparebank1-redesign--paolomoz.aem.live --tag pub 2>&1 | grep -E '^\[|content-diff|PASS|FAIL' | grep -v '^  '; done
echo "== done"
