# Massachusetts Design System Assets

Shared static assets for the Massachusetts Design System. This package publishes optimized icons, state seal files, and animation assets as plain files that can be consumed by applications, design system packages, or build pipelines.

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

## Installation

```bash
npm install @massds/assets
```

## Asset Types

### Icons

Most icons come from the open source [Phosphor icon library](https://phosphoricons.com/), with additional Massachusetts-specific icons designed in a compatible style.

- Regular icons live in `dist/icons`
- Bold icons live in `dist/icons/bold`
- Filenames use kebab-case
- Bold variants use the `--bold` suffix

Examples:

```text
dist/icons/alert.svg
dist/icons/bold/alert--bold.svg
```

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

Install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```

The build script:

- optimizes SVG files in `src/icons/static` in place using `svgo`
- copies icons to `dist/icons`
- copies animation assets to `dist/animation`
- copies state seal assets to `dist/state-seal`

Clean the output directory:

```bash
npm run clean
```

## Updating Assets

### Adding or Updating Icons

1. Add SVG files to `src/icons/static` and its bold variants to `src/icons/static/bold`
2. Run `npm run build`

### Updating State Seal Assets

1. Replace or add files in `src/state-seal`
2. Run `npm run build`

### Updating Animation Assets

1. Replace or add files in `src/animation`
2. Run `npm run build`

## Sources

- Icon source library: [Phosphor Icons](https://phosphoricons.com/)
- Icon design library: [Massachusetts Design System Figma Icon Library](https://www.figma.com/design/ZpxjY5M188i4ItGIvW9Y0s/Icons?t=9d9doUJlYvsBBWr2-0)
