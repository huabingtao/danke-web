import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const source = process.env.CREATOR_CONTENT_DIR;
if (!source) throw new Error('Set CREATOR_CONTENT_DIR to a verified immutable release');
const root = path.resolve(source);
const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
if (m.schemaVersion !== 2 || !Array.isArray(m.assets) || (m.candidate && process.env.CREATOR_PREVIEW !== '1')) throw new Error('Invalid or unapproved content package');
const content = path.resolve('public/content');
if (fs.existsSync(content) && fs.lstatSync(content).isSymbolicLink()) throw new Error('Unsafe output');
fs.mkdirSync(content, { recursive: true });
for (const a of m.assets) {
  if (!/^assets\/sha256\/[a-f0-9]{2}\/[a-f0-9]{64}\.[a-z]+$/.test(a.path)) throw new Error('Unsafe asset key');
  let cursor = root;
  for (const segment of a.path.split('/')) { cursor = path.join(cursor, segment); if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('Symlink asset'); }
  const data = fs.readFileSync(cursor);
  if (crypto.createHash('sha256').update(data).digest('hex') !== a.id || data.length !== a.bytes) throw new Error('Asset checksum mismatch');
  const target = path.join(content, a.path);
  let out = content;
  for (const segment of a.path.split('/').slice(0, -1)) { out = path.join(out, segment); if (fs.existsSync(out) && fs.lstatSync(out).isSymbolicLink()) throw new Error('Unsafe target'); fs.mkdirSync(out, { recursive: true }); }
  if (fs.existsSync(target)) { if (fs.lstatSync(target).isSymbolicLink() || !fs.readFileSync(target).equals(data)) throw new Error('Immutable asset conflict'); }
  else fs.writeFileSync(target, data, { flag: 'wx' });
}
console.log(`Prepared ${m.assets.length} content assets for ${m.releaseId}`);

fs.writeFileSync(path.resolve("public/content-release.json"), JSON.stringify({releaseId:m.releaseId, manifestSha256:crypto.createHash("sha256").update(fs.readFileSync(path.join(root,"manifest.json"))).digest("hex"), candidate:m.candidate}));
// Retire only an intact, publisher-owned legacy package. Keep a local backup.
const legacy = path.resolve('public/creator-content');
if (fs.existsSync(legacy)) {
  const markerPath = path.join(legacy, '.creator-deployment.json');
  if (fs.lstatSync(legacy).isSymbolicLink() || !fs.existsSync(markerPath)) throw new Error('Unmanaged legacy creator-content directory');
  const marker = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
  if (marker.managed_by !== 'danke-creator') throw new Error('Unmanaged legacy package');
  const actual = {};
  const walk = folder => { for (const entry of fs.readdirSync(folder, {withFileTypes:true})) { const file = path.join(folder,entry.name); if(entry.isSymbolicLink()) throw new Error('Legacy symlink'); if(entry.isDirectory()) walk(file); else { const name=path.relative(legacy,file).split(path.sep).join('/'); if(name!=='.creator-deployment.json') actual[name]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); } } };
  walk(legacy);
  const sorted = value => JSON.stringify(Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b))));
  if (sorted(actual)!==sorted(marker.files || {})) throw new Error('Legacy package has unreviewed edits');
  const retired = path.resolve('.creator-content-backups'); fs.mkdirSync(retired,{recursive:true});
  fs.renameSync(legacy,path.join(retired,crypto.randomUUID()));
}
