# Massachusetts Design System Icon Library

A comprehensive icon library for the Massachusetts Design System, featuring SVG icons optimized for web development.

## Overview

Most icons come from the open source [Phosphor icon library](https://phosphoricons.com/), with custom icons designed in Phosphor's style to fill any gaps. Each icon component has variants built in for `regular` and `bold` styles. 

**Style Guidelines**: We recommend using bold style icons for instances of 24px and below, and regular style icons for instances over 24px.
>**We recommend using the icon components from this library in your designs as much as possible.** However, you can also use [Phosphor's Figma plugin](https://www.figma.com/community/plugin/898620911119764089) to pull any icons that haven't been published in this library yet.

### Icon Sources

- **Design System**: Icons are programmatically exported from our [Figma Icon Library](https://www.figma.com/design/ZpxjY5M188i4ItGIvW9Y0s/Icons?t=9d9doUJlYvsBBWr2-0)
- **Base Library**: [Phosphor Icons](https://phosphoricons.com/) (open source)
- **Custom Icons**: Designed in Phosphor's style for Massachusetts-specific needs
- **Optimization**: All icons are formatted and optimized for development use

## Usage

```bash
npm install @massds/icons
```

### Package Structure
Icons are named in kebab-case. Each icon has a corresponding bold variant in the `bold/` directory,appended with `--bold` in the filename.
```
images/
├── alert.svg
├── arrow.svg
├── ...
└── bold/
    ├── alert--bold.svg
    ├── arrow--bold.svg
    └── ...
```

File Naming Convention
- Regular icons: icon-name.svg (kebab-case)
- Bold icons: icon-name--bold.svg (kebab-case with --bold suffix)
- React components: IconName (PascalCase with Icon prefix)

### Browse the Full Library

View all available icons in our [Storybook documentation](https://mayflower.digital.mass.gov/core/index.html?path=/docs/foundation-iconography--icons).


## Development

```bash
# Install dependencies
npm install

# Build icons package
npm build:icons

# Update all dependent packages
npm icons
```

### Adding New Icons

1. Place the SVGs into static/icons (make sure that the bold version is added to static/icons/bold simutanously)
2. Run `rushx build`, to optimize and prep svgs in place

## Contributing
1. Add or modify icons in the Figma Icon Library
2. Export SVGs following the naming convention
3. Run the build and integration steps above
4. Test across all dependent packages
5. Submit a pull request