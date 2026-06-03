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
- `button.data.js` for defaults, options, and examples
- `button.render.js` for Twig rendering and data normalization
- `build.js` for Button-specific package artifacts
- `button.css` for component styles
- `button.js` for optional browser behavior

The public JavaScript API is exported from `@massds/mds-components/button`.
The shared build script discovers components and delegates component-specific
package artifacts to each component directory.

`renderButton()` follows the Figma component properties:

- `type`: `Fill`, `Outline`, `Ghost`
- `color`: `Primary`, `Secondary`, `Light`, `Danger`
- `size`: `Regular`, `LG`
- `text`: button label text
- `leftIcon`: optional icon name
- `rightIcon`: optional icon name

Use `htmlType` for the native HTML button type: `button`, `submit`, or `reset`.
