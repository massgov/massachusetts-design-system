# Massachusetts Design System Components

Experimental distribution of Massachusetts Design System Twig templates, generated static HTML, and compiled component CSS.

We chose HTML, CSS, and JavaScript as the common baseline for our coded components because these browser standards provide a shared foundation across the widest range of use cases and technology stacks. The primary adoption approach is to copy the HTML, compiled CSS, and any JavaScript examples provided in [Storybook](https://designsystem.mass.gov) into your project.

Your implementation team chooses its frontend technology and adapts the markup, styles, and behavior into its own framework components or templates. Twig is used to author our source templates; it is not required to adopt the HTML and CSS.

## Adopt Components From Storybook

1. Read the component's Overview and Guidance pages, then open its Code page and configure the example with the available controls.
2. Copy the **HTML** snippet into your page or adapt it into your application's component or template.
3. Copy the **CSS** snippet into a stylesheet your application loads. It is compiled CSS; Sass is not required.
4. Load `@massds/mds-tokens/dist/index.css` before component CSS and keep any referenced image URLs accessible.
5. Implement the documented interaction behavior in your application, preserving the markup's semantic structure, accessibility attributes, and relationship to the CSS selectors.

Installing `@massds/mds-components` is optional for this workflow. Your team owns framework integration, data binding, and interaction behavior. See [Using Components](https://designsystem.mass.gov/?path=/docs/overview-getting-started-using-components--docs) for the full adoption guidance.

## Use the Experimental Package

The `@massds/mds-components` package exposes the Twig templates, generated static HTML, and compiled CSS as an alternative way to access component files. Teams can consume these files through their own build tools or Twig integration.

```bash
npm install @massds/mds-components @massds/mds-tokens
```

Load token CSS separately. Component CSS already includes the shared styles incorporated from `@massds/mds-styles` mixins at build time. You only need the styles package when you also want its utility classes or author Sass with its mixins. See [Using Styles](https://designsystem.mass.gov/?path=/docs/overview-getting-started-using-styles--docs) and [Using Assets](https://designsystem.mass.gov/?path=/docs/overview-getting-started-using-assets--docs) for setup.

## Asset Dependencies and Package Installation

Components that display icons or state seals depend on asset content from `@massds/mds-assets`. That asset dependency does not require consumers to install the assets npm package. Generated markup embeds icons as inline SVG. State seals use versioned CDN image URLs in generated markup and, for the footer, compiled CSS. Keep those URLs accessible or replace them with your own hosted copies.

The assets package remains a development dependency for building and rendering components in this repository. Consumers can install it for direct access to asset files or self-hosting, but can also obtain files from the CDN.

## Scripts

```bash
npm run build --workspace @massds/mds-components
```

The build writes distributable files into `dist/`.

After adding, renaming, or removing icons in `packages/assets/src/icons/static`,
refresh the icon options used by component schemas:

```bash
npm run sync:icon-names --workspace @massds/mds-components
```

This regenerates `src/icon/icon.names.js` from the regular and bold asset filenames.

### Linting

From the repository root:

```bash
npm run lint:components
npm run lint:scss --workspace @massds/mds-components
npm run lint:scss:fix --workspace @massds/mds-components
npm run lint:twig --workspace @massds/mds-components
npm run lint:twig:fix --workspace @massds/mds-components
```

SCSS uses Stylelint's recommended SCSS rules for basic syntax and common errors.
Descending specificity checks are disabled for nested component selectors.
Twig linting checks syntax and formatting for every `src/**/*.twig` template,
including shared partials. Syntax checks use the same Twig.js dependency as the
build and report errors with file paths. Formatting uses Prettier with
[`@destination/prettier-plugin-twig`](https://github.com/wearedestination/prettier-plugin-twig),
two-space indentation, LF line endings, and a 100-character target line width.
Run `lint:twig:fix` to apply formatting. Syntax and formatting checks can also be
run separately with `lint:twig:syntax` and `lint:twig:format`.
These checks do not render templates or validate runtime data or include targets.

The root `npm run lint` includes both checks. GitHub Actions runs them on component
pull requests, pushes to `main`, and before publishing the components package.

## Experimental Package Imports

Component entry points are exported with wildcard paths. When a component has a
matching file in `dist/<component>/`, consumers can import it with the flat
public package path:

```js
import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-components/button.css';
import buttonHtml from '@massds/mds-components/button.html?raw';
import buttonCss from '@massds/mds-components/button.css?raw';
import buttonTwig from '@massds/mds-components/button.twig?raw';
```

The `?raw` imports above are a Vite example for reading files as strings. Adapt file loading to your build tool. Importing HTML or Twig does not render it automatically; insert the markup into your page or render the template through your Twig integration.

For package consumption, use these public paths instead of reaching into `dist/` directly. They apply to every component:

- CSS: `@massds/mds-components/<component>.css`
- HTML: `@massds/mds-components/<component>.html`
- Twig: `@massds/mds-components/<component>.twig`

Use `@massds/mds-components/index.css` instead of individual component CSS imports when you need the aggregate component stylesheet.
It is compiled from `src/index.scss` in one Sass compilation, so shared
dependencies loaded with `@use` appear only once. Individual component CSS files
are compiled separately and can bundle their own dependencies.

When adding component styles, add their `@use` statement to `src/index.scss`
so they are included in the aggregate stylesheet.

When adding a new component, keep its distributable files in `dist/<component>/`. No package export change is needed as long as the component build writes the standard files:

- `dist/<component>/<component>.css`
- `dist/<component>/<component>.html`
- `dist/<component>/<component>.twig`

## Main navigation

Render `main-navigation.twig` using the defaults and options from
`src/main-navigation/main-navigation.data.js`. The `Responsive` variant is
horizontal above 768px and stacked at 768px and below. The `Stacked` variant is
vertical at every width, with a maximum width of 480px.

Items accept `text`, `href`, optional `children`, `current`, and `expanded`.
Parents with children disclose links; items without children navigate directly.
Use a unique `id` for each navigation instance. Initialize after inserting the
rendered markup:

```js
import '@massds/mds-components/main-navigation.css';
import { initMainNavigation } from '@massds/mds-components/main-navigation.js';

const cleanup = initMainNavigation(document);
// Call cleanup() before removing the navigation.
```

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

- [`state-banner.data.js`](src/state-banner/state-banner.data.js) only exports defaults
- [`button.data.js`](src/button/button.data.js) exports defaults plus option helpers
- [`state-seal.data.js`](src/state-seal/state-seal.data.js) exports defaults plus computed asset data

`button` is not an exception to this pattern. It still has
[`button.data.js`](src/button/button.data.js); what changed is that the standard build path no longer requires a local `build.js` or `button.render.js`.

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

The `prechangelog:release` hook first pins Storybook's assets, components, styles,
and tokens dependencies to the exact versions in their workspace manifests and
refreshes the root `package-lock.json`. If refreshing the lockfile fails, the
Storybook manifest and lockfile are restored.

The changelog command then uses the version in `package.json`, updates
`CHANGELOG.md`, and removes the released fragments. Optional version and date
arguments can be passed after `--`; update the package version before running
the command so Storybook is aligned with the actual release version.

To prepare only Storybook's dependency versions without compiling changelog
fragments, run this from the repository root:

```bash
node scripts/prepare-storybook-release.mjs
```

## Publishing

The package publishes through
[`publish-components.yml`](../../.github/workflows/publish-components.yml).
Pushing a `components-v<version>` tag triggers a release; the workflow rejects
tags that do not match this package's version. Manual dispatch is also limited
to the matching release tag; dispatches from branch refs fail before publishing.
After a successful publish from a matching release tag, a follow-up workflow
deploys the Storybook snapshot to `/version/<version>/` through the gated `prod`
environment. The follow-up runs from `main` to satisfy the prod environment's
branch policy, then checks out and verifies the release tag's commit before
deployment.
For the full Storybook snapshot and deployment process, see the
[Storybook release guide](../../storybook/README.md#release-and-versioned-deployments).
To retry a versioned deployment after a rejected or failed approval, or to
backfill an older release, manually run the production deploy workflow from
`main` and enter the exact components version.

The workflow installs dependencies from the root lockfile, builds all package
workspaces so local dependency exports are available, inspects the package with
`npm pack --dry-run`, and publishes with provenance. Stable versions publish
to `latest`; versions containing a prerelease suffix publish to `beta`.
The initial `0.1.0-beta.0` version uses the `beta` dist-tag and release tag
`components-v0.1.0-beta.0`.

### Initial npm setup

If the package does not yet exist on npm, an npm maintainer with publish access
to the `@massds` scope must publish the first version before configuring its
trusted publisher. From the repository root:

```bash
npm ci
npm run build
npm pack --dry-run --workspace @massds/mds-components
npm login
npm publish --workspace @massds/mds-components --access public --tag beta
```

The initial release is a prerelease, so the publish command uses `--tag beta`.
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
2. Update the version in `packages/components/package.json` and any shared
   dependency ranges that need to change for the release.
3. Run `npm run changelog:release --workspace @massds/mds-components` to align
   Storybook dependencies, refresh the root lockfile, and compile changelog fragments.
4. Run `npm ci`, `npm run build`, and `npm run build:storybook`. Inspect the package
   with `npm pack --dry-run --workspace @massds/mds-components`, then commit the
   components and Storybook manifests, lockfile, and changelog changes.
5. Merge the release PR into `main` and create `components-v<version>` on the release commit.
6. The tag triggers GitHub Actions to publish the new version to npm.

An already published version cannot be published again. After the initial local
publish, bump the version before triggering the first CI release.
