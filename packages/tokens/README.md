# Massachusetts Design System Tokens

CSS design tokens for the Massachusetts Design System. This package publishes CSS variable files that can be imported into applications, component libraries, and other front-end builds.

For general guidance on how to use the Design System, check out the [Design System Microsite](https://www.mass.gov/massachusetts-design-system).

## Installation

```bash
npm install @massds/mds-tokens
```

## Package Contents

The published package includes token files under `dist/`:

```text
dist/
├── index.css
└── primitives.css
```

- `dist/index.css` contains the semantic tokens intended for application use
- `dist/primitives.css` contains lower-level primitive tokens used to build the semantic layer (Do not reference directly)

## Usage

Import the semantic token file from your CSS entrypoint:

```css
@import "@massds/mds-tokens/dist/index.css";
```

Use `index.css` as the public entrypoint for the package. Applications should not reference `primitives.css` directly, primitive values are for theming and may change as the design system evolves.

## Source Layout

Source files live under `src/` and are copied into `dist/` during the build:

```text
src/
├── index.css
└── primitives.css
```

The `test-page/` directory is only for local validation and is not published to npm.


## Development

Install dependencies, lint the source files, and then build the distributable files from this package directory:

```bash
npm install
npm run lint
npm run build
```

Individual lint commands:

```bash
npm run lint:css
npm run lint:html
```

The build copies the CSS token source files from `src/` into `dist/`.

## Publishing

The package is published to npm as `@massds/mds-tokens` with the GitHub Actions workflow at `.github/workflows/publish-tokens.yml`.

Recommended branch and tag strategy for tokens:

- Use `main` as the long-lived release branch for `@massds/mds-tokens`.
- Merge tokens release work into `main` through a pull request with required checks.
- Create tokens release tags only from commits already on `main`.
- Use the `tokens-v*` tag prefix for every tokens release.

Tokens release flow:

1. Create a release branch from `main`, based on [semantic versioning](https://semver.org/), for example `release/tokens-1.0.0`
2. Update `packages/tokens/package.json` to the release version
3. Run `npm run changelog:release -- <version> <date>` from `packages/tokens`, or omit arguments to use the version from `package.json` and today’s date
4. Merge the release branch into `main` through a pull request
5. In the GitHub UI, create the release tag for the merged release commit using the format `tokens-v*`, for example `tokens-v1.0.0`
6. In the GitHub Release for that tag, copy the relevant release notes from `packages/tokens/CHANGELOG.md`
7. Creating the tag in GitHub triggers `.github/workflows/publish-tokens.yml` to publish the package

- Stable releases use tags such as `tokens-v1.0.0` and publish to the npm `latest` dist-tag.
- Prereleases use tags such as `tokens-v1.1.0-beta.1` and publish to the npm `beta` dist-tag.


Questions? Email the Massachusetts Design System Team at <designsystem@mass.gov>
