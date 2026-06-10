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

## Public Imports

Component entry points are exported with wildcard paths. When a component has a
matching file in `dist/<component>/`, consumers can import it with the flat
public package path:

```js
import { renderButton } from '@massds/mds-components/button';
import '@massds/mds-components/index.css';
import '@massds/mds-components/button.css';
import buttonHtml from '@massds/mds-components/button.html?raw';
import buttonCss from '@massds/mds-components/button.css?raw';
```

Use these package paths in docs and examples instead of relative `dist/` paths.
They are the supported public API and apply to every component:

- JavaScript: `@massds/mds-components/<component>`
- CSS: `@massds/mds-components/<component>.css`
- HTML: `@massds/mds-components/<component>.html`

The aggregate component stylesheet is exported from
`@massds/mds-components/index.css`.

When adding a new component, keep its distributable files in
`dist/<component>/`. No package export change is needed as long as the component
build writes the standard files:

- `dist/<component>/index.js`
- `dist/<component>/<component>.css`
- `dist/<component>/<component>.html`

## Shared Rendering

Shared render helpers live in `src/shared/`. Use `createTwigRenderer()` when a
component needs to compile a Twig template and render it with component data.
Keep component-specific markup decisions in the `.twig` file whenever possible.

## Data Schemas

Each component should define accepted data in `<component>.schema.js`. Use the
schema as the source of truth for defaults and option lists, then derive the
compatibility exports in `<component>.data.js`.

Shared schema helpers live in `src/shared/schema.js`.

## Component Folders

Each component lives in `src/<component>/`. Keep component-specific API notes,
usage guidance, and property details close to that component when they are
needed.

Use this file structure for new components:

- `<component>.twig` for authored markup
- `<component>.schema.js` for accepted data, defaults, and options
- `<component>.data.js` for defaults, options, and examples
- `<component>.render.js` for Twig rendering and data normalization
- `<component>.scss` for component styles
- `build.js` for component-specific package artifacts
- `README.md` for component-specific implementation notes, when useful

The shared build script discovers components and delegates component-specific
package artifacts to each component directory.
Component SCSS can use shared style mixins with Sass package imports, for
example `@use "pkg:@massds/mds-styles/scss/mixins" as mixins;`.
