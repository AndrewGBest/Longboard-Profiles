// Checks every profile and the verified-sites list. No dependencies.
// Exit code 1 and a list of problems if anything is wrong.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);

const DOMAIN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const HOST = /^(\*\.)?([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function readJson(path, where) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    fail(where, `not valid JSON (${e.message})`);
    return null;
  }
}

function onlyKeys(obj, allowed, where) {
  for (const k of Object.keys(obj)) {
    if (!allowed.includes(k)) fail(where, `unknown key "${k}"`);
  }
}

const isStr = (v) => typeof v === 'string';
const isStrArr = (v) => Array.isArray(v) && v.every(isStr);

export function checkProfile(p, where, { template = false } = {}) {
  if (p === null || typeof p !== 'object' || Array.isArray(p)) {
    fail(where, 'must be a JSON object');
    return;
  }
  if ('scripts' in p) fail(where, 'profiles cannot contain scripts in format version 1');
  onlyKeys(
    p,
    ['longboard', 'id', 'name', 'version', 'authors', 'licence', 'match', 'view', 'focus',
      'player', 'text', 'dismiss', 'evidence', 'scripts'],
    where,
  );
  if (p.longboard !== 1) fail(where, '"longboard" must be 1');
  if (!isStr(p.id) || !ID.test(p.id)) fail(where, '"id" must be lower-case words joined by hyphens');
  if (!isStr(p.name) || !p.name.trim()) fail(where, '"name" is required');
  if (!isStr(p.version) || !SEMVER.test(p.version)) fail(where, '"version" must look like 1.0.0');
  if (!isStrArr(p.authors) || p.authors.length === 0) fail(where, '"authors" must list at least one name');
  if (p.licence !== 'CC0-1.0') fail(where, '"licence" must be CC0-1.0');

  const m = p.match;
  if (!m || typeof m !== 'object') fail(where, '"match" is required');
  else {
    onlyKeys(m, ['hosts', 'paths'], `${where} match`);
    if (!isStrArr(m.hosts) || m.hosts.length === 0) fail(where, '"match.hosts" must list at least one host');
    else for (const h of m.hosts) if (!HOST.test(h)) fail(where, `host "${h}" must be a domain, optionally starting with "*."`);
    if (m.paths !== undefined) {
      if (!isStrArr(m.paths)) fail(where, '"match.paths" must be a list of text');
      else for (const x of m.paths) if (!x.startsWith('/')) fail(where, `path "${x}" must start with "/"`);
    }
  }

  if (p.view !== undefined) {
    onlyKeys(p.view, ['canvas', 'safeMargin'], `${where} view`);
    if (p.view.canvas !== undefined && !/^\d{3,4}x\d{3,4}$/.test(p.view.canvas)) fail(where, '"view.canvas" must look like 960x540');
    const sm = p.view.safeMargin;
    if (sm !== undefined && !(typeof sm === 'number' && sm >= 0 && sm <= 0.15)) fail(where, '"view.safeMargin" must be between 0 and 0.15');
  }

  if (p.focus !== undefined) {
    const f = p.focus;
    onlyKeys(f, ['include', 'exclude', 'initial', 'groups'], `${where} focus`);
    for (const k of ['include', 'exclude']) if (f[k] !== undefined && !isStrArr(f[k])) fail(where, `"focus.${k}" must be a list of selectors`);
    if (f.initial !== undefined && !isStr(f.initial)) fail(where, '"focus.initial" must be a selector');
    if (f.groups !== undefined) {
      if (!Array.isArray(f.groups)) fail(where, '"focus.groups" must be a list');
      else f.groups.forEach((g, i) => {
        const w = `${where} focus.groups[${i}]`;
        if (!g || typeof g !== 'object') return fail(w, 'must be an object');
        onlyKeys(g, ['name', 'selector', 'axis', 'remember'], w);
        if (!isStr(g.name) || !isStr(g.selector)) fail(w, 'needs "name" and "selector"');
        if (!['horizontal', 'vertical', 'grid'].includes(g.axis)) fail(w, '"axis" must be horizontal, vertical or grid');
        if (g.remember !== undefined && typeof g.remember !== 'boolean') fail(w, '"remember" must be true or false');
      });
    }
  }

  if (p.player !== undefined) {
    onlyKeys(p.player, ['container', 'controls', 'keys'], `${where} player`);
    for (const k of ['container', 'controls']) if (p.player[k] !== undefined && !isStr(p.player[k])) fail(where, `"player.${k}" must be a selector`);
    if (p.player.keys !== undefined) {
      const keys = p.player.keys;
      if (!keys || typeof keys !== 'object' || Array.isArray(keys)) fail(where, '"player.keys" must be an object');
      else {
        onlyKeys(keys, ['playPause', 'back', 'forward'], `${where} player.keys`);
        for (const v of Object.values(keys)) if (!isStr(v)) fail(where, '"player.keys" values must be key names');
      }
    }
  }

  if (p.text !== undefined) {
    onlyKeys(p.text, ['search'], `${where} text`);
    if (p.text.search !== undefined && !isStr(p.text.search)) fail(where, '"text.search" must be a selector');
  }
  if (p.dismiss !== undefined && !isStrArr(p.dismiss)) fail(where, '"dismiss" must be a list of selectors');

  if (!p.evidence || !isStr(p.evidence.outline)) fail(where, '"evidence.outline" must name the outline file');
  else if (!template) onlyKeys(p.evidence, ['outline'], `${where} evidence`);
}

