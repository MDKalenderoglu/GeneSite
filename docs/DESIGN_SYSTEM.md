# Design system

## Design direction

GeneSite should feel like a rigorous personal research notebook refined for
publication: quiet, legible, precise, and visibly alive to revision. It should
not look like a résumé, startup landing page, generic card grid, or newspaper
theme.

The design system begins with prose and metadata. Decorative identity is
secondary.

## Principles

- **Reading is the main interaction.** Give prose the strongest visual weight.
- **Status is visible, not alarming.** Publication and epistemic labels must be
  clear without resembling marketing badges.
- **Hierarchy beats decoration.** Use spacing, type, rules, and alignment before
  shadows, gradients, or animation.
- **Density is deliberate.** Long-form pages are spacious; indexes can be
  compact and information-rich.
- **Links look like links.** Do not depend on color alone.
- **Motion is optional.** Honor reduced-motion preferences and avoid motion in
  the reading path.

## Token categories

Define tokens in `src/styles/tokens.css`; components must consume tokens rather
than one-off values.

### Color

Use semantic roles: `canvas`, `surface`, `text`, `text-muted`, `link`, `border`,
`focus`, `selection`, and status accents. Start with a light reading theme with
a warm neutral canvas and near-black text. A dark theme is deferred until both
themes can be tested to the same standard.

All text and controls must meet WCAG 2.2 AA contrast. Status colors must always
be accompanied by readable text.

### Typography

- One text face optimized for long-form reading.
- One complementary interface face, or the text face reused for UI.
- A monospace face only for code, identifiers, and compact technical metadata.
- Body text approximately 17–20 CSS pixels at ordinary desktop widths.
- Prose measure approximately 62–72 characters.
- A restrained modular scale; headings communicate structure rather than brand.

Prefer self-hosted variable fonts or the system stack. Keep font files and used
weights minimal.

### Spacing and layout

Use a small consistent spacing scale based on a 4px unit. The reading column,
wide content region, and full viewport are distinct layout primitives. Tables,
figures, and code may escape the prose column without forcing ordinary text to
be too wide.

### Borders, radii, and shadows

Use fine rules for separation. Small radii are acceptable on controls and status
labels. Shadows are rare and must communicate elevation, not decoration.

## Core components

- `SiteHeader` and `SiteFooter`
- `WritingHeader` for title, description, type, statuses, version, and dates
- `WritingCard` with compact and featured variants
- `StatusLabel` for publication and epistemic status
- `Prose` styles for Markdown output
- `TableOfContents` for sufficiently long, structured writings
- `ReferenceList` and citation anchors
- `RevisionHistory`
- `RelatedWritings`
- `TagList`
- `ArchiveNotice`
- `LanguageIndicator`

Components represent reusable semantics, not merely repeated CSS. Avoid a
component for a wrapper used only once.

## Content-type treatment

All types share the same layout family so the site remains one body of thought.
Small typographic or iconographic distinctions may identify type, but each must
remain understandable as text. Thought experiments and theories must not gain a
more authoritative visual treatment than notes or questions.

## Writing page anatomy

1. Breadcrumb or compact route context.
2. Title and standalone description.
3. Type, publication status, epistemic status, dates, version, and language.
4. Optional contents navigation for long documents.
5. Main prose with figures, tables, notes, and citations.
6. Revision history and archive notice where applicable.
7. References.
8. Related writings and tags.

Metadata should be available near the start without becoming a wall that delays
the first paragraph.

## Responsive behavior

The narrow layout is the baseline. On wider screens, supplemental navigation or
a table of contents may occupy a side column while prose retains its readable
measure. Horizontal overflow is permitted only inside an explicitly scrollable
table or code region with an accessible label.

## Accessibility requirements

- Semantic headings in a single coherent outline.
- A skip link and named landmarks.
- Visible keyboard focus using the focus token.
- Minimum practical target size of 44 by 44 CSS pixels for primary controls.
- No essential hover-only content.
- Meaningful alt text or explicitly empty alt text for decorative images.
- Captions and source context for substantive figures.
- Tables with correct headers and captions.
- Language declared at page level and for passages that switch language.
- Code blocks, footnotes, and citations operable with keyboard and screen
  reader.
- Print styles that retain URLs, citations, hierarchy, and revision metadata.

## Interaction policy

Links and native disclosure elements cover most behavior. Client-side filtering,
theme switching, or copy actions may be progressively enhanced later. Every
enhancement needs a no-JavaScript path and must avoid shifting the reading
layout after load.
