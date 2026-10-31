#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CREATOR_ROOT = path.resolve(process.env.DANKE_CREATOR_ROOT || path.join(SITE_ROOT, '../danke-creator'));
const SOURCE_ROOT = path.join(CREATOR_ROOT, 'dist/web/site-content');
const PUBLIC_ROOT = path.join(SITE_ROOT, 'public/creator-strategies');
const MANIFEST_PATH = path.join(SITE_ROOT, '.creator-strategies-manifest.json');
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function loadSourceIndex() {
  const indexPath = path.join(SOURCE_ROOT, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.warn(`Creator content index not found at ${indexPath}; exporting no creator articles.`);
    return { version: 1, articles: [] };
  }
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  if (!Array.isArray(index.articles)) throw new Error('Creator content index must contain an articles array.');
  return index;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  return Array.isArray(parsed.slugs) ? parsed.slugs.filter((slug) => SAFE_SLUG.test(slug)) : [];
}

function publicAssetUrl(slug, value) {
  if (!value || /^(?:https?:|data:|\/)/i.test(value)) return value;
  const normalized = value.replace(/^\.\//, '').split('/').map(encodeURIComponent).join('/');
  return `/creator-strategies/${encodeURIComponent(slug)}/${normalized}`;
}

function main() {
  const index = loadSourceIndex();
  const previousSlugs = new Set(readManifest());
  fs.mkdirSync(PUBLIC_ROOT, { recursive: true });
  const records = [];
  const newSlugs = new Set();

  for (const record of index.articles) {
    const slug = record.slug;
    const packagePath = record.package_path;
    if (!SAFE_SLUG.test(slug) || packagePath !== slug) throw new Error(`Unsafe or inconsistent creator package path for ${slug}`);
    if (newSlugs.has(slug)) throw new Error(`Duplicate creator website slug: ${slug}`);
    newSlugs.add(slug);
    const sourcePackage = path.resolve(SOURCE_ROOT, packagePath);
    if (!sourcePackage.startsWith(`${SOURCE_ROOT}${path.sep}`)) throw new Error(`Creator package path escapes export root: ${packagePath}`);
    const htmlSource = path.join(sourcePackage, 'article.html');
    if (!fs.existsSync(htmlSource)) throw new Error(`Generated article HTML is missing for ${slug}`);

    const targetPackage = path.join(PUBLIC_ROOT, slug);
    if (fs.existsSync(targetPackage) && !previousSlugs.has(slug)) {
      throw new Error(`Refusing to overwrite an unmanaged public content folder: ${slug}`);
    }
    fs.mkdirSync(targetPackage, { recursive: true });
    fs.cpSync(sourcePackage, targetPackage, { recursive: true, force: true });
    const targetHtml = path.join(targetPackage, 'article.html');
    const html = fs.readFileSync(targetHtml, 'utf8').replaceAll('./assets/', `/creator-strategies/${encodeURIComponent(slug)}/assets/`);
    fs.writeFileSync(targetHtml, html, 'utf8');
    records.push({
      ...record,
      cover: publicAssetUrl(slug, record.cover),
      cover_vertical: publicAssetUrl(slug, record.cover_vertical),
    });
  }

  for (const oldSlug of previousSlugs) {
    if (!newSlugs.has(oldSlug)) {
      const oldPackage = path.join(PUBLIC_ROOT, oldSlug);
      if (oldPackage.startsWith(`${PUBLIC_ROOT}${path.sep}`) && fs.existsSync(oldPackage)) {
        fs.rmSync(oldPackage, { recursive: true, force: true });
      }
    }
  }

  fs.writeFileSync(path.join(PUBLIC_ROOT, 'index.json'), `${JSON.stringify({ version: 1, articles: records }, null, 2)}\n`, 'utf8');
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify({ slugs: [...newSlugs] }, null, 2)}\n`, 'utf8');
  console.log(`Synced ${records.length} published creator articles into public/creator-strategies.`);
}

try {
  main();
} catch (error) {
  console.error(`Creator content sync failed: ${error.message}`);
  process.exitCode = 1;
}
