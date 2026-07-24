import { makeRawWriting } from '../factories';

export const malformedCanonicalId = 'Malformed ID';

export const invalidDateWriting = makeRawWriting({
  updatedAt: 'not-an-iso-date',
});

export const publicWritingWithoutPublishedAt = makeRawWriting({
  publishedAt: undefined,
});

export const featuredDraftWriting = makeRawWriting({
  draft: true,
  featured: true,
});

export const featuredArchivedWriting = makeRawWriting({
  status: 'archived',
  featured: true,
});

export const inconsistentRevisedWriting = makeRawWriting({
  status: 'revised',
  version: '1.2.0',
  revisionNotes: [
    {
      version: '1.1.0',
      date: '2026-07-02',
      summary: 'The note does not match the current version.',
    },
  ],
});
