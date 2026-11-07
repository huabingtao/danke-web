import fs from 'node:fs';
// Explicit approved snapshot makes static builds independent of a running Core.
// Absence means use the existing API; a preview may explicitly provide an empty fixture.
export function readLegacySnapshot(): any[] | null {
  if (!process.env.LEGACY_CONTENT_SNAPSHOT) return null;
  const rows = JSON.parse(fs.readFileSync(process.env.LEGACY_CONTENT_SNAPSHOT, 'utf8'));
  if (!Array.isArray(rows) || rows.some(r => typeof r.slug !== 'string' || typeof r.title !== 'string')) throw new Error('Invalid legacy strategy snapshot');
  if (rows.length === 0 && process.env.CREATOR_PREVIEW !== '1') throw new Error('Empty legacy snapshot is only permitted for explicit previews');
  return rows.filter(r => r.enabled !== false);
}
