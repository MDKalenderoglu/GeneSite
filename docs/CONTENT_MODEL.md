# Content model

## Collection

The site has exactly one Astro content collection named `writings`. It accepts
Markdown and MDX entries. All writing kinds share a common identity, lifecycle,
epistemic vocabulary, relationship model, and publication pipeline.

The implementation belongs in `src/content.config.ts`; this document is the
normative schema specification.

## Canonical identity

Astro's glob loader assigns every writing its canonical identity as `entry.id`.
Its explicit `generateId` callback reads raw, unvalidated frontmatter before Zod
parsing. An author may provide the reserved `slug` value in Markdown or MDX
frontmatter to override the ID; otherwise the callback deterministically
normalizes the source-relative path without its `.md` or `.mdx` extension.

`slug` is loader input, not writing data:

- Do not include `slug` in the Zod collection schema.
- The loader's `generateId` callback consumes the frontmatter override before
  exposing validated entry data.
- Application code must use `entry.id`, never `entry.data.slug`.
- Routes, canonical URLs, relationships, uniqueness checks, and reserved-path
  checks all use `entry.id`.
- `relatedWritings` contains canonical writing IDs corresponding to `entry.id`.

The generator validates canonical format and reserved paths before an entry can
enter the collection. It tracks ID ownership by source path, rejects two
different source files that resolve to the same ID, and reports the duplicate ID
and both paths. Reprocessing the same source during development is allowed; if
that source changes ID, its previous ownership is released. Cross-entry
validation repeats the uniqueness check defensively after loading.

The stable-URL policy is unchanged: once an ID has been published, changing the
source filename must not change it. A deliberate ID change requires a documented
migration and redirect.

## Enumerations

### Content type

```text
whitepaper | essay | note | question | theory | thought-experiment
```

- `whitepaper`: a substantial, structured treatment with evidence and a defined
  problem or proposal.
- `essay`: a developed argument or interpretation for a broad reader.
- `note`: a bounded research observation, synthesis, or working result.
- `question`: an open problem framed to invite investigation.
- `theory`: a model or explanatory claim with scope and implications.
- `thought-experiment`: a hypothetical construction used to test intuitions or
  consequences.

### Publication status

```text
seed | developing | published | revised | archived
```

- `seed`: a compact idea made public early.
- `developing`: substantive work is still underway.
- `published`: a complete initial release.
- `revised`: a published work changed materially after release.
- `archived`: retained for provenance but no longer active or endorsed.

### Epistemic status

```text
established | review | interpretation | hypothesis | speculative
```

- `established`: primarily reports well-supported knowledge.
- `review`: synthesizes and evaluates existing sources.
- `interpretation`: offers a reasoned reading of evidence or ideas.
- `hypothesis`: advances a claim intended to be testable or falsifiable.
- `speculative`: explores a low-confidence possibility or conceptual boundary.

Epistemic status describes the writing's dominant claim, not a guarantee that
every sentence has the same confidence.

## Writing fields

| Field             | Type                      | Required      | Rules                                                               |
| ----------------- | ------------------------- | ------------- | ------------------------------------------------------------------- |
| `title`           | string                    | yes           | Plain text, trimmed, 1–120 characters                               |
| `description`     | string                    | yes           | Standalone summary, 1–240 characters                                |
| `type`            | content type              | yes           | One supported content type                                          |
| `status`          | publication status        | yes           | One supported lifecycle value                                       |
| `epistemicStatus` | epistemic status          | yes           | One supported knowledge value                                       |
| `publishedAt`     | ISO 8601 date or datetime | conditionally | Required when `draft` is false                                      |
| `updatedAt`       | ISO 8601 date or datetime | yes           | Not earlier than `publishedAt`                                      |
| `version`         | semantic version string   | yes           | `MAJOR.MINOR.PATCH`, starting at `1.0.0` for a complete publication |
| `language`        | string                    | yes           | `tr` or `en` during Phase 1; primary launch language is `tr`        |
| `tags`            | string array              | yes           | Unique normalized tags; empty is allowed                            |
| `relatedWritings` | writing ID array          | yes           | Existing canonical `entry.id` values; unique; no self-reference     |
| `references`      | reference array           | yes           | Structured sources; empty is allowed                                |
| `featured`        | boolean                   | yes           | Only true for public, non-archived entries                          |
| `draft`           | boolean                   | yes           | Sole public-output gate                                             |
| `revisionNotes`   | revision array            | yes           | Ordered release notes; empty until the first recorded change        |

