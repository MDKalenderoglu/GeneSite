import { describe, expect, it } from 'vitest';
import {
  getPublicRelatedWritings,
  isDiscoverableWriting,
  isIndexableWriting,
  isPublicWriting,
  type WritingEntry,
} from '../src/lib/content';
import { makeEntry } from './fixtures/factories';

describe('writing visibility selectors', () => {
  it('never treats a draft as public, discoverable, or indexable', () => {
    const draft = makeEntry('draft', {
      draft: true,
      publishedAt: undefined,
    });

    expect(isPublicWriting(draft)).toBe(false);
    expect(isDiscoverableWriting(draft)).toBe(false);
    expect(isIndexableWriting(draft)).toBe(false);
  });

  it('keeps an archived writing public but not discoverable or indexable', () => {
    const archived = makeEntry('archived', { status: 'archived' });

    expect(isPublicWriting(archived)).toBe(true);
    expect(isDiscoverableWriting(archived)).toBe(false);
    expect(isIndexableWriting(archived)).toBe(false);
  });

  it('omits draft relations from public rendering results', () => {
    const source = makeEntry('source', {
      relatedWritings: ['public-target', 'draft-target'],
    });
    const publicTarget = makeEntry('public-target');
    const draftTarget = makeEntry('draft-target', {
      draft: true,
      publishedAt: undefined,
    });

    const related = getPublicRelatedWritings(source, [
      source,
      publicTarget,
      draftTarget,
    ] as WritingEntry[]);

    expect(related.map(({ id }) => id)).toEqual(['public-target']);
  });
});
