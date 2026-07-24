# GeneSite contributor guide

GeneSite is a content-first, statically generated publication built with Astro,
TypeScript, Markdown/MDX, and Astro content collections.

## Working rules

- Read `docs/INDEX.md` before changing architecture, content, design, or policy.
- Treat the documents in `docs/` as the source of truth; update them with any
  decision that changes behavior.
- Keep all long-form entries in the single `writings` collection.
- Prefer build-time validation and generated static pages. Do not add a backend,
  database, authentication, or CMS without an explicit architecture decision.
- Keep JavaScript optional for reading, navigation, and discovery.
- Preserve stable canonical writing IDs (`entry.id`) and clearly document
  content revisions.
- Do not publish drafts or expose them through feeds, indexes, or sitemaps.
- Add the smallest dependency that solves a demonstrated need.

## Quality bar

Before considering an implementation change complete, run formatting, type
checking, content validation, tests, and a production build. Check key pages
without client-side JavaScript and verify responsive layout, accessibility,
metadata, links, and generated output.
