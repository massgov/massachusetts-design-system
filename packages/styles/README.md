# Massachusetts Design System Styles

Helper and utility CSS for the Massachusetts Design System. This package is intended to sit on top of `@massds/mds-tokens` and provide composable layout and spacing classes generated from a small Sass source layer.

## Usage

Import tokens first, then styles:

```css
@import "@massds/mds-tokens/dist/index.css";
@import "@massds/mds-styles/dist/index.css";
@import "@massds/mds-styles/dist/colors.css";
```

This package does not rebundle tokens. Keeping tokens and styles separate makes it easier to update each layer independently and avoids duplicating CSS variables across packages. Color utilities are published separately in `colors.css` so teams can opt into them explicitly.

## Package Contents

The published package includes generated CSS files under `dist/`:

```text
dist/
├── colors.css
├── helpers.css
├── index.css
└── utilities.css
```

- `dist/colors.css` contains color utility classes generated from semantic background and text/icon tokens
- `dist/helpers.css` contains reusable structural classes such as the grid container and section container
- `dist/utilities.css` contains generated utility classes such as spacing, radius, shadow, gap, and grid span utilities
- `dist/index.css` imports the helper and utility layers together

## Naming Conventions

This package uses two naming styles on purpose:

- Use BEM for helpers and component-like classes with semantic structure, for example `.mds-section__container`
- Use flat, token-driven naming for utilities, for example `.mds-padding-inline-md`, `.mds-gap-sm`, and `.mds-shadow-container`

As a rule of thumb, helpers describe reusable layout patterns or structural roles, while utilities describe one specific CSS property driven by a token scale.

## Color Utilities

Color utilities are generated from the semantic background and text/icon token sets in `@massds/mds-tokens` and live in a dedicated `colors.css` layer.

```html
<div class="mds-background-section-brand-primary-lowest mds-text-inverse"></div>
```

Examples:

- `.mds-background-surface-default`
- `.mds-background-section-brand-primary-lowest`
- `.mds-background-adaptive-brand-secondary-mid`
- `.mds-background-adaptive-utility-success-high`
- `.mds-background-overlay`
- `.mds-text-brand-neutral-default`
- `.mds-text-brand-primary-mid`
- `.mds-text-inverse`
- `.mds-icons-brand-secondary-mid`
- `.mds-icons-utility-danger-mid`

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
- `.mds-shadow-hover-sm`
- `.mds-shadow-hover-md`

## Grid Utilities

The preferred grid span API is numeric:

```html
<div class="mds-grid-span-6"></div>
```

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

Install dependencies and build from the package directory:

```bash
npm install
npm run build
```

The build compiles the Sass entrypoints into `dist/`.

## Extending Utilities

To add a new utility family:

1. Add the token-backed scale to `src/mixins/_scales.scss`
2. Add or reuse a mixin under `src/mixins/`
3. Call that mixin from `src/utilities.scss`
4. Rebuild with `npm run build`

This keeps the authored source small while still producing explicit CSS for consumers.
