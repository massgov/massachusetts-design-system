# Massachusetts Design System Styles

Helper and utility CSS for the Massachusetts Design System. This package is intended to sit on top of `@massds/mds-tokens` and provide composable layout and spacing classes generated from a small Sass source layer.

## Usage

Import tokens first, then styles:

```css
@import "@massds/mds-tokens/dist/index.css";
@import "@massds/mds-styles/dist/index.min.css";
```

This package does not rebundle tokens. Keeping tokens and styles separate makes it easier to update each layer independently and avoids duplicating CSS variables across packages. The build publishes a bundled `dist/index.css` for readable distribution and a bundled, minified `dist/index.min.css` for production use. The individual layer files are also published when you want to import them separately.

## Package Contents

The published package includes generated CSS files under `dist/`:

```text
dist/
├── colors.css
├── helpers.css
├── index.css
├── index.min.css
└── utilities.css
```

- `dist/colors.css` contains color utility classes generated from semantic background and text/icon tokens
- `dist/helpers.css` contains reusable structural classes such as the grid container and section container
- `dist/utilities.css` contains generated utility classes such as typography, spacing, radius, shadow, gap, and grid span utilities
- `dist/index.css` is the bundled unminified package entry stylesheet
- `dist/index.min.css` is the bundled, minified production stylesheet for the package

## Naming Conventions

Utilities and helpers uses flat, token-driven classnames, for example `.mds-padding-inline-md`, `.mds-gap-sm`, `.mds-shadow-container` and `mds-section-container`.

As a rule of thumb, helpers describe reusable layout patterns or structural roles, while utilities describe one specific CSS property driven by a token scale.

## Color Utilities

Color utilities are generated from the semantic background, text/icon, and border token sets in `@massds/mds-tokens` and live in a dedicated `colors.css` layer.

```html
<div class="mds-background-section-brand-primary-lowest mds-text-inverse"></div>
```

Examples:

- `.mds-background-surface-default`
- `.mds-background-static-white`
- `.mds-background-section-brand-primary-lowest`
- `.mds-background-adaptive-brand-secondary-mid`
- `.mds-background-adaptive-utility-success-high`
- `.mds-background-overlay`
- `.mds-text-brand-neutral-default`
- `.mds-text-and-icons-static-blue-mid`
- `.mds-text-brand-primary-mid`
- `.mds-text-inverse`
- `.mds-border-brand-primary-mid`
- `.mds-border-focus-on-light`

## Spacing Utilities

Spacing utilities are generated from the semantic spacing tokens and support horizontal and vertical padding and margin.

```html
<div class="mds-padding-inline-md mds-padding-block-sm"></div>
```

Available class families:

- `.mds-padding-inline-*`
- `.mds-padding-block-*`
- `.mds-margin-inline-*`
- `.mds-margin-block-*`
- `.mds-padding-inline-start-*`
- `.mds-padding-inline-end-*`
- `.mds-padding-block-start-*`
- `.mds-padding-block-end-*`
- `.mds-margin-inline-start-*`
- `.mds-margin-inline-end-*`
- `.mds-margin-block-start-*`
- `.mds-margin-block-end-*`

## Gap Utilities

Gap utilities reuse the spacing scale for grid and flex layouts.

```html
<div class="mds-grid mds-gap-md"></div>
```

Available classes:

- `.mds-gap-3xs`
- `.mds-gap-2xs`
- `.mds-gap-xs`
- `.mds-gap-sm`
- `.mds-gap-md`
- `.mds-gap-lg`
- `.mds-gap-xl`
- `.mds-gap-2xl`
- `.mds-gap-3xl`

## Radius Utilities

Border radius utilities are generated from the semantic radius tokens:

```html
<div class="mds-radius-md"></div>
```

Available classes:

- `.mds-radius-xs`
- `.mds-radius-sm`
- `.mds-radius-md`
- `.mds-radius-max`

## Shadow Utilities

Shadow utilities are generated from the semantic elevation tokens:

```html
<div class="mds-shadow-container"></div>
```

