import { describe, expect, it } from 'vitest';
import {
  createWritingIdGenerator,
  deriveWritingIdFromPath,
} from '../src/lib/content-identity';

const base = new URL('file:///project/src/content/writings/');

function generate(
  generator: ReturnType<typeof createWritingIdGenerator>,
  entry: string,
  slug?: unknown,
): string {
  return generator({
    entry,
    base,
    data: slug === undefined ? {} : { slug },
  });
}

describe('writing ID generator', () => {
  it('uses a valid explicit frontmatter slug', () => {
    const generator = createWritingIdGenerator();
    expect(generate(generator, 'notes/source.md', 'stable-writing')).toBe(
      'stable-writing',
    );
  });

  it('derives a deterministic canonical ID from the relative source path', () => {
    expect(deriveWritingIdFromPath('Research/My Draft.mdx')).toBe(
      'research/my-draft',
    );

    const generator = createWritingIdGenerator();
    expect(generate(generator, 'Research/My Draft.mdx')).toBe(
      'research/my-draft',
    );
  });

  it('rejects malformed and reserved explicit slugs', () => {
    const generator = createWritingIdGenerator();
    expect(() => generate(generator, 'bad.md', 'Bad ID')).toThrow(
      /Invalid canonical writing ID "Bad ID".*"bad\.md"/,
    );
    expect(() => generate(generator, 'reserved.md', 'index')).toThrow(
      /Reserved canonical writing ID "index".*"reserved\.md"/,
    );
  });

  it('rejects two different source paths using the same explicit slug', () => {
    const generator = createWritingIdGenerator();
    generate(generator, 'first.md', 'shared-id');

    expect(() => generate(generator, 'second.mdx', 'shared-id')).toThrow(
      /Duplicate canonical writing ID "shared-id".*"first\.md".*"second\.mdx"/,
    );
  });

  it('allows the same source path to be reprocessed', () => {
    const generator = createWritingIdGenerator();

    expect(generate(generator, 'same.md', 'same-id')).toBe('same-id');
    expect(generate(generator, 'same.md', 'same-id')).toBe('same-id');
  });

  it('updates ownership when one source changes its slug', () => {
    const generator = createWritingIdGenerator();

    expect(generate(generator, 'mutable.md', 'previous-id')).toBe(
      'previous-id',
    );
    expect(generate(generator, 'mutable.md', 'current-id')).toBe('current-id');
  });

  it('releases a previous ID but protects the current ID after a change', () => {
    const generator = createWritingIdGenerator();
    generate(generator, 'mutable.md', 'previous-id');

    expect(() =>
      generate(generator, 'contender-before-change.md', 'previous-id'),
    ).toThrow(/Duplicate canonical writing ID "previous-id"/);

    generate(generator, 'mutable.md', 'current-id');

    expect(generate(generator, 'new-owner.md', 'previous-id')).toBe(
      'previous-id',
    );
    expect(() =>
      generate(generator, 'contender-after-change.md', 'current-id'),
    ).toThrow(/Duplicate canonical writing ID "current-id"/);
  });
});
