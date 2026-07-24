# GeneSite documentation

This directory is the product and engineering source of truth for GeneSite.
Phase 1 provides the validated content foundation, and Phase 2 provides the
semantic, responsive, print-ready reading experience.

## Documents

| Document                                     | Purpose                                                            |
| -------------------------------------------- | ------------------------------------------------------------------ |
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md)         | Audience, goals, scope, and product behavior                       |
| [ARCHITECTURE.md](./ARCHITECTURE.md)         | Proposed structure, system boundaries, decisions, and validation   |
| [CONTENT_MODEL.md](./CONTENT_MODEL.md)       | The unified `writings` collection and its invariants               |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)       | Visual, interaction, accessibility, and component principles       |
| [EDITORIAL_POLICY.md](./EDITORIAL_POLICY.md) | Publication, revision, sourcing, and archival rules                |
| [SEO_POLICY.md](./SEO_POLICY.md)             | Search, metadata, structured data, feeds, and indexing             |
| [DEPLOYMENT.md](./DEPLOYMENT.md)             | Static build, preview, release, rollback, and hosting requirements |
| [ROADMAP.md](./ROADMAP.md)                   | Phased implementation plan and acceptance gates                    |

## Decision precedence

When documents conflict, use this order:

1. `PRODUCT_SPEC.md` for product intent and scope.
2. `CONTENT_MODEL.md` for content fields and publication invariants.
3. `ARCHITECTURE.md` for implementation boundaries.
4. The relevant policy document for design, editorial, SEO, or deployment.

Resolve a conflict by updating all affected documents in the same change.

## Current status

Phases 0, 1, and 2 are complete. The repository contains the current Astro
Content Layer collection, schema and integrity validation, representative
development fixtures, automated draft-leak protection, centralized bilingual
labels, semantic layouts and components, long-form prose styles, responsive and
print behavior, and production-artifact coverage. Phase 3 discovery work has not
begun.
