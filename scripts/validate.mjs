// Checks every profile and the verified-sites list. No dependencies.
// Exit code 1 and a list of problems if anything is wrong.
//
// The format is defined by Longboard (src/shared/profile.ts in its
// repository); this is the same set of rules written again so this
// repository needs nothing installed. If the two disagree, Longboard's is
// right: it is what decides whether a profile is used.
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
const MAX_SELECTOR = 300;
const MAX_LIST = 50;
const PLAYER_KEYS = ['Space', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'k', 'j', 'l', 'f', 'm'];
/** A selector: text, not blank, not over-long. The template's empty entries are allowed there only. */
const isSelector = (v, template) => isStr(v) && v.length <= MAX_SELECTOR && (template || v.trim().length > 0);
const isSelectors = (v, template) => Array.isArray(v) && v.length <= MAX_LIST && v.every((x) => isSelector(x, template));

export function checkProfile(p, where, { template = false } = {}) {
  if (p === null || typeof p !== 'object' || Array.isArray(p)) {
    fail(where, 'must be a JSON object');
    return;
  }
  if ('scripts' in p) fail(where, 'profiles cannot contain scripts in format version 1');
  onlyKeys(
    p,
    ['longboard', 'id', 'name', 'version', 'authors', 'licence', 'match', 'view', 'focus',
      'player', 'text', 'dismiss', 'guard', 'evidence', 'scripts'],
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

  if (p.view !== undefined && typeof p.view === 'object' && p.view !== null) {
    onlyKeys(p.view, ['canvas', 'safeMargin', 'device', 'entry', 'carry'], `${where} view`);
    // Names of query parameters copied to the entry: plain names, and only with an entry.
    if (p.view.carry !== undefined && !(Array.isArray(p.view.carry) && p.view.carry.length > 0 && p.view.carry.length <= 10 && p.view.carry.every((n) => typeof n === 'string' && /^[A-Za-z0-9_-]{1,30}$/.test(n)) && p.view.entry !== undefined)) fail(where, '"view.carry" must be a short list of plain parameter names, and needs "view.entry"');
    // A plain path on the site itself: never another site, never a query.
    if (p.view.entry !== undefined && !(typeof p.view.entry === 'string' && p.view.entry.length <= 200 && /^\/[A-Za-z0-9._~\-/]*$/.test(p.view.entry) && !p.view.entry.startsWith('//') && p.view.entry !== '/')) fail(where, '"view.entry" must be a plain path on the site, such as "/tv"');
    // One word. A profile never carries what Longboard calls itself (Longboard's Hard rule 3).
    if (p.view.device !== undefined && p.view.device !== 'tv') fail(where, '"view.device" can only be "tv"');
    if (p.view.canvas !== undefined && !/^\d{3,4}x\d{3,4}$/.test(p.view.canvas)) fail(where, '"view.canvas" must look like 960x540');
    const sm = p.view.safeMargin;
    if (sm !== undefined && !(typeof sm === 'number' && sm >= 0 && sm <= 0.15)) fail(where, '"view.safeMargin" must be between 0 and 0.15');
  }

  const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  for (const key of ['view', 'focus', 'player', 'text', 'guard']) {
    if (p[key] !== undefined && !isObj(p[key])) fail(where, `"${key}" must be an object`);
  }

  if (isObj(p.focus)) {
    const f = p.focus;
    onlyKeys(f, ['include', 'exclude', 'initial', 'groups', 'scrollPrevious', 'scrollNext'], `${where} focus`);
    for (const k of ['include', 'exclude', 'scrollPrevious', 'scrollNext']) {
      if (f[k] !== undefined && !isSelectors(f[k], template)) fail(where, `"focus.${k}" must be a list of at most ${MAX_LIST} selectors`);
    }
    if (f.initial !== undefined && !isSelector(f.initial, template)) fail(where, '"focus.initial" must be a selector');
    if (f.groups !== undefined) {
      if (!Array.isArray(f.groups) || f.groups.length > MAX_LIST) fail(where, '"focus.groups" must be a list');
      else f.groups.forEach((g, i) => {
        const w = `${where} focus.groups[${i}]`;
        if (!isObj(g)) return fail(w, 'must be an object');
        onlyKeys(g, ['name', 'selector', 'axis', 'remember'], w);
        if (!isStr(g.name) || !g.name.trim() || !isSelector(g.selector, false)) fail(w, 'needs "name" and "selector"');
        if (!['horizontal', 'vertical', 'grid'].includes(g.axis)) fail(w, '"axis" must be horizontal, vertical or grid');
        if (g.remember !== undefined && typeof g.remember !== 'boolean') fail(w, '"remember" must be true or false');
      });
    }
  }

  if (isObj(p.player)) {
    onlyKeys(p.player, ['container', 'controls', 'close', 'keys'], `${where} player`);
    for (const k of ['container', 'controls', 'close']) {
      if (p.player[k] !== undefined && !isSelector(p.player[k], template)) fail(where, `"player.${k}" must be a selector`);
    }
    if (p.player.keys !== undefined) {
      const keys = p.player.keys;
      if (!isObj(keys)) fail(where, '"player.keys" must be an object');
      else {
        onlyKeys(keys, ['playPause', 'back', 'forward'], `${where} player.keys`);
        for (const [k, v] of Object.entries(keys)) {
          if (!PLAYER_KEYS.includes(v)) fail(where, `"player.keys.${k}" must be one of ${PLAYER_KEYS.join(', ')}`);
        }
      }
    }
  }

  if (isObj(p.text)) {
    onlyKeys(p.text, ['search', 'searchOpen'], `${where} text`);
    for (const k of ['search', 'searchOpen']) {
      if (p.text[k] !== undefined && !isSelector(p.text[k], template)) fail(where, `"text.${k}" must be a selector`);
    }
  }
  if (p.dismiss !== undefined && !isSelectors(p.dismiss, template)) fail(where, `"dismiss" must be a list of at most ${MAX_LIST} selectors`);
  if (isObj(p.guard)) {
    onlyKeys(p.guard, ['purchase'], `${where} guard`);
    if (p.guard.purchase !== undefined && !isSelectors(p.guard.purchase, template)) fail(where, `"guard.purchase" must be a list of at most ${MAX_LIST} selectors`);
  }

  if (!isObj(p.evidence) || !isStr(p.evidence.outline)) fail(where, '"evidence.outline" must name the outline file');
  else onlyKeys(p.evidence, ['outline'], `${where} evidence`);
}

/**
 * An outline holds structure only. Each line that is not a note (starting
 * with "#") is one element written as a single token, so a line with a space
 * in it, or with an address in it, has text that should not be there. This
 * catches the obvious; a reviewer still reads the file.
 */
function checkOutline(path, where) {
  const lines = readFileSync(path, 'utf8').split('\n');
  const body = lines.filter((l) => l.trim() && !l.startsWith('#'));
  if (body.length === 0) fail(where, 'is empty');
  body.forEach((l) => {
    if (l.trim().includes(' ')) fail(where, `a line has a space in it, so it holds text: "${l.trim().slice(0, 40)}"`);
    if (/https?:|www\./i.test(l)) fail(where, `a line holds an address: "${l.trim().slice(0, 40)}"`);
  });
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
    for (const f of ['profile.json', 'outline.txt', 'NOTES.md']) {
      if (!existsSync(join(folder, f))) fail(where, `missing ${f}`);
    }
    if (!existsSync(join(folder, 'profile.json'))) continue;
    const p = readJson(join(folder, 'profile.json'), `${where}/profile.json`);
    if (!p) continue;
    checkProfile(p, `${where}/profile.json`);
    if (existsSync(join(folder, 'outline.txt'))) checkOutline(join(folder, 'outline.txt'), `${where}/outline.txt`);
    const hosts = p?.match?.hosts ?? [];
    if (Array.isArray(hosts) && !hosts.includes(name)) fail(where, `"match.hosts" must include "${name}"`);
    if (isStr(p.id)) {
      if (ids.has(p.id)) fail(where, `id "${p.id}" is already used by ${ids.get(p.id)}`);
      ids.set(p.id, where);
    }
    if (p?.evidence?.outline && p.evidence.outline !== 'outline.txt') fail(where, '"evidence.outline" must be "outline.txt"');
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
