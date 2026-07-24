import { z } from 'astro/zod';

export const CONTENT_TYPES = [
  'whitepaper',
  'essay',
  'note',
  'question',
  'theory',
  'thought-experiment',
] as const;

export const PUBLICATION_STATUSES = [
  'seed',
  'developing',
  'published',
  'revised',
  'archived',
] as const;

export const EPISTEMIC_STATUSES = [
  'established',
  'review',
  'interpretation',
  'hypothesis',
  'speculative',
] as const;

export const WRITING_LANGUAGES = ['tr', 'en'] as const;

export const SEMANTIC_VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const REFERENCE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/i;

const shortText = (maximum: number) => z.string().trim().min(1).max(maximum);

const frontmatterDate = z
  .union([z.date(), z.iso.date(), z.iso.datetime({ offset: true })])
  .pipe(z.coerce.date());

const semanticVersion = z
  .string()
  .trim()
  .regex(SEMANTIC_VERSION_PATTERN, 'Expected a MAJOR.MINOR.PATCH version');

const tag = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(48)
  .regex(TAG_PATTERN, 'Tags must be lowercase, hyphenated identifiers');

export const writingReferenceSchema = z
  .object({
    id: z
      .string()
      .trim()
      .toLowerCase()
      .min(1)
      .max(64)
      .regex(REFERENCE_ID_PATTERN, 'Invalid reference ID'),
    title: shortText(240),
    authors: z.array(shortText(120)).max(30).optional(),
    container: shortText(160).optional(),
    publisher: shortText(160).optional(),
    publishedAt: frontmatterDate.optional(),
    url: z.string().trim().pipe(z.url()).optional(),
    doi: z.string().trim().regex(DOI_PATTERN, 'Invalid DOI').optional(),
    accessedAt: frontmatterDate.optional(),
    note: shortText(400).optional(),
  })
  .superRefine((reference, context) => {
    const hasProvenance =
      (reference.authors?.length ?? 0) > 0 ||
      reference.container !== undefined ||
      reference.publisher !== undefined ||
      reference.url !== undefined ||
      reference.doi !== undefined;

    if (!hasProvenance) {
      context.addIssue({
        code: 'custom',
        message:
          'A reference needs authors, a container, a publisher, a URL, or a DOI',
      });
    }

    if (reference.url && !reference.doi && !reference.accessedAt) {
      context.addIssue({
        code: 'custom',
        path: ['accessedAt'],
        message: 'A changeable web reference requires an access date',
      });
    }

    if (
      reference.publishedAt &&
      reference.accessedAt &&
      reference.accessedAt < reference.publishedAt
    ) {
      context.addIssue({
        code: 'custom',
        path: ['accessedAt'],
        message: 'A reference cannot be accessed before it was published',
      });
    }
  });

export const revisionNoteSchema = z.object({
  version: semanticVersion,
  date: frontmatterDate,
  summary: shortText(400),
});

export const writingSchema = z
  .object({
    title: shortText(120),
    description: shortText(240),
    type: z.enum(CONTENT_TYPES),
    status: z.enum(PUBLICATION_STATUSES),
    epistemicStatus: z.enum(EPISTEMIC_STATUSES),
    publishedAt: frontmatterDate.optional(),
    updatedAt: frontmatterDate,
    version: semanticVersion,
    language: z.enum(WRITING_LANGUAGES),
    tags: z.array(tag).max(20),
    relatedWritings: z.array(z.string().trim().min(1)).max(50),
    references: z.array(writingReferenceSchema).max(100),
    featured: z.boolean(),
    draft: z.boolean(),
    revisionNotes: z.array(revisionNoteSchema).max(100),
  })
  .superRefine((writing, context) => {
    if (!writing.draft && !writing.publishedAt) {
      context.addIssue({
        code: 'custom',
        path: ['publishedAt'],
        message: 'Public writings require a publication date',
      });
    }

    if (
      writing.publishedAt &&
      writing.updatedAt.getTime() < writing.publishedAt.getTime()
    ) {
      context.addIssue({
        code: 'custom',
        path: ['updatedAt'],
        message: 'The update date cannot be before the publication date',
      });
    }

    if (writing.featured && writing.draft) {
      context.addIssue({
        code: 'custom',
        path: ['featured'],
        message: 'A draft cannot be featured',
      });
    }

    if (writing.featured && writing.status === 'archived') {
      context.addIssue({
        code: 'custom',
        path: ['featured'],
        message: 'An archived writing cannot be featured',
      });
    }

    const uniqueTags = new Set(writing.tags);
    if (uniqueTags.size !== writing.tags.length) {
      context.addIssue({
        code: 'custom',
        path: ['tags'],
        message: 'Tags must be unique after normalization',
      });
    }

    const seenVersions = new Set<string>();
    let previousRevisionDate: Date | undefined;
    for (const [index, note] of writing.revisionNotes.entries()) {
      if (seenVersions.has(note.version)) {
        context.addIssue({
          code: 'custom',
          path: ['revisionNotes', index, 'version'],
          message: 'Revision versions must be unique',
        });
      }
      seenVersions.add(note.version);

      if (previousRevisionDate && note.date < previousRevisionDate) {
        context.addIssue({
          code: 'custom',
          path: ['revisionNotes', index, 'date'],
          message: 'Revision notes must be ordered oldest to newest',
        });
      }
      previousRevisionDate = note.date;

      if (writing.publishedAt && note.date < writing.publishedAt) {
        context.addIssue({
          code: 'custom',
          path: ['revisionNotes', index, 'date'],
          message: 'A revision cannot predate publication',
        });
      }

      if (note.date > writing.updatedAt) {
        context.addIssue({
          code: 'custom',
          path: ['revisionNotes', index, 'date'],
          message: 'A revision cannot be newer than updatedAt',
        });
      }
    }

    if (writing.status === 'revised') {
      const latestRevision = writing.revisionNotes.at(-1);
      if (!latestRevision || latestRevision.version !== writing.version) {
        context.addIssue({
          code: 'custom',
          path: ['revisionNotes'],
          message:
            'A revised writing needs a latest revision matching its version',
        });
      }
    }
  });

export type WritingData = z.infer<typeof writingSchema>;
export type WritingReference = z.infer<typeof writingReferenceSchema>;
export type RevisionNote = z.infer<typeof revisionNoteSchema>;
