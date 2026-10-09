# Massachusetts Design System Components

Twig-authored static components for the Massachusetts Design System.

The `@massds/mds-components` workspace lives in `packages/components/` and
produces static HTML, CSS, and Twig templates.

## Scripts

```bash
npm run build --workspace @massds/mds-components
```

The build writes distributable files into `dist/`.

### Linting

From the repository root:

```bash
npm run lint:components
npm run lint:scss --workspace @massds/mds-components
npm run lint:scss:fix --workspace @massds/mds-components
npm run lint:twig --workspace @massds/mds-components
npm run format:twig --workspace @massds/mds-components
```

SCSS uses Stylelint's recommended SCSS rules for basic syntax and common errors.
Descending specificity checks are disabled for nested component selectors.
Twig linting checks syntax and formatting for every `src/**/*.twig` template,
including shared partials. Syntax checks use the same Twig.js dependency as the
build and report errors with file paths. Formatting uses Prettier with
[`@destination/prettier-plugin-twig`](https://github.com/wearedestination/prettier-plugin-twig),
two-space indentation, LF line endings, and a 100-character target line width.
Run `format:twig` to apply formatting. Syntax and formatting checks can also be
run separately with `lint:twig:syntax` and `lint:twig:format`.
These checks do not render templates or validate runtime data or include targets.

The root `npm run lint` includes both checks. GitHub Actions runs them on component
pull requests, pushes to `main`, and before publishing the components package.

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
It is compiled from `src/index.scss` in one Sass compilation, so shared
dependencies loaded with `@use` appear only once. Individual component CSS files
are compiled separately and can bundle their own dependencies.

When adding component styles, add their `@use` statement to `src/index.scss`
so they are included in the aggregate stylesheet.

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

For component class naming, selector, token, and mixin standards, see
[`CODE_STANDARDS.md`](docs/CODE_STANDARDS.md).

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

## Changelogs

Add a Markdown fragment under `changelog.d/` for changes to this package, using
`changelog.d/changelog.template.md` as a starting point. CI checks for a fragment
when component source, build scripts, or package metadata change.

When preparing a release, compile the fragments from the repository root:

```bash
npm run changelog:release --workspace @massds/mds-components
```

This uses the version in `package.json`, updates `CHANGELOG.md`, and removes the
released fragments. Optional version and date arguments can be passed after `--`.

## Publishing

The package publishes through
[`publish-components.yml`](../../.github/workflows/publish-components.yml).
Pushing a `components-v<version>` tag triggers a release; the workflow rejects
tags that do not match this package's version. It can also be run manually with
GitHub Actions' **Run workflow** control to publish the version at the selected ref.

The workflow installs dependencies from the root lockfile, builds all package
workspaces so local dependency exports are available, inspects the package with
`npm pack --dry-run`, and publishes with provenance. Stable versions publish
to `latest`; versions containing a prerelease suffix publish to `beta`.
The current `0.1.0` version is a stable release and uses `latest`.

### Initial npm setup

If the package does not yet exist on npm, an npm maintainer with publish access
to the `@massds` scope must publish the first version before configuring its
trusted publisher. From the repository root:

```bash
npm ci
npm run build
npm pack --dry-run --workspace @massds/mds-components
npm login
npm publish --workspace @massds/mds-components --access public
```

For an initial prerelease version, add `--tag beta` to the publish command.
The initial local publish does not generate GitHub Actions provenance.

After the first publish, open the package's npm **Settings → Trusted publishing**
and add a GitHub Actions publisher with:

- Organization: `massgov`
- Repository: `massachusetts-design-system`
- Workflow filename: `publish-components.yml`
- Environment: leave blank (this workflow does not use a GitHub environment)
- Allowed actions: enable direct publishing with `npm publish`

This workflow uses OIDC, so no npm publish token is required in GitHub secrets.
It explicitly installs npm `11.5.1`, the minimum version supporting trusted
publishing, while keeping the repository's Node version. See the
[npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).
New trusted-publisher configurations must complete a successful publish within
two days; configure it when the next release is ready, or recreate it if it expires.

### Subsequent releases

1. Create `release/components-<version>` from `main`.
2. Update `packages/components/package.json` and refresh the root lockfile with
   `npm install --package-lock-only`.
3. Run `npm run build` and inspect the package with
   `npm pack --dry-run --workspace @massds/mds-components`.
4. Compile the changelog fragments and commit the version, lockfile, and changelog changes.
5. Merge the release PR into `main` and create `components-v<version>` on the release commit.
6. The tag triggers GitHub Actions to publish the new version to npm.

An already published version cannot be published again. After the initial local
publish, bump the version before triggering the first CI release.
