# Massachusetts Design System Styles

Helper and utility CSS for the Massachusetts Design System. This package is intended to sit on top of `@massds/mds-tokens` and provide composable layout and spacing classes generated from a small Sass source layer.

## Installation

```bash
npm install @massds/mds-tokens @massds/mds-styles
```

## Package Contents

The published package includes generated CSS files under `dist/`:

```text
dist/
├── helpers.css
├── index.css
└── utilities.css
```

- `dist/helpers.css` contains reusable structural classes such as the grid container and section container
- `dist/utilities.css` contains generated utility classes such as spacing, radius, shadow, gap, and grid span utilities
- `dist/index.css` imports the helper and utility layers together

## Usage

Import tokens first, then styles:

```css
@import "@massds/mds-tokens/dist/index.css";
@import "@massds/mds-styles/dist/index.css";
```

This package does not rebundle tokens. Keeping tokens and styles separate makes it easier to update each layer independently and avoids duplicating CSS variables across packages.

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
<div class="mds-shadow__container"></div>
```

Available classes:

- `.mds-shadow__container`
- `.mds-shadow__modal`
- `.mds-shadow__hover--sm`
- `.mds-shadow__hover--md`

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
├── mixins/
│   ├── _grid.scss
│   ├── _space.scss
│   ├── _scales.scss
│   └── index.scss
├── helpers.scss
├── index.scss
└── utilities.scss
```

- `mixins/_scales.scss` stores the token-backed scales shared by utility generation
- `mixins/_space.scss` and `mixins/_grid.scss` contain specialized utility mixins
- `mixins/index.scss` forwards the mixin API so files can `@use "./mixins"`
- `helpers.scss` contains authored structural classes
- `utilities.scss` emits utility classes from the shared mixins module, including numeric grid spans such as `.mds-grid-span-6`
- `index.scss` is the package entrypoint that imports both layers

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
2. Add or reuse a mixin under `src/mixins/`, or use `emit-literal-utilities()` when the scale keys should map directly into the class suffix
3. Call that mixin from `src/utilities.scss`
4. Rebuild with `npm run build`

This keeps the authored source small while still producing explicit CSS for consumers.
