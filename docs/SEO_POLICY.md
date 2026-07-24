# SEO policy

## Objective

Search support exists to make durable ideas findable and citable, not to chase
traffic. Metadata must accurately represent the writing and may not exaggerate
certainty, novelty, or authority.

## Indexing rules

- Public, non-archived writings are indexable.
- Drafts produce no public page and appear nowhere in sitemaps, feeds, taxonomy,
  related lists, or metadata.
- Archived writings retain their URL but emit `noindex,follow`.
- Thin utility pages, previews, and duplicate filter states emit `noindex`.
- Type and tag pages are indexable only when they have a useful introduction and
  enough public content to stand alone.

## Canonical URLs

Every indexable page emits one absolute canonical URL using the production site
origin and normalized trailing-slash policy. Tracking or filter parameters,
preview origins, and alternate navigation paths canonicalize to the stable page.
Slug changes require permanent redirects from every previously public URL.

## Page metadata

Each writing supplies:

- A unique HTML title derived from writing title and site name.
- Its frontmatter description as the meta description.
- Canonical URL.
- Open Graph type, title, description, URL, locale, and preview image.
- Equivalent social-card metadata.
- Published and modified timestamps when valid.
- Author/site identity from centralized site data.

Descriptions must be written for human comprehension, remain accurate out of
context, and not be stuffed with keywords. Social images must preserve readable
contrast and should be generated from stable templates, not individually
hand-designed by default.

## Structured data

Writing pages should emit valid JSON-LD using the closest supported `schema.org`
type, normally `Article`, `ScholarlyArticle`, or `CreativeWork`. Include
headline, description, author, in-language, dates, version, canonical URL,
keywords, and citations where mappings are reliable. Do not invent properties or
overstate peer review, scholarly publication, or institutional affiliation.

Breadcrumb structured data is appropriate where the visible page contains the
same breadcrumb hierarchy.

## Sitemap, feeds, and robots

- Generate an XML sitemap from canonical, indexable static routes.
- Generate one RSS or Atom feed for public, non-archived writings.
- Feed ordering uses `updatedAt`, while clearly retaining original
  `publishedAt`.
- Feed entries link to canonical URLs and include type and status.
- `robots.txt` points to the sitemap and does not attempt to protect secrets.

Draft safety comes from exclusion at build time, not from `robots.txt`.

## Internationalization

Set the HTML `lang` attribute from each entry. Translations are separate,
explicitly related entries. Add `hreflang` only when reliable translation pairs
and language-specific canonical URLs exist; do not infer alternates from tags.

## Content quality

Headings must form a descriptive hierarchy. Link text should name its
destination. Images require meaningful filenames, dimensions, and alt text.
Substantive figures need captions and provenance. Reference links should prefer
stable source URLs.

## Verification

The build and release process should verify:

- One indexable canonical URL per page.
- Unique titles and nonempty descriptions.
- No draft URLs or metadata in the output.
- Correct archive directives.
- Valid sitemap/feed XML and JSON-LD syntax.
- No broken internal links or unresolved redirect chains.
- Social-card rendering on representative content lengths and languages.
