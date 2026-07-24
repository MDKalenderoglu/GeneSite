# Design system

## Design direction

GeneSite is a rigorous personal research notebook refined for publication:
quiet, precise, typography-first, warm, and visibly attentive to revision. It
must not resemble a résumé, corporate site, SaaS landing page, newspaper, or
generic reverse-chronological blog.

Reading is the main interaction. Hierarchy comes from type, spacing, rules, and
alignment rather than gradients, shadows, animation, or decorative density.

## Implemented tokens

`src/styles/tokens.css` owns the semantic custom properties. Components consume
these properties through shared classes and do not introduce one-off colors.

- Surfaces: `--color-canvas`, `--color-surface`, and `--color-surface-subtle`.
- Text and interaction: `--color-text`, `--color-text-muted`, `--color-link`,
  `--color-link-hover`, `--color-focus`, and `--color-selection`.
- Structure: `--color-border`, `--color-border-strong`, and
  `--color-code-background`.
- Publication accents: `--color-publication-seed`,
  `--color-publication-developing`, `--color-publication-published`,
  `--color-publication-revised`, and `--color-publication-archived`.
- Epistemic accents: `--color-epistemic-established`,
  `--color-epistemic-review`, `--color-epistemic-interpretation`,
  `--color-epistemic-hypothesis`, and `--color-epistemic-speculative`.
- Spacing: `--space-1` through `--space-20`, based on a 4px unit.
- Measures: `--width-prose` and `--width-wide`.
- Shape: `--radius-small` and `--radius-medium`.
- Type: `--font-text`, `--font-interface`, `--font-monospace`, `--text-body`,
  `--line-body`, and `--line-heading`.

The light-only palette uses a warm off-white canvas and near-black text. Status
accents are always paired with explicit text; color never carries status meaning
alone. Dark mode remains outside Phase 2.

## Typography

Only robust local system stacks are used:

- Long-form text: `ui-serif`, Georgia, Cambria, Times New Roman, Times, serif.
- Interface text: `ui-sans-serif`, Apple and Segoe UI system faces, sans-serif.
- Technical metadata and code: `ui-monospace`, SFMono-Regular, Menlo, Monaco,
  Consolas, Liberation Mono, monospace.

Ordinary body and prose text is `1.125rem` (18 CSS pixels at the default root)
with a `1.72` line-height. Prose is constrained to `70ch`, inside a wider
`76rem` page shell. Headings use a restrained scale, a maximum weight of 600 in
prose, and coherent `h1`–`h6` treatment. Paragraph, list, heading, and section
spacing is deliberately generous enough for long reading sessions.

No remote requests, font packages, or bundled font files are present.

## Layout responsibilities

`BaseLayout.astro` owns the document shell: dynamic language, responsive
metadata, title and description, skip link, semantic site header, matching main
target, semantic footer, global/prose CSS, and the print stylesheet.

`WritingLayout.astro` owns writing-page composition: compact breadcrumb, writing
header, optional archive notice, article prose, revision history, references,
public related writings, and tags. The title is the single page `h1`; Markdown
begins below it and must maintain a coherent outline.

The home route is a concise premise plus discoverable fixture writings. It is
not the full archive or a discovery system.

## Component responsibilities

- `SiteHeader` and `SiteFooter`: quiet publication identity and global shell.
- `WritingHeader`: title, description, type, both status dimensions, dates,
  version, and language.
- `WritingCard`: compact home-page entry point to a discoverable writing.
- `StatusLabel`: textual publication or epistemic status with a restrained
  semantic accent.
- `LanguageIndicator`: localized language name and compact code.
- `ReferenceList`: ordered structured bibliography with stable anchors and
  accessible DOI/URL links.
- `RevisionHistory`: validated version, localized date, and summary history.
- `RelatedWritings`: validated public relations using canonical `entry.id`,
  including an explicit archived marker.
- `TagList`: semantic tag output without introducing archive navigation.
- `ArchiveNotice`: explains that archived work remains available and readable.

A table of contents was not added: it is not required for the representative
Phase 2 writings and remains a Phase 3, content-length-led decision.

## Centralized labels

`src/lib/labels.ts` is the single presentation vocabulary for Turkish and
English content types, publication statuses, epistemic statuses, language names,
interface labels, and localized date formatting. Components do not repeat
translation maps. Publication and epistemic status remain independent dimensions
and receive equal visual weight.

## Prose behavior

`src/styles/prose.css` covers headings, paragraphs, ordered and unordered lists,
nested lists, blockquotes, inline and fenced code, tables, links, rules,
figures, captions, footnotes, abbreviations, definition lists, superscript,
subscript, strong text, and emphasis.

Links use underlines as well as color. Images are responsive. Wide tables use a
named, keyboard-focusable `.table-scroll-region` wrapper; horizontal overflow
and keyboard focus belong to that same element while the inner table retains its
native semantics and is not a scroll container. Code blocks scroll inside their
own focusable bounded regions. URLs and reference text wrap. Heading scroll
offsets keep anchored headings clear. The built-in Astro Shiki renderer uses a
light theme with no client-side JavaScript.

## Responsive behavior

The narrow layout is the baseline. Shell gutters reduce naturally, metadata
changes from one to multiple columns at `44rem`, and all touchable primary links
have practical target space. At 320 CSS pixels there is no page-level horizontal
overflow. At 1440 CSS pixels, prose remains 70ch rather than expanding to the
full shell. There is no fixed essential interface, hover-only content,
enhancement-script layout shift, or complex desktop sidebar.

## Accessibility behavior

- Dynamic page language, a visible-on-focus skip link, and matching
  `#main-content` target.
- Semantic site `header`, `main`, writing `article`, section headings, and
  `footer`.
- One primary `h1` and a tested representative heading outline.
- Three-pixel `:focus-visible` outline using the focus token.
- Underlined links, meaningful labels, and status meaning independent of color.
- Reduced-motion handling and no essential animated interaction.
- Captioned representative tables with scoped headers. A wrapper receives
  `role="region"`, `tabindex="0"`, and a caption-backed accessible name only
  when it represents the table's bounded horizontal overflow region, avoiding
  unnecessary landmarks while keeping keyboard focus and scrolling together.
- Semantic reference and revision sections; stable reference anchors.
- Reading and navigation work without client-side JavaScript.

WCAG 2.2 AA is the baseline.

## Print behavior

`src/styles/print.css` switches to white paper and black text, hides ordinary
navigation and interactive decoration, and retains publication identity, title,
description, type, both statuses, dates, version, language, archive notice,
prose, revisions, references, tags, and useful external URLs. Headings avoid
orphaning where practical; code wraps and tables remain unclipped. Browser
print-to-PDF is supported, but automated PDF generation is not.

## Verification

Unit tests cover every Turkish/English status and content-type label. Production
artifact tests cover language, skip navigation, landmarks, heading hierarchy,
archive behavior, relations, references, revisions, draft exclusion, print
inclusion, focus styles, responsive rules, prose measure, and local overflow.
Manual browser checks at 320px and 1440px confirm no page overflow and the
implemented 18px/70ch reading measure.

No Phase 2 design requirement was intentionally deviated from. The
table-of-contents option was deliberately left unimplemented because the phase
boundary defers it unless an existing requirement strictly needs it.