Available classes:

- `.mds-shadow-container`
- `.mds-shadow-modal`

Hover-only elevation utilities are stateful and apply their shadow on `:hover`:

- `.mds-shadow-hover-sm:hover`
- `.mds-shadow-hover-md:hover`

## Typography Utilities

Typography utilities are generated from the semantic text tokens and set the full `font` shorthand:

```html
<h2 class="mds-text-heading-lg">Section heading</h2>
<p class="mds-text-body-lg">Introductory body copy</p>
<span class="mds-text-label">Field label</span>
```

Available class families include:

- `.mds-text-heading-2xs`
- `.mds-text-heading-xs`
- `.mds-text-heading-sm`
- `.mds-text-heading-md`
- `.mds-text-heading-lg`
- `.mds-text-heading-xl`
- `.mds-text-heading-2xl`
- `.mds-text-body`
- `.mds-text-body-bold`
- `.mds-text-body-lg`
- `.mds-text-body-lg-bold`
- `.mds-text-label-sm`
- `.mds-text-label`
- `.mds-text-label-md`
- `.mds-text-label-lg`
- `.mds-text-label-xl`
- `.mds-text-eyebrow`
- `.mds-text-eyebrow-md`
- `.mds-text-caption-sm`
- `.mds-text-caption`
- `.mds-text-caption-bold`
- `.mds-text-caption-md`

Eyebrow tokens intentionally keep casing and tracking separate. Pair the font utility with:

- `.mds-text-transform-eyebrow`
- `.mds-letter-spacing-eyebrow`

## Grid Utilities

The preferred grid span API is numeric:

```html
<div class="mds-grid-span-6"></div>
```

Responsive prefixed variants are also generated for grid span utilities using the design system's max-width breakpoints:

```html
<div class="mds-grid-span-12 md:mds-grid-span-6 lg:mds-grid-span-4"></div>
```

This means:

- `md:` applies at `768px` and below
- `lg:` applies at `1024px` and below

Legacy alias classes such as `.mds-grid-full`, `.mds-grid-2-column`, `.mds-grid-3-column`, and `.mds-grid-4-column` are still generated for backward compatibility.

These aliases should be treated as deprecated for new work. Prefer `.mds-grid-span-n` for new utilities and component examples.

## Source Layout

```text
src/
├── colors.scss
├── mixins/
│   ├── _base.scss
│   ├── _grid.scss
│   ├── _space.scss
│   ├── _scales.scss
│   └── index.scss
├── helpers.scss
├── index.scss
└── utilities.scss
```

- `mixins/_scales.scss` stores the token-backed scales shared by utility generation
- `mixins/_base.scss` contains the shared utility generator mixins
- `mixins/_space.scss` and `mixins/_grid.scss` contain specialized utility mixins
- `mixins/index.scss` forwards the mixin API so files can `@use "./mixins"`
- `colors.scss` emits the color utility layer for background and text/icon tokens
- `helpers.scss` contains authored structural classes
- `utilities.scss` emits utility classes from the shared mixins module, including numeric grid spans such as `.mds-grid-span-6`
- `index.scss` is the package entrypoint that imports both layers

## Notes

If you update the Sass source or utility naming, run `npm run build` in `packages/styles` before checking the demo pages so `dist/` matches the latest source.

## Development

Install dependencies from the repository root, then run style package commands with npm workspaces:

```bash
npm install
npm run build --workspace @massds/mds-styles
```

The build compiles the Sass entrypoints into `dist/`.

For local Sass development, use the watcher:

```bash
npm run watch --workspace @massds/mds-styles
```

This keeps all four Sass entrypoints in `src/` synced to `dist/` as files change.

## Extending Utilities

To add a new utility family:

1. Add the token-backed scale to `src/mixins/_scales.scss`
2. Add or reuse a mixin under `src/mixins/`
3. Call that mixin from `src/utilities.scss`
4. Rebuild with `npm run build`

This keeps the authored source small while still producing explicit CSS for consumers.
