import { describe, expect, it } from 'vitest';
import { RESERVED_WRITING_IDS } from '../src/lib/content-identity';
import { validateWritingEntries } from '../src/lib/content-validation';
import type { WritingData } from '../src/lib/writing-schema';
import { malformedCanonicalId } from './fixtures/invalid/cases';
import { makeEntry, makeWritingData } from './fixtures/factories';

function issueCodes(entries: ReturnType<typeof makeEntry>[]): string[] {
  return validateWritingEntries(entries).map(({ code }) => code);
}

describe('cross-entry content validation', () => {
  it('rejects malformed, duplicate, and reserved canonical IDs', () => {
    expect(issueCodes([makeEntry(malformedCanonicalId)])).toContain(
      'invalid-id',
    );
    expect(
      issueCodes([makeEntry('duplicate-id'), makeEntry('duplicate-id')]),
    ).toContain('duplicate-id');

    const [reservedId] = RESERVED_WRITING_IDS;
    expect(issueCodes([makeEntry(reservedId)])).toContain('reserved-id');
  });

  it('rejects a missing related-writing ID', () => {
    expect(
      issueCodes([
        makeEntry('source', { relatedWritings: ['missing-writing'] }),
      ]),
    ).toContain('missing-relationship');
  });

  it('rejects self and duplicate relationships', () => {
    expect(
      issueCodes([makeEntry('source', { relatedWritings: ['source'] })]),
    ).toContain('self-relationship');

    expect(
      issueCodes([
        makeEntry('source', {
          relatedWritings: ['target', 'target'],
        }),
        makeEntry('target'),
      ]),
    ).toContain('duplicate-relationship');
  });

  it('accepts a relationship to a draft', () => {
    const issues = validateWritingEntries([
      makeEntry('source', { relatedWritings: ['draft-target'] }),
      makeEntry('draft-target', { draft: true, publishedAt: undefined }),
    ]);
    expect(issues).toEqual([]);
  });

  it('rejects reversed dates and a missing public publication date', () => {
    expect(
      issueCodes([
        makeEntry('reversed-dates', {
          publishedAt: new Date('2026-07-03'),
          updatedAt: new Date('2026-07-02'),
        }),
      ]),
    ).toContain('date-order');

    expect(
      issueCodes([
        makeEntry('missing-date', {
          publishedAt: undefined,
          draft: false,
        }),
      ]),
    ).toContain('missing-publication-date');
  });

  it('rejects featured drafts and archived writings', () => {
    expect(
      issueCodes([
        makeEntry('featured-draft', { featured: true, draft: true }),
      ]),
    ).toContain('featured-draft');

    expect(
      issueCodes([
        makeEntry('featured-archive', {
          featured: true,
          status: 'archived',
        }),
      ]),
    ).toContain('featured-archived');
  });

  it('rejects an inconsistent revised version', () => {
    expect(
      issueCodes([
        makeEntry('bad-revision', {
          status: 'revised',
          version: '1.2.0',
          revisionNotes: [
            {
              version: '1.1.0',
              date: new Date('2026-07-02'),
              summary: 'Previous version only.',
            },
          ],
        }),
      ]),
    ).toContain('revision-version-mismatch');
  });

  it('rejects duplicate reference IDs within an entry', () => {
    const duplicatedReference = {
      id: 'same-source',
      title: 'Same Source',
      url: 'https://example.com/source',
      accessedAt: new Date('2026-07-02'),
    };
    const data = makeWritingData({
      references: [duplicatedReference, duplicatedReference],
    }) as WritingData;

    expect(issueCodes([{ id: 'duplicate-references', data }])).toContain(
      'duplicate-reference-id',
    );
  });
});
