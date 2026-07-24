import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '..');
const astroCli = resolve(projectRoot, 'node_modules/astro/bin/astro.mjs');

function duplicateFixture(title: string): string {
  return `---
slug: duplicate-integration-id
title: ${title}
description: Loader-level duplicate identity detection integration fixture.
type: note
status: seed
epistemicStatus: speculative
updatedAt: 2026-07-24
version: 0.1.0
language: en
tags: []
relatedWritings: []
references: []
featured: false
draft: true
revisionNotes: []
---

Temporary duplicate identity fixture.
`;
}

describe('Astro duplicate source identity integration', () => {
  it('fails a real build before duplicate entries can overwrite each other', () => {
    const temporaryRoot = mkdtempSync(
      resolve(tmpdir(), 'genesite-duplicate-id-integration-'),
    );
    const firstPath = resolve(temporaryRoot, 'first.md');
    const secondPath = resolve(temporaryRoot, 'second.mdx');
    let result: ReturnType<typeof spawnSync> | undefined;

    try {
      writeFileSync(firstPath, duplicateFixture('First duplicate'), 'utf8');
      writeFileSync(secondPath, duplicateFixture('Second duplicate'), 'utf8');

      result = spawnSync(process.execPath, [astroCli, 'build'], {
        cwd: projectRoot,
        encoding: 'utf8',
        env: {
          ...process.env,
          ASTRO_TELEMETRY_DISABLED: '1',
          GENESITE_TEST_WRITINGS_BASE: temporaryRoot,
        },
      });
    } finally {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }

    if (!result) {
      throw new Error('The duplicate-identity build process did not start');
    }

    const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
    expect(result.status).not.toBe(0);
    expect(output).toContain('duplicate-integration-id');
    expect(output).toContain('"first.md"');
    expect(output).toContain('"second.mdx"');
    expect(existsSync(temporaryRoot)).toBe(false);
  });
});
