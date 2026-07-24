# Product specification

## Product definition

GeneSite is a personal, content-first publishing system for durable intellectual
work. It publishes whitepapers, essays, research notes, open questions,
theories, and thought experiments. It is neither a portfolio nor a corporate
landing page, and it should not imitate a conventional reverse-chronological
blog.

The primary object is a writing. Identity, visual branding, and navigation exist
to help readers understand, evaluate, connect, and revisit writings.

## Phase 1 provisional identity

- Repository name: `GeneSite`.
- Working site name: `GeneSite`.
- Primary launch language: Turkish (`tr`).
- Currently accepted writing languages: Turkish (`tr`) and English (`en`).
- Canonical production origin: unresolved until deployment planning.
- Hosting provider: unresolved until Phase 5.

## Audience

- Readers seeking careful, inspectable arguments rather than short updates.
- Researchers and practitioners following a topic or line of inquiry.
- Future readers who arrive through a citation, shared link, or search result.
- The author, who needs a low-friction, version-aware writing workflow.

## Product principles

1. **Ideas before biography.** The home page leads with writings and questions.
2. **Epistemic clarity.** Every writing states both publication maturity and
   epistemic status.
3. **Durable addresses.** Published canonical IDs are stable and revisions are
   visible.
4. **Connected thought.** Tags, explicit relationships, and references create a
   navigable knowledge graph.
5. **Calm reading.** Typography, hierarchy, and restrained interaction support
   long sessions.
6. **Progressive enhancement.** Core reading and navigation work without
   client-side JavaScript.

## Core reader journeys

- Discover a featured or recently updated writing from the home page.
- Browse by content type or tag without requiring a timeline-first view.
- Read a writing with clear type, status, version, dates, and epistemic framing.
- Follow related writings and external references.
- Distinguish an original publication from a later revision.
- Share or cite a stable canonical URL.

## Required surfaces

### Home

A concise site premise, selected featured writings, active/open questions, and
clear routes into types and topics. A chronological stream may be secondary but
must not define the experience.

### Writings index

All public, non-archived writings with meaningful filtering by type, status,
epistemic status, language, and tag. The initial static implementation may use
server-free links and separate index pages; client filtering is an optional
enhancement.

### Writing detail

Title, description, content type, publication status, epistemic status,
publication and update dates, version, language, tags, revision notes,
references, and related writings. Archived entries display an explicit notice.

### Taxonomy pages

Static pages for each supported content type and tag. Epistemic-status pages are
optional until the corpus makes them useful.

### About and method

A compact explanation of the author/site and a public description of editorial
and epistemic conventions. These are supporting pages, not the primary focus.

### Machine-readable surfaces

Sitemap, RSS or Atom feed, canonical metadata, social preview metadata, and
structured data. Drafts never appear in generated public surfaces.

## Scope

### In scope

- Astro with strict TypeScript.
- Markdown and MDX authoring.
- One Astro content collection named `writings`.
- Static site generation.
- Build-time schema and relationship validation.
- Responsive, accessible, semantic pages.
- Syntax highlighting, footnotes, and citations where justified.
- Local authoring through files and version control.

### Explicitly out of scope

- Backend services, database, authentication, or CMS.
- Comments, reactions, accounts, newsletters, or personalized recommendations.
- A portfolio/project gallery, résumé-first experience, or sales funnel.
- Search that requires a hosted service in the first release.
- Analytics by default; privacy-preserving analytics may be considered later.
- Runtime content mutation.

## Success criteria

The first public release succeeds when:

- A reader can understand what a writing claims and how certain it is.
- Every public writing has a stable URL, valid metadata, and connected context.
- The site is usable on a small screen and with keyboard or screen reader input.
- A clean checkout can validate and build the full site deterministically.
- Publishing a writing requires editing content, not application code.
- Draft content is absent from the production output and discovery artifacts.

## Non-goals and guardrails

Engagement metrics must not drive layout. No infinite scroll, interruption
modal, autoplay, manipulative urgency, or ornamental animation. The product may
be visually distinctive, but novelty cannot obscure provenance, status, or text.
