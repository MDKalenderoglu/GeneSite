import { describe, expect, it } from 'vitest';
import {
  getContentTypeLabel,
  getEpistemicStatusLabel,
  getPublicationStatusLabel,
} from '../src/lib/labels';
import {
  CONTENT_TYPES,
  EPISTEMIC_STATUSES,
  PUBLICATION_STATUSES,
} from '../src/lib/writing-schema';

describe('centralized writing labels', () => {
  it('provides Turkish and English publication labels', () => {
    const turkish = PUBLICATION_STATUSES.map((status) =>
      getPublicationStatusLabel(status, 'tr'),
    );
    const english = PUBLICATION_STATUSES.map((status) =>
      getPublicationStatusLabel(status, 'en'),
    );

    expect(turkish).toEqual([
      'Tohum',
      'Gelişmekte',
      'Yayımlandı',
      'Gözden geçirildi',
      'Arşivlendi',
    ]);
    expect(english).toEqual([
      'Seed',
      'Developing',
      'Published',
      'Revised',
      'Archived',
    ]);
  });

  it('provides Turkish and English epistemic labels', () => {
    const turkish = EPISTEMIC_STATUSES.map((status) =>
      getEpistemicStatusLabel(status, 'tr'),
    );
    const english = EPISTEMIC_STATUSES.map((status) =>
      getEpistemicStatusLabel(status, 'en'),
    );

    expect(turkish).toEqual([
      'Yerleşik',
      'İnceleme',
      'Yorum',
      'Hipotez',
      'Spekülatif',
    ]);
    expect(english).toEqual([
      'Established',
      'Review',
      'Interpretation',
      'Hypothesis',
      'Speculative',
    ]);
  });

  it('provides Turkish and English labels for every content type', () => {
    expect(
      CONTENT_TYPES.map((type) => getContentTypeLabel(type, 'tr')),
    ).toEqual([
      'Beyaz kitap',
      'Deneme',
      'Araştırma notu',
      'Açık soru',
      'Teori',
      'Düşünce deneyi',
    ]);
    expect(
      CONTENT_TYPES.map((type) => getContentTypeLabel(type, 'en')),
    ).toEqual([
      'Whitepaper',
      'Essay',
      'Research note',
      'Open question',
      'Theory',
      'Thought experiment',
    ]);
  });
});
