import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '..');
const output = (...segments: string[]) =>
  resolve(projectRoot, 'dist', ...segments);

describe('production artifact draft safety', () => {
  it('keeps an intentional draft in source', () => {
    const source = readFileSync(
      resolve(projectRoot, 'src/content/writings/05-theory.md'),
      'utf8',
    );

    expect(source).toContain('slug: seed-theory-draft');
    expect(source).toContain('draft: true');
  });

  it('does not generate a page or index entry for the draft', () => {
    const index = readFileSync(output('index.html'), 'utf8');

    expect(
      existsSync(output('writings', 'seed-theory-draft', 'index.html')),
    ).toBe(false);
    expect(index).not.toContain('seed-theory-draft');
  });

  it('keeps archived public writing addressable but undiscoverable', () => {
    const index = readFileSync(output('index.html'), 'utf8');

    expect(
      existsSync(output('writings', 'archived-observation', 'index.html')),
    ).toBe(true);
    expect(index).not.toContain('archived-observation');
  });

  it('omits draft relations from a generated public writing', () => {
    const writing = readFileSync(
      output('writings', 'evidence-map', 'index.html'),
      'utf8',
    );

    expect(writing).toContain('data-related-writing-id="revision-as-method"');
    expect(writing).not.toContain('seed-theory-draft');
  });

  it('renders the MDX fixture at its canonical entry ID', () => {
    const mdxPage = output('writings', 'counterfactual-boundary', 'index.html');

    expect(existsSync(mdxPage)).toBe(true);
    expect(readFileSync(mdxPage, 'utf8')).toContain('<strong>never</strong>');
  });
});
