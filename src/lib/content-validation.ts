import {
  CANONICAL_WRITING_ID_PATTERN,
  RESERVED_WRITING_IDS,
} from './content-identity';
import type { WritingData } from './writing-schema';

export interface NormalizedWritingEntry {
  id: string;
  data: WritingData;
}

export interface ContentValidationIssue {
  code: string;
  entryId: string;
  path?: string;
  message: string;
}

function issue(
  code: string,
  entryId: string,
  message: string,
  path?: string,
): ContentValidationIssue {
  return { code, entryId, message, path };
}

export function validateWritingEntries(
  entries: readonly NormalizedWritingEntry[],
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const entriesById = new Map<string, NormalizedWritingEntry>();

  for (const entry of entries) {
    if (!CANONICAL_WRITING_ID_PATTERN.test(entry.id)) {
      issues.push(
        issue(
          'invalid-id',
          entry.id,
          'Canonical writing IDs must be lowercase, hyphenated path segments',
          'id',
        ),
      );
    }

    if (RESERVED_WRITING_IDS.has(entry.id)) {
      issues.push(
        issue(
          'reserved-id',
          entry.id,
          'Canonical writing ID collides with a reserved route',
          'id',
        ),
      );
    }

    if (entriesById.has(entry.id)) {
      issues.push(
        issue(
          'duplicate-id',
          entry.id,
          'Canonical writing IDs must be unique',
          'id',
        ),
      );
    } else {
      entriesById.set(entry.id, entry);
    }
  }

  for (const entry of entries) {
    const { data } = entry;
    const seenRelationships = new Set<string>();

    for (const [index, relatedId] of data.relatedWritings.entries()) {
      if (!entriesById.has(relatedId)) {
        issues.push(
          issue(
            'missing-relationship',
            entry.id,
            `Related writing "${relatedId}" does not exist`,
            `relatedWritings.${index}`,
          ),
        );
      }

      if (relatedId === entry.id) {
        issues.push(
          issue(
            'self-relationship',
            entry.id,
            'A writing cannot relate to itself',
            `relatedWritings.${index}`,
          ),
        );
      }

      if (seenRelationships.has(relatedId)) {
        issues.push(
          issue(
            'duplicate-relationship',
            entry.id,
            `Related writing "${relatedId}" is duplicated`,
            `relatedWritings.${index}`,
          ),
        );
      }
      seenRelationships.add(relatedId);
    }

    if (
      data.publishedAt &&
      data.updatedAt.getTime() < data.publishedAt.getTime()
    ) {
      issues.push(
        issue(
          'date-order',
          entry.id,
          'updatedAt cannot be before publishedAt',
          'updatedAt',
        ),
      );
    }

    if (!data.draft && !data.publishedAt) {
      issues.push(
        issue(
          'missing-publication-date',
          entry.id,
          'Public writings require publishedAt',
          'publishedAt',
        ),
      );
    }

    if (data.featured && data.draft) {
      issues.push(
        issue(
          'featured-draft',
          entry.id,
          'A draft cannot be featured',
          'featured',
        ),
      );
    }

    if (data.featured && data.status === 'archived') {
      issues.push(
        issue(
          'featured-archived',
          entry.id,
          'An archived writing cannot be featured',
          'featured',
        ),
      );
    }

    if (data.status === 'revised') {
      const latestRevision = data.revisionNotes.at(-1);
      if (!latestRevision || latestRevision.version !== data.version) {
        issues.push(
          issue(
            'revision-version-mismatch',
            entry.id,
            'The latest revision note must match the current version',
            'revisionNotes',
          ),
        );
      }
    }

    const seenReferenceIds = new Set<string>();
    for (const [index, reference] of data.references.entries()) {
      if (seenReferenceIds.has(reference.id)) {
        issues.push(
          issue(
            'duplicate-reference-id',
            entry.id,
            `Reference ID "${reference.id}" is duplicated`,
            `references.${index}.id`,
          ),
        );
      }
      seenReferenceIds.add(reference.id);
    }
  }

  return issues;
}

export function assertValidWritingEntries(
  entries: readonly NormalizedWritingEntry[],
): void {
  const issues = validateWritingEntries(entries);
  if (issues.length === 0) return;

  const details = issues
    .map(
      ({ entryId, path, message }) =>
        `- ${entryId}${path ? ` (${path})` : ''}: ${message}`,
    )
    .join('\n');

  throw new Error(`Writing content validation failed:\n${details}`);
}
