# Architecture

## System overview

GeneSite is a compile-time publishing pipeline. Source-controlled Markdown/MDX
and TypeScript enter Astro's build; schema validation, relationship checks, and
page generation produce deployable static assets. The deployed site has no
application server or mutable runtime state.

```text
writings (.md/.mdx) + site data + Astro components
                    |
                    v
        schema and integrity validation
                    |
                    v
       Astro static routes and presentation
                    |
                    v
          immutable HTML/CSS/assets
```

## Proposed directory tree

This is the longer-term target structure. Phase 2 now implements the content
foundation, semantic components, shared layouts, reading styles, tests, and the
two route surfaces required by the roadmap. Entries marked for later phases
remain targets, not current behavior:

```text
GeneSite/
├── AGENTS.md
├── README.md
├── astro.config.ts
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── fonts/
│   └── images/
├── scripts/
│   ├── validate-content.ts
│   └── check-links.ts
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── content/
│   │   ├── layout/
│   │   ├── metadata/
│   │   └── navigation/
│   ├── content/
│   │   └── writings/
│   │       └── *.md(x)
│   ├── content.config.ts
│   ├── data/
│   │   └── site.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── WritingLayout.astro
│   ├── lib/
│   │   ├── content-identity.ts
│   │   ├── content-validation.ts
│   │   ├── content.ts
│   │   ├── labels.ts
│   │   ├── seo.ts
│   │   └── taxonomy.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── method.astro
│   │   ├── writings/
│   │   │   ├── index.astro
│   │   │   └── [...id].astro
│   │   ├── types/
│   │   │   └── [type].astro
│   │   ├── tags/
│   │   │   └── [tag].astro
│   │   ├── rss.xml.ts
│   │   └── robots.txt.ts
│   ├── styles/
│   │   ├── global.css
│   │   ├── print.css
│   │   ├── prose.css
│   │   └── tokens.css
│   └── env.d.ts
├── tests/
│   ├── content/
│   ├── integration/
│   └── fixtures/
└── docs/
    └── ...
```

## Technical decisions

### AD-01: Astro static site generation

Astro supplies file-based routing, content collections, Markdown/MDX support,
and HTML-first components while producing a static artifact. Static generation
minimizes operational surface and supports durable, fast reading.

Trade-off: content changes require a build and deploy. This is appropriate for a
personal publication and keeps runtime infrastructure at zero.

### AD-02: Strict TypeScript at authoring and build time

TypeScript covers configuration, content helpers, route generation, and
components. Strict mode and generated Astro types should be enabled.

Trade-off: schema/type integration adds initial ceremony, repaid by preventing
metadata drift and invalid routes.

### AD-03: One `writings` collection

All six content types share a unified collection and discriminate on a required
`type` field. A common schema enables cross-type relations, consistent routes,
feeds, cards, and metadata.

Trade-off: some types may later need special fields. Add narrowly scoped
optional fields or discriminated refinements only after real content requires
them; do not split collections merely for presentation differences.

### AD-04: Markdown by default, MDX by exception

Use `.md` for ordinary writings and `.mdx` only for meaningful interactive or
structured elements. Approved MDX components must be local, accessible, and safe
at build time.

Trade-off: MDX increases expressive power and coupling to application code.
Keeping it exceptional improves content portability.

### AD-05: Content Layer canonical IDs and optional slug overrides

Astro's glob loader exposes canonical writing identity as `entry.id`. A
dedicated stateful `generateId` callback reads optional raw frontmatter `slug`
before Zod validation. Without an override, it deterministically derives the ID
from the source-relative Markdown or MDX path. `slug` must not appear in the Zod
data schema, and application code must never depend on `entry.data.slug`.

Routes, relationships, canonical URLs, uniqueness checks, and reserved-path
checks use `entry.id`. Published IDs are immutable except for a documented
migration with redirects. This preserves stable URLs while allowing source files
to be reorganized.

Canonical rules and reserved IDs have one owner, `src/lib/content-identity.ts`.
The generator tracks source-to-ID and ID-to-source ownership, permits the same
file to be reprocessed in watch mode, and rejects a different file claiming an
occupied ID. Its build-stopping error includes the duplicate ID and both source
paths, preventing an entry from overwriting another inside Astro's collection
store.

### AD-06: Two independent status dimensions

`status` describes publication maturity; `epistemicStatus` describes the
strength or nature of the knowledge claim. `draft` alone controls whether the
writing may enter public output. This avoids conflating unfinished presentation
with uncertain ideas.

### AD-07: Build-time integrity checks

The loader rejects invalid, reserved, or duplicate canonical IDs before entries
can overwrite one another. The Astro collection schema then validates entry
shape. A separate content-integrity step defensively repeats ID uniqueness and
checks other cross-entry facts that a single-entry schema cannot: existing
relationships, no self-relations, date ordering, version/revision consistency,
and public-content rules.

Trade-off: a custom script must be maintained, but invalid content fails before
deployment rather than becoming a broken public page.

### AD-08: Minimal client JavaScript

Pages render as semantic HTML. Use client-side code only for enhancements whose
value is demonstrated, such as optional filtering or a copy-link action. Avoid
hydrating static prose and navigation.

### AD-09: Provider-neutral static output

The build artifact must run on any static host. Provider-specific configuration
is isolated to deployment files and may not become a content dependency.

### AD-10: Semantic, JavaScript-free reading presentation

