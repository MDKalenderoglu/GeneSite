import type { NormalizedWritingEntry } from '../../src/lib/content-validation';
import { writingSchema, type WritingData } from '../../src/lib/writing-schema';

export const validRawWriting = {
  title: 'Geçerli Fixture',
  description:
    'Şema ve içerik doğrulama testlerinde kullanılan geçerli geliştirme fixture verisi.',
  type: 'essay',
  status: 'published',
  epistemicStatus: 'interpretation',
  publishedAt: '2026-07-01',
  updatedAt: '2026-07-02',
  version: '1.0.0',
  language: 'tr',
  tags: ['test-fixture'],
  relatedWritings: [],
  references: [],
  featured: false,
  draft: false,
  revisionNotes: [],
} as const;

export function makeRawWriting(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    ...validRawWriting,
    tags: [...validRawWriting.tags],
    relatedWritings: [...validRawWriting.relatedWritings],
    references: [...validRawWriting.references],
    revisionNotes: [...validRawWriting.revisionNotes],
    ...overrides,
  };
}

const normalizedWriting = writingSchema.parse(makeRawWriting());

export function makeWritingData(
  overrides: Partial<WritingData> = {},
): WritingData {
  return {
    ...normalizedWriting,
    tags: [...normalizedWriting.tags],
    relatedWritings: [...normalizedWriting.relatedWritings],
    references: [...normalizedWriting.references],
    revisionNotes: [...normalizedWriting.revisionNotes],
    ...overrides,
  };
}

export function makeEntry(
  id: string,
  overrides: Partial<WritingData> = {},
): NormalizedWritingEntry {
  return {
    id,
    data: makeWritingData(overrides),
  };
}
