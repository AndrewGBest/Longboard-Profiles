// Writes index.json at the top of the repository: every profile with the
// checksum of its file, plus the verified-sites list. Longboard downloads
// this one file, then each profile it lists, and checks each against its
// checksum. With --check nothing is written: the script fails if index.json
// is not what it would write, so a stale index cannot be merged.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

const profiles = [];
const dir = join(root, 'profiles');
for (const name of readdirSync(dir).sort()) {
  const file = join(dir, name, 'profile.json');
  if (!statSync(join(dir, name)).isDirectory() || !existsSync(file)) continue;
  const raw = readFileSync(file);
  const p = JSON.parse(raw.toString('utf8'));
  profiles.push({
    id: p.id,
    name: p.name,
    version: p.version,
    hosts: p.match.hosts,
    path: `profiles/${name}/profile.json`,
    sha256: sha256(raw),
  });
}

const verified = JSON.parse(readFileSync(join(root, 'verified-sites.json'), 'utf8'));
const index = {
  'longboard-index': 1,
  profiles,
  verifiedSites: verified.sites.map((s) => s.domain),
};
const text = `${JSON.stringify(index, null, 2)}\n`;
const file = join(root, 'index.json');

if (process.argv.includes('--check')) {
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (current !== text) {
    console.error('index.json is out of date. Run "npm run index" and commit the result.');
    process.exit(1);
  }
  console.log(`index.json is up to date: ${profiles.length} profile(s), ${index.verifiedSites.length} verified site(s).`);
} else {
  writeFileSync(file, text);
  console.log(`Wrote index.json: ${profiles.length} profile(s), ${index.verifiedSites.length} verified site(s).`);
}
