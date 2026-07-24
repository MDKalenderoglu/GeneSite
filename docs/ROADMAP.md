# Roadmap

The phases are ordered by risk: establish content correctness first, then
rendering, discovery, quality, and deployment. Each phase should end in a usable
and validated state.

## Phase 0 — Product and architecture

Status: complete.

- Define product boundaries and reader journeys.
- Define the unified `writings` model and editorial semantics.
- Define architecture, design, SEO, validation, and deployment policies.
- Record unresolved product and operational decisions.

Exit gate: the documentation set is internally consistent and implementation can
begin without inventing core semantics.

## Phase 1 — Foundation and content contract

Status: complete.

- Scaffold a minimal Astro static project with strict TypeScript and MDX
  support.
- Add the current Content Layer `writings` collection in
  `src/content.config.ts`, using `defineCollection`, `z`, and a glob loader for
  both Markdown and MDX.
- Treat optional frontmatter `slug` as a loader override and use canonical
  `entry.id` everywhere outside source frontmatter.
- Use a dedicated `generateId` callback to derive fallback IDs, validate
  canonical and reserved IDs, and reject duplicate source ownership before
  collection insertion.
- Add shared public-content selectors and a cross-entry validator.
- Add one small fixture for each content type, covering the status and epistemic
  vocabularies across the set.
- Add invalid fixtures/tests for canonical IDs, dates, relations, drafts,
  revisions, and production draft leakage.
- Exercise identity with generator unit tests and a real failing Astro build
  using temporary duplicate Markdown/MDX sources outside the committed
  collection that are always cleaned up.
- Add format, check, validate, test, and build scripts.

Exit gate: a clean install can reject invalid content and build valid fixtures;
no visual design beyond what is needed to inspect output. The verification
pipeline performs one normal production build; the duplicate-identity
integration test is the only intentional additional failing build.

## Phase 2 — Reading experience

- Implement tokens, global styles, base layout, and writing layout.
- Render Markdown/MDX prose, headings, code, tables, figures, and citations.
- Render status, epistemic status, dates, language, version, references,
  revisions, archive notices, tags, and public related writings.
- Establish responsive and print behavior.

Exit gate: representative long and short writings are readable and accessible
without client-side JavaScript on narrow and wide screens.

## Phase 3 — Discovery and navigation

- Build the home page around featured work, open questions, and topic entry
  points.
- Build the writings index and static type/tag pages.
- Add header, footer, skip navigation, breadcrumbs, and empty states.
- Add table of contents only where content length warrants it.

Exit gate: every public writing is reachable from a static navigation path, and
drafts/archived entries obey their discovery rules.

## Phase 4 — Metadata and release quality

- Add canonical metadata, social cards, JSON-LD, sitemap, feed, and robots
  rules.
- Add link, HTML, metadata, structured-data, and draft-leak checks.
- Add accessibility and browser smoke tests for representative routes.
- Optimize fonts, images, CSS, and any client bundles against explicit budgets.

Exit gate: a production build passes content, accessibility, metadata, link, and
artifact inspections.

## Phase 5 — Hosting and first publication

- Select a static host and canonical domain.
- Add provider-isolated header and redirect configuration.
- Configure preview and production pipelines with indexing safeguards.
- Document and rehearse rollback.
- Replace fixtures with reviewed launch writings or clearly mark intentional
  examples.

Exit gate: the canonical HTTPS site is deployed, rollback is proven, and its
public artifacts contain no drafts.

## Phase 6 — Evidence-led enhancements

Consider only after observing real author and reader needs:

- Generated local full-text search.
- Paired translation navigation and `hreflang`.
- Automated citation formatting or bibliography export.
- Public version snapshots or diffs.
- Dark theme.
- Privacy-preserving analytics.

Each enhancement needs a documented problem, an accessible no-JavaScript or
graceful fallback where applicable, and no violation of the static architecture.

## Unresolved decisions

- Author display name and canonical production origin. The working repository
  and site name is `GeneSite`.
- Whether English follows the primary Turkish launch immediately or later. Phase
  1 accepts both `tr` and `en`.
- Exact typography/font licensing and final visual palette.
- Citation style and whether prose uses footnotes, author–date citations, or
  both by content type.
- Whether archived entries remain in a dedicated archive index.
- Feed format and whether meaningful revisions create new feed entries.
- Static hosting provider, deployment branch, and preview privacy model; the
  provider remains intentionally unresolved until Phase 5.
- Whether launch scope needs client-side search or filtering.
- License terms for prose, code samples, and site source.

## Recommended next implementation task

Begin Phase 2 with the semantic writing-page anatomy and prose rendering
contract, then introduce tokens and layout only as needed to make representative
long and short writings readable and accessible. Phase 1 fixtures and draft-leak
tests must remain green throughout.
