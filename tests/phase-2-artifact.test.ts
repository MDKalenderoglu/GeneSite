import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '..');
const output = (...segments: string[]) =>
  resolve(projectRoot, 'dist', ...segments);

function readPage(id?: string): string {
  return readFileSync(
    id ? output('writings', id, 'index.html') : output('index.html'),
    'utf8',
  );
}

function readGeneratedCss(): string {
  const assetDirectory = output('_astro');
  return readdirSync(assetDirectory)
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(resolve(assetDirectory, file), 'utf8'))
    .join('\n');
}

describe('Phase 2 reading artifact', () => {
  it('renders the correct page language and shared landmarks', () => {
    const turkish = readPage('evidence-map');
    const english = readPage('counterfactual-boundary');

    expect(turkish).toContain('<html lang="tr">');
    expect(english).toContain('<html lang="en">');

    for (const page of [turkish, english]) {
      expect(page).toContain('class="skip-link" href="#main-content"');
      expect(page).toContain('<header class="site-header">');
      expect(page).toContain('<main class="site-main" id="main-content"');
      expect(page).toContain('<article class="writing wide-shell"');
      expect(page).toContain('<footer class="site-footer">');
      expect(page).toMatch(
        /<link rel="stylesheet" href="[^"]+" media="print">/,
      );
      expect(page.match(/<h1(?:\s|>)/g)).toHaveLength(1);
    }
  });

  it('keeps the representative writing heading hierarchy coherent', () => {
    const page = readPage('evidence-map');
    const levels = [...page.matchAll(/<h([1-6])(?:\s|>)/g)].map((match) =>
      Number(match[1]),
    );

    expect(levels[0]).toBe(1);
    for (let index = 1; index < levels.length; index += 1) {
      expect(levels[index]).toBeLessThanOrEqual(levels[index - 1] + 1);
    }
  });

  it('renders archived state and visibly marks an archived relation', () => {
    const archivedPage = readPage('archived-observation');
    const relatedPage = readPage('open-measurement-question');

    expect(archivedPage).toContain('data-archive-notice');
    expect(archivedPage).toContain('Arşivlenmiş yazı');
    expect(relatedPage).toContain(
      'data-related-writing-id="archived-observation" data-archived="true"',
    );
    expect(relatedPage).toContain(
      '<span class="archived-marker">Arşivlenmiş</span>',
    );
  });

  it('renders structured DOI and URL references with stable anchors', () => {
    const page = readPage('evidence-map');

    expect(page).toContain('id="reference-astro-content"');
    expect(page).toContain(
      'href="https://docs.astro.build/en/reference/modules/astro-content/"',
    );
    expect(page).toContain('data-reference-url');
    expect(page).toContain('id="reference-example-doi"');
    expect(page).toContain('href="https://doi.org/10.1000/182"');
    expect(page).toContain('data-reference-doi');
  });

  it('renders revision version, localized date, and summary', () => {
    const page = readPage('revision-as-method');

    expect(page).toContain('data-revision-history');
    expect(page).toContain('Güncel sürüm:');
    expect(page).toContain('v1.1.0');
    expect(page).toContain('20 Temmuz 2026');
    expect(page).toContain('Revizyon geçmişinin amacı daha açık tanımlandı.');
  });

  it('retains draft-relation protection in the upgraded page', () => {
    const page = readPage('evidence-map');

    expect(page).toContain('data-related-writing-id="revision-as-method"');
    expect(page).not.toContain('seed-theory-draft');
  });

  it('renders a named, keyboard-focusable native table scroll region', () => {
    const page = readPage('evidence-map');
    const scrollRegion = page.match(
      /<div\s+class="table-scroll-region"[^>]*>/,
    )?.[0];

    expect(scrollRegion).toBeDefined();
    expect(scrollRegion).toContain('role="region"');
    expect(scrollRegion).toContain(
      'aria-labelledby="evidence-classes-caption"',
    );
    expect(scrollRegion).toContain('tabindex="0"');
    expect(page).toContain('<table>');
    expect(page).toContain('<caption id="evidence-classes-caption">');
    expect(page).toContain('<thead>');
    expect(page).toContain('<tbody>');
    expect(page).toContain('<th scope="col">');
    expect(page).toContain('<th scope="row">');
    expect(page).toContain('<td>');
  });

  it('emits focus, responsive-width, and local overflow safeguards', () => {
    const css = readGeneratedCss();

    expect(css).toContain(':focus-visible');
    expect(css).toContain('--width-prose:70ch');
    expect(css).toMatch(
      /\.prose\{[^}]*width:min\(100%,\s*var\(--width-prose\)\)/,
    );
    expect(css).toMatch(/\.prose pre\{[^}]*overflow-x:auto/);
    expect(css).toMatch(/\.prose \.table-scroll-region\{[^}]*overflow-x:auto/);
    expect(css).not.toMatch(/\.prose table\{[^}]*overflow-x:auto/);
    expect(css).toMatch(
      /\.prose \.table-scroll-region:focus-visible\{[^}]*outline:3px solid var\(--color-focus\)/,
    );
    expect(css).toMatch(/body\{[^}]*min-width:0/);
    expect(css).toMatch(/body\{[^}]*font-size:var\(--text-body\)/);
    expect(css).toMatch(/img,svg,video\{[^}]*max-width:100%/);
    expect(css).toContain('@media (width>=44rem)');
    expect(css).toContain('@media print');
    expect(css).toMatch(/\.prose \.table-scroll-region\{[^}]*overflow:visible/);
    expect(css).toMatch(
      /\.prose table\{[^}]*display:table[^}]*overflow:visible/,
    );
  });
});
