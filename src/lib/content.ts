import type { CollectionEntry } from 'astro:content';
import {
  assertValidWritingEntries,
  type NormalizedWritingEntry,
} from './content-validation';

export type WritingEntry = CollectionEntry<'writings'>;

export function isPublicWriting(entry: NormalizedWritingEntry): boolean {
  return entry.data.draft === false;
}

export function isDiscoverableWriting(entry: NormalizedWritingEntry): boolean {
  return isPublicWriting(entry) && entry.data.status !== 'archived';
}

export function isIndexableWriting(entry: NormalizedWritingEntry): boolean {
  return isPublicWriting(entry) && entry.data.status !== 'archived';
}

export async function loadValidatedWritings(): Promise<WritingEntry[]> {
  const { getCollection } = await import('astro:content');
  const entries = await getCollection('writings');
  assertValidWritingEntries(entries);
  return entries.toSorted((left, right) => left.id.localeCompare(right.id));
}

export async function getPublicWritings(): Promise<WritingEntry[]> {
  return (await loadValidatedWritings()).filter(isPublicWriting);
}

export async function getDiscoverableWritings(): Promise<WritingEntry[]> {
  return (await loadValidatedWritings()).filter(isDiscoverableWriting);
}

export async function getIndexableWritings(): Promise<WritingEntry[]> {
  return (await loadValidatedWritings()).filter(isIndexableWriting);
}

export function getPublicRelatedWritings(
  entry: NormalizedWritingEntry,
  allEntries: readonly WritingEntry[],
): WritingEntry[] {
  const entriesById = new Map(
    allEntries.map((candidate) => [candidate.id, candidate]),
  );

  return entry.data.relatedWritings
    .map((id) => entriesById.get(id))
    .filter(
      (candidate): candidate is WritingEntry =>
        candidate !== undefined && isPublicWriting(candidate),
    );
}
