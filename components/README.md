# Massachusetts Design System Components

Required HTML, CSS, and JavaScript components for the Massachusetts Design System.

Components compile any shared `@massds/mds-styles` Sass into their own `styles.css` at build time. Component examples should only require tokens as an external stylesheet at runtime.

## Quick Start

Install dependencies from the repository root:

```bash
npm install
```

Run component commands from this directory:

```bash
npm run build
npm run lint
npm run demo
```

When a change is made in another package locally, run all workspace builds or lints from the root to update the package build before refreshing the component demo site:

```bash
npm run build
npm run lint
```

## Scripts

- `npm run build` compiles component source files, including `styles.scss` to `styles.css`, then writes publishable HTML and CSS to `dist/required-components/`
- `npm run clean` removes generated component CSS and the `dist/` output
- `npm run lint` runs HTML and SCSS lint checks
- `npm run lint:html` lints component demo HTML
- `npm run lint:scss` lints component SCSS
- `npm run lint:scss:fix` applies safe Stylelint fixes
- `npm run demo` builds components, starts the local demo server, and opens it in a browser

## Local Examples

Component examples live in `required-components/`.

The demo entry page is `required-components/index.html`. Add each new component example in its own folder, then link to it from the entry page.

Source HTML can use local workspace package routes such as `/@massds/mds-tokens/dist/index.css`.
During `npm run build`, those routes are rewritten in `dist/required-components/**/*.html` to versioned unpkg URLs using the versions declared in `devDependencies`.