function checkVerified() {
  const where = 'verified-sites.json';
  const v = readJson(join(root, where), where);
  if (!v) return;
  onlyKeys(v, ['longboard-verified', 'sites'], where);
  if (v['longboard-verified'] !== 1) fail(where, '"longboard-verified" must be 1');
  if (!Array.isArray(v.sites)) return fail(where, '"sites" must be a list');
  const seen = new Set();
  let prev = '';
  v.sites.forEach((s, i) => {
    const w = `${where} sites[${i}]`;
    if (!s || typeof s !== 'object') return fail(w, 'must be an object');
    onlyKeys(s, ['domain', 'reviewedBy', 'reviewed', 'note'], w);
    if (!isStr(s.domain) || !DOMAIN.test(s.domain)) return fail(w, '"domain" must be a plain lower-case domain');
    if (seen.has(s.domain)) fail(w, `"${s.domain}" is listed twice`);
    if (s.domain < prev) fail(w, `"${s.domain}" is out of alphabetical order`);
    seen.add(s.domain);
    prev = s.domain;
    if (!isStr(s.reviewedBy) || !s.reviewedBy.trim()) fail(w, '"reviewedBy" is required');
    if (!isStr(s.reviewed) || !DATE.test(s.reviewed)) fail(w, '"reviewed" must be a date like 2026-11-18');
    if (s.note !== undefined && !isStr(s.note)) fail(w, '"note" must be text');
  });
}

function checkProfiles() {
  const dir = join(root, 'profiles');
  const ids = new Map();
  for (const name of readdirSync(dir).sort()) {
    const folder = join(dir, name);
    if (!statSync(folder).isDirectory()) continue;
    const where = `profiles/${name}`;
    if (!DOMAIN.test(name)) fail(where, 'folder must be named after the site\'s main domain');
    for (const f of ['profile.json', 'outline.json', 'NOTES.md']) {
      if (!existsSync(join(folder, f))) fail(where, `missing ${f}`);
    }
    if (!existsSync(join(folder, 'profile.json'))) continue;
    const p = readJson(join(folder, 'profile.json'), `${where}/profile.json`);
    if (!p) continue;
    checkProfile(p, `${where}/profile.json`);
    if (existsSync(join(folder, 'outline.json'))) readJson(join(folder, 'outline.json'), `${where}/outline.json`);
    const hosts = p?.match?.hosts ?? [];
    if (Array.isArray(hosts) && !hosts.includes(name)) fail(where, `"match.hosts" must include "${name}"`);
    if (isStr(p.id)) {
      if (ids.has(p.id)) fail(where, `id "${p.id}" is already used by ${ids.get(p.id)}`);
      ids.set(p.id, where);
    }
    if (p?.evidence?.outline && p.evidence.outline !== 'outline.json') fail(where, '"evidence.outline" must be "outline.json"');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t = readJson(join(root, 'template/profile.json'), 'template/profile.json');
  if (t) checkProfile(t, 'template/profile.json', { template: true });
  checkVerified();
  checkProfiles();
  if (problems.length) {
    console.error(problems.map((p) => `  - ${p}`).join('\n'));
    console.error(`\n${problems.length} problem(s).`);
    process.exit(1);
  }
  console.log('All profiles and the verified-sites list are valid.');
}
