# Massachusetts Design System Components Next

Twig-authored static components for the Massachusetts Design System.

This package is intentionally separate from the legacy root-level `components/`
workspace, which is named `@massds/mds-components-legacy`. It is a fresh
implementation path for components that can render static HTML, CSS, and
Twig templates.

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
import '@massds/mds-components/index.css';
import '@massds/mds-components/button.css';
import buttonHtml from '@massds/mds-components/button.html?raw';
import buttonCss from '@massds/mds-components/button.css?raw';
import buttonTwig from '@massds/mds-components/button.twig?raw';
```

Use these package paths in docs and examples instead of relative `dist/` paths.
They are the supported public API and apply to every component:

- CSS: `@massds/mds-components/<component>.css`
- HTML: `@massds/mds-components/<component>.html`
- Twig: `@massds/mds-components/<component>.twig`

The aggregate component stylesheet is exported from `@massds/mds-components/index.css`.

When adding a new component, keep its distributable files in `dist/<component>/`. No package export change is needed as long as the component build writes the standard files:

- `dist/<component>/<component>.css`
- `dist/<component>/<component>.html`
- `dist/<component>/<component>.twig`

## Shared Rendering

Shared render helpers live in `src/shared/`. Use `createTwigRenderer()` when a
component needs to compile a Twig template and render it with component data.
Keep component-specific markup decisions in the `.twig` file whenever possible.

When a component Twig template includes another component, use a static Twig
include:

```twig
{% include 'icon.twig' with {
  name: leftIconName,
  decorative: true
} %}
```

The shared build scans these static includes, registers the included Twig
templates, exposes the included components' exported data to Twig, and passes
along renderer-only data such as the icon SVG map.

Static includes can appear inside Twig control flow as long as the template
name is still a literal string:

```twig
{% if showIcon %}
  {% include 'icon.twig' %}
{% else %}
  {% include 'state-seal.twig' %}
{% endif %}
```

Avoid dynamic include targets such as `{% include templateName %}` or
`{% include componentName ~ '.twig' %}`. The shared build only auto-discovers
literal include paths, so dynamic template names are not automatically
registered for nested component rendering.

## Data Schemas

Each component should define accepted data in `<component>.schema.js`. Use the
schema as the source of truth for defaults and option lists, then derive the
compatibility exports in `<component>.data.js`.

Shared schema helpers live in `src/shared/schema.js`.

For the standard component workflow, every component should also include
`<component>.data.js`. The shared build reads that file automatically and uses
it as the component's default render context.

At minimum, `<component>.data.js` must export
`<camelComponentName>Defaults`. The shared build uses that export to render the
default `<component>.html` output.

```js
import { getSchemaDefaults } from '../shared/schema.js';
import { myComponentSchema } from './my-component.schema.js';

export { myComponentSchema } from './my-component.schema.js';

export const myComponentDefaults = getSchemaDefaults(myComponentSchema);
```

Additional non-function exports are optional. Use them for values that Twig may
need directly, such as option lists, aliases, computed constants, asset maps,
or example data. Those non-function exports become available in Twig render
context. `*Schema` exports are allowed for JS consumers, but are not exposed to
Twig render context.

Current components show the range of expected `.data.js` files:

- [`state-banner.data.js`](/Users/minghuasun/Documents/Github/massachusetts-design-system/packages/components/src/state-banner/state-banner.data.js) only exports defaults
- [`button.data.js`](/Users/minghuasun/Documents/Github/massachusetts-design-system/packages/components/src/button/button.data.js) exports defaults plus option helpers
- [`state-seal.data.js`](/Users/minghuasun/Documents/Github/massachusetts-design-system/packages/components/src/state-seal/state-seal.data.js) exports defaults plus computed asset data

`button` is not an exception to this pattern. It still has
[`button.data.js`](/Users/minghuasun/Documents/Github/massachusetts-design-system/packages/components/src/button/button.data.js); what changed is that the standard build path no longer requires a local `build.js` or `button.render.js`.

## Component Folders

Each component lives in `src/<component>/`. Keep component-specific API notes,
usage guidance, and property details close to that component when they are
needed.

Use this file structure for new components:

- `<component>.twig` for authored markup
- `<component>.schema.js` for accepted data, defaults, and options
- `<component>.data.js` for defaults, options, and examples
- `<component>.scss` for component styles
- `README.md` for component-specific implementation notes, when useful

Most components do not need a local `build.js` or `<component>.render.js`.
The shared build script now handles the standard case automatically:

- it reads `<component>.data.js` and uses `<camelComponentName>Defaults`
- it renders `<component>.html` from `<component>.twig`
- it discovers static Twig includes and registers included templates
- it exposes exported data from included components to the parent Twig context

Add `<component>.render.js` only when a component needs custom rendering logic
that cannot be expressed with exported data and static includes.

Add `build.js` only when a component needs extra build hooks such as
`getRendererOptions()`, `sourceFiles`, or `writeAdditionalOutputs`. A hook-only
`build.js` can export those values directly without wrapping them in
`createComponentBuild()`.

The shared build still supports `createComponentBuild()` from
`scripts/component-build.js` for advanced cases, but it is now the escape hatch
rather than the default workflow.

Component SCSS can use shared style mixins with Sass package imports, for
example `@use "pkg:@massds/mds-styles/scss/mixins" as mixins;`.
Use `@include mixins.text("<style-name>")` for component typography so compiled
component CSS stays aligned with the typography utilities from
`@massds/mds-styles`.
