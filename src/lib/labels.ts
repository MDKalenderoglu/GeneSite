import type { WritingData } from './writing-schema';

export type WritingLanguage = WritingData['language'];
export type ContentType = WritingData['type'];
export type PublicationStatus = WritingData['status'];
export type EpistemicStatus = WritingData['epistemicStatus'];

const CONTENT_TYPE_LABELS: Record<
  WritingLanguage,
  Record<ContentType, string>
> = {
  tr: {
    whitepaper: 'Beyaz kitap',
    essay: 'Deneme',
    note: 'Araştırma notu',
    question: 'Açık soru',
    theory: 'Teori',
    'thought-experiment': 'Düşünce deneyi',
  },
  en: {
    whitepaper: 'Whitepaper',
    essay: 'Essay',
    note: 'Research note',
    question: 'Open question',
    theory: 'Theory',
    'thought-experiment': 'Thought experiment',
  },
};

const PUBLICATION_STATUS_LABELS: Record<
  WritingLanguage,
  Record<PublicationStatus, string>
> = {
  tr: {
    seed: 'Tohum',
    developing: 'Gelişmekte',
    published: 'Yayımlandı',
    revised: 'Gözden geçirildi',
    archived: 'Arşivlendi',
  },
  en: {
    seed: 'Seed',
    developing: 'Developing',
    published: 'Published',
    revised: 'Revised',
    archived: 'Archived',
  },
};

const EPISTEMIC_STATUS_LABELS: Record<
  WritingLanguage,
  Record<EpistemicStatus, string>
> = {
  tr: {
    established: 'Yerleşik',
    review: 'İnceleme',
    interpretation: 'Yorum',
    hypothesis: 'Hipotez',
    speculative: 'Spekülatif',
  },
  en: {
    established: 'Established',
    review: 'Review',
    interpretation: 'Interpretation',
    hypothesis: 'Hypothesis',
    speculative: 'Speculative',
  },
};

const LANGUAGE_LABELS: Record<
  WritingLanguage,
  Record<WritingLanguage, string>
> = {
  tr: {
    tr: 'Türkçe',
    en: 'İngilizce',
  },
  en: {
    tr: 'Turkish',
    en: 'English',
  },
};

export const UI_LABELS = {
  tr: {
    skipToContent: 'Ana içeriğe geç',
    primaryNavigation: 'Ana gezinme',
    home: 'Ana sayfa',
    siteDescription: 'Bağımsız araştırma ve düşünce yazıları',
    breadcrumb: 'Sayfa konumu',
    writing: 'Yazı',
    publicationStatus: 'Yayın durumu',
    epistemicStatus: 'Epistemik durum',
    publishedAt: 'Yayımlanma',
    updatedAt: 'Güncellenme',
    version: 'Sürüm',
    language: 'Dil',
    archiveHeading: 'Arşivlenmiş yazı',
    archiveMessage:
      'Bu yazı silinmemiştir; düşünsel geçmişi korumak için arşivlenmiştir ve artık etkin çalışma olarak sunulmamaktadır.',
    references: 'Kaynaklar',
    authors: 'Yazarlar',
    container: 'Yayın',
    publisher: 'Yayınevi',
    publicationDate: 'Yayın tarihi',
    doi: 'DOI',
    url: 'Kaynak bağlantısı',
    accessDate: 'Erişim tarihi',
    referenceNote: 'Not',
    revisionHistory: 'Revizyon geçmişi',
    currentVersion: 'Güncel sürüm',
    relatedWritings: 'İlgili yazılar',
    tags: 'Konular',
    archivedShort: 'Arşivlenmiş',
    readWriting: 'Yazıyı oku',
    footerStatement: 'Düşüncenin gelişimini görünür kılan bağımsız yazılar.',
    homeKicker: 'Bağımsız araştırma not defteri',
    homeTitle: 'Düşüncenin gelişimini görünür kılan yazılar.',
    homeDescription:
      'GeneSite; araştırma, yorum, hipotez ve spekülasyonu birbirine karıştırmadan uzun biçimli düşünceyi yayımlar.',
    selectedWritings: 'Okuma seçkisi',
    selectedWritingsDescription:
      'Farklı bilgi durumları ve yazı biçimleri arasında seçilmiş çalışmalar.',
  },
  en: {
    skipToContent: 'Skip to main content',
    primaryNavigation: 'Primary navigation',
    home: 'Home',
    siteDescription: 'Independent research and reflective writing',
    breadcrumb: 'Breadcrumb',
    writing: 'Writing',
    publicationStatus: 'Publication status',
    epistemicStatus: 'Epistemic status',
    publishedAt: 'Published',
    updatedAt: 'Updated',
    version: 'Version',
    language: 'Language',
    archiveHeading: 'Archived writing',
    archiveMessage:
      'This writing has not been deleted. It is retained for intellectual provenance and is no longer presented as active work.',
    references: 'References',
    authors: 'Authors',
    container: 'Container',
    publisher: 'Publisher',
    publicationDate: 'Publication date',
    doi: 'DOI',
    url: 'Source link',
    accessDate: 'Accessed',
    referenceNote: 'Note',
    revisionHistory: 'Revision history',
    currentVersion: 'Current version',
    relatedWritings: 'Related writings',
    tags: 'Topics',
    archivedShort: 'Archived',
    readWriting: 'Read writing',
    footerStatement:
      'Independent writing that makes the development of thought visible.',
    homeKicker: 'Independent research notebook',
    homeTitle: 'Writing that makes the development of thought visible.',
    homeDescription:
      'GeneSite publishes long-form thought while keeping research, interpretation, hypothesis, and speculation distinct.',
    selectedWritings: 'Selected writings',
    selectedWritingsDescription:
      'Selected work across different knowledge states and forms of writing.',
  },
} as const;

export function getContentTypeLabel(
  type: ContentType,
  language: WritingLanguage,
): string {
  return CONTENT_TYPE_LABELS[language][type];
}

export function getPublicationStatusLabel(
  status: PublicationStatus,
  language: WritingLanguage,
): string {
  return PUBLICATION_STATUS_LABELS[language][status];
}

export function getEpistemicStatusLabel(
  status: EpistemicStatus,
  language: WritingLanguage,
): string {
  return EPISTEMIC_STATUS_LABELS[language][status];
}

export function getLanguageLabel(
  writingLanguage: WritingLanguage,
  interfaceLanguage: WritingLanguage,
): string {
  return LANGUAGE_LABELS[interfaceLanguage][writingLanguage];
}

export function getUiLabels(language: WritingLanguage) {
  return UI_LABELS[language];
}

export function formatWritingDate(
  date: Date,
  language: WritingLanguage,
): string {
  return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
