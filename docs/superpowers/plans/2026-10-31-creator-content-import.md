# Creator Content Package Import Plan

> **For agentic workers:** Execute inline; preserve the staged legacy package files.

**Goal:** Add a repeatable, validated import step that copies Creator's published package into a Web-owned static directory without reading Creator source files.

**Architecture:** Import only manifest-referenced files into `public/creator-content`. Keep the existing staged `public/creator-strategies/index.json` untouched. Web article reads and asset URLs use the new directory; package absence remains a supported legacy transition state.

**Tech Stack:** Node.js 24, Next.js static public assets, Vitest.

## Global Constraints

- Do not overwrite `public/creator-strategies/index.json` or `.creator-strategies-manifest.json`.
- Do not export or classify historical Creator Markdown.
- Do not run a Web build over existing static output.

---

### Task 1: Build a safe package importer and consumer path

**Files:**
- Create: `scripts/import_creator_content.mjs`
- Modify: `lib/creator-content.ts`
- Test: `__tests__/creator-content.test.ts`
- Modify: `package.json`

- [ ] Reject invalid manifests, duplicate IDs/slugs, unsafe paths, missing files, and non-published articles.
- [ ] Copy only manifest-referenced files into `public/creator-content`.
- [ ] Keep missing package behavior as an empty package for the transition period.
- [ ] Verify tests, TypeScript, ESLint, and `git diff --check`.

**Acceptance:** The import operation never writes into the legacy staged directory and fails closed on unsafe packages.

**Rollback:** Remove the new importer and restore the prior content root and URL prefix.
