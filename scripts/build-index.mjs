// Writes dist/index.json: every profile with a checksum, plus the
// verified-sites list. Longboard downloads this one file.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
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

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/index.json'), `${JSON.stringify(index, null, 2)}\n`);
console.log(`Wrote dist/index.json: ${profiles.length} profile(s), ${index.verifiedSites.length} verified site(s).`);
