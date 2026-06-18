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

Install dependencies from the repository root, then run style package commands from this package directory or with npm workspaces:

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

## Updating Tokens

### Updating Primitive Tokens

Primitive values live in `src/primitives.css`. Keep this file aligned with the [Base Tokens Figma file](https://www.figma.com/design/Vyi82tH3VdXfny4TYPSwZz/Base-Tokens?view=variables&var-set-id=6092-2764&m=dev), while preserving `primitives.css` as the package deliverable.

#### Syncing Primitive Tokens From Figma

This repo includes a Codex skill, `figma-token-sync`, for comparing the Base Tokens Figma variables to `src/primitives.css` and syncing primitive values into the repo.

Before using the skill:

1. Make sure Codex has the `figma-token-sync` skill installed.
2. Make sure Codex has Figma MCP configured. In Codex, a separate `FIGMA_TOKEN` is not required.
3. Review whether any reported Figma-only collections should remain report-only or become public CSS primitives.

Typical Codex prompts:

```text
Use figma-token-sync to compare the Base Tokens Figma variables against packages/tokens/src/primitives.css and report missing tokens, figma-only tokens, and value mismatches.
```

```text
Use figma-token-sync to sync mapped Base Tokens Figma values into packages/tokens/src/primitives.css, then run lint and build.
```

Helpful repo files:

- `.codex/skills/figma-token-sync/SKILL.md`: Codex workflow for token sync tasks
- `src/primitives.css`: primitive CSS token source
- `src/index.css`: semantic tokens that may reference primitive values

The first sync keeps the current `primitives.css` surface as the package deliverable. It updates existing CSS primitive values from the Figma `Color`, `Type`, `Space`, `Elevation`, and `Border radius` collections; it reports newer Figma-only collections such as dark color variants and `Color (COB)` without publishing them.

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
3. Run `npm i & npm run build` and commit changes
4. Run `npm run changelog:release -- <version> <date>` from `packages/tokens`, or omit arguments to use the version from `package.json` and today’s date
5. Merge the release branch into `main` through a pull request
6. In the GitHub UI, create the release tag for the merged release commit using the format `tokens-v*`, for example `tokens-v1.0.0`
7. In the GitHub Release for that tag, copy the relevant release notes from `packages/tokens/CHANGELOG.md`
8. Creating the tag in GitHub triggers `.github/workflows/publish-tokens.yml` to publish the package

- Stable releases use tags such as `tokens-v1.0.0` and publish to the npm `latest` dist-tag.
- Prereleases use tags such as `tokens-v1.1.0-beta.1` and publish to the npm `beta` dist-tag.


Questions? Email the Massachusetts Design System Team at <designsystem@mass.gov>
