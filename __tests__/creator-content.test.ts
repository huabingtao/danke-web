import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readCreatorPackage } from '@/lib/creator-content';

const roots: string[] = [];
afterEach(() => { vi.unstubAllEnvs(); for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true }); });
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'creator-web-test-')); roots.push(root);
  const manifest = { schemaVersion: 2, releaseId: 'r-20261106T000000Z-0123456789ab', candidate: true, articles: [{ id: 'dk-20261106-9001', slug: 'fixture', title: '纯文字', summary: '', author: '作者', categoryId: 'equipment', categoryLabel: '装备', subcategoryLabel: '载具', tags: [], cover: null, assetIds: [], legacySlugs: [], htmlPath: 'article.html' }], assets: [] };
  fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest)); fs.writeFileSync(path.join(root, 'article.html'), '<article><p>无图也可以阅读</p></article>');
  const checksums = Object.fromEntries(['manifest.json', 'article.html'].map(name => [name, createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex')]));
  fs.writeFileSync(path.join(root, 'checksums.json'), JSON.stringify(checksums));
  return root;
}
describe('Creator static content boundary', () => {
  it('requires an explicit package instead of silently serving an empty article list', () => { vi.stubEnv('CREATOR_CONTENT_DIR', ''); expect(() => readCreatorPackage()).toThrow('CREATOR_CONTENT_DIR'); });
  it('requires explicit preview mode for candidates', () => { vi.stubEnv('CREATOR_PREVIEW', ''); expect(() => readCreatorPackage(fixture())).toThrow('CREATOR_PREVIEW'); });
  it('accepts a complete text-only preview package', () => { vi.stubEnv('CREATOR_PREVIEW', '1'); expect(readCreatorPackage(fixture()).articles[0].title).toBe('纯文字'); });
  it('refuses changed HTML and unlisted files', () => { vi.stubEnv('CREATOR_PREVIEW', '1'); const root = fixture(); fs.appendFileSync(path.join(root, 'article.html'), 'changed'); expect(() => readCreatorPackage(root)).toThrow('checksum'); });
  it('refuses a symlink payload before reading it', () => { vi.stubEnv('CREATOR_PREVIEW', '1'); const root = fixture(); fs.unlinkSync(path.join(root, 'article.html')); fs.symlinkSync('/etc/hosts', path.join(root, 'article.html')); expect(() => readCreatorPackage(root)).toThrow('Symlink'); });
});
