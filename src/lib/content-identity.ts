export const CANONICAL_WRITING_ID_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export const RESERVED_WRITING_IDS = new Set(['index']);

export interface WritingIdGenerationOptions {
  /** Source path relative to the glob loader's base directory. */
  entry: string;
  /** Glob loader base URL. Retained for compatibility with Astro's callback. */
  base: URL;
  /** Parsed, unvalidated frontmatter. */
  data: Record<string, unknown>;
}

function normalizeSourcePath(entry: string): string {
  return entry.replaceAll('\\', '/').replace(/^\.\/+/, '');
}

function slugifyPathSegment(segment: string): string {
  return segment
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function deriveWritingIdFromPath(entry: string): string {
  const sourcePath = normalizeSourcePath(entry);
  const pathWithoutExtension = sourcePath.replace(/\.mdx?$/i, '');
  return pathWithoutExtension.split('/').map(slugifyPathSegment).join('/');
}

export function assertCanonicalWritingId(id: string, sourcePath: string): void {
  if (!CANONICAL_WRITING_ID_PATTERN.test(id)) {
    throw new Error(
      `Invalid canonical writing ID "${id}" for source "${sourcePath}". ` +
        'IDs must use lowercase ASCII letters, digits, single hyphens, and optional path segments.',
    );
  }

  if (RESERVED_WRITING_IDS.has(id)) {
    throw new Error(
      `Reserved canonical writing ID "${id}" cannot be used by source "${sourcePath}".`,
    );
  }
}

function resolveCandidateId(
  sourcePath: string,
  data: Record<string, unknown>,
): string {
  const rawSlug = data.slug;

  if (rawSlug === undefined) {
    return deriveWritingIdFromPath(sourcePath);
  }

  if (typeof rawSlug !== 'string') {
    throw new Error(
      `Invalid frontmatter slug for source "${sourcePath}". Expected a string.`,
    );
  }

  return rawSlug;
}

export function createWritingIdGenerator() {
  const sourceToId = new Map<string, string>();
  const idToSource = new Map<string, string>();

  return ({ entry, data }: WritingIdGenerationOptions): string => {
    const sourcePath = normalizeSourcePath(entry);
    const canonicalId = resolveCandidateId(sourcePath, data);
    assertCanonicalWritingId(canonicalId, sourcePath);

    const currentOwner = idToSource.get(canonicalId);
    if (currentOwner !== undefined && currentOwner !== sourcePath) {
      throw new Error(
        `Duplicate canonical writing ID "${canonicalId}" resolved from both ` +
          `"${currentOwner}" and "${sourcePath}".`,
      );
    }

    const previousId = sourceToId.get(sourcePath);
    if (
      previousId !== undefined &&
      previousId !== canonicalId &&
      idToSource.get(previousId) === sourcePath
    ) {
      idToSource.delete(previousId);
    }

    sourceToId.set(sourcePath, canonicalId);
    idToSource.set(canonicalId, sourcePath);

    return canonicalId;
  };
}