All fields should be explicit in frontmatter, including empty arrays and false
booleans. Explicitness makes review and migrations safer.

## Reference object

```yaml
- id: 'stable-local-key'
  title: 'Required source title'
  authors: ['Optional Author']
  container: 'Optional journal, book, or site'
  publisher: 'Optional publisher'
  publishedAt: '2025-01-31'
  url: 'https://example.org/source'
  doi: '10.xxxx/example'
  accessedAt: '2026-07-24'
  note: 'Optional reason this source matters'
```

Required fields: `id` and `title`. At least one locator or provenance field
should be present beyond the title: author, container, publisher, URL, or DOI.
`id` must be unique within the writing and gives prose/MDX components a stable
local citation key. `accessedAt` is required for changeable web sources, but not
for a stable DOI or print source.

## Revision object

```yaml
- version: '1.1.0'
  date: '2026-08-10'
  summary: 'Clarified the central claim and added two sources.'
```

Each revision note has `version`, `date`, and a concise `summary`. Versions are
unique and sorted oldest to newest. The newest note must equal the entry's
current `version` when `status` is `revised`. Silent corrections for spelling,
formatting, or broken links may increment the patch version without forcing
`status: revised`, but must still be recorded if they change the rendered text.

## Version semantics

- `MAJOR`: the central claim, model, or scope changed incompatibly.
- `MINOR`: substantial evidence, sections, or reasoning were added or revised.
- `PATCH`: corrections that do not alter the central claim.

Seeds may start below `1.0.0` (for example `0.1.0`). A writing that first
reaches `published` normally becomes `1.0.0`. Version numbers do not replace
dates.

## Canonical IDs, slug overrides, and tags

Canonical IDs may contain lowercase letters, digits, and single hyphens within
slash-separated segments. They cannot start or end with a hyphen or collide with
collection-local static paths such as `index`. Frontmatter `slug` overrides and
path-derived fallbacks must produce IDs in the same format. The canonical
pattern, reserved IDs, fallback normalization, and ownership rules live together
in `src/lib/content-identity.ts`.

Tags use a controlled, lowercase, hyphenated vocabulary. Tags describe topics,
not type, status, language, year, or epistemic status; those have dedicated
fields. Synonyms should resolve to one canonical tag.

## Publication visibility

`draft` is intentionally independent from both statuses:

- `draft: true`: never generate a public detail page, index entry, feed item,
  sitemap entry, taxonomy contribution, metadata artifact, or relationship card.
- `draft: false`: public, regardless of maturity; seed and developing work may
  therefore be openly visible.
- `status: archived`: retain the permalink and revision context, show an archive
  notice, remove from ordinary discovery and feeds, and emit `noindex`.
- `featured: true`: allowed only when `draft: false` and not archived.

The build must fail if a public entry lacks `publishedAt`. Filtering drafts only
in templates is insufficient; shared selectors must enforce visibility.

## Relationship behavior

`relatedWritings` is an explicit editorial relationship between canonical
`entry.id` values, not an algorithmic recommendation. Relations may cross
content types and need not be reciprocal, though reciprocal links are encouraged
when useful. A relation to a draft is valid during authoring, but the draft must
be omitted from the public entry's rendered related list until published.

## Example frontmatter

This example is illustrative and is not an application file:

```yaml
---
title: 'A Useful Uncertainty'
description:
  'A working model for distinguishing missing evidence from unstable
  assumptions.'
slug: 'useful-uncertainty'
type: 'essay'
status: 'developing'
epistemicStatus: 'interpretation'
publishedAt: '2026-07-24'
updatedAt: '2026-07-24'
version: '0.3.0'
language: 'en'
tags: ['epistemology', 'research-methods']
relatedWritings: []
references: []
featured: false
draft: false
revisionNotes: []
---
```

Here `slug` is an optional Astro loader override. It is intentionally absent
from the Zod writing-data schema and becomes the entry's canonical `entry.id`.

## Schema evolution

Adding a field requires documenting its purpose, default/migration behavior, and
rendering implications. Renaming or removing a field requires a repository-wide
content migration in the same change. Type-specific fields should be introduced
through a documented discriminated schema only when at least one real writing
needs them.
