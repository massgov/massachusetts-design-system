# Massachusetts Design System Components Next

Twig-authored static components for the Massachusetts Design System.

This package is intentionally separate from the legacy root-level `components/`
workspace, which is named `@massds/mds-components-legacy`. It is a fresh
implementation path for components that can render static HTML, CSS, and
JavaScript.

## Scripts

```bash
npm run build --workspace @massds/mds-components
```

The build writes distributable files into `dist/`.

## Button

Source files live in `src/button/`:

- `button.twig` for the authored markup
- `button.css` for component styles
- `button.js` for optional browser behavior

The public JavaScript API is exported from `@massds/mds-components/button`.
