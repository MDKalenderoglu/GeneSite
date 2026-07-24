import { describe, expect, it } from 'vitest';
import {
  featuredArchivedWriting,
  featuredDraftWriting,
  inconsistentRevisedWriting,
  invalidDateWriting,
  publicWritingWithoutPublishedAt,
} from './fixtures/invalid/cases';
import { makeRawWriting } from './fixtures/factories';
import { writingSchema } from '../src/lib/writing-schema';

describe('writing schema', () => {
  it('trims constrained text and normalizes tags', () => {
    const writing = writingSchema.parse(
      makeRawWriting({
        title: '  Başlık  ',
        description: '  Açıklama  ',
        tags: ['  Research-Methods  '],
      }),
    );

    expect(writing.title).toBe('Başlık');
    expect(writing.description).toBe('Açıklama');
    expect(writing.tags).toEqual(['research-methods']);
  });

  it('accepts only Turkish and English', () => {
    expect(
      writingSchema.safeParse(makeRawWriting({ language: 'tr' })).success,
    ).toBe(true);
    expect(
      writingSchema.safeParse(makeRawWriting({ language: 'en' })).success,
    ).toBe(true);
    expect(
      writingSchema.safeParse(makeRawWriting({ language: 'de' })).success,
    ).toBe(false);
  });

  it('coerces valid dates and rejects an invalid date', () => {
    const parsed = writingSchema.parse(makeRawWriting());
    expect(parsed.updatedAt).toBeInstanceOf(Date);
    expect(writingSchema.safeParse(invalidDateWriting).success).toBe(false);
    expect(
      writingSchema.safeParse(makeRawWriting({ updatedAt: 'July 2, 2026' }))
        .success,
    ).toBe(false);
  });

  it('rejects updatedAt before publishedAt', () => {
    const result = writingSchema.safeParse(
      makeRawWriting({
        publishedAt: '2026-07-03',
        updatedAt: '2026-07-02',
      }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects a public writing without publishedAt', () => {
    expect(
      writingSchema.safeParse(publicWritingWithoutPublishedAt).success,
    ).toBe(false);
  });

  it('allows a draft without publishedAt', () => {
    const result = writingSchema.safeParse(
      makeRawWriting({ draft: true, publishedAt: undefined }),
    );
    expect(result.success).toBe(true);
  });

  it('rejects featured drafts and featured archived writings', () => {
    expect(writingSchema.safeParse(featuredDraftWriting).success).toBe(false);
    expect(writingSchema.safeParse(featuredArchivedWriting).success).toBe(
      false,
    );
  });

  it('rejects inconsistent revised versions', () => {
    expect(writingSchema.safeParse(inconsistentRevisedWriting).success).toBe(
      false,
    );
  });

  it('validates semantic versions and normalized unique tags', () => {
    expect(
      writingSchema.safeParse(makeRawWriting({ version: 'v1' })).success,
    ).toBe(false);
    expect(
      writingSchema.safeParse(
        makeRawWriting({ tags: ['Research', ' research '] }),
      ).success,
    ).toBe(false);
  });

  it('validates structured references and revision notes', () => {
    const valid = writingSchema.safeParse(
      makeRawWriting({
        references: [
          {
            id: 'source-one',
            title: 'Source One',
            url: 'https://example.com/source',
            accessedAt: '2026-07-02',
          },
        ],
        revisionNotes: [
          {
            version: '1.0.1',
            date: '2026-07-02',
            summary: 'A bounded correction.',
          },
        ],
        version: '1.0.1',
      }),
    );
    const invalid = writingSchema.safeParse(
      makeRawWriting({
        references: [{ id: 'bad id', title: 'No provenance' }],
      }),
    );

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});
