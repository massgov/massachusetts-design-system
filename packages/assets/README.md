# Massachusetts Design System Assets

Shared static assets for the Massachusetts Design System. This package publishes optimized icons, state seal files, and animation assets as plain files that can be consumed by applications, design system packages, or build pipelines.


## Installation

```bash
npm install @massds/mds-assets
```

## Package Contents

The published package includes three asset groups under `dist/`:

```text
dist/
├── animation/
│   └── loader.json
├── icons/
│   ├── alert.svg
│   ├── arrow.svg
│   ├── ...
│   └── bold/
│       ├── alert--bold.svg
│       ├── arrow--bold.svg
│       └── ...
└── state-seal/
    ├── state-seal-black.svg
    ├── state-seal-color.svg
    ├── state-seal-gray.svg
    └── state-seal-white.svg
```

## Asset Types

### Icons

All icons are exported from the [Massachusetts Design System Figma Icon Library](https://www.figma.com/design/ZpxjY5M188i4ItGIvW9Y0s/Icons?t=9d9doUJlYvsBBWr2-0) and optimized for web use in this package. Many icons originate from the open source [Phosphor icon library](https://phosphoricons.com/), with additional Massachusetts-specific icons designed in a compatible style.

- Regular icons live in `dist/icons`
- Bold icons live in `dist/icons/bold`
- Filenames use kebab-case
- Bold variants use the `--bold` suffix

Figma component names use PascalCase, while exported asset filenames use kebab-case. For example, `ArrowUp` in Figma is published as `dist/icons/arrow-up.svg`.

Examples:

```text
dist/icons/alert.svg
dist/icons/bold/alert--bold.svg
```

To browse or search the full icon library, use the [MDS Figma Icon Library](https://www.figma.com/design/ZpxjY5M188i4ItGIvW9Y0s/Icons?node-id=1-40&p=f&t=lYV37uQJ95Vn46ZJ-0).

Style guidance:

- Use bold icons at 24px and below
- Use regular icons above 24px

You can browse the icon set in [Storybook](https://mayflower.digital.mass.gov/core/index.html?path=/docs/foundation-iconography--icons).

### State Seal

The package includes the Massachusetts state seal in multiple SVG variants:

- `dist/state-seal/state-seal-color.svg`
- `dist/state-seal/state-seal-black.svg`
- `dist/state-seal/state-seal-gray.svg`
- `dist/state-seal/state-seal-white.svg`

### Animation

The package currently includes animation assets under `dist/animation`.

- `dist/animation/loader.json`

These files are provided as Lottie JSON assets and are intended for direct use with Lottie-compatible players and libraries, such as `lottie-web`, `react-lottie`, or other tools that consume exported Lottie animation data.

## Source Layout

Source files live under `src/`:

```text
src/
├── animation/
├── icons/
│   ├── scripts/
│   └── static/
└── state-seal/
```

## Development

### Install dependencies:

```bash
npm install
```

### Build the package:

```bash
npm run build
```

The build script:

- optimizes SVG files from `src/icons/static` using `svgo` and outputs them to `dist/icons`
- copies animation assets to `dist/animation`
- copies state seal assets to `dist/state-seal`

### Clean the output directory:

```bash
npm run clean
```

## Updating Assets

### Adding or Updating Icons

1. Add SVG files to `src/icons/static` and its bold variants to `src/icons/static/bold`
2. Run `npm run build`

#### Syncing Icons From Figma

This repo includes a Codex skill, `figma-icon-sync`, for comparing the Figma icon library to the asset package and syncing icons into the repo.

Before using the skill:

1. Refresh `src/icons/scripts/figma-component-set-names.json` with the current component-set names from the `Functional icons` page in Figma.
2. Make sure Codex has the `figma-icon-sync` skill installed and Figma MCP configured.

Typical Codex prompts:

```text
Use figma-icon-sync to compare the Figma icon file against packages/assets/src/icons/static and classify exact matches, renamed files, figma-only icons, and repo-only stale icons.
```

```text
Use figma-icon-sync to export the figma-only icons into packages/assets/src/icons/scripts/figma-unsynced-manifest.json and sync them into static and static/bold without optimization.
```

Helpful repo files:

- `src/icons/scripts/figma-component-set-names.json`: current Figma component-set names
- `src/icons/scripts/icon-name-inventory.json`: latest repo vs Figma comparison
- `src/icons/scripts/figma-unsynced-manifest.json`: incremental export manifest for new or changed icons

The sync command in this package is:

```bash
npm run sync:figma-icons -- --manifest src/icons/scripts/figma-unsynced-manifest.json
```

For a full cleanup sync, use a full-library manifest and `--prune`. Only use stale cleanup after reviewing `icon-name-inventory.json`.

### Updating State Seal Assets

1. Replace or add files in `src/state-seal`
2. Run `npm run build`

### Updating Animation Assets

1. Replace or add files in `src/animation`
2. Run `npm run build`


## Changelogs

For each PR, it's required to add a changelog under `packages/assets/changelog.d/` following the example in `changelog.template.md`.

2. Run `npm run changelog:release -- <version> <date>` from `packages/assets`, or omit arguments to use the version from `package.json` and today’s date


## Publishing

The package is published to npm as `@massds/mds-assets` with the GitHub Actions workflow at `.github/workflows/publish-assets.yml`.

The publish workflow:
1. Create a release branch from `main`, based on [semantic versioning](https://semver.org/), e.g. release/assets-1.0.1 
2. On that branch:
    - compile changelog fragments
    - remove released fragments
    - bump the package version
Update the version in `package.json` 
3. Run `npm run changelog:release -- <version> <date>` from `packages/assets`, or omit arguments to use the version from `package.json` and today’s date.
4. In the GitHub UI, create a release tag in the format `assets-v*`, e.g. `assets-v1.0.1`, on the release commit.
5. Create the GitHub Release for that tag and copy the latest compiled changelog notes from `CHANGELOG.md` into the release notes.
6. Creating the tag in GitHub triggers the npm publish workflow.

Release channels:
- Stable releases use normal semver versions such as `1.0.1` and tags such as `assets-v1.0.1`. These publish to npm on the default `latest` dist-tag.
- Prereleases use semver prerelease versions such as `1.1.0-beta.1` and tags such as `assets-v1.1.0-beta.1`. These publish to npm on the `beta` dist-tag.

Recommended branch and tag strategy:
- Use `main` as the only long-lived release branch.
- Merge feature work into `main` through pull requests with required checks.
- Create release tags in the GitHub UI only from commits already merged to `main`.
- Keep package-specific tag prefixes if more packages are added later, for example `assets-v*`, `tokens-v*`, and `components-v*`.


## Sources

- Icon source library: [Phosphor Icons](https://phosphoricons.com/)
- Icon design library: [Massachusetts Design System Figma Icon Library](https://www.figma.com/design/ZpxjY5M188i4ItGIvW9Y0s/Icons?t=9d9doUJlYvsBBWr2-0)