`BaseLayout.astro` owns the document shell, language, metadata, skip navigation,
landmarks, and stylesheet loading. `WritingLayout.astro` composes the canonical
writing route from focused semantic components. Components receive normalized
collection entries and expose identity only through `entry.id`.

`src/lib/labels.ts` centralizes Turkish and English labels for content types,
publication statuses, epistemic statuses, languages, interface text, and
localized dates. Presentation components do not duplicate status maps.

The CSS layers have distinct owners: tokens define semantic values, global CSS
defines the shell and reusable component classes, prose CSS defines rendered
Markdown/MDX, and print CSS defines browser print output. The built-in Shiki
highlighter supplies static code markup. No client-side runtime, UI framework,
remote font, or browser-test dependency is required.

Trade-off: a shared layout family intentionally limits per-type visual novelty.
That consistency prevents content type from implying epistemic authority and
keeps long-form reading primary.

## Routing and URL policy

- `/` — home and editorial entry points.
- `/writings/` — complete public index.
- `/writings/{id}/` — canonical writing URL; nested IDs are allowed.
- `/types/{type}/` — one page per supported content type.
- `/tags/{tag}/` — one normalized tag page.
- `/about/` and `/method/` — supporting context.

URLs use lowercase ASCII segments and trailing slashes consistently. Query
parameters may enhance filtering but cannot be canonical content addresses.

## Build data flow

1. The glob loader's explicit ID generator resolves and validates canonical
   `entry.id` values from raw slug overrides or relative source paths, rejecting
   duplicate ownership before collection insertion.
2. Astro validates each writing against the collection schema.
3. The integrity validator resolves canonical `entry.id` values and
   relationships and applies cross-field rules from `CONTENT_MODEL.md`.
4. Selectors exclude `draft: true` from every production page, feed, sitemap,
   taxonomy, and related-content result.
5. Public entries are sorted explicitly for each surface; no default global
   ordering is assumed.
6. Routes render semantic HTML and shared presentation from the same normalized
   entry data; bilingual labels are resolved centrally.
7. The production build emits static assets for deployment.

## Validation strategy

### Schema validation

Validate enums, ISO dates, the Phase 1 languages (`tr` and `en`), semantic
versions, normalized tags, reference structure, and required strings. Canonical
ID validation happens against `entry.id` after loading, not inside the data
schema.

### Cross-entry validation

- The ID generator rejects malformed IDs, reserved paths, and duplicate
  source-to-ID ownership before insertion. Cross-entry validation repeats
  canonical `entry.id` uniqueness as a defensive second layer.
- Every `relatedWritings` canonical ID exists; relations are unique and cannot
  point to self.
- Cyclic relations are allowed because they form a graph, not ownership.
- `updatedAt` is not earlier than `publishedAt`.
- Public entries have `publishedAt`; drafts may omit it.
- Featured entries are public and non-archived.
- Revised entries have revision notes consistent with their current version.
- Reference identifiers and URLs are well-formed where supplied.

### Automated checks

The quality pipeline runs:

1. Formatting and linting.
2. Astro/TypeScript type checking.
3. Content schema and integrity validation.
4. Unit tests for selectors, identity, validation, and bilingual labels.
5. Production static build.
6. Generated-HTML and CSS artifact checks, including draft leakage, semantic
   landmarks, heading structure, archive/relationship behavior, print inclusion,
   and responsive overflow contracts.
7. A real negative Astro-build integration test for duplicate source identity.

Tests must include one fixture for every content type and status, invalid
fixture cases for every cross-field invariant, a draft-leak test against build
output, and snapshots or assertions for canonical metadata and structured data.
Identity tests exercise the generator directly. A negative integration build
points the real Astro loader at a temporary directory outside the committed
collection, creates duplicate Markdown/MDX sources there, asserts the build
fails, and removes the directory in a `finally` block.

Phase 2 adds centralized-label unit tests and production-artifact tests for the
reading interface. Manual browser smoke checks at 320px and 1440px inspect
computed overflow, reading measure, typography, language, and landmarks. The
browser is an external verification tool, not a project dependency.

## Security and privacy posture

There is no user input or runtime data store. Dependencies and the build chain
are the main attack surface. Pin dependencies through a lockfile, keep MDX
components local, avoid injecting raw HTML, and do not expose unpublished source
through build artifacts. Any analytics must be explicitly approved and
documented in the privacy-facing content.

## Performance and accessibility budgets

- Use system font stacks; Phase 2 has no font requests or font assets.
- Set explicit media dimensions and optimize responsive images at build time.
- Avoid client bundles on prose pages unless a feature needs them.
- Meet WCAG 2.2 AA as the baseline, including focus visibility, contrast,
  semantic landmarks, reduced motion, and keyboard operation.
- Treat readable line length and stable layout as correctness, not polish.

## Phase 2 presentation boundaries

- Implemented routes remain `/` and `/writings/{entry.id}/`.
- The home route uses `getDiscoverableWritings()` and writing routes use the
  existing validated access and public relationship resolver.
- Drafts have no generated writing route and cannot appear in cards or related
  results. Archived writings retain their canonical route, metadata, revisions,
  references, and relations, with an explicit notice.
- Full archives, type/tag pages, search, filtering, feeds, sitemaps, structured
  data, analytics, deployment, and hosting remain deferred.

## Known trade-offs

- File-based authoring provides full version control but lacks a nontechnical
  editorial UI.
- Static indexes make large corpora cheap to serve, but sophisticated search may
  later require a generated client index.
- A single schema maximizes consistency but may need careful discriminated
  extensions as formats evolve.
- Explicit revision history improves trust while increasing authoring work.
