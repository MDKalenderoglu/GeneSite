import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '..');
const output = (...segments: string[]) =>
  resolve(projectRoot, 'dist', ...segments);

const fixtureIds = [
  'evidence-map',
  'revision-as-method',
  'archived-observation',
  'open-measurement-question',
  'seed-theory-draft',
  'counterfactual-boundary',
];

describe('production cutover artifact', () => {
  it('does not publish development fixture routes', () => {
    for (const id of fixtureIds) {
      expect(existsSync(output('writings', id, 'index.html'))).toBe(false);
    }
  });

  it('does not expose fixture titles or development copy on the home page', () => {
    const index = readFileSync(output('index.html'), 'utf8');

    expect(index).not.toContain('Counterfactual Boundary');
    expect(index).not.toContain('Kanıt Haritası');
    expect(index).not.toContain('Geliştirme fixture');
    expect(index).not.toContain('Development fixture');
  });
});
