# Massachusetts Design System Styles

Shared Sass and bundled CSS for the Massachusetts Design System. This package is intended to sit on top of `@massds/mds-tokens`, provide composable utility classes for standalone use, and give component packages build-time mixins for self-contained component CSS.

## Installation

```bash
npm install @massds/mds-styles @massds/mds-tokens
```

## Usage

Import tokens first, then styles:

```css
@import "@massds/mds-tokens/dist/index.css";
@import "@massds/mds-styles/dist/css/index.min.css";
```

The package also exposes shorter CSS entrypoints for bundlers that honor package exports:

```css
@import "@massds/mds-styles/index.min.css";
```

This package does not rebundle tokens. Keeping tokens and styles separate makes it easier to update each layer independently and avoids duplicating CSS variables across packages. The build publishes a bundled `dist/css/index.css` for readable distribution and a bundled, minified `dist/css/index.min.css` for production use.

For Sass consumers, the package publishes build-time SCSS under `dist/scss`:

```scss
@use "pkg:@massds/mds-styles/scss";
@use "pkg:@massds/mds-styles/scss/mixins";
```

Use Sass's Node package importer for `pkg:` imports.

## Package Contents

The published package includes bundled CSS and Sass files under `dist/`:

```text
dist/
├── css/
│   ├── index.css
│   └── index.min.css
└── scss/
    ├── index.scss
    └── mixins/
        ├── _breakpoints.scss
        ├── _focus.scss
        ├── _grid.scss
        ├── _layout.scss
        ├── _resets.scss
        └── index.scss
```

The source files remain authored under `src/` in this repository. The public mixin modules are copied into `dist/scss/` at build time for consumers and component packages.

```text
src/
├── class-generators/
├── index.scss
├── mixins/
│   ├── _breakpoints.scss
│   ├── _focus.scss
│   ├── _grid.scss
│   ├── _layout.scss
│   ├── _resets.scss
│   └── index.scss
```

- `dist/css/index.css` is the bundled unminified package entry stylesheet
- `dist/css/index.min.css` is the bundled, minified production stylesheet for the package
- `dist/scss/mixins/_layout.scss` exposes structural layout mixins, so component packages can include layout styles without requiring helper classes in markup
- `dist/scss/mixins/_resets.scss` exposes shared reset mixins for component builds

## Naming Conventions

Utilities and layout classes use flat, token-driven classnames, for example `.mds-padding-inline-md`, `.mds-gap-sm`, `.mds-shadow-container` and `mds-section-container`.

As a rule of thumb, helper classes describe reusable structural patterns, while utilities describe one specific CSS property driven by a token scale.

## Source Layout

```text
src/
├── class-generators/
│   ├── _colors.scss
│   ├── _helpers.scss
│   ├── _scales.scss
│   ├── _utilities.scss
│   ├── emitters/
│   │   ├── _base.scss
│   │   ├── _grid-spans.scss
│   │   ├── _space.scss
│   │   └── _stateful.scss
│   └── index.scss
├── index.scss
├── mixins/
│   ├── _breakpoints.scss
│   ├── _grid.scss
│   ├── _layout.scss
│   ├── _resets.scss
│   └── index.scss
```

- Root `index.scss` and `mixins/` are the public, component-facing Sass API
- `mixins/_focus.scss` contains focus-state styling mixins
- `mixins/_resets.scss` contains reset mixins shared by component builds
- `mixins/_layout.scss` contains component-facing layout mixins such as `body` and `section-container`
- `mixins/_grid.scss` contains component-facing grid mixins
- `mixins/index.scss` forwards the public shared mixin API so files can `@use "./mixins"`
- `class-generators/index.scss` is the internal CSS build entrypoint
- `class-generators/_colors.scss`, `_helpers.scss`, and `_utilities.scss` define which classes get emitted
- `class-generators/_scales.scss` stores token-backed scales shared by generated class families
- `class-generators/emitters/` contains reusable class-emitter mixins

## Notes

If you update the Sass source or utility naming, run `npm run build` in `packages/styles` before checking the demo pages so `dist/` matches the latest source.

## Development

Install dependencies from the repository root, then run style package commands from this package directory or with npm workspaces:

```bash
npm install
npm run build
```

The build compiles the bundled CSS entrypoint into `dist/css/` and copies Sass modules into `dist/scss/`.

For local Sass development, use the watcher:

```bash
npm run watch
```

This opens the styles demo through a local server with hot reload. It keeps the class generator entrypoint in `packages/styles/src/class-generators/` synced to `packages/styles/dist/css/`, mirrors public Sass modules into `packages/styles/dist/scss/`, mirrors `packages/tokens/src/` into `packages/tokens/dist/`, and reloads the browser when compiled styles, token CSS, or demo files change. The demo server exposes npm workspace packages at URLs such as `/@massds/mds-tokens/dist/index.css`, so demo pages do not need fragile `../` paths back through the repository.

You can also run the demo without Sass watchers:

```bash
npm run demo
```

From the workspace root, use `npm run demo:styles` or `npm run watch:styles`.

## Extending Utilities

To add a new utility family:

1. Add the token-backed scale to `src/class-generators/_scales.scss`
2. Add or reuse an emitter under `src/class-generators/emitters/`
3. Call that emitter from `src/class-generators/_utilities.scss`
4. Rebuild with `npm run build`

This keeps the authored source small while still producing explicit CSS for consumers.

## Changelogs

For each PR, add a changelog fragment under `packages/styles/changelog.d/` using the example in `changelog.template.md`.

When preparing a release, run `npm run changelog:release -- <version> <date>` from `packages/styles`, or omit arguments to use the version from `package.json` and today’s date.

## Publishing

The package is published to npm as `@massds/mds-styles` with the GitHub Actions workflow at `.github/workflows/publish-styles.yml`.

Recommended branch and tag strategy for styles:

- Use `main` as the long-lived release branch for `@massds/mds-styles`.
- Merge styles release work into `main` through a pull request with required checks.
- Create styles release tags only from commits already on `main`.
- Use the `styles-v*` tag prefix for every styles release.

Styles release flow:

1. Create a release branch from `main`, based on [semantic versioning](https://semver.org/), for example `release/styles-0.1.1`
2. Update `packages/styles/package.json` to the release version
3. Run `npm i & npm run build` and commit changes
4. Run `npm run changelog:release -- <version> <date>` from `packages/styles`, or omit arguments to use the version from `package.json` and today’s date
5. Merge the release branch into `main` through a pull request
6. In the GitHub UI, create the release tag for the merged release commit using the format `styles-v*`, for example `styles-v0.1.1`
7. In the GitHub Release for that tag, copy the relevant release notes from `packages/styles/CHANGELOG.md`
8. Creating the tag in GitHub triggers `.github/workflows/publish-styles.yml` to publish the package

Release channels:

- Stable releases use normal semver versions such as `0.1.1` and tags such as `styles-v0.1.1`. These publish to npm on the default `latest` dist-tag.
- Prereleases use semver prerelease versions such as `0.2.0-beta.1` and tags such as `styles-v0.2.0-beta.1`. These publish to npm on the `beta` dist-tag.
