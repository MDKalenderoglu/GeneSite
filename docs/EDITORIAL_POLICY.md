# Editorial policy

## Purpose

This policy makes the state, certainty, provenance, and history of each writing
inspectable. Publication does not imply finality, and speculation must not be
presented with the visual or rhetorical authority of established knowledge.

## Required editorial metadata

Before a writing can be public, it must have every required field in
`CONTENT_MODEL.md`, a standalone description, an intentional publication status,
an intentional epistemic status, and a publication date. Empty tags, references,
relations, or revision notes are allowed only when genuinely appropriate, not as
placeholders for unfinished review.

## Publication workflow

1. Create the entry as `draft: true`.
2. Choose type, publication status, epistemic status, language, and a
   provisional version.
3. Verify the claim, scope, terminology, references, and related writings.
4. Preview headings, figures, tables, links, citations, metadata, and narrow
   layouts.
5. Run the full validation and production build.
6. Set `draft: false` and supply `publishedAt` only when the entry is ready for
   its stated maturity level.
7. Review the deployed canonical page.

A seed or developing writing may be public, but its incompleteness must be
obvious from both the status and prose.

## Evidence and attribution

- Cite the strongest available primary source for factual or technical claims.
- Distinguish sourced facts, synthesis, inference, and original speculation.
- Link to stable identifiers such as DOIs when available.
- Give authors, translators, datasets, software, and visual sources appropriate
  credit.
- Do not cite a source that was not consulted.
- Represent disagreement and uncertainty fairly; avoid laundering opinion
  through vague phrases such as “research shows.”
- Quotes must be accurate, minimal, contextualized, and legally permissible.

References should be structured in frontmatter and rendered consistently. Inline
citations should use stable reference IDs rather than hand-numbered labels.

## Epistemic labeling

Choose the status that best describes the writing's central intellectual act.
Use prose-level qualifiers when individual claims differ. When a writing mixes
review and a new hypothesis, clearly mark the transition and choose the status
that represents the novel claim readers are being asked to evaluate.

Changes in evidence can require an epistemic-status change even when the prose
changes little; record that change in revision notes.

## Revisions and corrections

Published content is corrected in place at its stable URL. Update `updatedAt`
and `version`, and record a concise revision note according to the version
policy.

- Patch: spelling, broken links, formatting, or narrow factual corrections that
  do not alter the central argument.
- Minor: new evidence, meaningful clarification, or changed reasoning that
  preserves the central claim.
- Major: changed thesis, model, scope, or conclusion.

Material corrections must say what changed, not merely “updated.” Never rewrite
material claims silently. Preserve earlier states through version control; a
public version archive is a later feature, not a first-release requirement.

## Archival and withdrawal

Archive rather than delete when a writing is superseded, no longer endorsed, or
valuable mainly for provenance. An archived page keeps its canonical URL,
displays the reason and relevant successor when possible, and is removed from
ordinary discovery.

Removal is reserved for legal, safety, privacy, or serious integrity concerns.
When safe and lawful, leave a tombstone explaining the removal without repeating
harmful material.

## Language and translations

`language` identifies the language of the complete entry. A translation is a
separate writing with its own canonical ID and metadata, related explicitly to
the source. Translations should state their source version and must not silently
diverge in claims.

Use direct, precise language. Define specialized terms, avoid unnecessary
jargon, and do not inflate certainty or importance.

## Use of generative tools

The author remains accountable for every claim, citation, and phrase. Generated
text or code must be checked against sources and cannot be treated as evidence.
Material machine assistance that affects the intellectual substance should be
disclosed in the writing or method page.

## Review checklist

- The title and description accurately delimit the claim.
- Type, status, and epistemic status are justified by the content.
- Facts and quotations are traceable to consulted sources.
- Counterevidence and important limitations are represented.
- Links, citation IDs, figures, and related writings resolve.
- Dates, version, and revision notes agree.
- The page is readable, accessible, and free of draft-only context.
