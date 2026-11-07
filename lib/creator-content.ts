import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { sanitizeArticleHtml } from './markdown';
export type CreatorArticle = { id: string; slug: string; title: string; summary: string; author: string; categoryId: string; categoryLabel: string; subcategoryLabel: string; tags: string[]; series: string | null; cover: string | null; htmlPath: string; assetIds: string[]; publishedAt: string | null; updatedAt: string; legacySlugs: string[]; reviewDigest: string };
export type CreatorAsset = { id: string; path: string; mime: string; bytes: number; width: number; height: number };
export type CreatorPackage = { schemaVersion: 2; releaseId: string; candidate: boolean; articles: CreatorArticle[]; assets: CreatorAsset[] };
const digest = (data: Buffer) => createHash('sha256').update(data).digest('hex');
function readSafe(root: string, name: string): Buffer {
  if (!name || path.isAbsolute(name) || name.includes('\\') || name.includes('%') || name.split('/').includes('..')) throw new Error('Unsafe Creator path');
  let current = root;
  for (const segment of name.split('/')) { current = path.join(current, segment); if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Creator symlinks forbidden'); }
  return fs.readFileSync(current);
}
export function readCreatorPackage(directory = process.env.CREATOR_CONTENT_DIR): CreatorPackage {
  if (!directory) throw new Error('CREATOR_CONTENT_DIR must identify a verified content release');
  const root = path.resolve(directory);
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error('Resolve immutable release directory before building');
  const m = JSON.parse(readSafe(root, 'manifest.json').toString()) as CreatorPackage;
  if (m.schemaVersion !== 2 || typeof m.candidate !== 'boolean' || !/^r-\d{8}T\d{6}Z-[a-f0-9]{12}$/.test(m.releaseId) || !Array.isArray(m.articles) || !Array.isArray(m.assets)) throw new Error('Unsupported Creator protocol');
  if (m.candidate && process.env.CREATOR_PREVIEW !== '1') throw new Error('Candidate content requires explicit CREATOR_PREVIEW=1');
  const checksums = JSON.parse(readSafe(root, 'checksums.json').toString()) as Record<string, string>;
  const found: string[] = [];
  const walk = (folder: string) => { for (const entry of fs.readdirSync(folder, { withFileTypes: true })) { if (entry.isSymbolicLink()) throw new Error('Symlink in content'); const file = path.join(folder, entry.name); if (entry.isDirectory()) walk(file); else found.push(path.relative(root, file).split(path.sep).join('/')); } };
  walk(root);
  if (JSON.stringify(found.filter(n => n !== 'checksums.json').sort()) !== JSON.stringify(Object.keys(checksums).sort())) throw new Error('Creator file set mismatch');
  for (const [name, expected] of Object.entries(checksums)) if (digest(readSafe(root, name)) !== expected) throw new Error('Creator checksum mismatch');
  const ids = new Set<string>(); const slugs = new Set<string>(); const assets = new Map(m.assets.map(a => [a.id, a]));
  if (assets.size !== m.assets.length) throw new Error('Duplicate asset ID');
  for (const a of m.assets) { const data = readSafe(root, a.path); if (digest(data) !== a.id || data.length !== a.bytes || !a.path.startsWith('assets/sha256/')) throw new Error('Invalid asset'); }
  for (const a of m.articles) {
    if (['title', 'summary', 'author', 'categoryId', 'categoryLabel', 'subcategoryLabel', 'htmlPath'].some(k => typeof (a as unknown as Record<string, unknown>)[k] !== 'string') || !Array.isArray(a.assetIds) || !Array.isArray(a.tags) || !Array.isArray(a.legacySlugs)) throw new Error('Invalid article metadata');
    if (!/^dk-(?:\d{8}-\d{4}|legacy-[a-f0-9]{16})$/.test(a.id) || ids.has(a.id)) throw new Error('Invalid/duplicate article identity'); ids.add(a.id);
    for (const slug of [a.slug, ...a.legacySlugs]) { if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slugs.has(slug)) throw new Error('Invalid/duplicate alias'); slugs.add(slug); }
    if (a.assetIds.some(id => !assets.has(id)) || (a.cover && !assets.has(a.cover))) throw new Error('Missing asset');
    for (const match of readSafe(root, a.htmlPath).toString().matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) if (!a.assetIds.some(id => '/content/' + assets.get(id)?.path === match[1])) throw new Error('Unpinned image');
  }
  return m;
}
export function creatorArticleHtml(a: CreatorArticle): string {
  if (!process.env.CREATOR_CONTENT_DIR) throw new Error('Missing Creator package');
  return sanitizeArticleHtml(readSafe(path.resolve(process.env.CREATOR_CONTENT_DIR), a.htmlPath).toString()).replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
}
export function creatorAssetUrl(pkg: CreatorPackage, id: string | null) { return id ? '/content/' + pkg.assets.find(a => a.id === id)!.path : null; }
export function creatorSiteUrl(): string {
  const value = process.env.SITE_URL || (process.env.CREATOR_PREVIEW === '1' ? 'http://localhost:6105' : '');
  if (!value) throw new Error('SITE_URL is required for canonical URLs');
  return new URL(value).origin;
}

export function creatorSeriesNames(): Record<string, string> {
  const root = process.env.CREATOR_CONTENT_DIR;
  if (!root || !fs.existsSync(path.join(root, 'taxonomy.json'))) return {};
  const taxonomy = JSON.parse(readSafe(path.resolve(root), 'taxonomy.json').toString()) as { series: { id: string; name: string }[] };
  if (!Array.isArray(taxonomy.series)) throw new Error('Invalid series taxonomy');
  return Object.fromEntries(taxonomy.series.map(s => [s.id, s.name]));
}
