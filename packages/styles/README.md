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
- `dist/utilities.css` contains generated utility classes
- `dist/index.css` imports the helper and utility layers together

## Usage

Import tokens first, then styles:

```css
@import "@massds/mds-tokens/dist/index.css";
@import "@massds/mds-styles/dist/index.css";
```

This package does not rebundle tokens. Keeping tokens and styles separate makes it easier to update each layer independently and avoids duplicating CSS variables across packages.

## Source Layout

```text
src/
├── _config.scss
├── helpers.scss
├── index.scss
└── utilities.scss
```

- `_config.scss` stores the Sass maps and mixins that generate utilities
- `helpers.scss` contains authored structural classes
- `utilities.scss` emits utility classes from the config maps
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

1. Add the token-backed scale to `src/_config.scss`
2. Add or reuse a mixin that emits the classes you want
3. Call that mixin from `src/utilities.scss`
4. Rebuild with `npm run build`

This keeps the authored source small while still producing explicit CSS for consumers.
